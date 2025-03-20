//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.

var WasmEnableThreads = false;

const bigInt=()=>(async e=>{try{return (await WebAssembly.instantiate(e)).instance.exports.b(BigInt(0))===BigInt(0)}catch(e){return !1}})(new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,1,126,1,126,3,2,1,0,7,5,1,1,98,0,0,10,6,1,4,0,32,0,11])),bulkMemory=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,3,1,0,1,10,14,1,12,0,65,0,65,0,65,0,252,10,0,0,11])),exceptions=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,6,64,25,11,11])),extendedConst=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,5,3,1,0,1,11,9,1,0,65,1,65,2,106,11,0])),gc=()=>(async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,95,1,120,0])))(),jspi=()=>(async()=>"Suspender"in WebAssembly)(),memory64=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,5,3,1,4,1])),multiMemory=()=>(async()=>{try{return new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,5,5,2,0,0,0,0])),!0}catch(e){return !1}})(),multiValue=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,0,2,127,127,3,2,1,0,10,8,1,6,0,65,0,65,0,11])),mutableGlobals=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,2,8,1,1,97,1,98,3,127,1,6,6,1,127,1,65,0,11,7,5,1,1,97,3,1])),referenceTypes=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,7,1,5,0,208,112,26,11])),relaxedSimd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,15,1,13,0,65,1,253,15,65,2,253,15,253,128,2,11])),saturatedFloatToInt=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,12,1,10,0,67,0,0,0,0,252,0,26,11])),signExtensions=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,65,0,192,26,11])),simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11])),streamingCompilation=()=>(async()=>"compileStreaming"in WebAssembly)(),tailCall=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,6,1,4,0,18,0,11])),threads=()=>(async e=>{try{return "undefined"!=typeof MessageChannel&&(new MessageChannel).port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(e)}catch(e){return !1}})(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11])),typeReflection=()=>(async()=>"Function"in WebAssembly)();

