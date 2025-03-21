// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/* eslint-disable no-undef */

"use strict";

// -- this javascript file is evaluated by emcc during compilation! --

// because we can't pass custom define symbols to acorn optimizer, we use environment variables to pass other build options
const WASM_ENABLE_SIMD = process.env.WASM_ENABLE_SIMD === "1";
const WASM_PERFTRACING = process.env.WASM_PERFTRACING === "1";
const WASM_ENABLE_EH = process.env.WASM_ENABLE_EH === "1";
const ENABLE_BROWSER_PROFILER = process.env.ENABLE_BROWSER_PROFILER === "1";
const ENABLE_AOT_PROFILER = process.env.ENABLE_AOT_PROFILER === "1";
const ENABLE_LOG_PROFILER = process.env.ENABLE_LOG_PROFILER === "1";
const RUN_AOT_COMPILATION = process.env.RUN_AOT_COMPILATION === "1";
var methodIndexByName = undefined;
var gitHash = undefined;

function setup(emscriptenBuildOptions) {
    // USE_PTHREADS is emscripten's define symbol, which is passed to acorn optimizer, so we could use it here
    #if USE_PTHREADS
    const modulePThread = PThread;
    #else
    const modulePThread = {};
    const ENVIRONMENT_IS_PTHREAD = false;
    #endif
    const dotnet_replacements = {
        fetch: globalThis.fetch,
        ENVIRONMENT_IS_WORKER,
        require,
        modulePThread,
        scriptDirectory,
    };

    ENVIRONMENT_IS_WORKER = dotnet_replacements.ENVIRONMENT_IS_WORKER;
    Module.__dotnet_runtime.initializeReplacements(dotnet_replacements);
    noExitRuntime = dotnet_replacements.noExitRuntime;
    fetch = dotnet_replacements.fetch;
    require = dotnet_replacements.require;
    _scriptDir = __dirname = scriptDirectory = dotnet_replacements.scriptDirectory;
    Module.__dotnet_runtime.passEmscriptenInternals({
        isPThread: ENVIRONMENT_IS_PTHREAD,
        quit_, ExitStatus,
        updateMemoryViews,
        getMemory: () => { return wasmMemory; },
        getWasmIndirectFunctionTable: () => { return wasmTable; },
    }, emscriptenBuildOptions);

    #if USE_PTHREADS
    if (ENVIRONMENT_IS_PTHREAD) {
        Module.config = {};
        Module.__dotnet_runtime.configureWorkerStartup(Module);
    } else {
        #endif
        Module.__dotnet_runtime.configureEmscriptenStartup(Module);
        #if USE_PTHREADS
    }
    #endif
}

const DotnetSupportLib = {
    $DOTNET: { setup },
    icudt68_dat: function () { throw new Error('dummy link symbol') },
};

function createWasmImportStubsFrom(collection) {
    for (let functionName in collection) {
        if (functionName in DotnetSupportLib) throw new Error(`Function ${functionName} is already defined`);
        const runtime_idx = collection[functionName]
        const stub_fn = new Function(`return {runtime_idx:${runtime_idx}};//${functionName}`);
        DotnetSupportLib[functionName] = stub_fn;
    }
}

// the JS methods would be visible to EMCC linker and become imports of the WASM module
// we generate simple stub for each exported function so that emcc will include them in the final output
// we will replace them with the real implementation in replace_linker_placeholders
function injectDependencies() {
    createWasmImportStubsFrom(methodIndexByName.mono_wasm_imports);

    #if USE_PTHREADS
    createWasmImportStubsFrom(methodIndexByName.mono_wasm_threads_imports);
    #endif

    DotnetSupportLib["$DOTNET__postset"] = `DOTNET.setup({ ` +
        `wasmEnableSIMD: ${WASM_ENABLE_SIMD},` +
        `wasmEnableEH: ${WASM_ENABLE_EH},` +
        `enableAotProfiler: ${ENABLE_AOT_PROFILER}, ` +
        `enableBrowserProfiler: ${ENABLE_BROWSER_PROFILER}, ` +
        `enableLogProfiler: ${ENABLE_LOG_PROFILER}, ` +
        `enablePerfTracing: ${WASM_PERFTRACING}, ` +
        `runAOTCompilation: ${RUN_AOT_COMPILATION}, ` +
        `wasmEnableThreads: ${!!USE_PTHREADS}, ` +
        `gitHash: "${gitHash}", ` +
        `});`;

    autoAddDeps(DotnetSupportLib, "$DOTNET");
    mergeInto(LibraryManager.library, DotnetSupportLib);
}


// var methodIndexByName wil be appended below by the MSBuild in browser.proj via exports-linker.ts
var gitHash = "cbd1569a3d4c5c2412cdc8e1510ef90c297e2bf5";
var methodIndexByName = {
"mono_wasm_imports": {
"mono_wasm_schedule_timer": 0,
"mono_wasm_asm_loaded": 1,
"mono_wasm_debugger_log": 2,
"mono_wasm_add_dbg_command_received": 3,
"mono_wasm_fire_debugger_agent_message_with_data": 4,
"mono_wasm_fire_debugger_agent_message_with_data_to_pause": 5,
"schedule_background_exec": 6,
"mono_interp_tier_prepare_jiterpreter": 7,
"mono_interp_record_interp_entry": 8,
"mono_interp_jit_wasm_entry_trampoline": 9,
"mono_interp_jit_wasm_jit_call_trampoline": 10,
"mono_interp_invoke_wasm_jit_call_trampoline": 11,
"mono_interp_flush_jitcall_queue": 12,
"mono_wasm_free_method_data": 13,
"mono_wasm_instrument_method": 14,
"mono_wasm_profiler_now": 15,
"mono_wasm_profiler_record": 16,
"mono_wasm_trace_logger": 17,
"mono_wasm_set_entrypoint_breakpoint": 18,
"mono_wasm_browser_entropy": 19,
"mono_wasm_console_clear": 20,
"mono_wasm_release_cs_owned_object": 21,
"mono_wasm_bind_js_import_ST": 22,
"mono_wasm_invoke_js_function": 23,
"mono_wasm_invoke_jsimport_ST": 24,
"mono_wasm_resolve_or_reject_promise": 25,
"mono_wasm_cancel_promise": 26,
"mono_wasm_get_locale_info": 27,
"ds_rt_websocket_create": 28,
"ds_rt_websocket_send": 29,
"ds_rt_websocket_poll": 30,
"ds_rt_websocket_recv": 31,
"ds_rt_websocket_close": 32
},
"mono_wasm_threads_imports": {}
};
injectDependencies();
