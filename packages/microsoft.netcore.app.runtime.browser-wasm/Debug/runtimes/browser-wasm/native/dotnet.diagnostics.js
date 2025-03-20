//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let _diagnosticModuleLoaded = false; // please keep it in place also as rollup guard
let diagnosticHelpers = null;
let runtimeHelpers = null;
let loaderHelpers = null;
let Module = null;
function setRuntimeGlobalsImpl(globalObjects) {
    if (_diagnosticModuleLoaded) {
        throw new Error("Diag module already loaded");
    }
    _diagnosticModuleLoaded = true;
    diagnosticHelpers = globalObjects.diagnosticHelpers;
    runtimeHelpers = globalObjects.runtimeHelpers;
    loaderHelpers = globalObjects.loaderHelpers;
    Module = globalObjects.module;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const advert1 = [65, 68, 86, 82, 95];
// TODO make GUID and process id dynamic
const advert1Full = [65, 68, 86, 82, 95, 86, 49, 0, 66, 108, 106, 181, 91, 0, 142, 79, 182, 145, 225, 120, 77, 12, 131, 229, 42, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const dotnet_IPC_V1 = [68, 79, 84, 78, 69, 84, 95, 73, 80, 67, 95, 86, 49, 0];
// this file contains the IPC commands that are sent by client (like dotnet-trace) to the diagnostic server (like Mono VM in the browser)
// just formatting bytes, no sessions management here
function commandStopTracing(sessionID) {
    return Uint8Array.from([
        ...serializeHeader(2 /* CommandSetId.EventPipe */, 1 /* EventPipeCommandId.StopTracing */, computeMessageByteLength(8)),
        ...serializeUint64(sessionID),
    ]);
}
function commandResumeRuntime() {
    return Uint8Array.from([
        ...serializeHeader(4 /* CommandSetId.Process */, 1 /* ProcessCommandId.ResumeRuntime */, computeMessageByteLength(0)),
    ]);
}
function commandProcessInfo3() {
    return Uint8Array.from([
        ...serializeHeader(4 /* CommandSetId.Process */, 8 /* ProcessCommandId.ProcessInfo3 */, computeMessageByteLength(0)),
    ]);
}
function commandGcHeapDump() {
    return commandCollectTracing2({
        circularBufferMB: 256,
        format: 1,
        requestRundown: true,
        providers: [
            {
                keywords: [
                    0,
                    26738689 /* Keywords.GCHeapSnapshot */, // 0x1980001
                    // GC_HEAP_DUMP_VTABLE_CLASS_REF_KEYWORD 0x8000000
                    // GC_FINALIZATION_KEYWORD               0x1000000
                    // GC_HEAP_COLLECT_KEYWORD               0x0800000
                    // GC_KEYWORD                            0x0000001
                ],
                logLevel: 5,
                provider_name: "Microsoft-Windows-DotNETRuntime",
                arguments: null
            }
        ]
    });
}
function commandCounters(intervalSec, providers) {
    const customProviders = providers ? providers.map(provider_name => ({
        provider_name,
        keywords: [0, 0 /* Keywords.None */],
        logLevel: 4,
        arguments: `EventCounterIntervalSec=${intervalSec}`
    })) : [];
    return commandCollectTracing2({
        circularBufferMB: 256,
        format: 1,
        requestRundown: false,
        providers: [
            {
                keywords: [0, 2 /* Keywords.GCHandle */],
                logLevel: 4,
                provider_name: "System.Diagnostics.Metrics",
                arguments: `SessionId=SHARED;Metrics=System.Runtime;RefreshInterval=${intervalSec};MaxTimeSeries=1000;MaxHistograms=10;ClientId=c98f989b-369c-41af-bc8e-7ab261fba16c`
            },
            ...customProviders,
        ]
    });
}
function commandSampleProfiler() {
    return commandCollectTracing2({
        circularBufferMB: 256,
        format: 1,
        requestRundown: true,
        providers: [
            {
                keywords: [
                    0,
                    0,
                ],
                logLevel: 4,
                provider_name: "Microsoft-DotNETCore-SampleProfiler",
                arguments: null
            }
        ]
    });
}
function commandCollectTracing2(payload2) {
    const payloadLength = computeCollectTracing2PayloadByteLength(payload2);
    const messageLength = computeMessageByteLength(payloadLength);
    const message = [
        ...serializeHeader(2 /* CommandSetId.EventPipe */, 3 /* EventPipeCommandId.CollectTracing2 */, messageLength),
        ...serializeUint32(payload2.circularBufferMB),
        ...serializeUint32(payload2.format),
        ...serializeUint8(payload2.requestRundown ? 1 : 0),
        ...serializeUint32(payload2.providers.length),
    ];
    for (const provider of payload2.providers) {
        message.push(...serializeUint64(provider.keywords));
        message.push(...serializeUint32(provider.logLevel));
        message.push(...serializeString(provider.provider_name));
        message.push(...serializeString(provider.arguments));
    }
    return Uint8Array.from(message);
}
function serializeMagic() {
    return Uint8Array.from(dotnet_IPC_V1);
}
function serializeUint8(value) {
    return Uint8Array.from([value]);
}
function serializeUint16(value) {
    return new Uint8Array(Uint16Array.from([value]).buffer);
}
function serializeUint32(value) {
    return new Uint8Array(Uint32Array.from([value]).buffer);
}
function serializeUint64(value) {
    // value == [hi, lo]
    return new Uint8Array(Uint32Array.from([value[1], value[0]]).buffer);
}
function serializeString(value) {
    const message = [];
    if (value === null || value === undefined || value === "") {
        message.push(...serializeUint32(1));
        message.push(...serializeUint16(0));
    }
    else {
        const len = value.length;
        const hasNul = value[len - 1] === "\0";
        message.push(...serializeUint32(len + (hasNul ? 0 : 1)));
        for (let i = 0; i < len; i++) {
            message.push(...serializeUint16(value.charCodeAt(i)));
        }
        if (!hasNul) {
            message.push(...serializeUint16(0));
        }
    }
    return message;
}
function computeStringByteLength(s) {
    if (s === undefined || s === null || s === "")
        return 4 + 2; // just length of empty zero terminated string
    return 4 + 2 * s.length + 2; // length + UTF16 + null
}
function computeMessageByteLength(payloadLength) {
    const fullHeaderSize = 14 + 2 // magic, len
        + 1 + 1 // commandSet, command
        + 2; // reserved ;
    return fullHeaderSize + payloadLength;
}
function serializeHeader(commandSet, command, len) {
    return Uint8Array.from([
        ...serializeMagic(),
        ...serializeUint16(len),
        ...serializeUint8(commandSet),
        ...serializeUint8(command),
        ...serializeUint16(0), // reserved*/
    ]);
}
function computeCollectTracing2PayloadByteLength(payload2) {
    let len = 0;
    len += 4; // circularBufferMB
    len += 4; // format
    len += 1; // requestRundown
    len += 4; // providers length
    for (const provider of payload2.providers) {
        len += 8; // keywords
        len += 4; // level
        len += computeStringByteLength(provider.provider_name);
        len += computeStringByteLength(provider.arguments);
    }
    return len;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/* eslint-disable no-console */
const prefix = "MONO_WASM: ";
function mono_log_debug(messageFactory) {
    if (loaderHelpers.diagnosticTracing) {
        const message = (typeof messageFactory === "function"
            ? messageFactory()
            : messageFactory);
        console.debug(prefix + message);
    }
}
function mono_log_info(msg, ...data) {
    console.info(prefix + msg, ...data);
}
function mono_log_warn(msg, ...data) {
    console.warn(prefix + msg, ...data);
}
function mono_log_error(msg, ...data) {
    if (data && data.length > 0 && data[0] && typeof data[0] === "object") {
        // don't log silent errors
        if (data[0].silent) {
            return;
        }
        if (data[0].toString) {
            console.error(prefix + msg, data[0].toString());
            return;
        }
    }
    console.error(prefix + msg, ...data);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let lastScheduledTimeoutId = undefined;
// run another cycle of the event loop, which is EP threads on MT runtime
function diagnostic_server_loop() {
    lastScheduledTimeoutId = undefined;
    if (loaderHelpers.is_runtime_running()) {
        try {
            runtimeHelpers.mono_background_exec(); // give GC chance to run
            runtimeHelpers.mono_wasm_ds_exec();
            schedule_diagnostic_server_loop(100);
        }
        catch (ex) {
            loaderHelpers.mono_exit(1, ex);
        }
    }
}
function schedule_diagnostic_server_loop(delay = 0) {
    if (!lastScheduledTimeoutId) {
        lastScheduledTimeoutId = Module.safeSetTimeout(diagnostic_server_loop, delay);
    }
}
class DiagConnectionBase {
    constructor(client_socket) {
        this.client_socket = client_socket;
        this.messagesToSend = [];
        this.messagesReceived = [];
    }
    store(message) {
        this.messagesToSend.push(message);
        return message.byteLength;
    }
    poll() {
        return this.messagesReceived.length;
    }
    recv(buffer, bytes_to_read) {
        if (this.messagesReceived.length === 0) {
            return 0;
        }
        const message = this.messagesReceived[0];
        const bytes_read = Math.min(message.length, bytes_to_read);
        Module.HEAPU8.set(message.subarray(0, bytes_read), buffer);
        if (bytes_read === message.length) {
            this.messagesReceived.shift();
        }
        else {
            this.messagesReceived[0] = message.subarray(bytes_read);
        }
        return bytes_read;
    }
}
function downloadBlob(messages) {
    const blob = new Blob(messages, { type: "application/octet-stream" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "trace." + (new Date()).valueOf() + ".nettrace";
    mono_log_info(`Downloading trace ${link.download} - ${blob.size}  bytes`);
    link.href = blobUrl;
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent("click", {
        bubbles: true, cancelable: true, view: window
    }));
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mono_wasm_instrument_method(method) {
    if (!is_instrument_method_enabled()) {
        return 0;
    }
    // TODO filter by method name, namespace, etc.
    return 1;
}
function is_instrument_method_enabled() {
    const environmentVariables = runtimeHelpers.config.environmentVariables || {};
    const value = environmentVariables["DOTNET_WasmPerfInstrumentation"];
    return value == "1" || value == "true";
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function collectCpuSamples(durationMs, skipDownload) {
    if (!serverSession) {
        throw new Error("No active JS diagnostic session");
    }
    if (!is_instrument_method_enabled()) {
        throw new Error("method instrumentation is not enabled, please set DOTNET_WasmPerfInstrumentation=\"1\" before runtime startup to enable it");
    }
    const onClosePromise = loaderHelpers.createPromiseController();
    function onSessionStart(session) {
        // stop tracing after period of monitoring
        Module.safeSetTimeout(() => {
            session.sendCommand(commandStopTracing(session.session_id));
        }, durationMs);
    }
    setup_js_client({
        onClosePromise: onClosePromise.promise_control,
        skipDownload,
        commandOnAdvertise: commandSampleProfiler,
        onSessionStart,
    });
    return onClosePromise.promise;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function collectPerfCounters(durationMs, providers, intervalSec, skipDownload) {
    if (!serverSession) {
        throw new Error("No active JS diagnostic session");
    }
    const onClosePromise = loaderHelpers.createPromiseController();
    function onSessionStart(session) {
        // stop tracing after period of monitoring
        Module.safeSetTimeout(() => {
            session.sendCommand(commandStopTracing(session.session_id));
        }, durationMs);
    }
    setup_js_client({
        onClosePromise: onClosePromise.promise_control,
        skipDownload,
        commandOnAdvertise: () => commandCounters(intervalSec || 1, providers),
        onSessionStart,
    });
    return onClosePromise.promise;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function collectGcDump(skipDownload) {
    if (!serverSession) {
        throw new Error("No active JS diagnostic session");
    }
    const onClosePromise = loaderHelpers.createPromiseController();
    let stopDelayedAfterLastMessage = 0;
    let stopSent = false;
    function onDataWrap(session, message) {
        session.store(message);
        if (!stopSent) {
            // stop 500ms after last GC message on this session, there will be more messages after that
            if (stopDelayedAfterLastMessage) {
                clearTimeout(stopDelayedAfterLastMessage);
            }
            stopDelayedAfterLastMessage = Module.safeSetTimeout(() => {
                stopSent = true;
                session.sendCommand(commandStopTracing(session.session_id));
            }, 500);
        }
    }
    setup_js_client({
        onClosePromise: onClosePromise.promise_control,
        skipDownload,
        commandOnAdvertise: commandGcHeapDump,
        onData: onDataWrap,
    });
    return onClosePromise.promise;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
//let diagClient:IDiagClient|undefined = undefined as any;
//let server:DiagServer = undefined as any;
// configure your application
// .withEnvironmentVariable("DOTNET_DiagnosticPorts", "download:gcdump")
// or implement function globalThis.dotnetDiagnosticClient with IDiagClient interface
let nextJsClient;
let fromScenarioNameOnce = false;
// Only the last which sent advert is receiving commands for all sessions
let serverSession = undefined;
// singleton wrapping the protocol with the diagnostic server in the Mono VM
// there could be multiple connection at the same time.
// DS:advert         ->1
//                     1<- DC1: command to start tracing session
// DS:OK, session ID ->1
// DS:advert         ->2
// DS:events         ->1
// DS:events         ->1
// DS:events         ->1
// DS:events         ->1
//                     2<- DC1: command to stop tracing session
// DS:close          ->1
class DiagSession extends DiagConnectionBase {
    constructor(client_socket) {
        super(client_socket);
        this.client_socket = client_socket;
        this.session_id = undefined;
        this.stopDelayedAfterLastMessage = undefined;
        this.resumedRuntime = false;
    }
    sendCommand(message) {
        if (!serverSession) {
            mono_log_warn("no server yet");
            return;
        }
        serverSession.respond(message);
    }
    async connect_new_client() {
        this.diagClient = await nextJsClient.promise;
        cleanup_client();
        const firstCommand = this.diagClient.commandOnAdvertise();
        this.respond(firstCommand);
    }
    // this is message from the diagnostic server, which is Mono VM in this browser
    send(message) {
        var _a, _b, _c;
        schedule_diagnostic_server_loop();
        if (advert1.every((v, i) => v === message[i])) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            serverSession = this;
            this.connect_new_client();
        }
        else if (dotnet_IPC_V1.every((v, i) => v === message[i]) && message[16] == 255 /* CommandSetId.Server */) {
            if (message[17] == 0 /* ServerCommandId.OK */) {
                if (message.byteLength === 28) {
                    const view = message.subarray(20, 28);
                    const sessionIDLo = view[0] | (view[1] << 8) | (view[2] << 16) | (view[3] << 24);
                    const sessionIDHi = view[4] | (view[5] << 8) | (view[6] << 16) | (view[7] << 24);
                    const sessionId = [sessionIDHi, sessionIDLo];
                    this.session_id = sessionId;
                    if ((_a = this.diagClient) === null || _a === void 0 ? void 0 : _a.onSessionStart) {
                        this.diagClient.onSessionStart(this);
                    }
                }
            }
            else {
                if ((_b = this.diagClient) === null || _b === void 0 ? void 0 : _b.onError) {
                    this.diagClient.onError(this, message);
                }
                else {
                    mono_log_warn("Diagnostic session " + this.session_id + " error : " + message.toString());
                }
            }
        }
        else {
            if ((_c = this.diagClient) === null || _c === void 0 ? void 0 : _c.onData)
                this.diagClient.onData(this, message);
            else {
                this.store(message);
            }
        }
        return message.length;
    }
    // this is message to the diagnostic server, which is Mono VM in this browser
    respond(message) {
        this.messagesReceived.push(message);
        schedule_diagnostic_server_loop();
    }
    close() {
        var _a;
        if ((_a = this.diagClient) === null || _a === void 0 ? void 0 : _a.onClose) {
            this.diagClient.onClose(this.messagesToSend);
        }
        if (this.messagesToSend.length === 0) {
            return 0;
        }
        if (this.diagClient && !this.diagClient.skipDownload) {
            downloadBlob(this.messagesToSend);
        }
        this.messagesToSend = [];
        return 0;
    }
}
function cleanup_client() {
    nextJsClient = loaderHelpers.createPromiseController();
}
function setup_js_client(client) {
    nextJsClient.promise_control.resolve(client);
}
function createDiagConnectionJs(socket_handle, scenarioName) {
    if (!fromScenarioNameOnce) {
        fromScenarioNameOnce = true;
        if (scenarioName.startsWith("js://gcdump")) {
            collectGcDump(false);
        }
        if (scenarioName.startsWith("js://counters")) {
            collectPerfCounters(5 * 60 * 1000); // 5 minutes
        }
        if (scenarioName.startsWith("js://cpu-samples")) {
            collectCpuSamples(5 * 60 * 1000); // 5 minutes
        }
        const dotnetDiagnosticClient = globalThis.dotnetDiagnosticClient;
        if (typeof dotnetDiagnosticClient === "function") {
            nextJsClient.promise_control.resolve(dotnetDiagnosticClient(scenarioName));
        }
    }
    return new DiagSession(socket_handle);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function createDiagConnectionWs(socket_handle, url) {
    return new DiagConnectionWS(socket_handle, url);
}
// this is used together with `dotnet-dsrouter` which will create IPC pipe on your local machine
// 1. run `dotnet-dsrouter server-websocket` this will print process ID and websocket URL
// 2. configure your wasm dotnet application `.withEnvironmentVariable("DOTNET_DiagnosticPorts", "ws://127.0.0.1:8088/diagnostics")`
// 3. run your wasm application
// 4. run `dotnet-gcdump -p <process ID>` or `dotnet-trace collect -p <process ID>`
class DiagConnectionWS extends DiagConnectionBase {
    constructor(client_socket, url) {
        super(client_socket);
        const ws = this.ws = new WebSocket(url);
        const onMessage = async (evt) => {
            const buffer = await evt.data.arrayBuffer();
            const data = new Uint8Array(buffer);
            this.messagesReceived.push(data);
            diagnostic_server_loop();
        };
        ws.addEventListener("open", () => {
            for (const data of this.messagesToSend) {
                ws.send(data);
            }
            this.messagesToSend = [];
            diagnostic_server_loop();
        }, { once: true });
        ws.addEventListener("message", onMessage);
        ws.addEventListener("error", () => {
            ws.removeEventListener("message", onMessage);
        }, { once: true });
    }
    send(message) {
        schedule_diagnostic_server_loop();
        // copy the message
        if (this.ws.readyState == WebSocket.CONNECTING) {
            return super.store(message);
        }
        this.ws.send(message);
        return message.length;
    }
    close() {
        schedule_diagnostic_server_loop();
        this.ws.close();
        return 0;
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let socket_handles = undefined;
let next_socket_handle = 1;
let url_override = undefined;
function setRuntimeGlobals(globalObjects) {
    setRuntimeGlobalsImpl(globalObjects);
    diagnosticHelpers.ds_rt_websocket_create = (urlPtr) => {
        if (!socket_handles) {
            socket_handles = new Map();
        }
        const url = url_override !== null && url_override !== void 0 ? url_override : runtimeHelpers.utf8ToString(urlPtr);
        const socket_handle = next_socket_handle++;
        const isWebSocket = url.startsWith("ws://") || url.startsWith("wss://");
        const wrapper = isWebSocket
            ? createDiagConnectionWs(socket_handle, url)
            : createDiagConnectionJs(socket_handle, url);
        socket_handles.set(socket_handle, wrapper);
        return socket_handle;
    };
    diagnosticHelpers.ds_rt_websocket_send = (client_socket, buffer, bytes_to_write) => {
        const wrapper = socket_handles.get(client_socket);
        if (!wrapper) {
            return -1;
        }
        const message = (new Uint8Array(Module.HEAPU8.buffer, buffer, bytes_to_write)).slice();
        return wrapper.send(message);
    };
    diagnosticHelpers.ds_rt_websocket_poll = (client_socket) => {
        const wrapper = socket_handles.get(client_socket);
        if (!wrapper) {
            return 0;
        }
        return wrapper.poll();
    };
    diagnosticHelpers.ds_rt_websocket_recv = (client_socket, buffer, bytes_to_read) => {
        const wrapper = socket_handles.get(client_socket);
        if (!wrapper) {
            return -1;
        }
        return wrapper.recv(buffer, bytes_to_read);
    };
    diagnosticHelpers.ds_rt_websocket_close = (client_socket) => {
        const wrapper = socket_handles.get(client_socket);
        if (!wrapper) {
            return -1;
        }
        socket_handles.delete(client_socket);
        return wrapper.close();
    };
    globalObjects.api.collectCpuSamples = collectCpuSamples;
    globalObjects.api.collectPerfCounters = collectPerfCounters;
    globalObjects.api.collectGcDump = collectGcDump;
    globalObjects.api.connectDSRouter = connectDSRouter;
    runtimeHelpers.mono_wasm_instrument_method = mono_wasm_instrument_method;
    cleanup_client();
}
// this will take over the existing connection to JS and send new advert message to WS client
// use dotnet-dsrouter server-websocket -v trace
function connectDSRouter(url) {
    if (!serverSession) {
        throw new Error("No active session to reconnect");
    }
    // make sure new sessions hit the new URL
    url_override = url;
    const wrapper = createDiagConnectionWs(serverSession.client_socket, url);
    socket_handles.set(serverSession.client_socket, wrapper);
    wrapper.send(new Uint8Array(advert1Full));
}

export { setRuntimeGlobals };
//# sourceMappingURL=dotnet.diagnostics.js.map