var gitHash = "cbd1569a3d4c5c2412cdc8e1510ef90c297e2bf5";

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/// a unique symbol used to mark a promise as controllable
const promise_control_symbol = Symbol.for("wasm promise_control");
/// Creates a new promise together with a controller that can be used to resolve or reject that promise.
/// Optionally takes callbacks to be called immediately after a promise is resolved or rejected.
function createPromiseController(afterResolve, afterReject) {
    let promise_control = null;
    const promise = new Promise(function (resolve, reject) {
        promise_control = {
            isDone: false,
            promise: null,
            resolve: (data) => {
                if (!promise_control.isDone) {
                    promise_control.isDone = true;
                    resolve(data);
                    if (afterResolve) {
                        afterResolve();
                    }
                }
            },
            reject: (reason) => {
                if (!promise_control.isDone) {
                    promise_control.isDone = true;
                    reject(reason);
                    if (afterReject) {
                        afterReject();
                    }
                }
            }
        };
    });
    promise_control.promise = promise;
    const controllablePromise = promise;
    controllablePromise[promise_control_symbol] = promise_control;
    return { promise: controllablePromise, promise_control: promise_control };
}
function getPromiseController(promise) {
    return promise[promise_control_symbol];
}
function isControllablePromise(promise) {
    return promise[promise_control_symbol] !== undefined;
}
function assertIsControllablePromise(promise) {
    if (!(promise && isControllablePromise(promise))) mono_assert(false, "Promise is not controllable"); // inlined mono_assert condition
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const MonoMethodNull = 0;
const MonoObjectNull = 0;
const MonoArrayNull = 0;
const MonoAssemblyNull = 0;
const MonoClassNull = 0;
const MonoTypeNull = 0;
const MonoStringNull = 0;
const MonoObjectRefNull = 0;
const MonoStringRefNull = 0;
const JSHandleDisposed = -1;
const JSHandleNull = 0;
const GCHandleNull = 0;
const GCHandleInvalid = -1;
const VoidPtrNull = 0;
const CharPtrNull = 0;
const NativePointerNull = 0;
const PThreadPtrNull = 0;
function coerceNull(ptr) {
    if ((ptr === null) || (ptr === undefined))
        return 0;
    else
        return ptr;
}
// Evaluates whether a value is nullish (same definition used as the ?? operator,
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
function is_nullish(value) {
    return (value === undefined) || (value === null);
}
/// Always throws. Used to handle unreachable switch branches when TypeScript refines the type of a variable
/// to 'never' after you handle all the cases it knows about.
function assertNever(x) {
    throw new Error("Unexpected value: " + x);
}
/// returns true if the given value is not Thenable
///
/// Useful if some function returns a value or a promise of a value.
function notThenable(x) {
    return typeof x !== "object" || typeof (x.then) !== "function";
}
/// a symbol that we use as a key on messages on the global worker-to-main channel to identify our own messages
/// we can't use an actual JS Symbol because those don't transfer between workers.
const monoMessageSymbol = "__mono_message__";

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/* eslint-disable no-console */
const methods = ["debug", "log", "trace", "warn", "info", "error"];
const prefix = "MONO_WASM: ";
let consoleWebSocket;
let theConsoleApi;
let originalConsoleMethods;
let threadNamePrefix;
function set_thread_prefix(threadPrefix) {
    threadNamePrefix = threadPrefix;
}
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
function mono_log_info_no_prefix(msg, ...data) {
    console.info(msg, ...data);
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
let tick = "";
let last = new Date().valueOf();
function proxyConsoleMethod(prefix, func, asJson) {
    return function (...args) {
        try {
            let payload = args[0];
            if (payload === undefined)
                payload = "undefined";
            else if (payload === null)
                payload = "null";
            else if (typeof payload === "function")
                payload = payload.toString();
            else if (typeof payload !== "string") {
                try {
                    payload = JSON.stringify(payload);
                }
                catch (e) {
                    payload = payload.toString();
                }
            }
            if (typeof payload === "string") {
                if (WasmEnableThreads) {
                    if (ENVIRONMENT_IS_WORKER && payload.indexOf("keeping the worker alive for asynchronous operation") !== -1) {
                        // muting emscripten noise
                        return;
                    }
                    if (payload.indexOf("MONO_WASM: ") === 0 || payload.indexOf("[MONO]") === 0) {
                        const now = new Date();
                        if (last !== now.valueOf()) {
                            tick = now.toISOString().substring(11, 23);
                            last = now.valueOf();
                        }
                        payload = `[${threadNamePrefix} ${tick}] ${payload}`;
                    }
                }
            }
            if (asJson) {
                func(JSON.stringify({
                    method: prefix,
                    payload: payload,
                    arguments: args.slice(1)
                }));
            }
            else {
                func([prefix + payload, ...args.slice(1)]);
            }
        }
        catch (err) {
            originalConsoleMethods.error(`proxyConsole failed: ${err}`);
        }
    };
}
function setup_proxy_console(id, console, origin) {
    theConsoleApi = console;
    threadNamePrefix = id;
    originalConsoleMethods = {
        ...console
    };
    const consoleUrl = `${origin}/console`.replace("https://", "wss://").replace("http://", "ws://");
    consoleWebSocket = new WebSocket(consoleUrl);
    consoleWebSocket.addEventListener("error", logWSError);
    consoleWebSocket.addEventListener("close", logWSClose);
    setupWS();
}
function teardown_proxy_console(message) {
    let counter = 30;
    const stop_when_ws_buffer_empty = () => {
        if (!consoleWebSocket) {
            if (message && originalConsoleMethods) {
                originalConsoleMethods.log(message);
            }
        }
        else if (consoleWebSocket.bufferedAmount == 0 || counter == 0) {
            if (message) {
                // tell xharness WasmTestMessagesProcessor we are done.
                // note this sends last few bytes into the same WS
                mono_log_info_no_prefix(message);
            }
            setupOriginal();
            consoleWebSocket.removeEventListener("error", logWSError);
            consoleWebSocket.removeEventListener("close", logWSClose);
            consoleWebSocket.close(1000, message);
            consoleWebSocket = undefined;
        }
        else {
            counter--;
            globalThis.setTimeout(stop_when_ws_buffer_empty, 100);
        }
    };
    stop_when_ws_buffer_empty();
}
function send(msg) {
    if (consoleWebSocket && consoleWebSocket.readyState === WebSocket.OPEN) {
        consoleWebSocket.send(msg);
    }
    else {
        originalConsoleMethods.log(msg);
    }
}
function logWSError(event) {
    originalConsoleMethods.error(`[${threadNamePrefix}] proxy console websocket error: ${event}`, event);
}
function logWSClose(event) {
    originalConsoleMethods.debug(`[${threadNamePrefix}] proxy console websocket closed: ${event}`, event);
}
function setupWS() {
    for (const m of methods) {
        theConsoleApi[m] = proxyConsoleMethod(`console.${m}`, send, true);
    }
}
function setupOriginal() {
    for (const m of methods) {
        theConsoleApi[m] = proxyConsoleMethod(`console.${m}`, originalConsoleMethods.log, false);
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const usedCacheKeys = {};
const networkLoads = {};
const cacheLoads = {};
let cacheIfUsed;
function logDownloadStatsToConsole() {
    const cacheLoadsEntries = Object.values(cacheLoads);
    const networkLoadsEntries = Object.values(networkLoads);
    const cacheResponseBytes = countTotalBytes(cacheLoadsEntries);
    const networkResponseBytes = countTotalBytes(networkLoadsEntries);
    const totalResponseBytes = cacheResponseBytes + networkResponseBytes;
    if (totalResponseBytes === 0) {
        // We have no perf stats to display, likely because caching is not in use.
        return;
    }
    const useStyle = ENVIRONMENT_IS_WEB ? "%c" : "";
    const style = ENVIRONMENT_IS_WEB ? ["background: purple; color: white; padding: 1px 3px; border-radius: 3px;",
        "font-weight: bold;",
        "font-weight: normal;",
    ] : [];
    const linkerDisabledWarning = !loaderHelpers.config.linkerEnabled ? "\nThis application was built with linking (tree shaking) disabled. \nPublished applications will be significantly smaller if you install wasm-tools workload. \nSee also https://aka.ms/dotnet-wasm-features" : "";
    // eslint-disable-next-line no-console
    console.groupCollapsed(`${useStyle}dotnet${useStyle} Loaded ${toDataSizeString(totalResponseBytes)} resources${useStyle}${linkerDisabledWarning}`, ...style);
    if (cacheLoadsEntries.length) {
        // eslint-disable-next-line no-console
        console.groupCollapsed(`Loaded ${toDataSizeString(cacheResponseBytes)} resources from cache`);
        // eslint-disable-next-line no-console
        console.table(cacheLoads);
        // eslint-disable-next-line no-console
        console.groupEnd();
    }
    if (networkLoadsEntries.length) {
        // eslint-disable-next-line no-console
        console.groupCollapsed(`Loaded ${toDataSizeString(networkResponseBytes)} resources from network`);
        // eslint-disable-next-line no-console
        console.table(networkLoads);
        // eslint-disable-next-line no-console
        console.groupEnd();
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
}
async function purgeUnusedCacheEntriesAsync() {
    // We want to keep the cache small because, even though the browser will evict entries if it
    // gets too big, we don't want to be considered problematic by the end user viewing storage stats
    const cache = cacheIfUsed;
    if (cache) {
        const cachedRequests = await cache.keys();
        const deletionPromises = cachedRequests.map(async (cachedRequest) => {
            if (!(cachedRequest.url in usedCacheKeys)) {
                await cache.delete(cachedRequest);
            }
        });
        await Promise.all(deletionPromises);
    }
}
async function findCachedResponse(asset) {
    const cache = cacheIfUsed;
    if (!cache || asset.noCache || !asset.hash || asset.hash.length === 0) {
        return undefined;
    }
    const cacheKey = getCacheKey(asset);
    usedCacheKeys[cacheKey] = true;
    let cachedResponse;
    try {
        cachedResponse = await cache.match(cacheKey);
    }
    catch (_a) {
        // Be tolerant to errors reading from the cache. This is a guard for https://bugs.chromium.org/p/chromium/issues/detail?id=968444 where
        // chromium browsers may sometimes throw when working with the cache.
    }
    if (!cachedResponse) {
        return undefined;
    }
    // It's in the cache.
    const responseBytes = parseInt(cachedResponse.headers.get("content-length") || "0");
    cacheLoads[asset.name] = { responseBytes };
    return cachedResponse;
}
function addCachedReponse(asset, networkResponse) {
    const cache = cacheIfUsed;
    if (!cache || asset.noCache || !asset.hash || asset.hash.length === 0) {
        return;
    }
    const clonedResponse = networkResponse.clone();
    // postpone adding to cache until after we load the assembly, so that we could do the dotnet loading of the asset first
    setTimeout(() => {
        const cacheKey = getCacheKey(asset);
        addToCacheAsync(cache, asset.name, cacheKey, clonedResponse); // Don't await - add to cache in background
    }, 0);
}
function getCacheKey(asset) {
    return `${asset.resolvedUrl}.${asset.hash}`;
}
async function addToCacheAsync(cache, name, cacheKey, clonedResponse) {
    // We have to clone in order to put this in the cache *and* not prevent other code from
    // reading the original response stream.
    const responseData = await clonedResponse.arrayBuffer();
    // Now is an ideal moment to capture the performance stats for the request, since it
    // only just completed and is most likely to still be in the buffer. However this is
    // only done on a 'best effort' basis. Even if we do receive an entry, some of its
    // properties may be blanked out if it was a CORS request.
    const performanceEntry = getPerformanceEntry(clonedResponse.url);
    const responseBytes = (performanceEntry && performanceEntry.encodedBodySize) || undefined;
    networkLoads[name] = { responseBytes };
    // Add to cache as a custom response object so we can track extra data such as responseBytes
    // We can't rely on the server sending content-length (ASP.NET Core doesn't by default)
    const responseToCache = new Response(responseData, {
        headers: {
            "content-type": clonedResponse.headers.get("content-type") || "",
            "content-length": (responseBytes || clonedResponse.headers.get("content-length") || "").toString(),
        },
    });
    try {
        await cache.put(cacheKey, responseToCache);
    }
    catch (_a) {
        // Be tolerant to errors writing to the cache. This is a guard for https://bugs.chromium.org/p/chromium/issues/detail?id=968444 where
        // chromium browsers may sometimes throw when performing cache operations.
    }
}
async function initCacheToUseIfEnabled() {
    cacheIfUsed = await getCacheToUseIfEnabled(loaderHelpers.config);
}
async function getCacheToUseIfEnabled(config) {
    // caches will be undefined if we're running on an insecure origin (secure means https or localhost)
    if (!config.cacheBootResources || typeof globalThis.caches === "undefined" || typeof globalThis.document === "undefined") {
        return null;
    }
    // cache integrity is compromised if the first request has been served over http (except localhost)
    // in this case, we want to disable caching and integrity validation
    if (globalThis.isSecureContext === false) {
        return null;
    }
    // Define a separate cache for each base href, so we're isolated from any other
    // Blazor application running on the same origin. We need this so that we're free
    // to purge from the cache anything we're not using and don't let it keep growing,
    // since we don't want to be worst offenders for space usage.
    const relativeBaseHref = globalThis.document.baseURI.substring(globalThis.document.location.origin.length);
    const cacheName = `dotnet-resources-${relativeBaseHref}`;
    try {
        // There's a Chromium bug we need to be aware of here: the CacheStorage APIs say that when
        // caches.open(name) returns a promise that succeeds, the value is meant to be a Cache instance.
        // However, if the browser was launched with a --user-data-dir param that's "too long" in some sense,
        // then even through the promise resolves as success, the value given is `undefined`.
        // See https://stackoverflow.com/a/46626574 and https://bugs.chromium.org/p/chromium/issues/detail?id=1054541
        // If we see this happening, return "null" to mean "proceed without caching".
        return (await caches.open(cacheName)) || null;
    }
    catch (_a) {
        // There's no known scenario where we should get an exception here, but considering the
        // Chromium bug above, let's tolerate it and treat as "proceed without caching".
        return null;
    }
}
function countTotalBytes(loads) {
    return loads.reduce((prev, item) => prev + (item.responseBytes || 0), 0);
}
function toDataSizeString(byteCount) {
    return `${(byteCount / (1024 * 1024)).toFixed(2)} MB`;
}
function getPerformanceEntry(url) {
    if (typeof performance !== "undefined") {
        return performance.getEntriesByName(url)[0];
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function init_globalization() {
    loaderHelpers.preferredIcuAsset = getIcuResourceName(loaderHelpers.config);
    let invariantMode = loaderHelpers.config.globalizationMode == "invariant" /* GlobalizationMode.Invariant */;
    if (!invariantMode) {
        if (loaderHelpers.preferredIcuAsset) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug("ICU data archive(s) available, disabling invariant mode"); // inlined mono_log_debug condition
        }
        else if (loaderHelpers.config.globalizationMode !== "custom" /* GlobalizationMode.Custom */ && loaderHelpers.config.globalizationMode !== "all" /* GlobalizationMode.All */ && loaderHelpers.config.globalizationMode !== "sharded" /* GlobalizationMode.Sharded */) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug("ICU data archive(s) not available, using invariant globalization mode"); // inlined mono_log_debug condition
            invariantMode = true;
            loaderHelpers.preferredIcuAsset = null;
        }
        else {
            const msg = "invariant globalization mode is inactive and no ICU data archives are available";
            mono_log_error(`ERROR: ${msg}`);
            throw new Error(msg);
        }
    }
    const invariantEnv = "DOTNET_SYSTEM_GLOBALIZATION_INVARIANT";
    const env_variables = loaderHelpers.config.environmentVariables;
    if (env_variables[invariantEnv] === undefined && invariantMode) {
        env_variables[invariantEnv] = "1";
    }
    if (env_variables["TZ"] === undefined) {
        try {
            // this call is relatively expensive, so we call it during download of other assets
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
            if (timezone) {
                env_variables["TZ"] = timezone;
            }
        }
        catch (_a) {
            mono_log_info("failed to detect timezone, will fallback to UTC");
        }
    }
}
function getIcuResourceName(config) {
    var _a;
    if (((_a = config.resources) === null || _a === void 0 ? void 0 : _a.icu) && config.globalizationMode != "invariant" /* GlobalizationMode.Invariant */) {
        // TODO: when starting on sidecar, we should pass default culture from UI thread
        const culture = config.applicationCulture || (ENVIRONMENT_IS_WEB ? (globalThis.navigator && globalThis.navigator.languages && globalThis.navigator.languages[0]) : Intl.DateTimeFormat().resolvedOptions().locale);
        const icuFiles = Object.keys(config.resources.icu);
        const fileMapping = {};
        for (let index = 0; index < icuFiles.length; index++) {
            const icuFile = icuFiles[index];
            if (config.resources.fingerprinting) {
                fileMapping[getNonFingerprintedAssetName(icuFile)] = icuFile;
            }
            else {
                fileMapping[icuFile] = icuFile;
            }
        }
        let icuFile = null;
        if (config.globalizationMode === "custom" /* GlobalizationMode.Custom */) {
            // custom ICU file is saved in the resources with fingerprinting and does not require mapping
            if (icuFiles.length >= 1) {
                return icuFiles[0];
            }
        }
        else if (!culture || config.globalizationMode === "all" /* GlobalizationMode.All */) {
            icuFile = "icudt.dat";
        }
        else if (config.globalizationMode === "sharded" /* GlobalizationMode.Sharded */) {
            icuFile = getShardedIcuResourceName(culture);
        }
        if (icuFile && fileMapping[icuFile]) {
            return fileMapping[icuFile];
        }
    }
    config.globalizationMode = "invariant" /* GlobalizationMode.Invariant */;
    return null;
}
function getShardedIcuResourceName(culture) {
    const prefix = culture.split("-")[0];
    if (prefix === "en" || ["fr", "fr-FR", "it", "it-IT", "de", "de-DE", "es", "es-ES"].includes(culture)) {
        return "icudt_EFIGS.dat";
    }
    if (["zh", "ko", "ja"].includes(prefix)) {
        return "icudt_CJK.dat";
    }
    return "icudt_no_CJK.dat";
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let node_fs = undefined;
let node_url = undefined;
const URLPolyfill = class URL {
    constructor(url) {
        this.url = url;
    }
    toString() {
        return this.url;
    }
};
function verifyEnvironment() {
    if (!(ENVIRONMENT_IS_SHELL || typeof globalThis.URL === "function")) mono_assert(false, "This browser/engine doesn't support URL API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"); // inlined mono_assert condition
    if (!(typeof globalThis.BigInt64Array === "function")) mono_assert(false, "This browser/engine doesn't support BigInt64Array API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"); // inlined mono_assert condition
    if (WasmEnableThreads) {
        if (!(!ENVIRONMENT_IS_SHELL && !ENVIRONMENT_IS_NODE)) mono_assert(false, "This build of dotnet is multi-threaded, it doesn't support shell environments like V8 or NodeJS. See also https://aka.ms/dotnet-wasm-features"); // inlined mono_assert condition
        if (!(globalThis.SharedArrayBuffer !== undefined)) mono_assert(false, "SharedArrayBuffer is not enabled on this page. Please use a modern browser and set Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy http headers. See also https://aka.ms/dotnet-wasm-features"); // inlined mono_assert condition
        if (!(typeof globalThis.EventTarget === "function")) mono_assert(false, "This browser/engine doesn't support EventTarget API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"); // inlined mono_assert condition
    }
}
async function detect_features_and_polyfill(module) {
    if (ENVIRONMENT_IS_NODE) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        const process = await import(/*! webpackIgnore: true */ 'process');
        const minNodeVersion = 14;
        if (process.versions.node.split(".")[0] < minNodeVersion) {
            throw new Error(`NodeJS at '${process.execPath}' has too low version '${process.versions.node}', please use at least ${minNodeVersion}. See also https://aka.ms/dotnet-wasm-features`);
        }
    }
    const scriptUrlQuery = /*! webpackIgnore: true */ import.meta.url;
    const queryIndex = scriptUrlQuery.indexOf("?");
    if (queryIndex > 0) {
        loaderHelpers.modulesUniqueQuery = scriptUrlQuery.substring(queryIndex);
    }
    loaderHelpers.scriptUrl = normalizeFileUrl(scriptUrlQuery);
    loaderHelpers.scriptDirectory = normalizeDirectoryUrl(loaderHelpers.scriptUrl);
    loaderHelpers.locateFile = (path) => {
        if ("URL" in globalThis && globalThis.URL !== URLPolyfill) {
            return new URL(path, loaderHelpers.scriptDirectory).toString();
        }
        if (isPathAbsolute(path))
            return path;
        return loaderHelpers.scriptDirectory + path;
    };
    loaderHelpers.fetch_like = fetch_like;
    // eslint-disable-next-line no-console
    loaderHelpers.out = console.log;
    // eslint-disable-next-line no-console
    loaderHelpers.err = console.error;
    loaderHelpers.onDownloadResourceProgress = module.onDownloadResourceProgress;
    if (ENVIRONMENT_IS_WEB && globalThis.navigator) {
        const navigator = globalThis.navigator;
        const brands = navigator.userAgentData && navigator.userAgentData.brands;
        if (brands && brands.length > 0) {
            loaderHelpers.isChromium = brands.some((b) => b.brand === "Google Chrome" || b.brand === "Microsoft Edge" || b.brand === "Chromium");
        }
        else if (navigator.userAgent) {
            loaderHelpers.isChromium = navigator.userAgent.includes("Chrome");
            loaderHelpers.isFirefox = navigator.userAgent.includes("Firefox");
        }
    }
    if (ENVIRONMENT_IS_NODE) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        INTERNAL.require = await import(/*! webpackIgnore: true */ 'module').then(mod => mod.createRequire(/*! webpackIgnore: true */ import.meta.url));
    }
    else {
        INTERNAL.require = Promise.resolve(() => {
            throw new Error("require not supported");
        });
    }
    if (typeof globalThis.URL === "undefined") {
        globalThis.URL = URLPolyfill;
    }
}
async function fetch_like(url, init) {
    try {
        // this need to be detected only after we import node modules in onConfigLoaded
        const hasFetch = typeof (globalThis.fetch) === "function";
        if (ENVIRONMENT_IS_NODE) {
            const isFileUrl = url.startsWith("file://");
            if (!isFileUrl && hasFetch) {
                return globalThis.fetch(url, init || { credentials: "same-origin" });
            }
            if (!node_fs) {
                node_url = INTERNAL.require("url");
                node_fs = INTERNAL.require("fs");
            }
            if (isFileUrl) {
                url = node_url.fileURLToPath(url);
            }
            const arrayBuffer = await node_fs.promises.readFile(url);
            return {
                ok: true,
                headers: {
                    length: 0,
                    get: () => null
                },
                url,
                arrayBuffer: () => arrayBuffer,
                json: () => JSON.parse(arrayBuffer),
                text: () => {
                    throw new Error("NotImplementedException");
                }
            };
        }
        else if (hasFetch) {
            return globalThis.fetch(url, init || { credentials: "same-origin" });
        }
        else if (typeof (read) === "function") {
            // note that it can't open files with unicode names, like Stra<unicode char - Latin Small Letter Sharp S>e.xml
            // https://bugs.chromium.org/p/v8/issues/detail?id=12541
            return {
                ok: true,
                url,
                headers: {
                    length: 0,
                    get: () => null
                },
                arrayBuffer: () => {
                    return new Uint8Array(read(url, "binary"));
                },
                json: () => {
                    return JSON.parse(read(url, "utf8"));
                },
                text: () => read(url, "utf8")
            };
        }
    }
    catch (e) {
        return {
            ok: false,
            url,
            status: 500,
            headers: {
                length: 0,
                get: () => null
            },
            statusText: "ERR28: " + e,
            arrayBuffer: () => {
                throw e;
            },
            json: () => {
                throw e;
            },
            text: () => {
                throw e;
            }
        };
    }
    throw new Error("No fetch implementation available");
}
// context: the loadBootResource extension point can return URL/string which is unqualified.
// For example `xxx/a.js` and we have to make it absolute
// For compatibility reasons, it's based of document.baseURI even for JS modules like `./xxx/a.js`, which normally use script directory of a caller of `import`
// Script directory in general doesn't match document.baseURI
function makeURLAbsoluteWithApplicationBase(url) {
    if (!(typeof url === "string")) mono_assert(false, "url must be a string"); // inlined mono_assert condition
    if (!isPathAbsolute(url) && url.indexOf("./") !== 0 && url.indexOf("../") !== 0 && globalThis.URL && globalThis.document && globalThis.document.baseURI) {
        url = (new URL(url, globalThis.document.baseURI)).toString();
    }
    return url;
}
function normalizeFileUrl(filename) {
    // unix vs windows
    // remove query string
    return filename.replace(/\\/g, "/").replace(/[?#].*/, "");
}
function normalizeDirectoryUrl(dir) {
    return dir.slice(0, dir.lastIndexOf("/")) + "/";
}
const protocolRx = /^[a-zA-Z][a-zA-Z\d+\-.]*?:\/\//;
const windowsAbsoluteRx = /[a-zA-Z]:[\\/]/;
function isPathAbsolute(path) {
    if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
        // unix /x.json
        // windows \x.json
        // windows C:\x.json
        // windows C:/x.json
        return path.startsWith("/") || path.startsWith("\\") || path.indexOf("///") !== -1 || windowsAbsoluteRx.test(path);
    }
    // anything with protocol is always absolute
    // windows file:///C:/x.json
    // windows http://C:/x.json
    return protocolRx.test(path);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let throttlingPromise;
// in order to prevent net::ERR_INSUFFICIENT_RESOURCES if we start downloading too many files at same time
let parallel_count = 0;
const coreAssetsToLoad = [];
const assetsToLoad = [];
const singleAssets = new Map();
// A duplicate in pthreads/shared.ts
const worker_empty_prefix = "          -    ";
const jsRuntimeModulesAssetTypes = {
    "js-module-threads": true,
    "js-module-runtime": true,
    "js-module-dotnet": true,
    "js-module-native": true,
    "js-module-diagnostics": true,
};
const jsModulesAssetTypes = {
    ...jsRuntimeModulesAssetTypes,
    "js-module-library-initializer": true,
};
const singleAssetTypes = {
    ...jsRuntimeModulesAssetTypes,
    "dotnetwasm": true,
    "heap": true,
    "manifest": true,
};
// append query to asset url to prevent reusing state
const appendQueryAssetTypes = {
    ...jsModulesAssetTypes,
    "manifest": true,
};
// don't `fetch` javaScript and wasm files
const skipDownloadsByAssetTypes = {
    ...jsModulesAssetTypes,
    "dotnetwasm": true,
};
// `response.arrayBuffer()` can't be called twice. Some usecases are calling it on response in the instantiation.
const skipBufferByAssetTypes = {
    "dotnetwasm": true,
    "symbols": true
};
// these assets are instantiated differently than the main flow
const skipInstantiateByAssetTypes = {
    ...jsModulesAssetTypes,
    "dotnetwasm": true,
    "symbols": true
};
// load again for each worker
const loadIntoWorker = {
    "symbols": true,
};
function shouldLoadIcuAsset(asset) {
    return !(asset.behavior == "icu" && asset.name != loaderHelpers.preferredIcuAsset);
}
function convert_single_asset(assetsCollection, resource, behavior) {
    const keys = Object.keys(resource || {});
    mono_assert(keys.length == 1, `Expect to have one ${behavior} asset in resources`);
    const name = keys[0];
    const asset = {
        name,
        hash: resource[name],
        behavior,
    };
    set_single_asset(asset);
    // so that we can use it on the worker too
    assetsCollection.push(asset);
    return asset;
}
function set_single_asset(asset) {
    if (singleAssetTypes[asset.behavior]) {
        singleAssets.set(asset.behavior, asset);
    }
}
function try_resolve_single_asset_path(behavior) {
    mono_assert(singleAssetTypes[behavior], `Unknown single asset behavior ${behavior}`);
    const asset = singleAssets.get(behavior);
    if (asset && !asset.resolvedUrl) {
        asset.resolvedUrl = loaderHelpers.locateFile(asset.name);
        if (jsRuntimeModulesAssetTypes[asset.behavior]) {
            // give loadBootResource chance to override the url for JS modules with 'dotnetjs' type
            const customLoadResult = invokeLoadBootResource(asset);
            if (customLoadResult) {
                if (!(typeof customLoadResult === "string")) mono_assert(false, "loadBootResource response for 'dotnetjs' type should be a URL string"); // inlined mono_assert condition
                asset.resolvedUrl = customLoadResult;
            }
            else {
                asset.resolvedUrl = appendUniqueQuery(asset.resolvedUrl, asset.behavior);
            }
        }
        else if (asset.behavior !== "dotnetwasm") {
            throw new Error(`Unknown single asset behavior ${behavior}`);
        }
    }
    return asset;
}
function resolve_single_asset_path(behavior) {
    const asset = try_resolve_single_asset_path(behavior);
    mono_assert(asset, `Single asset for ${behavior} not found`);
    return asset;
}
let downloadAssetsStarted = false;
async function mono_download_assets() {
    if (downloadAssetsStarted) {
        return;
    }
    downloadAssetsStarted = true;
    if (loaderHelpers.diagnosticTracing) mono_log_debug("mono_download_assets"); // inlined mono_log_debug condition
    try {
        const promises_of_assets_core = [];
        const promises_of_assets_remaining = [];
        const countAndStartDownload = (asset, promises_list) => {
            if (!skipInstantiateByAssetTypes[asset.behavior] && shouldLoadIcuAsset(asset)) {
                loaderHelpers.expected_instantiated_assets_count++;
            }
            if (!skipDownloadsByAssetTypes[asset.behavior] && shouldLoadIcuAsset(asset)) {
                loaderHelpers.expected_downloaded_assets_count++;
                promises_list.push(start_asset_download(asset));
            }
        };
        // start fetching assets in parallel
        for (const asset of coreAssetsToLoad) {
            countAndStartDownload(asset, promises_of_assets_core);
        }
        for (const asset of assetsToLoad) {
            countAndStartDownload(asset, promises_of_assets_remaining);
        }
        loaderHelpers.allDownloadsQueued.promise_control.resolve();
        Promise.all([...promises_of_assets_core, ...promises_of_assets_remaining]).then(() => {
            loaderHelpers.allDownloadsFinished.promise_control.resolve();
        }).catch(err => {
            loaderHelpers.err("Error in mono_download_assets: " + err);
            mono_exit(1, err);
            throw err;
        });
        // continue after the dotnet.runtime.js was loaded
        await loaderHelpers.runtimeModuleLoaded.promise;
        const instantiate = async (downloadPromise) => {
            const asset = await downloadPromise;
            if (asset.buffer) {
                if (!skipInstantiateByAssetTypes[asset.behavior]) {
                    if (!(asset.buffer && typeof asset.buffer === "object")) mono_assert(false, "asset buffer must be array-like or buffer-like or promise of these"); // inlined mono_assert condition
                    if (!(typeof asset.resolvedUrl === "string")) mono_assert(false, "resolvedUrl must be string"); // inlined mono_assert condition
                    const url = asset.resolvedUrl;
                    const buffer = await asset.buffer;
                    const data = new Uint8Array(buffer);
                    cleanupAsset(asset);
                    // wait till after onRuntimeInitialized
                    await runtimeHelpers.beforeOnRuntimeInitialized.promise;
                    runtimeHelpers.instantiate_asset(asset, url, data);
                }
            }
            else {
                const headersOnly = skipBufferByAssetTypes[asset.behavior];
                if (!headersOnly) {
                    if (!(asset.isOptional)) mono_assert(false, "Expected asset to have the downloaded buffer"); // inlined mono_assert condition
                    if (!skipDownloadsByAssetTypes[asset.behavior] && shouldLoadIcuAsset(asset)) {
                        loaderHelpers.expected_downloaded_assets_count--;
                    }
                    if (!skipInstantiateByAssetTypes[asset.behavior] && shouldLoadIcuAsset(asset)) {
                        loaderHelpers.expected_instantiated_assets_count--;
                    }
                }
                else {
                    if (asset.behavior === "symbols") {
                        await runtimeHelpers.instantiate_symbols_asset(asset);
                        cleanupAsset(asset);
                    }
                    if (skipBufferByAssetTypes[asset.behavior]) {
                        ++loaderHelpers.actual_downloaded_assets_count;
                    }
                }
            }
        };
        const promises_of_asset_instantiation_core = [];
        const promises_of_asset_instantiation_remaining = [];
        for (const downloadPromise of promises_of_assets_core) {
            promises_of_asset_instantiation_core.push(instantiate(downloadPromise));
        }
        for (const downloadPromise of promises_of_assets_remaining) {
            promises_of_asset_instantiation_remaining.push(instantiate(downloadPromise));
        }
        // this await will get past the onRuntimeInitialized because we are not blocking via addRunDependency
        // and we are not awaiting it here
        Promise.all(promises_of_asset_instantiation_core).then(() => {
            if (!ENVIRONMENT_IS_WORKER) {
                runtimeHelpers.coreAssetsInMemory.promise_control.resolve();
            }
        }).catch(err => {
            loaderHelpers.err("Error in mono_download_assets: " + err);
            mono_exit(1, err);
            throw err;
        });
        Promise.all(promises_of_asset_instantiation_remaining).then(async () => {
            if (!ENVIRONMENT_IS_WORKER) {
                await runtimeHelpers.coreAssetsInMemory.promise;
                runtimeHelpers.allAssetsInMemory.promise_control.resolve();
            }
        }).catch(err => {
            loaderHelpers.err("Error in mono_download_assets: " + err);
            mono_exit(1, err);
            throw err;
        });
        // OPTIMIZATION explained:
        // we do it this way so that we could allocate memory immediately after asset is downloaded (and after onRuntimeInitialized which happened already)
        // spreading in time
        // rather than to block all downloads after onRuntimeInitialized or block onRuntimeInitialized after all downloads are done. That would create allocation burst.
    }
    catch (e) {
        loaderHelpers.err("Error in mono_download_assets: " + e);
        throw e;
    }
}
let assetsPrepared = false;
function prepareAssets() {
    if (assetsPrepared) {
        return;
    }
    assetsPrepared = true;
    const config = loaderHelpers.config;
    const modulesAssets = [];
    // if assets exits, we will assume Net7 legacy and not process resources object
    if (config.assets) {
        for (const asset of config.assets) {
            if (!(typeof asset === "object")) mono_assert(false, `asset must be object, it was ${typeof asset} : ${asset}`); // inlined mono_assert condition
            if (!(typeof asset.behavior === "string")) mono_assert(false, "asset behavior must be known string"); // inlined mono_assert condition
            if (!(typeof asset.name === "string")) mono_assert(false, "asset name must be string"); // inlined mono_assert condition
            if (!(!asset.resolvedUrl || typeof asset.resolvedUrl === "string")) mono_assert(false, "asset resolvedUrl could be string"); // inlined mono_assert condition
            if (!(!asset.hash || typeof asset.hash === "string")) mono_assert(false, "asset resolvedUrl could be string"); // inlined mono_assert condition
            if (!(!asset.pendingDownload || typeof asset.pendingDownload === "object")) mono_assert(false, "asset pendingDownload could be object"); // inlined mono_assert condition
            if (asset.isCore) {
                coreAssetsToLoad.push(asset);
            }
            else {
                assetsToLoad.push(asset);
            }
            set_single_asset(asset);
        }
    }
    else if (config.resources) {
        const resources = config.resources;
        if (!(resources.wasmNative)) mono_assert(false, "resources.wasmNative must be defined"); // inlined mono_assert condition
        if (!(resources.jsModuleNative)) mono_assert(false, "resources.jsModuleNative must be defined"); // inlined mono_assert condition
        if (!(resources.jsModuleRuntime)) mono_assert(false, "resources.jsModuleRuntime must be defined"); // inlined mono_assert condition
        if (!(!WasmEnableThreads || resources.jsModuleWorker)) mono_assert(false, "resources.jsModuleWorker must be defined"); // inlined mono_assert condition
        convert_single_asset(assetsToLoad, resources.wasmNative, "dotnetwasm");
        convert_single_asset(modulesAssets, resources.jsModuleNative, "js-module-native");
        convert_single_asset(modulesAssets, resources.jsModuleRuntime, "js-module-runtime");
        if (resources.jsModuleDiagnostics) {
            convert_single_asset(modulesAssets, resources.jsModuleDiagnostics, "js-module-diagnostics");
        }
        if (WasmEnableThreads) {
            convert_single_asset(modulesAssets, resources.jsModuleWorker, "js-module-threads");
        }
        const addAsset = (asset, isCore) => {
            if (resources.fingerprinting && (asset.behavior == "assembly" || asset.behavior == "pdb" || asset.behavior == "resource")) {
                asset.virtualPath = getNonFingerprintedAssetName(asset.name);
            }
            if (isCore) {
                asset.isCore = true;
                coreAssetsToLoad.push(asset);
            }
            else {
                assetsToLoad.push(asset);
            }
        };
        if (resources.coreAssembly) {
            for (const name in resources.coreAssembly) {
                addAsset({
                    name,
                    hash: resources.coreAssembly[name],
                    behavior: "assembly"
                }, true);
            }
        }
        if (resources.assembly) {
            for (const name in resources.assembly) {
                addAsset({
                    name,
                    hash: resources.assembly[name],
                    behavior: "assembly"
                }, !resources.coreAssembly); // if there are no core assemblies, then all assemblies are core
            }
        }
        if (config.debugLevel != 0 && loaderHelpers.isDebuggingSupported()) {
            if (resources.corePdb) {
                for (const name in resources.corePdb) {
                    addAsset({
                        name,
                        hash: resources.corePdb[name],
                        behavior: "pdb"
                    }, true);
                }
            }
            if (resources.pdb) {
                for (const name in resources.pdb) {
                    addAsset({
                        name,
                        hash: resources.pdb[name],
                        behavior: "pdb"
                    }, !resources.corePdb); // if there are no core pdbs, then all pdbs are core
                }
            }
        }
        if (config.loadAllSatelliteResources && resources.satelliteResources) {
            for (const culture in resources.satelliteResources) {
                for (const name in resources.satelliteResources[culture]) {
                    addAsset({
                        name,
                        hash: resources.satelliteResources[culture][name],
                        behavior: "resource",
                        culture
                    }, !resources.coreAssembly);
                }
            }
        }
        if (resources.coreVfs) {
            for (const virtualPath in resources.coreVfs) {
                for (const name in resources.coreVfs[virtualPath]) {
                    addAsset({
                        name,
                        hash: resources.coreVfs[virtualPath][name],
                        behavior: "vfs",
                        virtualPath
                    }, true);
                }
            }
        }
        if (resources.vfs) {
            for (const virtualPath in resources.vfs) {
                for (const name in resources.vfs[virtualPath]) {
                    addAsset({
                        name,
                        hash: resources.vfs[virtualPath][name],
                        behavior: "vfs",
                        virtualPath
                    }, !resources.coreVfs);
                }
            }
        }
        const icuDataResourceName = getIcuResourceName(config);
        if (icuDataResourceName && resources.icu) {
            for (const name in resources.icu) {
                if (name === icuDataResourceName) {
                    assetsToLoad.push({
                        name,
                        hash: resources.icu[name],
                        behavior: "icu",
                        loadRemote: true
                    });
                }
            }
        }
        if (resources.wasmSymbols) {
            for (const name in resources.wasmSymbols) {
                coreAssetsToLoad.push({
                    name,
                    hash: resources.wasmSymbols[name],
                    behavior: "symbols"
                });
            }
        }
    }
    // FIXME: should we also load Net7 backward compatible `config.configs` in a same way ?
    if (config.appsettings) {
        for (let i = 0; i < config.appsettings.length; i++) {
            const configUrl = config.appsettings[i];
            const configFileName = fileName(configUrl);
            if (configFileName === "appsettings.json" || configFileName === `appsettings.${config.applicationEnvironment}.json`) {
                assetsToLoad.push({
                    name: configUrl,
                    behavior: "vfs",
                    // TODO what should be the virtualPath ?
                    noCache: true,
                    useCredentials: true
                });
            }
            // FIXME: why are not loading all the other named files in appsettings ? https://github.com/dotnet/runtime/issues/89861
        }
    }
    config.assets = [...coreAssetsToLoad, ...assetsToLoad, ...modulesAssets];
}
function getNonFingerprintedAssetName(assetName) {
    var _a;
    const fingerprinting = (_a = loaderHelpers.config.resources) === null || _a === void 0 ? void 0 : _a.fingerprinting;
    if (fingerprinting && fingerprinting[assetName]) {
        return fingerprinting[assetName];
    }
    return assetName;
}
function prepareAssetsWorker() {
    const config = loaderHelpers.config;
    if (!(config.assets)) mono_assert(false, "config.assets must be defined"); // inlined mono_assert condition
    for (const asset of config.assets) {
        set_single_asset(asset);
        if (loadIntoWorker[asset.behavior]) {
            assetsToLoad.push(asset);
        }
    }
}
function delay(ms) {
    return new Promise(resolve => globalThis.setTimeout(resolve, ms));
}
async function retrieve_asset_download(asset) {
    const pendingAsset = await start_asset_download(asset);
    await pendingAsset.pendingDownloadInternal.response;
    return pendingAsset.buffer;
}
// FIXME: Connection reset is probably the only good one for which we should retry
async function start_asset_download(asset) {
    try {
        return await start_asset_download_with_throttle(asset);
    }
    catch (err) {
        if (!loaderHelpers.enableDownloadRetry) {
            // we will not re-try if disabled
            throw err;
        }
        if (ENVIRONMENT_IS_SHELL || ENVIRONMENT_IS_NODE) {
            // we will not re-try on shell
            throw err;
        }
        if (asset.pendingDownload && asset.pendingDownloadInternal == asset.pendingDownload) {
            // we will not re-try with external source
            throw err;
        }
        if (asset.resolvedUrl && asset.resolvedUrl.indexOf("file://") != -1) {
            // we will not re-try with local file
            throw err;
        }
        if (err && err.status == 404) {
            // we will not re-try with 404
            throw err;
        }
        asset.pendingDownloadInternal = undefined;
        // second attempt only after all first attempts are queued
        await loaderHelpers.allDownloadsQueued.promise;
        try {
            if (loaderHelpers.diagnosticTracing) mono_log_debug(`Retrying download '${asset.name}'`); // inlined mono_log_debug condition
            return await start_asset_download_with_throttle(asset);
        }
        catch (err) {
            asset.pendingDownloadInternal = undefined;
            // third attempt after small delay
            await delay(100);
            if (loaderHelpers.diagnosticTracing) mono_log_debug(`Retrying download (2) '${asset.name}' after delay`); // inlined mono_log_debug condition
            return await start_asset_download_with_throttle(asset);
        }
    }
}
async function start_asset_download_with_throttle(asset) {
    // we don't addRunDependency to allow download in parallel with onRuntimeInitialized event!
    while (throttlingPromise) {
        await throttlingPromise.promise;
    }
    try {
        ++parallel_count;
        if (parallel_count == loaderHelpers.maxParallelDownloads) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug("Throttling further parallel downloads"); // inlined mono_log_debug condition
            throttlingPromise = createPromiseController();
        }
        const response = await start_asset_download_sources(asset);
        if (!response) {
            return asset;
        }
        const skipBuffer = skipBufferByAssetTypes[asset.behavior];
        if (skipBuffer) {
            return asset;
        }
        asset.buffer = await response.arrayBuffer();
        ++loaderHelpers.actual_downloaded_assets_count;
        return asset;
    }
    finally {
        --parallel_count;
        if (throttlingPromise && parallel_count == loaderHelpers.maxParallelDownloads - 1) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug("Resuming more parallel downloads"); // inlined mono_log_debug condition
            const old_throttling = throttlingPromise;
            throttlingPromise = undefined;
            old_throttling.promise_control.resolve();
        }
    }
}
async function start_asset_download_sources(asset) {
    // we don't addRunDependency to allow download in parallel with onRuntimeInitialized event!
    if (asset.pendingDownload) {
        asset.pendingDownloadInternal = asset.pendingDownload;
    }
    if (asset.pendingDownloadInternal && asset.pendingDownloadInternal.response) {
        return asset.pendingDownloadInternal.response;
    }
    if (asset.buffer) {
        const buffer = await asset.buffer;
        if (!asset.resolvedUrl) {
            asset.resolvedUrl = "undefined://" + asset.name;
        }
        asset.pendingDownloadInternal = {
            url: asset.resolvedUrl,
            name: asset.name,
            response: Promise.resolve({
                ok: true,
                arrayBuffer: () => buffer,
                json: () => JSON.parse(new TextDecoder("utf-8").decode(buffer)),
                text: () => {
                    throw new Error("NotImplementedException");
                },
                headers: {
                    get: () => undefined,
                }
            })
        };
        return asset.pendingDownloadInternal.response;
    }
    const sourcesList = asset.loadRemote && loaderHelpers.config.remoteSources ? loaderHelpers.config.remoteSources : [""];
    let response = undefined;
    for (let sourcePrefix of sourcesList) {
        sourcePrefix = sourcePrefix.trim();
        // HACK: Special-case because MSBuild doesn't allow "" as an attribute
        if (sourcePrefix === "./")
            sourcePrefix = "";
        const attemptUrl = resolve_path(asset, sourcePrefix);
        if (asset.name === attemptUrl) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug(`Attempting to download '${attemptUrl}'`); // inlined mono_log_debug condition
        }
        else {
            if (loaderHelpers.diagnosticTracing) mono_log_debug(`Attempting to download '${attemptUrl}' for ${asset.name}`); // inlined mono_log_debug condition
        }
        try {
            asset.resolvedUrl = attemptUrl;
            const loadingResource = download_resource(asset);
            asset.pendingDownloadInternal = loadingResource;
            response = await loadingResource.response;
            if (!response || !response.ok) {
                continue; // next source
            }
            return response;
        }
        catch (err) {
            if (!response) {
                response = {
                    ok: false,
                    url: attemptUrl,
                    status: 0,
                    statusText: "" + err,
                };
            }
            continue; //next source
        }
    }
    const isOkToFail = asset.isOptional || (asset.name.match(/\.pdb$/) && loaderHelpers.config.ignorePdbLoadErrors);
    if (!(response)) mono_assert(false, `Response undefined ${asset.name}`); // inlined mono_assert condition
    if (!isOkToFail) {
        const err = new Error(`download '${response.url}' for ${asset.name} failed ${response.status} ${response.statusText}`);
        err.status = response.status;
        throw err;
    }
    else {
        mono_log_info(`optional download '${response.url}' for ${asset.name} failed ${response.status} ${response.statusText}`);
        return undefined;
    }
}
function resolve_path(asset, sourcePrefix) {
    if (!(sourcePrefix !== null && sourcePrefix !== undefined)) mono_assert(false, `sourcePrefix must be provided for ${asset.name}`); // inlined mono_assert condition
    let attemptUrl;
    if (!asset.resolvedUrl) {
        if (sourcePrefix === "") {
            if (asset.behavior === "assembly" || asset.behavior === "pdb") {
                attemptUrl = asset.name;
            }
            else if (asset.behavior === "resource") {
                const path = asset.culture && asset.culture !== "" ? `${asset.culture}/${asset.name}` : asset.name;
                attemptUrl = path;
            }
            else {
                attemptUrl = asset.name;
            }
        }
        else {
            attemptUrl = sourcePrefix + asset.name;
        }
        attemptUrl = appendUniqueQuery(loaderHelpers.locateFile(attemptUrl), asset.behavior);
    }
    else {
        attemptUrl = asset.resolvedUrl;
    }
    if (!(attemptUrl && typeof attemptUrl == "string")) mono_assert(false, "attemptUrl need to be path or url string"); // inlined mono_assert condition
    return attemptUrl;
}
function appendUniqueQuery(attemptUrl, behavior) {
    // apply unique query to js modules to make the module state independent of the other runtime instances
    if (loaderHelpers.modulesUniqueQuery && appendQueryAssetTypes[behavior]) {
        attemptUrl = attemptUrl + loaderHelpers.modulesUniqueQuery;
    }
    return attemptUrl;
}
let resourcesLoaded = 0;
const totalResources = new Set();
function download_resource(asset) {
    try {
        if (!(asset.resolvedUrl)) mono_assert(false, "Request's resolvedUrl must be set"); // inlined mono_assert condition
        const fetchResponse = download_resource_with_cache(asset);
        const response = { name: asset.name, url: asset.resolvedUrl, response: fetchResponse };
        totalResources.add(asset.name);
        response.response.then(() => {
            if (asset.behavior == "assembly") {
                loaderHelpers.loadedAssemblies.push(asset.name);
            }
            resourcesLoaded++;
            if (loaderHelpers.onDownloadResourceProgress)
                loaderHelpers.onDownloadResourceProgress(resourcesLoaded, totalResources.size);
        });
        return response;
    }
    catch (err) {
        const response = {
            ok: false,
            url: asset.resolvedUrl,
            status: 500,
            statusText: "ERR29: " + err,
            arrayBuffer: () => {
                throw err;
            },
            json: () => {
                throw err;
            }
        };
        return {
            name: asset.name, url: asset.resolvedUrl, response: Promise.resolve(response)
        };
    }
}
async function download_resource_with_cache(asset) {
    let response = await findCachedResponse(asset);
    if (!response) {
        response = await fetchResource(asset);
        addCachedReponse(asset, response);
    }
    return response;
}
function fetchResource(asset) {
    // Allow developers to override how the resource is loaded
    let url = asset.resolvedUrl;
    if (loaderHelpers.loadBootResource) {
        const customLoadResult = invokeLoadBootResource(asset);
        if (customLoadResult instanceof Promise) {
            // They are supplying an entire custom response, so just use that
            return customLoadResult;
        }
        else if (typeof customLoadResult === "string") {
            url = customLoadResult;
        }
    }
    const fetchOptions = {};
    if (!loaderHelpers.config.disableNoCacheFetch) {
        // FIXME: "no-cache" is how blazor works in Net7, but this prevents caching on HTTP level
        // if we would like to get rid of our own cache and only use HTTP cache, we need to remove this
        // https://github.com/dotnet/runtime/issues/74815
        fetchOptions.cache = "no-cache";
    }
    if (asset.useCredentials) {
        // Include credentials so the server can allow download / provide user specific file
        fetchOptions.credentials = "include";
    }
    else {
        // `disableIntegrityCheck` is to give developers an easy opt-out from the integrity check
        if (!loaderHelpers.config.disableIntegrityCheck && asset.hash) {
            // Any other resource than configuration should provide integrity check
            fetchOptions.integrity = asset.hash;
        }
    }
    return loaderHelpers.fetch_like(url, fetchOptions);
}
const monoToBlazorAssetTypeMap = {
    "resource": "assembly",
    "assembly": "assembly",
    "pdb": "pdb",
    "icu": "globalization",
    "vfs": "configuration",
    "manifest": "manifest",
    "dotnetwasm": "dotnetwasm",
    "js-module-dotnet": "dotnetjs",
    "js-module-native": "dotnetjs",
    "js-module-runtime": "dotnetjs",
    "js-module-threads": "dotnetjs"
};
function invokeLoadBootResource(asset) {
    var _a;
    if (loaderHelpers.loadBootResource) {
        const requestHash = (_a = asset.hash) !== null && _a !== void 0 ? _a : "";
        const url = asset.resolvedUrl;
        const resourceType = monoToBlazorAssetTypeMap[asset.behavior];
        if (resourceType) {
            const customLoadResult = loaderHelpers.loadBootResource(resourceType, asset.name, url, requestHash, asset.behavior);
            if (typeof customLoadResult === "string") {
                return makeURLAbsoluteWithApplicationBase(customLoadResult);
            }
            return customLoadResult;
        }
    }
    return undefined;
}
function cleanupAsset(asset) {
    // give GC chance to collect resources
    asset.pendingDownloadInternal = null; // GC
    asset.pendingDownload = null; // GC
    asset.buffer = null; // GC
    asset.moduleExports = null; // GC
}
function fileName(name) {
    let lastIndexOfSlash = name.lastIndexOf("/");
    if (lastIndexOfSlash >= 0) {
        lastIndexOfSlash++;
    }
    return name.substring(lastIndexOfSlash);
}
async function streamingCompileWasm() {
    try {
        const wasmModuleAsset = resolve_single_asset_path("dotnetwasm");
        await start_asset_download(wasmModuleAsset);
        if (!(wasmModuleAsset && wasmModuleAsset.pendingDownloadInternal && wasmModuleAsset.pendingDownloadInternal.response)) mono_assert(false, "Can't load dotnet.native.wasm"); // inlined mono_assert condition
        const response = await wasmModuleAsset.pendingDownloadInternal.response;
        const contentType = response.headers && response.headers.get ? response.headers.get("Content-Type") : undefined;
        let compiledModule;
        if (typeof WebAssembly.compileStreaming === "function" && contentType === "application/wasm") {
            compiledModule = await WebAssembly.compileStreaming(response);
        }
        else {
            if (ENVIRONMENT_IS_WEB && contentType !== "application/wasm") {
                mono_log_warn("WebAssembly resource does not have the expected content type \"application/wasm\", so falling back to slower ArrayBuffer instantiation.");
            }
            const arrayBuffer = await response.arrayBuffer();
            if (loaderHelpers.diagnosticTracing) mono_log_debug("instantiate_wasm_module buffered"); // inlined mono_log_debug condition
            if (ENVIRONMENT_IS_SHELL) {
                // workaround for old versions of V8 with https://bugs.chromium.org/p/v8/issues/detail?id=13823
                compiledModule = await Promise.resolve(new WebAssembly.Module(arrayBuffer));
            }
            else {
                compiledModule = await WebAssembly.compile(arrayBuffer);
            }
        }
        wasmModuleAsset.pendingDownloadInternal = null; // GC
        wasmModuleAsset.pendingDownload = null; // GC
        wasmModuleAsset.buffer = null; // GC
        wasmModuleAsset.moduleExports = null; // GC
        loaderHelpers.wasmCompilePromise.promise_control.resolve(compiledModule);
    }
    catch (err) {
        loaderHelpers.wasmCompilePromise.promise_control.reject(err);
    }
}
function preloadWorkers() {
    if (!WasmEnableThreads)
        return;
    const jsModuleWorker = resolve_single_asset_path("js-module-threads");
    const loadingWorkers = [];
    for (let i = 0; i < loaderHelpers.config.pthreadPoolInitialSize; i++) {
        const workerNumber = loaderHelpers.workerNextNumber++;
        const worker = new Worker(jsModuleWorker.resolvedUrl, {
            name: "dotnet-worker-" + workerNumber.toString().padStart(3, "0"),
            type: "module",
        });
        worker.info = {
            workerNumber,
            pthreadId: PThreadPtrNull,
            reuseCount: 0,
            updateCount: 0,
            threadPrefix: worker_empty_prefix,
            threadName: "emscripten-pool",
        };
        loadingWorkers.push(worker);
    }
    loaderHelpers.loadingWorkers.promise_control.resolve(loadingWorkers);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
async function importLibraryInitializers(libraryInitializers) {
    if (!libraryInitializers) {
        return;
    }
    const initializerFiles = Object.keys(libraryInitializers);
    await Promise.all(initializerFiles.map(f => importInitializer(f)));
    async function importInitializer(path) {
        try {
            const adjustedPath = appendUniqueQuery(loaderHelpers.locateFile(path), "js-module-library-initializer");
            if (loaderHelpers.diagnosticTracing) mono_log_debug(`Attempting to import '${adjustedPath}' for ${path}`); // inlined mono_log_debug condition
            const initializer = await import(/*! webpackIgnore: true */ adjustedPath);
            loaderHelpers.libraryInitializers.push({ scriptName: path, exports: initializer });
        }
        catch (error) {
            mono_log_warn(`Failed to import library initializer '${path}': ${error}`);
        }
    }
}
async function invokeLibraryInitializers(functionName, args) {
    if (!loaderHelpers.libraryInitializers) {
        return;
    }
    const promises = [];
    for (let i = 0; i < loaderHelpers.libraryInitializers.length; i++) {
        const initializer = loaderHelpers.libraryInitializers[i];
        if (initializer.exports[functionName]) {
            promises.push(abortStartupOnError(initializer.scriptName, functionName, () => initializer.exports[functionName](...args)));
        }
    }
    await Promise.all(promises);
}
async function abortStartupOnError(scriptName, methodName, callback) {
    try {
        await callback();
    }
    catch (err) {
        mono_log_warn(`Failed to invoke '${methodName}' on library initializer '${scriptName}': ${err}`);
        mono_exit(1, err);
        throw err;
    }
}

var BuildConfiguration = "Debug";

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function deep_merge_config(target, source) {
    // no need to merge the same object
    if (target === source)
        return target;
    // If source has collection fields set to null (produced by boot config for example), we should maintain the target values
    const providedConfig = { ...source };
    if (providedConfig.assets !== undefined && providedConfig.assets !== target.assets) {
        providedConfig.assets = [...(target.assets || []), ...(providedConfig.assets || [])];
    }
    if (providedConfig.resources !== undefined) {
        providedConfig.resources = deep_merge_resources(target.resources || {
            assembly: {},
            jsModuleNative: {},
            jsModuleRuntime: {},
            wasmNative: {}
        }, providedConfig.resources);
    }
    if (providedConfig.environmentVariables !== undefined) {
        providedConfig.environmentVariables = { ...(target.environmentVariables || {}), ...(providedConfig.environmentVariables || {}) };
    }
    if (providedConfig.runtimeOptions !== undefined && providedConfig.runtimeOptions !== target.runtimeOptions) {
        providedConfig.runtimeOptions = [...(target.runtimeOptions || []), ...(providedConfig.runtimeOptions || [])];
    }
    return Object.assign(target, providedConfig);
}
function deep_merge_module(target, source) {
    // no need to merge the same object
    if (target === source)
        return target;
    const providedConfig = { ...source };
    if (providedConfig.config) {
        if (!target.config)
            target.config = {};
        providedConfig.config = deep_merge_config(target.config, providedConfig.config);
    }
    return Object.assign(target, providedConfig);
}
function deep_merge_resources(target, source) {
    // no need to merge the same object
    if (target === source)
        return target;
    const providedResources = { ...source };
    if (providedResources.assembly !== undefined) {
        providedResources.assembly = { ...(target.assembly || {}), ...(providedResources.assembly || {}) };
    }
    if (providedResources.lazyAssembly !== undefined) {
        providedResources.lazyAssembly = { ...(target.lazyAssembly || {}), ...(providedResources.lazyAssembly || {}) };
    }
    if (providedResources.pdb !== undefined) {
        providedResources.pdb = { ...(target.pdb || {}), ...(providedResources.pdb || {}) };
    }
    if (providedResources.jsModuleWorker !== undefined) {
        providedResources.jsModuleWorker = { ...(target.jsModuleWorker || {}), ...(providedResources.jsModuleWorker || {}) };
    }
    if (providedResources.jsModuleNative !== undefined) {
        providedResources.jsModuleNative = { ...(target.jsModuleNative || {}), ...(providedResources.jsModuleNative || {}) };
    }
    if (providedResources.jsModuleDiagnostics !== undefined) {
        providedResources.jsModuleDiagnostics = { ...(target.jsModuleDiagnostics || {}), ...(providedResources.jsModuleDiagnostics || {}) };
    }
    if (providedResources.jsModuleRuntime !== undefined) {
        providedResources.jsModuleRuntime = { ...(target.jsModuleRuntime || {}), ...(providedResources.jsModuleRuntime || {}) };
    }
    if (providedResources.wasmSymbols !== undefined) {
        providedResources.wasmSymbols = { ...(target.wasmSymbols || {}), ...(providedResources.wasmSymbols || {}) };
    }
    if (providedResources.wasmNative !== undefined) {
        providedResources.wasmNative = { ...(target.wasmNative || {}), ...(providedResources.wasmNative || {}) };
    }
    if (providedResources.icu !== undefined) {
        providedResources.icu = { ...(target.icu || {}), ...(providedResources.icu || {}) };
    }
    if (providedResources.satelliteResources !== undefined) {
        providedResources.satelliteResources = deep_merge_dict(target.satelliteResources || {}, providedResources.satelliteResources || {});
    }
    if (providedResources.modulesAfterConfigLoaded !== undefined) {
        providedResources.modulesAfterConfigLoaded = { ...(target.modulesAfterConfigLoaded || {}), ...(providedResources.modulesAfterConfigLoaded || {}) };
    }
    if (providedResources.modulesAfterRuntimeReady !== undefined) {
        providedResources.modulesAfterRuntimeReady = { ...(target.modulesAfterRuntimeReady || {}), ...(providedResources.modulesAfterRuntimeReady || {}) };
    }
    if (providedResources.extensions !== undefined) {
        providedResources.extensions = { ...(target.extensions || {}), ...(providedResources.extensions || {}) };
    }
    if (providedResources.vfs !== undefined) {
        providedResources.vfs = deep_merge_dict(target.vfs || {}, providedResources.vfs || {});
    }
    return Object.assign(target, providedResources);
}
function deep_merge_dict(target, source) {
    // no need to merge the same object
    if (target === source)
        return target;
    for (const key in source) {
        target[key] = { ...target[key], ...source[key] };
    }
    return target;
}
// NOTE: this is called before setRuntimeGlobals
function normalizeConfig() {
    // normalize
    const config = loaderHelpers.config;
    config.environmentVariables = config.environmentVariables || {};
    config.runtimeOptions = config.runtimeOptions || [];
    config.resources = config.resources || {
        assembly: {},
        jsModuleNative: {},
        jsModuleWorker: {},
        jsModuleRuntime: {},
        wasmNative: {},
        vfs: {},
        satelliteResources: {},
    };
    if (config.assets) {
        if (loaderHelpers.diagnosticTracing) mono_log_debug("config.assets is deprecated, use config.resources instead"); // inlined mono_log_debug condition
        for (const asset of config.assets) {
            const resource = {};
            resource[asset.name] = asset.hash || "";
            const toMerge = {};
            switch (asset.behavior) {
                case "assembly":
                    toMerge.assembly = resource;
                    break;
                case "pdb":
                    toMerge.pdb = resource;
                    break;
                case "resource":
                    toMerge.satelliteResources = {};
                    toMerge.satelliteResources[asset.culture] = resource;
                    break;
                case "icu":
                    toMerge.icu = resource;
                    break;
                case "symbols":
                    toMerge.wasmSymbols = resource;
                    break;
                case "vfs":
                    toMerge.vfs = {};
                    toMerge.vfs[asset.virtualPath] = resource;
                    break;
                case "dotnetwasm":
                    toMerge.wasmNative = resource;
                    break;
                case "js-module-threads":
                    toMerge.jsModuleWorker = resource;
                    break;
                case "js-module-runtime":
                    toMerge.jsModuleRuntime = resource;
                    break;
                case "js-module-native":
                    toMerge.jsModuleNative = resource;
                    break;
                case "js-module-diagnostics":
                    toMerge.jsModuleDiagnostics = resource;
                    break;
                case "js-module-dotnet":
                    // don't merge loader
                    break;
                default:
                    throw new Error(`Unexpected behavior ${asset.behavior} of asset ${asset.name}`);
            }
            deep_merge_resources(config.resources, toMerge);
        }
    }
    if (config.debugLevel === undefined && BuildConfiguration === "Debug") {
        config.debugLevel = -1;
    }
    if (config.cachedResourcesPurgeDelay === undefined) {
        config.cachedResourcesPurgeDelay = 10000;
    }
    // ActiveIssue https://github.com/dotnet/runtime/issues/75602
    if (WasmEnableThreads) {
        if (!Number.isInteger(config.pthreadPoolInitialSize)) {
            config.pthreadPoolInitialSize = 5;
        }
        if (!Number.isInteger(config.pthreadPoolUnusedSize)) {
            config.pthreadPoolUnusedSize = 1;
        }
        if (config.jsThreadBlockingMode == undefined) {
            config.jsThreadBlockingMode = "PreventSynchronousJSExport" /* JSThreadBlockingMode.PreventSynchronousJSExport */;
        }
    }
    // this is how long the Mono GC will try to wait for all threads to be suspended before it gives up and aborts the process
    if (WasmEnableThreads && config.environmentVariables["MONO_SLEEP_ABORT_LIMIT"] === undefined) {
        config.environmentVariables["MONO_SLEEP_ABORT_LIMIT"] = "5000";
    }
    if (BuildConfiguration === "Debug" && config.diagnosticTracing === undefined) {
        config.diagnosticTracing = true;
    }
    if (config.applicationCulture) {
        // If a culture is specified via start options use that to initialize the Emscripten \  .NET culture.
        config.environmentVariables["LANG"] = `${config.applicationCulture}.UTF-8`;
    }
    runtimeHelpers.diagnosticTracing = loaderHelpers.diagnosticTracing = !!config.diagnosticTracing;
    runtimeHelpers.waitForDebugger = config.waitForDebugger;
    runtimeHelpers.enablePerfMeasure = !!config.browserProfilerOptions
        && globalThis.performance
        && typeof globalThis.performance.measure === "function";
    loaderHelpers.maxParallelDownloads = config.maxParallelDownloads || loaderHelpers.maxParallelDownloads;
    loaderHelpers.enableDownloadRetry = config.enableDownloadRetry !== undefined ? config.enableDownloadRetry : loaderHelpers.enableDownloadRetry;
}
let configLoaded = false;
async function mono_wasm_load_config(module) {
    var _a;
    if (configLoaded) {
        await loaderHelpers.afterConfigLoaded.promise;
        return;
    }
    let configFilePath;
    try {
        if (!module.configSrc && (!loaderHelpers.config || Object.keys(loaderHelpers.config).length === 0 || (!loaderHelpers.config.assets && !loaderHelpers.config.resources))) {
            // if config file location nor assets are provided
            module.configSrc = "dotnet.boot.js";
        }
        configFilePath = module.configSrc;
        configLoaded = true;
        if (configFilePath) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug("mono_wasm_load_config"); // inlined mono_log_debug condition
            await loadBootConfig(module);
        }
        normalizeConfig();
        // scripts need to be loaded before onConfigLoaded because Blazor calls `beforeStart` export in onConfigLoaded
        await importLibraryInitializers((_a = loaderHelpers.config.resources) === null || _a === void 0 ? void 0 : _a.modulesAfterConfigLoaded);
        await invokeLibraryInitializers("onRuntimeConfigLoaded", [loaderHelpers.config]);
        if (module.onConfigLoaded) {
            try {
                await module.onConfigLoaded(loaderHelpers.config, exportedRuntimeAPI);
                normalizeConfig();
            }
            catch (err) {
                mono_log_error("onConfigLoaded() failed", err);
                throw err;
            }
        }
        normalizeConfig();
        loaderHelpers.afterConfigLoaded.promise_control.resolve(loaderHelpers.config);
    }
    catch (err) {
        const errMessage = `Failed to load config file ${configFilePath} ${err} ${err === null || err === void 0 ? void 0 : err.stack}`;
        loaderHelpers.config = module.config = Object.assign(loaderHelpers.config, { message: errMessage, error: err, isError: true });
        mono_exit(1, new Error(errMessage));
        throw err;
    }
}
function isDebuggingSupported() {
    // Copied from blazor MonoDebugger.ts/attachDebuggerHotkey
    if (!globalThis.navigator) {
        return false;
    }
    return loaderHelpers.isChromium || loaderHelpers.isFirefox;
}
async function loadBootConfig(module) {
    const defaultConfigSrc = module.configSrc;
    const defaultConfigUrl = loaderHelpers.locateFile(defaultConfigSrc);
    let loaderResponse = null;
    if (loaderHelpers.loadBootResource !== undefined) {
        loaderResponse = loaderHelpers.loadBootResource("manifest", defaultConfigSrc, defaultConfigUrl, "", "manifest");
    }
    let loadedConfigResponse = null;
    let loadedConfig;
    if (!loaderResponse) {
        if (defaultConfigUrl.includes(".json")) {
            loadedConfigResponse = await fetchBootConfig(appendUniqueQuery(defaultConfigUrl, "manifest"));
            loadedConfig = await readBootConfigResponse(loadedConfigResponse);
        }
        else {
            loadedConfig = (await import(appendUniqueQuery(defaultConfigUrl, "manifest"))).config;
        }
    }
    else if (typeof loaderResponse === "string") {
        if (loaderResponse.includes(".json")) {
            loadedConfigResponse = await fetchBootConfig(makeURLAbsoluteWithApplicationBase(loaderResponse));
            loadedConfig = await readBootConfigResponse(loadedConfigResponse);
        }
        else {
            loadedConfig = (await import(makeURLAbsoluteWithApplicationBase(loaderResponse))).config;
        }
    }
    else {
        const loadedResponse = await loaderResponse;
        if (typeof loadedResponse.json == "function") {
            loadedConfigResponse = loadedResponse;
            loadedConfig = await readBootConfigResponse(loadedConfigResponse);
        }
        else {
            // If the response doesn't contain .json(), consider it an imported module.
            loadedConfig = loadedResponse.config;
        }
    }
    // Prefer user-defined application environment
    if (loaderHelpers.config.applicationEnvironment) {
        loadedConfig.applicationEnvironment = loaderHelpers.config.applicationEnvironment;
    }
    deep_merge_config(loaderHelpers.config, loadedConfig);
    if (!loaderHelpers.config.applicationEnvironment) {
        loaderHelpers.config.applicationEnvironment = "Production";
    }
    if (loaderHelpers.config.debugLevel !== 0 && document.querySelector("script[src*='aspnetcore-browser-refresh']")) {
        loaderHelpers.config.environmentVariables = loaderHelpers.config.environmentVariables || {};
        if (!loaderHelpers.config.environmentVariables["DOTNET_MODIFIABLE_ASSEMBLIES"]) {
            loaderHelpers.config.environmentVariables["DOTNET_MODIFIABLE_ASSEMBLIES"] = "debug";
        }
        if (!loaderHelpers.config.environmentVariables["__ASPNETCORE_BROWSER_TOOLS"]) {
            loaderHelpers.config.environmentVariables["__ASPNETCORE_BROWSER_TOOLS"] = "true";
        }
    }
    function fetchBootConfig(url) {
        return loaderHelpers.fetch_like(url, {
            method: "GET",
            credentials: "include",
            cache: "no-cache",
        });
    }
}
async function readBootConfigResponse(loadConfigResponse) {
    const config = loaderHelpers.config;
    const loadedConfig = await loadConfigResponse.json();
    if (!config.applicationEnvironment && !loadedConfig.applicationEnvironment) {
        loadedConfig.applicationEnvironment = loadConfigResponse.headers.get("Blazor-Environment") || loadConfigResponse.headers.get("DotNet-Environment") || undefined;
    }
    if (!loadedConfig.environmentVariables)
        loadedConfig.environmentVariables = {};
    const modifiableAssemblies = loadConfigResponse.headers.get("DOTNET-MODIFIABLE-ASSEMBLIES");
    if (modifiableAssemblies) {
        // Configure the app to enable hot reload in Development.
        loadedConfig.environmentVariables["DOTNET_MODIFIABLE_ASSEMBLIES"] = modifiableAssemblies;
    }
    const aspnetCoreBrowserTools = loadConfigResponse.headers.get("ASPNETCORE-BROWSER-TOOLS");
    if (aspnetCoreBrowserTools) {
        // See https://github.com/dotnet/aspnetcore/issues/37357#issuecomment-941237000
        loadedConfig.environmentVariables["__ASPNETCORE_BROWSER_TOOLS"] = aspnetCoreBrowserTools;
    }
    return loadedConfig;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../types/sidecar.d.ts" />
// if we are the first script loaded in the web worker, we are expected to become the sidecar
if (typeof importScripts === "function" && !globalThis.onmessage) {
    globalThis.dotnetSidecar = true;
}
// keep in sync with src\mono\browser\runtime\globals.ts and src\mono\browser\test-main.js
const ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
const ENVIRONMENT_IS_WEB_WORKER = typeof importScripts == "function";
const ENVIRONMENT_IS_SIDECAR = ENVIRONMENT_IS_WEB_WORKER && typeof dotnetSidecar !== "undefined"; // sidecar is emscripten main running in a web worker
const ENVIRONMENT_IS_WORKER = ENVIRONMENT_IS_WEB_WORKER && !ENVIRONMENT_IS_SIDECAR; // we redefine what ENVIRONMENT_IS_WORKER, we replace it in emscripten internals, so that sidecar works
const ENVIRONMENT_IS_WEB = typeof window == "object" || (ENVIRONMENT_IS_WEB_WORKER && !ENVIRONMENT_IS_NODE);
const ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE;
let runtimeHelpers = {};
let loaderHelpers = {};
let diagnosticHelpers = {};
let exportedRuntimeAPI = {};
let INTERNAL = {};
let _loaderModuleLoaded = false; // please keep it in place also as rollup guard
const monoConfig = {};
const emscriptenModule = {
    config: monoConfig
};
const globalObjectsRoot = {
    mono: {},
    binding: {},
    internal: INTERNAL,
    module: emscriptenModule,
    loaderHelpers,
    runtimeHelpers,
    diagnosticHelpers: diagnosticHelpers,
    api: exportedRuntimeAPI,
};
setLoaderGlobals(globalObjectsRoot);
function setLoaderGlobals(globalObjects) {
    if (_loaderModuleLoaded) {
        throw new Error("Loader module already loaded");
    }
    _loaderModuleLoaded = true;
    runtimeHelpers = globalObjects.runtimeHelpers;
    loaderHelpers = globalObjects.loaderHelpers;
    diagnosticHelpers = globalObjects.diagnosticHelpers;
    exportedRuntimeAPI = globalObjects.api;
    INTERNAL = globalObjects.internal;
    Object.assign(exportedRuntimeAPI, {
        INTERNAL,
        invokeLibraryInitializers
    });
    Object.assign(globalObjects.module, {
        config: deep_merge_config(monoConfig, { environmentVariables: {} }),
    });
    const rh = {
        mono_wasm_bindings_is_ready: false,
        config: globalObjects.module.config,
        diagnosticTracing: false,
        nativeAbort: (reason) => {
            throw reason || new Error("abort");
        },
        nativeExit: (code) => {
            throw new Error("exit:" + code);
        }
    };
    const lh = {
        gitHash,
        config: globalObjects.module.config,
        diagnosticTracing: false,
        maxParallelDownloads: 16,
        enableDownloadRetry: true,
        _loaded_files: [],
        loadedFiles: [],
        loadedAssemblies: [],
        libraryInitializers: [],
        workerNextNumber: 1,
        actual_downloaded_assets_count: 0,
        actual_instantiated_assets_count: 0,
        expected_downloaded_assets_count: 0,
        expected_instantiated_assets_count: 0,
        afterConfigLoaded: createPromiseController(),
        allDownloadsQueued: createPromiseController(),
        allDownloadsFinished: createPromiseController(),
        wasmCompilePromise: createPromiseController(),
        runtimeModuleLoaded: createPromiseController(),
        loadingWorkers: createPromiseController(),
        is_exited,
        is_runtime_running,
        assert_runtime_running,
        mono_exit,
        createPromiseController,
        getPromiseController,
        assertIsControllablePromise,
        mono_download_assets,
        resolve_single_asset_path,
        setup_proxy_console,
        set_thread_prefix,
        logDownloadStatsToConsole,
        purgeUnusedCacheEntriesAsync,
        installUnhandledErrorHandler,
        retrieve_asset_download,
        invokeLibraryInitializers,
        isDebuggingSupported,
        // from wasm-feature-detect npm package
        exceptions,
        simd,
    };
    Object.assign(runtimeHelpers, rh);
    Object.assign(loaderHelpers, lh);
}
// this will abort the program if the condition is false
// see src\mono\browser\runtime\rollup.config.js
// we inline the condition, because the lambda could allocate closure on hot path otherwise
function mono_assert(condition, messageFactory) {
    if (condition)
        return;
    const message = "Assert failed: " + (typeof messageFactory === "function"
        ? messageFactory()
        : messageFactory);
    const error = new Error(message);
    mono_log_error(message, error);
    runtimeHelpers.nativeAbort(error);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function is_exited() {
    return loaderHelpers.exitCode !== undefined;
}
function is_runtime_running() {
    return runtimeHelpers.runtimeReady && !is_exited();
}
function assert_runtime_running() {
    if (!(!is_exited())) mono_assert(false, `.NET runtime already exited with ${loaderHelpers.exitCode} ${loaderHelpers.exitReason}. You can use runtime.runMain() which doesn't exit the runtime.`); // inlined mono_assert condition
    if (WasmEnableThreads && ENVIRONMENT_IS_WORKER) {
        if (!(runtimeHelpers.runtimeReady)) mono_assert(false, "The WebWorker is not attached to the runtime. See https://github.com/dotnet/runtime/blob/main/src/mono/wasm/threads.md#JS-interop-on-dedicated-threads"); // inlined mono_assert condition
    }
    else {
        if (!(runtimeHelpers.runtimeReady)) mono_assert(false, ".NET runtime didn't start yet. Please call dotnet.create() first."); // inlined mono_assert condition
    }
}
function installUnhandledErrorHandler() {
    // it seems that emscripten already does the right thing for NodeJs and that there is no good solution for V8 shell.
    if (ENVIRONMENT_IS_WEB) {
        globalThis.addEventListener("unhandledrejection", unhandledrejection_handler);
        globalThis.addEventListener("error", error_handler);
    }
}
function uninstallUnhandledErrorHandler() {
    if (ENVIRONMENT_IS_WEB) {
        globalThis.removeEventListener("unhandledrejection", unhandledrejection_handler);
        globalThis.removeEventListener("error", error_handler);
    }
}
let originalOnAbort;
let originalOnExit;
function registerEmscriptenExitHandlers() {
    originalOnAbort = emscriptenModule.onAbort;
    originalOnExit = emscriptenModule.onExit;
    emscriptenModule.onAbort = onAbort;
    emscriptenModule.onExit = onExit;
}
function unregisterEmscriptenExitHandlers() {
    if (emscriptenModule.onAbort == onAbort) {
        emscriptenModule.onAbort = originalOnAbort;
    }
    if (emscriptenModule.onExit == onExit) {
        emscriptenModule.onExit = originalOnExit;
    }
}
function onExit(code) {
    if (originalOnExit) {
        originalOnExit(code);
    }
    mono_exit(code, loaderHelpers.exitReason);
}
function onAbort(reason) {
    var _a;
    if (originalOnAbort) {
        originalOnAbort(reason || loaderHelpers.exitReason);
    }
    if (WasmEnableThreads && ((_a = loaderHelpers.config) === null || _a === void 0 ? void 0 : _a.dumpThreadsOnNonZeroExit) && runtimeHelpers.mono_wasm_print_thread_dump && loaderHelpers.exitCode === undefined) {
        try {
            runtimeHelpers.mono_wasm_print_thread_dump();
        }
        catch (e) {
            // ignore
        }
    }
    mono_exit(1, reason || loaderHelpers.exitReason);
}
// this will also call mono_wasm_exit if available, which will call exitJS -> _proc_exit -> terminateAllThreads
function mono_exit(exit_code, reason) {
    var _a, _b;
    // unify shape of the reason object
    const is_object = reason && typeof reason === "object";
    exit_code = (is_object && typeof reason.status === "number")
        ? reason.status
        : exit_code === undefined
            ? -1
            : exit_code;
    const message = (is_object && typeof reason.message === "string")
        ? reason.message
        : "" + reason;
    reason = is_object
        ? reason
        : (runtimeHelpers.ExitStatus
            ? createExitStatus(exit_code, message)
            : new Error("Exit with code " + exit_code + " " + message));
    reason.status = exit_code;
    if (!reason.message) {
        reason.message = message;
    }
    // force stack property to be generated before we shut down managed code, or create current stack if it doesn't exist
    const stack = "" + (reason.stack || (new Error().stack));
    try {
        Object.defineProperty(reason, "stack", {
            get: () => stack
        });
    }
    catch (e) {
        // ignore
    }
    // don't report this error twice
    const alreadySilent = !!reason.silent;
    reason.silent = true;
    if (!is_exited()) {
        try {
            unregisterEmscriptenExitHandlers();
            uninstallUnhandledErrorHandler();
            if (!runtimeHelpers.runtimeReady) {
                if (loaderHelpers.diagnosticTracing) mono_log_debug(`abort_startup, reason: ${reason}`); // inlined mono_log_debug condition
                abort_promises(reason);
            }
            else {
                if (runtimeHelpers.jiterpreter_dump_stats) {
                    runtimeHelpers.jiterpreter_dump_stats(false);
                }
                if (exit_code === 0 && ((_a = loaderHelpers.config) === null || _a === void 0 ? void 0 : _a.interopCleanupOnExit)) {
                    runtimeHelpers.forceDisposeProxies(true, true);
                }
                if (WasmEnableThreads && exit_code !== 0 && ((_b = loaderHelpers.config) === null || _b === void 0 ? void 0 : _b.dumpThreadsOnNonZeroExit)) {
                    runtimeHelpers.dumpThreads();
                }
            }
        }
        catch (err) {
            mono_log_warn("mono_exit A failed", err);
            // don't propagate any failures
        }
        try {
            if (!alreadySilent) {
                logOnExit(exit_code, reason);
                appendElementOnExit(exit_code);
            }
        }
        catch (err) {
            mono_log_warn("mono_exit B failed", err);
            // don't propagate any failures
        }
        loaderHelpers.exitCode = exit_code;
        if (!loaderHelpers.exitReason) {
            loaderHelpers.exitReason = reason;
        }
        if (!ENVIRONMENT_IS_WORKER && runtimeHelpers.runtimeReady) {
            emscriptenModule.runtimeKeepalivePop();
        }
    }
    else {
        if (loaderHelpers.diagnosticTracing) mono_log_debug("mono_exit called after exit"); // inlined mono_log_debug condition
    }
    if (loaderHelpers.config && loaderHelpers.config.asyncFlushOnExit && exit_code === 0) {
        // this would NOT call Node's exit() immediately, it's a hanging promise
        (async () => {
            try {
                await flush_node_streams();
            }
            finally {
                set_exit_code_and_quit_now(exit_code, reason);
            }
        })();
        // we need to throw, rather than let the caller continue the normal execution
        // in the middle of some code, which expects this to stop the process
        throw reason;
    }
    else {
        set_exit_code_and_quit_now(exit_code, reason);
    }
}
function set_exit_code_and_quit_now(exit_code, reason) {
    if (WasmEnableThreads && ENVIRONMENT_IS_WORKER && runtimeHelpers.runtimeReady && runtimeHelpers.nativeAbort) {
        // note that the reason is not passed to UI thread
        runtimeHelpers.nativeAbort(reason);
        throw reason;
    }
    if (runtimeHelpers.runtimeReady && runtimeHelpers.nativeExit) {
        try {
            runtimeHelpers.nativeExit(exit_code);
        }
        catch (error) {
            if (runtimeHelpers.ExitStatus && !(error instanceof runtimeHelpers.ExitStatus)) {
                mono_log_warn("set_exit_code_and_quit_now failed: " + error.toString());
            }
        }
    }
    // just in case mono_wasm_exit didn't exit or throw
    if (exit_code !== 0 || !ENVIRONMENT_IS_WEB) {
        if (ENVIRONMENT_IS_NODE && INTERNAL.process) {
            INTERNAL.process.exit(exit_code);
        }
        else if (runtimeHelpers.quit) {
            runtimeHelpers.quit(exit_code, reason);
        }
        throw reason;
    }
}
async function flush_node_streams() {
    try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        const process = await import(/*! webpackIgnore: true */ 'process');
        const flushStream = (stream) => {
            return new Promise((resolve, reject) => {
                stream.on("error", reject);
                stream.end("", "utf8", resolve);
            });
        };
        const stderrFlushed = flushStream(process.stderr);
        const stdoutFlushed = flushStream(process.stdout);
        let timeoutId;
        const timeout = new Promise(resolve => {
            timeoutId = setTimeout(() => resolve("timeout"), 1000);
        });
        await Promise.race([Promise.all([stdoutFlushed, stderrFlushed]), timeout]);
        clearTimeout(timeoutId);
    }
    catch (err) {
        mono_log_error(`flushing std* streams failed: ${err}`);
    }
}
function abort_promises(reason) {
    loaderHelpers.allDownloadsQueued.promise_control.reject(reason);
    loaderHelpers.allDownloadsFinished.promise_control.reject(reason);
    loaderHelpers.afterConfigLoaded.promise_control.reject(reason);
    loaderHelpers.wasmCompilePromise.promise_control.reject(reason);
    loaderHelpers.runtimeModuleLoaded.promise_control.reject(reason);
    if (runtimeHelpers.dotnetReady) {
        runtimeHelpers.dotnetReady.promise_control.reject(reason);
        runtimeHelpers.afterInstantiateWasm.promise_control.reject(reason);
        runtimeHelpers.beforePreInit.promise_control.reject(reason);
        runtimeHelpers.afterPreInit.promise_control.reject(reason);
        runtimeHelpers.afterPreRun.promise_control.reject(reason);
        runtimeHelpers.beforeOnRuntimeInitialized.promise_control.reject(reason);
        runtimeHelpers.afterOnRuntimeInitialized.promise_control.reject(reason);
        runtimeHelpers.afterPostRun.promise_control.reject(reason);
    }
}
function appendElementOnExit(exit_code) {
    if (ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER && loaderHelpers.config && loaderHelpers.config.appendElementOnExit && document) {
        //Tell xharness WasmBrowserTestRunner what was the exit code
        const tests_done_elem = document.createElement("label");
        tests_done_elem.id = "tests_done";
        if (exit_code !== 0)
            tests_done_elem.style.background = "red";
        tests_done_elem.innerHTML = "" + exit_code;
        document.body.appendChild(tests_done_elem);
    }
}
function logOnExit(exit_code, reason) {
    if (exit_code !== 0 && reason) {
        // ExitStatus usually is not real JS error and so stack strace is not very useful.
        // We will use debug level for it, which will print only when diagnosticTracing is set.
        const mono_log = runtimeHelpers.ExitStatus && reason instanceof runtimeHelpers.ExitStatus
            ? mono_log_debug
            : mono_log_error;
        if (typeof reason == "string") {
            mono_log(reason);
        }
        else {
            if (reason.stack === undefined) {
                reason.stack = new Error().stack + "";
            }
            if (reason.message) {
                const message = runtimeHelpers.stringify_as_error_with_stack
                    ? runtimeHelpers.stringify_as_error_with_stack(reason.message + "\n" + reason.stack)
                    : reason.message + "\n" + reason.stack;
                mono_log(message);
            }
            else {
                mono_log(JSON.stringify(reason));
            }
        }
    }
    if (!ENVIRONMENT_IS_WORKER && loaderHelpers.config) {
        if (loaderHelpers.config.logExitCode) {
            if (loaderHelpers.config.forwardConsoleLogsToWS) {
                teardown_proxy_console("WASM EXIT " + exit_code);
            }
            else {
                mono_log_info_no_prefix("WASM EXIT " + exit_code);
            }
        }
        else if (loaderHelpers.config.forwardConsoleLogsToWS) {
            teardown_proxy_console();
        }
    }
}
function unhandledrejection_handler(event) {
    fatal_handler(event, event.reason, "rejection");
}
function error_handler(event) {
    fatal_handler(event, event.error, "error");
}
function fatal_handler(event, reason, type) {
    event.preventDefault();
    try {
        if (!reason) {
            reason = new Error("Unhandled " + type);
        }
        if (reason.stack === undefined) {
            reason.stack = new Error().stack;
        }
        reason.stack = reason.stack + ""; // string conversion (it could be getter)
        if (!reason.silent) {
            mono_log_error("Unhandled error:", reason);
            mono_exit(1, reason);
        }
    }
    catch (err) {
        // no not re-throw from the fatal handler
    }
}
function createExitStatus(status, message) {
    const ex = new runtimeHelpers.ExitStatus(status);
    ex.message = message;
    ex.toString = () => message;
    return ex;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function setupPreloadChannelToMainThread() {
    const channel = new MessageChannel();
    const workerPort = channel.port1;
    const mainPort = channel.port2;
    workerPort.addEventListener("message", (event) => {
        const config = JSON.parse(event.data.config);
        const monoThreadInfo = JSON.parse(event.data.monoThreadInfo);
        onMonoConfigReceived(config, monoThreadInfo);
        workerPort.close();
        mainPort.close();
    }, { once: true });
    workerPort.start();
    // ask for config even before WASM is loaded
    self.postMessage({
        [monoMessageSymbol]: {
            monoCmd: "preload" /* WorkerToMainMessageType.preload */,
            port: mainPort
        }
    }, [mainPort]);
}
let workerMonoConfigReceived = false;
// called when the main thread sends us the mono config
function onMonoConfigReceived(config, monoThreadInfo) {
    if (workerMonoConfigReceived) {
        if (loaderHelpers.diagnosticTracing) mono_log_debug("mono config already received"); // inlined mono_log_debug condition
        return;
    }
    deep_merge_config(loaderHelpers.config, config);
    runtimeHelpers.monoThreadInfo = monoThreadInfo;
    normalizeConfig();
    if (loaderHelpers.diagnosticTracing) mono_log_debug("mono config received"); // inlined mono_log_debug condition
    workerMonoConfigReceived = true;
    loaderHelpers.afterConfigLoaded.promise_control.resolve(loaderHelpers.config);
    if (ENVIRONMENT_IS_WEB && config.forwardConsoleLogsToWS && typeof globalThis.WebSocket != "undefined") {
        loaderHelpers.setup_proxy_console("worker-idle", console, globalThis.location.origin);
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
class HostBuilder {
    // internal
    withModuleConfig(moduleConfig) {
        try {
            deep_merge_module(emscriptenModule, moduleConfig);
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    withOnConfigLoaded(onConfigLoaded) {
        try {
            deep_merge_module(emscriptenModule, {
                onConfigLoaded
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    withConsoleForwarding() {
        try {
            deep_merge_config(monoConfig, {
                forwardConsoleLogsToWS: true
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    withExitOnUnhandledError() {
        try {
            deep_merge_config(monoConfig, {
                exitOnUnhandledError: true
            });
            installUnhandledErrorHandler();
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    withAsyncFlushOnExit() {
        try {
            deep_merge_config(monoConfig, {
                asyncFlushOnExit: true
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    withExitCodeLogging() {
        try {
            deep_merge_config(monoConfig, {
                logExitCode: true
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    withElementOnExit() {
        try {
            deep_merge_config(monoConfig, {
                appendElementOnExit: true
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    withInteropCleanupOnExit() {
        try {
            deep_merge_config(monoConfig, {
                interopCleanupOnExit: true
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    withDumpThreadsOnNonZeroExit() {
        try {
            deep_merge_config(monoConfig, {
                dumpThreadsOnNonZeroExit: true
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    // internal
    //  todo fallback later by debugLevel
    withWaitingForDebugger(level) {
        try {
            deep_merge_config(monoConfig, {
                waitForDebugger: level
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withInterpreterPgo(value, autoSaveDelay) {
        try {
            deep_merge_config(monoConfig, {
                interpreterPgo: value,
                interpreterPgoSaveDelay: autoSaveDelay
            });
            if (monoConfig.runtimeOptions)
                monoConfig.runtimeOptions.push("--interp-pgo-recording");
            else
                monoConfig.runtimeOptions = ["--interp-pgo-recording"];
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withConfig(config) {
        try {
            deep_merge_config(monoConfig, config);
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withConfigSrc(configSrc) {
        try {
            if (!(configSrc && typeof configSrc === "string")) mono_assert(false, "must be file path or URL"); // inlined mono_assert condition
            deep_merge_module(emscriptenModule, { configSrc });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withVirtualWorkingDirectory(vfsPath) {
        try {
            if (!(vfsPath && typeof vfsPath === "string")) mono_assert(false, "must be directory path"); // inlined mono_assert condition
            deep_merge_config(monoConfig, {
                virtualWorkingDirectory: vfsPath
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withEnvironmentVariable(name, value) {
        try {
            const environmentVariables = {};
            environmentVariables[name] = value;
            deep_merge_config(monoConfig, {
                environmentVariables
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withEnvironmentVariables(variables) {
        try {
            if (!(variables && typeof variables === "object")) mono_assert(false, "must be dictionary object"); // inlined mono_assert condition
            deep_merge_config(monoConfig, {
                environmentVariables: variables
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withDiagnosticTracing(enabled) {
        try {
            if (!(typeof enabled === "boolean")) mono_assert(false, "must be boolean"); // inlined mono_assert condition
            deep_merge_config(monoConfig, {
                diagnosticTracing: enabled
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withDebugging(level) {
        try {
            if (!(level !== undefined && level !== null && typeof level === "number")) mono_assert(false, "must be number"); // inlined mono_assert condition
            deep_merge_config(monoConfig, {
                debugLevel: level
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withApplicationArguments(...args) {
        try {
            if (!(args && Array.isArray(args))) mono_assert(false, "must be array of strings"); // inlined mono_assert condition
            deep_merge_config(monoConfig, {
                applicationArguments: args
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withRuntimeOptions(runtimeOptions) {
        try {
            if (!(runtimeOptions && Array.isArray(runtimeOptions))) mono_assert(false, "must be array of strings"); // inlined mono_assert condition
            if (monoConfig.runtimeOptions)
                monoConfig.runtimeOptions.push(...runtimeOptions);
            else
                monoConfig.runtimeOptions = runtimeOptions;
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withMainAssembly(mainAssemblyName) {
        try {
            deep_merge_config(monoConfig, {
                mainAssemblyName
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withApplicationArgumentsFromQuery() {
        try {
            if (!globalThis.window) {
                throw new Error("Missing window to the query parameters from");
            }
            if (typeof globalThis.URLSearchParams == "undefined") {
                throw new Error("URLSearchParams is supported");
            }
            const params = new URLSearchParams(globalThis.window.location.search);
            const values = params.getAll("arg");
            return this.withApplicationArguments(...values);
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withApplicationEnvironment(applicationEnvironment) {
        try {
            deep_merge_config(monoConfig, {
                applicationEnvironment,
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withApplicationCulture(applicationCulture) {
        try {
            deep_merge_config(monoConfig, {
                applicationCulture,
            });
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    withResourceLoader(loadBootResource) {
        try {
            loaderHelpers.loadBootResource = loadBootResource;
            return this;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    async download() {
        try {
            await downloadOnly();
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    async create() {
        try {
            if (!this.instance) {
                this.instance = await createApi();
            }
            return this.instance;
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
    async run() {
        try {
            if (!(emscriptenModule.config)) mono_assert(false, "Null moduleConfig.config"); // inlined mono_assert condition
            if (!this.instance) {
                await this.create();
            }
            return this.instance.runMainAndExit();
        }
        catch (err) {
            mono_exit(1, err);
            throw err;
        }
    }
}
async function createApi() {
    await createEmscripten(emscriptenModule);
    return globalObjectsRoot.api;
}
let emscriptenPrepared = false;
async function prepareEmscripten(moduleFactory) {
    if (emscriptenPrepared) {
        return;
    }
    emscriptenPrepared = true;
    if (ENVIRONMENT_IS_WEB && loaderHelpers.config.forwardConsoleLogsToWS && typeof globalThis.WebSocket != "undefined") {
        setup_proxy_console("main", globalThis.console, globalThis.location.origin);
    }
    if (!(emscriptenModule)) mono_assert(false, "Null moduleConfig"); // inlined mono_assert condition
    if (!(loaderHelpers.config)) mono_assert(false, "Null moduleConfig.config"); // inlined mono_assert condition
    // extract ModuleConfig
    if (typeof moduleFactory === "function") {
        const extension = moduleFactory(globalObjectsRoot.api);
        if (extension.ready) {
            throw new Error("Module.ready couldn't be redefined.");
        }
        Object.assign(emscriptenModule, extension);
        deep_merge_module(emscriptenModule, extension);
    }
    else if (typeof moduleFactory === "object") {
        deep_merge_module(emscriptenModule, moduleFactory);
    }
    else {
        throw new Error("Can't use moduleFactory callback of createDotnetRuntime function.");
    }
    await detect_features_and_polyfill(emscriptenModule);
}
async function createEmscripten(moduleFactory) {
    await prepareEmscripten(moduleFactory);
    if (BuildConfiguration === "Debug" && !ENVIRONMENT_IS_WORKER) {
        mono_log_info(`starting script ${loaderHelpers.scriptUrl}`);
        mono_log_info(`starting in ${loaderHelpers.scriptDirectory}`);
    }
    registerEmscriptenExitHandlers();
    return emscriptenModule.ENVIRONMENT_IS_PTHREAD
        ? createEmscriptenWorker()
        : createEmscriptenMain();
}
let jsModuleRuntimePromise;
let jsModuleNativePromise;
let jsModuleDiagnosticPromise;
// in the future we can use feature detection to load different flavors
function importModules() {
    const jsModuleRuntimeAsset = resolve_single_asset_path("js-module-runtime");
    const jsModuleNativeAsset = resolve_single_asset_path("js-module-native");
    if (jsModuleRuntimePromise && jsModuleNativePromise) {
        return [jsModuleRuntimePromise, jsModuleNativePromise, jsModuleDiagnosticPromise];
    }
    if (typeof jsModuleRuntimeAsset.moduleExports === "object") {
        jsModuleRuntimePromise = jsModuleRuntimeAsset.moduleExports;
    }
    else {
        if (loaderHelpers.diagnosticTracing) mono_log_debug(`Attempting to import '${jsModuleRuntimeAsset.resolvedUrl}' for ${jsModuleRuntimeAsset.name}`); // inlined mono_log_debug condition
        jsModuleRuntimePromise = import(/*! webpackIgnore: true */ jsModuleRuntimeAsset.resolvedUrl);
    }
    if (typeof jsModuleNativeAsset.moduleExports === "object") {
        jsModuleNativePromise = jsModuleNativeAsset.moduleExports;
    }
    else {
        if (loaderHelpers.diagnosticTracing) mono_log_debug(`Attempting to import '${jsModuleNativeAsset.resolvedUrl}' for ${jsModuleNativeAsset.name}`); // inlined mono_log_debug condition
        jsModuleNativePromise = import(/*! webpackIgnore: true */ jsModuleNativeAsset.resolvedUrl);
    }
    const jsModuleDiagnosticAsset = try_resolve_single_asset_path("js-module-diagnostics");
    if (jsModuleDiagnosticAsset) {
        if (typeof jsModuleDiagnosticAsset.moduleExports === "object") {
            jsModuleDiagnosticPromise = jsModuleDiagnosticAsset.moduleExports;
        }
        else {
            if (loaderHelpers.diagnosticTracing) mono_log_debug(`Attempting to import '${jsModuleDiagnosticAsset.resolvedUrl}' for ${jsModuleDiagnosticAsset.name}`); // inlined mono_log_debug condition
            jsModuleDiagnosticPromise = import(/*! webpackIgnore: true */ jsModuleDiagnosticAsset.resolvedUrl);
        }
    }
    return [jsModuleRuntimePromise, jsModuleNativePromise, jsModuleDiagnosticPromise];
}
async function initializeModules(es6Modules) {
    const { initializeExports, initializeReplacements, configureRuntimeStartup, configureEmscriptenStartup, configureWorkerStartup, setRuntimeGlobals, passEmscriptenInternals } = es6Modules[0];
    const { default: emscriptenFactory } = es6Modules[1];
    const diagnosticModule = es6Modules[2];
    setRuntimeGlobals(globalObjectsRoot);
    initializeExports(globalObjectsRoot);
    if (diagnosticModule) {
        diagnosticModule.setRuntimeGlobals(globalObjectsRoot);
    }
    await configureRuntimeStartup(emscriptenModule);
    loaderHelpers.runtimeModuleLoaded.promise_control.resolve();
    const result = emscriptenFactory((originalModule) => {
        Object.assign(emscriptenModule, {
            ready: originalModule.ready,
            __dotnet_runtime: {
                initializeReplacements, configureEmscriptenStartup, configureWorkerStartup, passEmscriptenInternals
            }
        });
        return emscriptenModule;
    });
    result.catch((error) => {
        if (error.message && error.message.toLowerCase().includes("out of memory")) {
            throw new Error(".NET runtime has failed to start, because too much memory was requested. Please decrease the memory by adjusting EmccMaximumHeapSize. See also https://aka.ms/dotnet-wasm-features");
        }
        throw error;
    });
}
async function downloadOnly() {
    prepareEmscripten(emscriptenModule);
    // download config
    await mono_wasm_load_config(emscriptenModule);
    prepareAssets();
    await initCacheToUseIfEnabled();
    init_globalization();
    mono_download_assets(); // intentionally not awaited
    await loaderHelpers.allDownloadsFinished.promise;
}
async function createEmscriptenMain() {
    var _a;
    // download config
    await mono_wasm_load_config(emscriptenModule);
    prepareAssets();
    const promises = importModules();
    await initCacheToUseIfEnabled();
    streamingCompileWasm(); // intentionally not awaited
    setTimeout(async () => {
        try {
            init_globalization();
            preloadWorkers();
            await mono_download_assets();
        }
        catch (err) {
            mono_exit(1, err);
        }
    }, 0);
    const es6Modules = await Promise.all(promises);
    await initializeModules(es6Modules);
    await runtimeHelpers.dotnetReady.promise;
    await importLibraryInitializers((_a = loaderHelpers.config.resources) === null || _a === void 0 ? void 0 : _a.modulesAfterRuntimeReady);
    await invokeLibraryInitializers("onRuntimeReady", [globalObjectsRoot.api]);
    return exportedRuntimeAPI;
}
async function createEmscriptenWorker() {
    setupPreloadChannelToMainThread();
    await loaderHelpers.afterConfigLoaded.promise;
    prepareAssetsWorker();
    setTimeout(async () => {
        try {
            // load subset which is on JS heap rather than in WASM linear memory
            await mono_download_assets();
        }
        catch (err) {
            mono_exit(1, err);
        }
    }, 0);
    const promises = importModules();
    const es6Modules = await Promise.all(promises);
    await initializeModules(es6Modules);
    return emscriptenModule;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// export external API
const dotnet = new HostBuilder();
const exit = mono_exit;
const legacyEntrypoint = createEmscripten;
verifyEnvironment();

export { legacyEntrypoint as default, dotnet, exit };
//# sourceMappingURL=dotnet.js.map
