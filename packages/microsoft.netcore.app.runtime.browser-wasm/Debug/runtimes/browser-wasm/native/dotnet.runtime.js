//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.

var ProductVersion = "10.0.0-dev";

var BuildConfiguration = "Debug";

var WasmEnableThreads = false;

var WasmEnableSIMD = true;

var WasmEnableExceptionHandling = true;

var gitHash = "cbd1569a3d4c5c2412cdc8e1510ef90c297e2bf5";

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const threading_cwraps = WasmEnableThreads ? [
    [false, "mono_wasm_init_finalizer_thread", null, []],
    [false, "mono_wasm_invoke_jsexport_async_post", "void", ["number", "number", "number"]],
    [false, "mono_wasm_invoke_jsexport_sync_send", "void", ["number", "number", "number"]],
    [false, "mono_wasm_invoke_jsexport_sync", "void", ["number", "number"]],
    [true, "mono_wasm_create_deputy_thread", "number", []],
    [true, "mono_wasm_create_io_thread", "number", []],
    [true, "mono_wasm_register_ui_thread", "void", []],
    [true, "mono_wasm_register_io_thread", "void", []],
    [true, "mono_wasm_print_thread_dump", "void", []],
    [true, "mono_wasm_synchronization_context_pump", "void", []],
    [true, "mono_threads_wasm_sync_run_in_target_thread_done", "void", ["number"]],
] : [];
// when the method is assigned/cached at usage, instead of being invoked directly from cwraps, it can't be marked lazy, because it would be re-bound on each call
const fn_signatures = [
    [true, "mono_wasm_register_root", "number", ["number", "number", "string"]],
    [true, "mono_wasm_deregister_root", null, ["number"]],
    [true, "mono_wasm_string_get_data_ref", null, ["number", "number", "number", "number"]],
    [true, "mono_wasm_set_is_debugger_attached", "void", ["bool"]],
    [true, "mono_wasm_send_dbg_command", "bool", ["number", "number", "number", "number", "number"]],
    [true, "mono_wasm_send_dbg_command_with_parms", "bool", ["number", "number", "number", "number", "number", "number", "string"]],
    [true, "mono_wasm_setenv", null, ["string", "string"]],
    [true, "mono_wasm_parse_runtime_options", null, ["number", "number"]],
    [true, "mono_wasm_strdup", "number", ["string"]],
    [true, "mono_background_exec", null, []],
    [true, "mono_wasm_ds_exec", null, []],
    [true, "mono_wasm_execute_timer", null, []],
    [true, "mono_wasm_load_icu_data", "number", ["number"]],
    [false, "mono_wasm_add_assembly", "number", ["string", "number", "number"]],
    [true, "mono_wasm_add_satellite_assembly", "void", ["string", "string", "number", "number"]],
    [false, "mono_wasm_load_runtime", null, ["number"]],
    [true, "mono_wasm_change_debugger_log_level", "void", ["number"]],
    [true, "mono_wasm_assembly_load", "number", ["string"]],
    [true, "mono_wasm_assembly_find_class", "number", ["number", "string", "string"]],
    [true, "mono_wasm_assembly_find_method", "number", ["number", "string", "number"]],
    [true, "mono_wasm_string_from_utf16_ref", "void", ["number", "number", "number"]],
    [true, "mono_wasm_intern_string_ref", "void", ["number"]],
    [false, "mono_wasm_exit", "void", ["number"]],
    [true, "mono_wasm_getenv", "number", ["string"]],
    [true, "mono_wasm_set_main_args", "void", ["number", "number"]],
    // These three need to be lazy because they may be missing
    [() => !runtimeHelpers.emscriptenBuildOptions.enableAotProfiler, "mono_wasm_profiler_init_aot", "void", ["string"]],
    [() => !runtimeHelpers.emscriptenBuildOptions.enableBrowserProfiler, "mono_wasm_profiler_init_browser", "void", ["string"]],
    [() => !runtimeHelpers.emscriptenBuildOptions.enableLogProfiler, "mono_wasm_profiler_init_log", "void", ["string"]],
    [false, "mono_wasm_exec_regression", "number", ["number", "string"]],
    [false, "mono_wasm_invoke_jsexport", "void", ["number", "number"]],
    [true, "mono_wasm_write_managed_pointer_unsafe", "void", ["number", "number"]],
    [true, "mono_wasm_copy_managed_pointer", "void", ["number", "number"]],
    [true, "mono_wasm_i52_to_f64", "number", ["number", "number"]],
    [true, "mono_wasm_u52_to_f64", "number", ["number", "number"]],
    [true, "mono_wasm_f64_to_i52", "number", ["number", "number"]],
    [true, "mono_wasm_f64_to_u52", "number", ["number", "number"]],
    [true, "mono_wasm_method_get_name", "number", ["number"]],
    [true, "mono_wasm_method_get_name_ex", "number", ["number"]],
    [true, "mono_wasm_method_get_full_name", "number", ["number"]],
    [true, "mono_wasm_gc_lock", "void", []],
    [true, "mono_wasm_gc_unlock", "void", []],
    [true, "mono_wasm_get_i32_unaligned", "number", ["number"]],
    [true, "mono_wasm_get_f32_unaligned", "number", ["number"]],
    [true, "mono_wasm_get_f64_unaligned", "number", ["number"]],
    [true, "mono_wasm_read_as_bool_or_null_unsafe", "number", ["number"]],
    // jiterpreter
    [true, "mono_jiterp_trace_bailout", "void", ["number"]],
    [true, "mono_jiterp_get_trace_bailout_count", "number", ["number"]],
    [true, "mono_jiterp_value_copy", "void", ["number", "number", "number"]],
    [true, "mono_jiterp_get_member_offset", "number", ["number"]],
    [true, "mono_jiterp_encode_leb52", "number", ["number", "number", "number"]],
    [true, "mono_jiterp_encode_leb64_ref", "number", ["number", "number", "number"]],
    [true, "mono_jiterp_encode_leb_signed_boundary", "number", ["number", "number", "number"]],
    [true, "mono_jiterp_write_number_unaligned", "void", ["number", "number", "number"]],
    [true, "mono_jiterp_type_is_byref", "number", ["number"]],
    [true, "mono_jiterp_get_size_of_stackval", "number", []],
    [true, "mono_jiterp_parse_option", "number", ["string"]],
    [true, "mono_jiterp_get_options_as_json", "number", []],
    [true, "mono_jiterp_get_option_as_int", "number", ["string"]],
    [true, "mono_jiterp_get_options_version", "number", []],
    [true, "mono_jiterp_adjust_abort_count", "number", ["number", "number"]],
    [true, "mono_jiterp_register_jit_call_thunk", "void", ["number", "number"]],
    [true, "mono_jiterp_type_get_raw_value_size", "number", ["number"]],
    [true, "mono_jiterp_get_signature_has_this", "number", ["number"]],
    [true, "mono_jiterp_get_signature_return_type", "number", ["number"]],
    [true, "mono_jiterp_get_signature_param_count", "number", ["number"]],
    [true, "mono_jiterp_get_signature_params", "number", ["number"]],
    [true, "mono_jiterp_type_to_ldind", "number", ["number"]],
    [true, "mono_jiterp_type_to_stind", "number", ["number"]],
    [true, "mono_jiterp_imethod_to_ftnptr", "number", ["number"]],
    [true, "mono_jiterp_debug_count", "number", []],
    [true, "mono_jiterp_get_trace_hit_count", "number", ["number"]],
    [true, "mono_jiterp_get_polling_required_address", "number", []],
    [true, "mono_jiterp_get_rejected_trace_count", "number", []],
    [true, "mono_jiterp_boost_back_branch_target", "void", ["number"]],
    [true, "mono_jiterp_is_imethod_var_address_taken", "number", ["number", "number"]],
    [true, "mono_jiterp_get_opcode_value_table_entry", "number", ["number"]],
    [true, "mono_jiterp_get_simd_intrinsic", "number", ["number", "number"]],
    [true, "mono_jiterp_get_simd_opcode", "number", ["number", "number"]],
    [true, "mono_jiterp_get_arg_offset", "number", ["number", "number", "number"]],
    [true, "mono_jiterp_get_opcode_info", "number", ["number", "number"]],
    [true, "mono_wasm_is_zero_page_reserved", "number", []],
    [true, "mono_jiterp_is_special_interface", "number", ["number"]],
    [true, "mono_jiterp_initialize_table", "void", ["number", "number", "number"]],
    [true, "mono_jiterp_allocate_table_entry", "number", ["number"]],
    [true, "mono_jiterp_get_interp_entry_func", "number", ["number"]],
    [true, "mono_jiterp_get_counter", "number", ["number"]],
    [true, "mono_jiterp_modify_counter", "number", ["number", "number"]],
    [true, "mono_jiterp_tlqueue_next", "number", ["number"]],
    [true, "mono_jiterp_tlqueue_add", "number", ["number", "number"]],
    [true, "mono_jiterp_tlqueue_clear", "void", ["number"]],
    [true, "mono_jiterp_begin_catch", "void", ["number"]],
    [true, "mono_jiterp_end_catch", "void", []],
    [true, "mono_interp_pgo_load_table", "number", ["number", "number"]],
    [true, "mono_interp_pgo_save_table", "number", ["number", "number"]],
    [() => !runtimeHelpers.emscriptenBuildOptions.enablePerfTracing && !runtimeHelpers.emscriptenBuildOptions.enableBrowserProfiler, "mono_jiterp_prof_enter", "void", ["number", "number"]],
    [() => !runtimeHelpers.emscriptenBuildOptions.enablePerfTracing && !runtimeHelpers.emscriptenBuildOptions.enableBrowserProfiler, "mono_jiterp_prof_samplepoint", "void", ["number", "number"]],
    [() => !runtimeHelpers.emscriptenBuildOptions.enablePerfTracing && !runtimeHelpers.emscriptenBuildOptions.enableBrowserProfiler, "mono_jiterp_prof_leave", "void", ["number", "number"]],
    ...threading_cwraps,
];
const wrapped_c_functions = {};
const threads_c_functions = wrapped_c_functions;
const profiler_c_functions = wrapped_c_functions;
const fastCwrapTypes = ["void", "number", null];
function cwrap(name, returnType, argTypes, opts) {
    // Attempt to bypass emscripten's generated wrapper if it is safe to do so
    let fce = 
    // Special cwrap options disable the fast path
    (typeof (opts) === "undefined") &&
        // Only attempt to do fast calls if all the args and the return type are either number or void
        (fastCwrapTypes.indexOf(returnType) >= 0) &&
        (!argTypes || argTypes.every(atype => fastCwrapTypes.indexOf(atype) >= 0)) &&
        // Module["wasmExports"] may not be defined yet if we are early enough in the startup process
        //  in that case, we need to rely on emscripten's lazy wrappers
        Module["wasmExports"]
        ? (Module["wasmExports"][name])
        : undefined;
    // If the argument count for the wasm function doesn't match the signature, fall back to cwrap
    if (fce && argTypes && (fce.length !== argTypes.length)) {
        mono_log_error(`argument count mismatch for cwrap ${name}`);
        fce = undefined;
    }
    // We either failed to find the raw wasm func or for some reason we can't use it directly
    if (typeof (fce) !== "function")
        fce = Module.cwrap(name, returnType, argTypes, opts);
    if (typeof (fce) !== "function") {
        const msg = `cwrap ${name} not found or not a function`;
        throw new Error(msg);
    }
    return fce;
}
function init_c_exports() {
    const fns = [...fn_signatures];
    for (const sig of fns) {
        const wf = wrapped_c_functions;
        const [lazyOrSkip, name, returnType, argTypes, opts] = sig;
        const maybeSkip = typeof lazyOrSkip === "function";
        if (lazyOrSkip === true || maybeSkip) {
            // lazy init on first run
            wf[name] = function (...args) {
                const isNotSkipped = !maybeSkip || !lazyOrSkip();
                if (!(isNotSkipped)) mono_assert(false, `cwrap ${name} should not be called when binding was skipped`); // inlined mono_assert condition
                const fce = cwrap(name, returnType, argTypes, opts);
                wf[name] = fce;
                return fce(...args);
            };
        }
        else {
            const fce = cwrap(name, returnType, argTypes, opts);
            wf[name] = fce;
        }
    }
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
const alloca_stack = [];
const alloca_buffer_size = 32 * 1024;
let alloca_base, alloca_offset, alloca_limit;
function _ensure_allocated() {
    if (alloca_base)
        return;
    alloca_base = malloc(alloca_buffer_size);
    alloca_offset = alloca_base;
    alloca_limit = (alloca_base + alloca_buffer_size);
}
const max_int64_big = BigInt("9223372036854775807");
const min_int64_big = BigInt("-9223372036854775808");
function temp_malloc(size) {
    _ensure_allocated();
    if (!alloca_stack.length)
        throw new Error("No temp frames have been created at this point");
    const result = alloca_offset;
    alloca_offset += size;
    if (alloca_offset >= alloca_limit)
        throw new Error("Out of temp storage space");
    return result;
}
// returns always uint32 (not negative Number)
function malloc(size) {
    return (Module._malloc(size) >>> 0);
}
function free(ptr) {
    Module._free(ptr);
}
function _create_temp_frame() {
    _ensure_allocated();
    alloca_stack.push(alloca_offset);
}
function _release_temp_frame() {
    if (!alloca_stack.length)
        throw new Error("No temp frames have been created at this point");
    alloca_offset = alloca_stack.pop();
}
function assert_int_in_range(value, min, max) {
    if (!(Number.isSafeInteger(value))) throw new Error(`Assert failed: Value is not an integer: ${value} (${typeof (value)})`); // inlined mono_check
    if (!(value >= min && value <= max)) throw new Error(`Assert failed: Overflow: value ${value} is out of ${min} ${max} range`); // inlined mono_check
}
function _zero_region(byteOffset, sizeBytes) {
    localHeapViewU8().fill(0, byteOffset, byteOffset + sizeBytes);
}
/** note: MonoBoolean is 8 bits not 32 bits when inside a structure or array */
function setB32(offset, value) {
    receiveWorkerHeapViews();
    const boolValue = !!value;
    if (typeof (value) === "number")
        assert_int_in_range(value, 0, 1);
    Module.HEAP32[offset >>> 2] = boolValue ? 1 : 0;
}
function setB8(offset, value) {
    const boolValue = !!value;
    if (typeof (value) === "number")
        assert_int_in_range(value, 0, 1);
    receiveWorkerHeapViews();
    Module.HEAPU8[offset] = boolValue ? 1 : 0;
}
function setU8(offset, value) {
    assert_int_in_range(value, 0, 0xFF);
    receiveWorkerHeapViews();
    Module.HEAPU8[offset] = value;
}
function setU16(offset, value) {
    assert_int_in_range(value, 0, 0xFFFF);
    receiveWorkerHeapViews();
    Module.HEAPU16[offset >>> 1] = value;
}
// does not check for growable heap
function setU16_local(localView, offset, value) {
    assert_int_in_range(value, 0, 0xFFFF);
    localView[offset >>> 1] = value;
}
// does not check for overflow nor growable heap
function setU16_unchecked(offset, value) {
    Module.HEAPU16[offset >>> 1] = value;
}
// does not check for overflow nor growable heap
function setU32_unchecked(offset, value) {
    Module.HEAPU32[offset >>> 2] = value;
}
function setU32(offset, value) {
    assert_int_in_range(value, 0, 4294967295);
    receiveWorkerHeapViews();
    Module.HEAPU32[offset >>> 2] = value;
}
function setI8(offset, value) {
    assert_int_in_range(value, -0x80, 0x7F);
    receiveWorkerHeapViews();
    Module.HEAP8[offset] = value;
}
function setI16(offset, value) {
    assert_int_in_range(value, -0x8000, 0x7FFF);
    receiveWorkerHeapViews();
    Module.HEAP16[offset >>> 1] = value;
}
function setI32_unchecked(offset, value) {
    receiveWorkerHeapViews();
    Module.HEAP32[offset >>> 2] = value;
}
function setI32(offset, value) {
    assert_int_in_range(value, -2147483648, 2147483647);
    receiveWorkerHeapViews();
    Module.HEAP32[offset >>> 2] = value;
}
function autoThrowI52(error) {
    if (error === 0 /* I52Error.NONE */)
        return;
    switch (error) {
        case 1 /* I52Error.NON_INTEGRAL */:
            throw new Error("value was not an integer");
        case 2 /* I52Error.OUT_OF_RANGE */:
            throw new Error("value out of range");
        default:
            throw new Error("unknown internal error");
    }
}
/**
 * Throws for values which are not 52 bit integer. See Number.isSafeInteger()
 */
function setI52(offset, value) {
    if (!(Number.isSafeInteger(value))) throw new Error(`Assert failed: Value is not a safe integer: ${value} (${typeof (value)})`); // inlined mono_check
    receiveWorkerHeapViews();
    const error = wrapped_c_functions.mono_wasm_f64_to_i52(offset, value);
    autoThrowI52(error);
}
/**
 * Throws for values which are not 52 bit integer or are negative. See Number.isSafeInteger().
 */
function setU52(offset, value) {
    if (!(Number.isSafeInteger(value))) throw new Error(`Assert failed: Value is not a safe integer: ${value} (${typeof (value)})`); // inlined mono_check
    if (!(value >= 0)) throw new Error("Assert failed: Can't convert negative Number into UInt64"); // inlined mono_check
    receiveWorkerHeapViews();
    const error = wrapped_c_functions.mono_wasm_f64_to_u52(offset, value);
    autoThrowI52(error);
}
function setI64Big(offset, value) {
    if (!(typeof value === "bigint")) throw new Error(`Assert failed: Value is not an bigint: ${value} (${typeof (value)})`); // inlined mono_check
    if (!(value >= min_int64_big && value <= max_int64_big)) throw new Error(`Assert failed: Overflow: value ${value} is out of ${min_int64_big} ${max_int64_big} range`); // inlined mono_check
    Module.HEAP64[offset >>> 3] = value;
}
function setF32(offset, value) {
    if (!(typeof value === "number")) throw new Error(`Assert failed: Value is not a Number: ${value} (${typeof (value)})`); // inlined mono_check
    receiveWorkerHeapViews();
    Module.HEAPF32[offset >>> 2] = value;
}
function setF64(offset, value) {
    if (!(typeof value === "number")) throw new Error(`Assert failed: Value is not a Number: ${value} (${typeof (value)})`); // inlined mono_check
    receiveWorkerHeapViews();
    Module.HEAPF64[offset >>> 3] = value;
}
let warnDirtyBool = true;
function getB32(offset) {
    receiveWorkerHeapViews();
    const value = (Module.HEAPU32[offset >>> 2]);
    if (value > 1 && warnDirtyBool) {
        warnDirtyBool = false;
        mono_log_warn(`getB32: value at ${offset} is not a boolean, but a number: ${value}`);
    }
    return !!value;
}
function getB8(offset) {
    receiveWorkerHeapViews();
    return !!(Module.HEAPU8[offset]);
}
function getU8(offset) {
    receiveWorkerHeapViews();
    return Module.HEAPU8[offset];
}
function getU16(offset) {
    receiveWorkerHeapViews();
    return Module.HEAPU16[offset >>> 1];
}
// does not check for growable heap
function getU16_local(localView, offset) {
    return localView[offset >>> 1];
}
function getU32(offset) {
    receiveWorkerHeapViews();
    return Module.HEAPU32[offset >>> 2];
}
// does not check for growable heap
function getU32_local(localView, offset) {
    return localView[offset >>> 2];
}
function getI32_unaligned(offset) {
    return wrapped_c_functions.mono_wasm_get_i32_unaligned(offset);
}
function getU32_unaligned(offset) {
    return wrapped_c_functions.mono_wasm_get_i32_unaligned(offset) >>> 0;
}
function getF32_unaligned(offset) {
    return wrapped_c_functions.mono_wasm_get_f32_unaligned(offset);
}
function getF64_unaligned(offset) {
    return wrapped_c_functions.mono_wasm_get_f64_unaligned(offset);
}
function getI8(offset) {
    receiveWorkerHeapViews();
    return Module.HEAP8[offset];
}
function getI16(offset) {
    receiveWorkerHeapViews();
    return Module.HEAP16[offset >>> 1];
}
// does not check for growable heap
function getI16_local(localView, offset) {
    return localView[offset >>> 1];
}
function getI32(offset) {
    receiveWorkerHeapViews();
    return Module.HEAP32[offset >>> 2];
}
// does not check for growable heap
function getI32_local(localView, offset) {
    return localView[offset >>> 2];
}
/**
 * Throws for Number.MIN_SAFE_INTEGER > value > Number.MAX_SAFE_INTEGER
 */
function getI52(offset) {
    const result = wrapped_c_functions.mono_wasm_i52_to_f64(offset, runtimeHelpers._i52_error_scratch_buffer);
    const error = getI32(runtimeHelpers._i52_error_scratch_buffer);
    autoThrowI52(error);
    return result;
}
/**
 * Throws for 0 > value > Number.MAX_SAFE_INTEGER
 */
function getU52(offset) {
    const result = wrapped_c_functions.mono_wasm_u52_to_f64(offset, runtimeHelpers._i52_error_scratch_buffer);
    const error = getI32(runtimeHelpers._i52_error_scratch_buffer);
    autoThrowI52(error);
    return result;
}
function getI64Big(offset) {
    receiveWorkerHeapViews();
    return Module.HEAP64[offset >>> 3];
}
function getF32(offset) {
    receiveWorkerHeapViews();
    return Module.HEAPF32[offset >>> 2];
}
function getF64(offset) {
    receiveWorkerHeapViews();
    return Module.HEAPF64[offset >>> 3];
}
function withStackAlloc(bytesWanted, f, ud1, ud2, ud3) {
    const sp = Module.stackSave();
    const ptr = Module.stackAlloc(bytesWanted);
    try {
        return f(ptr, ud1, ud2, ud3);
    }
    finally {
        Module.stackRestore(sp);
    }
}
// @bytes must be a typed array. space is allocated for it in the native heap
//  and it is copied to that location. returns the address of the allocation.
function mono_wasm_load_bytes_into_heap(bytes) {
    // pad sizes by 16 bytes for simd
    const memoryOffset = malloc(bytes.length + 16);
    if (memoryOffset <= 0) {
        mono_log_error(`malloc failed to allocate ${(bytes.length + 16)} bytes.`);
        throw new Error("Out of memory");
    }
    const heapBytes = new Uint8Array(localHeapViewU8().buffer, memoryOffset, bytes.length);
    heapBytes.set(bytes);
    return memoryOffset;
}
// @bytes must be a typed array. space is allocated for it in memory
//  and it is copied to that location. returns the address of the data.
// the result pointer *cannot* be freed because malloc is bypassed for speed.
function mono_wasm_load_bytes_into_heap_persistent(bytes) {
    // pad sizes by 16 bytes for simd
    const desiredSize = bytes.length + 16;
    // sbrk doesn't allocate whole pages so we can ask it for as many bytes as we want.
    let memoryOffset = Module._sbrk(desiredSize);
    if (memoryOffset <= 0) {
        // sbrk failed. Due to identical bugs in v8 and spidermonkey, this isn't guaranteed to be OOM.
        // We use this function early during startup, when OOM shouldn't be possible anyway!
        // Log a warning, then retry.
        memoryOffset = Module._sbrk(desiredSize);
        if (memoryOffset <= 0) {
            mono_log_error(`sbrk failed to allocate ${desiredSize} bytes, and failed upon retry.`);
            throw new Error("Out of memory");
        }
        else {
            mono_log_warn(`sbrk failed to allocate ${desiredSize} bytes, but succeeded upon retry!`);
        }
    }
    const heapBytes = new Uint8Array(localHeapViewU8().buffer, memoryOffset, bytes.length);
    heapBytes.set(bytes);
    return memoryOffset;
}
function getEnv(name) {
    let charPtr = 0;
    try {
        charPtr = wrapped_c_functions.mono_wasm_getenv(name);
        if (charPtr === 0)
            return null;
        else
            return utf8ToString(charPtr);
    }
    finally {
        if (charPtr)
            Module._free(charPtr);
    }
}
function compareExchangeI32(offset, value, expected) {
    if (!((offset & 3) === 0)) mono_assert(false, `compareExchangeI32: offset must be 4-byte aligned, got ${offset}`); // inlined mono_assert condition
    if (!WasmEnableThreads) {
        const actual = getI32(offset);
        if (actual === expected) {
            setI32(offset, value);
        }
        return actual;
    }
    return globalThis.Atomics.compareExchange(localHeapViewI32(), offset >>> 2, expected, value);
}
function storeI32(offset, value) {
    if (!((offset & 3) === 0)) mono_assert(false, `storeI32: offset must be 4-byte aligned, got ${offset}`); // inlined mono_assert condition
    if (!WasmEnableThreads)
        return setI32(offset, value);
    globalThis.Atomics.store(localHeapViewI32(), offset >>> 2, value);
}
function notifyI32(offset, count) {
    if (!((offset & 3) === 0)) mono_assert(false, `notifyI32: offset must be 4-byte aligned, got ${offset}`); // inlined mono_assert condition
    if (!WasmEnableThreads)
        return;
    globalThis.Atomics.notify(localHeapViewI32(), offset >>> 2, count);
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewI8() {
    receiveWorkerHeapViews();
    return Module.HEAP8;
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewI16() {
    receiveWorkerHeapViews();
    return Module.HEAP16;
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewI32() {
    receiveWorkerHeapViews();
    return Module.HEAP32;
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewI64Big() {
    receiveWorkerHeapViews();
    return Module.HEAP64;
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewU8() {
    receiveWorkerHeapViews();
    return Module.HEAPU8;
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewU16() {
    receiveWorkerHeapViews();
    return Module.HEAPU16;
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewU32() {
    receiveWorkerHeapViews();
    return Module.HEAPU32;
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewF32() {
    receiveWorkerHeapViews();
    return Module.HEAPF32;
}
// returns memory view which is valid within current synchronous call stack
function localHeapViewF64() {
    receiveWorkerHeapViews();
    return Module.HEAPF64;
}
function copyBytes(srcPtr, dstPtr, bytes) {
    const heap = localHeapViewU8();
    heap.copyWithin(dstPtr, srcPtr, srcPtr + bytes);
}
// when we run with multithreading enabled, we need to make sure that the memory views are updated on each worker
// on non-MT build, this will be a no-op trimmed by rollup
function receiveWorkerHeapViews() {
    if (!WasmEnableThreads)
        return;
    const wasmMemory = runtimeHelpers.getMemory();
    if (wasmMemory.buffer !== Module.HEAPU8.buffer) {
        runtimeHelpers.updateMemoryViews();
    }
}
const sharedArrayBufferDefined = typeof SharedArrayBuffer !== "undefined";
function isSharedArrayBuffer(buffer) {
    // this condition should be eliminated by rollup on non-threading builds
    if (!WasmEnableThreads)
        return false;
    // BEWARE: In some cases, `instanceof SharedArrayBuffer` returns false even though buffer is an SAB.
    // Patch adapted from https://github.com/emscripten-core/emscripten/pull/16994
    // See also https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag
    return sharedArrayBufferDefined && buffer[Symbol.toStringTag] === "SharedArrayBuffer";
}
/*
Problem: When WebWorker is suspended in the browser, the other running threads could `grow` the linear memory in the meantime.
After the thread is un-suspended C code may to try to de-reference pointer which is beyond it's known view.
This is likely V8 bug. We don't have direct evidence, just failed debugger unit tests with MT runtime.
*/
function forceThreadMemoryViewRefresh() {
    // this condition should be eliminated by rollup on non-threading builds and it would become empty method.
    if (!WasmEnableThreads)
        return;
    const wasmMemory = runtimeHelpers.getMemory();
    /*
    Normally when wasm memory grows in v8, this size change is broadcast to other web workers via an 'interrupt', which works by setting a thread-local flag that needs to be checked.
    It's possible that at this point in execution the flag has not been checked yet (because this worker was suspended by the debugger in an unknown location),
    which means the size change has not taken effect in this worker.
    wasmMemory.grow's implementation in v8 checks to see whether other workers have already grown the buffer,
    and will update the current worker's knowledge of the buffer's size.
    After that we should be able to safely updateMemoryViews and get a correctly sized view.
    This only works because their implementation does not skip doing work even when you ask to grow by 0 pages.
    */
    wasmMemory.grow(0);
    if (wasmMemory.buffer !== Module.HEAPU8.buffer) {
        runtimeHelpers.updateMemoryViews();
    }
}
function fixupPointer(signature, shiftAmount) {
    return (signature >>> shiftAmount);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let gc_locked = false;
// TODO https://github.com/dotnet/runtime/issues/100411
// after Blazor stops using mono_wasm_gc_lock, mono_wasm_gc_unlock
function mono_wasm_gc_lock() {
    if (gc_locked) {
        throw new Error("GC is already locked");
    }
    if (WasmEnableThreads) {
        if (ENVIRONMENT_IS_PTHREAD) {
            throw new Error("GC lock only supported in main thread");
        }
        wrapped_c_functions.mono_wasm_gc_lock();
    }
    gc_locked = true;
}
function mono_wasm_gc_unlock() {
    if (!gc_locked) {
        throw new Error("GC is not locked");
    }
    if (WasmEnableThreads) {
        if (ENVIRONMENT_IS_PTHREAD) {
            throw new Error("GC lock only supported in main thread");
        }
        wrapped_c_functions.mono_wasm_gc_unlock();
    }
    gc_locked = false;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const maxScratchRoots = 8192;
let _scratch_root_buffer = null;
let _scratch_root_free_indices = null;
let _scratch_root_free_indices_count = 0;
const _scratch_root_free_instances = [];
const _external_root_free_instances = [];
/**
 * Allocates a block of memory that can safely contain pointers into the managed heap.
 * The result object has get(index) and set(index, value) methods that can be used to retrieve and store managed pointers.
 * Once you are done using the root buffer, you must call its release() method.
 * For small numbers of roots, it is preferable to use the mono_wasm_new_root and mono_wasm_new_roots APIs instead.
 */
function mono_wasm_new_root_buffer(capacity, name) {
    if (WasmEnableThreads && runtimeHelpers.disableManagedTransition)
        throw new Error("External roots are not supported when threads are enabled");
    if (capacity <= 0)
        throw new Error("capacity >= 1");
    capacity = capacity | 0;
    const capacityBytes = capacity * 4;
    const offset = malloc(capacityBytes);
    if ((offset % 4) !== 0)
        throw new Error("Malloc returned an unaligned offset");
    _zero_region(offset, capacityBytes);
    return new WasmRootBufferImpl(offset, capacity, true, name);
}
/**
 * Allocates a WasmRoot pointing to a root provided and controlled by external code. Typicaly on managed stack.
 * Releasing this root will not de-allocate the root space. You still need to call .release().
 */
function mono_wasm_new_external_root(address) {
    if (WasmEnableThreads && runtimeHelpers.disableManagedTransition)
        throw new Error("External roots are not supported in multithreaded mode");
    let result;
    if (!address)
        throw new Error("address must be a location in the native heap");
    if (_external_root_free_instances.length > 0) {
        result = _external_root_free_instances.pop();
        result._set_address(address);
    }
    else {
        result = new WasmExternalRoot(address);
    }
    return result;
}
/**
 * Allocates temporary storage for a pointer into the managed heap.
 * Pointers stored here will be visible to the GC, ensuring that the object they point to aren't moved or collected.
 * If you already have a managed pointer you can pass it as an argument to initialize the temporary storage.
 * The result object has get() and set(value) methods, along with a .value property.
 * When you are done using the root you must call its .release() method.
 */
function mono_wasm_new_root(value = undefined) {
    if (WasmEnableThreads && runtimeHelpers.disableManagedTransition)
        throw new Error("External roots are not supported in multithreaded mode");
    let result;
    if (_scratch_root_free_instances.length > 0) {
        result = _scratch_root_free_instances.pop();
    }
    else {
        const index = _mono_wasm_claim_scratch_index();
        const buffer = _scratch_root_buffer;
        result = new WasmJsOwnedRoot(buffer, index);
    }
    if (value !== undefined) {
        if (typeof (value) !== "number")
            throw new Error("value must be an address in the managed heap");
        result.set(value);
    }
    else {
        result.set(0);
    }
    return result;
}
/**
 * Allocates 1 or more temporary roots, accepting either a number of roots or an array of pointers.
 * mono_wasm_new_roots(n): returns an array of N zero-initialized roots.
 * mono_wasm_new_roots([a, b, ...]) returns an array of new roots initialized with each element.
 * Each root must be released with its release method, or using the mono_wasm_release_roots API.
 */
function mono_wasm_new_roots(count_or_values) {
    let result;
    if (Array.isArray(count_or_values)) {
        result = new Array(count_or_values.length);
        for (let i = 0; i < result.length; i++)
            result[i] = mono_wasm_new_root(count_or_values[i]);
    }
    else if ((count_or_values | 0) > 0) {
        result = new Array(count_or_values);
        for (let i = 0; i < result.length; i++)
            result[i] = mono_wasm_new_root();
    }
    else {
        throw new Error("count_or_values must be either an array or a number greater than 0");
    }
    return result;
}
/**
 * Releases 1 or more root or root buffer objects.
 * Multiple objects may be passed on the argument list.
 * 'undefined' may be passed as an argument so it is safe to call this method from finally blocks
 *  even if you are not sure all of your roots have been created yet.
 * @param {... WasmRoot} roots
 */
function mono_wasm_release_roots(...args) {
    for (let i = 0; i < args.length; i++) {
        if (is_nullish(args[i]))
            continue;
        args[i].release();
    }
}
function _mono_wasm_release_scratch_index(index) {
    if (index === undefined)
        return;
    _scratch_root_buffer.set(index, 0);
    _scratch_root_free_indices[_scratch_root_free_indices_count] = index;
    _scratch_root_free_indices_count++;
}
function _mono_wasm_claim_scratch_index() {
    if (is_nullish(_scratch_root_buffer) || !_scratch_root_free_indices) {
        _scratch_root_buffer = mono_wasm_new_root_buffer(maxScratchRoots, "js roots");
        _scratch_root_free_indices = new Int32Array(maxScratchRoots);
        _scratch_root_free_indices_count = maxScratchRoots;
        for (let i = 0; i < maxScratchRoots; i++)
            _scratch_root_free_indices[i] = maxScratchRoots - i - 1;
    }
    if (_scratch_root_free_indices_count < 1)
        throw new Error("Out of scratch root space");
    const result = _scratch_root_free_indices[_scratch_root_free_indices_count - 1];
    _scratch_root_free_indices_count--;
    return result;
}
class WasmRootBufferImpl {
    constructor(offset, capacity, ownsAllocation, name) {
        const capacityBytes = capacity * 4;
        this.__offset = offset;
        this.__offset32 = offset >>> 2;
        this.__count = capacity;
        this.length = capacity;
        if (!(!WasmEnableThreads || !gc_locked)) mono_assert(false, "GC must not be locked when creating a GC root"); // inlined mono_assert condition
        this.__handle = wrapped_c_functions.mono_wasm_register_root(offset, capacityBytes, name || "noname");
        this.__ownsAllocation = ownsAllocation;
    }
    _throw_index_out_of_range() {
        throw new Error("index out of range");
    }
    _check_in_range(index) {
        if ((index >= this.__count) || (index < 0))
            this._throw_index_out_of_range();
    }
    get_address(index) {
        this._check_in_range(index);
        return this.__offset + (index * 4);
    }
    get_address_32(index) {
        this._check_in_range(index);
        return this.__offset32 + index;
    }
    // NOTE: These functions do not use the helpers from memory.ts because WasmRoot.get and WasmRoot.set
    //  are hot-spots when you profile any application that uses the bindings extensively.
    get(index) {
        this._check_in_range(index);
        const offset = this.get_address_32(index);
        return localHeapViewU32()[offset];
    }
    set(index, value) {
        const address = this.get_address(index);
        wrapped_c_functions.mono_wasm_write_managed_pointer_unsafe(address, value);
        return value;
    }
    copy_value_from_address(index, sourceAddress) {
        const destinationAddress = this.get_address(index);
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destinationAddress, sourceAddress);
    }
    _unsafe_get(index) {
        return localHeapViewU32()[this.__offset32 + index];
    }
    _unsafe_set(index, value) {
        const address = this.__offset + index;
        wrapped_c_functions.mono_wasm_write_managed_pointer_unsafe(address, value);
    }
    clear() {
        if (this.__offset)
            _zero_region(this.__offset, this.__count * 4);
    }
    release() {
        if (this.__offset && this.__ownsAllocation) {
            if (!(!WasmEnableThreads || !gc_locked)) mono_assert(false, "GC must not be locked when disposing a GC root"); // inlined mono_assert condition
            wrapped_c_functions.mono_wasm_deregister_root(this.__offset);
            _zero_region(this.__offset, this.__count * 4);
            free(this.__offset);
        }
        this.__handle = this.__offset = this.__count = this.__offset32 = 0;
    }
    toString() {
        return `[root buffer @${this.get_address(0)}, size ${this.__count} ]`;
    }
}
class WasmJsOwnedRoot {
    constructor(buffer, index) {
        this.__buffer = buffer; //TODO
        this.__index = index;
    }
    get_address() {
        return this.__buffer.get_address(this.__index);
    }
    get_address_32() {
        return this.__buffer.get_address_32(this.__index);
    }
    get address() {
        return this.__buffer.get_address(this.__index);
    }
    get() {
        const result = this.__buffer._unsafe_get(this.__index);
        return result;
    }
    set(value) {
        const destinationAddress = this.__buffer.get_address(this.__index);
        wrapped_c_functions.mono_wasm_write_managed_pointer_unsafe(destinationAddress, value);
        return value;
    }
    copy_from(source) {
        const sourceAddress = source.address;
        const destinationAddress = this.address;
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destinationAddress, sourceAddress);
    }
    copy_to(destination) {
        const sourceAddress = this.address;
        const destinationAddress = destination.address;
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destinationAddress, sourceAddress);
    }
    copy_from_address(source) {
        const destinationAddress = this.address;
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destinationAddress, source);
    }
    copy_to_address(destination) {
        const sourceAddress = this.address;
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destination, sourceAddress);
    }
    get value() {
        return this.get();
    }
    set value(value) {
        this.set(value);
    }
    valueOf() {
        throw new Error("Implicit conversion of roots to pointers is no longer supported. Use .value or .address as appropriate");
    }
    clear() {
        // .set performs an expensive write barrier, and that is not necessary in most cases
        //  for clear since clearing a root cannot cause new objects to survive a GC
        const address32 = this.__buffer.get_address_32(this.__index);
        localHeapViewU32()[address32] = 0;
    }
    release() {
        if (!this.__buffer)
            throw new Error("No buffer");
        const maxPooledInstances = 128;
        if (_scratch_root_free_instances.length > maxPooledInstances) {
            _mono_wasm_release_scratch_index(this.__index);
            this.__buffer = null;
            this.__index = 0;
        }
        else {
            this.set(0);
            _scratch_root_free_instances.push(this);
        }
    }
    toString() {
        return `[root @${this.address}]`;
    }
}
class WasmExternalRoot {
    constructor(address) {
        this.__external_address = MonoObjectRefNull;
        this.__external_address_32 = 0;
        this._set_address(address);
    }
    _set_address(address) {
        this.__external_address = address;
        this.__external_address_32 = address >>> 2;
    }
    get address() {
        return this.__external_address;
    }
    get_address() {
        return this.__external_address;
    }
    get_address_32() {
        return this.__external_address_32;
    }
    get() {
        const result = localHeapViewU32()[this.__external_address_32];
        return result;
    }
    set(value) {
        wrapped_c_functions.mono_wasm_write_managed_pointer_unsafe(this.__external_address, value);
        return value;
    }
    copy_from(source) {
        const sourceAddress = source.address;
        const destinationAddress = this.__external_address;
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destinationAddress, sourceAddress);
    }
    copy_to(destination) {
        const sourceAddress = this.__external_address;
        const destinationAddress = destination.address;
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destinationAddress, sourceAddress);
    }
    copy_from_address(source) {
        const destinationAddress = this.__external_address;
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destinationAddress, source);
    }
    copy_to_address(destination) {
        const sourceAddress = this.__external_address;
        wrapped_c_functions.mono_wasm_copy_managed_pointer(destination, sourceAddress);
    }
    get value() {
        return this.get();
    }
    set value(value) {
        this.set(value);
    }
    valueOf() {
        throw new Error("Implicit conversion of roots to pointers is no longer supported. Use .value or .address as appropriate");
    }
    clear() {
        // .set performs an expensive write barrier, and that is not necessary in most cases
        //  for clear since clearing a root cannot cause new objects to survive a GC
        localHeapViewU32()[this.__external_address >>> 2] = 0;
    }
    release() {
        const maxPooledInstances = 128;
        if (_external_root_free_instances.length < maxPooledInstances)
            _external_root_free_instances.push(this);
    }
    toString() {
        return `[external root @${this.address}]`;
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const interned_js_string_table = new Map();
const mono_wasm_empty_string = "";
let mono_wasm_string_decoder_buffer;
const interned_string_table = new Map();
let _empty_string_ptr = 0;
const _interned_string_full_root_buffers = [];
let _interned_string_current_root_buffer = null;
let _interned_string_current_root_buffer_count = 0;
let _text_decoder_utf16;
let _text_decoder_utf8_relaxed = undefined;
let _text_decoder_utf8_validating = undefined;
let _text_encoder_utf8 = undefined;
function strings_init() {
    if (!mono_wasm_string_decoder_buffer) {
        if (typeof TextDecoder !== "undefined") {
            _text_decoder_utf16 = new TextDecoder("utf-16le");
            _text_decoder_utf8_relaxed = new TextDecoder("utf-8", { fatal: false });
            _text_decoder_utf8_validating = new TextDecoder("utf-8");
            _text_encoder_utf8 = new TextEncoder();
        }
        mono_wasm_string_decoder_buffer = malloc(12);
    }
    if (!mono_wasm_string_root)
        mono_wasm_string_root = mono_wasm_new_root();
}
function stringToUTF8(str) {
    if (_text_encoder_utf8 === undefined) {
        const len = Module.lengthBytesUTF8(str);
        const buffer = new Uint8Array(len);
        Module.stringToUTF8Array(str, buffer, 0, len);
        return buffer;
    }
    return _text_encoder_utf8.encode(str);
}
function stringToUTF8Ptr(str) {
    const size = Module.lengthBytesUTF8(str) + 1;
    const ptr = malloc(size);
    const buffer = localHeapViewU8().subarray(ptr, ptr + size);
    Module.stringToUTF8Array(str, buffer, 0, size);
    buffer[size - 1] = 0;
    return ptr;
}
function utf8ToStringRelaxed(buffer) {
    if (_text_decoder_utf8_relaxed === undefined) {
        return Module.UTF8ArrayToString(buffer, 0, buffer.byteLength);
    }
    return _text_decoder_utf8_relaxed.decode(buffer);
}
function utf8ToString(ptr) {
    const heapU8 = localHeapViewU8();
    return utf8BufferToString(heapU8, ptr, heapU8.length - ptr);
}
function utf8BufferToString(heapOrArray, idx, maxBytesToRead) {
    const endIdx = idx + maxBytesToRead;
    let endPtr = idx;
    while (heapOrArray[endPtr] && !(endPtr >= endIdx))
        ++endPtr;
    if (endPtr - idx <= 16) {
        return Module.UTF8ArrayToString(heapOrArray, idx, maxBytesToRead);
    }
    if (_text_decoder_utf8_validating === undefined) {
        return Module.UTF8ArrayToString(heapOrArray, idx, maxBytesToRead);
    }
    const view = viewOrCopy(heapOrArray, idx, endPtr);
    return _text_decoder_utf8_validating.decode(view);
}
function utf16ToString(startPtr, endPtr) {
    if (_text_decoder_utf16) {
        const subArray = viewOrCopy(localHeapViewU8(), startPtr, endPtr);
        return _text_decoder_utf16.decode(subArray);
    }
    else {
        return utf16ToStringLoop(startPtr, endPtr);
    }
}
function utf16ToStringLoop(startPtr, endPtr) {
    let str = "";
    const heapU16 = localHeapViewU16();
    for (let i = startPtr; i < endPtr; i += 2) {
        const char = getU16_local(heapU16, i);
        str += String.fromCharCode(char);
    }
    return str;
}
function stringToUTF16(dstPtr, endPtr, text) {
    const heapI16 = localHeapViewU16();
    const len = text.length;
    for (let i = 0; i < len; i++) {
        setU16_local(heapI16, dstPtr, text.charCodeAt(i));
        dstPtr += 2;
        if (dstPtr >= endPtr)
            break;
    }
}
function stringToUTF16Ptr(str) {
    const bytes = (str.length + 1) * 2;
    const ptr = malloc(bytes);
    _zero_region(ptr, str.length * 2);
    stringToUTF16(ptr, ptr + bytes, str);
    return ptr;
}
function monoStringToString(root) {
    // TODO https://github.com/dotnet/runtime/issues/100411
    // after Blazor stops using monoStringToStringUnsafe
    // if (!(!WasmEnableThreads)) mono_assert(false, "Marshaling strings by reference is not supported in multithreaded mode"); // inlined mono_assert condition
    if (root.value === MonoStringNull)
        return null;
    const ppChars = mono_wasm_string_decoder_buffer + 0, pLengthBytes = mono_wasm_string_decoder_buffer + 4, pIsInterned = mono_wasm_string_decoder_buffer + 8;
    wrapped_c_functions.mono_wasm_string_get_data_ref(root.address, ppChars, pLengthBytes, pIsInterned);
    let result = undefined;
    const heapU32 = localHeapViewU32();
    const lengthBytes = getU32_local(heapU32, pLengthBytes), pChars = getU32_local(heapU32, ppChars), isInterned = getU32_local(heapU32, pIsInterned);
    if (isInterned)
        result = interned_string_table.get(root.value);
    if (result === undefined) {
        if (lengthBytes && pChars) {
            result = utf16ToString(pChars, pChars + lengthBytes);
            if (isInterned)
                interned_string_table.set(root.value, result);
        }
        else
            result = mono_wasm_empty_string;
    }
    if (result === undefined)
        throw new Error(`internal error when decoding string at location ${root.value}`);
    return result;
}
function stringToMonoStringRoot(string, result) {
    if (WasmEnableThreads)
        return;
    result.clear();
    if (string === null)
        return;
    else if (typeof (string) === "symbol")
        stringToInternedMonoStringRoot(string, result);
    else if (typeof (string) !== "string")
        throw new Error("Expected string argument, got " + typeof (string));
    else if (string.length === 0)
        // Always use an interned pointer for empty strings
        stringToInternedMonoStringRoot(string, result);
    else {
        // Looking up large strings in the intern table will require the JS runtime to
        //  potentially hash them and then do full byte-by-byte comparisons, which is
        //  very expensive. Because we can not guarantee it won't happen, try to minimize
        //  the cost of this and prevent performance issues for large strings
        if (string.length <= 256) {
            const interned = interned_js_string_table.get(string);
            if (interned) {
                result.set(interned);
                return;
            }
        }
        stringToMonoStringNewRoot(string, result);
    }
}
function stringToInternedMonoStringRoot(string, result) {
    let text;
    if (typeof (string) === "symbol") {
        text = string.description;
        if (typeof (text) !== "string")
            text = Symbol.keyFor(string);
        if (typeof (text) !== "string")
            text = "<unknown Symbol>";
    }
    else if (typeof (string) === "string") {
        text = string;
    }
    if (typeof (text) !== "string") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        throw new Error(`Argument to stringToInternedMonoStringRoot must be a string but was ${string}`);
    }
    if ((text.length === 0) && _empty_string_ptr) {
        result.set(_empty_string_ptr);
        return;
    }
    const ptr = interned_js_string_table.get(text);
    if (ptr) {
        result.set(ptr);
        return;
    }
    stringToMonoStringNewRoot(text, result);
    storeStringInInternTable(text, result, true);
}
function storeStringInInternTable(string, root, internIt) {
    if (!root.value)
        throw new Error("null pointer passed to _store_string_in_intern_table");
    const internBufferSize = 8192;
    if (_interned_string_current_root_buffer_count >= internBufferSize) {
        _interned_string_full_root_buffers.push(_interned_string_current_root_buffer);
        _interned_string_current_root_buffer = null;
    }
    if (!_interned_string_current_root_buffer) {
        _interned_string_current_root_buffer = mono_wasm_new_root_buffer(internBufferSize, "interned strings");
        _interned_string_current_root_buffer_count = 0;
    }
    const rootBuffer = _interned_string_current_root_buffer;
    const index = _interned_string_current_root_buffer_count++;
    // Store the managed string into the managed intern table. This can theoretically
    //  provide a different managed object than the one we passed in, so update our
    //  pointer (stored in the root) with the result.
    if (internIt) {
        wrapped_c_functions.mono_wasm_intern_string_ref(root.address);
        if (!root.value)
            throw new Error("mono_wasm_intern_string_ref produced a null pointer");
    }
    interned_js_string_table.set(string, root.value);
    interned_string_table.set(root.value, string);
    if ((string.length === 0) && !_empty_string_ptr)
        _empty_string_ptr = root.value;
    // Copy the final pointer into our interned string root buffer to ensure the string
    //  remains rooted. TODO: Is this actually necessary?
    rootBuffer.copy_value_from_address(index, root.address);
}
function stringToMonoStringNewRoot(string, result) {
    const bufferLen = (string.length + 1) * 2;
    // TODO this could be stack allocated for small strings
    // or temp_malloc/alloca for large strings
    // or skip the scratch buffer entirely, and make a new MonoString of size string.length, pin it, and then call stringToUTF16 to write directly into the MonoString's chars
    const buffer = malloc(bufferLen);
    stringToUTF16(buffer, buffer + bufferLen, string);
    wrapped_c_functions.mono_wasm_string_from_utf16_ref(buffer, string.length, result.address);
    free(buffer);
}
// When threading is enabled, TextDecoder does not accept a view of a
// SharedArrayBuffer, we must make a copy of the array first.
// See https://github.com/whatwg/encoding/issues/172
function viewOrCopy(view, start, end) {
    // this condition should be eliminated by rollup on non-threading builds
    const needsCopy = isSharedArrayBuffer(view.buffer);
    return needsCopy
        ? view.slice(start, end)
        : view.subarray(start, end);
}
// below is minimal legacy support for Blazor
let mono_wasm_string_root;
/* @deprecated not GC safe, use monoStringToString */
function monoStringToStringUnsafe(mono_string) {
    if (mono_string === MonoStringNull)
        return null;
    mono_wasm_string_root.value = mono_string;
    const result = monoStringToString(mono_wasm_string_root);
    mono_wasm_string_root.value = MonoStringNull;
    return result;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let prefix = "MONO_WASM: ";
function set_thread_prefix(threadPrefix) {
    prefix = `[${threadPrefix}] MONO_WASM: `;
}
/* eslint-disable no-console */
function mono_log_debug(messageFactory) {
    if (runtimeHelpers.diagnosticTracing) {
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
const wasm_func_map = new Map();
let wasm_pending_symbol_table;
const regexes = [];
function mono_wasm_symbolicate_string(message) {
    try {
        performDeferredSymbolMapParsing();
        if (wasm_func_map.size == 0)
            return message;
        const origMessage = message;
        for (let i = 0; i < regexes.length; i++) {
            const newRaw = message.replace(new RegExp(regexes[i], "g"), (substring, ...args) => {
                const groups = args.find(arg => {
                    return typeof (arg) == "object" && arg.replaceSection !== undefined;
                });
                if (groups === undefined)
                    return substring;
                const funcNum = groups.funcNum;
                const replaceSection = groups.replaceSection;
                const name = wasm_func_map.get(Number(funcNum));
                if (name === undefined)
                    return substring;
                return substring.replace(replaceSection, `${name} (${replaceSection})`);
            });
            if (newRaw !== origMessage)
                return newRaw;
        }
        return origMessage;
    }
    catch (error) {
        console.debug(`failed to symbolicate: ${error}`);
        return message;
    }
}
function mono_wasm_stringify_as_error_with_stack(reason) {
    let stack;
    if (typeof reason === "string") {
        stack = reason;
    }
    else if (reason === undefined || reason === null || reason.stack === undefined) {
        stack = new Error().stack + "";
    }
    else {
        stack = reason.stack + "";
    }
    // Error
    return mono_wasm_symbolicate_string(stack);
}
function mono_wasm_trace_logger(log_domain_ptr, log_level_ptr, message_ptr, fatal, user_data) {
    const origMessage = utf8ToString(message_ptr);
    const isFatal = !!fatal;
    const domain = utf8ToString(log_domain_ptr);
    const dataPtr = user_data;
    const log_level = utf8ToString(log_level_ptr);
    const message = `[MONO] ${origMessage}`;
    if (INTERNAL["logging"] && typeof INTERNAL.logging["trace"] === "function") {
        INTERNAL.logging.trace(domain, log_level, message, isFatal, dataPtr);
        return;
    }
    switch (log_level) {
        case "critical":
        case "error":
            {
                const messageWithStack = message + "\n" + (new Error().stack);
                if (!loaderHelpers.exitReason) {
                    loaderHelpers.exitReason = messageWithStack;
                }
                console.error(mono_wasm_stringify_as_error_with_stack(messageWithStack));
                if (WasmEnableThreads) {
                    try {
                        threads_c_functions.mono_wasm_print_thread_dump();
                    }
                    catch (e) {
                        console.error("Failed to print thread dump", e);
                    }
                }
                if (WasmEnableThreads && ENVIRONMENT_IS_WORKER) {
                    setTimeout(() => {
                        mono_log_error("forcing abort 3000ms after last error log message", messageWithStack);
                        // _emscripten_force_exit is proxied to UI thread and should also arrive in spin wait loop
                        Module._emscripten_force_exit(1);
                    }, 3000);
                }
            }
            break;
        case "warning":
            console.warn(message);
            break;
        case "message":
            console.log(message);
            break;
        case "info":
            console.info(message);
            break;
        case "debug":
            console.debug(message);
            break;
        default:
            console.log(message);
            break;
    }
}
function parseSymbolMapFile(text) {
    // Symbol map parsing is very expensive, so doing it during startup is wasteful
    //  instead, we defer it until the first time the symbol map is needed - which
    //  may be never
    if (!(!wasm_pending_symbol_table)) mono_assert(false, "Another symbol map was already loaded"); // inlined mono_assert condition
    wasm_pending_symbol_table = text;
    if (loaderHelpers.diagnosticTracing) mono_log_debug(`Deferred loading of ${text.length}ch symbol map`); // inlined mono_log_debug condition
}
function performDeferredSymbolMapParsing() {
    if (!wasm_pending_symbol_table)
        return;
    // V8
    //   at <anonymous>:wasm-function[1900]:0x83f63
    //   at dlfree (<anonymous>:wasm-function[18739]:0x2328ef)
    regexes.push(/at (?<replaceSection>[^:()]+:wasm-function\[(?<funcNum>\d+)\]:0x[a-fA-F\d]+)((?![^)a-fA-F\d])|$)/);
    //# 5: WASM [009712b2], function #111 (''), pc=0x7c16595c973 (+0x53), pos=38740 (+11)
    regexes.push(/(?:WASM \[[\da-zA-Z]+\], (?<replaceSection>function #(?<funcNum>[\d]+) \(''\)))/);
    //# chrome
    //# at http://127.0.0.1:63817/dotnet.wasm:wasm-function[8963]:0x1e23f4
    regexes.push(/(?<replaceSection>[a-z]+:\/\/[^ )]*:wasm-function\[(?<funcNum>\d+)\]:0x[a-fA-F\d]+)/);
    //# <?>.wasm-function[8962]
    regexes.push(/(?<replaceSection><[^ >]+>[.:]wasm-function\[(?<funcNum>[0-9]+)\])/);
    const text = wasm_pending_symbol_table;
    wasm_pending_symbol_table = undefined;
    try {
        text.split(/[\r\n]/).forEach((line) => {
            const parts = line.split(/:/);
            if (parts.length < 2)
                return;
            parts[1] = parts.splice(1).join(":");
            wasm_func_map.set(Number(parts[0]), parts[1]);
        });
        if (loaderHelpers.diagnosticTracing) mono_log_debug(`Loaded ${wasm_func_map.size} symbols`); // inlined mono_log_debug condition
    }
    catch (exc) {
        mono_log_warn(`Failed to load symbol map: ${exc}`);
    }
}
function mono_wasm_get_func_id_to_name_mappings() {
    performDeferredSymbolMapParsing();
    return [...wasm_func_map.values()];
}
function mono_wasm_console_clear() {
    console.clear();
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./types/v8.d.ts" />
/// <reference path="./types/sidecar.d.ts" />
/// <reference path="./types/node.d.ts" />
// these are our public API (except internal)
let Module;
let INTERNAL;
// keep in sync with src\mono\browser\runtime\loader\globals.ts and src\mono\browser\test-main.js
const ENVIRONMENT_IS_NODE = typeof process == "object" && typeof process.versions == "object" && typeof process.versions.node == "string";
const ENVIRONMENT_IS_WEB_WORKER = typeof importScripts == "function";
const ENVIRONMENT_IS_SIDECAR = ENVIRONMENT_IS_WEB_WORKER && typeof dotnetSidecar !== "undefined"; // sidecar is emscripten main running in a web worker
const ENVIRONMENT_IS_WORKER = ENVIRONMENT_IS_WEB_WORKER && !ENVIRONMENT_IS_SIDECAR; // we redefine what ENVIRONMENT_IS_WORKER, we replace it in emscripten internals, so that sidecar works
const ENVIRONMENT_IS_WEB = typeof window == "object" || (ENVIRONMENT_IS_WEB_WORKER && !ENVIRONMENT_IS_NODE);
const ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE;
// these are imported and re-exported from emscripten internals
let ENVIRONMENT_IS_PTHREAD;
let exportedRuntimeAPI = null;
let runtimeHelpers = null;
let loaderHelpers = null;
let diagnosticHelpers = null;
let globalObjectsRoot = null;
let _runtimeModuleLoaded = false; // please keep it in place also as rollup guard
function passEmscriptenInternals(internals, emscriptenBuildOptions) {
    runtimeHelpers.emscriptenBuildOptions = emscriptenBuildOptions;
    ENVIRONMENT_IS_PTHREAD = internals.isPThread;
    runtimeHelpers.quit = internals.quit_;
    runtimeHelpers.ExitStatus = internals.ExitStatus;
    runtimeHelpers.getMemory = internals.getMemory;
    runtimeHelpers.getWasmIndirectFunctionTable = internals.getWasmIndirectFunctionTable;
    runtimeHelpers.updateMemoryViews = internals.updateMemoryViews;
}
// NOTE: this is called AFTER the config is loaded
function setRuntimeGlobals(globalObjects) {
    if (_runtimeModuleLoaded) {
        throw new Error("Runtime module already loaded");
    }
    _runtimeModuleLoaded = true;
    globalObjectsRoot = globalObjects;
    Module = globalObjects.module;
    INTERNAL = globalObjects.internal;
    runtimeHelpers = globalObjects.runtimeHelpers;
    loaderHelpers = globalObjects.loaderHelpers;
    diagnosticHelpers = globalObjects.diagnosticHelpers;
    exportedRuntimeAPI = globalObjects.api;
    const rh = {
        gitHash,
        coreAssetsInMemory: createPromiseController(),
        allAssetsInMemory: createPromiseController(),
        dotnetReady: createPromiseController(),
        afterInstantiateWasm: createPromiseController(),
        beforePreInit: createPromiseController(),
        afterPreInit: createPromiseController(),
        afterPreRun: createPromiseController(),
        beforeOnRuntimeInitialized: createPromiseController(),
        afterMonoStarted: createPromiseController(),
        afterDeputyReady: createPromiseController(),
        afterIOStarted: createPromiseController(),
        afterOnRuntimeInitialized: createPromiseController(),
        afterPostRun: createPromiseController(),
        nativeAbort: (reason) => {
            throw reason || new Error("abort");
        },
        nativeExit: (code) => {
            throw new Error("exit:" + code);
        },
    };
    Object.assign(runtimeHelpers, rh);
    Object.assign(globalObjects.module.config, {});
    Object.assign(globalObjects.api, {
        Module: globalObjects.module, ...globalObjects.module
    });
    Object.assign(globalObjects.api, {
        INTERNAL: globalObjects.internal,
    });
}
function createPromiseController(afterResolve, afterReject) {
    return loaderHelpers.createPromiseController(afterResolve, afterReject);
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
// Code from JSIL:
// https://github.com/sq/JSIL/blob/1d57d5427c87ab92ffa3ca4b82429cd7509796ba/JSIL.Libraries/Includes/Bootstrap/Core/Classes/System.Convert.js#L149
// Thanks to Katelyn Gadd @kg
function toBase64StringImpl(inArray, offset, length) {
    const reader = _makeByteReader(inArray, offset, length);
    let result = "";
    let ch1 = 0, ch2 = 0, ch3 = 0;
    let bits = 0, equalsCount = 0, sum = 0;
    const mask1 = (1 << 24) - 1, mask2 = (1 << 18) - 1, mask3 = (1 << 12) - 1, mask4 = (1 << 6) - 1;
    const shift1 = 18, shift2 = 12, shift3 = 6, shift4 = 0;
    for (;;) {
        ch1 = reader.read();
        ch2 = reader.read();
        ch3 = reader.read();
        if (ch1 === null)
            break;
        if (ch2 === null) {
            ch2 = 0;
            equalsCount += 1;
        }
        if (ch3 === null) {
            ch3 = 0;
            equalsCount += 1;
        }
        // Seems backwards, but is right!
        sum = (ch1 << 16) | (ch2 << 8) | (ch3 << 0);
        bits = (sum & mask1) >> shift1;
        result += _base64Table[bits];
        bits = (sum & mask2) >> shift2;
        result += _base64Table[bits];
        if (equalsCount < 2) {
            bits = (sum & mask3) >> shift3;
            result += _base64Table[bits];
        }
        if (equalsCount === 2) {
            result += "==";
        }
        else if (equalsCount === 1) {
            result += "=";
        }
        else {
            bits = (sum & mask4) >> shift4;
            result += _base64Table[bits];
        }
    }
    return result;
}
const _base64Table = [
    "A", "B", "C", "D",
    "E", "F", "G", "H",
    "I", "J", "K", "L",
    "M", "N", "O", "P",
    "Q", "R", "S", "T",
    "U", "V", "W", "X",
    "Y", "Z",
    "a", "b", "c", "d",
    "e", "f", "g", "h",
    "i", "j", "k", "l",
    "m", "n", "o", "p",
    "q", "r", "s", "t",
    "u", "v", "w", "x",
    "y", "z",
    "0", "1", "2", "3",
    "4", "5", "6", "7",
    "8", "9",
    "+", "/"
];
function _makeByteReader(bytes, index, count) {
    let position = (typeof (index) === "number") ? index : 0;
    let endpoint;
    if (typeof (count) === "number")
        endpoint = (position + count);
    else
        endpoint = (bytes.length - position);
    const result = {
        read: function () {
            if (position >= endpoint)
                return null;
            const nextByte = bytes[position];
            position += 1;
            return nextByte;
        }
    };
    Object.defineProperty(result, "eof", {
        get: function () {
            return (position >= endpoint);
        },
        configurable: true,
        enumerable: true
    });
    return result;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const commands_received = new Map();
commands_received.remove = function (key) {
    const value = this.get(key);
    this.delete(key);
    return value;
};
let _call_function_res_cache = {};
let _next_call_function_res_id = 0;
let _debugger_buffer_len = -1;
let _debugger_buffer;
let _assembly_name_str; //keep this variable, it's used by BrowserDebugProxy
let _entrypoint_method_token; //keep this variable, it's used by BrowserDebugProxy
function mono_wasm_runtime_ready() {
    INTERNAL.mono_wasm_runtime_is_ready = runtimeHelpers.mono_wasm_runtime_is_ready = true;
    // FIXME: where should this go?
    _next_call_function_res_id = 0;
    _call_function_res_cache = {};
    _debugger_buffer_len = -1;
    // DO NOT REMOVE - magic debugger init function
    if (globalThis.dotnetDebugger)
        // eslint-disable-next-line no-debugger
        debugger;
}
function mono_wasm_fire_debugger_agent_message_with_data_to_pause(base64String) {
    //keep this console.assert, otherwise optimization will remove the assignments
    // eslint-disable-next-line no-console
    console.assert(true, `mono_wasm_fire_debugger_agent_message_with_data ${base64String}`);
    // eslint-disable-next-line no-debugger
    debugger;
}
function mono_wasm_fire_debugger_agent_message_with_data(data, len) {
    const base64String = toBase64StringImpl(new Uint8Array(localHeapViewU8().buffer, data, len));
    mono_wasm_fire_debugger_agent_message_with_data_to_pause(base64String);
}
function mono_wasm_add_dbg_command_received(res_ok, id, buffer, buffer_len) {
    const dbg_command = new Uint8Array(localHeapViewU8().buffer, buffer, buffer_len);
    const base64String = toBase64StringImpl(dbg_command);
    const buffer_obj = {
        res_ok,
        res: {
            id,
            value: base64String
        }
    };
    if (commands_received.has(id))
        mono_log_warn(`Adding an id (${id}) that already exists in commands_received`);
    commands_received.set(id, buffer_obj);
}
function mono_wasm_malloc_and_set_debug_buffer(command_parameters) {
    if (command_parameters.length > _debugger_buffer_len) {
        if (_debugger_buffer)
            free(_debugger_buffer);
        _debugger_buffer_len = Math.max(command_parameters.length, _debugger_buffer_len, 256);
        _debugger_buffer = malloc(_debugger_buffer_len);
    }
    const byteCharacters = atob(command_parameters);
    const heapU8 = localHeapViewU8();
    for (let i = 0; i < byteCharacters.length; i++) {
        heapU8[_debugger_buffer + i] = byteCharacters.charCodeAt(i);
    }
}
function mono_wasm_send_dbg_command_with_parms(id, command_set, command, command_parameters, length, valtype, newvalue) {
    forceThreadMemoryViewRefresh();
    mono_wasm_malloc_and_set_debug_buffer(command_parameters);
    wrapped_c_functions.mono_wasm_send_dbg_command_with_parms(id, command_set, command, _debugger_buffer, length, valtype, newvalue.toString());
    const { res_ok, res } = commands_received.remove(id);
    if (!res_ok)
        throw new Error("Failed on mono_wasm_send_dbg_command_with_parms");
    return res;
}
function mono_wasm_send_dbg_command(id, command_set, command, command_parameters) {
    forceThreadMemoryViewRefresh();
    mono_wasm_malloc_and_set_debug_buffer(command_parameters);
    wrapped_c_functions.mono_wasm_send_dbg_command(id, command_set, command, _debugger_buffer, command_parameters.length);
    const { res_ok, res } = commands_received.remove(id);
    if (!res_ok)
        throw new Error("Failed on mono_wasm_send_dbg_command");
    return res;
}
function mono_wasm_get_dbg_command_info() {
    const { res_ok, res } = commands_received.remove(0);
    if (!res_ok)
        throw new Error("Failed on mono_wasm_get_dbg_command_info");
    return res;
}
function mono_wasm_debugger_resume() {
    forceThreadMemoryViewRefresh();
}
function mono_wasm_detach_debugger() {
    forceThreadMemoryViewRefresh();
    wrapped_c_functions.mono_wasm_set_is_debugger_attached(false);
}
function mono_wasm_change_debugger_log_level(level) {
    forceThreadMemoryViewRefresh();
    wrapped_c_functions.mono_wasm_change_debugger_log_level(level);
}
/**
 * Raises an event for the debug proxy
 */
function mono_wasm_raise_debug_event(event, args = {}) {
    if (typeof event !== "object")
        throw new Error(`event must be an object, but got ${JSON.stringify(event)}`);
    if (event.eventName === undefined)
        throw new Error(`event.eventName is a required parameter, in event: ${JSON.stringify(event)}`);
    if (typeof args !== "object")
        throw new Error(`args must be an object, but got ${JSON.stringify(args)}`);
    // eslint-disable-next-line no-console
    console.debug("mono_wasm_debug_event_raised:aef14bca-5519-4dfe-b35a-f867abc123ae", JSON.stringify(event), JSON.stringify(args));
}
function mono_wasm_wait_for_debugger() {
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (runtimeHelpers.waitForDebugger != 1) {
                return;
            }
            clearInterval(interval);
            resolve();
        }, 100);
    });
}
function mono_wasm_debugger_attached() {
    if (runtimeHelpers.waitForDebugger == -1)
        runtimeHelpers.waitForDebugger = 1;
    forceThreadMemoryViewRefresh();
    wrapped_c_functions.mono_wasm_set_is_debugger_attached(true);
}
function mono_wasm_set_entrypoint_breakpoint(entrypoint_method_token) {
    //keep these assignments, these values are used by BrowserDebugProxy
    _assembly_name_str = loaderHelpers.config.mainAssemblyName + ".dll";
    _entrypoint_method_token = entrypoint_method_token;
    //keep this console.assert, otherwise optimization will remove the assignments
    // eslint-disable-next-line no-console
    console.assert(true, `Adding an entrypoint breakpoint ${_assembly_name_str} at method token  ${_entrypoint_method_token}`);
    // eslint-disable-next-line no-debugger
    debugger;
    forceThreadMemoryViewRefresh();
}
function _create_proxy_from_object_id(objectId, details) {
    if (objectId.startsWith("dotnet:array:")) {
        let ret;
        if (details.items === undefined) {
            ret = details.map((p) => p.value);
            return ret;
        }
        if (details.dimensionsDetails === undefined || details.dimensionsDetails.length === 1) {
            ret = details.items.map((p) => p.value);
            return ret;
        }
    }
    const proxy = {};
    Object.keys(details).forEach(p => {
        const prop = details[p];
        if (prop.get !== undefined) {
            Object.defineProperty(proxy, prop.name, {
                get() {
                    return mono_wasm_send_dbg_command(prop.get.id, prop.get.commandSet, prop.get.command, prop.get.buffer);
                },
                set: function (newValue) {
                    mono_wasm_send_dbg_command_with_parms(prop.set.id, prop.set.commandSet, prop.set.command, prop.set.buffer, prop.set.length, prop.set.valtype, newValue);
                    return true;
                }
            });
        }
        else if (prop.set !== undefined) {
            Object.defineProperty(proxy, prop.name, {
                get() {
                    return prop.value;
                },
                set: function (newValue) {
                    mono_wasm_send_dbg_command_with_parms(prop.set.id, prop.set.commandSet, prop.set.command, prop.set.buffer, prop.set.length, prop.set.valtype, newValue);
                    return true;
                }
            });
        }
        else {
            proxy[prop.name] = prop.value;
        }
    });
    return proxy;
}
function mono_wasm_call_function_on(request) {
    forceThreadMemoryViewRefresh();
    if (request.arguments != undefined && !Array.isArray(request.arguments))
        throw new Error(`"arguments" should be an array, but was ${request.arguments}`);
    const objId = request.objectId;
    const details = request.details;
    let proxy = {};
    if (objId.startsWith("dotnet:cfo_res:")) {
        if (objId in _call_function_res_cache)
            proxy = _call_function_res_cache[objId];
        else
            throw new Error(`Unknown object id ${objId}`);
    }
    else {
        proxy = _create_proxy_from_object_id(objId, details);
    }
    const fn_args = request.arguments != undefined ? request.arguments.map(a => JSON.stringify(a.value)) : [];
    const fn_body_template = `const fn = ${request.functionDeclaration}; return fn.apply(proxy, [${fn_args}]);`;
    const fn_defn = new Function("proxy", fn_body_template);
    const fn_res = fn_defn(proxy);
    if (fn_res === undefined)
        return { type: "undefined" };
    if (Object(fn_res) !== fn_res) {
        if (typeof (fn_res) == "object" && fn_res == null)
            return { type: typeof (fn_res), subtype: `${fn_res}`, value: null };
        return { type: typeof (fn_res), description: `${fn_res}`, value: `${fn_res}` };
    }
    if (request.returnByValue && fn_res.subtype == undefined)
        return { type: "object", value: fn_res };
    if (Object.getPrototypeOf(fn_res) == Array.prototype) {
        const fn_res_id = _cache_call_function_res(fn_res);
        return {
            type: "object",
            subtype: "array",
            className: "Array",
            description: `Array(${fn_res.length})`,
            objectId: fn_res_id
        };
    }
    if (fn_res.value !== undefined || fn_res.subtype !== undefined) {
        return fn_res;
    }
    if (fn_res == proxy)
        return { type: "object", className: "Object", description: "Object", objectId: objId };
    const fn_res_id = _cache_call_function_res(fn_res);
    return { type: "object", className: "Object", description: "Object", objectId: fn_res_id };
}
function _get_cfo_res_details(objectId, args) {
    if (!(objectId in _call_function_res_cache))
        throw new Error(`Could not find any object with id ${objectId}`);
    const real_obj = _call_function_res_cache[objectId];
    const descriptors = Object.getOwnPropertyDescriptors(real_obj);
    if (args.accessorPropertiesOnly) {
        Object.keys(descriptors).forEach(k => {
            if (descriptors[k].get === undefined)
                Reflect.deleteProperty(descriptors, k);
        });
    }
    const res_details = [];
    Object.keys(descriptors).forEach(k => {
        let new_obj;
        const prop_desc = descriptors[k];
        if (typeof prop_desc.value == "object") {
            // convert `{value: { type='object', ... }}`
            // to      `{ name: 'foo', value: { type='object', ... }}
            new_obj = Object.assign({ name: k }, prop_desc);
        }
        else if (prop_desc.value !== undefined) {
            // This is needed for values that were not added by us,
            // thus are like { value: 5 }
            // instead of    { value: { type = 'number', value: 5 }}
            //
            // This can happen, for eg., when `length` gets added for arrays
            // or `__proto__`.
            new_obj = {
                name: k,
                // merge/add `type` and `description` to `d.value`
                value: Object.assign({ type: (typeof prop_desc.value), description: "" + prop_desc.value }, prop_desc)
            };
        }
        else if (prop_desc.get !== undefined) {
            // The real_obj has the actual getter. We are just returning a placeholder
            // If the caller tries to run function on the cfo_res object,
            // that accesses this property, then it would be run on `real_obj`,
            // which *has* the original getter
            new_obj = {
                name: k,
                get: {
                    className: "Function",
                    description: `get ${k} () {}`,
                    type: "function"
                }
            };
        }
        else {
            new_obj = { name: k, value: { type: "symbol", value: "<Unknown>", description: "<Unknown>" } };
        }
        res_details.push(new_obj);
    });
    return { __value_as_json_string__: JSON.stringify(res_details) };
}
function mono_wasm_get_details(objectId, args = {}) {
    forceThreadMemoryViewRefresh();
    return _get_cfo_res_details(`dotnet:cfo_res:${objectId}`, args);
}
function _cache_call_function_res(obj) {
    const id = `dotnet:cfo_res:${_next_call_function_res_id++}`;
    _call_function_res_cache[id] = obj;
    return id;
}
function mono_wasm_release_object(objectId) {
    if (objectId in _call_function_res_cache)
        delete _call_function_res_cache[objectId];
}
function mono_wasm_debugger_log(level, message_ptr) {
    forceThreadMemoryViewRefresh();
    const message = utf8ToString(message_ptr);
    if (INTERNAL["logging"] && typeof INTERNAL.logging["debugger"] === "function") {
        INTERNAL.logging.debugger(level, message);
        return;
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Initialize the AOT profiler with OPTIONS.
// Requires the AOT profiler to be linked into the app.
// options = { writeAt: "<METHODNAME>", sendTo: "<METHODNAME>" }
// <METHODNAME> should be in the format <CLASS>::<METHODNAME>.
// writeAt defaults to 'WebAssembly.Runtime::StopProfile'.
// sendTo defaults to 'WebAssembly.Runtime::DumpAotProfileData'.
// DumpAotProfileData stores the data into INTERNAL.aotProfileData.
//
function mono_wasm_init_aot_profiler(options) {
    if (!(runtimeHelpers.emscriptenBuildOptions.enableAotProfiler)) mono_assert(false, "AOT profiler is not enabled, please use <WasmProfilers>aot;</WasmProfilers> in your project file."); // inlined mono_assert condition
    if (options == null)
        options = {};
    if (!("writeAt" in options))
        options.writeAt = "System.Runtime.InteropServices.JavaScript.JavaScriptExports::StopProfile";
    if (!("sendTo" in options))
        options.sendTo = "Interop/Runtime::DumpAotProfileData";
    const arg = "aot:write-at-method=" + options.writeAt + ",send-to-method=" + options.sendTo;
    profiler_c_functions.mono_wasm_profiler_init_aot(arg);
}
function mono_wasm_init_browser_profiler(options) {
    if (!(runtimeHelpers.emscriptenBuildOptions.enableBrowserProfiler)) mono_assert(false, "Browser profiler is not enabled, please use <WasmProfilers>browser;</WasmProfilers> in your project file."); // inlined mono_assert condition
    if (options == null)
        options = {};
    let arg = "browser:";
    if (typeof options.callSpec === "string") {
        arg += `callspec=${options.callSpec},`;
    }
    if (typeof options.sampleIntervalMs === "number") {
        arg += `interval=${options.sampleIntervalMs},`;
    }
    profiler_c_functions.mono_wasm_profiler_init_browser(arg);
}
function mono_wasm_init_log_profiler(options) {
    if (!(runtimeHelpers.emscriptenBuildOptions.enableLogProfiler)) mono_assert(false, "Log profiler is not enabled, please use <WasmProfilers>log;</WasmProfilers> in your project file."); // inlined mono_assert condition
    if (!(options.takeHeapshot)) mono_assert(false, "Log profiler is not enabled, the takeHeapshot method must be defined in LogProfilerOptions.takeHeapshot"); // inlined mono_assert condition
    if (!options.configuration) {
        options.configuration = "log:alloc,output=output.mlpd";
    }
    if (options.takeHeapshot) {
        profiler_c_functions.mono_wasm_profiler_init_log(`${options.configuration},take-heapshot-method=${options.takeHeapshot}`);
    }
    else {
        profiler_c_functions.mono_wasm_profiler_init_log(options.configuration);
    }
}
function startMeasure() {
    if (runtimeHelpers.enablePerfMeasure) {
        return globalThis.performance.now();
    }
    return undefined;
}
function endMeasure(start, block, id) {
    if (runtimeHelpers.enablePerfMeasure && start) {
        // API is slightly different between web and Nodejs
        const options = ENVIRONMENT_IS_WEB
            ? { start: start }
            : { startTime: start };
        const name = id ? `${block}${id} ` : block;
        globalThis.performance.measure(name, options);
    }
}
function mono_wasm_profiler_now() {
    return globalThis.performance.now();
}
function mono_wasm_profiler_free_method(method) {
    methodNames.delete(method);
}
const methodNames = new Map();
function mono_wasm_profiler_record(method, start) {
    const options = ENVIRONMENT_IS_WEB
        ? { start: start }
        : { startTime: start };
    let methodName = methodNames.get(method);
    if (!methodName) {
        const chars = profiler_c_functions.mono_wasm_method_get_name_ex(method);
        methodName = utf8ToString(chars);
        methodNames.set(method, methodName);
        free(chars);
    }
    globalThis.performance.measure(methodName, options);
}
function mono_wasm_instrument_method(method) {
    return runtimeHelpers.mono_wasm_instrument_method(method);
}

var WasmEnableJsInteropByValue = false;

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function initialize_marshalers_to_js() {
    if (cs_to_js_marshalers.size == 0) {
        cs_to_js_marshalers.set(21 /* MarshalerType.Array */, _marshal_array_to_js);
        cs_to_js_marshalers.set(23 /* MarshalerType.Span */, _marshal_span_to_js);
        cs_to_js_marshalers.set(22 /* MarshalerType.ArraySegment */, _marshal_array_segment_to_js);
        cs_to_js_marshalers.set(3 /* MarshalerType.Boolean */, _marshal_bool_to_js);
        cs_to_js_marshalers.set(4 /* MarshalerType.Byte */, _marshal_byte_to_js);
        cs_to_js_marshalers.set(5 /* MarshalerType.Char */, _marshal_char_to_js);
        cs_to_js_marshalers.set(6 /* MarshalerType.Int16 */, _marshal_int16_to_js);
        cs_to_js_marshalers.set(7 /* MarshalerType.Int32 */, marshal_int32_to_js);
        cs_to_js_marshalers.set(8 /* MarshalerType.Int52 */, _marshal_int52_to_js);
        cs_to_js_marshalers.set(9 /* MarshalerType.BigInt64 */, _marshal_bigint64_to_js);
        cs_to_js_marshalers.set(11 /* MarshalerType.Single */, _marshal_float_to_js);
        cs_to_js_marshalers.set(12 /* MarshalerType.IntPtr */, _marshal_intptr_to_js);
        cs_to_js_marshalers.set(10 /* MarshalerType.Double */, _marshal_double_to_js);
        cs_to_js_marshalers.set(15 /* MarshalerType.String */, marshal_string_to_js);
        cs_to_js_marshalers.set(16 /* MarshalerType.Exception */, marshal_exception_to_js);
        cs_to_js_marshalers.set(27 /* MarshalerType.JSException */, marshal_exception_to_js);
        cs_to_js_marshalers.set(13 /* MarshalerType.JSObject */, _marshal_js_object_to_js);
        cs_to_js_marshalers.set(14 /* MarshalerType.Object */, _marshal_cs_object_to_js);
        cs_to_js_marshalers.set(17 /* MarshalerType.DateTime */, _marshal_datetime_to_js);
        cs_to_js_marshalers.set(18 /* MarshalerType.DateTimeOffset */, _marshal_datetime_to_js);
        cs_to_js_marshalers.set(20 /* MarshalerType.Task */, marshal_task_to_js);
        cs_to_js_marshalers.set(29 /* MarshalerType.TaskRejected */, marshal_task_to_js);
        cs_to_js_marshalers.set(28 /* MarshalerType.TaskResolved */, marshal_task_to_js);
        cs_to_js_marshalers.set(30 /* MarshalerType.TaskPreCreated */, begin_marshal_task_to_js);
        cs_to_js_marshalers.set(24 /* MarshalerType.Action */, _marshal_delegate_to_js);
        cs_to_js_marshalers.set(25 /* MarshalerType.Function */, _marshal_delegate_to_js);
        cs_to_js_marshalers.set(0 /* MarshalerType.None */, _marshal_null_to_js);
        cs_to_js_marshalers.set(1 /* MarshalerType.Void */, _marshal_null_to_js);
        cs_to_js_marshalers.set(2 /* MarshalerType.Discard */, _marshal_null_to_js);
        cs_to_js_marshalers.set(26 /* MarshalerType.DiscardNoWait */, _marshal_null_to_js);
    }
}
function bind_arg_marshal_to_js(sig, marshaler_type, index) {
    if (marshaler_type === 0 /* MarshalerType.None */ || marshaler_type === 1 /* MarshalerType.Void */ || marshaler_type === 2 /* MarshalerType.Discard */ || marshaler_type === 26 /* MarshalerType.DiscardNoWait */) {
        return undefined;
    }
    let res_marshaler = undefined;
    let arg1_marshaler = undefined;
    let arg2_marshaler = undefined;
    let arg3_marshaler = undefined;
    arg1_marshaler = get_marshaler_to_cs_by_type(get_signature_arg1_type(sig));
    arg2_marshaler = get_marshaler_to_cs_by_type(get_signature_arg2_type(sig));
    arg3_marshaler = get_marshaler_to_cs_by_type(get_signature_arg3_type(sig));
    const marshaler_type_res = get_signature_res_type(sig);
    res_marshaler = get_marshaler_to_js_by_type(marshaler_type_res);
    if (marshaler_type === 19 /* MarshalerType.Nullable */) {
        // nullable has nested type information, it's stored in res slot of the signature. The marshaler is the same as for non-nullable primitive type.
        marshaler_type = marshaler_type_res;
    }
    const converter = get_marshaler_to_js_by_type(marshaler_type);
    const element_type = get_signature_arg1_type(sig);
    const arg_offset = index * JavaScriptMarshalerArgSize;
    return (args) => {
        return converter(args + arg_offset, element_type, res_marshaler, arg1_marshaler, arg2_marshaler, arg3_marshaler);
    };
}
function get_marshaler_to_js_by_type(marshaler_type) {
    if (marshaler_type === 0 /* MarshalerType.None */ || marshaler_type === 1 /* MarshalerType.Void */) {
        return undefined;
    }
    const converter = cs_to_js_marshalers.get(marshaler_type);
    if (!(converter && typeof converter === "function")) mono_assert(false, `ERR41: Unknown converter for type ${marshaler_type}. ${jsinteropDoc}`); // inlined mono_assert condition
    return converter;
}
function _marshal_bool_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_bool(arg);
}
function _marshal_byte_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_u8(arg);
}
function _marshal_char_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_u16(arg);
}
function _marshal_int16_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_i16(arg);
}
function marshal_int32_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_i32(arg);
}
function _marshal_int52_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_i52(arg);
}
function _marshal_bigint64_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_i64_big(arg);
}
function _marshal_float_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_f32(arg);
}
function _marshal_double_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_f64(arg);
}
function _marshal_intptr_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_intptr(arg);
}
function _marshal_null_to_js() {
    return null;
}
function _marshal_datetime_to_js(arg) {
    const type = get_arg_type(arg);
    if (type === 0 /* MarshalerType.None */) {
        return null;
    }
    return get_arg_date(arg);
}
// NOTE: at the moment, this can't dispatch async calls (with Task/Promise return type). Therefore we don't have to worry about pre-created Task.
function _marshal_delegate_to_js(arg, _, res_converter, arg1_converter, arg2_converter, arg3_converter) {
    const type = get_arg_type(arg);
    if (type === 0 /* MarshalerType.None */) {
        return null;
    }
    const gc_handle = get_arg_gc_handle(arg);
    let result = _lookup_js_owned_object(gc_handle);
    if (result === null || result === undefined) {
        // this will create new Function for the C# delegate
        result = (arg1_js, arg2_js, arg3_js) => {
            if (!(!WasmEnableThreads || !result.isDisposed)) mono_assert(false, "Delegate is disposed and should not be invoked anymore."); // inlined mono_assert condition
            // arg numbers are shifted by one, the real first is a gc handle of the callback
            return call_delegate(gc_handle, arg1_js, arg2_js, arg3_js, res_converter, arg1_converter, arg2_converter, arg3_converter);
        };
        result.dispose = () => {
            if (!result.isDisposed) {
                result.isDisposed = true;
                teardown_managed_proxy(result, gc_handle);
            }
        };
        result.isDisposed = false;
        if (BuildConfiguration === "Debug") {
            result[proxy_debug_symbol] = `C# Delegate with GCHandle ${gc_handle}`;
        }
        setup_managed_proxy(result, gc_handle);
    }
    return result;
}
class TaskHolder {
    constructor(promise, resolve_or_reject) {
        this.promise = promise;
        this.resolve_or_reject = resolve_or_reject;
    }
}
function marshal_task_to_js(arg, _, res_converter) {
    const type = get_arg_type(arg);
    // this path is used only when Task is passed as argument to JSImport and virtual JSHandle would be used
    if (!(type != 30 /* MarshalerType.TaskPreCreated */)) mono_assert(false, "Unexpected Task type: TaskPreCreated"); // inlined mono_assert condition
    // if there is synchronous result, return it
    const promise = try_marshal_sync_task_to_js(arg, type, res_converter);
    if (promise !== false) {
        return promise;
    }
    const jsv_handle = get_arg_js_handle(arg);
    const holder = create_task_holder(res_converter);
    register_with_jsv_handle(holder, jsv_handle);
    if (BuildConfiguration === "Debug") {
        holder[proxy_debug_symbol] = `TaskHolder with JSVHandle ${jsv_handle}`;
    }
    return holder.promise;
}
function begin_marshal_task_to_js(arg, _, res_converter) {
    // this path is used when Task is returned from JSExport/call_entry_point
    const holder = create_task_holder(res_converter);
    const js_handle = mono_wasm_get_js_handle(holder);
    if (BuildConfiguration === "Debug") {
        holder[proxy_debug_symbol] = `TaskHolder with JSHandle ${js_handle}`;
    }
    set_js_handle(arg, js_handle);
    set_arg_type(arg, 30 /* MarshalerType.TaskPreCreated */);
    return holder.promise;
}
function end_marshal_task_to_js(args, res_converter, eagerPromise) {
    // this path is used when Task is returned from JSExport/call_entry_point
    const res = get_arg(args, 1);
    const type = get_arg_type(res);
    // if there is no synchronous result, return eagerPromise we created earlier
    if (type === 30 /* MarshalerType.TaskPreCreated */) {
        return eagerPromise;
    }
    // otherwise drop the eagerPromise's handle
    const js_handle = mono_wasm_get_js_handle(eagerPromise);
    mono_wasm_release_cs_owned_object(js_handle);
    // get the synchronous result
    const promise = try_marshal_sync_task_to_js(res, type, res_converter);
    // make sure we got the result
    if (!(promise !== false)) mono_assert(false, `Expected synchronous result, got: ${type}`); // inlined mono_assert condition
    return promise;
}
function try_marshal_sync_task_to_js(arg, type, res_converter) {
    if (type === 0 /* MarshalerType.None */) {
        return null;
    }
    if (type === 29 /* MarshalerType.TaskRejected */) {
        return Promise.reject(marshal_exception_to_js(arg));
    }
    if (type === 28 /* MarshalerType.TaskResolved */) {
        const element_type = get_arg_element_type(arg);
        if (element_type === 1 /* MarshalerType.Void */) {
            return Promise.resolve();
        }
        // this will change the type to the actual type of the result
        set_arg_type(arg, element_type);
        if (!res_converter) {
            // when we arrived here from _marshal_cs_object_to_js
            res_converter = cs_to_js_marshalers.get(element_type);
        }
        if (!(res_converter)) mono_assert(false, `Unknown sub_converter for type ${element_type}. ${jsinteropDoc}`); // inlined mono_assert condition
        const val = res_converter(arg);
        return Promise.resolve(val);
    }
    return false;
}
function create_task_holder(res_converter) {
    const { promise, promise_control } = loaderHelpers.createPromiseController();
    const holder = new TaskHolder(promise, (type, js_handle, argInner) => {
        if (type === 29 /* MarshalerType.TaskRejected */) {
            const reason = marshal_exception_to_js(argInner);
            promise_control.reject(reason);
        }
        else if (type === 28 /* MarshalerType.TaskResolved */) {
            const type = get_arg_type(argInner);
            if (type === 1 /* MarshalerType.Void */) {
                promise_control.resolve(undefined);
            }
            else {
                if (!res_converter) {
                    // when we arrived here from _marshal_cs_object_to_js
                    res_converter = cs_to_js_marshalers.get(type);
                }
                if (!(res_converter)) mono_assert(false, `Unknown sub_converter for type ${type}. ${jsinteropDoc}`); // inlined mono_assert condition
                const js_value = res_converter(argInner);
                promise_control.resolve(js_value);
            }
        }
        else {
            if (!(false)) mono_assert(false, `Unexpected type ${type}`); // inlined mono_assert condition
        }
        mono_wasm_release_cs_owned_object(js_handle);
    });
    return holder;
}
function mono_wasm_resolve_or_reject_promise(args) {
    // rejection/resolution should not arrive earlier than the promise created by marshaling in mono_wasm_invoke_jsimport_MT
    invoke_later_when_on_ui_thread_async(() => mono_wasm_resolve_or_reject_promise_impl(args));
}
function mono_wasm_resolve_or_reject_promise_impl(args) {
    if (!loaderHelpers.is_runtime_running()) {
        if (loaderHelpers.diagnosticTracing) mono_log_debug("This promise resolution/rejection can't be propagated to managed code, mono runtime already exited."); // inlined mono_log_debug condition
        return;
    }
    args = fixupPointer(args, 0);
    const exc = get_arg(args, 0);
    const receiver_should_free = WasmEnableThreads && is_receiver_should_free(args);
    try {
        loaderHelpers.assert_runtime_running();
        const res = get_arg(args, 1);
        const arg_handle = get_arg(args, 2);
        const arg_value = get_arg(args, 3);
        const type = get_arg_type(arg_handle);
        const js_handle = get_arg_js_handle(arg_handle);
        const holder = mono_wasm_get_jsobj_from_js_handle(js_handle);
        if (!(holder)) mono_assert(false, `Cannot find Promise for JSHandle ${js_handle}`); // inlined mono_assert condition
        holder.resolve_or_reject(type, js_handle, arg_value);
        if (receiver_should_free) {
            // this works together with AllocHGlobal in JSFunctionBinding.ResolveOrRejectPromise
            free(args);
        }
        else {
            set_arg_type(res, 1 /* MarshalerType.Void */);
            set_arg_type(exc, 0 /* MarshalerType.None */);
        }
    }
    catch (ex) {
        if (receiver_should_free) {
            if (!(false)) mono_assert(false, `Failed to resolve or reject promise ${ex}`); // inlined mono_assert condition
        }
        marshal_exception_to_cs(exc, ex);
    }
}
function marshal_string_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    if (WasmEnableJsInteropByValue) {
        const buffer = get_arg_intptr(arg);
        const len = get_arg_length(arg) * 2;
        const value = utf16ToString(buffer, buffer + len);
        free(buffer);
        return value;
    }
    else {
        if (!(!WasmEnableThreads)) mono_assert(false, "Marshaling strings by reference is not supported in multithreaded mode"); // inlined mono_assert condition
        const root = get_string_root(arg);
        try {
            const value = monoStringToString(root);
            return value;
        }
        finally {
            root.release();
        }
    }
}
function marshal_exception_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    if (type == 27 /* MarshalerType.JSException */) {
        // this is JSException roundtrip
        const js_handle = get_arg_js_handle(arg);
        const js_obj = mono_wasm_get_jsobj_from_js_handle(js_handle);
        return js_obj;
    }
    const gc_handle = get_arg_gc_handle(arg);
    let result = _lookup_js_owned_object(gc_handle);
    if (result === null || result === undefined) {
        // this will create new ManagedError
        const message = marshal_string_to_js(arg);
        result = new ManagedError(message);
        if (BuildConfiguration === "Debug") {
            result[proxy_debug_symbol] = `C# Exception with GCHandle ${gc_handle}`;
        }
        setup_managed_proxy(result, gc_handle);
    }
    return result;
}
function _marshal_js_object_to_js(arg) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    const js_handle = get_arg_js_handle(arg);
    const js_obj = mono_wasm_get_jsobj_from_js_handle(js_handle);
    if (!(js_obj !== undefined)) mono_assert(false, `JS object JSHandle ${js_handle} was not found`); // inlined mono_assert condition
    return js_obj;
}
function _marshal_cs_object_to_js(arg) {
    const marshaler_type = get_arg_type(arg);
    if (marshaler_type == 0 /* MarshalerType.None */) {
        return null;
    }
    if (marshaler_type == 13 /* MarshalerType.JSObject */) {
        const js_handle = get_arg_js_handle(arg);
        const js_obj = mono_wasm_get_jsobj_from_js_handle(js_handle);
        return js_obj;
    }
    if (marshaler_type == 21 /* MarshalerType.Array */) {
        const element_type = get_arg_element_type(arg);
        return _marshal_array_to_js_impl(arg, element_type);
    }
    if (marshaler_type == 14 /* MarshalerType.Object */) {
        const gc_handle = get_arg_gc_handle(arg);
        if (gc_handle === GCHandleNull) {
            return null;
        }
        // see if we have js owned instance for this gc_handle already
        let result = _lookup_js_owned_object(gc_handle);
        // If the JS object for this gc_handle was already collected (or was never created)
        if (!result) {
            result = new ManagedObject();
            if (BuildConfiguration === "Debug") {
                result[proxy_debug_symbol] = `C# Object with GCHandle ${gc_handle}`;
            }
            setup_managed_proxy(result, gc_handle);
        }
        return result;
    }
    // other types
    const converter = cs_to_js_marshalers.get(marshaler_type);
    if (!(converter)) mono_assert(false, `Unknown converter for type ${marshaler_type}. ${jsinteropDoc}`); // inlined mono_assert condition
    return converter(arg);
}
function _marshal_array_to_js(arg, element_type) {
    if (!(!!element_type)) mono_assert(false, "Expected valid element_type parameter"); // inlined mono_assert condition
    return _marshal_array_to_js_impl(arg, element_type);
}
function _marshal_array_to_js_impl(arg, element_type) {
    const type = get_arg_type(arg);
    if (type == 0 /* MarshalerType.None */) {
        return null;
    }
    const elementSize = array_element_size(element_type);
    if (!(elementSize != -1)) mono_assert(false, `Element type ${element_type} not supported`); // inlined mono_assert condition
    const buffer_ptr = get_arg_intptr(arg);
    const length = get_arg_length(arg);
    let result = null;
    if (element_type == 15 /* MarshalerType.String */) {
        result = new Array(length);
        for (let index = 0; index < length; index++) {
            const element_arg = get_arg(buffer_ptr, index);
            result[index] = marshal_string_to_js(element_arg);
        }
        if (!WasmEnableJsInteropByValue) {
            if (!(!WasmEnableThreads)) mono_assert(false, "Marshaling string by reference is not supported in multithreaded mode"); // inlined mono_assert condition
            wrapped_c_functions.mono_wasm_deregister_root(buffer_ptr);
        }
    }
    else if (element_type == 14 /* MarshalerType.Object */) {
        result = new Array(length);
        for (let index = 0; index < length; index++) {
            const element_arg = get_arg(buffer_ptr, index);
            result[index] = _marshal_cs_object_to_js(element_arg);
        }
        if (!WasmEnableJsInteropByValue) {
            if (!(!WasmEnableThreads)) mono_assert(false, "Marshaling objects by reference is not supported in multithreaded mode"); // inlined mono_assert condition
            wrapped_c_functions.mono_wasm_deregister_root(buffer_ptr);
        }
    }
    else if (element_type == 13 /* MarshalerType.JSObject */) {
        result = new Array(length);
        for (let index = 0; index < length; index++) {
            const element_arg = get_arg(buffer_ptr, index);
            result[index] = _marshal_js_object_to_js(element_arg);
        }
    }
    else if (element_type == 4 /* MarshalerType.Byte */) {
        const bufferOffset = fixupPointer(buffer_ptr, 0);
        const sourceView = localHeapViewU8().subarray(bufferOffset, bufferOffset + length);
        result = sourceView.slice(); //copy
    }
    else if (element_type == 7 /* MarshalerType.Int32 */) {
        const bufferOffset = fixupPointer(buffer_ptr, 2);
        const sourceView = localHeapViewI32().subarray(bufferOffset, bufferOffset + length);
        result = sourceView.slice(); //copy
    }
    else if (element_type == 10 /* MarshalerType.Double */) {
        const bufferOffset = fixupPointer(buffer_ptr, 3);
        const sourceView = localHeapViewF64().subarray(bufferOffset, bufferOffset + length);
        result = sourceView.slice(); //copy
    }
    else {
        throw new Error(`NotImplementedException ${element_type}. ${jsinteropDoc}`);
    }
    free(buffer_ptr);
    return result;
}
function _marshal_span_to_js(arg, element_type) {
    if (!(!!element_type)) mono_assert(false, "Expected valid element_type parameter"); // inlined mono_assert condition
    const buffer_ptr = get_arg_intptr(arg);
    const length = get_arg_length(arg);
    let result = null;
    if (element_type == 4 /* MarshalerType.Byte */) {
        result = new Span(buffer_ptr, length, 0 /* MemoryViewType.Byte */);
    }
    else if (element_type == 7 /* MarshalerType.Int32 */) {
        result = new Span(buffer_ptr, length, 1 /* MemoryViewType.Int32 */);
    }
    else if (element_type == 10 /* MarshalerType.Double */) {
        result = new Span(buffer_ptr, length, 2 /* MemoryViewType.Double */);
    }
    else {
        throw new Error(`NotImplementedException ${element_type}. ${jsinteropDoc}`);
    }
    return result;
}
function _marshal_array_segment_to_js(arg, element_type) {
    if (!(!!element_type)) mono_assert(false, "Expected valid element_type parameter"); // inlined mono_assert condition
    const buffer_ptr = get_arg_intptr(arg);
    const length = get_arg_length(arg);
    let result = null;
    if (element_type == 4 /* MarshalerType.Byte */) {
        result = new ArraySegment(buffer_ptr, length, 0 /* MemoryViewType.Byte */);
    }
    else if (element_type == 7 /* MarshalerType.Int32 */) {
        result = new ArraySegment(buffer_ptr, length, 1 /* MemoryViewType.Int32 */);
    }
    else if (element_type == 10 /* MarshalerType.Double */) {
        result = new ArraySegment(buffer_ptr, length, 2 /* MemoryViewType.Double */);
    }
    else {
        throw new Error(`NotImplementedException ${element_type}. ${jsinteropDoc}`);
    }
    const gc_handle = get_arg_gc_handle(arg);
    if (BuildConfiguration === "Debug") {
        result[proxy_debug_symbol] = `C# ArraySegment with GCHandle ${gc_handle}`;
    }
    setup_managed_proxy(result, gc_handle);
    return result;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// A duplicate in loader/assets.ts
const worker_empty_prefix = "          -    ";
const monoThreadInfoPartial = {
    pthreadId: PThreadPtrNull,
    reuseCount: 0,
    updateCount: 0,
    threadPrefix: worker_empty_prefix,
    threadName: "emscripten-loaded",
};
const monoThreadInfo = monoThreadInfoPartial;
function isMonoThreadMessage(x) {
    if (typeof (x) !== "object" || x === null) {
        return false;
    }
    const xmsg = x;
    return typeof (xmsg.type) === "string" && typeof (xmsg.cmd) === "string";
}
// this is just for Debug build of the runtime, making it easier to debug worker threads
function update_thread_info() {
    if (!WasmEnableThreads)
        return;
    const threadType = !monoThreadInfo.isRegistered ? "emsc"
        : monoThreadInfo.isUI ? "-UI-"
            : monoThreadInfo.isDeputy ? "dpty"
                : monoThreadInfo.isIo ? "-IO-"
                    : monoThreadInfo.isTimer ? "timr"
                        : monoThreadInfo.isLongRunning ? "long"
                            : monoThreadInfo.isThreadPoolGate ? "gate"
                                : monoThreadInfo.isDebugger ? "dbgr"
                                    : monoThreadInfo.isThreadPoolWorker ? "pool"
                                        : monoThreadInfo.isExternalEventLoop ? "jsww"
                                            : monoThreadInfo.isBackground ? "back"
                                                : "norm";
    const hexPtr = monoThreadInfo.pthreadId.toString(16).padStart(8, "0");
    const hexPrefix = monoThreadInfo.isRegistered ? "0x" : "--";
    monoThreadInfo.threadPrefix = `${hexPrefix}${hexPtr}-${threadType}`;
    loaderHelpers.set_thread_prefix(monoThreadInfo.threadPrefix);
    if (!loaderHelpers.config.forwardConsoleLogsToWS) {
        set_thread_prefix(monoThreadInfo.threadPrefix);
    }
    // this is just to make debugging easier by naming the thread debugger window.
    // It's not CSP compliant and possibly not performant, that's why it's only enabled in debug builds
    // in Release configuration, it would be a trimmed by rollup
    if (WasmEnableThreads && BuildConfiguration === "Debug" && !runtimeHelpers.cspPolicy) {
        monoThreadInfo.updateCount++;
        try {
            const url = `//# sourceURL=https://dotnet/thread/${monoThreadInfo.updateCount}-${monoThreadInfo.threadPrefix}`;
            const infoJson = JSON.stringify(monoThreadInfo, null, 2);
            const body = `const monoThreadInfo=${infoJson};\r\nconsole.log(monoThreadInfo);`;
            globalThis.monoThreadInfoFn = new Function(body + "\r\n" + url);
        }
        catch (ex) {
            runtimeHelpers.cspPolicy = true;
        }
    }
}
function exec_synchronization_context_pump() {
    if (!loaderHelpers.is_runtime_running()) {
        return;
    }
    forceThreadMemoryViewRefresh();
    try {
        threads_c_functions.mono_wasm_synchronization_context_pump();
    }
    catch (ex) {
        loaderHelpers.mono_exit(1, ex);
    }
}
function mono_wasm_schedule_synchronization_context() {
    if (!WasmEnableThreads)
        return;
    Module.safeSetTimeout(exec_synchronization_context_pump, 0);
}
function mono_wasm_pthread_ptr() {
    if (!WasmEnableThreads)
        return PThreadPtrNull;
    return Module["_pthread_self"]();
}
function mono_wasm_main_thread_ptr() {
    if (!WasmEnableThreads)
        return PThreadPtrNull;
    return Module["_emscripten_main_runtime_thread_id"]();
}
function postMessageToMain(message, transfer) {
    self.postMessage({
        [monoMessageSymbol]: message
    }, transfer ? transfer : []);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function mono_wasm_install_js_worker_interop(context_gc_handle) {
    if (!WasmEnableThreads)
        return;
    bindings_init();
    if (!(!runtimeHelpers.proxyGCHandle)) mono_assert(false, "JS interop should not be already installed on this worker."); // inlined mono_assert condition
    runtimeHelpers.proxyGCHandle = context_gc_handle;
    if (ENVIRONMENT_IS_PTHREAD) {
        runtimeHelpers.managedThreadTID = runtimeHelpers.currentThreadTID;
        runtimeHelpers.isManagedRunningOnCurrentThread = true;
    }
    Module.runtimeKeepalivePush();
    monoThreadInfo.isDirtyBecauseOfInterop = true;
    update_thread_info();
    if (ENVIRONMENT_IS_PTHREAD) {
        postMessageToMain({
            monoCmd: "notify_enabled_interop" /* WorkerToMainMessageType.enabledInterop */,
            info: monoThreadInfo,
        });
    }
}
function mono_wasm_uninstall_js_worker_interop() {
    if (!WasmEnableThreads)
        return;
    if (!(runtimeHelpers.mono_wasm_bindings_is_ready)) mono_assert(false, "JS interop is not installed on this worker."); // inlined mono_assert condition
    if (!(runtimeHelpers.proxyGCHandle)) mono_assert(false, "JSSynchronizationContext is not installed on this worker."); // inlined mono_assert condition
    forceDisposeProxies(true, runtimeHelpers.diagnosticTracing);
    Module.runtimeKeepalivePop();
    runtimeHelpers.proxyGCHandle = GCHandleNull;
    runtimeHelpers.mono_wasm_bindings_is_ready = false;
    update_thread_info();
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const threadPromises = new Map();
class ThreadImpl {
    constructor(pthreadPtr, worker, port) {
        this.pthreadPtr = pthreadPtr;
        this.worker = worker;
        this.port = port;
    }
    postMessageToWorker(message) {
        this.port.postMessage(message);
    }
}
/// wait until the thread with the given id has set up a message port to the runtime
function waitForThread(pthreadPtr) {
    if (!WasmEnableThreads)
        return null;
    if (!(!ENVIRONMENT_IS_WORKER)) mono_assert(false, "waitForThread should only be called from the UI thread"); // inlined mono_assert condition
    const worker = getWorker(pthreadPtr);
    if (worker === null || worker === void 0 ? void 0 : worker.thread) {
        return Promise.resolve(worker === null || worker === void 0 ? void 0 : worker.thread);
    }
    const promiseAndController = createPromiseController();
    const arr = threadPromises.get(pthreadPtr);
    if (arr === undefined) {
        threadPromises.set(pthreadPtr, [promiseAndController.promise_control]);
    }
    else {
        arr.push(promiseAndController.promise_control);
    }
    return promiseAndController.promise;
}
function resolveThreadPromises(pthreadPtr, thread) {
    if (!WasmEnableThreads)
        return;
    const arr = threadPromises.get(pthreadPtr);
    if (arr !== undefined) {
        arr.forEach((controller) => {
            if (thread) {
                controller.resolve(thread);
            }
            else {
                controller.reject();
            }
        });
        threadPromises.delete(pthreadPtr);
    }
}
// handler that runs in the main thread when a message is received from a pthread worker
function monoWorkerMessageHandler(worker, ev) {
    var _a, _b;
    if (!WasmEnableThreads)
        return;
    let pthreadId;
    // this is emscripten message
    if (ev.data.cmd === "killThread") {
        pthreadId = ev.data["thread"];
        if (!(pthreadId == worker.info.pthreadId)) mono_assert(false, "expected pthreadId to match"); // inlined mono_assert condition
        worker.info.isRunning = false;
        worker.info.pthreadId = PThreadPtrNull;
        return;
    }
    const message = ev.data[monoMessageSymbol];
    if (message === undefined) {
        /// N.B. important to ignore messages we don't recognize - Emscripten uses the message event to send internal messages
        return;
    }
    let thread;
    pthreadId = (_b = (_a = message.info) === null || _a === void 0 ? void 0 : _a.pthreadId) !== null && _b !== void 0 ? _b : 0;
    worker.info = Object.assign({}, worker.info, message.info);
    switch (message.monoCmd) {
        case "preload" /* WorkerToMainMessageType.preload */:
            // this one shot port from setupPreloadChannelToMainThread
            message.port.postMessage({
                type: "pthread",
                cmd: "applyConfig" /* MainToWorkerMessageType.applyConfig */,
                config: JSON.stringify(runtimeHelpers.config),
                monoThreadInfo: JSON.stringify(worker.info),
            });
            break;
        case "pthreadCreated" /* WorkerToMainMessageType.pthreadCreated */:
            thread = new ThreadImpl(pthreadId, worker, message.port);
            worker.thread = thread;
            worker.info.isRunning = true;
            resolveThreadPromises(pthreadId, thread);
            worker.info = Object.assign(worker.info, message.info, {});
            break;
        case "monoStarted" /* WorkerToMainMessageType.deputyStarted */:
            runtimeHelpers.deputyWorker = worker;
            runtimeHelpers.afterMonoStarted.promise_control.resolve();
            break;
        case "deputyReady" /* WorkerToMainMessageType.deputyReady */:
            runtimeHelpers.afterDeputyReady.promise_control.resolve(message.deputyProxyGCHandle);
            break;
        case "ioStarted" /* WorkerToMainMessageType.ioStarted */:
            runtimeHelpers.afterIOStarted.promise_control.resolve();
            break;
        case "deputyFailed" /* WorkerToMainMessageType.deputyFailed */:
            runtimeHelpers.afterMonoStarted.promise_control.reject(new Error(message.error));
            break;
        case "monoRegistered" /* WorkerToMainMessageType.monoRegistered */:
        case "monoAttached" /* WorkerToMainMessageType.monoAttached */:
        case "notify_enabled_interop" /* WorkerToMainMessageType.enabledInterop */:
        case "monoUnRegistered" /* WorkerToMainMessageType.monoUnRegistered */:
        case "updateInfo" /* WorkerToMainMessageType.updateInfo */:
        case "createdDeputy" /* WorkerToMainMessageType.deputyCreated */:
            // just worker.info updates above
            break;
        default:
            throw new Error(`Unhandled message from worker: ${message.monoCmd}`);
    }
}
/// Called by Emscripten internals on the browser thread when a new pthread worker is created and added to the pthread worker pool.
/// At this point the worker doesn't have any pthread assigned to it, yet.
function onWorkerLoadInitiated(worker, loaded) {
    if (!WasmEnableThreads)
        return;
    worker.addEventListener("message", (ev) => monoWorkerMessageHandler(worker, ev));
    loaded.then(() => {
        worker.info.isLoaded = true;
    });
}
async function populateEmscriptenPool() {
    if (!WasmEnableThreads)
        return;
    const unused = getUnusedWorkerPool();
    const loadingWorkers = await loaderHelpers.loadingWorkers.promise;
    for (const worker of loadingWorkers) {
        unused.push(worker);
    }
    loadingWorkers.length = 0;
}
async function mono_wasm_init_threads() {
    if (!WasmEnableThreads)
        return;
    // setup the UI thread
    runtimeHelpers.currentThreadTID = monoThreadInfo.pthreadId = mono_wasm_pthread_ptr();
    monoThreadInfo.threadName = "UI Thread";
    monoThreadInfo.isUI = true;
    monoThreadInfo.isRunning = true;
    monoThreadInfo.workerNumber = 0;
    update_thread_info();
    // wait until all workers in the pool are loaded - ready to be used as pthread synchronously
    const workers = getUnusedWorkerPool();
    if (workers.length > 0) {
        const promises = workers.map(loadWasmModuleToWorker);
        await Promise.all(promises);
    }
    else {
        mono_log_warn("No workers in the pthread pool, please validate the pthreadPoolInitialSize");
    }
}
// when we create threads with browser event loop, it's not able to be joined by mono's thread join during shutdown and blocks process exit
function postCancelThreads() {
    if (!WasmEnableThreads)
        return;
    const workers = getRunningWorkers();
    for (const worker of workers) {
        if (worker.info.isExternalEventLoop) {
            worker.postMessage({ cmd: "cancel" });
        }
    }
}
function mono_wasm_dump_threads() {
    if (!WasmEnableThreads)
        return;
    mono_log_info("Dumping web worker info as seen by UI thread, it could be stale: ");
    const emptyInfo = {
        workerNumber: -1,
        pthreadId: PThreadPtrNull,
        threadPrefix: worker_empty_prefix,
        threadName: "????",
        isRunning: false,
        isAttached: false,
        isExternalEventLoop: false,
        reuseCount: 0,
        updateCount: 0,
    };
    const threadInfos = [
        Object.assign({}, emptyInfo, monoThreadInfo), // UI thread
    ];
    for (const worker of getRunningWorkers()) {
        threadInfos.push(Object.assign({}, emptyInfo, worker.info));
    }
    for (const worker of getUnusedWorkerPool()) {
        threadInfos.push(Object.assign({}, emptyInfo, worker.info));
    }
    threadInfos.forEach((info) => {
        const idx = info.workerNumber.toString().padStart(3, "0");
        const isRunning = (info.isRunning + "").padStart(5, " ");
        const isAttached = (info.isAttached + "").padStart(5, " ");
        const isEventLoop = (info.isExternalEventLoop + "").padStart(5, " ");
        const reuseCount = (info.reuseCount + "").padStart(3, " ");
        // eslint-disable-next-line no-console
        console.info(`${idx} | ${info.threadPrefix}: isRunning:${isRunning} isAttached:${isAttached} isEventLoop:${isEventLoop} reuseCount:${reuseCount} - ${info.threadName}`);
    });
}
function replaceEmscriptenPThreadUI(modulePThread) {
    if (!WasmEnableThreads)
        return;
    const originalLoadWasmModuleToWorker = modulePThread.loadWasmModuleToWorker;
    const originalReturnWorkerToPool = modulePThread.returnWorkerToPool;
    modulePThread.loadWasmModuleToWorker = (worker) => {
        const afterLoaded = originalLoadWasmModuleToWorker(worker);
        onWorkerLoadInitiated(worker, afterLoaded);
        if (loaderHelpers.config.exitOnUnhandledError) {
            worker.onerror = (e) => {
                loaderHelpers.mono_exit(1, e);
            };
        }
        return afterLoaded;
    };
    modulePThread.allocateUnusedWorker = allocateUnusedWorker;
    modulePThread.getNewWorker = () => getNewWorker(modulePThread);
    modulePThread.returnWorkerToPool = (worker) => {
        var _a;
        // when JS interop is installed on JSWebWorker
        // we can't reuse the worker, because user code could leave the worker JS globals in a dirty state
        worker.info.isRunning = false;
        resolveThreadPromises(worker.pthread_ptr, undefined);
        worker.info.pthreadId = PThreadPtrNull;
        if ((_a = worker.thread) === null || _a === void 0 ? void 0 : _a.port) {
            worker.thread.port.close();
        }
        worker.thread = undefined;
        if (worker.info && worker.info.isDirtyBecauseOfInterop) {
            // we are on UI thread, invoke the handler directly to destroy the dirty worker
            worker.onmessage(new MessageEvent("message", {
                data: {
                    "cmd": "killThread",
                    thread: worker.pthread_ptr
                }
            }));
        }
        else {
            originalReturnWorkerToPool(worker);
        }
    };
    if (BuildConfiguration === "Debug") {
        globalThis.dumpThreads = mono_wasm_dump_threads;
        globalThis.getModulePThread = getModulePThread;
    }
}
function getNewWorker(modulePThread) {
    if (!WasmEnableThreads)
        return null;
    if (modulePThread.unusedWorkers.length == 0) {
        if (loaderHelpers.diagnosticTracing) mono_log_debug(`Failed to find unused WebWorker, this may deadlock. Please increase the pthreadPoolInitialSize. Running threads ${modulePThread.runningWorkers.length}. Loading workers: ${modulePThread.unusedWorkers.length}`); // inlined mono_log_debug condition
        const worker = allocateUnusedWorker();
        modulePThread.loadWasmModuleToWorker(worker);
        return worker;
    }
    // keep them pre-allocated all the time, not just during startup
    if (modulePThread.unusedWorkers.length <= loaderHelpers.config.pthreadPoolUnusedSize) {
        const worker = allocateUnusedWorker();
        modulePThread.loadWasmModuleToWorker(worker);
    }
    for (let i = 0; i < modulePThread.unusedWorkers.length; i++) {
        const worker = modulePThread.unusedWorkers[i];
        if (worker.loaded) {
            modulePThread.unusedWorkers.splice(i, 1);
            return worker;
        }
    }
    if (loaderHelpers.diagnosticTracing) mono_log_debug(`Failed to find loaded WebWorker, this may deadlock. Please increase the pthreadPoolInitialSize. Running threads ${modulePThread.runningWorkers.length}. Loading workers: ${modulePThread.unusedWorkers.length}`); // inlined mono_log_debug condition
    return modulePThread.unusedWorkers.pop();
}
/// We replace Module["PThreads"].allocateUnusedWorker with this version that knows about assets
function allocateUnusedWorker() {
    if (!WasmEnableThreads)
        return null;
    const asset = loaderHelpers.resolve_single_asset_path("js-module-threads");
    const uri = asset.resolvedUrl;
    if (!(uri !== undefined)) mono_assert(false, "could not resolve the uri for the js-module-threads asset"); // inlined mono_assert condition
    const workerNumber = loaderHelpers.workerNextNumber++;
    const worker = new Worker(uri, {
        name: "dotnet-worker-" + workerNumber.toString().padStart(3, "0"),
        type: "module",
    });
    getUnusedWorkerPool().push(worker);
    worker.loaded = false;
    worker.info = {
        workerNumber,
        pthreadId: PThreadPtrNull,
        reuseCount: 0,
        updateCount: 0,
        threadPrefix: worker_empty_prefix,
        threadName: "emscripten-pool",
    };
    return worker;
}
function getWorker(pthreadPtr) {
    return getModulePThread().pthreads[pthreadPtr];
}
function getUnusedWorkerPool() {
    return getModulePThread().unusedWorkers;
}
function getRunningWorkers() {
    return getModulePThread().runningWorkers;
}
function terminateAllThreads() {
    getModulePThread().terminateAllThreads();
}
function loadWasmModuleToWorker(worker) {
    return getModulePThread().loadWasmModuleToWorker(worker);
}
function getModulePThread() {
    return Module.PThread;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const dotnetPthreadCreated = "dotnet:pthread:created";
const dotnetPthreadAttached = "dotnet:pthread:attached";
let WorkerThreadEventClassConstructor;
const makeWorkerThreadEvent = !WasmEnableThreads
    ? (() => {
        throw new Error("threads support disabled");
    })
    : ((type, pthread_self) => {
        if (!WorkerThreadEventClassConstructor)
            WorkerThreadEventClassConstructor = class WorkerThreadEventImpl extends Event {
                constructor(type, pthread_self) {
                    super(type);
                    this.pthread_self = pthread_self;
                }
            };
        return new WorkerThreadEventClassConstructor(type, pthread_self);
    });

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/// <reference lib="webworker" />
let pthread_self = null;
class WorkerSelf {
    constructor(info, portToBrowser) {
        this.info = info;
        this.portToBrowser = portToBrowser;
    }
    postMessageToBrowser(message, transfer) {
        if (transfer) {
            this.portToBrowser.postMessage(message, transfer);
        }
        else {
            this.portToBrowser.postMessage(message);
        }
    }
    addEventListenerFromBrowser(listener) {
        this.portToBrowser.addEventListener("message", listener);
    }
}
/// This is the "public internal" API for runtime subsystems that wish to be notified about
/// pthreads that are running on the current worker.
/// Example:
///    currentWorkerThreadEvents.addEventListener(dotnetPthreadCreated, (ev: WorkerThreadEvent) => {
///       mono_trace("thread created on worker with id", ev.pthread_ptr);
///    });
let currentWorkerThreadEvents = undefined;
// this is very very early in the worker startup
function initWorkerThreadEvents() {
    // treeshake if threads are disabled
    currentWorkerThreadEvents = WasmEnableThreads ? new globalThis.EventTarget() : null;
    Object.assign(monoThreadInfo, runtimeHelpers.monoThreadInfo);
}
// this is the message handler for the worker that receives messages from the main thread
// extend this with new cases as needed
function monoDedicatedChannelMessageFromMainToWorker(event) {
    if (loaderHelpers.diagnosticTracing) mono_log_debug(`got message from main on the dedicated channel ${event.data}`); // inlined mono_log_debug condition
}
function on_emscripten_thread_init(pthread_ptr) {
    runtimeHelpers.currentThreadTID = monoThreadInfo.pthreadId = pthread_ptr;
    forceThreadMemoryViewRefresh();
}
/// Called by emscripten when a pthread is setup to run on a worker.  Can be called multiple times
/// for the same webworker, since emscripten can reuse workers.
/// This is an implementation detail, that shouldn't be used directly.
function mono_wasm_pthread_on_pthread_created() {
    if (!WasmEnableThreads)
        return;
    try {
        forceThreadMemoryViewRefresh();
        const pthread_id = mono_wasm_pthread_ptr();
        mono_assert(pthread_id == monoThreadInfo.pthreadId, `needs to match (mono_wasm_pthread_ptr ${pthread_id}, threadId from thread info ${monoThreadInfo.pthreadId})`);
        monoThreadInfo.reuseCount++;
        monoThreadInfo.updateCount++;
        monoThreadInfo.threadName = "pthread-assigned";
        update_thread_info();
        // don't do this callback for the main thread
        if (!ENVIRONMENT_IS_PTHREAD)
            return;
        currentWorkerThreadEvents.dispatchEvent(makeWorkerThreadEvent(dotnetPthreadCreated, pthread_self));
        const channel = new MessageChannel();
        const workerPort = channel.port1;
        const mainPort = channel.port2;
        workerPort.addEventListener("message", monoDedicatedChannelMessageFromMainToWorker);
        workerPort.start();
        // this could be replacement
        if (pthread_self && pthread_self.portToBrowser) {
            pthread_self.portToBrowser.close();
        }
        pthread_self = new WorkerSelf(monoThreadInfo, workerPort);
        postMessageToMain({
            monoCmd: "pthreadCreated" /* WorkerToMainMessageType.pthreadCreated */,
            info: monoThreadInfo,
            port: mainPort,
        }, [mainPort]);
    }
    catch (err) {
        mono_log_error("mono_wasm_pthread_on_pthread_created () failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
/// Called in the worker thread (not main thread) from mono when a pthread becomes registered to the mono runtime.
function mono_wasm_pthread_on_pthread_registered(pthread_id) {
    if (!WasmEnableThreads)
        return;
    try {
        if (!(monoThreadInfo !== null && monoThreadInfo.pthreadId == pthread_id)) mono_assert(false, "expected monoThreadInfo to be set already when registering"); // inlined mono_assert condition
        monoThreadInfo.isRegistered = true;
        update_thread_info();
        postMessageToMain({
            monoCmd: "monoRegistered" /* WorkerToMainMessageType.monoRegistered */,
            info: monoThreadInfo,
        });
        preRunWorker();
    }
    catch (err) {
        mono_log_error("mono_wasm_pthread_on_pthread_registered () failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
/// Called in the worker thread (not main thread) from mono when a pthread becomes attached to the mono runtime.
function mono_wasm_pthread_on_pthread_attached(pthread_id, thread_name, background_thread, threadpool_thread, external_eventloop, debugger_thread) {
    if (!WasmEnableThreads)
        return;
    try {
        if (!(monoThreadInfo !== null && monoThreadInfo.pthreadId == pthread_id)) mono_assert(false, "expected monoThreadInfo to be set already when attaching"); // inlined mono_assert condition
        const name = monoThreadInfo.threadName = utf8ToString(thread_name);
        monoThreadInfo.isAttached = true;
        monoThreadInfo.isThreadPoolWorker = threadpool_thread !== 0;
        monoThreadInfo.isExternalEventLoop = external_eventloop !== 0;
        monoThreadInfo.isBackground = background_thread !== 0;
        monoThreadInfo.isDebugger = debugger_thread !== 0;
        // FIXME: this is a hack to get constant length thread names
        monoThreadInfo.threadName = name;
        monoThreadInfo.isTimer = name == ".NET Timer";
        monoThreadInfo.isLongRunning = name == ".NET Long Running Task";
        monoThreadInfo.isThreadPoolGate = name == ".NET TP Gate";
        update_thread_info();
        currentWorkerThreadEvents.dispatchEvent(makeWorkerThreadEvent(dotnetPthreadAttached, pthread_self));
        postMessageToMain({
            monoCmd: "monoAttached" /* WorkerToMainMessageType.monoAttached */,
            info: monoThreadInfo,
        });
    }
    catch (err) {
        mono_log_error("mono_wasm_pthread_on_pthread_attached () failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
function mono_wasm_pthread_set_name(name) {
    if (!WasmEnableThreads)
        return;
    if (!ENVIRONMENT_IS_PTHREAD)
        return;
    monoThreadInfo.threadName = utf8ToString(name);
    update_thread_info();
    postMessageToMain({
        monoCmd: "updateInfo" /* WorkerToMainMessageType.updateInfo */,
        info: monoThreadInfo,
    });
}
/// Called in the worker thread (not main thread) from mono when a pthread becomes detached from the mono runtime.
function mono_wasm_pthread_on_pthread_unregistered(pthread_id) {
    if (!WasmEnableThreads)
        return;
    try {
        if (!(pthread_id === monoThreadInfo.pthreadId)) mono_assert(false, "expected pthread_id to match when un-registering"); // inlined mono_assert condition
        postRunWorker();
        monoThreadInfo.isAttached = false;
        monoThreadInfo.isRegistered = false;
        monoThreadInfo.threadName = "unregistered:(" + monoThreadInfo.threadName + ")";
        update_thread_info();
        postMessageToMain({
            monoCmd: "monoUnRegistered" /* WorkerToMainMessageType.monoUnRegistered */,
            info: monoThreadInfo,
        });
    }
    catch (err) {
        mono_log_error("mono_wasm_pthread_on_pthread_unregistered () failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
function replaceEmscriptenTLSInit(modulePThread) {
    if (!WasmEnableThreads)
        return;
    const originalThreadInitTLS = modulePThread.threadInitTLS;
    modulePThread.threadInitTLS = () => {
        originalThreadInitTLS();
        mono_wasm_pthread_on_pthread_created();
    };
}
function replaceEmscriptenPThreadInit() {
    const original_emscripten_thread_init = Module["__emscripten_thread_init"];
    function emscripten_thread_init_wrapper(pthread_ptr, isMainBrowserThread, isMainRuntimeThread, canBlock) {
        on_emscripten_thread_init(pthread_ptr);
        original_emscripten_thread_init(pthread_ptr, isMainBrowserThread, isMainRuntimeThread, canBlock);
        // re-install self
        Module["__emscripten_thread_init"] = emscripten_thread_init_wrapper;
    }
    Module["__emscripten_thread_init"] = emscripten_thread_init_wrapper;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function mono_wasm_start_deputy_thread_async() {
    if (!WasmEnableThreads)
        return;
    if (BuildConfiguration === "Debug" && globalThis.setInterval)
        globalThis.setInterval(() => {
            mono_log_info("Deputy thread is alive!");
        }, 3000);
    try {
        monoThreadInfo.isDeputy = true;
        monoThreadInfo.threadName = "Managed Main Deputy";
        update_thread_info();
        postMessageToMain({
            monoCmd: "createdDeputy" /* WorkerToMainMessageType.deputyCreated */,
            info: monoThreadInfo,
        });
        Module.runtimeKeepalivePush();
        Module.safeSetTimeout(async () => {
            try {
                forceThreadMemoryViewRefresh();
                pthread_self.addEventListenerFromBrowser((message) => {
                    if (message.data.cmd == "allAssetsLoaded" /* MainToWorkerMessageType.allAssetsLoaded */) {
                        runtimeHelpers.allAssetsInMemory.promise_control.resolve();
                    }
                });
                await start_runtime();
                postMessageToMain({
                    monoCmd: "monoStarted" /* WorkerToMainMessageType.deputyStarted */,
                    info: monoThreadInfo,
                });
                await runtimeHelpers.allAssetsInMemory.promise;
                runtimeHelpers.proxyGCHandle = install_main_synchronization_context(runtimeHelpers.config.jsThreadBlockingMode);
                postMessageToMain({
                    monoCmd: "deputyReady" /* WorkerToMainMessageType.deputyReady */,
                    info: monoThreadInfo,
                    deputyProxyGCHandle: runtimeHelpers.proxyGCHandle,
                });
            }
            catch (err) {
                postMessageToMain({
                    monoCmd: "deputyFailed" /* WorkerToMainMessageType.deputyFailed */,
                    info: monoThreadInfo,
                    error: "mono_wasm_start_deputy_thread_async() failed" + err,
                });
                mono_log_error("mono_wasm_start_deputy_thread_async() failed", err);
                loaderHelpers.mono_exit(1, err);
                throw err;
            }
        }, 0);
    }
    catch (err) {
        mono_log_error("mono_wasm_start_deputy_thread_async() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
    // same as emscripten_exit_with_live_runtime()
    throw "unwind";
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function mono_wasm_start_io_thread_async() {
    if (!WasmEnableThreads)
        return;
    if (BuildConfiguration === "Debug" && globalThis.setInterval)
        globalThis.setInterval(() => {
            mono_log_info("I/O thread is alive!");
        }, 3000);
    try {
        monoThreadInfo.isIo = true;
        monoThreadInfo.threadName = "JS I/O Thread";
        update_thread_info();
        threads_c_functions.mono_wasm_register_io_thread();
        postMessageToMain({
            monoCmd: "ioStarted" /* WorkerToMainMessageType.ioStarted */,
            info: monoThreadInfo,
        });
        Module.runtimeKeepalivePush();
    }
    catch (err) {
        mono_log_error("mono_wasm_start_io_thread_async() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
    // same as emscripten_exit_with_live_runtime()
    throw "unwind";
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function mono_wasm_warn_about_blocking_wait(ptr, length) {
    const warning = utf16ToString(ptr, ptr + (length * 2));
    mono_log_warn(warning);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const managedExports = {};
function init_managed_exports() {
    const exports_fqn_asm = "System.Runtime.InteropServices.JavaScript";
    // TODO https://github.com/dotnet/runtime/issues/98366
    runtimeHelpers.runtime_interop_module = wrapped_c_functions.mono_wasm_assembly_load(exports_fqn_asm);
    if (!runtimeHelpers.runtime_interop_module)
        throw "Can't find bindings module assembly: " + exports_fqn_asm;
    runtimeHelpers.runtime_interop_namespace = exports_fqn_asm;
    runtimeHelpers.runtime_interop_exports_classname = "JavaScriptExports";
    // TODO https://github.com/dotnet/runtime/issues/98366
    runtimeHelpers.runtime_interop_exports_class = wrapped_c_functions.mono_wasm_assembly_find_class(runtimeHelpers.runtime_interop_module, runtimeHelpers.runtime_interop_namespace, runtimeHelpers.runtime_interop_exports_classname);
    if (!runtimeHelpers.runtime_interop_exports_class)
        throw "Can't find " + runtimeHelpers.runtime_interop_namespace + "." + runtimeHelpers.runtime_interop_exports_classname + " class";
    managedExports.InstallMainSynchronizationContext = WasmEnableThreads ? get_method("InstallMainSynchronizationContext") : undefined;
    managedExports.CallEntrypoint = get_method("CallEntrypoint");
    managedExports.BindAssemblyExports = get_method("BindAssemblyExports");
    managedExports.ReleaseJSOwnedObjectByGCHandle = get_method("ReleaseJSOwnedObjectByGCHandle");
    managedExports.CompleteTask = get_method("CompleteTask");
    managedExports.CallDelegate = get_method("CallDelegate");
    managedExports.GetManagedStackTrace = get_method("GetManagedStackTrace");
    managedExports.LoadSatelliteAssembly = get_method("LoadSatelliteAssembly");
    managedExports.LoadLazyAssembly = get_method("LoadLazyAssembly");
}
// the marshaled signature is: Task<int>? CallEntrypoint(char* mainAssemblyName, string[] args)
function call_entry_point(main_assembly_name, program_args, waitForDebugger) {
    loaderHelpers.assert_runtime_running();
    const sp = Module.stackSave();
    try {
        const size = 5;
        const args = alloc_stack_frame(size);
        const res = get_arg(args, 1);
        const arg1 = get_arg(args, 2);
        const arg2 = get_arg(args, 3);
        const arg3 = get_arg(args, 4);
        const main_assembly_name_ptr = stringToUTF8Ptr(main_assembly_name);
        marshal_intptr_to_cs(arg1, main_assembly_name_ptr);
        marshal_array_to_cs_impl(arg2, program_args && !program_args.length ? undefined : program_args, 15 /* MarshalerType.String */);
        marshal_bool_to_cs(arg3, waitForDebugger);
        // because this is async, we could pre-allocate the promise
        let promise = begin_marshal_task_to_js(res, 30 /* MarshalerType.TaskPreCreated */, marshal_int32_to_js);
        invoke_async_jsexport(runtimeHelpers.managedThreadTID, managedExports.CallEntrypoint, args, size);
        // in case the C# side returned synchronously
        promise = end_marshal_task_to_js(args, marshal_int32_to_js, promise);
        if (promise === null || promise === undefined) {
            promise = Promise.resolve(0);
        }
        promise[do_not_force_dispose] = true; // prevent disposing the task in forceDisposeProxies()
        return promise;
    }
    finally {
        Module.stackRestore(sp); // synchronously
    }
}
// the marshaled signature is: void LoadSatelliteAssembly(byte[] dll)
function load_satellite_assembly(dll) {
    loaderHelpers.assert_runtime_running();
    const sp = Module.stackSave();
    try {
        const size = 3;
        const args = alloc_stack_frame(size);
        const arg1 = get_arg(args, 2);
        set_arg_type(arg1, 21 /* MarshalerType.Array */);
        marshal_array_to_cs(arg1, dll, 4 /* MarshalerType.Byte */);
        invoke_sync_jsexport(managedExports.LoadSatelliteAssembly, args);
    }
    finally {
        Module.stackRestore(sp);
    }
}
// the marshaled signature is: void LoadLazyAssembly(byte[] dll, byte[] pdb)
function load_lazy_assembly(dll, pdb) {
    loaderHelpers.assert_runtime_running();
    const sp = Module.stackSave();
    try {
        const size = 4;
        const args = alloc_stack_frame(size);
        const arg1 = get_arg(args, 2);
        const arg2 = get_arg(args, 3);
        set_arg_type(arg1, 21 /* MarshalerType.Array */);
        set_arg_type(arg2, 21 /* MarshalerType.Array */);
        marshal_array_to_cs(arg1, dll, 4 /* MarshalerType.Byte */);
        marshal_array_to_cs(arg2, pdb, 4 /* MarshalerType.Byte */);
        invoke_sync_jsexport(managedExports.LoadLazyAssembly, args);
    }
    finally {
        Module.stackRestore(sp);
    }
}
// the marshaled signature is: void ReleaseJSOwnedObjectByGCHandle(GCHandle gcHandle)
function release_js_owned_object_by_gc_handle(gc_handle) {
    if (!(gc_handle)) mono_assert(false, "Must be valid gc_handle"); // inlined mono_assert condition
    loaderHelpers.assert_runtime_running();
    const sp = Module.stackSave();
    try {
        const size = 3;
        const args = alloc_stack_frame(size);
        const arg1 = get_arg(args, 2);
        set_arg_type(arg1, 14 /* MarshalerType.Object */);
        set_gc_handle(arg1, gc_handle);
        if (!WasmEnableThreads || is_gcv_handle(gc_handle) || !monoThreadInfo.isUI) {
            // this must stay synchronous for free_gcv_handle sake, to not use-after-free
            // also on JSWebWorker, because the message could arrive after the worker is terminated and the GCHandle of JSProxyContext is already freed
            invoke_sync_jsexport(managedExports.ReleaseJSOwnedObjectByGCHandle, args);
        }
        else {
            invoke_async_jsexport(runtimeHelpers.ioThreadTID, managedExports.ReleaseJSOwnedObjectByGCHandle, args, size);
        }
    }
    finally {
        Module.stackRestore(sp);
    }
}
// the marshaled signature is: void CompleteTask<T>(GCHandle holder, Exception? exceptionResult, T? result)
function complete_task(holder_gc_handle, error, data, res_converter) {
    loaderHelpers.assert_runtime_running();
    const sp = Module.stackSave();
    try {
        const size = 5;
        const args = alloc_stack_frame(size);
        const arg1 = get_arg(args, 2);
        set_arg_type(arg1, 14 /* MarshalerType.Object */);
        set_gc_handle(arg1, holder_gc_handle);
        const arg2 = get_arg(args, 3);
        if (error) {
            marshal_exception_to_cs(arg2, error);
        }
        else {
            set_arg_type(arg2, 0 /* MarshalerType.None */);
            const arg3 = get_arg(args, 4);
            if (!(res_converter)) mono_assert(false, "res_converter missing"); // inlined mono_assert condition
            res_converter(arg3, data);
        }
        invoke_async_jsexport(runtimeHelpers.ioThreadTID, managedExports.CompleteTask, args, size);
    }
    finally {
        Module.stackRestore(sp);
    }
}
// the marshaled signature is: TRes? CallDelegate<T1,T2,T3,TRes>(GCHandle callback, T1? arg1, T2? arg2, T3? arg3)
function call_delegate(callback_gc_handle, arg1_js, arg2_js, arg3_js, res_converter, arg1_converter, arg2_converter, arg3_converter) {
    loaderHelpers.assert_runtime_running();
    if (WasmEnableThreads) {
        if (monoThreadInfo.isUI) {
            if (runtimeHelpers.config.jsThreadBlockingMode == "PreventSynchronousJSExport" /* JSThreadBlockingMode.PreventSynchronousJSExport */) {
                throw new Error("Cannot call synchronous C# methods.");
            }
            else if (runtimeHelpers.isPendingSynchronousCall) {
                throw new Error("Cannot call synchronous C# method from inside a synchronous call to a JS method.");
            }
        }
    }
    const sp = Module.stackSave();
    try {
        const size = 6;
        const args = alloc_stack_frame(size);
        const arg1 = get_arg(args, 2);
        set_arg_type(arg1, 14 /* MarshalerType.Object */);
        set_gc_handle(arg1, callback_gc_handle);
        // payload arg numbers are shifted by one, the real first is a gc handle of the callback
        if (arg1_converter) {
            const arg2 = get_arg(args, 3);
            arg1_converter(arg2, arg1_js);
        }
        if (arg2_converter) {
            const arg3 = get_arg(args, 4);
            arg2_converter(arg3, arg2_js);
        }
        if (arg3_converter) {
            const arg4 = get_arg(args, 5);
            arg3_converter(arg4, arg3_js);
        }
        invoke_sync_jsexport(managedExports.CallDelegate, args);
        if (res_converter) {
            const res = get_arg(args, 1);
            return res_converter(res);
        }
    }
    finally {
        Module.stackRestore(sp);
    }
}
// the marshaled signature is: string GetManagedStackTrace(GCHandle exception)
function get_managed_stack_trace(exception_gc_handle) {
    loaderHelpers.assert_runtime_running();
    const sp = Module.stackSave();
    try {
        const size = 3;
        const args = alloc_stack_frame(size);
        const arg1 = get_arg(args, 2);
        set_arg_type(arg1, 16 /* MarshalerType.Exception */);
        set_gc_handle(arg1, exception_gc_handle);
        invoke_sync_jsexport(managedExports.GetManagedStackTrace, args);
        const res = get_arg(args, 1);
        return marshal_string_to_js(res);
    }
    finally {
        Module.stackRestore(sp);
    }
}
// GCHandle InstallMainSynchronizationContext(nint jsNativeTID, JSThreadBlockingMode jsThreadBlockingMode)
function install_main_synchronization_context(jsThreadBlockingMode) {
    if (!WasmEnableThreads)
        return GCHandleNull;
    assert_c_interop();
    try {
        // this block is like alloc_stack_frame() but without set_args_context()
        const bytes = JavaScriptMarshalerArgSize * 4;
        const args = Module.stackAlloc(bytes);
        _zero_region(args, bytes);
        const res = get_arg(args, 1);
        const arg1 = get_arg(args, 2);
        const arg2 = get_arg(args, 3);
        set_arg_intptr(arg1, mono_wasm_main_thread_ptr());
        // sync with JSHostImplementation.Types.cs
        switch (jsThreadBlockingMode) {
            case "PreventSynchronousJSExport" /* JSThreadBlockingMode.PreventSynchronousJSExport */:
                set_arg_i32(arg2, 0);
                break;
            case "ThrowWhenBlockingWait" /* JSThreadBlockingMode.ThrowWhenBlockingWait */:
                set_arg_i32(arg2, 1);
                break;
            case "WarnWhenBlockingWait" /* JSThreadBlockingMode.WarnWhenBlockingWait */:
                set_arg_i32(arg2, 2);
                break;
            case "DangerousAllowBlockingWait" /* JSThreadBlockingMode.DangerousAllowBlockingWait */:
                set_arg_i32(arg2, 100);
                break;
            default:
                throw new Error("Invalid jsThreadBlockingMode");
        }
        // this block is like invoke_sync_jsexport() but without assert_js_interop()
        wrapped_c_functions.mono_wasm_invoke_jsexport(managedExports.InstallMainSynchronizationContext, args);
        if (is_args_exception(args)) {
            const exc = get_arg(args, 0);
            throw marshal_exception_to_js(exc);
        }
        return get_arg_gc_handle(res);
    }
    catch (e) {
        mono_log_error("install_main_synchronization_context failed", e);
        throw e;
    }
}
function invoke_async_jsexport(managedTID, method, args, size) {
    assert_js_interop();
    if (!WasmEnableThreads || runtimeHelpers.isManagedRunningOnCurrentThread) {
        wrapped_c_functions.mono_wasm_invoke_jsexport(method, args);
        if (is_args_exception(args)) {
            const exc = get_arg(args, 0);
            throw marshal_exception_to_js(exc);
        }
    }
    else {
        set_receiver_should_free(args);
        const bytes = JavaScriptMarshalerArgSize * size;
        const cpy = malloc(bytes);
        copyBytes(args, cpy, bytes);
        threads_c_functions.mono_wasm_invoke_jsexport_async_post(managedTID, method, cpy);
    }
}
function invoke_sync_jsexport(method, args) {
    assert_js_interop();
    if (!WasmEnableThreads) {
        wrapped_c_functions.mono_wasm_invoke_jsexport(method, args);
    }
    else {
        if (monoThreadInfo.isUI) {
            if (runtimeHelpers.config.jsThreadBlockingMode == "PreventSynchronousJSExport" /* JSThreadBlockingMode.PreventSynchronousJSExport */) {
                throw new Error("Cannot call synchronous C# methods.");
            }
            else if (runtimeHelpers.isPendingSynchronousCall) {
                throw new Error("Cannot call synchronous C# method from inside a synchronous call to a JS method.");
            }
        }
        if (runtimeHelpers.isManagedRunningOnCurrentThread) {
            threads_c_functions.mono_wasm_invoke_jsexport_sync(method, args);
        }
        else {
            // this is blocking too
            threads_c_functions.mono_wasm_invoke_jsexport_sync_send(runtimeHelpers.managedThreadTID, method, args);
        }
    }
    if (is_args_exception(args)) {
        const exc = get_arg(args, 0);
        throw marshal_exception_to_js(exc);
    }
}
// the marshaled signature is: Task BindAssemblyExports(string assemblyName)
function bind_assembly_exports(assemblyName) {
    loaderHelpers.assert_runtime_running();
    const sp = Module.stackSave();
    try {
        const size = 3;
        const args = alloc_stack_frame(size);
        const res = get_arg(args, 1);
        const arg1 = get_arg(args, 2);
        marshal_string_to_cs(arg1, assemblyName);
        // because this is async, we could pre-allocate the promise
        let promise = begin_marshal_task_to_js(res, 30 /* MarshalerType.TaskPreCreated */);
        invoke_async_jsexport(runtimeHelpers.managedThreadTID, managedExports.BindAssemblyExports, args, size);
        // in case the C# side returned synchronously
        promise = end_marshal_task_to_js(args, marshal_int32_to_js, promise);
        if (promise === null || promise === undefined) {
            promise = Promise.resolve();
        }
        return promise;
    }
    finally {
        Module.stackRestore(sp); // synchronously
    }
}
function get_method(method_name) {
    // TODO https://github.com/dotnet/runtime/issues/98366
    const res = wrapped_c_functions.mono_wasm_assembly_find_method(runtimeHelpers.runtime_interop_exports_class, method_name, -1);
    if (!res)
        throw "Can't find method " + runtimeHelpers.runtime_interop_namespace + "." + runtimeHelpers.runtime_interop_exports_classname + "." + method_name;
    return res;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const cs_to_js_marshalers = new Map();
const js_to_cs_marshalers = new Map();
const bound_cs_function_symbol = Symbol.for("wasm bound_cs_function");
const bound_js_function_symbol = Symbol.for("wasm bound_js_function");
const imported_js_function_symbol = Symbol.for("wasm imported_js_function");
const proxy_debug_symbol = Symbol.for("wasm proxy_debug");
const JavaScriptMarshalerArgSize = 32;
const JSMarshalerTypeSize = 32;
const JSMarshalerSignatureHeaderSize = 4 * 8; // without Exception and Result
function alloc_stack_frame(size) {
    forceThreadMemoryViewRefresh();
    const bytes = JavaScriptMarshalerArgSize * size;
    const args = Module.stackAlloc(bytes);
    _zero_region(args, bytes);
    set_args_context(args);
    return args;
}
function get_arg(args, index) {
    if (!(args)) mono_assert(false, "Null args"); // inlined mono_assert condition
    return args + (index * JavaScriptMarshalerArgSize);
}
function is_args_exception(args) {
    if (!(args)) mono_assert(false, "Null args"); // inlined mono_assert condition
    const exceptionType = get_arg_type(args);
    return exceptionType !== 0 /* MarshalerType.None */;
}
function is_receiver_should_free(args) {
    if (!WasmEnableThreads)
        return false;
    if (!(args)) mono_assert(false, "Null args"); // inlined mono_assert condition
    return getB8(args + 20 /* JSMarshalerArgumentOffsets.ReceiverShouldFree */);
}
function get_sync_done_semaphore_ptr(args) {
    if (!WasmEnableThreads)
        return VoidPtrNull;
    if (!(args)) mono_assert(false, "Null args"); // inlined mono_assert condition
    return getI32(args + 28 /* JSMarshalerArgumentOffsets.SyncDoneSemaphorePtr */);
}
function get_caller_native_tid(args) {
    if (!WasmEnableThreads)
        return PThreadPtrNull;
    if (!(args)) mono_assert(false, "Null args"); // inlined mono_assert condition
    return getI32(args + 24 /* JSMarshalerArgumentOffsets.CallerNativeTID */);
}
function set_receiver_should_free(args) {
    if (!(args)) mono_assert(false, "Null args"); // inlined mono_assert condition
    setB8(args + 20 /* JSMarshalerArgumentOffsets.ReceiverShouldFree */, true);
}
function set_args_context(args) {
    if (!WasmEnableThreads)
        return;
    if (!(args)) mono_assert(false, "Null args"); // inlined mono_assert condition
    const exc = get_arg(args, 0);
    const res = get_arg(args, 1);
    set_arg_proxy_context(exc);
    set_arg_proxy_context(res);
}
function get_sig(signature, index) {
    if (!(signature)) mono_assert(false, "Null signatures"); // inlined mono_assert condition
    return signature + (index * JSMarshalerTypeSize) + JSMarshalerSignatureHeaderSize;
}
function get_signature_type(sig) {
    if (!(sig)) mono_assert(false, "Null sig"); // inlined mono_assert condition
    return getU8(sig + 0 /* JSBindingTypeOffsets.Type */);
}
function get_signature_res_type(sig) {
    if (!(sig)) mono_assert(false, "Null sig"); // inlined mono_assert condition
    return getU8(sig + 16 /* JSBindingTypeOffsets.ResultMarshalerType */);
}
function get_signature_arg1_type(sig) {
    if (!(sig)) mono_assert(false, "Null sig"); // inlined mono_assert condition
    return getU8(sig + 20 /* JSBindingTypeOffsets.Arg1MarshalerType */);
}
function get_signature_arg2_type(sig) {
    if (!(sig)) mono_assert(false, "Null sig"); // inlined mono_assert condition
    return getU8(sig + 24 /* JSBindingTypeOffsets.Arg2MarshalerType */);
}
function get_signature_arg3_type(sig) {
    if (!(sig)) mono_assert(false, "Null sig"); // inlined mono_assert condition
    return getU8(sig + 28 /* JSBindingTypeOffsets.Arg3MarshalerType */);
}
function get_signature_argument_count(signature) {
    if (!(signature)) mono_assert(false, "Null signatures"); // inlined mono_assert condition
    return getI32(signature + 4 /* JSBindingHeaderOffsets.ArgumentCount */);
}
function get_signature_version(signature) {
    if (!(signature)) mono_assert(false, "Null signatures"); // inlined mono_assert condition
    return getI32(signature + 0 /* JSBindingHeaderOffsets.Version */);
}
function get_signature_handle(signature) {
    if (!(signature)) mono_assert(false, "Null signatures"); // inlined mono_assert condition
    return getI32(signature + 8 /* JSBindingHeaderOffsets.ImportHandle */);
}
function get_signature_function_name(signature) {
    if (!(signature)) mono_assert(false, "Null signatures"); // inlined mono_assert condition
    const functionNameOffset = getI32(signature + 16 /* JSBindingHeaderOffsets.FunctionNameOffset */);
    if (functionNameOffset === 0)
        return null;
    const functionNameLength = getI32(signature + 20 /* JSBindingHeaderOffsets.FunctionNameLength */);
    if (!(functionNameOffset)) mono_assert(false, "Null name"); // inlined mono_assert condition
    return utf16ToString(signature + functionNameOffset, signature + functionNameOffset + functionNameLength);
}
function get_signature_module_name(signature) {
    if (!(signature)) mono_assert(false, "Null signatures"); // inlined mono_assert condition
    const moduleNameOffset = getI32(signature + 24 /* JSBindingHeaderOffsets.ModuleNameOffset */);
    if (moduleNameOffset === 0)
        return null;
    const moduleNameLength = getI32(signature + 28 /* JSBindingHeaderOffsets.ModuleNameLength */);
    return utf16ToString(signature + moduleNameOffset, signature + moduleNameOffset + moduleNameLength);
}
function get_sig_type(sig) {
    if (!(sig)) mono_assert(false, "Null signatures"); // inlined mono_assert condition
    return getU8(sig);
}
function get_arg_type(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    const type = getU8(arg + 12 /* JSMarshalerArgumentOffsets.Type */);
    return type;
}
function get_arg_element_type(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    const type = getU8(arg + 13 /* JSMarshalerArgumentOffsets.ElementType */);
    return type;
}
function set_arg_type(arg, type) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setU8(arg + 12 /* JSMarshalerArgumentOffsets.Type */, type);
}
function set_arg_element_type(arg, type) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setU8(arg + 13 /* JSMarshalerArgumentOffsets.ElementType */, type);
}
function get_arg_bool(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getB8(arg);
}
function get_arg_u8(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getU8(arg);
}
function get_arg_u16(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getU16(arg);
}
function get_arg_i16(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getI16(arg);
}
function get_arg_i32(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getI32(arg);
}
function get_arg_intptr(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getU32(arg);
}
function get_arg_i52(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    // we know that the range check and conversion from Int64 was be done on C# side
    return getF64(arg);
}
function get_arg_i64_big(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getI64Big(arg);
}
function get_arg_date(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    const unixTime = getF64(arg);
    const date = new Date(unixTime);
    return date;
}
function get_arg_f32(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getF32(arg);
}
function get_arg_f64(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getF64(arg);
}
function set_arg_bool(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    if (!(typeof value === "boolean")) throw new Error(`Assert failed: Value is not a Boolean: ${value} (${typeof (value)})`); // inlined mono_check
    setB8(arg, value);
}
function set_arg_u8(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setU8(arg, value);
}
function set_arg_u16(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setU16(arg, value);
}
function set_arg_i16(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setI16(arg, value);
}
function set_arg_i32(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setI32(arg, value);
}
function set_arg_intptr(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setU32(arg, value);
}
function set_arg_i52(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    if (!(Number.isSafeInteger(value))) throw new Error(`Assert failed: Value is not an integer: ${value} (${typeof (value)})`); // inlined mono_check
    // we know that conversion to Int64 would be done on C# side
    setF64(arg, value);
}
function set_arg_i64_big(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setI64Big(arg, value);
}
function set_arg_date(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    // getTime() is always UTC
    const unixTime = value.getTime();
    setF64(arg, unixTime);
}
function set_arg_f64(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setF64(arg, value);
}
function set_arg_f32(arg, value) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setF32(arg, value);
}
function get_arg_js_handle(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getI32(arg + 4 /* JSMarshalerArgumentOffsets.JSHandle */);
}
function set_arg_proxy_context(arg) {
    if (!WasmEnableThreads)
        return;
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setI32(arg + 16 /* JSMarshalerArgumentOffsets.ContextHandle */, runtimeHelpers.proxyGCHandle);
}
function set_js_handle(arg, jsHandle) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setI32(arg + 4 /* JSMarshalerArgumentOffsets.JSHandle */, jsHandle);
    set_arg_proxy_context(arg);
}
function get_arg_gc_handle(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getI32(arg + 4 /* JSMarshalerArgumentOffsets.GCHandle */);
}
function set_gc_handle(arg, gcHandle) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setI32(arg + 4 /* JSMarshalerArgumentOffsets.GCHandle */, gcHandle);
    set_arg_proxy_context(arg);
}
function get_string_root(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return mono_wasm_new_external_root(arg);
}
function get_arg_length(arg) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    return getI32(arg + 8 /* JSMarshalerArgumentOffsets.Length */);
}
function set_arg_length(arg, size) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setI32(arg + 8 /* JSMarshalerArgumentOffsets.Length */, size);
}
function set_root(arg, root) {
    if (!(arg)) mono_assert(false, "Null arg"); // inlined mono_assert condition
    setU32(arg + 0, root.get_address());
}
class ManagedObject {
    dispose() {
        teardown_managed_proxy(this, GCHandleNull);
    }
    get isDisposed() {
        return this[js_owned_gc_handle_symbol] === GCHandleNull;
    }
    toString() {
        return `CsObject(gc_handle: ${this[js_owned_gc_handle_symbol]})`;
    }
}
class ManagedError extends Error {
    constructor(message) {
        super(message);
        this.superStack = Object.getOwnPropertyDescriptor(this, "stack"); // this works on Chrome
        Object.defineProperty(this, "stack", {
            get: this.getManageStack,
        });
    }
    getSuperStack() {
        if (this.superStack) {
            if (this.superStack.value !== undefined)
                return this.superStack.value;
            if (this.superStack.get !== undefined)
                return this.superStack.get.call(this);
        }
        return super.stack; // this works on FF
    }
    getManageStack() {
        if (this.managed_stack) {
            return this.managed_stack;
        }
        if (!loaderHelpers.is_runtime_running()) {
            this.managed_stack = "... omitted managed stack trace.\n" + this.getSuperStack();
            return this.managed_stack;
        }
        if (!WasmEnableThreads || runtimeHelpers.proxyGCHandle) {
            const gc_handle = this[js_owned_gc_handle_symbol];
            if (gc_handle !== GCHandleNull) {
                const managed_stack = get_managed_stack_trace(gc_handle);
                if (managed_stack) {
                    this.managed_stack = managed_stack + "\n" + this.getSuperStack();
                    return this.managed_stack;
                }
            }
        }
        return this.getSuperStack();
    }
    dispose() {
        teardown_managed_proxy(this, GCHandleNull);
    }
    get isDisposed() {
        return this[js_owned_gc_handle_symbol] === GCHandleNull;
    }
}
function get_signature_marshaler(signature, index) {
    if (!(signature)) mono_assert(false, "Null signatures"); // inlined mono_assert condition
    const sig = get_sig(signature, index);
    return getU32(sig + 8 /* JSBindingHeaderOffsets.ImportHandle */);
}
function array_element_size(element_type) {
    return element_type == 4 /* MarshalerType.Byte */ ? 1
        : element_type == 7 /* MarshalerType.Int32 */ ? 4
            : element_type == 8 /* MarshalerType.Int52 */ ? 8
                : element_type == 10 /* MarshalerType.Double */ ? 8
                    : element_type == 15 /* MarshalerType.String */ ? JavaScriptMarshalerArgSize
                        : element_type == 14 /* MarshalerType.Object */ ? JavaScriptMarshalerArgSize
                            : element_type == 13 /* MarshalerType.JSObject */ ? JavaScriptMarshalerArgSize
                                : -1;
}
class MemoryView {
    constructor(_pointer, _length, _viewType) {
        this._pointer = _pointer;
        this._length = _length;
        this._viewType = _viewType;
    }
    _unsafe_create_view() {
        // this view must be short lived so that it doesn't fail after wasm memory growth
        // for that reason we also don't give the view out to end user and provide set/slice/copyTo API instead
        const view = this._viewType == 0 /* MemoryViewType.Byte */ ? new Uint8Array(localHeapViewU8().buffer, this._pointer, this._length)
            : this._viewType == 1 /* MemoryViewType.Int32 */ ? new Int32Array(localHeapViewI32().buffer, this._pointer, this._length)
                : this._viewType == 2 /* MemoryViewType.Double */ ? new Float64Array(localHeapViewF64().buffer, this._pointer, this._length)
                    : null;
        if (!view)
            throw new Error("NotImplementedException");
        return view;
    }
    set(source, targetOffset) {
        if (!(!this.isDisposed)) throw new Error("Assert failed: ObjectDisposedException"); // inlined mono_check
        const targetView = this._unsafe_create_view();
        if (!(source && targetView && source.constructor === targetView.constructor)) throw new Error(`Assert failed: Expected ${targetView.constructor}`); // inlined mono_check
        targetView.set(source, targetOffset);
        // TODO consider memory write barrier
    }
    copyTo(target, sourceOffset) {
        if (!(!this.isDisposed)) throw new Error("Assert failed: ObjectDisposedException"); // inlined mono_check
        const sourceView = this._unsafe_create_view();
        if (!(target && sourceView && target.constructor === sourceView.constructor)) throw new Error(`Assert failed: Expected ${sourceView.constructor}`); // inlined mono_check
        const trimmedSource = sourceView.subarray(sourceOffset);
        // TODO consider memory read barrier
        target.set(trimmedSource);
    }
    slice(start, end) {
        if (!(!this.isDisposed)) throw new Error("Assert failed: ObjectDisposedException"); // inlined mono_check
        const sourceView = this._unsafe_create_view();
        // TODO consider memory read barrier
        return sourceView.slice(start, end);
    }
    get length() {
        if (!(!this.isDisposed)) throw new Error("Assert failed: ObjectDisposedException"); // inlined mono_check
        return this._length;
    }
    get byteLength() {
        if (!(!this.isDisposed)) throw new Error("Assert failed: ObjectDisposedException"); // inlined mono_check
        return this._viewType == 0 /* MemoryViewType.Byte */ ? this._length
            : this._viewType == 1 /* MemoryViewType.Int32 */ ? this._length << 2
                : this._viewType == 2 /* MemoryViewType.Double */ ? this._length << 3
                    : 0;
    }
}
class Span extends MemoryView {
    constructor(pointer, length, viewType) {
        super(pointer, length, viewType);
        this.is_disposed = false;
    }
    dispose() {
        this.is_disposed = true;
    }
    get isDisposed() {
        return this.is_disposed;
    }
}
class ArraySegment extends MemoryView {
    constructor(pointer, length, viewType) {
        super(pointer, length, viewType);
    }
    dispose() {
        teardown_managed_proxy(this, GCHandleNull);
    }
    get isDisposed() {
        return this[js_owned_gc_handle_symbol] === GCHandleNull;
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const js_import_wrapper_by_fn_handle = [null]; // 0th slot is dummy, main thread we free them on shutdown. On web worker thread we free them when worker is detached.
function mono_wasm_bind_js_import_ST(signature) {
    if (WasmEnableThreads)
        return VoidPtrNull;
    assert_js_interop();
    signature = fixupPointer(signature, 0);
    try {
        bind_js_import(signature);
        return VoidPtrNull;
    }
    catch (ex) {
        return stringToUTF16Ptr(normalize_exception(ex));
    }
}
function mono_wasm_invoke_jsimport_MT(signature, args) {
    if (!WasmEnableThreads)
        return;
    assert_js_interop();
    signature = fixupPointer(signature, 0);
    args = fixupPointer(args, 0);
    const function_handle = get_signature_handle(signature);
    let bound_fn = js_import_wrapper_by_fn_handle[function_handle];
    if (bound_fn == undefined) {
        // it was not bound yet, let's do it now
        try {
            bound_fn = bind_js_import(signature);
        }
        catch (ex) {
            // propagate the exception back to caller, which could be on different thread. Handle both sync and async signatures.
            try {
                const res_sig = get_sig(signature, 1);
                const res_type = get_signature_type(res_sig);
                if (res_type === 20 /* MarshalerType.Task */) {
                    const res = get_arg(args, 1);
                    marshal_task_to_cs(res, Promise.reject(ex));
                }
                else {
                    marshal_exception_to_cs(args, ex);
                    if (monoThreadInfo.isUI) {
                        const done_semaphore = get_sync_done_semaphore_ptr(args);
                        threads_c_functions.mono_threads_wasm_sync_run_in_target_thread_done(done_semaphore);
                    }
                }
                return;
            }
            catch (ex) {
                loaderHelpers.mono_exit(1, ex);
                return;
            }
        }
    }
    if (!(bound_fn)) mono_assert(false, `Imported function handle expected ${function_handle}`); // inlined mono_assert condition
    bound_fn(args);
}
function mono_wasm_invoke_jsimport_ST(function_handle, args) {
    if (WasmEnableThreads)
        return;
    loaderHelpers.assert_runtime_running();
    args = fixupPointer(args, 0);
    const bound_fn = js_import_wrapper_by_fn_handle[function_handle];
    if (!(bound_fn)) mono_assert(false, `Imported function handle expected ${function_handle}`); // inlined mono_assert condition
    bound_fn(args);
}
function bind_js_import(signature) {
    assert_js_interop();
    const mark = startMeasure();
    const version = get_signature_version(signature);
    if (!(version === 2)) mono_assert(false, `Signature version ${version} mismatch.`); // inlined mono_assert condition
    const js_function_name = get_signature_function_name(signature);
    const js_module_name = get_signature_module_name(signature);
    const function_handle = get_signature_handle(signature);
    if (loaderHelpers.diagnosticTracing) mono_log_debug(`Binding [JSImport] ${js_function_name} from ${js_module_name} module`); // inlined mono_log_debug condition
    const fn = mono_wasm_lookup_js_import(js_function_name, js_module_name);
    const args_count = get_signature_argument_count(signature);
    const arg_marshalers = new Array(args_count);
    const arg_cleanup = new Array(args_count);
    let has_cleanup = false;
    for (let index = 0; index < args_count; index++) {
        const sig = get_sig(signature, index + 2);
        const marshaler_type = get_signature_type(sig);
        const arg_marshaler = bind_arg_marshal_to_js(sig, marshaler_type, index + 2);
        if (!(arg_marshaler)) mono_assert(false, "ERR42: argument marshaler must be resolved"); // inlined mono_assert condition
        arg_marshalers[index] = arg_marshaler;
        if (marshaler_type === 23 /* MarshalerType.Span */) {
            arg_cleanup[index] = (js_arg) => {
                if (js_arg) {
                    js_arg.dispose();
                }
            };
            has_cleanup = true;
        }
    }
    const res_sig = get_sig(signature, 1);
    const res_marshaler_type = get_signature_type(res_sig);
    const res_converter = bind_arg_marshal_to_cs(res_sig, res_marshaler_type, 1);
    const is_discard_no_wait = res_marshaler_type == 26 /* MarshalerType.DiscardNoWait */;
    const is_async = res_marshaler_type == 20 /* MarshalerType.Task */ || res_marshaler_type == 30 /* MarshalerType.TaskPreCreated */;
    const closure = {
        fn,
        fqn: js_module_name + ":" + js_function_name,
        args_count,
        arg_marshalers,
        res_converter,
        has_cleanup,
        arg_cleanup,
        is_discard_no_wait,
        is_async,
        isDisposed: false,
    };
    let bound_fn;
    if (is_async || is_discard_no_wait || has_cleanup) {
        bound_fn = bind_fn$1(closure);
    }
    else {
        if (args_count == 0 && !res_converter) {
            bound_fn = bind_fn_0V$1(closure);
        }
        else if (args_count == 1 && !res_converter) {
            bound_fn = bind_fn_1V$1(closure);
        }
        else if (args_count == 1 && res_converter) {
            bound_fn = bind_fn_1R$1(closure);
        }
        else if (args_count == 2 && res_converter) {
            bound_fn = bind_fn_2R$1(closure);
        }
        else {
            bound_fn = bind_fn$1(closure);
        }
    }
    function async_bound_fn(args) {
        forceThreadMemoryViewRefresh();
        bound_fn(args);
    }
    function sync_bound_fn(args) {
        const previous = runtimeHelpers.isPendingSynchronousCall;
        try {
            forceThreadMemoryViewRefresh();
            const caller_tid = get_caller_native_tid(args);
            runtimeHelpers.isPendingSynchronousCall = runtimeHelpers.managedThreadTID === caller_tid;
            bound_fn(args);
        }
        finally {
            runtimeHelpers.isPendingSynchronousCall = previous;
        }
    }
    function async_bound_fn_ui(args) {
        invoke_later_when_on_ui_thread_async(() => async_bound_fn(args));
    }
    function sync_bound_fn_ui(args) {
        invoke_later_when_on_ui_thread_sync(() => sync_bound_fn(args), args);
    }
    let wrapped_fn = bound_fn;
    if (WasmEnableThreads) {
        if (monoThreadInfo.isUI) {
            if (is_async || is_discard_no_wait) {
                wrapped_fn = async_bound_fn_ui;
            }
            else {
                wrapped_fn = sync_bound_fn_ui;
            }
        }
        else {
            if (is_async || is_discard_no_wait) {
                wrapped_fn = async_bound_fn;
            }
            else {
                wrapped_fn = sync_bound_fn;
            }
        }
    }
    // this is just to make debugging easier by naming the function in the stack trace.
    // It's not CSP compliant and possibly not performant, that's why it's only enabled in debug builds
    // in Release configuration, it would be a trimmed by rollup
    if (BuildConfiguration === "Debug" && !runtimeHelpers.cspPolicy) {
        try {
            const fname = js_function_name.replaceAll(".", "_");
            const url = `//# sourceURL=https://dotnet/JSImport/${fname}`;
            const body = `return (function JSImport_${fname}(){ return fn.apply(this, arguments)});`;
            wrapped_fn = new Function("fn", url + "\r\n" + body)(wrapped_fn);
        }
        catch (ex) {
            runtimeHelpers.cspPolicy = true;
        }
    }
    wrapped_fn[imported_js_function_symbol] = closure;
    js_import_wrapper_by_fn_handle[function_handle] = wrapped_fn;
    endMeasure(mark, "mono.bindJsFunction:" /* MeasuredBlock.bindJsFunction */, js_function_name);
    return wrapped_fn;
}
function bind_fn_0V$1(closure) {
    const fn = closure.fn;
    const fqn = closure.fqn;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn_0V(args) {
        const mark = startMeasure();
        try {
            if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
            // call user function
            fn();
        }
        catch (ex) {
            marshal_exception_to_cs(args, ex);
        }
        finally {
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn_1V$1(closure) {
    const fn = closure.fn;
    const marshaler1 = closure.arg_marshalers[0];
    const fqn = closure.fqn;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn_1V(args) {
        const mark = startMeasure();
        try {
            if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
            const arg1 = marshaler1(args);
            // call user function
            fn(arg1);
        }
        catch (ex) {
            marshal_exception_to_cs(args, ex);
        }
        finally {
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn_1R$1(closure) {
    const fn = closure.fn;
    const marshaler1 = closure.arg_marshalers[0];
    const res_converter = closure.res_converter;
    const fqn = closure.fqn;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn_1R(args) {
        const mark = startMeasure();
        try {
            if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
            const arg1 = marshaler1(args);
            // call user function
            const js_result = fn(arg1);
            res_converter(args, js_result);
        }
        catch (ex) {
            marshal_exception_to_cs(args, ex);
        }
        finally {
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn_2R$1(closure) {
    const fn = closure.fn;
    const marshaler1 = closure.arg_marshalers[0];
    const marshaler2 = closure.arg_marshalers[1];
    const res_converter = closure.res_converter;
    const fqn = closure.fqn;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn_2R(args) {
        const mark = startMeasure();
        try {
            if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
            const arg1 = marshaler1(args);
            const arg2 = marshaler2(args);
            // call user function
            const js_result = fn(arg1, arg2);
            res_converter(args, js_result);
        }
        catch (ex) {
            marshal_exception_to_cs(args, ex);
        }
        finally {
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn$1(closure) {
    const args_count = closure.args_count;
    const arg_marshalers = closure.arg_marshalers;
    const res_converter = closure.res_converter;
    const arg_cleanup = closure.arg_cleanup;
    const has_cleanup = closure.has_cleanup;
    const fn = closure.fn;
    const fqn = closure.fqn;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn(args) {
        const receiver_should_free = WasmEnableThreads && is_receiver_should_free(args);
        const mark = startMeasure();
        try {
            if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
            const js_args = new Array(args_count);
            for (let index = 0; index < args_count; index++) {
                const marshaler = arg_marshalers[index];
                const js_arg = marshaler(args);
                js_args[index] = js_arg;
            }
            // call user function
            const js_result = fn(...js_args);
            if (res_converter) {
                res_converter(args, js_result);
            }
            if (has_cleanup) {
                for (let index = 0; index < args_count; index++) {
                    const cleanup = arg_cleanup[index];
                    if (cleanup) {
                        cleanup(js_args[index]);
                    }
                }
            }
        }
        catch (ex) {
            marshal_exception_to_cs(args, ex);
        }
        finally {
            if (receiver_should_free) {
                free(args);
            }
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function mono_wasm_invoke_js_function(bound_function_js_handle, args) {
    invoke_later_when_on_ui_thread_sync(() => mono_wasm_invoke_js_function_impl(bound_function_js_handle, args), args);
}
function mono_wasm_invoke_js_function_impl(bound_function_js_handle, args) {
    loaderHelpers.assert_runtime_running();
    const bound_fn = mono_wasm_get_jsobj_from_js_handle(bound_function_js_handle);
    if (!(bound_fn && typeof (bound_fn) === "function" && bound_fn[bound_js_function_symbol])) mono_assert(false, `Bound function handle expected ${bound_function_js_handle}`); // inlined mono_assert condition
    args = fixupPointer(args, 0);
    bound_fn(args);
}
function mono_wasm_set_module_imports(module_name, moduleImports) {
    importedModules.set(module_name, moduleImports);
    if (loaderHelpers.diagnosticTracing) mono_log_debug(`added module imports '${module_name}'`); // inlined mono_log_debug condition
}
function mono_wasm_lookup_js_import(function_name, js_module_name) {
    if (!(function_name && typeof function_name === "string")) mono_assert(false, "function_name must be string"); // inlined mono_assert condition
    let scope = {};
    const parts = function_name.split(".");
    if (js_module_name) {
        scope = importedModules.get(js_module_name);
        if (WasmEnableThreads) {
            if (!(scope)) mono_assert(false, `ES6 module ${js_module_name} was not imported yet, please call JSHost.ImportAsync() on the UI or JSWebWorker thread first in order to invoke ${function_name}.`); // inlined mono_assert condition
        }
        else {
            if (!(scope)) mono_assert(false, `ES6 module ${js_module_name} was not imported yet, please call JSHost.ImportAsync() first in order to invoke ${function_name}.`); // inlined mono_assert condition
        }
    }
    else if (parts[0] === "INTERNAL") {
        scope = INTERNAL;
        parts.shift();
    }
    else if (parts[0] === "globalThis") {
        scope = globalThis;
        parts.shift();
    }
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        const newscope = scope[part];
        if (!newscope) {
            throw new Error(`${part} not found while looking up ${function_name}`);
        }
        scope = newscope;
    }
    const fname = parts[parts.length - 1];
    const fn = scope[fname];
    if (typeof (fn) !== "function") {
        throw new Error(`${function_name} must be a Function but was ${typeof fn}`);
    }
    // if the function was already bound to some object it would stay bound to original object. That's good.
    return fn.bind(scope);
}
function set_property(self, name, value) {
    if (!(self)) throw new Error("Assert failed: Null reference"); // inlined mono_check
    self[name] = value;
}
function get_property(self, name) {
    if (!(self)) throw new Error("Assert failed: Null reference"); // inlined mono_check
    return self[name];
}
function has_property(self, name) {
    if (!(self)) throw new Error("Assert failed: Null reference"); // inlined mono_check
    return name in self;
}
function get_typeof_property(self, name) {
    if (!(self)) throw new Error("Assert failed: Null reference"); // inlined mono_check
    return typeof self[name];
}
function get_global_this() {
    return globalThis;
}
const importedModulesPromises = new Map();
const importedModules = new Map();
function dynamic_import(module_name, module_url) {
    assert_js_interop();
    if (!(module_name && typeof module_name === "string")) mono_assert(false, "module_name must be string"); // inlined mono_assert condition
    if (!(module_url && typeof module_url === "string")) mono_assert(false, "module_url must be string"); // inlined mono_assert condition
    let promise = importedModulesPromises.get(module_name);
    const newPromise = !promise;
    if (newPromise) {
        if (loaderHelpers.diagnosticTracing) mono_log_debug(`importing ES6 module '${module_name}' from '${module_url}'`); // inlined mono_log_debug condition
        promise = import(/*! webpackIgnore: true */ module_url);
        importedModulesPromises.set(module_name, promise);
    }
    return wrap_as_cancelable_promise(async () => {
        const module = await promise;
        if (newPromise) {
            importedModules.set(module_name, module);
            if (loaderHelpers.diagnosticTracing) mono_log_debug(`imported ES6 module '${module_name}' from '${module_url}'`); // inlined mono_log_debug condition
        }
        return module;
    });
}
function normalize_exception(ex) {
    let res = "unknown exception";
    if (ex) {
        res = ex.toString();
        const stack = ex.stack;
        if (stack) {
            // Some JS runtimes insert the error message at the top of the stack, some don't,
            //  so normalize it by using the stack as the result if it already contains the error
            if (stack.startsWith(res))
                res = stack;
            else
                res += "\n" + stack;
        }
        res = mono_wasm_symbolicate_string(res);
    }
    return res;
}
function assert_js_interop() {
    loaderHelpers.assert_runtime_running();
    if (WasmEnableThreads) {
        if (!(runtimeHelpers.mono_wasm_bindings_is_ready && runtimeHelpers.proxyGCHandle)) mono_assert(false, "Please use dedicated worker for working with JavaScript interop. See https://github.com/dotnet/runtime/blob/main/src/mono/wasm/threads.md#JS-interop-on-dedicated-threads"); // inlined mono_assert condition
    }
    else {
        if (!(runtimeHelpers.mono_wasm_bindings_is_ready)) mono_assert(false, "The runtime must be initialized."); // inlined mono_assert condition
    }
}
function assert_c_interop() {
    loaderHelpers.assert_runtime_running();
    if (WasmEnableThreads) {
        if (!(runtimeHelpers.mono_wasm_bindings_is_ready)) mono_assert(false, "Please use dedicated worker for working with JavaScript interop. See https://github.com/dotnet/runtime/blob/main/src/mono/wasm/threads.md#JS-interop-on-dedicated-threads"); // inlined mono_assert condition
    }
    else {
        if (!(runtimeHelpers.mono_wasm_bindings_is_ready)) mono_assert(false, "The runtime must be initialized."); // inlined mono_assert condition
    }
}
// make sure we are not blocking em_task_queue_execute up the call stack
// so that when we call back to managed, the FS calls could still be processed by the UI thread
// see also emscripten_yield which can process the FS calls inside the spin wait
function invoke_later_when_on_ui_thread_sync(fn, args) {
    if (WasmEnableThreads && monoThreadInfo.isUI) {
        Module.safeSetTimeout(() => {
            fn();
            // see also mono_threads_wasm_sync_run_in_target_thread_vii_cb
            const done_semaphore = get_sync_done_semaphore_ptr(args);
            threads_c_functions.mono_threads_wasm_sync_run_in_target_thread_done(done_semaphore);
        }, 0);
    }
    else {
        fn();
    }
}
// make sure we are not blocking em_task_queue_execute up the call stack
// so that when we call back to managed, the FS calls could still be processed by the UI thread
function invoke_later_when_on_ui_thread_async(fn) {
    if (WasmEnableThreads && monoThreadInfo.isUI) {
        Module.safeSetTimeout(fn, 0);
    }
    else {
        fn();
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const _use_weak_ref = typeof globalThis.WeakRef === "function";
function create_weak_ref(js_obj) {
    if (_use_weak_ref) {
        return new WeakRef(js_obj);
    }
    else {
        // this is trivial WeakRef replacement, which holds strong refrence, instead of weak one, when the browser doesn't support it
        return create_strong_ref(js_obj);
    }
}
function create_strong_ref(js_obj) {
    return {
        deref: () => {
            return js_obj;
        },
        dispose: () => {
            js_obj = null;
        }
    };
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function mono_wasm_bind_cs_function(method, assemblyName, namespaceName, shortClassName, methodName, signatureHash, signature) {
    const fullyQualifiedName = `[${assemblyName}] ${namespaceName}.${shortClassName}:${methodName}`;
    const mark = startMeasure();
    if (loaderHelpers.diagnosticTracing) mono_log_debug(`Binding [JSExport] ${namespaceName}.${shortClassName}:${methodName} from ${assemblyName} assembly`); // inlined mono_log_debug condition
    const version = get_signature_version(signature);
    if (!(version === 2)) mono_assert(false, `Signature version ${version} mismatch.`); // inlined mono_assert condition
    const args_count = get_signature_argument_count(signature);
    const arg_marshalers = new Array(args_count);
    for (let index = 0; index < args_count; index++) {
        const sig = get_sig(signature, index + 2);
        const marshaler_type = get_signature_type(sig);
        const arg_marshaler = bind_arg_marshal_to_cs(sig, marshaler_type, index + 2);
        if (!(arg_marshaler)) mono_assert(false, "ERR43: argument marshaler must be resolved"); // inlined mono_assert condition
        arg_marshalers[index] = arg_marshaler;
    }
    const res_sig = get_sig(signature, 1);
    let res_marshaler_type = get_signature_type(res_sig);
    // hack until we have public API for JSType.DiscardNoWait
    if (WasmEnableThreads && shortClassName === "DefaultWebAssemblyJSRuntime"
        && namespaceName === "Microsoft.AspNetCore.Components.WebAssembly.Services"
        && (methodName === "BeginInvokeDotNet" || methodName === "EndInvokeJS" || methodName === "ReceiveByteArrayFromJS")) {
        res_marshaler_type = 26 /* MarshalerType.DiscardNoWait */;
    }
    const is_async = res_marshaler_type == 20 /* MarshalerType.Task */;
    const is_discard_no_wait = res_marshaler_type == 26 /* MarshalerType.DiscardNoWait */;
    if (is_async) {
        res_marshaler_type = 30 /* MarshalerType.TaskPreCreated */;
    }
    const res_converter = bind_arg_marshal_to_js(res_sig, res_marshaler_type, 1);
    const closure = {
        method,
        fullyQualifiedName,
        args_count,
        arg_marshalers,
        res_converter,
        is_async,
        is_discard_no_wait,
        isDisposed: false,
    };
    let bound_fn;
    if (is_async) {
        if (args_count == 1 && res_converter) {
            bound_fn = bind_fn_1RA(closure);
        }
        else if (args_count == 2 && res_converter) {
            bound_fn = bind_fn_2RA(closure);
        }
        else {
            bound_fn = bind_fn(closure);
        }
    }
    else if (is_discard_no_wait) {
        bound_fn = bind_fn(closure);
    }
    else {
        if (args_count == 0 && !res_converter) {
            bound_fn = bind_fn_0V(closure);
        }
        else if (args_count == 1 && !res_converter) {
            bound_fn = bind_fn_1V(closure);
        }
        else if (args_count == 1 && res_converter) {
            bound_fn = bind_fn_1R(closure);
        }
        else if (args_count == 2 && res_converter) {
            bound_fn = bind_fn_2R(closure);
        }
        else {
            bound_fn = bind_fn(closure);
        }
    }
    // this is just to make debugging easier.
    // It's not CSP compliant and possibly not performant, that's why it's only enabled in debug builds
    // in Release configuration, it would be a trimmed by rollup
    if (BuildConfiguration === "Debug" && !runtimeHelpers.cspPolicy) {
        try {
            const url = `//# sourceURL=https://dotnet/JSExport/${methodName}`;
            const body = `return (function JSExport_${methodName}(){ return fn.apply(this, arguments)});`;
            bound_fn = new Function("fn", url + "\r\n" + body)(bound_fn);
        }
        catch (ex) {
            runtimeHelpers.cspPolicy = true;
        }
    }
    bound_fn[bound_cs_function_symbol] = closure;
    _walk_exports_to_set_function(assemblyName, namespaceName, shortClassName, methodName, signatureHash, bound_fn);
    endMeasure(mark, "mono.bindCsFunction:" /* MeasuredBlock.bindCsFunction */, fullyQualifiedName);
}
function bind_fn_0V(closure) {
    const method = closure.method;
    const fqn = closure.fullyQualifiedName;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn_0V() {
        const mark = startMeasure();
        loaderHelpers.assert_runtime_running();
        if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
        const sp = Module.stackSave();
        try {
            const size = 2;
            const args = alloc_stack_frame(size);
            // call C# side
            invoke_sync_jsexport(method, args);
        }
        finally {
            Module.stackRestore(sp);
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn_1V(closure) {
    const method = closure.method;
    const marshaler1 = closure.arg_marshalers[0];
    const fqn = closure.fullyQualifiedName;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn_1V(arg1) {
        const mark = startMeasure();
        loaderHelpers.assert_runtime_running();
        if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
        const sp = Module.stackSave();
        try {
            const size = 3;
            const args = alloc_stack_frame(size);
            marshaler1(args, arg1);
            // call C# side
            invoke_sync_jsexport(method, args);
        }
        finally {
            Module.stackRestore(sp);
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn_1R(closure) {
    const method = closure.method;
    const marshaler1 = closure.arg_marshalers[0];
    const res_converter = closure.res_converter;
    const fqn = closure.fullyQualifiedName;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn_1R(arg1) {
        const mark = startMeasure();
        loaderHelpers.assert_runtime_running();
        if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
        const sp = Module.stackSave();
        try {
            const size = 3;
            const args = alloc_stack_frame(size);
            marshaler1(args, arg1);
            // call C# side
            invoke_sync_jsexport(method, args);
            const js_result = res_converter(args);
            return js_result;
        }
        finally {
            Module.stackRestore(sp);
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn_1RA(closure) {
    const method = closure.method;
    const marshaler1 = closure.arg_marshalers[0];
    const res_converter = closure.res_converter;
    const fqn = closure.fullyQualifiedName;
    if (!WasmEnableThreads)
        closure = null;
    return function bind_fn_1RA(arg1) {
        const mark = startMeasure();
        loaderHelpers.assert_runtime_running();
        if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
        const sp = Module.stackSave();
        try {
            const size = 3;
            const args = alloc_stack_frame(size);
            marshaler1(args, arg1);
            // pre-allocate the promise
            let promise = res_converter(args);
            // call C# side
            invoke_async_jsexport(runtimeHelpers.managedThreadTID, method, args, size);
            // in case the C# side returned synchronously
            promise = end_marshal_task_to_js(args, undefined, promise);
            return promise;
        }
        finally {
            Module.stackRestore(sp);
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn_2R(closure) {
    const method = closure.method;
    const marshaler1 = closure.arg_marshalers[0];
    const marshaler2 = closure.arg_marshalers[1];
    const res_converter = closure.res_converter;
    const fqn = closure.fullyQualifiedName;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn_2R(arg1, arg2) {
        const mark = startMeasure();
        loaderHelpers.assert_runtime_running();
        if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
        const sp = Module.stackSave();
        try {
            const size = 4;
            const args = alloc_stack_frame(size);
            marshaler1(args, arg1);
            marshaler2(args, arg2);
            // call C# side
            invoke_sync_jsexport(method, args);
            const js_result = res_converter(args);
            return js_result;
        }
        finally {
            Module.stackRestore(sp);
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn_2RA(closure) {
    const method = closure.method;
    const marshaler1 = closure.arg_marshalers[0];
    const marshaler2 = closure.arg_marshalers[1];
    const res_converter = closure.res_converter;
    const fqn = closure.fullyQualifiedName;
    if (!WasmEnableThreads)
        closure = null;
    return function bind_fn_2RA(arg1, arg2) {
        const mark = startMeasure();
        loaderHelpers.assert_runtime_running();
        if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
        const sp = Module.stackSave();
        try {
            const size = 4;
            const args = alloc_stack_frame(size);
            marshaler1(args, arg1);
            marshaler2(args, arg2);
            // pre-allocate the promise
            let promise = res_converter(args);
            // call C# side
            invoke_async_jsexport(runtimeHelpers.managedThreadTID, method, args, size);
            // in case the C# side returned synchronously
            promise = end_marshal_task_to_js(args, undefined, promise);
            return promise;
        }
        finally {
            Module.stackRestore(sp);
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
function bind_fn(closure) {
    const args_count = closure.args_count;
    const arg_marshalers = closure.arg_marshalers;
    const res_converter = closure.res_converter;
    const method = closure.method;
    const fqn = closure.fullyQualifiedName;
    const is_async = closure.is_async;
    const is_discard_no_wait = closure.is_discard_no_wait;
    if (!WasmEnableThreads)
        closure = null;
    return function bound_fn(...js_args) {
        const mark = startMeasure();
        loaderHelpers.assert_runtime_running();
        if (!(!WasmEnableThreads || !closure.isDisposed)) mono_assert(false, "The function was already disposed"); // inlined mono_assert condition
        const sp = Module.stackSave();
        try {
            const size = 2 + args_count;
            const args = alloc_stack_frame(size);
            for (let index = 0; index < args_count; index++) {
                const marshaler = arg_marshalers[index];
                if (marshaler) {
                    const js_arg = js_args[index];
                    marshaler(args, js_arg);
                }
            }
            let js_result = undefined;
            if (is_async) {
                // pre-allocate the promise
                js_result = res_converter(args);
            }
            // call C# side
            if (is_async) {
                invoke_async_jsexport(runtimeHelpers.managedThreadTID, method, args, size);
                // in case the C# side returned synchronously
                js_result = end_marshal_task_to_js(args, undefined, js_result);
            }
            else if (is_discard_no_wait) {
                // call C# side, fire and forget
                invoke_async_jsexport(runtimeHelpers.managedThreadTID, method, args, size);
            }
            else {
                invoke_sync_jsexport(method, args);
                if (res_converter) {
                    js_result = res_converter(args);
                }
            }
            return js_result;
        }
        finally {
            Module.stackRestore(sp);
            endMeasure(mark, "mono.callCsFunction:" /* MeasuredBlock.callCsFunction */, fqn);
        }
    };
}
const exportsByAssembly = new Map();
function _walk_exports_to_set_function(assembly, namespace, classname, methodname, signature_hash, fn) {
    const parts = `${namespace}.${classname}`.replace(/\//g, ".").split(".");
    let scope = undefined;
    let assemblyScope = exportsByAssembly.get(assembly);
    if (!assemblyScope) {
        assemblyScope = {};
        exportsByAssembly.set(assembly, assemblyScope);
        exportsByAssembly.set(assembly + ".dll", assemblyScope);
    }
    scope = assemblyScope;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part != "") {
            let newscope = scope[part];
            if (typeof newscope === "undefined") {
                newscope = {};
                scope[part] = newscope;
            }
            if (!(newscope)) mono_assert(false, `${part} not found while looking up ${classname}`); // inlined mono_assert condition
            scope = newscope;
        }
    }
    if (!scope[methodname]) {
        scope[methodname] = fn;
    }
    scope[`${methodname}.${signature_hash}`] = fn;
}
async function mono_wasm_get_assembly_exports(assembly) {
    assert_js_interop();
    const result = exportsByAssembly.get(assembly);
    if (!result) {
        await bind_assembly_exports(assembly);
    }
    return exportsByAssembly.get(assembly) || {};
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const _use_finalization_registry = typeof globalThis.FinalizationRegistry === "function";
let _js_owned_object_registry;
// this is array, not map. We maintain list of gaps in _js_handle_free_list so that it could be as compact as possible
// 0th element is always null, because JSHandle == 0 is invalid handle.
const _cs_owned_objects_by_js_handle = [null];
const _cs_owned_objects_by_jsv_handle = [null];
const _js_handle_free_list = [];
let _next_js_handle = 1;
const _js_owned_object_table = new Map();
const _gcv_handle_free_list = [];
let _next_gcv_handle = -2;
// GCVHandle is like GCHandle, but it's not tracked and allocated by the mono GC, but just by JS.
// It's used when we need to create GCHandle-like identity ahead of time, before calling Mono.
// they have negative values, so that they don't collide with GCHandles.
function alloc_gcv_handle() {
    const gcv_handle = _gcv_handle_free_list.length ? _gcv_handle_free_list.pop() : _next_gcv_handle--;
    return gcv_handle;
}
function free_gcv_handle(gcv_handle) {
    _gcv_handle_free_list.push(gcv_handle);
}
function is_jsv_handle(js_handle) {
    return js_handle < -1;
}
function is_js_handle(js_handle) {
    return js_handle > 0;
}
function is_gcv_handle(gc_handle) {
    return gc_handle < -1;
}
// NOTE: FinalizationRegistry and WeakRef are missing on Safari below 14.1
if (_use_finalization_registry) {
    _js_owned_object_registry = new globalThis.FinalizationRegistry(_js_owned_object_finalized);
}
const js_owned_gc_handle_symbol = Symbol.for("wasm js_owned_gc_handle");
const cs_owned_js_handle_symbol = Symbol.for("wasm cs_owned_js_handle");
const do_not_force_dispose = Symbol.for("wasm do_not_force_dispose");
function mono_wasm_get_jsobj_from_js_handle(js_handle) {
    if (is_js_handle(js_handle))
        return _cs_owned_objects_by_js_handle[js_handle];
    if (is_jsv_handle(js_handle))
        return _cs_owned_objects_by_jsv_handle[0 - js_handle];
    return null;
}
function mono_wasm_get_js_handle(js_obj) {
    assert_js_interop();
    if (js_obj[cs_owned_js_handle_symbol]) {
        return js_obj[cs_owned_js_handle_symbol];
    }
    const js_handle = _js_handle_free_list.length ? _js_handle_free_list.pop() : _next_js_handle++;
    // note _cs_owned_objects_by_js_handle is list, not Map. That's why we maintain _js_handle_free_list.
    _cs_owned_objects_by_js_handle[js_handle] = js_obj;
    if (Object.isExtensible(js_obj)) {
        js_obj[cs_owned_js_handle_symbol] = js_handle;
    }
    // else
    //   The consequence of not adding the cs_owned_js_handle_symbol is, that we could have multiple JSHandles and multiple proxy instances.
    //   Throwing exception would prevent us from creating any proxy of non-extensible things.
    //   If we have weakmap instead, we would pay the price of the lookup for all proxies, not just non-extensible objects.
    return js_handle;
}
function register_with_jsv_handle(js_obj, jsv_handle) {
    assert_js_interop();
    // note _cs_owned_objects_by_js_handle is list, not Map. That's why we maintain _js_handle_free_list.
    _cs_owned_objects_by_jsv_handle[0 - jsv_handle] = js_obj;
    if (Object.isExtensible(js_obj)) {
        js_obj[cs_owned_js_handle_symbol] = jsv_handle;
    }
}
// note: in MT, this is called from locked JSProxyContext. Don't call anything that would need locking.
function mono_wasm_release_cs_owned_object(js_handle) {
    let obj;
    if (is_js_handle(js_handle)) {
        obj = _cs_owned_objects_by_js_handle[js_handle];
        _cs_owned_objects_by_js_handle[js_handle] = undefined;
        _js_handle_free_list.push(js_handle);
    }
    else if (is_jsv_handle(js_handle)) {
        obj = _cs_owned_objects_by_jsv_handle[0 - js_handle];
        _cs_owned_objects_by_jsv_handle[0 - js_handle] = undefined;
        // see free list in JSProxyContext.FreeJSVHandle
    }
    if (!(obj !== undefined && obj !== null)) mono_assert(false, "ObjectDisposedException"); // inlined mono_assert condition
    if (typeof obj[cs_owned_js_handle_symbol] !== "undefined") {
        obj[cs_owned_js_handle_symbol] = undefined;
    }
}
function setup_managed_proxy(owner, gc_handle) {
    assert_js_interop();
    // keep the gc_handle so that we could easily convert it back to original C# object for roundtrip
    owner[js_owned_gc_handle_symbol] = gc_handle;
    // NOTE: this would be leaking C# objects when the browser doesn't support FinalizationRegistry/WeakRef
    if (_use_finalization_registry) {
        // register for GC of the C# object after the JS side is done with the object
        _js_owned_object_registry.register(owner, gc_handle, owner);
    }
    // register for instance reuse
    // NOTE: this would be leaking C# objects when the browser doesn't support FinalizationRegistry/WeakRef
    const wr = create_weak_ref(owner);
    _js_owned_object_table.set(gc_handle, wr);
}
function upgrade_managed_proxy_to_strong_ref(owner, gc_handle) {
    const sr = create_strong_ref(owner);
    if (_use_finalization_registry) {
        _js_owned_object_registry.unregister(owner);
    }
    _js_owned_object_table.set(gc_handle, sr);
}
function teardown_managed_proxy(owner, gc_handle, skipManaged) {
    assert_js_interop();
    // The JS object associated with this gc_handle has been collected by the JS GC.
    // As such, it's not possible for this gc_handle to be invoked by JS anymore, so
    //  we can release the tracking weakref (it's null now, by definition),
    //  and tell the C# side to stop holding a reference to the managed object.
    // "The FinalizationRegistry callback is called potentially multiple times"
    if (owner) {
        gc_handle = owner[js_owned_gc_handle_symbol];
        owner[js_owned_gc_handle_symbol] = GCHandleNull;
        if (_use_finalization_registry) {
            _js_owned_object_registry.unregister(owner);
        }
    }
    if (gc_handle !== GCHandleNull && _js_owned_object_table.delete(gc_handle) && !skipManaged) {
        if (loaderHelpers.is_runtime_running() && !force_dispose_proxies_in_progress) {
            release_js_owned_object_by_gc_handle(gc_handle);
        }
    }
    if (is_gcv_handle(gc_handle)) {
        free_gcv_handle(gc_handle);
    }
}
function assert_not_disposed(result) {
    const gc_handle = result[js_owned_gc_handle_symbol];
    if (!(gc_handle != GCHandleNull)) throw new Error("Assert failed: ObjectDisposedException"); // inlined mono_check
    return gc_handle;
}
function _js_owned_object_finalized(gc_handle) {
    if (!loaderHelpers.is_runtime_running()) {
        // We're shutting down, so don't bother doing anything else.
        return;
    }
    teardown_managed_proxy(null, gc_handle);
}
function _lookup_js_owned_object(gc_handle) {
    if (!gc_handle)
        return null;
    const wr = _js_owned_object_table.get(gc_handle);
    if (wr) {
        // this could be null even before _js_owned_object_finalized was called
        // TODO: are there race condition consequences ?
        return wr.deref();
    }
    return null;
}
function assertNoProxies() {
    if (!WasmEnableThreads)
        return;
    if (!(_js_owned_object_table.size === 0)) mono_assert(false, "There should be no proxies on this thread."); // inlined mono_assert condition
    if (!(_cs_owned_objects_by_js_handle.length === 1)) mono_assert(false, "There should be no proxies on this thread."); // inlined mono_assert condition
    if (!(_cs_owned_objects_by_jsv_handle.length === 1)) mono_assert(false, "There should be no proxies on this thread."); // inlined mono_assert condition
    if (!(exportsByAssembly.size === 0)) mono_assert(false, "There should be no exports on this thread."); // inlined mono_assert condition
    if (!(js_import_wrapper_by_fn_handle.length === 1)) mono_assert(false, "There should be no imports on this thread."); // inlined mono_assert condition
}
let force_dispose_proxies_in_progress = false;
// when we arrive here from UninstallWebWorkerInterop, the C# will unregister the handles too.
// when called from elsewhere, C# side could be unbalanced!!
function forceDisposeProxies(disposeMethods, verbose) {
    let keepSomeCsAlive = false;
    let keepSomeJsAlive = false;
    force_dispose_proxies_in_progress = true;
    let doneImports = 0;
    let doneExports = 0;
    let doneGCHandles = 0;
    let doneJSHandles = 0;
    // dispose all proxies to C# objects
    const gc_handles = [..._js_owned_object_table.keys()];
    for (const gc_handle of gc_handles) {
        const wr = _js_owned_object_table.get(gc_handle);
        const obj = wr && wr.deref();
        if (_use_finalization_registry && obj) {
            _js_owned_object_registry.unregister(obj);
        }
        if (obj) {
            const keepAlive = typeof obj[do_not_force_dispose] === "boolean" && obj[do_not_force_dispose];
            if (verbose) {
                const proxy_debug = BuildConfiguration === "Debug" ? obj[proxy_debug_symbol] : undefined;
                if (BuildConfiguration === "Debug" && proxy_debug) {
                    mono_log_warn(`${proxy_debug} ${typeof obj} was still alive. ${keepAlive ? "keeping" : "disposing"}.`);
                }
                else {
                    mono_log_warn(`Proxy of C# ${typeof obj} with GCHandle ${gc_handle} was still alive. ${keepAlive ? "keeping" : "disposing"}.`);
                }
            }
            if (!keepAlive) {
                const promise_control = loaderHelpers.getPromiseController(obj);
                if (promise_control) {
                    promise_control.reject(new Error("WebWorker which is origin of the Task is being terminated."));
                }
                if (typeof obj.dispose === "function") {
                    obj.dispose();
                }
                if (obj[js_owned_gc_handle_symbol] === gc_handle) {
                    obj[js_owned_gc_handle_symbol] = GCHandleNull;
                }
                if (!_use_weak_ref && wr)
                    wr.dispose();
                doneGCHandles++;
            }
            else {
                keepSomeCsAlive = true;
            }
        }
    }
    if (!keepSomeCsAlive) {
        _js_owned_object_table.clear();
        if (_use_finalization_registry) {
            _js_owned_object_registry = new globalThis.FinalizationRegistry(_js_owned_object_finalized);
        }
    }
    const free_js_handle = (js_handle, list) => {
        const obj = list[js_handle];
        const keepAlive = obj && typeof obj[do_not_force_dispose] === "boolean" && obj[do_not_force_dispose];
        if (!keepAlive) {
            list[js_handle] = undefined;
        }
        if (obj) {
            if (verbose) {
                const proxy_debug = BuildConfiguration === "Debug" ? obj[proxy_debug_symbol] : undefined;
                if (BuildConfiguration === "Debug" && proxy_debug) {
                    mono_log_warn(`${proxy_debug} ${typeof obj} was still alive. ${keepAlive ? "keeping" : "disposing"}.`);
                }
                else {
                    mono_log_warn(`Proxy of JS ${typeof obj} with JSHandle ${js_handle} was still alive. ${keepAlive ? "keeping" : "disposing"}.`);
                }
            }
            if (!keepAlive) {
                const promise_control = loaderHelpers.getPromiseController(obj);
                if (promise_control) {
                    promise_control.reject(new Error("WebWorker which is origin of the Task is being terminated."));
                }
                if (typeof obj.dispose === "function") {
                    obj.dispose();
                }
                if (obj[cs_owned_js_handle_symbol] === js_handle) {
                    obj[cs_owned_js_handle_symbol] = undefined;
                }
                doneJSHandles++;
            }
            else {
                keepSomeJsAlive = true;
            }
        }
    };
    // dispose all proxies to JS objects
    for (let js_handle = 0; js_handle < _cs_owned_objects_by_js_handle.length; js_handle++) {
        free_js_handle(js_handle, _cs_owned_objects_by_js_handle);
    }
    for (let jsv_handle = 0; jsv_handle < _cs_owned_objects_by_jsv_handle.length; jsv_handle++) {
        free_js_handle(jsv_handle, _cs_owned_objects_by_jsv_handle);
    }
    if (!keepSomeJsAlive) {
        _cs_owned_objects_by_js_handle.length = 1;
        _cs_owned_objects_by_jsv_handle.length = 1;
        _next_js_handle = 1;
        _js_handle_free_list.length = 0;
    }
    _gcv_handle_free_list.length = 0;
    _next_gcv_handle = -2;
    if (disposeMethods) {
        // dispose all [JSImport]
        for (const bound_fn of js_import_wrapper_by_fn_handle) {
            if (bound_fn) {
                const closure = bound_fn[imported_js_function_symbol];
                if (closure) {
                    closure.disposed = true;
                    doneImports++;
                }
            }
        }
        js_import_wrapper_by_fn_handle.length = 1;
        // dispose all [JSExport]
        const assemblyExports = [...exportsByAssembly.values()];
        for (const assemblyExport of assemblyExports) {
            for (const exportName in assemblyExport) {
                const bound_fn = assemblyExport[exportName];
                const closure = bound_fn[bound_cs_function_symbol];
                if (closure) {
                    closure.disposed = true;
                    doneExports++;
                }
            }
        }
        exportsByAssembly.clear();
    }
    mono_log_info(`forceDisposeProxies done: ${doneImports} imports, ${doneExports} exports, ${doneGCHandles} GCHandles, ${doneJSHandles} JSHandles.`);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const _are_promises_supported = ((typeof Promise === "object") || (typeof Promise === "function")) && (typeof Promise.resolve === "function");
function isThenable(js_obj) {
    // When using an external Promise library like Bluebird the Promise.resolve may not be sufficient
    // to identify the object as a Promise.
    return Promise.resolve(js_obj) === js_obj ||
        ((typeof js_obj === "object" || typeof js_obj === "function") && typeof js_obj.then === "function");
}
function wrap_as_cancelable_promise(fn) {
    const { promise, promise_control } = createPromiseController();
    const inner = fn();
    inner.then((data) => promise_control.resolve(data)).catch((reason) => promise_control.reject(reason));
    return promise;
}
function wrap_as_cancelable(inner) {
    const { promise, promise_control } = createPromiseController();
    inner.then((data) => promise_control.resolve(data)).catch((reason) => promise_control.reject(reason));
    return promise;
}
function mono_wasm_cancel_promise(task_holder_gc_handle) {
    // cancelation should not arrive earlier than the promise created by marshaling in mono_wasm_invoke_jsimport_MT
    invoke_later_when_on_ui_thread_async(() => mono_wasm_cancel_promise_impl(task_holder_gc_handle));
}
function mono_wasm_cancel_promise_impl(task_holder_gc_handle) {
    if (!loaderHelpers.is_runtime_running()) {
        if (loaderHelpers.diagnosticTracing) mono_log_debug("This promise can't be canceled, mono runtime already exited."); // inlined mono_log_debug condition
        return;
    }
    const holder = _lookup_js_owned_object(task_holder_gc_handle);
    if (!(!!holder)) mono_assert(false, `Expected Promise for GCHandle ${task_holder_gc_handle}`); // inlined mono_assert condition
    holder.cancel();
}
const promise_holder_symbol = Symbol.for("wasm promise_holder");
class PromiseHolder extends ManagedObject {
    constructor(promise, gc_handle, promiseHolderPtr, // could be null for GCV_handle
    res_converter) {
        super();
        this.promise = promise;
        this.gc_handle = gc_handle;
        this.promiseHolderPtr = promiseHolderPtr;
        this.res_converter = res_converter;
        this.isResolved = false;
        this.isPosted = false;
        this.isPostponed = false;
        this.data = null;
        this.reason = undefined;
    }
    // returns false if the promise is being canceled by another thread in managed code
    setIsResolving() {
        if (!WasmEnableThreads || this.promiseHolderPtr === 0) {
            return true;
        }
        forceThreadMemoryViewRefresh();
        if (compareExchangeI32(this.promiseHolderPtr + 0 /* PromiseHolderState.IsResolving */, 1, 0) === 0) {
            return true;
        }
        return false;
    }
    resolve(data) {
        if (!loaderHelpers.is_runtime_running()) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug("This promise resolution can't be propagated to managed code, mono runtime already exited."); // inlined mono_log_debug condition
            return;
        }
        if (!(!this.isResolved)) mono_assert(false, "resolve could be called only once"); // inlined mono_assert condition
        if (!(!this.isDisposed)) mono_assert(false, "resolve is already disposed."); // inlined mono_assert condition
        if (WasmEnableThreads && !this.setIsResolving()) {
            // we know that cancelation is in flight
            // because we need to keep the GCHandle alive until until the cancelation arrives
            // we skip the this resolve and let the cancelation to reject the Task
            // we store the original data and use it later
            this.data = data;
            this.isPostponed = true;
            // but after the promise is resolved, nothing holds the weak reference to the PromiseHolder anymore
            // we know that cancelation is in flight, so we upgrade the weak reference to strong for the meantime
            upgrade_managed_proxy_to_strong_ref(this, this.gc_handle);
            return;
        }
        this.isResolved = true;
        this.complete_task_wrapper(data, null);
    }
    reject(reason) {
        if (!loaderHelpers.is_runtime_running()) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug("This promise rejection can't be propagated to managed code, mono runtime already exited."); // inlined mono_log_debug condition
            return;
        }
        if (!reason) {
            reason = new Error();
        }
        if (!(!this.isResolved)) mono_assert(false, "reject could be called only once"); // inlined mono_assert condition
        if (!(!this.isDisposed)) mono_assert(false, "resolve is already disposed."); // inlined mono_assert condition
        const isCancelation = reason[promise_holder_symbol] === this;
        if (WasmEnableThreads && !isCancelation && !this.setIsResolving()) {
            // we know that cancelation is in flight
            // because we need to keep the GCHandle alive until until the cancelation arrives
            // we skip the this reject and let the cancelation to reject the Task
            // we store the original reason and use it later
            this.reason = reason;
            this.isPostponed = true;
            // but after the promise is resolved, nothing holds the weak reference to the PromiseHolder anymore
            // we know that cancelation is in flight, so we upgrade the weak reference to strong for the meantime
            upgrade_managed_proxy_to_strong_ref(this, this.gc_handle);
            return;
        }
        this.isResolved = true;
        this.complete_task_wrapper(null, reason);
    }
    cancel() {
        if (!loaderHelpers.is_runtime_running()) {
            if (loaderHelpers.diagnosticTracing) mono_log_debug("This promise cancelation can't be propagated to managed code, mono runtime already exited."); // inlined mono_log_debug condition
            return;
        }
        if (!(!this.isResolved)) mono_assert(false, "cancel could be called only once"); // inlined mono_assert condition
        if (!(!this.isDisposed)) mono_assert(false, "resolve is already disposed."); // inlined mono_assert condition
        if (this.isPostponed) {
            // there was racing resolve/reject which was postponed, to retain valid GCHandle
            // in this case we just finish the original resolve/reject
            // and we need to use the postponed data/reason
            this.isResolved = true;
            if (this.reason !== undefined) {
                this.complete_task_wrapper(null, this.reason);
            }
            else {
                this.complete_task_wrapper(this.data, null);
            }
        }
        else {
            // there is no racing resolve/reject, we can reject/cancel the promise
            const promise = this.promise;
            loaderHelpers.assertIsControllablePromise(promise);
            const promise_control = loaderHelpers.getPromiseController(promise);
            const reason = new Error("OperationCanceledException");
            reason[promise_holder_symbol] = this;
            promise_control.reject(reason);
        }
    }
    // we can do this just once, because it will be dispose the GCHandle
    complete_task_wrapper(data, reason) {
        try {
            if (!(!this.isPosted)) mono_assert(false, "Promise is already posted to managed."); // inlined mono_assert condition
            this.isPosted = true;
            forceThreadMemoryViewRefresh();
            // we can unregister the GC handle just on JS side
            teardown_managed_proxy(this, this.gc_handle, /*skipManaged: */ true);
            // order of operations with teardown_managed_proxy matters
            // so that managed user code running in the continuation could allocate the same GCHandle number and the local registry would be already ok with that
            complete_task(this.gc_handle, reason, data, this.res_converter || marshal_cs_object_to_cs);
        }
        catch (ex) {
            try {
                loaderHelpers.mono_exit(1, ex);
            }
            catch (ex2) {
                // there is no point to propagate the exception into the unhandled promise rejection
            }
        }
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const jsinteropDoc = "For more information see https://aka.ms/dotnet-wasm-jsinterop";
function initialize_marshalers_to_cs() {
    if (js_to_cs_marshalers.size == 0) {
        js_to_cs_marshalers.set(21 /* MarshalerType.Array */, marshal_array_to_cs);
        js_to_cs_marshalers.set(23 /* MarshalerType.Span */, _marshal_span_to_cs);
        js_to_cs_marshalers.set(22 /* MarshalerType.ArraySegment */, _marshal_array_segment_to_cs);
        js_to_cs_marshalers.set(3 /* MarshalerType.Boolean */, marshal_bool_to_cs);
        js_to_cs_marshalers.set(4 /* MarshalerType.Byte */, _marshal_byte_to_cs);
        js_to_cs_marshalers.set(5 /* MarshalerType.Char */, _marshal_char_to_cs);
        js_to_cs_marshalers.set(6 /* MarshalerType.Int16 */, _marshal_int16_to_cs);
        js_to_cs_marshalers.set(7 /* MarshalerType.Int32 */, _marshal_int32_to_cs);
        js_to_cs_marshalers.set(8 /* MarshalerType.Int52 */, _marshal_int52_to_cs);
        js_to_cs_marshalers.set(9 /* MarshalerType.BigInt64 */, _marshal_bigint64_to_cs);
        js_to_cs_marshalers.set(10 /* MarshalerType.Double */, _marshal_double_to_cs);
        js_to_cs_marshalers.set(11 /* MarshalerType.Single */, _marshal_float_to_cs);
        js_to_cs_marshalers.set(12 /* MarshalerType.IntPtr */, marshal_intptr_to_cs);
        js_to_cs_marshalers.set(17 /* MarshalerType.DateTime */, _marshal_date_time_to_cs);
        js_to_cs_marshalers.set(18 /* MarshalerType.DateTimeOffset */, _marshal_date_time_offset_to_cs);
        js_to_cs_marshalers.set(15 /* MarshalerType.String */, marshal_string_to_cs);
        js_to_cs_marshalers.set(16 /* MarshalerType.Exception */, marshal_exception_to_cs);
        js_to_cs_marshalers.set(27 /* MarshalerType.JSException */, marshal_exception_to_cs);
        js_to_cs_marshalers.set(13 /* MarshalerType.JSObject */, marshal_js_object_to_cs);
        js_to_cs_marshalers.set(14 /* MarshalerType.Object */, marshal_cs_object_to_cs);
        js_to_cs_marshalers.set(20 /* MarshalerType.Task */, marshal_task_to_cs);
        js_to_cs_marshalers.set(28 /* MarshalerType.TaskResolved */, marshal_task_to_cs);
        js_to_cs_marshalers.set(29 /* MarshalerType.TaskRejected */, marshal_task_to_cs);
        js_to_cs_marshalers.set(24 /* MarshalerType.Action */, _marshal_function_to_cs);
        js_to_cs_marshalers.set(25 /* MarshalerType.Function */, _marshal_function_to_cs);
        js_to_cs_marshalers.set(0 /* MarshalerType.None */, _marshal_null_to_cs); // also void
        js_to_cs_marshalers.set(2 /* MarshalerType.Discard */, _marshal_null_to_cs); // also void
        js_to_cs_marshalers.set(1 /* MarshalerType.Void */, _marshal_null_to_cs); // also void
        js_to_cs_marshalers.set(26 /* MarshalerType.DiscardNoWait */, _marshal_null_to_cs); // also void
    }
}
function bind_arg_marshal_to_cs(sig, marshaler_type, index) {
    if (marshaler_type === 0 /* MarshalerType.None */ || marshaler_type === 1 /* MarshalerType.Void */ || marshaler_type === 2 /* MarshalerType.Discard */ || marshaler_type === 26 /* MarshalerType.DiscardNoWait */) {
        return undefined;
    }
    let res_marshaler = undefined;
    let arg1_marshaler = undefined;
    let arg2_marshaler = undefined;
    let arg3_marshaler = undefined;
    arg1_marshaler = get_marshaler_to_js_by_type(get_signature_arg1_type(sig));
    arg2_marshaler = get_marshaler_to_js_by_type(get_signature_arg2_type(sig));
    arg3_marshaler = get_marshaler_to_js_by_type(get_signature_arg3_type(sig));
    const marshaler_type_res = get_signature_res_type(sig);
    res_marshaler = get_marshaler_to_cs_by_type(marshaler_type_res);
    if (marshaler_type === 19 /* MarshalerType.Nullable */) {
        // nullable has nested type information, it's stored in res slot of the signature. The marshaler is the same as for non-nullable primitive type.
        marshaler_type = marshaler_type_res;
    }
    const converter = get_marshaler_to_cs_by_type(marshaler_type);
    const element_type = get_signature_arg1_type(sig);
    const arg_offset = index * JavaScriptMarshalerArgSize;
    return (args, value) => {
        converter(args + arg_offset, value, element_type, res_marshaler, arg1_marshaler, arg2_marshaler, arg3_marshaler);
    };
}
function get_marshaler_to_cs_by_type(marshaler_type) {
    if (marshaler_type === 0 /* MarshalerType.None */ || marshaler_type === 1 /* MarshalerType.Void */) {
        return undefined;
    }
    const converter = js_to_cs_marshalers.get(marshaler_type);
    if (!(converter && typeof converter === "function")) mono_assert(false, `ERR30: Unknown converter for type ${marshaler_type}`); // inlined mono_assert condition
    return converter;
}
function marshal_bool_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 3 /* MarshalerType.Boolean */);
        set_arg_bool(arg, value);
    }
}
function _marshal_byte_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 4 /* MarshalerType.Byte */);
        set_arg_u8(arg, value);
    }
}
function _marshal_char_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 5 /* MarshalerType.Char */);
        set_arg_u16(arg, value);
    }
}
function _marshal_int16_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 6 /* MarshalerType.Int16 */);
        set_arg_i16(arg, value);
    }
}
function _marshal_int32_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 7 /* MarshalerType.Int32 */);
        set_arg_i32(arg, value);
    }
}
function _marshal_int52_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 8 /* MarshalerType.Int52 */);
        set_arg_i52(arg, value);
    }
}
function _marshal_bigint64_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 9 /* MarshalerType.BigInt64 */);
        set_arg_i64_big(arg, value);
    }
}
function _marshal_double_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 10 /* MarshalerType.Double */);
        set_arg_f64(arg, value);
    }
}
function _marshal_float_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 11 /* MarshalerType.Single */);
        set_arg_f32(arg, value);
    }
}
function marshal_intptr_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 12 /* MarshalerType.IntPtr */);
        set_arg_intptr(arg, value);
    }
}
function _marshal_date_time_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        if (!(value instanceof Date)) throw new Error("Assert failed: Value is not a Date"); // inlined mono_check
        set_arg_type(arg, 17 /* MarshalerType.DateTime */);
        set_arg_date(arg, value);
    }
}
function _marshal_date_time_offset_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        if (!(value instanceof Date)) throw new Error("Assert failed: Value is not a Date"); // inlined mono_check
        set_arg_type(arg, 18 /* MarshalerType.DateTimeOffset */);
        set_arg_date(arg, value);
    }
}
function marshal_string_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        set_arg_type(arg, 15 /* MarshalerType.String */);
        if (!(typeof value === "string")) throw new Error("Assert failed: Value is not a String"); // inlined mono_check
        _marshal_string_to_cs_impl(arg, value);
    }
}
function _marshal_string_to_cs_impl(arg, value) {
    if (WasmEnableJsInteropByValue) {
        const bufferLen = value.length * 2;
        const buffer = malloc(bufferLen); // together with Marshal.FreeHGlobal
        stringToUTF16(buffer, buffer + bufferLen, value);
        set_arg_intptr(arg, buffer);
        set_arg_length(arg, value.length);
    }
    else {
        if (!(!WasmEnableThreads)) mono_assert(false, "Marshaling strings by reference is not supported in multithreaded mode"); // inlined mono_assert condition
        const root = get_string_root(arg);
        try {
            stringToMonoStringRoot(value, root);
        }
        finally {
            root.release();
        }
    }
}
function _marshal_null_to_cs(arg) {
    set_arg_type(arg, 0 /* MarshalerType.None */);
}
function _marshal_function_to_cs(arg, value, _, res_converter, arg1_converter, arg2_converter, arg3_converter) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
        return;
    }
    if (!(value && value instanceof Function)) throw new Error("Assert failed: Value is not a Function"); // inlined mono_check
    // TODO: we could try to cache value -> existing JSHandle
    const wrapper = function delegate_wrapper(args) {
        const exc = get_arg(args, 0);
        const res = get_arg(args, 1);
        const arg1 = get_arg(args, 2);
        const arg2 = get_arg(args, 3);
        const arg3 = get_arg(args, 4);
        const previousPendingSynchronousCall = runtimeHelpers.isPendingSynchronousCall;
        try {
            if (!(!WasmEnableThreads || !wrapper.isDisposed)) mono_assert(false, "Function is disposed and should not be invoked anymore."); // inlined mono_assert condition
            let arg1_js = undefined;
            let arg2_js = undefined;
            let arg3_js = undefined;
            if (arg1_converter) {
                arg1_js = arg1_converter(arg1);
            }
            if (arg2_converter) {
                arg2_js = arg2_converter(arg2);
            }
            if (arg3_converter) {
                arg3_js = arg3_converter(arg3);
            }
            runtimeHelpers.isPendingSynchronousCall = true; // this is always synchronous call for now
            const res_js = value(arg1_js, arg2_js, arg3_js);
            if (res_converter) {
                res_converter(res, res_js);
            }
        }
        catch (ex) {
            marshal_exception_to_cs(exc, ex);
        }
        finally {
            runtimeHelpers.isPendingSynchronousCall = previousPendingSynchronousCall;
        }
    };
    wrapper[bound_js_function_symbol] = true;
    wrapper.isDisposed = false;
    wrapper.dispose = () => {
        wrapper.isDisposed = true;
    };
    const bound_function_handle = mono_wasm_get_js_handle(wrapper);
    if (BuildConfiguration === "Debug") {
        wrapper[proxy_debug_symbol] = `Proxy of JS Function with JSHandle ${bound_function_handle}: ${value.toString()}`;
    }
    set_js_handle(arg, bound_function_handle);
    set_arg_type(arg, 25 /* MarshalerType.Function */); //TODO or action ?
}
function marshal_task_to_cs(arg, value, _, res_converter) {
    const handleIsPreallocated = get_arg_type(arg) == 30 /* MarshalerType.TaskPreCreated */;
    if (value === null || value === undefined) {
        if (WasmEnableThreads && handleIsPreallocated) {
            // This is multi-threading return from JSImport with Task result and we can't return synchronously,
            // because C# caller could be on different thread and sent us an async message.
            // It already returned pending Task to it's own caller.
            const err = new Error("InvalidOperationException: Task return with null value is not supported in multi-threading scenario.");
            // Alternatively we can return promise and resolve it with null/default value.
            value = Promise.reject(err);
        }
        else {
            set_arg_type(arg, 0 /* MarshalerType.None */);
            return;
        }
    }
    if (!(isThenable(value))) throw new Error("Assert failed: Value is not a Promise"); // inlined mono_check
    const gc_handle = handleIsPreallocated ? get_arg_gc_handle(arg) : alloc_gcv_handle();
    const promiseHolderPtr = WasmEnableThreads && handleIsPreallocated ? get_arg_intptr(arg) : 0;
    if (!handleIsPreallocated) {
        set_gc_handle(arg, gc_handle);
        set_arg_type(arg, 20 /* MarshalerType.Task */);
    }
    const holder = new PromiseHolder(value, gc_handle, promiseHolderPtr, res_converter);
    setup_managed_proxy(holder, gc_handle);
    if (BuildConfiguration === "Debug") {
        holder[proxy_debug_symbol] = `PromiseHolder with GCHandle ${gc_handle}`;
    }
    value.then(data => holder.resolve(data), reason => holder.reject(reason));
}
function marshal_exception_to_cs(arg, value) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else if (value instanceof ManagedError) {
        set_arg_type(arg, 16 /* MarshalerType.Exception */);
        // this is managed exception round-trip
        const gc_handle = assert_not_disposed(value);
        set_gc_handle(arg, gc_handle);
    }
    else {
        if (!(typeof value === "object" || typeof value === "string")) throw new Error(`Assert failed: Value is not an Error ${typeof value}`); // inlined mono_check
        set_arg_type(arg, 27 /* MarshalerType.JSException */);
        const message = value.toString();
        _marshal_string_to_cs_impl(arg, message);
        const known_js_handle = value[cs_owned_js_handle_symbol];
        if (known_js_handle) {
            set_js_handle(arg, known_js_handle);
        }
        else {
            const js_handle = mono_wasm_get_js_handle(value);
            if (BuildConfiguration === "Debug" && Object.isExtensible(value)) {
                value[proxy_debug_symbol] = `JS Error with JSHandle ${js_handle}`;
            }
            set_js_handle(arg, js_handle);
        }
    }
}
function marshal_js_object_to_cs(arg, value) {
    if (value === undefined || value === null) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
        set_arg_proxy_context(arg);
    }
    else {
        // if value was ManagedObject, it would be double proxied, but the C# signature requires that
        if (!(value[js_owned_gc_handle_symbol] === undefined)) throw new Error(`Assert failed: JSObject proxy of ManagedObject proxy is not supported. ${jsinteropDoc}`); // inlined mono_check
        if (!(typeof value === "function" || typeof value === "object")) throw new Error(`Assert failed: JSObject proxy of ${typeof value} is not supported`); // inlined mono_check
        set_arg_type(arg, 13 /* MarshalerType.JSObject */);
        const js_handle = mono_wasm_get_js_handle(value);
        if (BuildConfiguration === "Debug" && Object.isExtensible(value)) {
            value[proxy_debug_symbol] = `JS Object with JSHandle ${js_handle}`;
        }
        set_js_handle(arg, js_handle);
    }
}
function marshal_cs_object_to_cs(arg, value) {
    if (value === undefined || value === null) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
        set_arg_proxy_context(arg);
    }
    else {
        const gc_handle = value[js_owned_gc_handle_symbol];
        const js_type = typeof (value);
        if (gc_handle === undefined) {
            if (js_type === "string" || js_type === "symbol") {
                set_arg_type(arg, 15 /* MarshalerType.String */);
                _marshal_string_to_cs_impl(arg, value);
            }
            else if (js_type === "number") {
                set_arg_type(arg, 10 /* MarshalerType.Double */);
                set_arg_f64(arg, value);
            }
            else if (js_type === "bigint") {
                // we do it because not all bigint values could fit into Int64
                throw new Error("NotImplementedException: bigint");
            }
            else if (js_type === "boolean") {
                set_arg_type(arg, 3 /* MarshalerType.Boolean */);
                set_arg_bool(arg, value);
            }
            else if (value instanceof Date) {
                set_arg_type(arg, 17 /* MarshalerType.DateTime */);
                set_arg_date(arg, value);
            }
            else if (value instanceof Error) {
                marshal_exception_to_cs(arg, value);
            }
            else if (value instanceof Uint8Array) {
                marshal_array_to_cs_impl(arg, value, 4 /* MarshalerType.Byte */);
            }
            else if (value instanceof Float64Array) {
                marshal_array_to_cs_impl(arg, value, 10 /* MarshalerType.Double */);
            }
            else if (value instanceof Int32Array) {
                marshal_array_to_cs_impl(arg, value, 7 /* MarshalerType.Int32 */);
            }
            else if (Array.isArray(value)) {
                marshal_array_to_cs_impl(arg, value, 14 /* MarshalerType.Object */);
            }
            else if (value instanceof Int16Array
                || value instanceof Int8Array
                || value instanceof Uint8ClampedArray
                || value instanceof Uint16Array
                || value instanceof Uint32Array
                || value instanceof Float32Array) {
                throw new Error("NotImplementedException: TypedArray");
            }
            else if (isThenable(value)) {
                marshal_task_to_cs(arg, value);
            }
            else if (value instanceof Span) {
                throw new Error("NotImplementedException: Span");
            }
            else if (js_type == "object") {
                const js_handle = mono_wasm_get_js_handle(value);
                set_arg_type(arg, 13 /* MarshalerType.JSObject */);
                if (BuildConfiguration === "Debug" && Object.isExtensible(value)) {
                    value[proxy_debug_symbol] = `JS Object with JSHandle ${js_handle}`;
                }
                set_js_handle(arg, js_handle);
            }
            else {
                throw new Error(`JSObject proxy is not supported for ${js_type} ${value}`);
            }
        }
        else {
            assert_not_disposed(value);
            if (value instanceof ArraySegment) {
                throw new Error("NotImplementedException: ArraySegment. " + jsinteropDoc);
            }
            else if (value instanceof ManagedError) {
                set_arg_type(arg, 16 /* MarshalerType.Exception */);
                set_gc_handle(arg, gc_handle);
            }
            else if (value instanceof ManagedObject) {
                set_arg_type(arg, 14 /* MarshalerType.Object */);
                set_gc_handle(arg, gc_handle);
            }
            else {
                throw new Error("NotImplementedException " + js_type + ". " + jsinteropDoc);
            }
        }
    }
}
function marshal_array_to_cs(arg, value, element_type) {
    if (!(!!element_type)) mono_assert(false, "Expected valid element_type parameter"); // inlined mono_assert condition
    marshal_array_to_cs_impl(arg, value, element_type);
}
function marshal_array_to_cs_impl(arg, value, element_type) {
    if (value === null || value === undefined) {
        set_arg_type(arg, 0 /* MarshalerType.None */);
    }
    else {
        const element_size = array_element_size(element_type);
        if (!(element_size != -1)) mono_assert(false, `Element type ${element_type} not supported`); // inlined mono_assert condition
        const length = value.length;
        const buffer_length = element_size * length;
        const buffer_ptr = malloc(buffer_length);
        if (element_type == 15 /* MarshalerType.String */) {
            if (!(Array.isArray(value))) throw new Error("Assert failed: Value is not an Array"); // inlined mono_check
            _zero_region(buffer_ptr, buffer_length);
            if (!WasmEnableJsInteropByValue) {
                if (!(!WasmEnableThreads)) mono_assert(false, "Marshaling strings by reference is not supported in multithreaded mode"); // inlined mono_assert condition
                wrapped_c_functions.mono_wasm_register_root(buffer_ptr, buffer_length, "marshal_array_to_cs");
            }
            for (let index = 0; index < length; index++) {
                const element_arg = get_arg(buffer_ptr, index);
                marshal_string_to_cs(element_arg, value[index]);
            }
        }
        else if (element_type == 14 /* MarshalerType.Object */) {
            if (!(Array.isArray(value))) throw new Error("Assert failed: Value is not an Array"); // inlined mono_check
            _zero_region(buffer_ptr, buffer_length);
            if (!WasmEnableJsInteropByValue) {
                if (!(!WasmEnableThreads)) mono_assert(false, "Marshaling objects by reference is not supported in multithreaded mode"); // inlined mono_assert condition
                wrapped_c_functions.mono_wasm_register_root(buffer_ptr, buffer_length, "marshal_array_to_cs");
            }
            for (let index = 0; index < length; index++) {
                const element_arg = get_arg(buffer_ptr, index);
                marshal_cs_object_to_cs(element_arg, value[index]);
            }
        }
        else if (element_type == 13 /* MarshalerType.JSObject */) {
            if (!(Array.isArray(value))) throw new Error("Assert failed: Value is not an Array"); // inlined mono_check
            _zero_region(buffer_ptr, buffer_length);
            for (let index = 0; index < length; index++) {
                const element_arg = get_arg(buffer_ptr, index);
                marshal_js_object_to_cs(element_arg, value[index]);
            }
        }
        else if (element_type == 4 /* MarshalerType.Byte */) {
            if (!(Array.isArray(value) || value instanceof Uint8Array)) throw new Error("Assert failed: Value is not an Array or Uint8Array"); // inlined mono_check
            const targetView = localHeapViewU8().subarray(buffer_ptr, buffer_ptr + length);
            targetView.set(value);
        }
        else if (element_type == 7 /* MarshalerType.Int32 */) {
            if (!(Array.isArray(value) || value instanceof Int32Array)) throw new Error("Assert failed: Value is not an Array or Int32Array"); // inlined mono_check
            const bufferOffset = fixupPointer(buffer_ptr, 2);
            const targetView = localHeapViewI32().subarray(bufferOffset, bufferOffset + length);
            targetView.set(value);
        }
        else if (element_type == 10 /* MarshalerType.Double */) {
            if (!(Array.isArray(value) || value instanceof Float64Array)) throw new Error("Assert failed: Value is not an Array or Float64Array"); // inlined mono_check
            const bufferOffset = fixupPointer(buffer_ptr, 3);
            const targetView = localHeapViewF64().subarray(bufferOffset, bufferOffset + length);
            targetView.set(value);
        }
        else {
            throw new Error("not implemented");
        }
        set_arg_intptr(arg, buffer_ptr);
        set_arg_type(arg, 21 /* MarshalerType.Array */);
        set_arg_element_type(arg, element_type);
        set_arg_length(arg, value.length);
    }
}
function _marshal_span_to_cs(arg, value, element_type) {
    if (!(!!element_type)) mono_assert(false, "Expected valid element_type parameter"); // inlined mono_assert condition
    if (!(!value.isDisposed)) throw new Error("Assert failed: ObjectDisposedException"); // inlined mono_check
    checkViewType(element_type, value._viewType);
    set_arg_type(arg, 23 /* MarshalerType.Span */);
    set_arg_intptr(arg, value._pointer);
    set_arg_length(arg, value.length);
}
// this only supports round-trip
function _marshal_array_segment_to_cs(arg, value, element_type) {
    if (!(!!element_type)) mono_assert(false, "Expected valid element_type parameter"); // inlined mono_assert condition
    const gc_handle = assert_not_disposed(value);
    if (!(gc_handle)) mono_assert(false, "Only roundtrip of ArraySegment instance created by C#"); // inlined mono_assert condition
    checkViewType(element_type, value._viewType);
    set_arg_type(arg, 22 /* MarshalerType.ArraySegment */);
    set_arg_intptr(arg, value._pointer);
    set_arg_length(arg, value.length);
    set_gc_handle(arg, gc_handle);
}
function checkViewType(element_type, viewType) {
    if (element_type == 4 /* MarshalerType.Byte */) {
        if (!(0 /* MemoryViewType.Byte */ == viewType)) throw new Error("Assert failed: Expected MemoryViewType.Byte"); // inlined mono_check
    }
    else if (element_type == 7 /* MarshalerType.Int32 */) {
        if (!(1 /* MemoryViewType.Int32 */ == viewType)) throw new Error("Assert failed: Expected MemoryViewType.Int32"); // inlined mono_check
    }
    else if (element_type == 10 /* MarshalerType.Double */) {
        if (!(2 /* MemoryViewType.Double */ == viewType)) throw new Error("Assert failed: Expected MemoryViewType.Double"); // inlined mono_check
    }
    else {
        throw new Error(`NotImplementedException ${element_type} `);
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const dummyPerformance = {
    now: function () {
        return Date.now();
    }
};
function initializeReplacements(replacements) {
    // performance.now() is used by emscripten and doesn't work in JSC
    if (typeof globalThis.performance === "undefined") {
        globalThis.performance = dummyPerformance;
    }
    replacements.require = INTERNAL.require;
    // script location
    replacements.scriptDirectory = loaderHelpers.scriptDirectory;
    if (Module.locateFile === Module.__locateFile) {
        Module.locateFile = loaderHelpers.locateFile;
    }
    // prefer fetch_like over global fetch for assets
    replacements.fetch = loaderHelpers.fetch_like;
    // misc
    replacements.ENVIRONMENT_IS_WORKER = ENVIRONMENT_IS_WORKER;
    // threads
    if (WasmEnableThreads && replacements.modulePThread) {
        if (ENVIRONMENT_IS_WORKER) {
            replaceEmscriptenTLSInit(replacements.modulePThread);
        }
        else {
            replaceEmscriptenPThreadUI(replacements.modulePThread);
        }
    }
}
async function init_polyfills_async() {
    var _a;
    // v8 shell doesn't have Event and EventTarget
    if (WasmEnableThreads && typeof globalThis.Event === "undefined") {
        globalThis.Event = class Event {
            constructor(type) {
                this.type = type;
            }
        };
    }
    if (WasmEnableThreads && typeof globalThis.EventTarget === "undefined") {
        globalThis.EventTarget = class EventTarget {
            constructor() {
                this.subscribers = new Map();
            }
            addEventListener(type, listener, options) {
                if (listener === undefined || listener == null)
                    return;
                let oneShot = false;
                if (options !== undefined) {
                    for (const [k, v] of Object.entries(options)) {
                        if (k === "once") {
                            oneShot = v ? true : false;
                            continue;
                        }
                        throw new Error(`FIXME: addEventListener polyfill doesn't implement option '${k}'`);
                    }
                }
                if (!this.subscribers.has(type)) {
                    this.subscribers.set(type, []);
                }
                const listeners = this.subscribers.get(type);
                if (listeners === undefined) {
                    throw new Error("can't happen");
                }
                listeners.push({ listener, oneShot });
            }
            removeEventListener(type, listener, options) {
                if (listener === undefined || listener == null)
                    return;
                if (options !== undefined) {
                    throw new Error("FIXME: removeEventListener polyfill doesn't implement options");
                }
                if (!this.subscribers.has(type)) {
                    return;
                }
                const subscribers = this.subscribers.get(type);
                if (subscribers === undefined)
                    return;
                let index = -1;
                const n = subscribers.length;
                for (let i = 0; i < n; ++i) {
                    if (subscribers[i].listener === listener) {
                        index = i;
                        break;
                    }
                }
                if (index > -1) {
                    subscribers.splice(index, 1);
                }
            }
            dispatchEvent(event) {
                if (!this.subscribers.has(event.type)) {
                    return true;
                }
                let subscribers = this.subscribers.get(event.type);
                if (subscribers === undefined) {
                    return true;
                }
                let needsCopy = false;
                for (const sub of subscribers) {
                    if (sub.oneShot) {
                        needsCopy = true;
                        break;
                    }
                }
                if (needsCopy) {
                    subscribers = subscribers.slice(0);
                }
                for (const sub of subscribers) {
                    const listener = sub.listener;
                    if (sub.oneShot) {
                        this.removeEventListener(event.type, listener);
                    }
                    if (typeof listener === "function") {
                        listener.call(this, event);
                    }
                    else {
                        listener.handleEvent(event);
                    }
                }
                return true;
            }
        };
    }
    if (ENVIRONMENT_IS_NODE) {
        // wait for locateFile setup on NodeJs
        if (globalThis.performance === dummyPerformance) {
            const { performance } = INTERNAL.require("perf_hooks");
            globalThis.performance = performance;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore:
        INTERNAL.process = await import(/*! webpackIgnore: true */ 'process');
        if (!globalThis.crypto) {
            globalThis.crypto = {};
        }
        if (!globalThis.crypto.getRandomValues) {
            let nodeCrypto = undefined;
            try {
                nodeCrypto = INTERNAL.require("node:crypto");
            }
            catch (err) {
                // Noop, error throwing polyfill provided bellow
            }
            if (!nodeCrypto) {
                globalThis.crypto.getRandomValues = () => {
                    throw new Error("Using node without crypto support. To enable current operation, either provide polyfill for 'globalThis.crypto.getRandomValues' or enable 'node:crypto' module.");
                };
            }
            else if (nodeCrypto.webcrypto) {
                globalThis.crypto = nodeCrypto.webcrypto;
            }
            else if (nodeCrypto.randomBytes) {
                globalThis.crypto.getRandomValues = (buffer) => {
                    if (buffer) {
                        buffer.set(nodeCrypto.randomBytes(buffer.length));
                    }
                };
            }
        }
    }
    runtimeHelpers.subtle = (_a = globalThis.crypto) === null || _a === void 0 ? void 0 : _a.subtle;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function verifyEnvironment$1() {
    if (typeof globalThis.fetch !== "function" || typeof globalThis.AbortController !== "function") {
        const message = ENVIRONMENT_IS_NODE
            ? "Please install `node-fetch` and `node-abort-controller` npm packages to enable HTTP client support. See also https://aka.ms/dotnet-wasm-features"
            : "This browser doesn't support fetch API. Please use a modern browser. See also https://aka.ms/dotnet-wasm-features";
        throw new Error(message);
    }
}
function commonAsserts(controller) {
    assert_js_interop();
    if (!(controller)) mono_assert(false, "expected controller"); // inlined mono_assert condition
}
function http_wasm_supports_streaming_request() {
    // Detecting streaming request support works like this:
    // If the browser doesn't support a particular body type, it calls toString() on the object and uses the result as the body.
    // So, if the browser doesn't support request streams, the request body becomes the string "[object ReadableStream]".
    // When a string is used as a body, it conveniently sets the Content-Type header to text/plain;charset=UTF-8.
    // So, if that header is set, then we know the browser doesn't support streams in request objects, and we can exit early.
    // Safari does support streams in request objects, but doesn't allow them to be used with fetch, so the duplex option is tested, which Safari doesn't currently support.
    // See https://developer.chrome.com/articles/fetch-streaming-requests/
    if (typeof Request !== "undefined" && "body" in Request.prototype && typeof ReadableStream === "function" && typeof TransformStream === "function") {
        let duplexAccessed = false;
        const hasContentType = new Request("", {
            body: new ReadableStream(),
            method: "POST",
            get duplex() {
                duplexAccessed = true;
                return "half";
            },
        } /* https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1483 */).headers.has("Content-Type");
        return duplexAccessed && !hasContentType;
    }
    return false;
}
function http_wasm_supports_streaming_response() {
    return typeof Response !== "undefined" && "body" in Response.prototype && typeof ReadableStream === "function";
}
function http_wasm_create_controller() {
    verifyEnvironment$1();
    assert_js_interop();
    const controller = {
        abortController: new AbortController()
    };
    return controller;
}
function mute_unhandledrejection(promise) {
    promise.catch((err) => {
        if (err && err !== "AbortError" && err.name !== "AbortError") {
            mono_log_debug("http muted: " + err);
        }
    });
}
function http_wasm_abort(controller) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    try {
        if (!controller.isAborted) {
            if (controller.streamWriter) {
                mute_unhandledrejection(controller.streamWriter.abort());
                controller.isAborted = true;
            }
            if (controller.streamReader) {
                mute_unhandledrejection(controller.streamReader.cancel());
                controller.isAborted = true;
            }
        }
        if (!controller.isAborted && !controller.abortController.signal.aborted) {
            controller.abortController.abort("AbortError");
        }
    }
    catch (err) {
        // ignore
    }
}
function http_wasm_transform_stream_write(controller, bufferPtr, bufferLength) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    if (!(bufferLength > 0)) mono_assert(false, "expected bufferLength > 0"); // inlined mono_assert condition
    // the bufferPtr is pinned by the caller
    const view = new Span(bufferPtr, bufferLength, 0 /* MemoryViewType.Byte */);
    const copy = view.slice();
    return wrap_as_cancelable_promise(async () => {
        if (!(controller.streamWriter)) mono_assert(false, "expected streamWriter"); // inlined mono_assert condition
        if (!(controller.responsePromise)) mono_assert(false, "expected fetch promise"); // inlined mono_assert condition
        try {
            await controller.streamWriter.ready;
            await controller.streamWriter.write(copy);
        }
        catch (ex) {
            throw new Error("BrowserHttpWriteStream.Rejected");
        }
    });
}
function http_wasm_transform_stream_close(controller) {
    if (!(controller)) mono_assert(false, "expected controller"); // inlined mono_assert condition
    return wrap_as_cancelable_promise(async () => {
        if (!(controller.streamWriter)) mono_assert(false, "expected streamWriter"); // inlined mono_assert condition
        if (!(controller.responsePromise)) mono_assert(false, "expected fetch promise"); // inlined mono_assert condition
        try {
            await controller.streamWriter.ready;
            await controller.streamWriter.close();
        }
        catch (ex) {
            throw new Error("BrowserHttpWriteStream.Rejected");
        }
    });
}
function http_wasm_fetch_stream(controller, url, header_names, header_values, option_names, option_values) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    const transformStream = new TransformStream();
    controller.streamWriter = transformStream.writable.getWriter();
    mute_unhandledrejection(controller.streamWriter.closed);
    mute_unhandledrejection(controller.streamWriter.ready);
    const fetch_promise = http_wasm_fetch(controller, url, header_names, header_values, option_names, option_values, transformStream.readable);
    return fetch_promise;
}
function http_wasm_fetch_bytes(controller, url, header_names, header_values, option_names, option_values, bodyPtr, bodyLength) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    // the bodyPtr is pinned by the caller
    const view = new Span(bodyPtr, bodyLength, 0 /* MemoryViewType.Byte */);
    const copy = view.slice();
    return http_wasm_fetch(controller, url, header_names, header_values, option_names, option_values, copy);
}
function http_wasm_fetch(controller, url, header_names, header_values, option_names, option_values, body) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    verifyEnvironment$1();
    assert_js_interop();
    if (!(url && typeof url === "string")) mono_assert(false, "expected url string"); // inlined mono_assert condition
    if (!(header_names && header_values && Array.isArray(header_names) && Array.isArray(header_values) && header_names.length === header_values.length)) mono_assert(false, "expected headerNames and headerValues arrays"); // inlined mono_assert condition
    if (!(option_names && option_values && Array.isArray(option_names) && Array.isArray(option_values) && option_names.length === option_values.length)) mono_assert(false, "expected headerNames and headerValues arrays"); // inlined mono_assert condition
    const headers = new Headers();
    for (let i = 0; i < header_names.length; i++) {
        headers.append(header_names[i], header_values[i]);
    }
    const options = {
        body,
        headers,
        signal: controller.abortController.signal
    };
    if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream) {
        options.duplex = "half";
    }
    for (let i = 0; i < option_names.length; i++) {
        options[option_names[i]] = option_values[i];
    }
    // make the fetch cancellable
    controller.responsePromise = wrap_as_cancelable_promise(() => {
        return loaderHelpers.fetch_like(url, options).then((res) => {
            controller.response = res;
            return null; // drop the response from the promise chain
        });
    });
    // avoid processing headers if the fetch is canceled
    controller.responsePromise.then(() => {
        if (!(controller.response)) mono_assert(false, "expected response"); // inlined mono_assert condition
        controller.responseHeaderNames = [];
        controller.responseHeaderValues = [];
        if (controller.response.headers && controller.response.headers.entries) {
            const entries = controller.response.headers.entries();
            for (const pair of entries) {
                controller.responseHeaderNames.push(pair[0]);
                controller.responseHeaderValues.push(pair[1]);
            }
        }
    }).catch(() => {
        // ignore
    });
    return controller.responsePromise;
}
function http_wasm_get_response_type(controller) {
    var _a;
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    return (_a = controller.response) === null || _a === void 0 ? void 0 : _a.type;
}
function http_wasm_get_response_status(controller) {
    var _a, _b;
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    return (_b = (_a = controller.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 0;
}
function http_wasm_get_response_header_names(controller) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    if (!(controller.responseHeaderNames)) mono_assert(false, "expected responseHeaderNames"); // inlined mono_assert condition
    return controller.responseHeaderNames;
}
function http_wasm_get_response_header_values(controller) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    if (!(controller.responseHeaderValues)) mono_assert(false, "expected responseHeaderValues"); // inlined mono_assert condition
    return controller.responseHeaderValues;
}
function http_wasm_get_response_length(controller) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    return wrap_as_cancelable_promise(async () => {
        const buffer = await controller.response.arrayBuffer();
        controller.responseBuffer = buffer;
        controller.currentBufferOffset = 0;
        return buffer.byteLength;
    });
}
function http_wasm_get_response_bytes(controller, view) {
    if (!(controller)) mono_assert(false, "expected controller"); // inlined mono_assert condition
    if (!(controller.responseBuffer)) mono_assert(false, "expected resoved arrayBuffer"); // inlined mono_assert condition
    if (!(controller.currentBufferOffset != undefined)) mono_assert(false, "expected currentBufferOffset"); // inlined mono_assert condition
    if (controller.currentBufferOffset == controller.responseBuffer.byteLength) {
        return 0;
    }
    const source_view = new Uint8Array(controller.responseBuffer, controller.currentBufferOffset);
    view.set(source_view, 0);
    const bytes_read = Math.min(view.byteLength, source_view.byteLength);
    controller.currentBufferOffset += bytes_read;
    return bytes_read;
}
function http_wasm_get_streamed_response_bytes(controller, bufferPtr, bufferLength) {
    if (BuildConfiguration === "Debug")
        commonAsserts(controller);
    // the bufferPtr is pinned by the caller
    const view = new Span(bufferPtr, bufferLength, 0 /* MemoryViewType.Byte */);
    return wrap_as_cancelable_promise(async () => {
        await controller.responsePromise;
        if (!(controller.response)) mono_assert(false, "expected response"); // inlined mono_assert condition
        if (!controller.response.body) {
            // in FF when the verb is HEAD, the body is null
            return 0;
        }
        if (!controller.streamReader) {
            controller.streamReader = controller.response.body.getReader();
            mute_unhandledrejection(controller.streamReader.closed);
        }
        if (!controller.currentStreamReaderChunk || controller.currentBufferOffset === undefined) {
            controller.currentStreamReaderChunk = await controller.streamReader.read();
            controller.currentBufferOffset = 0;
        }
        if (controller.currentStreamReaderChunk.done) {
            if (controller.isAborted) {
                throw new Error("OperationCanceledException");
            }
            return 0;
        }
        const remaining_source = controller.currentStreamReaderChunk.value.byteLength - controller.currentBufferOffset;
        if (!(remaining_source > 0)) mono_assert(false, "expected remaining_source to be greater than 0"); // inlined mono_assert condition
        const bytes_copied = Math.min(remaining_source, view.byteLength);
        const source_view = controller.currentStreamReaderChunk.value.subarray(controller.currentBufferOffset, controller.currentBufferOffset + bytes_copied);
        view.set(source_view, 0);
        controller.currentBufferOffset += bytes_copied;
        if (remaining_source == bytes_copied) {
            controller.currentStreamReaderChunk = undefined;
        }
        return bytes_copied;
    });
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let spread_timers_maximum = 0;
function prevent_timer_throttling() {
    if (WasmEnableThreads)
        return;
    if (!loaderHelpers.isChromium) {
        return;
    }
    // this will schedule timers every second for next 6 minutes, it should be called from WebSocket event, to make it work
    // on next call, it would only extend the timers to cover yet uncovered future
    const now = new Date().valueOf();
    const desired_reach_time = now + (1000 * 60 * 6);
    const next_reach_time = Math.max(now + 1000, spread_timers_maximum);
    const light_throttling_frequency = 1000;
    for (let schedule = next_reach_time; schedule < desired_reach_time; schedule += light_throttling_frequency) {
        const delay = schedule - now;
        globalThis.setTimeout(prevent_timer_throttling_tick, delay);
    }
    spread_timers_maximum = desired_reach_time;
}
function prevent_timer_throttling_tick() {
    if (WasmEnableThreads)
        return;
    Module.maybeExit();
    if (!loaderHelpers.is_runtime_running()) {
        return;
    }
    try {
        wrapped_c_functions.mono_wasm_execute_timer();
    }
    catch (ex) {
        loaderHelpers.mono_exit(1, ex);
    }
    mono_background_exec_until_done();
}
function mono_background_exec_until_done() {
    if (WasmEnableThreads)
        return;
    lastScheduledBackground = undefined;
    Module.maybeExit();
    if (!loaderHelpers.is_runtime_running()) {
        return;
    }
    try {
        wrapped_c_functions.mono_background_exec();
    }
    catch (ex) {
        loaderHelpers.mono_exit(1, ex);
    }
}
let lastScheduledBackground = undefined;
function schedule_background_exec() {
    if (WasmEnableThreads)
        return;
    if (!lastScheduledBackground) {
        lastScheduledBackground = Module.safeSetTimeout(mono_background_exec_until_done, 0);
    }
}
let lastScheduledTimeoutId = undefined;
function mono_wasm_schedule_timer(shortestDueTimeMs) {
    if (WasmEnableThreads)
        return;
    if (lastScheduledTimeoutId) {
        globalThis.clearTimeout(lastScheduledTimeoutId);
        lastScheduledTimeoutId = undefined;
    }
    lastScheduledTimeoutId = Module.safeSetTimeout(mono_wasm_schedule_timer_tick, shortestDueTimeMs);
}
function mono_wasm_schedule_timer_tick() {
    if (WasmEnableThreads)
        return;
    Module.maybeExit();
    forceThreadMemoryViewRefresh();
    if (!loaderHelpers.is_runtime_running()) {
        return;
    }
    lastScheduledTimeoutId = undefined;
    try {
        wrapped_c_functions.mono_wasm_execute_timer();
    }
    catch (ex) {
        loaderHelpers.mono_exit(1, ex);
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
class Queue {
    constructor() {
        this.queue = [];
        this.offset = 0;
    }
    // initialise the queue and offset
    // Returns the length of the queue.
    getLength() {
        return (this.queue.length - this.offset);
    }
    // Returns true if the queue is empty, and false otherwise.
    isEmpty() {
        return (this.queue.length == 0);
    }
    /* Enqueues the specified item. The parameter is:
    *
    * item - the item to enqueue
    */
    enqueue(item) {
        this.queue.push(item);
    }
    /* Dequeues an item and returns it. If the queue is empty, the value
    * 'undefined' is returned.
    */
    dequeue() {
        // if the queue is empty, return immediately
        if (this.queue.length === 0)
            return undefined;
        // store the item at the front of the queue
        const item = this.queue[this.offset];
        // for GC's sake
        this.queue[this.offset] = null;
        // increment the offset and remove the free space if necessary
        if (++this.offset * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset);
            this.offset = 0;
        }
        // return the dequeued item
        return item;
    }
    /* Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     */
    peek() {
        return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
    }
    drain(onEach) {
        while (this.getLength()) {
            const item = this.dequeue();
            onEach(item);
        }
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const wasm_ws_pending_send_buffer = Symbol.for("wasm ws_pending_send_buffer");
const wasm_ws_pending_send_buffer_offset = Symbol.for("wasm ws_pending_send_buffer_offset");
const wasm_ws_pending_send_buffer_type = Symbol.for("wasm ws_pending_send_buffer_type");
const wasm_ws_pending_receive_event_queue = Symbol.for("wasm ws_pending_receive_event_queue");
const wasm_ws_pending_receive_promise_queue = Symbol.for("wasm ws_pending_receive_promise_queue");
const wasm_ws_pending_open_promise = Symbol.for("wasm ws_pending_open_promise");
const wasm_ws_pending_open_promise_used = Symbol.for("wasm wasm_ws_pending_open_promise_used");
const wasm_ws_pending_error = Symbol.for("wasm wasm_ws_pending_error");
const wasm_ws_pending_close_promises = Symbol.for("wasm ws_pending_close_promises");
const wasm_ws_pending_send_promises = Symbol.for("wasm ws_pending_send_promises");
const wasm_ws_is_aborted = Symbol.for("wasm ws_is_aborted");
const wasm_ws_close_sent = Symbol.for("wasm wasm_ws_close_sent");
const wasm_ws_close_received = Symbol.for("wasm wasm_ws_close_received");
const wasm_ws_receive_status_ptr = Symbol.for("wasm ws_receive_status_ptr");
const ws_send_buffer_blocking_threshold = 65536;
const emptyBuffer = new Uint8Array();
function verifyEnvironment() {
    if (ENVIRONMENT_IS_SHELL) {
        throw new Error("WebSockets are not supported in shell JS engine.");
    }
    if (typeof globalThis.WebSocket !== "function") {
        const message = ENVIRONMENT_IS_NODE
            ? "Please install `ws` npm package to enable networking support. See also https://aka.ms/dotnet-wasm-features"
            : "This browser doesn't support WebSocket API. Please use a modern browser. See also https://aka.ms/dotnet-wasm-features";
        throw new Error(message);
    }
}
function ws_get_state(ws) {
    var _a, _b;
    if (ws.readyState != WebSocket.CLOSED)
        return (_a = ws.readyState) !== null && _a !== void 0 ? _a : -1;
    const receive_event_queue = ws[wasm_ws_pending_receive_event_queue];
    const queued_events_count = receive_event_queue.getLength();
    if (queued_events_count == 0)
        return (_b = ws.readyState) !== null && _b !== void 0 ? _b : -1;
    return WebSocket.OPEN;
}
function ws_wasm_create(uri, sub_protocols, receive_status_ptr) {
    verifyEnvironment();
    assert_js_interop();
    if (!(uri && typeof uri === "string")) mono_assert(false, `ERR12: Invalid uri ${typeof uri}`); // inlined mono_assert condition
    let ws;
    try {
        ws = new globalThis.WebSocket(uri, sub_protocols || undefined);
    }
    catch (error) {
        mono_log_warn("WebSocket error in ws_wasm_create: " + error.toString());
        throw error;
    }
    const { promise_control: open_promise_control } = createPromiseController();
    ws[wasm_ws_pending_receive_event_queue] = new Queue();
    ws[wasm_ws_pending_receive_promise_queue] = new Queue();
    ws[wasm_ws_pending_open_promise] = open_promise_control;
    ws[wasm_ws_pending_send_promises] = [];
    ws[wasm_ws_pending_close_promises] = [];
    ws[wasm_ws_receive_status_ptr] = receive_status_ptr;
    ws.binaryType = "arraybuffer";
    const local_on_open = () => {
        try {
            if (ws[wasm_ws_is_aborted])
                return;
            if (!loaderHelpers.is_runtime_running())
                return;
            forceThreadMemoryViewRefresh();
            open_promise_control.resolve(ws);
            prevent_timer_throttling();
        }
        catch (error) {
            mono_log_warn("failed to propagate WebSocket open event: " + error.toString());
        }
    };
    const local_on_message = (ev) => {
        try {
            if (ws[wasm_ws_is_aborted])
                return;
            if (!loaderHelpers.is_runtime_running())
                return;
            forceThreadMemoryViewRefresh();
            web_socket_on_message(ws, ev);
            prevent_timer_throttling();
        }
        catch (error) {
            mono_log_warn("failed to propagate WebSocket message event: " + error.toString());
        }
    };
    const local_on_close = (ev) => {
        try {
            ws.removeEventListener("message", local_on_message);
            if (ws[wasm_ws_is_aborted])
                return;
            if (!loaderHelpers.is_runtime_running())
                return;
            forceThreadMemoryViewRefresh();
            ws[wasm_ws_close_received] = true;
            ws["close_status"] = ev.code;
            ws["close_status_description"] = ev.reason;
            if (ws[wasm_ws_pending_open_promise_used]) {
                open_promise_control.reject(new Error(ev.reason));
            }
            for (const close_promise_control of ws[wasm_ws_pending_close_promises]) {
                close_promise_control.resolve();
            }
            // send close to any pending receivers, to wake them
            const receive_promise_queue = ws[wasm_ws_pending_receive_promise_queue];
            receive_promise_queue.drain((receive_promise_control) => {
                setI32(receive_status_ptr, 0); // count
                setI32(receive_status_ptr + 4, 2); // type:close
                setI32(receive_status_ptr + 8, 1); // end_of_message: true
                receive_promise_control.resolve();
            });
        }
        catch (error) {
            mono_log_warn("failed to propagate WebSocket close event: " + error.toString());
        }
    };
    const local_on_error = (ev) => {
        try {
            if (ws[wasm_ws_is_aborted])
                return;
            if (!loaderHelpers.is_runtime_running())
                return;
            forceThreadMemoryViewRefresh();
            ws.removeEventListener("message", local_on_message);
            const message = ev.message
                ? "WebSocket error: " + ev.message
                : "WebSocket error";
            mono_log_warn(message);
            ws[wasm_ws_pending_error] = message;
            reject_promises(ws, new Error(message));
        }
        catch (error) {
            mono_log_warn("failed to propagate WebSocket error event: " + error.toString());
        }
    };
    ws.addEventListener("message", local_on_message);
    ws.addEventListener("open", local_on_open, { once: true });
    ws.addEventListener("close", local_on_close, { once: true });
    ws.addEventListener("error", local_on_error, { once: true });
    ws.dispose = () => {
        ws.removeEventListener("message", local_on_message);
        ws.removeEventListener("open", local_on_open);
        ws.removeEventListener("close", local_on_close);
        ws.removeEventListener("error", local_on_error);
        ws_wasm_abort(ws);
    };
    return ws;
}
function ws_wasm_open(ws) {
    if (!(!!ws)) mono_assert(false, "ERR17: expected ws instance"); // inlined mono_assert condition
    if (ws[wasm_ws_pending_error]) {
        return rejectedPromise(ws[wasm_ws_pending_error]);
    }
    const open_promise_control = ws[wasm_ws_pending_open_promise];
    ws[wasm_ws_pending_open_promise_used] = true;
    return open_promise_control.promise;
}
function ws_wasm_send(ws, buffer_ptr, buffer_length, message_type, end_of_message) {
    if (!(!!ws)) mono_assert(false, "ERR17: expected ws instance"); // inlined mono_assert condition
    if (ws[wasm_ws_pending_error]) {
        return rejectedPromise(ws[wasm_ws_pending_error]);
    }
    if (ws[wasm_ws_is_aborted] || ws[wasm_ws_close_sent]) {
        return rejectedPromise("InvalidState: The WebSocket is not connected.");
    }
    if (ws.readyState == WebSocket.CLOSED) {
        // this is server initiated close but not partial close
        // because CloseOutputAsync_ServerInitiated_CanSend expectations, we don't fail here
        return resolvedPromise();
    }
    const buffer_view = new Uint8Array(localHeapViewU8().buffer, buffer_ptr, buffer_length);
    const whole_buffer = web_socket_send_buffering(ws, buffer_view, message_type, end_of_message);
    if (!end_of_message || !whole_buffer) {
        return resolvedPromise();
    }
    return web_socket_send_and_wait(ws, whole_buffer);
}
function ws_wasm_receive(ws, buffer_ptr, buffer_length) {
    if (!(!!ws)) mono_assert(false, "ERR18: expected ws instance"); // inlined mono_assert condition
    if (ws[wasm_ws_pending_error]) {
        return rejectedPromise(ws[wasm_ws_pending_error]);
    }
    // we can't quickly return if wasm_ws_close_received==true, because there could be pending messages
    if (ws[wasm_ws_is_aborted]) {
        const receive_status_ptr = ws[wasm_ws_receive_status_ptr];
        setI32(receive_status_ptr, 0); // count
        setI32(receive_status_ptr + 4, 2); // type:close
        setI32(receive_status_ptr + 8, 1); // end_of_message: true
        return resolvedPromise();
    }
    const receive_event_queue = ws[wasm_ws_pending_receive_event_queue];
    const receive_promise_queue = ws[wasm_ws_pending_receive_promise_queue];
    if (receive_event_queue.getLength()) {
        if (!(receive_promise_queue.getLength() == 0)) mono_assert(false, "ERR20: Invalid WS state"); // inlined mono_assert condition
        web_socket_receive_buffering(ws, receive_event_queue, buffer_ptr, buffer_length);
        return resolvedPromise();
    }
    if (ws[wasm_ws_close_received]) {
        const receive_status_ptr = ws[wasm_ws_receive_status_ptr];
        setI32(receive_status_ptr, 0); // count
        setI32(receive_status_ptr + 4, 2); // type:close
        setI32(receive_status_ptr + 8, 1); // end_of_message: true
        return resolvedPromise();
    }
    const { promise, promise_control } = createPromiseController();
    const receive_promise_control = promise_control;
    receive_promise_control.buffer_ptr = buffer_ptr;
    receive_promise_control.buffer_length = buffer_length;
    receive_promise_queue.enqueue(receive_promise_control);
    return promise;
}
function ws_wasm_close(ws, code, reason, wait_for_close_received) {
    if (!(!!ws)) mono_assert(false, "ERR19: expected ws instance"); // inlined mono_assert condition
    if (ws[wasm_ws_is_aborted] || ws[wasm_ws_close_sent] || ws.readyState == WebSocket.CLOSED) {
        return resolvedPromise();
    }
    if (ws[wasm_ws_pending_error]) {
        return rejectedPromise(ws[wasm_ws_pending_error]);
    }
    ws[wasm_ws_close_sent] = true;
    if (wait_for_close_received) {
        const { promise, promise_control } = createPromiseController();
        ws[wasm_ws_pending_close_promises].push(promise_control);
        if (typeof reason === "string") {
            ws.close(code, reason);
        }
        else {
            ws.close(code);
        }
        return promise;
    }
    else {
        if (typeof reason === "string") {
            ws.close(code, reason);
        }
        else {
            ws.close(code);
        }
        return resolvedPromise();
    }
}
function ws_wasm_abort(ws) {
    if (!(!!ws)) mono_assert(false, "ERR18: expected ws instance"); // inlined mono_assert condition
    if (ws[wasm_ws_is_aborted] || ws[wasm_ws_close_sent]) {
        return;
    }
    ws[wasm_ws_is_aborted] = true;
    reject_promises(ws, new Error("OperationCanceledException"));
    try {
        // this is different from Managed implementation
        ws.close(1000, "Connection was aborted.");
    }
    catch (error) {
        mono_log_warn("WebSocket error in ws_wasm_abort: " + error.toString());
    }
}
function reject_promises(ws, error) {
    const open_promise_control = ws[wasm_ws_pending_open_promise];
    const open_promise_used = ws[wasm_ws_pending_open_promise_used];
    // when `open_promise_used` is false, we should not reject it,
    // because it would be unhandled rejection. Nobody is subscribed yet.
    // The subscription comes on the next call, which is `ws_wasm_open`, but cancelation/abort could happen in the meantime.
    if (open_promise_control && open_promise_used) {
        open_promise_control.reject(error);
    }
    for (const close_promise_control of ws[wasm_ws_pending_close_promises]) {
        close_promise_control.reject(error);
    }
    for (const send_promise_control of ws[wasm_ws_pending_send_promises]) {
        send_promise_control.reject(error);
    }
    ws[wasm_ws_pending_receive_promise_queue].drain(receive_promise_control => {
        receive_promise_control.reject(error);
    });
}
// send and return promise
function web_socket_send_and_wait(ws, buffer_view) {
    ws.send(buffer_view);
    ws[wasm_ws_pending_send_buffer] = null;
    // if the remaining send buffer is small, we don't block so that the throughput doesn't suffer.
    // Otherwise we block so that we apply some backpresure to the application sending large data.
    // this is different from Managed implementation
    if (ws.bufferedAmount < ws_send_buffer_blocking_threshold) {
        return resolvedPromise();
    }
    // block the promise/task until the browser passed the buffer to OS
    const { promise, promise_control } = createPromiseController();
    const pending = ws[wasm_ws_pending_send_promises];
    pending.push(promise_control);
    let nextDelay = 1;
    const polling_check = () => {
        try {
            // was it all sent yet ?
            if (ws.bufferedAmount === 0) {
                promise_control.resolve();
            }
            else {
                const readyState = ws.readyState;
                if (readyState != WebSocket.OPEN && readyState != WebSocket.CLOSING) {
                    // only reject if the data were not sent
                    // bufferedAmount does not reset to zero once the connection closes
                    promise_control.reject(new Error(`InvalidState: ${readyState} The WebSocket is not connected.`));
                }
                else if (!promise_control.isDone) {
                    globalThis.setTimeout(polling_check, nextDelay);
                    // exponentially longer delays, up to 1000ms
                    nextDelay = Math.min(nextDelay * 1.5, 1000);
                    return;
                }
            }
            // remove from pending
            const index = pending.indexOf(promise_control);
            if (index > -1) {
                pending.splice(index, 1);
            }
        }
        catch (error) {
            mono_log_warn("WebSocket error in web_socket_send_and_wait: " + error.toString());
            promise_control.reject(error);
        }
    };
    globalThis.setTimeout(polling_check, 0);
    return promise;
}
function web_socket_on_message(ws, event) {
    const event_queue = ws[wasm_ws_pending_receive_event_queue];
    const promise_queue = ws[wasm_ws_pending_receive_promise_queue];
    if (typeof event.data === "string") {
        event_queue.enqueue({
            type: 0, // WebSocketMessageType.Text
            // according to the spec https://encoding.spec.whatwg.org/
            // - Unpaired surrogates will get replaced with 0xFFFD
            // - utf8 encode specifically is defined to never throw
            data: stringToUTF8(event.data),
            offset: 0
        });
    }
    else {
        if (event.data.constructor.name !== "ArrayBuffer") {
            throw new Error("ERR19: WebSocket receive expected ArrayBuffer");
        }
        event_queue.enqueue({
            type: 1, // WebSocketMessageType.Binary
            data: new Uint8Array(event.data),
            offset: 0
        });
    }
    if (promise_queue.getLength() && event_queue.getLength() > 1) {
        throw new Error("ERR21: Invalid WS state"); // assert
    }
    while (promise_queue.getLength() && event_queue.getLength()) {
        const promise_control = promise_queue.dequeue();
        web_socket_receive_buffering(ws, event_queue, promise_control.buffer_ptr, promise_control.buffer_length);
        promise_control.resolve();
    }
    prevent_timer_throttling();
}
function web_socket_receive_buffering(ws, event_queue, buffer_ptr, buffer_length) {
    const event = event_queue.peek();
    const count = Math.min(buffer_length, event.data.length - event.offset);
    if (count > 0) {
        const sourceView = event.data.subarray(event.offset, event.offset + count);
        const bufferView = new Uint8Array(localHeapViewU8().buffer, buffer_ptr, buffer_length);
        bufferView.set(sourceView, 0);
        event.offset += count;
    }
    const end_of_message = event.data.length === event.offset ? 1 : 0;
    if (end_of_message) {
        event_queue.dequeue();
    }
    const response_ptr = ws[wasm_ws_receive_status_ptr];
    setI32(response_ptr, count);
    setI32(response_ptr + 4, event.type);
    setI32(response_ptr + 8, end_of_message);
}
function web_socket_send_buffering(ws, buffer_view, message_type, end_of_message) {
    let buffer = ws[wasm_ws_pending_send_buffer];
    let offset = 0;
    const length = buffer_view.byteLength;
    if (buffer) {
        offset = ws[wasm_ws_pending_send_buffer_offset];
        // match desktop WebSocket behavior by copying message_type of the first part
        message_type = ws[wasm_ws_pending_send_buffer_type];
        // if not empty message, append to existing buffer
        if (length !== 0) {
            if (offset + length > buffer.length) {
                const newbuffer = new Uint8Array((offset + length + 50) * 1.5); // exponential growth
                newbuffer.set(buffer, 0); // copy previous buffer
                newbuffer.subarray(offset).set(buffer_view); // append copy at the end
                ws[wasm_ws_pending_send_buffer] = buffer = newbuffer;
            }
            else {
                buffer.subarray(offset).set(buffer_view); // append copy at the end
            }
            offset += length;
            ws[wasm_ws_pending_send_buffer_offset] = offset;
        }
    }
    else if (!end_of_message) {
        // create new buffer
        if (length !== 0) {
            buffer = buffer_view.slice(); // copy
            offset = length;
            ws[wasm_ws_pending_send_buffer_offset] = offset;
            ws[wasm_ws_pending_send_buffer] = buffer;
        }
        ws[wasm_ws_pending_send_buffer_type] = message_type;
    }
    else {
        if (length !== 0) {
            // we could use the un-pinned view, because it will be immediately used in ws.send()
            if (WasmEnableThreads) {
                buffer = buffer_view.slice(); // copy, because the provided ArrayBufferView value must not be shared.
            }
            else {
                buffer = buffer_view;
            }
            offset = length;
        }
    }
    // buffer was updated, do we need to trim and convert it to final format ?
    if (end_of_message) {
        if (offset == 0 || buffer == null) {
            return emptyBuffer;
        }
        if (message_type === 0) {
            // text, convert from UTF-8 bytes to string, because of bad browser API
            const bytes = viewOrCopy(buffer, 0, offset);
            // we do not validate outgoing data https://github.com/dotnet/runtime/issues/59214
            return utf8ToStringRelaxed(bytes);
        }
        else {
            // binary, view to used part of the buffer
            return buffer.subarray(0, offset);
        }
    }
    return null;
}
function resolvedPromise() {
    if (!WasmEnableThreads) {
        // signal that we are finished synchronously
        // this is optimization, which doesn't allocate and doesn't require to marshal resolve() call to C# side.
        return null;
    }
    else {
        // passing synchronous `null` as value of the result of the async JSImport function is not possible when there is message sent across threads.
        const resolved = Promise.resolve();
        // the C# code in the BrowserWebSocket expects that promise returned from this code is instance of `ControllablePromise`
        // so that C# side could call `mono_wasm_cancel_promise` on it.
        // in practice the `resolve()` callback would arrive before the `reject()` of the cancelation.
        return wrap_as_cancelable(resolved);
    }
}
function rejectedPromise(message) {
    const resolved = Promise.reject(new Error(message));
    return wrap_as_cancelable(resolved);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function mono_wasm_load_icu_data(offset) {
    if (!wrapped_c_functions.mono_wasm_load_icu_data(offset)) {
        throw new Error("Failed to load ICU data");
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// this need to be run only after onRuntimeInitialized event, when the memory is ready
function instantiate_asset(asset, url, bytes) {
    if (loaderHelpers.diagnosticTracing) mono_log_debug(`Loaded:${asset.name} as ${asset.behavior} size ${bytes.length} from ${url}`); // inlined mono_log_debug condition
    const mark = startMeasure();
    const virtualName = typeof (asset.virtualPath) === "string"
        ? asset.virtualPath
        : asset.name;
    let offset = null;
    switch (asset.behavior) {
        case "dotnetwasm":
        case "js-module-threads":
        case "js-module-diagnostics":
        case "symbols":
            // do nothing
            break;
        case "resource":
        case "assembly":
        case "pdb":
            loaderHelpers._loaded_files.push({ url: url, file: virtualName });
        // falls through
        case "heap":
        case "icu":
            offset = mono_wasm_load_bytes_into_heap_persistent(bytes);
            break;
        case "vfs": {
            // FIXME
            const lastSlash = virtualName.lastIndexOf("/");
            let parentDirectory = (lastSlash > 0)
                ? virtualName.substring(0, lastSlash)
                : null;
            let fileName = (lastSlash > 0)
                ? virtualName.substring(lastSlash + 1)
                : virtualName;
            if (fileName.startsWith("/"))
                fileName = fileName.substring(1);
            if (parentDirectory) {
                if (!parentDirectory.startsWith("/"))
                    parentDirectory = "/" + parentDirectory;
                mono_log_debug(`Creating directory '${parentDirectory}'`);
                Module.FS_createPath("/", parentDirectory, true, true // fixme: should canWrite be false?
                );
            }
            else {
                parentDirectory = "/";
            }
            if (loaderHelpers.diagnosticTracing) mono_log_debug(`Creating file '${fileName}' in directory '${parentDirectory}'`); // inlined mono_log_debug condition
            Module.FS_createDataFile(parentDirectory, fileName, bytes, true /* canRead */, true /* canWrite */, true /* canOwn */);
            break;
        }
        default:
            throw new Error(`Unrecognized asset behavior:${asset.behavior}, for asset ${asset.name}`);
    }
    if (asset.behavior === "assembly") {
        // this is reading flag inside the DLL about the existence of PDB
        // it doesn't relate to whether the .pdb file is downloaded at all
        const hasPdb = wrapped_c_functions.mono_wasm_add_assembly(virtualName, offset, bytes.length);
        if (!hasPdb) {
            const index = loaderHelpers._loaded_files.findIndex(element => element.file == virtualName);
            loaderHelpers._loaded_files.splice(index, 1);
        }
    }
    else if (asset.behavior === "pdb") {
        wrapped_c_functions.mono_wasm_add_assembly(virtualName, offset, bytes.length);
    }
    else if (asset.behavior === "icu") {
        mono_wasm_load_icu_data(offset);
    }
    else if (asset.behavior === "resource") {
        wrapped_c_functions.mono_wasm_add_satellite_assembly(virtualName, asset.culture || "", offset, bytes.length);
    }
    endMeasure(mark, "mono.instantiateAsset:" /* MeasuredBlock.instantiateAsset */, asset.name);
    ++loaderHelpers.actual_instantiated_assets_count;
}
async function instantiate_symbols_asset(pendingAsset) {
    try {
        const response = await pendingAsset.pendingDownloadInternal.response;
        const text = await response.text();
        parseSymbolMapFile(text);
    }
    catch (error) {
        mono_log_info(`Error loading symbol file ${pendingAsset.name}: ${JSON.stringify(error)}`);
    }
}
async function wait_for_all_assets() {
    // wait for all assets in memory
    await runtimeHelpers.allAssetsInMemory.promise;
    if (runtimeHelpers.config.assets) {
        if (!(loaderHelpers.actual_downloaded_assets_count == loaderHelpers.expected_downloaded_assets_count)) mono_assert(false, `Expected ${loaderHelpers.expected_downloaded_assets_count} assets to be downloaded, but only finished ${loaderHelpers.actual_downloaded_assets_count}`); // inlined mono_assert condition
        if (!(loaderHelpers.actual_instantiated_assets_count == loaderHelpers.expected_instantiated_assets_count)) mono_assert(false, `Expected ${loaderHelpers.expected_instantiated_assets_count} assets to be in memory, but only instantiated ${loaderHelpers.actual_instantiated_assets_count}`); // inlined mono_assert condition
        loaderHelpers._loaded_files.forEach(value => loaderHelpers.loadedFiles.push(value.url));
        if (loaderHelpers.diagnosticTracing) mono_log_debug("all assets are loaded in wasm memory"); // inlined mono_log_debug condition
    }
}
// Used by the debugger to enumerate loaded dlls and pdbs
function mono_wasm_get_loaded_files() {
    return loaderHelpers.loadedFiles;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const opcodeNameCache = {};
function getOpcodeName(opcode) {
    let result = opcodeNameCache[opcode];
    if (typeof (result) !== "string") {
        const pName = wrapped_c_functions.mono_jiterp_get_opcode_info(opcode, 0 /* OpcodeInfoType.Name */);
        opcodeNameCache[opcode] = result = utf8ToString(pName);
    }
    return result;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const maxFailures = 2, maxMemsetSize = 64, maxMemmoveSize = 64, shortNameBase = 36, 
// NOTE: This needs to be big enough to hold the maximum module size since there's no auto-growth
//  support yet. If that becomes a problem, we should just make it growable
blobBuilderCapacity = 24 * 1024, INT32_MIN = -2147483648;
const compressedNameCache = {};
class WasmBuilder {
    constructor(constantSlotCount) {
        this.locals = new Map();
        this.permanentFunctionTypeCount = 0;
        this.permanentFunctionTypes = {};
        this.permanentFunctionTypesByShape = {};
        this.permanentFunctionTypesByIndex = {};
        this.functionTypesByIndex = {};
        this.permanentImportedFunctionCount = 0;
        this.permanentImportedFunctions = {};
        this.nextImportIndex = 0;
        this.functions = [];
        this.estimatedExportBytes = 0;
        this.frame = 0;
        this.traceBuf = [];
        this.branchTargets = new Set();
        this.constantSlots = [];
        this.backBranchOffsets = [];
        this.callHandlerReturnAddresses = [];
        this.nextConstantSlot = 0;
        this.backBranchTraceLevel = 0;
        this.compressImportNames = false;
        this.lockImports = false;
        this._assignParameterIndices = (parms) => {
            let result = 0;
            for (const k in parms) {
                this.locals.set(k, result);
                // mono_log_info(`parm ${k} -> ${result}`);
                result++;
            }
            return result;
        };
        this.stack = [new BlobBuilder()];
        this.clear(constantSlotCount);
        this.cfg = new Cfg(this);
        this.defineType("__cpp_exception", { "ptr": 127 /* WasmValtype.i32 */ }, 64 /* WasmValtype.void */, true);
    }
    clear(constantSlotCount) {
        this.options = getOptions();
        if (this.options.maxModuleSize >= blobBuilderCapacity)
            throw new Error(`blobBuilderCapacity ${blobBuilderCapacity} is not large enough for jiterpreter-max-module-size of ${this.options.maxModuleSize}`);
        this.stackSize = 1;
        this.inSection = false;
        this.inFunction = false;
        this.lockImports = false;
        this.locals.clear();
        this.functionTypeCount = this.permanentFunctionTypeCount;
        this.functionTypes = Object.create(this.permanentFunctionTypes);
        this.functionTypesByShape = Object.create(this.permanentFunctionTypesByShape);
        this.functionTypesByIndex = Object.create(this.permanentFunctionTypesByIndex);
        this.nextImportIndex = 0;
        this.importedFunctionCount = 0;
        this.importedFunctions = Object.create(this.permanentImportedFunctions);
        for (const k in this.importedFunctions) {
            const f = this.importedFunctions[k];
            f.index = undefined;
        }
        this.functions.length = 0;
        this.estimatedExportBytes = 0;
        this.argumentCount = 0;
        this.current.clear();
        this.traceBuf.length = 0;
        this.branchTargets.clear();
        this.activeBlocks = 0;
        this.nextConstantSlot = 0;
        this.constantSlots.length = this.options.useConstants ? constantSlotCount : 0;
        for (let i = 0; i < this.constantSlots.length; i++)
            this.constantSlots[i] = 0;
        this.backBranchOffsets.length = 0;
        this.callHandlerReturnAddresses.length = 0;
        this.allowNullCheckOptimization = this.options.eliminateNullChecks;
        this.containsSimd = false;
        this.containsAtomics = false;
    }
    _push() {
        this.stackSize++;
        if (this.stackSize >= this.stack.length)
            this.stack.push(new BlobBuilder());
        this.current.clear();
    }
    _pop(writeToOutput) {
        if (this.stackSize <= 1)
            throw new Error("Stack empty");
        const current = this.current;
        this.stackSize--;
        if (writeToOutput) {
            this.appendULeb(current.size);
            current.copyTo(this.current);
            return null;
        }
        else
            return current.getArrayView(false).slice(0, current.size);
    }
    setImportFunction(name, value) {
        const imp = this.importedFunctions[name];
        if (!imp)
            throw new Error("No import named " + name);
        imp.func = value;
    }
    getExceptionTag() {
        const exceptionTag = Module["wasmExports"]["__cpp_exception"];
        if (typeof (exceptionTag) !== "undefined")
            if (!(exceptionTag instanceof WebAssembly.Tag)) mono_assert(false, `expected __cpp_exception export from dotnet.wasm to be WebAssembly.Tag but was ${exceptionTag}`); // inlined mono_assert condition
        return exceptionTag;
    }
    getWasmImports() {
        const memory = runtimeHelpers.getMemory();
        if (!(memory instanceof WebAssembly.Memory)) mono_assert(false, `expected heap import to be WebAssembly.Memory but was ${memory}`); // inlined mono_assert condition
        const exceptionTag = this.getExceptionTag();
        const result = {
            c: this.getConstants(),
            m: { h: memory },
        };
        if (exceptionTag)
            result.x = { e: exceptionTag };
        const importsToEmit = this.getImportsToEmit();
        for (let i = 0; i < importsToEmit.length; i++) {
            const ifi = importsToEmit[i];
            if (typeof (ifi.func) !== "function")
                throw new Error(`Import '${ifi.name}' not found or not a function`);
            const mangledName = this.getCompressedName(ifi);
            let subTable = result[ifi.module];
            if (!subTable) {
                subTable = result[ifi.module] = {};
            }
            subTable[mangledName] = ifi.func;
        }
        return result;
    }
    // HACK: Approximate amount of space we need to generate the full module at present
    // FIXME: This does not take into account any other functions already generated if they weren't
    //  emitted into the module immediately
    get bytesGeneratedSoFar() {
        const importSize = this.compressImportNames
            // mod (2 bytes) name (2-3 bytes) type (1 byte) typeidx (1-2 bytes)
            ? 8
            // we keep the uncompressed import names somewhat short, generally, so +12 bytes is about right
            : 20;
        return this.stack[0].size +
            // HACK: A random constant for section headers and padding
            32 +
            (this.importedFunctionCount * importSize) +
            // type index for each function
            (this.functions.length * 2) +
            // export entry for each export
            this.estimatedExportBytes;
    }
    get current() {
        return this.stack[this.stackSize - 1];
    }
    get size() {
        return this.current.size;
    }
    appendU8(value) {
        if ((value != value >>> 0) || (value > 255))
            throw new Error(`Byte out of range: ${value}`);
        return this.current.appendU8(value);
    }
    appendSimd(value, allowLoad) {
        this.current.appendU8(253 /* WasmOpcode.PREFIX_simd */);
        if (!(((value | 0) !== 0) || ((value === 0 /* WasmSimdOpcode.v128_load */) && (allowLoad === true)))) mono_assert(false, "Expected non-v128_load simd opcode or allowLoad==true"); // inlined mono_assert condition
        // Yes that's right. We're using LEB128 to encode 8-bit opcodes. Why? I don't know
        return this.current.appendULeb(value);
    }
    appendAtomic(value, allowNotify) {
        this.current.appendU8(254 /* WasmOpcode.PREFIX_atomic */);
        if (!(((value | 0) !== 0) || ((value === 0 /* WasmAtomicOpcode.memory_atomic_notify */) && (allowNotify === true)))) mono_assert(false, "Expected non-notify atomic opcode or allowNotify==true"); // inlined mono_assert condition
        // Unlike SIMD, the spec appears to say that atomic opcodes are just two sequential bytes with explicit values.
        return this.current.appendU8(value);
    }
    appendU32(value) {
        return this.current.appendU32(value);
    }
    appendF32(value) {
        return this.current.appendF32(value);
    }
    appendF64(value) {
        return this.current.appendF64(value);
    }
    appendBoundaryValue(bits, sign) {
        return this.current.appendBoundaryValue(bits, sign);
    }
    appendULeb(value) {
        return this.current.appendULeb(value);
    }
    appendLeb(value) {
        return this.current.appendLeb(value);
    }
    appendLebRef(sourceAddress, signed) {
        return this.current.appendLebRef(sourceAddress, signed);
    }
    appendBytes(bytes) {
        return this.current.appendBytes(bytes);
    }
    appendName(text) {
        return this.current.appendName(text);
    }
    ret(ip) {
        this.ip_const(ip);
        this.appendU8(15 /* WasmOpcode.return_ */);
    }
    i32_const(value) {
        this.appendU8(65 /* WasmOpcode.i32_const */);
        this.appendLeb(value);
    }
    ptr_const(pointer) {
        let idx = this.options.useConstants ? this.constantSlots.indexOf(pointer) : -1;
        if (this.options.useConstants &&
            (idx < 0) && (this.nextConstantSlot < this.constantSlots.length)) {
            idx = this.nextConstantSlot++;
            this.constantSlots[idx] = pointer;
        }
        if (idx >= 0) {
            this.appendU8(35 /* WasmOpcode.get_global */);
            this.appendLeb(idx);
        }
        else {
            // mono_log_info(`Warning: no constant slot for ${pointer} (${this.nextConstantSlot} slots used)`);
            this.i32_const(pointer);
        }
    }
    ip_const(value) {
        this.appendU8(65 /* WasmOpcode.i32_const */);
        this.appendLeb(value - this.base);
    }
    i52_const(value) {
        this.appendU8(66 /* WasmOpcode.i64_const */);
        this.appendLeb(value);
    }
    v128_const(value) {
        if (value === 0) {
            // This encoding is much smaller than a v128_const
            // But v8 doesn't optimize it :-((((((
            /*
                this.i52_const(0);
                this.appendSimd(WasmSimdOpcode.i64x2_splat);
            */
            this.local("v128_zero");
        }
        else if (typeof (value) === "object") {
            if (!(value.byteLength === 16)) mono_assert(false, "Expected v128_const arg to be 16 bytes in size"); // inlined mono_assert condition
            let isZero = true;
            for (let i = 0; i < 16; i++) {
                if (value[i] !== 0)
                    isZero = false;
            }
            if (isZero) {
                // mono_log_info("Detected that literal v128_const was zero");
                this.local("v128_zero");
            }
            else {
                this.appendSimd(12 /* WasmSimdOpcode.v128_const */);
                this.appendBytes(value);
            }
        }
        else {
            throw new Error("Expected v128_const arg to be 0 or a Uint8Array");
        }
    }
    defineType(name, parameters, returnType, permanent) {
        if (this.functionTypes[name])
            throw new Error(`Function type ${name} already defined`);
        if (permanent && (this.functionTypeCount > this.permanentFunctionTypeCount))
            throw new Error("New permanent function types cannot be defined after non-permanent ones");
        let shape = "";
        for (const k in parameters)
            shape += parameters[k] + ",";
        shape += returnType;
        let index = this.functionTypesByShape[shape];
        if (typeof (index) !== "number") {
            index = this.functionTypeCount++;
            if (permanent) {
                this.permanentFunctionTypeCount++;
                this.permanentFunctionTypesByShape[shape] = index;
                this.permanentFunctionTypesByIndex[index] = [
                    parameters,
                    Object.values(parameters).length,
                    returnType
                ];
            }
            else {
                this.functionTypesByShape[shape] = index;
                this.functionTypesByIndex[index] = [
                    parameters,
                    Object.values(parameters).length,
                    returnType
                ];
            }
        }
        const tup = [
            index, parameters, returnType,
            `(${JSON.stringify(parameters)}) -> ${returnType}`, permanent
        ];
        if (permanent)
            this.permanentFunctionTypes[name] = tup;
        else
            this.functionTypes[name] = tup;
        return index;
    }
    generateTypeSection() {
        this.beginSection(1);
        this.appendULeb(this.functionTypeCount);
        /*
        if (trace > 1)
            mono_log_info(`Generated ${this.functionTypeCount} wasm type(s) from ${Object.keys(this.functionTypes).length} named function types`);
        */
        for (let i = 0; i < this.functionTypeCount; i++) {
            const parameters = this.functionTypesByIndex[i][0], parameterCount = this.functionTypesByIndex[i][1], returnType = this.functionTypesByIndex[i][2];
            this.appendU8(0x60);
            // Parameters
            this.appendULeb(parameterCount);
            for (const k in parameters)
                this.appendU8(parameters[k]);
            // Return type(s)
            if (returnType !== 64 /* WasmValtype.void */) {
                this.appendULeb(1);
                this.appendU8(returnType);
            }
            else
                this.appendULeb(0);
        }
        this.endSection();
    }
    getImportedFunctionTable() {
        const imports = {};
        for (const k in this.importedFunctions) {
            const f = this.importedFunctions[k];
            const name = this.getCompressedName(f);
            imports[name] = f.func;
        }
        return imports;
    }
    getCompressedName(ifi) {
        if (!this.compressImportNames || typeof (ifi.index) !== "number")
            return ifi.name;
        let result = compressedNameCache[ifi.index];
        if (typeof (result) !== "string")
            compressedNameCache[ifi.index] = result = ifi.index.toString(shortNameBase);
        return result;
    }
    getImportsToEmit() {
        const result = [];
        for (const k in this.importedFunctions) {
            const v = this.importedFunctions[k];
            if (typeof (v.index) !== "number")
                continue;
            result.push(v);
        }
        result.sort((lhs, rhs) => lhs.index - rhs.index);
        // mono_log_info("result=[" + result.map(f => `#${f.index} ${f.module}.${f.name}`) + "]");
        return result;
    }
    _generateImportSection(includeFunctionTable) {
        const importsToEmit = this.getImportsToEmit();
        this.lockImports = true;
        if (includeFunctionTable !== false)
            throw new Error("function table imports are disabled");
        const enableWasmEh = this.getExceptionTag() !== undefined;
        // Import section
        this.beginSection(2);
        this.appendULeb(1 + // memory
            (enableWasmEh ? 1 : 0) + // c++ exception tag
            importsToEmit.length + this.constantSlots.length +
            ((includeFunctionTable !== false) ? 1 : 0));
        // mono_log_info(`referenced ${importsToEmit.length} import(s)`);
        for (let i = 0; i < importsToEmit.length; i++) {
            const ifi = importsToEmit[i];
            // mono_log_info(`  #${ifi.index} ${ifi.module}.${ifi.name} = ${ifi.func}. typeIndex=${ifi.typeIndex}`);
            this.appendName(ifi.module);
            this.appendName(this.getCompressedName(ifi));
            this.appendU8(0x0); // function
            this.appendU8(ifi.typeIndex);
        }
        for (let i = 0; i < this.constantSlots.length; i++) {
            this.appendName("c");
            this.appendName(i.toString(shortNameBase));
            this.appendU8(0x03); // global
            this.appendU8(127 /* WasmValtype.i32 */); // all constants are pointers right now
            this.appendU8(0x00); // constant
        }
        // import the native heap
        this.appendName("m");
        this.appendName("h");
        if (WasmEnableThreads) {
            // memtype (limits = 0x03 n:u32 m:u32    => {min n, max m, shared})
            this.appendU8(0x02);
            this.appendU8(0x03);
            // HACK: emcc seems to generate this min/max by default
            this.appendULeb(256);
            this.appendULeb(32768);
        }
        else {
            // memtype (limits = { min=0x01, max=infinity })
            this.appendU8(0x02);
            this.appendU8(0x00);
            // Minimum size is in 64k pages, not bytes
            this.appendULeb(0x01);
        }
        if (enableWasmEh) {
            // import the c++ exception tag
            this.appendName("x");
            this.appendName("e");
            // tagtype
            this.appendU8(0x04);
            // attribute (exception)
            this.appendU8(0x0);
            // signature
            this.appendULeb(this.getTypeIndex("__cpp_exception"));
        }
        if (includeFunctionTable !== false) {
            this.appendName("f");
            this.appendName("f");
            // tabletype
            this.appendU8(0x01);
            // funcref
            this.appendU8(0x70);
            // limits = { min=0x01, max=infinity }
            this.appendU8(0x00);
            this.appendULeb(0x01);
        }
    }
    defineImportedFunction(module, name, functionTypeName, permanent, func) {
        if (this.lockImports)
            throw new Error("Import section already generated");
        if (permanent && (this.importedFunctionCount > 0))
            throw new Error("New permanent imports cannot be defined after any indexes have been assigned");
        const type = this.functionTypes[functionTypeName];
        if (!type)
            throw new Error("No function type named " + functionTypeName);
        if (permanent && !type[4])
            throw new Error("A permanent import must have a permanent function type");
        const typeIndex = type[0];
        const table = permanent ? this.permanentImportedFunctions : this.importedFunctions;
        if (typeof (func) === "number")
            func = getWasmFunctionTable().get(func);
        if ((typeof (func) !== "function") && (typeof (func) !== "undefined"))
            throw new Error(`Value passed for imported function ${name} was not a function or valid function pointer or undefined`);
        const result = table[name] = {
            index: undefined,
            typeIndex,
            module,
            name,
            func
        };
        return result;
    }
    markImportAsUsed(name) {
        const func = this.importedFunctions[name];
        if (!func)
            throw new Error("No imported function named " + name);
        if (typeof (func.index) !== "number")
            func.index = this.importedFunctionCount++;
    }
    getTypeIndex(name) {
        const type = this.functionTypes[name];
        if (!type)
            throw new Error("No type named " + name);
        return type[0];
    }
    defineFunction(options, generator) {
        const rec = {
            index: this.functions.length,
            name: options.name,
            typeName: options.type,
            typeIndex: this.getTypeIndex(options.type),
            export: options.export,
            locals: options.locals,
            generator,
            error: null,
            blob: null,
        };
        this.functions.push(rec);
        if (rec.export)
            this.estimatedExportBytes += rec.name.length + 8;
        return rec;
    }
    emitImportsAndFunctions(includeFunctionTable) {
        let exportCount = 0;
        for (let i = 0; i < this.functions.length; i++) {
            const func = this.functions[i];
            if (func.export)
                exportCount++;
            this.beginFunction(func.typeName, func.locals);
            try {
                func.blob = func.generator();
            }
            finally {
                // If func.generator failed due to an error or didn't return a blob, we want
                //  to call endFunction to pop the stack and create the blob automatically.
                // We may be in the middle of handling an exception so don't let this automatic
                //  logic throw and suppress the original exception being handled
                try {
                    if (!func.blob)
                        func.blob = this.endFunction(false);
                }
                catch (_a) {
                    // eslint-disable-next-line @typescript-eslint/no-extra-semi
                    ;
                }
            }
        }
        this._generateImportSection(includeFunctionTable);
        // Function section
        this.beginSection(3);
        this.appendULeb(this.functions.length);
        for (let i = 0; i < this.functions.length; i++)
            this.appendULeb(this.functions[i].typeIndex);
        // Export section
        this.beginSection(7);
        this.appendULeb(exportCount);
        for (let i = 0; i < this.functions.length; i++) {
            const func = this.functions[i];
            if (!func.export)
                continue;
            // FIXME: This combined with the initial cost of decoding the function name is somewhat expensive
            // It might be ideal to keep the original C name function pointer around and copy that directly into the buffer.
            this.appendName(func.name);
            this.appendU8(0); // func export
            this.appendULeb(this.importedFunctionCount + i);
        }
        // Code section
        this.beginSection(10);
        this.appendULeb(this.functions.length);
        for (let i = 0; i < this.functions.length; i++) {
            const func = this.functions[i];
            if (!(func.blob)) mono_assert(false, `expected function ${func.name} to have a body`); // inlined mono_assert condition
            this.appendULeb(func.blob.length);
            this.appendBytes(func.blob);
        }
        this.endSection();
    }
    call_indirect( /* functionTypeName: string, tableIndex: number */) {
        throw new Error("call_indirect unavailable");
        /*
        const type = this.functionTypes[functionTypeName];
        if (!type)
            throw new Error("No function type named " + functionTypeName);
        const typeIndex = type[0];
        this.appendU8(WasmOpcode.call_indirect);
        this.appendULeb(typeIndex);
        this.appendULeb(tableIndex);
        */
    }
    callImport(name) {
        const func = this.importedFunctions[name];
        if (!func)
            throw new Error("No imported function named " + name);
        if (typeof (func.index) !== "number") {
            if (this.lockImports)
                throw new Error("Import section was emitted before assigning an index to import named " + name);
            func.index = this.importedFunctionCount++;
        }
        this.appendU8(16 /* WasmOpcode.call */);
        this.appendULeb(func.index);
    }
    beginSection(type) {
        if (this.inSection)
            this._pop(true);
        this.appendU8(type);
        this._push();
        this.inSection = true;
    }
    endSection() {
        if (!this.inSection)
            throw new Error("Not in section");
        if (this.inFunction)
            this.endFunction(true);
        this._pop(true);
        this.inSection = false;
    }
    _assignLocalIndices(counts, locals, base, localGroupCount) {
        counts[127 /* WasmValtype.i32 */] = 0;
        counts[126 /* WasmValtype.i64 */] = 0;
        counts[125 /* WasmValtype.f32 */] = 0;
        counts[124 /* WasmValtype.f64 */] = 0;
        counts[123 /* WasmValtype.v128 */] = 0;
        for (const k in locals) {
            const ty = locals[k];
            if (counts[ty] <= 0)
                localGroupCount++;
            counts[ty]++;
        }
        const offi32 = 0, offi64 = counts[127 /* WasmValtype.i32 */], offf32 = offi64 + counts[126 /* WasmValtype.i64 */], offf64 = offf32 + counts[125 /* WasmValtype.f32 */], offv128 = offf64 + counts[124 /* WasmValtype.f64 */];
        counts[127 /* WasmValtype.i32 */] = 0;
        counts[126 /* WasmValtype.i64 */] = 0;
        counts[125 /* WasmValtype.f32 */] = 0;
        counts[124 /* WasmValtype.f64 */] = 0;
        counts[123 /* WasmValtype.v128 */] = 0;
        for (const k in locals) {
            const ty = locals[k];
            let idx = 0, offset;
            switch (ty) {
                case 127 /* WasmValtype.i32 */:
                    offset = offi32;
                    break;
                case 126 /* WasmValtype.i64 */:
                    offset = offi64;
                    break;
                case 125 /* WasmValtype.f32 */:
                    offset = offf32;
                    break;
                case 124 /* WasmValtype.f64 */:
                    offset = offf64;
                    break;
                case 123 /* WasmValtype.v128 */:
                    offset = offv128;
                    break;
                default:
                    throw new Error(`Unimplemented valtype: ${ty}`);
            }
            idx = (counts[ty]++) + offset + base;
            this.locals.set(k, idx);
            // mono_log_info(`local ${k} ${locals[k]} -> ${idx}`);
        }
        return localGroupCount;
    }
    beginFunction(type, locals) {
        if (this.inFunction)
            throw new Error("Already in function");
        this._push();
        const signature = this.functionTypes[type];
        this.locals.clear();
        this.branchTargets.clear();
        let counts = {};
        const tk = [127 /* WasmValtype.i32 */, 126 /* WasmValtype.i64 */, 125 /* WasmValtype.f32 */, 124 /* WasmValtype.f64 */, 123 /* WasmValtype.v128 */];
        // We first assign the parameters local indices and then
        //  we assign the named locals indices, because parameters
        //  come first in the local space. Imagine if parameters
        //  had their own opcode and weren't mutable??????
        let localGroupCount = 0;
        // Assign indices for the parameter list from the function signature
        const localBaseIndex = this._assignParameterIndices(signature[1]);
        if (locals)
            // Now if we have any locals, assign indices for those
            localGroupCount = this._assignLocalIndices(counts, locals, localBaseIndex, localGroupCount);
        else
            // Otherwise erase the counts table from the parameter assignment
            counts = {};
        // Write the number of types and then write a count for each type
        this.appendULeb(localGroupCount);
        for (let i = 0; i < tk.length; i++) {
            const k = tk[i];
            const c = counts[k];
            if (!c)
                continue;
            // mono_log_info(`${k} x${c}`);
            this.appendULeb(c);
            this.appendU8(k);
        }
        this.inFunction = true;
    }
    endFunction(writeToOutput) {
        if (!this.inFunction)
            throw new Error("Not in function");
        if (this.activeBlocks > 0)
            throw new Error(`${this.activeBlocks} unclosed block(s) at end of function`);
        const result = this._pop(writeToOutput);
        this.inFunction = false;
        return result;
    }
    block(type, opcode) {
        const result = this.appendU8(opcode || 2 /* WasmOpcode.block */);
        if (type)
            this.appendU8(type);
        else
            this.appendU8(64 /* WasmValtype.void */);
        this.activeBlocks++;
        return result;
    }
    endBlock() {
        if (this.activeBlocks <= 0)
            throw new Error("No blocks active");
        this.activeBlocks--;
        this.appendU8(11 /* WasmOpcode.end */);
    }
    arg(name, opcode) {
        const index = typeof (name) === "string"
            ? (this.locals.has(name) ? this.locals.get(name) : undefined)
            : name;
        if (typeof (index) !== "number")
            throw new Error("No local named " + name);
        if (opcode)
            this.appendU8(opcode);
        this.appendULeb(index);
    }
    local(name, opcode) {
        const index = typeof (name) === "string"
            ? (this.locals.has(name) ? this.locals.get(name) : undefined)
            : name + this.argumentCount;
        if (typeof (index) !== "number")
            throw new Error("No local named " + name);
        if (opcode)
            this.appendU8(opcode);
        else
            this.appendU8(32 /* WasmOpcode.get_local */);
        this.appendULeb(index);
    }
    appendMemarg(offset, alignPower) {
        this.appendULeb(alignPower);
        this.appendULeb(offset);
    }
    /*
        generates either (u32)get_local(ptr) + offset or (u32)ptr1 + offset
    */
    lea(ptr1, offset) {
        if (typeof (ptr1) === "string")
            this.local(ptr1);
        else
            this.i32_const(ptr1);
        this.i32_const(offset);
        // FIXME: How do we make sure this has correct semantics for pointers over 2gb?
        this.appendU8(106 /* WasmOpcode.i32_add */);
    }
    getArrayView(fullCapacity, suppressDeepStackError) {
        if ((suppressDeepStackError !== true) && this.stackSize > 1)
            throw new Error("Jiterpreter block stack not empty");
        return this.stack[0].getArrayView(fullCapacity);
    }
    getConstants() {
        const result = {};
        for (let i = 0; i < this.constantSlots.length; i++)
            result[i.toString(shortNameBase)] = this.constantSlots[i];
        return result;
    }
}
class BlobBuilder {
    constructor() {
        this.textBuf = new Uint8Array(1024);
        this.capacity = blobBuilderCapacity;
        this.buffer = malloc(this.capacity);
        if (!(this.buffer)) mono_assert(false, `Failed to allocate ${blobBuilderCapacity}b buffer for BlobBuilder`); // inlined mono_assert condition
        localHeapViewU8().fill(0, this.buffer, this.buffer + this.capacity);
        this.size = 0;
        this.clear();
        if (typeof (TextEncoder) === "function")
            this.encoder = new TextEncoder();
    }
    clear() {
        this.size = 0;
    }
    appendU8(value) {
        if (this.size >= this.capacity)
            throw new Error("Buffer full");
        const result = this.size;
        localHeapViewU8()[this.buffer + (this.size++)] = value;
        return result;
    }
    appendU32(value) {
        const result = this.size;
        wrapped_c_functions.mono_jiterp_write_number_unaligned(this.buffer + this.size, value, 0 /* JiterpNumberMode.U32 */);
        this.size += 4;
        return result;
    }
    appendI32(value) {
        const result = this.size;
        wrapped_c_functions.mono_jiterp_write_number_unaligned(this.buffer + this.size, value, 1 /* JiterpNumberMode.I32 */);
        this.size += 4;
        return result;
    }
    appendF32(value) {
        const result = this.size;
        wrapped_c_functions.mono_jiterp_write_number_unaligned(this.buffer + this.size, value, 2 /* JiterpNumberMode.F32 */);
        this.size += 4;
        return result;
    }
    appendF64(value) {
        const result = this.size;
        wrapped_c_functions.mono_jiterp_write_number_unaligned(this.buffer + this.size, value, 3 /* JiterpNumberMode.F64 */);
        this.size += 8;
        return result;
    }
    appendBoundaryValue(bits, sign) {
        if (this.size + 8 >= this.capacity)
            throw new Error("Buffer full");
        const bytesWritten = wrapped_c_functions.mono_jiterp_encode_leb_signed_boundary((this.buffer + this.size), bits, sign);
        if (bytesWritten < 1)
            throw new Error(`Failed to encode ${bits} bit boundary value with sign ${sign}`);
        this.size += bytesWritten;
        return bytesWritten;
    }
    appendULeb(value) {
        if (!(typeof (value) === "number")) mono_assert(false, `appendULeb expected number but got ${value}`); // inlined mono_assert condition
        if (!(value >= 0)) mono_assert(false, "cannot pass negative value to appendULeb"); // inlined mono_assert condition
        if (value < 0x7F) {
            if (this.size + 1 >= this.capacity)
                throw new Error("Buffer full");
            this.appendU8(value);
            return 1;
        }
        if (this.size + 8 >= this.capacity)
            throw new Error("Buffer full");
        const bytesWritten = wrapped_c_functions.mono_jiterp_encode_leb52((this.buffer + this.size), value, 0);
        if (bytesWritten < 1)
            throw new Error(`Failed to encode value '${value}' as unsigned leb`);
        this.size += bytesWritten;
        return bytesWritten;
    }
    appendLeb(value) {
        if (!(typeof (value) === "number")) mono_assert(false, `appendLeb expected number but got ${value}`); // inlined mono_assert condition
        if (this.size + 8 >= this.capacity)
            throw new Error("Buffer full");
        const bytesWritten = wrapped_c_functions.mono_jiterp_encode_leb52((this.buffer + this.size), value, 1);
        if (bytesWritten < 1)
            throw new Error(`Failed to encode value '${value}' as signed leb`);
        this.size += bytesWritten;
        return bytesWritten;
    }
    appendLebRef(sourceAddress, signed) {
        if (this.size + 8 >= this.capacity)
            throw new Error("Buffer full");
        const bytesWritten = wrapped_c_functions.mono_jiterp_encode_leb64_ref((this.buffer + this.size), sourceAddress, signed ? 1 : 0);
        if (bytesWritten < 1)
            throw new Error("Failed to encode value as leb");
        this.size += bytesWritten;
        return bytesWritten;
    }
    copyTo(destination, count) {
        if (typeof (count) !== "number")
            count = this.size;
        if ((destination.size + count) >= destination.capacity)
            throw new Error("Destination buffer full");
        localHeapViewU8().copyWithin(destination.buffer + destination.size, this.buffer, this.buffer + count);
        destination.size += count;
    }
    appendBytes(bytes, count) {
        const result = this.size;
        const heapU8 = localHeapViewU8();
        const actualCount = (typeof (count) !== "number")
            ? bytes.length
            : count;
        if ((this.size + actualCount) >= this.capacity)
            throw new Error("Buffer full");
        if (bytes.buffer === heapU8.buffer) {
            heapU8.copyWithin(this.buffer + result, bytes.byteOffset, bytes.byteOffset + actualCount);
            this.size += actualCount;
        }
        else {
            if (typeof (count) === "number")
                bytes = new Uint8Array(bytes.buffer, bytes.byteOffset, count);
            // FIXME: Find a way to avoid temporarily allocating a view for every appendBytes
            // The problem is that if we cache it and the native heap grows, the view will become detached
            const av = this.getArrayView(true);
            av.set(bytes, this.size);
            this.size += bytes.length;
        }
        return result;
    }
    appendName(text) {
        let count = text.length;
        // TextEncoder overhead is significant for short strings, and lots of our strings
        //  are single-character import names, so add a fast path for single characters
        let singleChar = text.length === 1 ? text.charCodeAt(0) : -1;
        if (singleChar > 0x7F)
            singleChar = -1;
        // Also don't bother running the encode path for empty strings
        if (count && (singleChar < 0)) {
            if (this.encoder) {
                // The ideal would be to encodeInto directly into a heap buffer so we can copyWithin,
                //  or even encodeInto the destination. But that would require allocating a subarray
                //  every time we encode text, which is probably worse.
                // This is somehow one of the most expensive parts of the compiler :(
                const temp = this.encoder.encodeInto(text, this.textBuf);
                count = temp.written || 0;
            }
            else {
                for (let i = 0; i < count; i++) {
                    const ch = text.charCodeAt(i);
                    if (ch > 0x7F)
                        throw new Error("Out of range character and no TextEncoder available");
                    else
                        this.textBuf[i] = ch;
                }
            }
        }
        this.appendULeb(count);
        if (singleChar >= 0)
            this.appendU8(singleChar);
        else if (count > 1)
            this.appendBytes(this.textBuf, count);
    }
    getArrayView(fullCapacity) {
        return new Uint8Array(localHeapViewU8().buffer, this.buffer, fullCapacity ? this.capacity : this.size);
    }
}
class Cfg {
    constructor(builder) {
        this.segments = [];
        this.backBranchTargets = null;
        this.lastSegmentEnd = 0;
        this.overheadBytes = 0;
        this.blockStack = [];
        this.backDispatchOffsets = [];
        this.dispatchTable = new Map();
        this.observedBackBranchTargets = new Set();
        this.trace = 0;
        this.builder = builder;
    }
    initialize(startOfBody, backBranchTargets, trace) {
        this.segments.length = 0;
        this.blockStack.length = 0;
        this.startOfBody = startOfBody;
        this.backBranchTargets = backBranchTargets;
        this.base = this.builder.base;
        this.ip = this.lastSegmentStartIp = this.firstOpcodeIp = this.builder.base;
        this.lastSegmentEnd = 0;
        this.overheadBytes = 10; // epilogue
        this.dispatchTable.clear();
        this.observedBackBranchTargets.clear();
        this.trace = trace;
        this.backDispatchOffsets.length = 0;
    }
    // We have a header containing the table of locals and we need to preserve it
    entry(ip) {
        this.entryIp = ip;
        // Skip over the enter opcode
        const enterSizeU16 = wrapped_c_functions.mono_jiterp_get_opcode_info(676 /* MintOpcode.MINT_TIER_ENTER_JITERPRETER */, 1 /* OpcodeInfoType.Length */);
        this.firstOpcodeIp = ip + (enterSizeU16 * 2);
        this.appendBlob();
        if (!(this.segments.length === 1)) mono_assert(false, "expected 1 segment"); // inlined mono_assert condition
        if (!(this.segments[0].type === "blob")) mono_assert(false, "expected blob"); // inlined mono_assert condition
        this.entryBlob = this.segments[0];
        this.segments.length = 0;
        this.overheadBytes += 9; // entry disp init + block + optional loop
        if (this.backBranchTargets) {
            this.overheadBytes += 20; // some extra padding for the dispatch br_table
            this.overheadBytes += this.backBranchTargets.length; // one byte for each target in the table
        }
        return this.firstOpcodeIp;
    }
    appendBlob() {
        if (this.builder.current.size === this.lastSegmentEnd)
            return;
        this.segments.push({
            type: "blob",
            ip: this.lastSegmentStartIp,
            start: this.lastSegmentEnd,
            length: this.builder.current.size - this.lastSegmentEnd,
        });
        this.lastSegmentStartIp = this.ip;
        this.lastSegmentEnd = this.builder.current.size;
        // each segment generates a block
        this.overheadBytes += 2;
    }
    startBranchBlock(ip, isBackBranchTarget) {
        this.appendBlob();
        this.segments.push({
            type: "branch-block-header",
            ip,
            isBackBranchTarget,
        });
        this.overheadBytes += 1; // each branch block just costs us an end
    }
    branch(target, isBackward, branchType) {
        if (isBackward)
            this.observedBackBranchTargets.add(target);
        this.appendBlob();
        this.segments.push({
            type: "branch",
            from: this.ip,
            target,
            isBackward,
            branchType: branchType,
        });
        // some branches will generate bailouts instead so we allocate 4 bytes per branch
        //  to try and balance this out and avoid underestimating too much
        this.overheadBytes += 4; // forward branches are a constant br + depth (optimally 2 bytes)
        if (isBackward) {
            // i32.const <n>
            // set_local <disp>
            this.overheadBytes += 4;
        }
        if (WasmEnableThreads) {
            // Account for the size of the safepoint
            if ((branchType === 3 /* CfgBranchType.SafepointConditional */) ||
                (branchType === 2 /* CfgBranchType.SafepointUnconditional */)) {
                this.overheadBytes += 17;
            }
        }
    }
    // It's the caller's responsibility to wrap this in a block and follow it with a bailout!
    jumpTable(targets, fallthrough) {
        this.appendBlob();
        this.segments.push({
            type: "jump-table",
            from: this.ip,
            targets,
            fallthrough,
        });
        // opcode, length, fallthrough (approximate)
        this.overheadBytes += 4;
        // length of branch depths (approximate)
        this.overheadBytes += targets.length;
        // bailout for missing targets (approximate)
        this.overheadBytes += 24;
    }
    emitBlob(segment, source) {
        // mono_log_info(`segment @${(<any>segment.ip).toString(16)} ${segment.start}-${segment.start + segment.length}`);
        const view = source.subarray(segment.start, segment.start + segment.length);
        this.builder.appendBytes(view);
    }
    generate() {
        // HACK: Make sure any remaining bytes are inserted into a trailing segment
        this.appendBlob();
        // Now finish generating the function body and copy it
        const source = this.builder.endFunction(false);
        // Now reclaim the builder that was being used so we can stitch segments together
        this.builder._push();
        // HACK: Make sure ip_const works
        this.builder.base = this.base;
        // Emit the function header
        this.emitBlob(this.entryBlob, source);
        // We wrap the entire trace in a loop that starts with a dispatch br_table in order to support
        //  backwards branches.
        if (this.backBranchTargets) {
            // unnecessary, the local is default initialized to zero
            // this.builder.i32_const(0);
            // this.builder.local("disp", WasmOpcode.set_local);
            this.builder.block(64 /* WasmValtype.void */, 3 /* WasmOpcode.loop */);
        }
        // We create a block for each of our forward branch targets, which can be used to skip forward to it
        // The block for each target will end *right before* the branch target, so that br <block nesting level>
        //  will skip every opcode before it
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            if (segment.type !== "branch-block-header")
                continue;
            this.blockStack.push(segment.ip);
        }
        this.blockStack.sort((lhs, rhs) => lhs - rhs);
        for (let i = 0; i < this.blockStack.length; i++)
            this.builder.block(64 /* WasmValtype.void */);
        const dispatchIp = 0;
        if (this.backBranchTargets) {
            this.backDispatchOffsets.length = 0;
            // First scan the back branch target table and union it with the block stack
            // This filters down to back branch targets that are reachable inside this trace
            // Further filter it down by only including targets we have observed a branch to
            //  this helps for cases where the branch opcodes targeting the location were not
            //  compiled due to an abort or some other reason
            for (let i = 0; i < this.backBranchTargets.length; i++) {
                const offset = (this.backBranchTargets[i] * 2) + this.startOfBody;
                const breakDepth = this.blockStack.indexOf(offset);
                if (breakDepth < 0)
                    continue;
                if (!this.observedBackBranchTargets.has(offset))
                    continue;
                this.dispatchTable.set(offset, this.backDispatchOffsets.length + 1);
                this.backDispatchOffsets.push(offset);
            }
            if (this.backDispatchOffsets.length === 0) {
                if (this.trace > 0)
                    mono_log_info("No back branch targets were reachable after filtering");
            }
            else if (this.backDispatchOffsets.length === 1) {
                if (this.trace > 0) {
                    if (this.backDispatchOffsets[0] === this.entryIp)
                        mono_log_info(`Exactly one back dispatch offset and it was the entry point 0x${this.entryIp.toString(16)}`);
                    else
                        mono_log_info(`Exactly one back dispatch offset and it was 0x${this.backDispatchOffsets[0].toString(16)}`);
                }
                // if (disp)
                //    goto back_branch_target;
                this.builder.local("disp");
                this.builder.appendU8(13 /* WasmOpcode.br_if */);
                this.builder.appendULeb(this.blockStack.indexOf(this.backDispatchOffsets[0]));
            }
            else {
                if (this.trace > 0)
                    mono_log_info(`${this.backDispatchOffsets.length} back branch offsets after filtering.`);
                // the loop needs to start with a br_table that performs dispatch based on the current value
                //  of the dispatch index local
                // br_table has to be surrounded by a block in order for a depth of 0 to be fallthrough
                // We wrap it in an additional block so we can have a trap for unexpected disp values
                this.builder.block(64 /* WasmValtype.void */);
                this.builder.block(64 /* WasmValtype.void */);
                // switch (disp) {
                this.builder.local("disp");
                this.builder.appendU8(14 /* WasmOpcode.br_table */);
                // br_table <number of values starting from 0> <labels for values starting from 0> <default>
                // we have to assign disp==0 to fallthrough so that we start at the top of the fn body, then
                //  assign disp values starting from 1 to branch targets
                this.builder.appendULeb(this.backDispatchOffsets.length + 1);
                this.builder.appendULeb(1); // br depth of 1 = skip the unreachable and fall through to the start
                for (let i = 0; i < this.backDispatchOffsets.length; i++) {
                    // add 2 to the depth because of the double block around it
                    this.builder.appendULeb(this.blockStack.indexOf(this.backDispatchOffsets[i]) + 2);
                }
                this.builder.appendULeb(0); // for unrecognized value we br 0, which causes us to trap
                this.builder.endBlock();
                this.builder.appendU8(0 /* WasmOpcode.unreachable */);
                this.builder.endBlock();
            }
            if (this.backDispatchOffsets.length > 0) {
                // We put a dummy IP at the end of the block stack to represent the dispatch loop
                // We will use this dummy IP to find the appropriate br depth when restarting the loop later
                this.blockStack.push(dispatchIp);
            }
        }
        if (this.trace > 1)
            mono_log_info(`blockStack=${this.blockStack}`);
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            switch (segment.type) {
                case "blob": {
                    // FIXME: If back branch target, generate a loop and put it on the block stack
                    this.emitBlob(segment, source);
                    break;
                }
                case "branch-block-header": {
                    // When we reach a branch target, we pop the current block off the stack, because it is used
                    //  to jump to this instruction pointer. So the result is that when previous code BRs to the
                    //  current block, it will skip everything remaining in it and resume from segment.ip
                    const indexInStack = this.blockStack.indexOf(segment.ip);
                    if (!(indexInStack === 0)) mono_assert(false, `expected ${segment.ip} on top of blockStack but found it at index ${indexInStack}, top is ${this.blockStack[0]}`); // inlined mono_assert condition
                    this.builder.endBlock();
                    this.blockStack.shift();
                    break;
                }
                case "jump-table": {
                    // Our caller wrapped us in a block and put a missing target bailout after us
                    const offset = 1;
                    // The selector was already loaded onto the wasm stack before cfg.jumpTable was called,
                    //  so we just need to generate a br_table
                    this.builder.appendU8(14 /* WasmOpcode.br_table */);
                    this.builder.appendULeb(segment.targets.length);
                    for (const target of segment.targets) {
                        const indexInStack = this.blockStack.indexOf(target);
                        if (indexInStack >= 0) {
                            modifyCounter(13 /* JiterpCounter.SwitchTargetsOk */, 1);
                            this.builder.appendULeb(indexInStack + offset);
                        }
                        else {
                            modifyCounter(14 /* JiterpCounter.SwitchTargetsFailed */, 1);
                            if (this.trace > 0)
                                mono_log_info(`Switch target ${target} not found in block stack ${this.blockStack}`);
                            this.builder.appendULeb(0);
                        }
                    }
                    const fallthroughIndex = this.blockStack.indexOf(segment.fallthrough);
                    if (fallthroughIndex >= 0) {
                        modifyCounter(13 /* JiterpCounter.SwitchTargetsOk */, 1);
                        this.builder.appendULeb(fallthroughIndex + offset);
                    }
                    else {
                        modifyCounter(14 /* JiterpCounter.SwitchTargetsFailed */, 1);
                        if (this.trace > 0)
                            mono_log_info(`Switch fallthrough ${segment.fallthrough} not found in block stack ${this.blockStack}`);
                        this.builder.appendULeb(0);
                    }
                    this.builder.appendU8(0 /* WasmOpcode.unreachable */);
                    break;
                }
                case "branch": {
                    const lookupTarget = segment.isBackward ? dispatchIp : segment.target;
                    let indexInStack = this.blockStack.indexOf(lookupTarget), successfulBackBranch = false, disp = undefined;
                    // Back branches will target the dispatcher loop so we need to update the dispatch index
                    //  which will be used by the loop dispatch br_table to jump to the correct location
                    if (segment.isBackward) {
                        if (this.dispatchTable.has(segment.target)) {
                            disp = this.dispatchTable.get(segment.target);
                            if (this.trace > 1)
                                mono_log_info(`backward br from ${segment.from.toString(16)} to ${segment.target.toString(16)}: disp=${disp}`);
                            successfulBackBranch = true;
                        }
                        else {
                            if (this.trace > 0)
                                mono_log_info(`br from ${segment.from.toString(16)} to ${segment.target.toString(16)} failed: back branch target not in dispatch table`);
                            indexInStack = -1;
                        }
                    }
                    if ((indexInStack >= 0) || successfulBackBranch) {
                        let offset = 0;
                        switch (segment.branchType) {
                            case 2 /* CfgBranchType.SafepointUnconditional */:
                                append_safepoint(this.builder, segment.from);
                                if (disp !== undefined) {
                                    this.builder.i32_const(disp);
                                    this.builder.local("disp", 33 /* WasmOpcode.set_local */);
                                }
                                this.builder.appendU8(12 /* WasmOpcode.br */);
                                break;
                            case 3 /* CfgBranchType.SafepointConditional */:
                                // Wrap the safepoint + branch in an if
                                this.builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
                                append_safepoint(this.builder, segment.from);
                                if (disp !== undefined) {
                                    this.builder.i32_const(disp);
                                    this.builder.local("disp", 33 /* WasmOpcode.set_local */);
                                }
                                this.builder.appendU8(12 /* WasmOpcode.br */);
                                offset = 1;
                                break;
                            case 0 /* CfgBranchType.Unconditional */:
                                if (disp !== undefined) {
                                    this.builder.i32_const(disp);
                                    this.builder.local("disp", 33 /* WasmOpcode.set_local */);
                                }
                                this.builder.appendU8(12 /* WasmOpcode.br */);
                                break;
                            case 1 /* CfgBranchType.Conditional */:
                                if (disp !== undefined) {
                                    this.builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
                                    this.builder.i32_const(disp);
                                    this.builder.local("disp", 33 /* WasmOpcode.set_local */);
                                    offset = 1;
                                    this.builder.appendU8(12 /* WasmOpcode.br */);
                                }
                                else {
                                    this.builder.appendU8(13 /* WasmOpcode.br_if */);
                                }
                                break;
                            default:
                                throw new Error("Unimplemented branch type");
                        }
                        this.builder.appendULeb(offset + indexInStack);
                        if (offset) // close the if
                            this.builder.endBlock();
                        if (this.trace > 1)
                            mono_log_info(`br from ${segment.from.toString(16)} to ${segment.target.toString(16)} breaking out ${offset + indexInStack + 1} level(s)`);
                    }
                    else {
                        if (this.trace > 0) {
                            const base = this.base;
                            if ((segment.target >= base) && (segment.target < this.exitIp))
                                mono_log_info(`br from ${segment.from.toString(16)} to ${segment.target.toString(16)} failed (inside of trace!)`);
                            else if (this.trace > 1)
                                mono_log_info(`br from ${segment.from.toString(16)} to ${segment.target.toString(16)} failed (outside of trace 0x${base.toString(16)} - 0x${this.exitIp.toString(16)})`);
                        }
                        const isConditional = (segment.branchType === 1 /* CfgBranchType.Conditional */) ||
                            (segment.branchType === 3 /* CfgBranchType.SafepointConditional */);
                        if (isConditional)
                            this.builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
                        append_bailout(this.builder, segment.target, 4 /* BailoutReason.Branch */);
                        if (isConditional)
                            this.builder.endBlock();
                    }
                    break;
                }
                default:
                    throw new Error("unreachable");
            }
        }
        // Close the dispatch loop
        if (this.backBranchTargets) {
            // This is no longer true due to filtering
            // if (!(this.blockStack[0] === <any>0)) mono_assert(false, "expected one zero entry on the block stack for the dispatch loop"); // inlined mono_assert condition
            if (!(this.blockStack.length <= 1)) mono_assert(false, "expected one or zero entries in the block stack at the end"); // inlined mono_assert condition
            if (this.blockStack.length)
                this.blockStack.shift();
            this.builder.endBlock();
        }
        if (!(this.blockStack.length === 0)) mono_assert(false, `expected block stack to be empty at end of function but it was ${this.blockStack}`); // inlined mono_assert condition
        // Now we generate a ret at the end of the function body so it's Valid(tm)
        // We will only hit this if execution falls through every block without hitting a bailout
        this.builder.ip_const(this.exitIp);
        this.builder.appendU8(15 /* WasmOpcode.return_ */);
        this.builder.appendU8(11 /* WasmOpcode.end */);
        const result = this.builder._pop(false);
        return result;
    }
}
let wasmTable;
const simdFallbackCounters = {};
const _now = (globalThis.performance && globalThis.performance.now)
    ? globalThis.performance.now.bind(globalThis.performance)
    : Date.now;
let scratchBuffer = 0;
function append_profiler_event(builder, ip, opcode) {
    let event_name;
    switch (opcode) {
        case 633 /* MintOpcode.MINT_PROF_ENTER */:
            event_name = "prof_enter";
            break;
        case 634 /* MintOpcode.MINT_PROF_SAMPLEPOINT */:
            event_name = "prof_samplepoint";
            break;
        case 635 /* MintOpcode.MINT_PROF_EXIT */:
        case 636 /* MintOpcode.MINT_PROF_EXIT_VOID */:
            event_name = "prof_leave";
            break;
        default:
            throw new Error(`Unimplemented profiler event ${opcode}`);
    }
    builder.local("frame");
    builder.i32_const(ip);
    builder.callImport(event_name);
}
function append_safepoint(builder, ip) {
    // safepoints are never triggered in a single-threaded build
    if (!WasmEnableThreads)
        return;
    // Check whether a safepoint is required
    builder.ptr_const(wrapped_c_functions.mono_jiterp_get_polling_required_address());
    builder.appendU8(40 /* WasmOpcode.i32_load */);
    builder.appendMemarg(0, 2);
    // If the polling flag is set we call mono_jiterp_do_safepoint()
    builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
    builder.local("frame");
    // Not ip_const, because we can't pass relative IP to do_safepoint
    builder.i32_const(ip);
    builder.callImport("safepoint");
    builder.endBlock();
}
function append_bailout(builder, ip, reason) {
    builder.ip_const(ip);
    if (builder.options.countBailouts) {
        builder.i32_const(builder.traceIndex);
        builder.i32_const(reason);
        builder.callImport("bailout");
    }
    builder.appendU8(15 /* WasmOpcode.return_ */);
}
// generate a bailout that is recorded for the monitoring phase as a possible early exit.
function append_exit(builder, ip, opcodeCounter, reason) {
    /*
     * disp will always be nonzero once we've taken at least one backward branch.
     * if (cinfo) {
     *   cinfo->backward_branch_taken = disp;
     *   if (opcodeCounter <= threshold)
     *     cinfo->opcode_count = opcodeCounter;
     * }
     */
    builder.local("cinfo");
    builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
    builder.local("cinfo");
    builder.local("disp");
    builder.appendU8(54 /* WasmOpcode.i32_store */);
    builder.appendMemarg(getMemberOffset(19 /* JiterpMember.BackwardBranchTaken */), 0);
    if (opcodeCounter <= (builder.options.monitoringLongDistance + 2)) {
        builder.local("cinfo");
        builder.i32_const(opcodeCounter);
        builder.appendU8(54 /* WasmOpcode.i32_store */);
        builder.appendMemarg(getMemberOffset(20 /* JiterpMember.BailoutOpcodeCount */), 0);
    }
    builder.endBlock();
    builder.ip_const(ip);
    if (builder.options.countBailouts) {
        builder.i32_const(builder.traceIndex);
        builder.i32_const(reason);
        builder.callImport("bailout");
    }
    builder.appendU8(15 /* WasmOpcode.return_ */);
}
function copyIntoScratchBuffer(src, size) {
    if (!scratchBuffer)
        scratchBuffer = malloc(64);
    if (size > 64)
        throw new Error("Scratch buffer size is 64");
    localHeapViewU8().copyWithin(scratchBuffer, src, src + size);
    return scratchBuffer;
}
function getWasmFunctionTable() {
    if (!wasmTable)
        wasmTable = runtimeHelpers.getWasmIndirectFunctionTable();
    if (!wasmTable)
        throw new Error("Module did not export the indirect function table");
    return wasmTable;
}
function addWasmFunctionPointer(table, f) {
    if (!(f)) mono_assert(false, "Attempting to set null function into table"); // inlined mono_assert condition
    const index = wrapped_c_functions.mono_jiterp_allocate_table_entry(table);
    if (index > 0) {
        // mono_log_info(`Allocated table ${table} slot ${index} for ${f}`);
        const fnTable = getWasmFunctionTable();
        fnTable.set(index, f);
    }
    else {
        // mono_log_error(`Table ${table} is full, no space for ${f}`);
    }
    return index;
}
function try_append_memset_fast(builder, localOffset, value, count, destOnStack) {
    if (count <= 0) {
        if (destOnStack)
            builder.appendU8(26 /* WasmOpcode.drop */);
        return true;
    }
    if (count >= maxMemsetSize)
        return false;
    // FIXME
    if (value !== 0)
        return false;
    const destLocal = destOnStack ? "memop_dest" : "pLocals";
    if (destOnStack)
        builder.local(destLocal, 33 /* WasmOpcode.set_local */);
    let offset = destOnStack ? 0 : localOffset;
    if (builder.options.enableSimd) {
        const sizeofV128 = 16;
        while (count >= sizeofV128) {
            builder.local(destLocal);
            builder.v128_const(0);
            builder.appendSimd(11 /* WasmSimdOpcode.v128_store */);
            builder.appendMemarg(offset, 0);
            offset += sizeofV128;
            count -= sizeofV128;
        }
    }
    // Do blocks of 8-byte sets first for smaller/faster code
    while (count >= 8) {
        builder.local(destLocal);
        builder.i52_const(0);
        builder.appendU8(55 /* WasmOpcode.i64_store */);
        builder.appendMemarg(offset, 0);
        offset += 8;
        count -= 8;
    }
    // Then set the remaining 0-7 bytes
    while (count >= 1) {
        builder.local(destLocal);
        builder.i32_const(0);
        let localCount = count % 4;
        switch (localCount) {
            case 0:
                // since we did %, 4 bytes turned into 0. gotta fix that up to avoid infinite loop
                localCount = 4;
                builder.appendU8(54 /* WasmOpcode.i32_store */);
                break;
            case 1:
                builder.appendU8(58 /* WasmOpcode.i32_store8 */);
                break;
            case 3:
            case 2:
                // For 3 bytes we just want to do a 2 write then a 1
                localCount = 2;
                builder.appendU8(59 /* WasmOpcode.i32_store16 */);
                break;
        }
        builder.appendMemarg(offset, 0);
        offset += localCount;
        count -= localCount;
    }
    return true;
}
function append_memset_dest(builder, value, count) {
    // spec: pop n, pop val, pop d, fill from d[0] to d[n] with value val
    if (try_append_memset_fast(builder, 0, value, count, true))
        return;
    builder.i32_const(value);
    builder.i32_const(count);
    builder.appendU8(252 /* WasmOpcode.PREFIX_sat */);
    builder.appendU8(11);
    builder.appendU8(0);
}
function try_append_memmove_fast(builder, destLocalOffset, srcLocalOffset, count, addressesOnStack, destLocal, srcLocal) {
    if (count <= 0) {
        if (addressesOnStack) {
            builder.appendU8(26 /* WasmOpcode.drop */);
            builder.appendU8(26 /* WasmOpcode.drop */);
        }
        return true;
    }
    if (count >= maxMemmoveSize)
        return false;
    if (addressesOnStack) {
        destLocal = destLocal || "memop_dest";
        srcLocal = srcLocal || "memop_src";
        // Stack layout is [..., dest, src]
        builder.local(srcLocal, 33 /* WasmOpcode.set_local */);
        builder.local(destLocal, 33 /* WasmOpcode.set_local */);
    }
    else if (!destLocal || !srcLocal) {
        destLocal = srcLocal = "pLocals";
    }
    else {
        // the addresses were already stored in the local args
    }
    let destOffset = addressesOnStack ? 0 : destLocalOffset, srcOffset = addressesOnStack ? 0 : srcLocalOffset;
    if (builder.options.enableSimd) {
        const sizeofV128 = 16;
        while (count >= sizeofV128) {
            builder.local(destLocal);
            builder.local(srcLocal);
            builder.appendSimd(0 /* WasmSimdOpcode.v128_load */, true);
            builder.appendMemarg(srcOffset, 0);
            builder.appendSimd(11 /* WasmSimdOpcode.v128_store */);
            builder.appendMemarg(destOffset, 0);
            destOffset += sizeofV128;
            srcOffset += sizeofV128;
            count -= sizeofV128;
        }
    }
    // Do blocks of 8-byte copies first for smaller/faster code
    while (count >= 8) {
        builder.local(destLocal);
        builder.local(srcLocal);
        builder.appendU8(41 /* WasmOpcode.i64_load */);
        builder.appendMemarg(srcOffset, 0);
        builder.appendU8(55 /* WasmOpcode.i64_store */);
        builder.appendMemarg(destOffset, 0);
        destOffset += 8;
        srcOffset += 8;
        count -= 8;
    }
    // Then copy the remaining 0-7 bytes
    while (count >= 1) {
        let loadOp, storeOp;
        let localCount = count % 4;
        switch (localCount) {
            case 0:
                // since we did %, 4 bytes turned into 0. gotta fix that up to avoid infinite loop
                localCount = 4;
                loadOp = 40 /* WasmOpcode.i32_load */;
                storeOp = 54 /* WasmOpcode.i32_store */;
                break;
            default:
            case 1:
                localCount = 1; // silence tsc
                loadOp = 44 /* WasmOpcode.i32_load8_s */;
                storeOp = 58 /* WasmOpcode.i32_store8 */;
                break;
            case 3:
            case 2:
                // For 3 bytes we just want to do a 2 write then a 1
                localCount = 2;
                loadOp = 46 /* WasmOpcode.i32_load16_s */;
                storeOp = 59 /* WasmOpcode.i32_store16 */;
                break;
        }
        builder.local(destLocal);
        builder.local(srcLocal);
        builder.appendU8(loadOp);
        builder.appendMemarg(srcOffset, 0);
        builder.appendU8(storeOp);
        builder.appendMemarg(destOffset, 0);
        srcOffset += localCount;
        destOffset += localCount;
        count -= localCount;
    }
    return true;
}
// expects dest then source to have been pushed onto wasm stack
function append_memmove_dest_src(builder, count) {
    if (try_append_memmove_fast(builder, 0, 0, count, true))
        return true;
    // spec: pop n, pop s, pop d, copy n bytes from s to d
    builder.i32_const(count);
    // great encoding isn't it
    builder.appendU8(252 /* WasmOpcode.PREFIX_sat */);
    builder.appendU8(10);
    builder.appendU8(0);
    builder.appendU8(0);
    return true;
}
function recordFailure() {
    const result = modifyCounter(5 /* JiterpCounter.Failures */, 1);
    if (result >= maxFailures) {
        mono_log_info(`Disabling jiterpreter after ${result} failures`);
        applyOptions({
            enableTraces: false,
            enableInterpEntry: false,
            enableJitCall: false
        });
    }
}
const memberOffsets = {};
function getMemberOffset(member) {
    const cached = memberOffsets[member];
    if (cached === undefined)
        return memberOffsets[member] = wrapped_c_functions.mono_jiterp_get_member_offset(member);
    else
        return cached;
}
function getRawCwrap(name) {
    const result = Module["wasmExports"][name];
    if (typeof (result) !== "function")
        throw new Error(`raw cwrap ${name} not found`);
    return result;
}
const opcodeTableCache = {};
function getOpcodeTableValue(opcode) {
    let result = opcodeTableCache[opcode];
    if (typeof (result) !== "number")
        result = opcodeTableCache[opcode] = wrapped_c_functions.mono_jiterp_get_opcode_value_table_entry(opcode);
    return result;
}
function importDef(name, fn) {
    return [name, name, fn];
}
function bytesFromHex(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2)
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    return bytes;
}
let observedTaintedZeroPage;
function isZeroPageReserved() {
    // FIXME: This check will always return true on worker threads.
    // Right now the jiterpreter is disabled when threading is active, so that's not an issue.
    if (WasmEnableThreads)
        return false;
    if (!wrapped_c_functions.mono_wasm_is_zero_page_reserved())
        return false;
    // If we ever saw garbage written to the zero page, never use it
    if (observedTaintedZeroPage === true)
        return false;
    // Determine whether emscripten's stack checker or some other troublemaker has
    //  written junk at the start of memory. The previous cwraps call will have
    //  checked whether the stack starts at zero or not (on the main thread).
    // We can't do this in the C helper because emcc/asan might be checking pointers.
    const heapU32 = localHeapViewU32();
    for (let i = 0; i < 8; i++) {
        if (heapU32[i] !== 0) {
            if (observedTaintedZeroPage === false)
                mono_log_error(`Zero page optimizations are enabled but garbage appeared in memory at address ${i * 4}: ${heapU32[i]}`);
            observedTaintedZeroPage = true;
            return false;
        }
    }
    observedTaintedZeroPage = false;
    return true;
}
const optionNames = {
    "enableTraces": "jiterpreter-traces-enabled",
    "enableInterpEntry": "jiterpreter-interp-entry-enabled",
    "enableJitCall": "jiterpreter-jit-call-enabled",
    "enableBackwardBranches": "jiterpreter-backward-branch-entries-enabled",
    "enableCallResume": "jiterpreter-call-resume-enabled",
    "enableWasmEh": "jiterpreter-wasm-eh-enabled",
    "enableSimd": "jiterpreter-simd-enabled",
    "enableAtomics": "jiterpreter-atomics-enabled",
    "zeroPageOptimization": "jiterpreter-zero-page-optimization",
    "cprop": "jiterpreter-constant-propagation",
    "enableStats": "jiterpreter-stats-enabled",
    "disableHeuristic": "jiterpreter-disable-heuristic",
    "estimateHeat": "jiterpreter-estimate-heat",
    "countBailouts": "jiterpreter-count-bailouts",
    "dumpTraces": "jiterpreter-dump-traces",
    "useConstants": "jiterpreter-use-constants",
    "eliminateNullChecks": "jiterpreter-eliminate-null-checks",
    "noExitBackwardBranches": "jiterpreter-backward-branches-enabled",
    "directJitCalls": "jiterpreter-direct-jit-calls",
    "minimumTraceValue": "jiterpreter-minimum-trace-value",
    "minimumTraceHitCount": "jiterpreter-minimum-trace-hit-count",
    "monitoringPeriod": "jiterpreter-trace-monitoring-period",
    "monitoringShortDistance": "jiterpreter-trace-monitoring-short-distance",
    "monitoringLongDistance": "jiterpreter-trace-monitoring-long-distance",
    "monitoringMaxAveragePenalty": "jiterpreter-trace-monitoring-max-average-penalty",
    "backBranchBoost": "jiterpreter-back-branch-boost",
    "jitCallHitCount": "jiterpreter-jit-call-hit-count",
    "jitCallFlushThreshold": "jiterpreter-jit-call-queue-flush-threshold",
    "interpEntryHitCount": "jiterpreter-interp-entry-hit-count",
    "interpEntryFlushThreshold": "jiterpreter-interp-entry-queue-flush-threshold",
    "wasmBytesLimit": "jiterpreter-wasm-bytes-limit",
    "tableSize": "jiterpreter-table-size",
    "aotTableSize": "jiterpreter-aot-table-size",
    "maxModuleSize": "jiterpreter-max-module-size",
    "maxSwitchSize": "jiterpreter-max-switch-size",
};
let optionsVersion = -1;
let optionTable = {};
// applies one or more jiterpreter options to change the current jiterpreter configuration.
function applyOptions(options) {
    for (const k in options) {
        const info = optionNames[k];
        if (!info) {
            mono_log_error(`Unrecognized jiterpreter option: ${k}`);
            continue;
        }
        const v = options[k];
        if (typeof (v) === "boolean")
            wrapped_c_functions.mono_jiterp_parse_option((v ? "--" : "--no-") + info);
        else if (typeof (v) === "number")
            wrapped_c_functions.mono_jiterp_parse_option(`--${info}=${v}`);
        else
            mono_log_error(`Jiterpreter option must be a boolean or a number but was ${typeof (v)} '${v}'`);
    }
}
function getCounter(counter) {
    return wrapped_c_functions.mono_jiterp_get_counter(counter);
}
function modifyCounter(counter, delta) {
    return wrapped_c_functions.mono_jiterp_modify_counter(counter, delta);
}
// returns the current jiterpreter configuration. do not mutate the return value!
function getOptions() {
    const currentVersion = wrapped_c_functions.mono_jiterp_get_options_version();
    if (currentVersion !== optionsVersion) {
        updateOptions();
        optionsVersion = currentVersion;
    }
    return optionTable;
}
function updateOptions() {
    optionTable = {};
    for (const k in optionNames) {
        const value = wrapped_c_functions.mono_jiterp_get_option_as_int(optionNames[k]);
        if (value !== INT32_MIN)
            optionTable[k] = value;
        else
            mono_log_info(`Failed to retrieve value of option ${optionNames[k]}`);
    }
}
function jiterpreter_allocate_table(type, base, size, fillValue) {
    const wasmTable = getWasmFunctionTable();
    const firstIndex = base, lastIndex = firstIndex + size - 1;
    if (!(lastIndex < wasmTable.length)) mono_assert(false, `Last index out of range: ${lastIndex} >= ${wasmTable.length}`); // inlined mono_assert condition
    // HACK: Always populate the first slot
    wasmTable.set(firstIndex, fillValue);
    // In threaded builds we need to populate all the reserved slots with safe placeholder functions
    // This operation is expensive in v8, so avoid doing it in single-threaded builds (which SHOULD
    //  be safe, since it was previously not necessary)
    if (WasmEnableThreads) {
        // HACK: If possible, we want to copy any backing state associated with the first placeholder item,
        //  so that additional work doesn't have to be done by the runtime for the following table sets
        const preparedValue = wasmTable.get(firstIndex);
        for (let i = firstIndex + 1; i <= lastIndex; i++)
            wasmTable.set(i, preparedValue);
    }
    wrapped_c_functions.mono_jiterp_initialize_table(type, firstIndex, lastIndex);
    return base + size;
}
// a single js worker might end up hosting multiple managed threads over its lifetime.
// we need to ensure we only ever initialize tables once on each js worker.
let jiterpreter_tables_allocated = false;
function jiterpreter_allocate_tables() {
    if (jiterpreter_tables_allocated)
        return;
    jiterpreter_tables_allocated = true;
    const options = getOptions();
    // FIXME: Unfortunately the interp entry tables need to be REALLY big. I'm not sure why.
    // A partial solution would be to merge the tables based on argument count instead of exact type,
    //  then create special placeholder functions that examine the rmethod to determine which kind
    //  of method is being called.
    const traceTableSize = options.tableSize, jitCallTableSize = runtimeHelpers.emscriptenBuildOptions.runAOTCompilation ? options.tableSize : 1, interpEntryTableSize = runtimeHelpers.emscriptenBuildOptions.runAOTCompilation ? options.aotTableSize : 1, numInterpEntryTables = 37 /* JiterpreterTable.LAST */ - 2 /* JiterpreterTable.InterpEntryStatic0 */ + 1, totalSize = traceTableSize + jitCallTableSize + (numInterpEntryTables * interpEntryTableSize) + 1, wasmTable = getWasmFunctionTable();
    let base = wasmTable.length;
    const beforeGrow = performance.now();
    wasmTable.grow(totalSize);
    const afterGrow = performance.now();
    if (options.enableStats)
        mono_log_info(`Allocated ${totalSize} function table entries for jiterpreter, bringing total table size to ${wasmTable.length}`);
    base = jiterpreter_allocate_table(0 /* JiterpreterTable.Trace */, base, traceTableSize, getRawCwrap("mono_jiterp_placeholder_trace"));
    base = jiterpreter_allocate_table(1 /* JiterpreterTable.JitCall */, base, jitCallTableSize, getRawCwrap("mono_jiterp_placeholder_jit_call"));
    for (let table = 2 /* JiterpreterTable.InterpEntryStatic0 */; table <= 37 /* JiterpreterTable.LAST */; table++)
        base = jiterpreter_allocate_table(table, base, interpEntryTableSize, wasmTable.get(wrapped_c_functions.mono_jiterp_get_interp_entry_func(table)));
    const afterTables = performance.now();
    if (options.enableStats)
        mono_log_info(`Growing wasm function table took ${afterGrow - beforeGrow}. Filling table took ${afterTables - afterGrow}.`);
}

const BailoutReasonNames = [
    "Unknown",
    "InterpreterTiering",
    "NullCheck",
    "VtableNotInitialized",
    "Branch",
    "BackwardBranch",
    "ConditionalBranch",
    "ConditionalBackwardBranch",
    "ComplexBranch",
    "ArrayLoadFailed",
    "ArrayStoreFailed",
    "StringOperationFailed",
    "DivideByZero",
    "Overflow",
    "Return",
    "Call",
    "Throw",
    "AllocFailed",
    "SpanOperationFailed",
    "CastFailed",
    "SafepointBranchTaken",
    "UnboxFailed",
    "CallDelegate",
    "Debugging",
    "Icall",
    "UnexpectedRetIp",
    "LeaveCheck",
    "SwitchSize",
    "SwitchTarget",
];

// Generated by genmintops.py from mintops.def.
// Do not manually edit this file.
const SimdInfo = {
    2: [
        'V128_I1_NEGATION',
        'V128_I2_NEGATION',
        'V128_I4_NEGATION',
        'V128_ONES_COMPLEMENT',
        'V128_U2_WIDEN_LOWER',
        'V128_U2_WIDEN_UPPER',
        'V128_I1_CREATE_SCALAR',
        'V128_I2_CREATE_SCALAR',
        'V128_I4_CREATE_SCALAR',
        'V128_I8_CREATE_SCALAR',
        'V128_I1_EXTRACT_MSB',
        'V128_I2_EXTRACT_MSB',
        'V128_I4_EXTRACT_MSB',
        'V128_I8_EXTRACT_MSB',
        'V128_I1_CREATE',
        'V128_I2_CREATE',
        'V128_I4_CREATE',
        'V128_I8_CREATE',
        'SplatX1',
        'SplatX2',
        'SplatX4',
        'SplatX8',
        'NegateD1',
        'NegateD2',
        'NegateD4',
        'NegateD8',
        'NegateR4',
        'NegateR8',
        'SqrtR4',
        'SqrtR8',
        'CeilingR4',
        'CeilingR8',
        'FloorR4',
        'FloorR8',
        'TruncateR4',
        'TruncateR8',
        'RoundToNearestR4',
        'RoundToNearestR8',
        'NotANY',
        'AnyTrueANY',
        'AllTrueD1',
        'AllTrueD2',
        'AllTrueD4',
        'AllTrueD8',
        'PopCountU1',
        'BitmaskD1',
        'BitmaskD2',
        'BitmaskD4',
        'BitmaskD8',
        'AddPairwiseWideningI1',
        'AddPairwiseWideningU1',
        'AddPairwiseWideningI2',
        'AddPairwiseWideningU2',
        'AbsI1',
        'AbsI2',
        'AbsI4',
        'AbsI8',
        'AbsR4',
        'AbsR8',
        'ConvertToSingleI4',
        'ConvertToSingleU4',
        'ConvertToSingleR8',
        'ConvertToDoubleLowerI4',
        'ConvertToDoubleLowerU4',
        'ConvertToDoubleLowerR8',
        'ConvertToInt32SaturateR4',
        'ConvertToUInt32SaturateR4',
        'ConvertToInt32SaturateR8',
        'ConvertToUInt32SaturateR8',
        'SignExtendWideningLowerD1',
        'SignExtendWideningLowerD2',
        'SignExtendWideningLowerD4',
        'SignExtendWideningUpperD1',
        'SignExtendWideningUpperD2',
        'SignExtendWideningUpperD4',
        'ZeroExtendWideningLowerD1',
        'ZeroExtendWideningLowerD2',
        'ZeroExtendWideningLowerD4',
        'ZeroExtendWideningUpperD1',
        'ZeroExtendWideningUpperD2',
        'ZeroExtendWideningUpperD4',
        'LoadVector128ANY',
        'LoadScalarVector128X4',
        'LoadScalarVector128X8',
        'LoadScalarAndSplatVector128X1',
        'LoadScalarAndSplatVector128X2',
        'LoadScalarAndSplatVector128X4',
        'LoadScalarAndSplatVector128X8',
        'LoadWideningVector128I1',
        'LoadWideningVector128U1',
        'LoadWideningVector128I2',
        'LoadWideningVector128U2',
        'LoadWideningVector128I4',
        'LoadWideningVector128U4'
    ],
    3: [
        'V128_I1_ADD',
        'V128_I2_ADD',
        'V128_I4_ADD',
        'V128_R4_ADD',
        'V128_I1_SUB',
        'V128_I2_SUB',
        'V128_I4_SUB',
        'V128_R4_SUB',
        'V128_BITWISE_AND',
        'V128_BITWISE_OR',
        'V128_BITWISE_EQUALITY',
        'V128_BITWISE_INEQUALITY',
        'V128_R4_FLOAT_EQUALITY',
        'V128_R8_FLOAT_EQUALITY',
        'V128_EXCLUSIVE_OR',
        'V128_I1_MULTIPLY',
        'V128_I2_MULTIPLY',
        'V128_I4_MULTIPLY',
        'V128_R4_MULTIPLY',
        'V128_R4_DIVISION',
        'V128_I1_LEFT_SHIFT',
        'V128_I2_LEFT_SHIFT',
        'V128_I4_LEFT_SHIFT',
        'V128_I8_LEFT_SHIFT',
        'V128_I1_RIGHT_SHIFT',
        'V128_I2_RIGHT_SHIFT',
        'V128_I4_RIGHT_SHIFT',
        'V128_I1_URIGHT_SHIFT',
        'V128_I2_URIGHT_SHIFT',
        'V128_I4_URIGHT_SHIFT',
        'V128_I8_URIGHT_SHIFT',
        'V128_U1_NARROW',
        'V128_U1_GREATER_THAN',
        'V128_I1_LESS_THAN',
        'V128_U1_LESS_THAN',
        'V128_I2_LESS_THAN',
        'V128_I1_EQUALS',
        'V128_I2_EQUALS',
        'V128_I4_EQUALS',
        'V128_R4_EQUALS',
        'V128_I8_EQUALS',
        'V128_I1_EQUALS_ANY',
        'V128_I2_EQUALS_ANY',
        'V128_I4_EQUALS_ANY',
        'V128_I8_EQUALS_ANY',
        'V128_AND_NOT',
        'V128_U2_LESS_THAN_EQUAL',
        'V128_I1_SHUFFLE',
        'V128_I2_SHUFFLE',
        'V128_I4_SHUFFLE',
        'V128_I8_SHUFFLE',
        'ExtractScalarI1',
        'ExtractScalarU1',
        'ExtractScalarI2',
        'ExtractScalarU2',
        'ExtractScalarD4',
        'ExtractScalarD8',
        'ExtractScalarR4',
        'ExtractScalarR8',
        'SwizzleD1',
        'AddD1',
        'AddD2',
        'AddD4',
        'AddD8',
        'AddR4',
        'AddR8',
        'SubtractD1',
        'SubtractD2',
        'SubtractD4',
        'SubtractD8',
        'SubtractR4',
        'SubtractR8',
        'MultiplyD2',
        'MultiplyD4',
        'MultiplyD8',
        'MultiplyR4',
        'MultiplyR8',
        'DivideR4',
        'DivideR8',
        'DotI2',
        'ShiftLeftD1',
        'ShiftLeftD2',
        'ShiftLeftD4',
        'ShiftLeftD8',
        'ShiftRightArithmeticD1',
        'ShiftRightArithmeticD2',
        'ShiftRightArithmeticD4',
        'ShiftRightArithmeticD8',
        'ShiftRightLogicalD1',
        'ShiftRightLogicalD2',
        'ShiftRightLogicalD4',
        'ShiftRightLogicalD8',
        'AndANY',
        'AndNotANY',
        'OrANY',
        'XorANY',
        'CompareEqualD1',
        'CompareEqualD2',
        'CompareEqualD4',
        'CompareEqualD8',
        'CompareEqualR4',
        'CompareEqualR8',
        'CompareNotEqualD1',
        'CompareNotEqualD2',
        'CompareNotEqualD4',
        'CompareNotEqualD8',
        'CompareNotEqualR4',
        'CompareNotEqualR8',
        'CompareLessThanI1',
        'CompareLessThanU1',
        'CompareLessThanI2',
        'CompareLessThanU2',
        'CompareLessThanI4',
        'CompareLessThanU4',
        'CompareLessThanI8',
        'CompareLessThanR4',
        'CompareLessThanR8',
        'CompareLessThanOrEqualI1',
        'CompareLessThanOrEqualU1',
        'CompareLessThanOrEqualI2',
        'CompareLessThanOrEqualU2',
        'CompareLessThanOrEqualI4',
        'CompareLessThanOrEqualU4',
        'CompareLessThanOrEqualI8',
        'CompareLessThanOrEqualR4',
        'CompareLessThanOrEqualR8',
        'CompareGreaterThanI1',
        'CompareGreaterThanU1',
        'CompareGreaterThanI2',
        'CompareGreaterThanU2',
        'CompareGreaterThanI4',
        'CompareGreaterThanU4',
        'CompareGreaterThanI8',
        'CompareGreaterThanR4',
        'CompareGreaterThanR8',
        'CompareGreaterThanOrEqualI1',
        'CompareGreaterThanOrEqualU1',
        'CompareGreaterThanOrEqualI2',
        'CompareGreaterThanOrEqualU2',
        'CompareGreaterThanOrEqualI4',
        'CompareGreaterThanOrEqualU4',
        'CompareGreaterThanOrEqualI8',
        'CompareGreaterThanOrEqualR4',
        'CompareGreaterThanOrEqualR8',
        'ConvertNarrowingSaturateSignedI2',
        'ConvertNarrowingSaturateSignedI4',
        'ConvertNarrowingSaturateUnsignedI2',
        'ConvertNarrowingSaturateUnsignedI4',
        'MultiplyWideningLowerI1',
        'MultiplyWideningLowerI2',
        'MultiplyWideningLowerI4',
        'MultiplyWideningLowerU1',
        'MultiplyWideningLowerU2',
        'MultiplyWideningLowerU4',
        'MultiplyWideningUpperI1',
        'MultiplyWideningUpperI2',
        'MultiplyWideningUpperI4',
        'MultiplyWideningUpperU1',
        'MultiplyWideningUpperU2',
        'MultiplyWideningUpperU4',
        'AddSaturateI1',
        'AddSaturateU1',
        'AddSaturateI2',
        'AddSaturateU2',
        'SubtractSaturateI1',
        'SubtractSaturateU1',
        'SubtractSaturateI2',
        'SubtractSaturateU2',
        'MultiplyRoundedSaturateQ15I2',
        'MinI1',
        'MinI2',
        'MinI4',
        'MinU1',
        'MinU2',
        'MinU4',
        'MaxI1',
        'MaxI2',
        'MaxI4',
        'MaxU1',
        'MaxU2',
        'MaxU4',
        'AverageRoundedU1',
        'AverageRoundedU2',
        'MinR4',
        'MinR8',
        'MaxR4',
        'MaxR8',
        'PseudoMinR4',
        'PseudoMinR8',
        'PseudoMaxR4',
        'PseudoMaxR8',
        'StoreANY'
    ],
    4: [
        'V128_CONDITIONAL_SELECT',
        'ReplaceScalarD1',
        'ReplaceScalarD2',
        'ReplaceScalarD4',
        'ReplaceScalarD8',
        'ReplaceScalarR4',
        'ReplaceScalarR8',
        'ShuffleD1',
        'BitwiseSelectANY',
        'LoadScalarAndInsertX1',
        'LoadScalarAndInsertX2',
        'LoadScalarAndInsertX4',
        'LoadScalarAndInsertX8',
        'StoreSelectedScalarX1',
        'StoreSelectedScalarX2',
        'StoreSelectedScalarX4',
        'StoreSelectedScalarX8'
    ],
};

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const ldcTable = {
    [13 /* MintOpcode.MINT_LDC_I4_0 */]: [65 /* WasmOpcode.i32_const */, 0],
    [14 /* MintOpcode.MINT_LDC_I4_1 */]: [65 /* WasmOpcode.i32_const */, 1],
};
const floatToIntTable = {
    [456 /* MintOpcode.MINT_CONV_I4_R4 */]: 168 /* WasmOpcode.i32_trunc_s_f32 */,
    [462 /* MintOpcode.MINT_CONV_I8_R4 */]: 174 /* WasmOpcode.i64_trunc_s_f32 */,
    [457 /* MintOpcode.MINT_CONV_I4_R8 */]: 170 /* WasmOpcode.i32_trunc_s_f64 */,
    [463 /* MintOpcode.MINT_CONV_I8_R8 */]: 176 /* WasmOpcode.i64_trunc_s_f64 */,
};
const unopTable = {
    [508 /* MintOpcode.MINT_CEQ0_I4 */]: [69 /* WasmOpcode.i32_eqz */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [428 /* MintOpcode.MINT_ADD1_I4 */]: [106 /* WasmOpcode.i32_add */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [430 /* MintOpcode.MINT_SUB1_I4 */]: [107 /* WasmOpcode.i32_sub */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [432 /* MintOpcode.MINT_NEG_I4 */]: [107 /* WasmOpcode.i32_sub */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [436 /* MintOpcode.MINT_NOT_I4 */]: [115 /* WasmOpcode.i32_xor */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [429 /* MintOpcode.MINT_ADD1_I8 */]: [124 /* WasmOpcode.i64_add */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [431 /* MintOpcode.MINT_SUB1_I8 */]: [125 /* WasmOpcode.i64_sub */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [433 /* MintOpcode.MINT_NEG_I8 */]: [125 /* WasmOpcode.i64_sub */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [437 /* MintOpcode.MINT_NOT_I8 */]: [133 /* WasmOpcode.i64_xor */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [511 /* MintOpcode.MINT_ADD_I4_IMM */]: [106 /* WasmOpcode.i32_add */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [515 /* MintOpcode.MINT_MUL_I4_IMM */]: [108 /* WasmOpcode.i32_mul */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [513 /* MintOpcode.MINT_ADD_I8_IMM */]: [124 /* WasmOpcode.i64_add */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [517 /* MintOpcode.MINT_MUL_I8_IMM */]: [126 /* WasmOpcode.i64_mul */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [434 /* MintOpcode.MINT_NEG_R4 */]: [140 /* WasmOpcode.f32_neg */, 42 /* WasmOpcode.f32_load */, 56 /* WasmOpcode.f32_store */],
    [435 /* MintOpcode.MINT_NEG_R8 */]: [154 /* WasmOpcode.f64_neg */, 43 /* WasmOpcode.f64_load */, 57 /* WasmOpcode.f64_store */],
    [464 /* MintOpcode.MINT_CONV_R4_I4 */]: [178 /* WasmOpcode.f32_convert_s_i32 */, 40 /* WasmOpcode.i32_load */, 56 /* WasmOpcode.f32_store */],
    [467 /* MintOpcode.MINT_CONV_R8_I4 */]: [183 /* WasmOpcode.f64_convert_s_i32 */, 40 /* WasmOpcode.i32_load */, 57 /* WasmOpcode.f64_store */],
    [438 /* MintOpcode.MINT_CONV_R_UN_I4 */]: [184 /* WasmOpcode.f64_convert_u_i32 */, 40 /* WasmOpcode.i32_load */, 57 /* WasmOpcode.f64_store */],
    [465 /* MintOpcode.MINT_CONV_R4_I8 */]: [180 /* WasmOpcode.f32_convert_s_i64 */, 41 /* WasmOpcode.i64_load */, 56 /* WasmOpcode.f32_store */],
    [468 /* MintOpcode.MINT_CONV_R8_I8 */]: [185 /* WasmOpcode.f64_convert_s_i64 */, 41 /* WasmOpcode.i64_load */, 57 /* WasmOpcode.f64_store */],
    [439 /* MintOpcode.MINT_CONV_R_UN_I8 */]: [186 /* WasmOpcode.f64_convert_u_i64 */, 41 /* WasmOpcode.i64_load */, 57 /* WasmOpcode.f64_store */],
    [469 /* MintOpcode.MINT_CONV_R8_R4 */]: [187 /* WasmOpcode.f64_promote_f32 */, 42 /* WasmOpcode.f32_load */, 57 /* WasmOpcode.f64_store */],
    [466 /* MintOpcode.MINT_CONV_R4_R8 */]: [182 /* WasmOpcode.f32_demote_f64 */, 43 /* WasmOpcode.f64_load */, 56 /* WasmOpcode.f32_store */],
    [460 /* MintOpcode.MINT_CONV_I8_I4 */]: [1 /* WasmOpcode.nop */, 52 /* WasmOpcode.i64_load32_s */, 55 /* WasmOpcode.i64_store */],
    [461 /* MintOpcode.MINT_CONV_I8_U4 */]: [1 /* WasmOpcode.nop */, 53 /* WasmOpcode.i64_load32_u */, 55 /* WasmOpcode.i64_store */],
    [444 /* MintOpcode.MINT_CONV_U1_I4 */]: [113 /* WasmOpcode.i32_and */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [452 /* MintOpcode.MINT_CONV_U2_I4 */]: [113 /* WasmOpcode.i32_and */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [440 /* MintOpcode.MINT_CONV_I1_I4 */]: [117 /* WasmOpcode.i32_shr_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [448 /* MintOpcode.MINT_CONV_I2_I4 */]: [117 /* WasmOpcode.i32_shr_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [445 /* MintOpcode.MINT_CONV_U1_I8 */]: [113 /* WasmOpcode.i32_and */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [453 /* MintOpcode.MINT_CONV_U2_I8 */]: [113 /* WasmOpcode.i32_and */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [441 /* MintOpcode.MINT_CONV_I1_I8 */]: [117 /* WasmOpcode.i32_shr_s */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [449 /* MintOpcode.MINT_CONV_I2_I8 */]: [117 /* WasmOpcode.i32_shr_s */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [525 /* MintOpcode.MINT_SHL_I4_IMM */]: [116 /* WasmOpcode.i32_shl */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [526 /* MintOpcode.MINT_SHL_I8_IMM */]: [134 /* WasmOpcode.i64_shl */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [527 /* MintOpcode.MINT_SHR_I4_IMM */]: [117 /* WasmOpcode.i32_shr_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [528 /* MintOpcode.MINT_SHR_I8_IMM */]: [135 /* WasmOpcode.i64_shr_s */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [523 /* MintOpcode.MINT_SHR_UN_I4_IMM */]: [118 /* WasmOpcode.i32_shr_u */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [524 /* MintOpcode.MINT_SHR_UN_I8_IMM */]: [136 /* WasmOpcode.i64_shr_u */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [640 /* MintOpcode.MINT_ROL_I4_IMM */]: [119 /* WasmOpcode.i32_rotl */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [641 /* MintOpcode.MINT_ROL_I8_IMM */]: [137 /* WasmOpcode.i64_rotl */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [642 /* MintOpcode.MINT_ROR_I4_IMM */]: [120 /* WasmOpcode.i32_rotr */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [643 /* MintOpcode.MINT_ROR_I8_IMM */]: [138 /* WasmOpcode.i64_rotr */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [644 /* MintOpcode.MINT_CLZ_I4 */]: [103 /* WasmOpcode.i32_clz */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [646 /* MintOpcode.MINT_CTZ_I4 */]: [104 /* WasmOpcode.i32_ctz */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [648 /* MintOpcode.MINT_POPCNT_I4 */]: [105 /* WasmOpcode.i32_popcnt */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [645 /* MintOpcode.MINT_CLZ_I8 */]: [121 /* WasmOpcode.i64_clz */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [647 /* MintOpcode.MINT_CTZ_I8 */]: [122 /* WasmOpcode.i64_ctz */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [649 /* MintOpcode.MINT_POPCNT_I8 */]: [123 /* WasmOpcode.i64_popcnt */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [512 /* MintOpcode.MINT_ADD_I4_IMM2 */]: [106 /* WasmOpcode.i32_add */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [516 /* MintOpcode.MINT_MUL_I4_IMM2 */]: [108 /* WasmOpcode.i32_mul */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [514 /* MintOpcode.MINT_ADD_I8_IMM2 */]: [124 /* WasmOpcode.i64_add */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [518 /* MintOpcode.MINT_MUL_I8_IMM2 */]: [126 /* WasmOpcode.i64_mul */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [519 /* MintOpcode.MINT_AND_I4_IMM */]: [113 /* WasmOpcode.i32_and */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [520 /* MintOpcode.MINT_AND_I4_IMM2 */]: [113 /* WasmOpcode.i32_and */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [521 /* MintOpcode.MINT_OR_I4_IMM */]: [114 /* WasmOpcode.i32_or */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [522 /* MintOpcode.MINT_OR_I4_IMM2 */]: [114 /* WasmOpcode.i32_or */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
};
// HACK: Generating correct wasm for these is non-trivial so we hand them off to C.
// The opcode specifies whether the operands need to be promoted first.
const intrinsicFpBinops = {
    [394 /* MintOpcode.MINT_CEQ_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [395 /* MintOpcode.MINT_CEQ_R8 */]: 1 /* WasmOpcode.nop */,
    [398 /* MintOpcode.MINT_CNE_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [399 /* MintOpcode.MINT_CNE_R8 */]: 1 /* WasmOpcode.nop */,
    [402 /* MintOpcode.MINT_CGT_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [403 /* MintOpcode.MINT_CGT_R8 */]: 1 /* WasmOpcode.nop */,
    [406 /* MintOpcode.MINT_CGE_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [407 /* MintOpcode.MINT_CGE_R8 */]: 1 /* WasmOpcode.nop */,
    [412 /* MintOpcode.MINT_CGT_UN_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [413 /* MintOpcode.MINT_CGT_UN_R8 */]: 1 /* WasmOpcode.nop */,
    [416 /* MintOpcode.MINT_CLT_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [417 /* MintOpcode.MINT_CLT_R8 */]: 1 /* WasmOpcode.nop */,
    [426 /* MintOpcode.MINT_CLT_UN_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [427 /* MintOpcode.MINT_CLT_UN_R8 */]: 1 /* WasmOpcode.nop */,
    [420 /* MintOpcode.MINT_CLE_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [421 /* MintOpcode.MINT_CLE_R8 */]: 1 /* WasmOpcode.nop */,
    [65536 /* JiterpSpecialOpcode.CGE_UN_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [65537 /* JiterpSpecialOpcode.CLE_UN_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [65535 /* JiterpSpecialOpcode.CNE_UN_R4 */]: 187 /* WasmOpcode.f64_promote_f32 */,
    [65539 /* JiterpSpecialOpcode.CGE_UN_R8 */]: 1 /* WasmOpcode.nop */,
    [65540 /* JiterpSpecialOpcode.CLE_UN_R8 */]: 1 /* WasmOpcode.nop */,
    [65538 /* JiterpSpecialOpcode.CNE_UN_R8 */]: 1 /* WasmOpcode.nop */,
};
const binopTable = {
    [344 /* MintOpcode.MINT_ADD_I4 */]: [106 /* WasmOpcode.i32_add */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [362 /* MintOpcode.MINT_ADD_OVF_I4 */]: [106 /* WasmOpcode.i32_add */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [364 /* MintOpcode.MINT_ADD_OVF_UN_I4 */]: [106 /* WasmOpcode.i32_add */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [348 /* MintOpcode.MINT_SUB_I4 */]: [107 /* WasmOpcode.i32_sub */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [352 /* MintOpcode.MINT_MUL_I4 */]: [108 /* WasmOpcode.i32_mul */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [366 /* MintOpcode.MINT_MUL_OVF_I4 */]: [108 /* WasmOpcode.i32_mul */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [368 /* MintOpcode.MINT_MUL_OVF_UN_I4 */]: [108 /* WasmOpcode.i32_mul */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [356 /* MintOpcode.MINT_DIV_I4 */]: [109 /* WasmOpcode.i32_div_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [360 /* MintOpcode.MINT_DIV_UN_I4 */]: [110 /* WasmOpcode.i32_div_u */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [380 /* MintOpcode.MINT_REM_I4 */]: [111 /* WasmOpcode.i32_rem_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [384 /* MintOpcode.MINT_REM_UN_I4 */]: [112 /* WasmOpcode.i32_rem_u */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [374 /* MintOpcode.MINT_AND_I4 */]: [113 /* WasmOpcode.i32_and */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [376 /* MintOpcode.MINT_OR_I4 */]: [114 /* WasmOpcode.i32_or */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [378 /* MintOpcode.MINT_XOR_I4 */]: [115 /* WasmOpcode.i32_xor */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [388 /* MintOpcode.MINT_SHL_I4 */]: [116 /* WasmOpcode.i32_shl */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [390 /* MintOpcode.MINT_SHR_I4 */]: [117 /* WasmOpcode.i32_shr_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [386 /* MintOpcode.MINT_SHR_UN_I4 */]: [118 /* WasmOpcode.i32_shr_u */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [345 /* MintOpcode.MINT_ADD_I8 */]: [124 /* WasmOpcode.i64_add */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [349 /* MintOpcode.MINT_SUB_I8 */]: [125 /* WasmOpcode.i64_sub */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [353 /* MintOpcode.MINT_MUL_I8 */]: [126 /* WasmOpcode.i64_mul */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [357 /* MintOpcode.MINT_DIV_I8 */]: [127 /* WasmOpcode.i64_div_s */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [381 /* MintOpcode.MINT_REM_I8 */]: [129 /* WasmOpcode.i64_rem_s */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [361 /* MintOpcode.MINT_DIV_UN_I8 */]: [128 /* WasmOpcode.i64_div_u */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [385 /* MintOpcode.MINT_REM_UN_I8 */]: [130 /* WasmOpcode.i64_rem_u */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [375 /* MintOpcode.MINT_AND_I8 */]: [131 /* WasmOpcode.i64_and */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [377 /* MintOpcode.MINT_OR_I8 */]: [132 /* WasmOpcode.i64_or */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [379 /* MintOpcode.MINT_XOR_I8 */]: [133 /* WasmOpcode.i64_xor */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [389 /* MintOpcode.MINT_SHL_I8 */]: [134 /* WasmOpcode.i64_shl */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [391 /* MintOpcode.MINT_SHR_I8 */]: [135 /* WasmOpcode.i64_shr_s */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [387 /* MintOpcode.MINT_SHR_UN_I8 */]: [136 /* WasmOpcode.i64_shr_u */, 41 /* WasmOpcode.i64_load */, 55 /* WasmOpcode.i64_store */],
    [346 /* MintOpcode.MINT_ADD_R4 */]: [146 /* WasmOpcode.f32_add */, 42 /* WasmOpcode.f32_load */, 56 /* WasmOpcode.f32_store */],
    [350 /* MintOpcode.MINT_SUB_R4 */]: [147 /* WasmOpcode.f32_sub */, 42 /* WasmOpcode.f32_load */, 56 /* WasmOpcode.f32_store */],
    [354 /* MintOpcode.MINT_MUL_R4 */]: [148 /* WasmOpcode.f32_mul */, 42 /* WasmOpcode.f32_load */, 56 /* WasmOpcode.f32_store */],
    [358 /* MintOpcode.MINT_DIV_R4 */]: [149 /* WasmOpcode.f32_div */, 42 /* WasmOpcode.f32_load */, 56 /* WasmOpcode.f32_store */],
    [347 /* MintOpcode.MINT_ADD_R8 */]: [160 /* WasmOpcode.f64_add */, 43 /* WasmOpcode.f64_load */, 57 /* WasmOpcode.f64_store */],
    [351 /* MintOpcode.MINT_SUB_R8 */]: [161 /* WasmOpcode.f64_sub */, 43 /* WasmOpcode.f64_load */, 57 /* WasmOpcode.f64_store */],
    [355 /* MintOpcode.MINT_MUL_R8 */]: [162 /* WasmOpcode.f64_mul */, 43 /* WasmOpcode.f64_load */, 57 /* WasmOpcode.f64_store */],
    [359 /* MintOpcode.MINT_DIV_R8 */]: [163 /* WasmOpcode.f64_div */, 43 /* WasmOpcode.f64_load */, 57 /* WasmOpcode.f64_store */],
    [392 /* MintOpcode.MINT_CEQ_I4 */]: [70 /* WasmOpcode.i32_eq */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [396 /* MintOpcode.MINT_CNE_I4 */]: [71 /* WasmOpcode.i32_ne */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [414 /* MintOpcode.MINT_CLT_I4 */]: [72 /* WasmOpcode.i32_lt_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [400 /* MintOpcode.MINT_CGT_I4 */]: [74 /* WasmOpcode.i32_gt_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [418 /* MintOpcode.MINT_CLE_I4 */]: [76 /* WasmOpcode.i32_le_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [404 /* MintOpcode.MINT_CGE_I4 */]: [78 /* WasmOpcode.i32_ge_s */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [424 /* MintOpcode.MINT_CLT_UN_I4 */]: [73 /* WasmOpcode.i32_lt_u */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [410 /* MintOpcode.MINT_CGT_UN_I4 */]: [75 /* WasmOpcode.i32_gt_u */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [422 /* MintOpcode.MINT_CLE_UN_I4 */]: [77 /* WasmOpcode.i32_le_u */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [408 /* MintOpcode.MINT_CGE_UN_I4 */]: [79 /* WasmOpcode.i32_ge_u */, 40 /* WasmOpcode.i32_load */, 54 /* WasmOpcode.i32_store */],
    [393 /* MintOpcode.MINT_CEQ_I8 */]: [81 /* WasmOpcode.i64_eq */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [397 /* MintOpcode.MINT_CNE_I8 */]: [82 /* WasmOpcode.i64_ne */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [415 /* MintOpcode.MINT_CLT_I8 */]: [83 /* WasmOpcode.i64_lt_s */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [401 /* MintOpcode.MINT_CGT_I8 */]: [85 /* WasmOpcode.i64_gt_s */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [419 /* MintOpcode.MINT_CLE_I8 */]: [87 /* WasmOpcode.i64_le_s */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [405 /* MintOpcode.MINT_CGE_I8 */]: [89 /* WasmOpcode.i64_ge_s */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [425 /* MintOpcode.MINT_CLT_UN_I8 */]: [84 /* WasmOpcode.i64_lt_u */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [411 /* MintOpcode.MINT_CGT_UN_I8 */]: [86 /* WasmOpcode.i64_gt_u */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [423 /* MintOpcode.MINT_CLE_UN_I8 */]: [88 /* WasmOpcode.i64_le_u */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
    [409 /* MintOpcode.MINT_CGE_UN_I8 */]: [90 /* WasmOpcode.i64_ge_u */, 41 /* WasmOpcode.i64_load */, 54 /* WasmOpcode.i32_store */],
};
const relopbranchTable = {
    [187 /* MintOpcode.MINT_BEQ_I4_S */]: 392 /* MintOpcode.MINT_CEQ_I4 */,
    [207 /* MintOpcode.MINT_BNE_UN_I4_S */]: 396 /* MintOpcode.MINT_CNE_I4 */,
    [195 /* MintOpcode.MINT_BGT_I4_S */]: 400 /* MintOpcode.MINT_CGT_I4 */,
    [215 /* MintOpcode.MINT_BGT_UN_I4_S */]: 410 /* MintOpcode.MINT_CGT_UN_I4 */,
    [199 /* MintOpcode.MINT_BLT_I4_S */]: 414 /* MintOpcode.MINT_CLT_I4 */,
    [223 /* MintOpcode.MINT_BLT_UN_I4_S */]: 424 /* MintOpcode.MINT_CLT_UN_I4 */,
    [191 /* MintOpcode.MINT_BGE_I4_S */]: 404 /* MintOpcode.MINT_CGE_I4 */,
    [211 /* MintOpcode.MINT_BGE_UN_I4_S */]: 408 /* MintOpcode.MINT_CGE_UN_I4 */,
    [203 /* MintOpcode.MINT_BLE_I4_S */]: 418 /* MintOpcode.MINT_CLE_I4 */,
    [219 /* MintOpcode.MINT_BLE_UN_I4_S */]: 422 /* MintOpcode.MINT_CLE_UN_I4 */,
    [231 /* MintOpcode.MINT_BEQ_I4_SP */]: [392 /* MintOpcode.MINT_CEQ_I4 */, false, true],
    [241 /* MintOpcode.MINT_BNE_UN_I4_SP */]: [396 /* MintOpcode.MINT_CNE_I4 */, false, true],
    [235 /* MintOpcode.MINT_BGT_I4_SP */]: [400 /* MintOpcode.MINT_CGT_I4 */, false, true],
    [245 /* MintOpcode.MINT_BGT_UN_I4_SP */]: [410 /* MintOpcode.MINT_CGT_UN_I4 */, false, true],
    [237 /* MintOpcode.MINT_BLT_I4_SP */]: [414 /* MintOpcode.MINT_CLT_I4 */, false, true],
    [249 /* MintOpcode.MINT_BLT_UN_I4_SP */]: [424 /* MintOpcode.MINT_CLT_UN_I4 */, false, true],
    [233 /* MintOpcode.MINT_BGE_I4_SP */]: [404 /* MintOpcode.MINT_CGE_I4 */, false, true],
    [243 /* MintOpcode.MINT_BGE_UN_I4_SP */]: [408 /* MintOpcode.MINT_CGE_UN_I4 */, false, true],
    [239 /* MintOpcode.MINT_BLE_I4_SP */]: [418 /* MintOpcode.MINT_CLE_I4 */, false, true],
    [247 /* MintOpcode.MINT_BLE_UN_I4_SP */]: [422 /* MintOpcode.MINT_CLE_UN_I4 */, false, true],
    [251 /* MintOpcode.MINT_BEQ_I4_IMM_SP */]: [392 /* MintOpcode.MINT_CEQ_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [261 /* MintOpcode.MINT_BNE_UN_I4_IMM_SP */]: [396 /* MintOpcode.MINT_CNE_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [255 /* MintOpcode.MINT_BGT_I4_IMM_SP */]: [400 /* MintOpcode.MINT_CGT_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [265 /* MintOpcode.MINT_BGT_UN_I4_IMM_SP */]: [410 /* MintOpcode.MINT_CGT_UN_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [257 /* MintOpcode.MINT_BLT_I4_IMM_SP */]: [414 /* MintOpcode.MINT_CLT_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [269 /* MintOpcode.MINT_BLT_UN_I4_IMM_SP */]: [424 /* MintOpcode.MINT_CLT_UN_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [253 /* MintOpcode.MINT_BGE_I4_IMM_SP */]: [404 /* MintOpcode.MINT_CGE_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [263 /* MintOpcode.MINT_BGE_UN_I4_IMM_SP */]: [408 /* MintOpcode.MINT_CGE_UN_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [259 /* MintOpcode.MINT_BLE_I4_IMM_SP */]: [418 /* MintOpcode.MINT_CLE_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [267 /* MintOpcode.MINT_BLE_UN_I4_IMM_SP */]: [422 /* MintOpcode.MINT_CLE_UN_I4 */, 65 /* WasmOpcode.i32_const */, true],
    [188 /* MintOpcode.MINT_BEQ_I8_S */]: 393 /* MintOpcode.MINT_CEQ_I8 */,
    [208 /* MintOpcode.MINT_BNE_UN_I8_S */]: 397 /* MintOpcode.MINT_CNE_I8 */,
    [196 /* MintOpcode.MINT_BGT_I8_S */]: 401 /* MintOpcode.MINT_CGT_I8 */,
    [216 /* MintOpcode.MINT_BGT_UN_I8_S */]: 411 /* MintOpcode.MINT_CGT_UN_I8 */,
    [200 /* MintOpcode.MINT_BLT_I8_S */]: 415 /* MintOpcode.MINT_CLT_I8 */,
    [224 /* MintOpcode.MINT_BLT_UN_I8_S */]: 425 /* MintOpcode.MINT_CLT_UN_I8 */,
    [192 /* MintOpcode.MINT_BGE_I8_S */]: 405 /* MintOpcode.MINT_CGE_I8 */,
    [212 /* MintOpcode.MINT_BGE_UN_I8_S */]: 409 /* MintOpcode.MINT_CGE_UN_I8 */,
    [204 /* MintOpcode.MINT_BLE_I8_S */]: 419 /* MintOpcode.MINT_CLE_I8 */,
    [220 /* MintOpcode.MINT_BLE_UN_I8_S */]: 423 /* MintOpcode.MINT_CLE_UN_I8 */,
    [252 /* MintOpcode.MINT_BEQ_I8_IMM_SP */]: [393 /* MintOpcode.MINT_CEQ_I8 */, 66 /* WasmOpcode.i64_const */, true],
    // FIXME: Missing compare opcode
    // [MintOpcode.MINT_BNE_UN_I8_IMM_SP]: [MintOpcode.MINT_CNE_UN_I8, WasmOpcode.i64_const, true],
    [256 /* MintOpcode.MINT_BGT_I8_IMM_SP */]: [401 /* MintOpcode.MINT_CGT_I8 */, 66 /* WasmOpcode.i64_const */, true],
    [266 /* MintOpcode.MINT_BGT_UN_I8_IMM_SP */]: [411 /* MintOpcode.MINT_CGT_UN_I8 */, 66 /* WasmOpcode.i64_const */, true],
    [258 /* MintOpcode.MINT_BLT_I8_IMM_SP */]: [415 /* MintOpcode.MINT_CLT_I8 */, 66 /* WasmOpcode.i64_const */, true],
    [270 /* MintOpcode.MINT_BLT_UN_I8_IMM_SP */]: [425 /* MintOpcode.MINT_CLT_UN_I8 */, 66 /* WasmOpcode.i64_const */, true],
    [254 /* MintOpcode.MINT_BGE_I8_IMM_SP */]: [405 /* MintOpcode.MINT_CGE_I8 */, 66 /* WasmOpcode.i64_const */, true],
    [264 /* MintOpcode.MINT_BGE_UN_I8_IMM_SP */]: [409 /* MintOpcode.MINT_CGE_UN_I8 */, 66 /* WasmOpcode.i64_const */, true],
    [260 /* MintOpcode.MINT_BLE_I8_IMM_SP */]: [419 /* MintOpcode.MINT_CLE_I8 */, 66 /* WasmOpcode.i64_const */, true],
    [268 /* MintOpcode.MINT_BLE_UN_I8_IMM_SP */]: [423 /* MintOpcode.MINT_CLE_UN_I8 */, 66 /* WasmOpcode.i64_const */, true],
    [189 /* MintOpcode.MINT_BEQ_R4_S */]: 394 /* MintOpcode.MINT_CEQ_R4 */,
    [209 /* MintOpcode.MINT_BNE_UN_R4_S */]: 65535 /* JiterpSpecialOpcode.CNE_UN_R4 */,
    [197 /* MintOpcode.MINT_BGT_R4_S */]: 402 /* MintOpcode.MINT_CGT_R4 */,
    [217 /* MintOpcode.MINT_BGT_UN_R4_S */]: 412 /* MintOpcode.MINT_CGT_UN_R4 */,
    [201 /* MintOpcode.MINT_BLT_R4_S */]: 416 /* MintOpcode.MINT_CLT_R4 */,
    [225 /* MintOpcode.MINT_BLT_UN_R4_S */]: 426 /* MintOpcode.MINT_CLT_UN_R4 */,
    [193 /* MintOpcode.MINT_BGE_R4_S */]: 406 /* MintOpcode.MINT_CGE_R4 */,
    [213 /* MintOpcode.MINT_BGE_UN_R4_S */]: 65536 /* JiterpSpecialOpcode.CGE_UN_R4 */,
    [205 /* MintOpcode.MINT_BLE_R4_S */]: 420 /* MintOpcode.MINT_CLE_R4 */,
    [221 /* MintOpcode.MINT_BLE_UN_R4_S */]: 65537 /* JiterpSpecialOpcode.CLE_UN_R4 */,
    [190 /* MintOpcode.MINT_BEQ_R8_S */]: 395 /* MintOpcode.MINT_CEQ_R8 */,
    [210 /* MintOpcode.MINT_BNE_UN_R8_S */]: 65538 /* JiterpSpecialOpcode.CNE_UN_R8 */,
    [198 /* MintOpcode.MINT_BGT_R8_S */]: 403 /* MintOpcode.MINT_CGT_R8 */,
    [218 /* MintOpcode.MINT_BGT_UN_R8_S */]: 413 /* MintOpcode.MINT_CGT_UN_R8 */,
    [202 /* MintOpcode.MINT_BLT_R8_S */]: 417 /* MintOpcode.MINT_CLT_R8 */,
    [226 /* MintOpcode.MINT_BLT_UN_R8_S */]: 427 /* MintOpcode.MINT_CLT_UN_R8 */,
    [194 /* MintOpcode.MINT_BGE_R8_S */]: 407 /* MintOpcode.MINT_CGE_R8 */,
    [214 /* MintOpcode.MINT_BGE_UN_R8_S */]: 65539 /* JiterpSpecialOpcode.CGE_UN_R8 */,
    [206 /* MintOpcode.MINT_BLE_R8_S */]: 421 /* MintOpcode.MINT_CLE_R8 */,
    [222 /* MintOpcode.MINT_BLE_UN_R8_S */]: 65540 /* JiterpSpecialOpcode.CLE_UN_R8 */,
};
const mathIntrinsicTable = {
    [599 /* MintOpcode.MINT_SQRT */]: [true, false, 159 /* WasmOpcode.f64_sqrt */],
    [626 /* MintOpcode.MINT_SQRTF */]: [true, true, 145 /* WasmOpcode.f32_sqrt */],
    [586 /* MintOpcode.MINT_CEILING */]: [true, false, 155 /* WasmOpcode.f64_ceil */],
    [613 /* MintOpcode.MINT_CEILINGF */]: [true, true, 141 /* WasmOpcode.f32_ceil */],
    [592 /* MintOpcode.MINT_FLOOR */]: [true, false, 156 /* WasmOpcode.f64_floor */],
    [619 /* MintOpcode.MINT_FLOORF */]: [true, true, 142 /* WasmOpcode.f32_floor */],
    [603 /* MintOpcode.MINT_ABS */]: [true, false, 153 /* WasmOpcode.f64_abs */],
    [630 /* MintOpcode.MINT_ABSF */]: [true, true, 139 /* WasmOpcode.f32_abs */],
    [581 /* MintOpcode.MINT_ACOS */]: [true, false, "acos"],
    [608 /* MintOpcode.MINT_ACOSF */]: [true, true, "acosf"],
    [582 /* MintOpcode.MINT_ACOSH */]: [true, false, "acosh"],
    [609 /* MintOpcode.MINT_ACOSHF */]: [true, true, "acoshf"],
    [587 /* MintOpcode.MINT_COS */]: [true, false, "cos"],
    [614 /* MintOpcode.MINT_COSF */]: [true, true, "cosf"],
    [579 /* MintOpcode.MINT_ASIN */]: [true, false, "asin"],
    [606 /* MintOpcode.MINT_ASINF */]: [true, true, "asinf"],
    [580 /* MintOpcode.MINT_ASINH */]: [true, false, "asinh"],
    [607 /* MintOpcode.MINT_ASINHF */]: [true, true, "asinhf"],
    [598 /* MintOpcode.MINT_SIN */]: [true, false, "sin"],
    [625 /* MintOpcode.MINT_SINF */]: [true, true, "sinf"],
    [583 /* MintOpcode.MINT_ATAN */]: [true, false, "atan"],
    [610 /* MintOpcode.MINT_ATANF */]: [true, true, "atanf"],
    [584 /* MintOpcode.MINT_ATANH */]: [true, false, "atanh"],
    [611 /* MintOpcode.MINT_ATANHF */]: [true, true, "atanhf"],
    [601 /* MintOpcode.MINT_TAN */]: [true, false, "tan"],
    [628 /* MintOpcode.MINT_TANF */]: [true, true, "tanf"],
    [588 /* MintOpcode.MINT_CBRT */]: [true, false, "cbrt"],
    [615 /* MintOpcode.MINT_CBRTF */]: [true, true, "cbrtf"],
    [590 /* MintOpcode.MINT_EXP */]: [true, false, "exp"],
    [617 /* MintOpcode.MINT_EXPF */]: [true, true, "expf"],
    [593 /* MintOpcode.MINT_LOG */]: [true, false, "log"],
    [620 /* MintOpcode.MINT_LOGF */]: [true, true, "logf"],
    [594 /* MintOpcode.MINT_LOG2 */]: [true, false, "log2"],
    [621 /* MintOpcode.MINT_LOG2F */]: [true, true, "log2f"],
    [595 /* MintOpcode.MINT_LOG10 */]: [true, false, "log10"],
    [622 /* MintOpcode.MINT_LOG10F */]: [true, true, "log10f"],
    [604 /* MintOpcode.MINT_MIN */]: [false, false, 164 /* WasmOpcode.f64_min */],
    [631 /* MintOpcode.MINT_MINF */]: [false, true, 150 /* WasmOpcode.f32_min */],
    [605 /* MintOpcode.MINT_MAX */]: [false, false, 165 /* WasmOpcode.f64_max */],
    [632 /* MintOpcode.MINT_MAXF */]: [false, true, 151 /* WasmOpcode.f32_max */],
    [585 /* MintOpcode.MINT_ATAN2 */]: [false, false, "atan2"],
    [612 /* MintOpcode.MINT_ATAN2F */]: [false, true, "atan2f"],
    [596 /* MintOpcode.MINT_POW */]: [false, false, "pow"],
    [623 /* MintOpcode.MINT_POWF */]: [false, true, "powf"],
    [383 /* MintOpcode.MINT_REM_R8 */]: [false, false, "fmod"],
    [382 /* MintOpcode.MINT_REM_R4 */]: [false, true, "fmodf"],
};
const xchgTable = {
    [560 /* MintOpcode.MINT_MONO_EXCHANGE_U1 */]: [67 /* WasmAtomicOpcode.i32_atomic_rmw8_xchg_u */, 0 /* WasmOpcode.unreachable */, 0],
    [561 /* MintOpcode.MINT_MONO_EXCHANGE_I1 */]: [67 /* WasmAtomicOpcode.i32_atomic_rmw8_xchg_u */, 192 /* WasmOpcode.i32_extend_8_s */, 0],
    [562 /* MintOpcode.MINT_MONO_EXCHANGE_U2 */]: [68 /* WasmAtomicOpcode.i32_atomic_rmw16_xchg_u */, 0 /* WasmOpcode.unreachable */, 1],
    [563 /* MintOpcode.MINT_MONO_EXCHANGE_I2 */]: [68 /* WasmAtomicOpcode.i32_atomic_rmw16_xchg_u */, 193 /* WasmOpcode.i32_extend_16_s */, 1],
    [564 /* MintOpcode.MINT_MONO_EXCHANGE_I4 */]: [65 /* WasmAtomicOpcode.i32_atomic_rmw_xchg */, 0 /* WasmOpcode.unreachable */, 2],
    [565 /* MintOpcode.MINT_MONO_EXCHANGE_I8 */]: [66 /* WasmAtomicOpcode.i64_atomic_rmw_xchg */, 0 /* WasmOpcode.unreachable */, 3],
};
const cmpxchgTable = {
    [566 /* MintOpcode.MINT_MONO_CMPXCHG_U1 */]: [74 /* WasmAtomicOpcode.i32_atomic_rmw8_cmpxchg_u */, 0 /* WasmOpcode.unreachable */, 0],
    [567 /* MintOpcode.MINT_MONO_CMPXCHG_I1 */]: [74 /* WasmAtomicOpcode.i32_atomic_rmw8_cmpxchg_u */, 192 /* WasmOpcode.i32_extend_8_s */, 0],
    [568 /* MintOpcode.MINT_MONO_CMPXCHG_U2 */]: [75 /* WasmAtomicOpcode.i32_atomic_rmw16_cmpxchg_u */, 0 /* WasmOpcode.unreachable */, 1],
    [569 /* MintOpcode.MINT_MONO_CMPXCHG_I2 */]: [75 /* WasmAtomicOpcode.i32_atomic_rmw16_cmpxchg_u */, 193 /* WasmOpcode.i32_extend_16_s */, 1],
    [570 /* MintOpcode.MINT_MONO_CMPXCHG_I4 */]: [72 /* WasmAtomicOpcode.i32_atomic_rmw_cmpxchg */, 0 /* WasmOpcode.unreachable */, 2],
    [571 /* MintOpcode.MINT_MONO_CMPXCHG_I8 */]: [73 /* WasmAtomicOpcode.i64_atomic_rmw_cmpxchg */, 0 /* WasmOpcode.unreachable */, 3],
};
const simdCreateSizes = {
    [653 /* MintOpcode.MINT_SIMD_V128_I1_CREATE */]: 1,
    [654 /* MintOpcode.MINT_SIMD_V128_I2_CREATE */]: 2,
    [655 /* MintOpcode.MINT_SIMD_V128_I4_CREATE */]: 4,
    [656 /* MintOpcode.MINT_SIMD_V128_I8_CREATE */]: 8,
};
const simdCreateLoadOps = {
    [653 /* MintOpcode.MINT_SIMD_V128_I1_CREATE */]: 44 /* WasmOpcode.i32_load8_s */,
    [654 /* MintOpcode.MINT_SIMD_V128_I2_CREATE */]: 46 /* WasmOpcode.i32_load16_s */,
    [655 /* MintOpcode.MINT_SIMD_V128_I4_CREATE */]: 40 /* WasmOpcode.i32_load */,
    [656 /* MintOpcode.MINT_SIMD_V128_I8_CREATE */]: 41 /* WasmOpcode.i64_load */,
};
const simdCreateStoreOps = {
    [653 /* MintOpcode.MINT_SIMD_V128_I1_CREATE */]: 58 /* WasmOpcode.i32_store8 */,
    [654 /* MintOpcode.MINT_SIMD_V128_I2_CREATE */]: 59 /* WasmOpcode.i32_store16 */,
    [655 /* MintOpcode.MINT_SIMD_V128_I4_CREATE */]: 54 /* WasmOpcode.i32_store */,
    [656 /* MintOpcode.MINT_SIMD_V128_I8_CREATE */]: 55 /* WasmOpcode.i64_store */,
};
const simdShiftTable = new Set([
    20 /* SimdIntrinsic3.V128_I1_LEFT_SHIFT */,
    21 /* SimdIntrinsic3.V128_I2_LEFT_SHIFT */,
    22 /* SimdIntrinsic3.V128_I4_LEFT_SHIFT */,
    23 /* SimdIntrinsic3.V128_I8_LEFT_SHIFT */,
    24 /* SimdIntrinsic3.V128_I1_RIGHT_SHIFT */,
    25 /* SimdIntrinsic3.V128_I2_RIGHT_SHIFT */,
    26 /* SimdIntrinsic3.V128_I4_RIGHT_SHIFT */,
    27 /* SimdIntrinsic3.V128_I1_URIGHT_SHIFT */,
    28 /* SimdIntrinsic3.V128_I2_URIGHT_SHIFT */,
    29 /* SimdIntrinsic3.V128_I4_URIGHT_SHIFT */,
    30 /* SimdIntrinsic3.V128_I8_URIGHT_SHIFT */,
]);
const simdExtractTable = {
    [51 /* SimdIntrinsic3.ExtractScalarI1 */]: [16, 54 /* WasmOpcode.i32_store */],
    [52 /* SimdIntrinsic3.ExtractScalarU1 */]: [16, 54 /* WasmOpcode.i32_store */],
    [53 /* SimdIntrinsic3.ExtractScalarI2 */]: [8, 54 /* WasmOpcode.i32_store */],
    [54 /* SimdIntrinsic3.ExtractScalarU2 */]: [8, 54 /* WasmOpcode.i32_store */],
    [55 /* SimdIntrinsic3.ExtractScalarD4 */]: [4, 54 /* WasmOpcode.i32_store */],
    [57 /* SimdIntrinsic3.ExtractScalarR4 */]: [4, 56 /* WasmOpcode.f32_store */],
    [56 /* SimdIntrinsic3.ExtractScalarD8 */]: [2, 55 /* WasmOpcode.i64_store */],
    [58 /* SimdIntrinsic3.ExtractScalarR8 */]: [2, 57 /* WasmOpcode.f64_store */],
};
const simdReplaceTable = {
    [1 /* SimdIntrinsic4.ReplaceScalarD1 */]: [16, 40 /* WasmOpcode.i32_load */],
    [2 /* SimdIntrinsic4.ReplaceScalarD2 */]: [8, 40 /* WasmOpcode.i32_load */],
    [3 /* SimdIntrinsic4.ReplaceScalarD4 */]: [4, 40 /* WasmOpcode.i32_load */],
    [5 /* SimdIntrinsic4.ReplaceScalarR4 */]: [4, 42 /* WasmOpcode.f32_load */],
    [4 /* SimdIntrinsic4.ReplaceScalarD8 */]: [2, 41 /* WasmOpcode.i64_load */],
    [6 /* SimdIntrinsic4.ReplaceScalarR8 */]: [2, 43 /* WasmOpcode.f64_load */],
};
const simdLoadTable = new Set([
    81 /* SimdIntrinsic2.LoadVector128ANY */,
    84 /* SimdIntrinsic2.LoadScalarAndSplatVector128X1 */,
    85 /* SimdIntrinsic2.LoadScalarAndSplatVector128X2 */,
    86 /* SimdIntrinsic2.LoadScalarAndSplatVector128X4 */,
    87 /* SimdIntrinsic2.LoadScalarAndSplatVector128X8 */,
    82 /* SimdIntrinsic2.LoadScalarVector128X4 */,
    83 /* SimdIntrinsic2.LoadScalarVector128X8 */,
    88 /* SimdIntrinsic2.LoadWideningVector128I1 */,
    89 /* SimdIntrinsic2.LoadWideningVector128U1 */,
    90 /* SimdIntrinsic2.LoadWideningVector128I2 */,
    91 /* SimdIntrinsic2.LoadWideningVector128U2 */,
    92 /* SimdIntrinsic2.LoadWideningVector128I4 */,
    93 /* SimdIntrinsic2.LoadWideningVector128U4 */,
]);
const simdStoreTable = {
    [13 /* SimdIntrinsic4.StoreSelectedScalarX1 */]: [16],
    [14 /* SimdIntrinsic4.StoreSelectedScalarX2 */]: [8],
    [15 /* SimdIntrinsic4.StoreSelectedScalarX4 */]: [4],
    [16 /* SimdIntrinsic4.StoreSelectedScalarX8 */]: [2],
};
const bitmaskTable = {
    [10 /* SimdIntrinsic2.V128_I1_EXTRACT_MSB */]: 100 /* WasmSimdOpcode.i8x16_bitmask */,
    [11 /* SimdIntrinsic2.V128_I2_EXTRACT_MSB */]: 132 /* WasmSimdOpcode.i16x8_bitmask */,
    [12 /* SimdIntrinsic2.V128_I4_EXTRACT_MSB */]: 164 /* WasmSimdOpcode.i32x4_bitmask */,
    [13 /* SimdIntrinsic2.V128_I8_EXTRACT_MSB */]: 196 /* WasmSimdOpcode.i64x2_bitmask */,
};
const createScalarTable = {
    [6 /* SimdIntrinsic2.V128_I1_CREATE_SCALAR */]: [44 /* WasmOpcode.i32_load8_s */, 23 /* WasmSimdOpcode.i8x16_replace_lane */],
    [7 /* SimdIntrinsic2.V128_I2_CREATE_SCALAR */]: [46 /* WasmOpcode.i32_load16_s */, 26 /* WasmSimdOpcode.i16x8_replace_lane */],
    [8 /* SimdIntrinsic2.V128_I4_CREATE_SCALAR */]: [40 /* WasmOpcode.i32_load */, 28 /* WasmSimdOpcode.i32x4_replace_lane */],
    [9 /* SimdIntrinsic2.V128_I8_CREATE_SCALAR */]: [41 /* WasmOpcode.i64_load */, 30 /* WasmSimdOpcode.i64x2_replace_lane */],
};

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// indexPlusOne so that ip[1] in the interpreter becomes getArgU16(ip, 1)
function getArgU16(ip, indexPlusOne) {
    return getU16(ip + (2 * indexPlusOne));
}
function getArgI16(ip, indexPlusOne) {
    return getI16(ip + (2 * indexPlusOne));
}
function getArgU32(ip, indexPlusOne) {
    const src = ip + (2 * indexPlusOne);
    return getU32_unaligned(src);
}
function getArgI32(ip, indexPlusOne) {
    const src = ip + (2 * indexPlusOne);
    return getI32_unaligned(src);
}
function getArgF32(ip, indexPlusOne) {
    const src = ip + (2 * indexPlusOne);
    return getF32_unaligned(src);
}
function getArgF64(ip, indexPlusOne) {
    const src = ip + (2 * indexPlusOne);
    return getF64_unaligned(src);
}
function get_imethod(frame) {
    // FIXME: Encoding this data directly into the trace will prevent trace reuse
    const iMethod = getU32_unaligned(frame + getMemberOffset(4 /* JiterpMember.Imethod */));
    return iMethod;
}
function get_imethod_data(frame, index) {
    // FIXME: Encoding this data directly into the trace will prevent trace reuse
    const pData = getU32_unaligned(get_imethod(frame) + getMemberOffset(5 /* JiterpMember.DataItems */));
    const dataOffset = pData + (index * sizeOfDataItem);
    return getU32_unaligned(dataOffset);
}
function get_imethod_clause_data_offset(frame, index) {
    // FIXME: Encoding this data directly into the trace will prevent trace reuse
    const pData = getU32_unaligned(get_imethod(frame) + getMemberOffset(12 /* JiterpMember.ClauseDataOffsets */));
    const dataOffset = pData + (index * sizeOfDataItem);
    return getU32_unaligned(dataOffset);
}
function is_backward_branch_target(ip, startOfBody, backwardBranchTable) {
    if (!backwardBranchTable)
        return false;
    // TODO: sort the table and exploit that for faster scan. Not important yet
    for (let i = 0; i < backwardBranchTable.length; i++) {
        const actualOffset = (backwardBranchTable[i] * 2) + startOfBody;
        if (actualOffset === ip)
            return true;
    }
    return false;
}
const knownConstants = new Map();
function get_known_constant(builder, localOffset) {
    if (isAddressTaken(builder, localOffset))
        return undefined;
    return knownConstants.get(localOffset);
}
function get_known_constant_value(builder, localOffset) {
    const kc = get_known_constant(builder, localOffset);
    if (kc === undefined)
        return undefined;
    switch (kc.type) {
        case "i32":
        case "v128":
            return kc.value;
    }
    return undefined;
}
function getOpcodeLengthU16(ip, opcode) {
    try {
        const opLengthU16 = wrapped_c_functions.mono_jiterp_get_opcode_info(opcode, 1 /* OpcodeInfoType.Length */);
        let result = opLengthU16;
        if (opcode === 271 /* MintOpcode.MINT_SWITCH */) {
            // int n = READ32 (ip + 2);
            // len = MINT_SWITCH_LEN (n);
            const numDisplacements = getArgU32(ip, 2);
            // #define MINT_SWITCH_LEN(n) (4 + (n) * 2)
            result = 4 + (numDisplacements * 2);
        }
        return result;
    }
    catch (err) {
        mono_log_error(`Found invalid opcode ${opcode} at ip ${ip}`);
        throw err;
    }
}
function decodeSwitch(ip) {
    if (!(getU16(ip) === 271 /* MintOpcode.MINT_SWITCH */)) mono_assert(false, "decodeSwitch called on a non-switch"); // inlined mono_assert condition
    const n = getArgU32(ip, 2);
    const result = [];
    /*
        guint32 val = LOCAL_VAR (ip [1], guint32);
        guint32 n = READ32 (ip + 2);
        ip += 4;
        if (val < n) {
            ip += 2 * val;
            int offset = READ32 (ip);
            ip += offset;
        } else {
            ip += 2 * n;
        }
    */
    // mono_log_info(`switch[${n}] @${ip}`);
    for (let i = 0; i < n; i++) {
        const base = ip + 8 + (4 * i), offset = getU32_unaligned(base), target = base + (offset * 2);
        // mono_log_info(`  ${i} -> ${target}`);
        result.push(target);
    }
    return result;
}
// Perform a quick scan through the opcodes potentially in this trace to build a table of
//  backwards branch targets, compatible with the layout of the old one that was generated in C.
// We do this here to match the exact way that the jiterp calculates branch targets, since
//  there were previously corner cases where jiterp and interp disagreed.
function generateBackwardBranchTable(ip, startOfBody, sizeOfBody) {
    const endOfBody = startOfBody + sizeOfBody;
    // TODO: Cache this table object instance and reuse it to reduce gc pressure?
    const table = [];
    // IP of the start of the trace in U16s, relative to startOfBody.
    const rbase16 = (ip - startOfBody) / 2;
    // FIXME: This will potentially scan the entire method and record branches that won't
    //  ever run since the trace compilation will end before we reach them.
    while (ip < endOfBody) {
        // IP of the current opcode in U16s, relative to startOfBody. This is what the back branch table uses
        const rip16 = (ip - startOfBody) / 2;
        const opcode = getU16(ip);
        const opLengthU16 = getOpcodeLengthU16(ip, opcode);
        if (opcode === 271 /* MintOpcode.MINT_SWITCH */) {
            // FIXME: Once the cfg supports back-branches in jump tables, uncomment this to
            //  insert the back-branch targets into the table so they'll actually work
            /*
            const switchTable = decodeSwitch(ip);
            for (const target of switchTable) {
                const rtarget16 = (<any>target - <any>startOfBody) / 2;
                if (target < ip)
                    table.push(rtarget16);
            }
            */
        }
        else {
            // Any opcode with a branch argtype will have a decoded displacement, even if we don't
            //  implement the opcode. Everything else will return undefined here and be skipped
            const displacement = getBranchDisplacement(ip, opcode);
            if (typeof (displacement) !== "number") {
                ip += (opLengthU16 * 2);
                continue;
            }
            // These checks shouldn't fail unless memory is corrupted or something is wrong with the decoder.
            // We don't want to cause decoder bugs to make the application exit, though - graceful degradation.
            if (displacement === 0) {
                mono_log_info(`opcode @${ip} branch target is self. aborting backbranch table generation`);
                break;
            }
            // Only record *backward* branches
            // We will filter this down further in the Cfg because it takes note of which branches it sees,
            //  but it is also beneficial to have a null table (further down) due to seeing no potential
            //  back branch targets at all, as it allows the Cfg to skip additional code generation entirely
            //  if it knows there will never be any backwards branches in a given trace
            if (displacement < 0) {
                const rtarget16 = rip16 + (displacement);
                if (rtarget16 < 0) {
                    mono_log_info(`opcode @${ip}'s displacement of ${displacement} goes before body: ${rtarget16}. aborting backbranch table generation`);
                    break;
                }
                // If the relative target is before the start of the trace, don't record it.
                // The trace will be unable to successfully branch to it so it would just make the table bigger.
                if (rtarget16 >= rbase16)
                    table.push(rtarget16);
            }
            switch (opcode) {
                case 132 /* MintOpcode.MINT_CALL_HANDLER */:
                case 133 /* MintOpcode.MINT_CALL_HANDLER_S */:
                    // While this formally isn't a backward branch target, we want to record
                    //  the offset of its following instruction so that the jiterpreter knows
                    //  to generate the necessary dispatch code to enable branching back to it.
                    table.push(rip16 + opLengthU16);
                    break;
            }
        }
        ip += (opLengthU16 * 2);
    }
    if (table.length <= 0)
        return null;
    // Not important yet, so not doing it
    // table.sort((a, b) => a - b);
    return new Uint16Array(table);
}
function generateWasmBody(frame, traceName, ip, startOfBody, endOfBody, builder, instrumentedTraceId, backwardBranchTable) {
    const abort = 0;
    let isFirstInstruction = true, isConditionallyExecuted = false, pruneOpcodes = false, hasEmittedUnreachable = false;
    let result = 0, prologueOpcodeCounter = 0, conditionalOpcodeCounter = 0;
    eraseInferredState();
    // If a trace is instrumented, also activate back branch tracing
    builder.backBranchTraceLevel = instrumentedTraceId
        ? 2
        : defaultTraceBackBranches;
    // Record the address of our prepare_jiterpreter opcode as the entry point, not the opcode after it.
    // Some back-branches will target prepare_jiterpreter directly, and we need them to work.
    let rip = builder.cfg.entry(ip);
    while (ip) {
        // This means some code went 'ip = abort; continue'
        if (!ip)
            break;
        builder.cfg.ip = ip;
        if (ip >= endOfBody) {
            record_abort(builder.traceIndex, ip, traceName, "end-of-body");
            if (instrumentedTraceId)
                mono_log_info(`instrumented trace ${traceName} exited at end of body @${ip.toString(16)}`);
            break;
        }
        const maxBytesGenerated = builder.options.maxModuleSize - moduleHeaderSizeMargin, spaceLeft = maxBytesGenerated - builder.bytesGeneratedSoFar - builder.cfg.overheadBytes;
        if (builder.size >= spaceLeft) {
            // mono_log_info(`trace too big, estimated size is ${builder.size + builder.bytesGeneratedSoFar}`);
            record_abort(builder.traceIndex, ip, traceName, "trace-too-big");
            if (instrumentedTraceId)
                mono_log_info(`instrumented trace ${traceName} exited because of size limit at @${ip.toString(16)} (spaceLeft=${spaceLeft}b)`);
            break;
        }
        if (instrumentedTraceId && traceEip) {
            builder.i32_const(instrumentedTraceId);
            builder.ip_const(ip);
            builder.callImport("trace_eip");
        }
        let opcode = getU16(ip);
        const numSregs = wrapped_c_functions.mono_jiterp_get_opcode_info(opcode, 2 /* OpcodeInfoType.Sregs */), numDregs = wrapped_c_functions.mono_jiterp_get_opcode_info(opcode, 3 /* OpcodeInfoType.Dregs */), opLengthU16 = getOpcodeLengthU16(ip, opcode);
        const isSimdIntrins = (opcode >= 657 /* MintOpcode.MINT_SIMD_INTRINS_P_P */) &&
            (opcode <= 659 /* MintOpcode.MINT_SIMD_INTRINS_P_PPP */);
        const simdIntrinsArgCount = isSimdIntrins
            ? opcode - 657 /* MintOpcode.MINT_SIMD_INTRINS_P_P */ + 2
            : 0;
        const simdIntrinsIndex = isSimdIntrins
            ? getArgU16(ip, 1 + simdIntrinsArgCount)
            : 0;
        if (!((opcode >= 0) && (opcode < 691 /* MintOpcode.MINT_LASTOP */))) mono_assert(false, `invalid opcode ${opcode}`); // inlined mono_assert condition
        const opname = isSimdIntrins
            ? SimdInfo[simdIntrinsArgCount][simdIntrinsIndex]
            : getOpcodeName(opcode);
        const _ip = ip;
        const isBackBranchTarget = builder.options.noExitBackwardBranches &&
            is_backward_branch_target(ip, startOfBody, backwardBranchTable), isForwardBranchTarget = builder.branchTargets.has(ip), startBranchBlock = isBackBranchTarget || isForwardBranchTarget ||
            // If a method contains backward branches, we also need to check eip at the first insn
            //  because a backward branch might target a point in the middle of the trace
            (isFirstInstruction && backwardBranchTable), 
        // We want to approximate the number of unconditionally executed instructions along with
        //  the ones that were probably conditionally executed by the time we reached the exit point
        // We don't know the exact path that would have taken us to a given point, but it's a reasonable
        //  guess that methods dense with branches are more likely to take a complex path to reach
        //  a given exit
        exitOpcodeCounter = conditionalOpcodeCounter + prologueOpcodeCounter +
            builder.branchTargets.size;
        let skipDregInvalidation = false, opcodeValue = getOpcodeTableValue(opcode);
        // We record the offset of each backward branch we encounter, so that later branch
        //  opcodes know that it's available by branching to the top of the dispatch loop
        if (isBackBranchTarget) {
            if (builder.backBranchTraceLevel > 1)
                mono_log_info(`${traceName} recording back branch target 0x${ip.toString(16)}`);
            builder.backBranchOffsets.push(ip);
        }
        if (startBranchBlock) {
            // We've reached a branch target so we need to stop pruning opcodes, since
            //  we are no longer in a dead zone that execution can't reach
            pruneOpcodes = false;
            hasEmittedUnreachable = false;
            // If execution runs past the end of the current branch block, ensure
            //  that the instruction pointer is updated appropriately. This will
            //  also guarantee that the branch target block's comparison will
            //  succeed so that execution continues.
            // We make sure above that this isn't done for the start of the trace,
            //  otherwise loops will run forever and never terminate since after
            //  branching to the top of the loop we would blow away eip
            append_branch_target_block(builder, ip, isBackBranchTarget);
            isConditionallyExecuted = true;
            eraseInferredState();
            // Monitoring wants an opcode count that is a measurement of how many opcodes
            //  we definitely executed, so we want to ignore any opcodes that might
            //  have been skipped due to forward branching. This gives us an approximation
            //  of that by only counting how far we are from the most recent branch target
            conditionalOpcodeCounter = 0;
        }
        // Handle the _OUTSIDE_BRANCH_BLOCK table entries
        if ((opcodeValue < -1) && isConditionallyExecuted)
            opcodeValue = (opcodeValue === -2) ? 2 : 0;
        isFirstInstruction = false;
        if (opcode === 271 /* MintOpcode.MINT_SWITCH */) {
            // HACK: This opcode breaks all our table-based parsing and will cause the trace compiler to hang
            //  if it encounters a switch inside of a pruning region, so we need to let the normal code path
            //  run even if pruning is on
        }
        else if (disabledOpcodes.indexOf(opcode) >= 0) {
            append_bailout(builder, ip, 23 /* BailoutReason.Debugging */);
            opcode = 678 /* MintOpcode.MINT_NOP */;
            // Intentionally leave the correct info in place so we skip the right number of bytes
        }
        else if (pruneOpcodes) {
            opcode = 678 /* MintOpcode.MINT_NOP */;
        }
        switch (opcode) {
            case 271 /* MintOpcode.MINT_SWITCH */: {
                if (!emit_switch(builder, ip, exitOpcodeCounter))
                    ip = abort;
                break;
            }
            case 678 /* MintOpcode.MINT_NOP */: {
                // This typically means the current opcode was disabled or pruned
                if (pruneOpcodes) {
                    // We emit an unreachable opcode so that if execution somehow reaches a pruned opcode, we will abort
                    // This should be impossible anyway but it's also useful to have pruning visible in the wasm
                    if (!hasEmittedUnreachable)
                        builder.appendU8(0 /* WasmOpcode.unreachable */);
                    // Don't generate multiple unreachable opcodes in a row
                    hasEmittedUnreachable = true;
                }
                break;
            }
            case 313 /* MintOpcode.MINT_INITLOCAL */:
            case 314 /* MintOpcode.MINT_INITLOCALS */: {
                // FIXME: We should move the first entry point after initlocals if it exists
                const startOffsetInBytes = getArgU16(ip, 1), sizeInBytes = getArgU16(ip, 2);
                append_memset_local(builder, startOffsetInBytes, 0, sizeInBytes);
                break;
            }
            case 312 /* MintOpcode.MINT_LOCALLOC */: {
                // dest
                append_ldloca$1(builder, getArgU16(ip, 1), 0);
                // len
                append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                // frame
                builder.local("frame");
                builder.callImport("localloc");
                break;
            }
            case 285 /* MintOpcode.MINT_ZEROBLK */: {
                // dest
                append_ldloc$1(builder, getArgU16(ip, 1), 40 /* WasmOpcode.i32_load */);
                // value
                builder.i32_const(0);
                // count
                append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                // memset
                builder.appendU8(252 /* WasmOpcode.PREFIX_sat */);
                builder.appendU8(11);
                builder.appendU8(0);
                break;
            }
            case 286 /* MintOpcode.MINT_ZEROBLK_IMM */: {
                append_ldloc$1(builder, getArgU16(ip, 1), 40 /* WasmOpcode.i32_load */);
                append_memset_dest(builder, 0, getArgU16(ip, 2));
                break;
            }
            case 310 /* MintOpcode.MINT_CPBLK */: {
                const sizeOffset = getArgU16(ip, 3), srcOffset = getArgU16(ip, 2), destOffset = getArgU16(ip, 1), constantSize = get_known_constant_value(builder, sizeOffset);
                if (constantSize !== 0) {
                    if (typeof (constantSize) !== "number") {
                        // size (FIXME: uint32 not int32)
                        append_ldloc$1(builder, sizeOffset, 40 /* WasmOpcode.i32_load */);
                        builder.local("count", 34 /* WasmOpcode.tee_local */);
                        // if size is 0 then don't do anything
                        builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */); // if size
                    }
                    else {
                        // Store the count into the local in case the unroll fails
                        builder.i32_const(constantSize);
                        builder.local("count", 33 /* WasmOpcode.set_local */);
                    }
                    // stash dest then check for null
                    append_ldloc$1(builder, destOffset, 40 /* WasmOpcode.i32_load */);
                    builder.local("dest_ptr", 34 /* WasmOpcode.tee_local */);
                    builder.appendU8(69 /* WasmOpcode.i32_eqz */);
                    // stash src then check for null
                    append_ldloc$1(builder, srcOffset, 40 /* WasmOpcode.i32_load */);
                    builder.local("src_ptr", 34 /* WasmOpcode.tee_local */);
                    builder.appendU8(69 /* WasmOpcode.i32_eqz */);
                    // now we memmove if both dest and src are valid. The stack currently has
                    //  the eqz result for each pointer so we can stash a bailout inside of an if
                    builder.appendU8(114 /* WasmOpcode.i32_or */);
                    builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */); // if null
                    append_bailout(builder, ip, 2 /* BailoutReason.NullCheck */);
                    builder.endBlock(); // if null
                    if ((typeof (constantSize) !== "number") ||
                        !try_append_memmove_fast(builder, 0, 0, constantSize, false, "dest_ptr", "src_ptr")) {
                        // We passed the null check so now prepare the stack
                        builder.local("dest_ptr");
                        builder.local("src_ptr");
                        builder.local("count");
                        // wasm memmove with stack layout dest, src, count
                        builder.appendU8(252 /* WasmOpcode.PREFIX_sat */);
                        builder.appendU8(10);
                        builder.appendU8(0);
                        builder.appendU8(0);
                    }
                    if (typeof (constantSize) !== "number")
                        builder.endBlock(); // if size
                }
                break;
            }
            case 311 /* MintOpcode.MINT_INITBLK */: {
                const sizeOffset = getArgU16(ip, 3), valueOffset = getArgU16(ip, 2), destOffset = getArgU16(ip, 1);
                // TODO: Handle constant size initblks. Not sure if they matter though
                // FIXME: This will cause an erroneous bailout if dest and size are both 0
                //  but that really shouldn't ever happen, and it will only cause a slowdown
                // dest
                append_ldloc_cknull(builder, destOffset, ip, true);
                // value
                append_ldloc$1(builder, valueOffset, 40 /* WasmOpcode.i32_load */);
                // size (FIXME: uint32 not int32)
                append_ldloc$1(builder, sizeOffset, 40 /* WasmOpcode.i32_load */);
                // spec: pop n, pop val, pop d, fill from d[0] to d[n] with value val
                builder.appendU8(252 /* WasmOpcode.PREFIX_sat */);
                builder.appendU8(11);
                builder.appendU8(0);
                break;
            }
            // Other conditional branch types are handled by the relop table.
            case 143 /* MintOpcode.MINT_BRFALSE_I4_S */:
            case 145 /* MintOpcode.MINT_BRTRUE_I4_S */:
            case 227 /* MintOpcode.MINT_BRFALSE_I4_SP */:
            case 229 /* MintOpcode.MINT_BRTRUE_I4_SP */:
            case 144 /* MintOpcode.MINT_BRFALSE_I8_S */:
            case 146 /* MintOpcode.MINT_BRTRUE_I8_S */:
                if (!emit_branch(builder, ip, frame, opcode))
                    ip = abort;
                else
                    isConditionallyExecuted = true;
                break;
            case 129 /* MintOpcode.MINT_BR_S */:
            case 132 /* MintOpcode.MINT_CALL_HANDLER */:
            case 133 /* MintOpcode.MINT_CALL_HANDLER_S */:
                if (!emit_branch(builder, ip, frame, opcode))
                    ip = abort;
                else {
                    // Technically incorrect, but the instructions following this one may not be executed
                    //  since we might have skipped over them.
                    // FIXME: Identify when we should actually set the conditionally executed flag, perhaps
                    //  by doing a simple static flow analysis based on the displacements. Update heuristic too!
                    isConditionallyExecuted = true;
                }
                break;
            case 538 /* MintOpcode.MINT_CKNULL */: {
                // if (locals[ip[2]]) locals[ip[1]] = locals[ip[2]] else throw
                const src = getArgU16(ip, 2), dest = getArgU16(ip, 1);
                // locals[n] = cknull(locals[n]) is a common pattern, and we don't
                //  need to do the write for it since it can't change the value
                if (src !== dest) {
                    builder.local("pLocals");
                    append_ldloc_cknull(builder, src, ip, true);
                    append_stloc_tail(builder, dest, 54 /* WasmOpcode.i32_store */);
                }
                else {
                    append_ldloc_cknull(builder, src, ip, false);
                }
                // We will have bailed out if the object was null
                if (builder.allowNullCheckOptimization) {
                    if (traceNullCheckOptimizations)
                        mono_log_info(`(0x${ip.toString(16)}) locals[${dest}] passed cknull`);
                    notNullSince.set(dest, ip);
                }
                skipDregInvalidation = true;
                break;
            }
            case 638 /* MintOpcode.MINT_TIER_ENTER_METHOD */:
            case 639 /* MintOpcode.MINT_TIER_PATCHPOINT */: {
                // We need to make sure to notify the interpreter about tiering opcodes
                //  so that tiering up will still happen
                const iMethod = getU32_unaligned(frame + getMemberOffset(4 /* JiterpMember.Imethod */));
                builder.ptr_const(iMethod);
                // increase_entry_count will return 1 if we can continue, otherwise
                //  we need to bail out into the interpreter so it can perform tiering
                builder.callImport("entry");
                builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
                append_bailout(builder, ip, 1 /* BailoutReason.InterpreterTiering */);
                builder.endBlock();
                break;
            }
            case 676 /* MintOpcode.MINT_TIER_ENTER_JITERPRETER */:
                opcodeValue = 0;
                break;
            case 138 /* MintOpcode.MINT_SAFEPOINT */:
                append_safepoint(builder, ip);
                break;
            case 86 /* MintOpcode.MINT_LDLOCA_S */: {
                // Pre-load locals for the store op
                builder.local("pLocals");
                // locals[ip[1]] = &locals[ip[2]]
                const offset = getArgU16(ip, 2), flag = isAddressTaken(builder, offset), destOffset = getArgU16(ip, 1), 
                // Size value stored for us by emit_compacted_instruction so we can do invalidation
                size = getArgU16(ip, 3);
                if (!flag)
                    mono_log_error(`${traceName}: Expected local ${offset} to have address taken flag`);
                append_ldloca$1(builder, offset, size);
                append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                // Record this ldloca as a known constant so that later uses of it turn into a lea,
                //  and the wasm runtime can constant fold them with other constants. It's not uncommon
                //  to have code that does '&x + c', which (if this optimization works) should
                //  turn into '&locals + offsetof(x) + c' and get constant folded to have the same cost
                //  as a regular ldloc
                knownConstants.set(destOffset, { type: "ldloca", offset: offset });
                // dreg invalidation would blow the known constant away, so disable it
                skipDregInvalidation = true;
                break;
            }
            case 272 /* MintOpcode.MINT_LDSTR */:
            case 300 /* MintOpcode.MINT_LDFTN */:
            case 301 /* MintOpcode.MINT_LDFTN_ADDR */:
            case 556 /* MintOpcode.MINT_LDPTR */: {
                // Pre-load locals for the store op
                builder.local("pLocals");
                // frame->imethod->data_items [ip [2]]
                let data = get_imethod_data(frame, getArgU16(ip, 2));
                if (opcode === 300 /* MintOpcode.MINT_LDFTN */)
                    data = wrapped_c_functions.mono_jiterp_imethod_to_ftnptr(data);
                builder.ptr_const(data);
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            }
            case 305 /* MintOpcode.MINT_CPOBJ_VT */: {
                const klass = get_imethod_data(frame, getArgU16(ip, 3));
                append_ldloc$1(builder, getArgU16(ip, 1), 40 /* WasmOpcode.i32_load */);
                append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                builder.ptr_const(klass);
                builder.callImport("value_copy");
                break;
            }
            case 306 /* MintOpcode.MINT_CPOBJ_VT_NOREF */: {
                const sizeBytes = getArgU16(ip, 3);
                append_ldloc$1(builder, getArgU16(ip, 1), 40 /* WasmOpcode.i32_load */);
                append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                append_memmove_dest_src(builder, sizeBytes);
                break;
            }
            case 307 /* MintOpcode.MINT_LDOBJ_VT */: {
                const size = getArgU16(ip, 3);
                append_ldloca$1(builder, getArgU16(ip, 1), size);
                append_ldloc_cknull(builder, getArgU16(ip, 2), ip, true);
                append_memmove_dest_src(builder, size);
                break;
            }
            case 308 /* MintOpcode.MINT_STOBJ_VT */: {
                const klass = get_imethod_data(frame, getArgU16(ip, 3));
                append_ldloc$1(builder, getArgU16(ip, 1), 40 /* WasmOpcode.i32_load */);
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                builder.ptr_const(klass);
                builder.callImport("value_copy");
                break;
            }
            case 309 /* MintOpcode.MINT_STOBJ_VT_NOREF */: {
                const sizeBytes = getArgU16(ip, 3);
                append_ldloc$1(builder, getArgU16(ip, 1), 40 /* WasmOpcode.i32_load */);
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                append_memmove_dest_src(builder, sizeBytes);
                break;
            }
            case 540 /* MintOpcode.MINT_STRLEN */: {
                builder.local("pLocals");
                append_ldloc_cknull(builder, getArgU16(ip, 2), ip, true);
                builder.appendU8(40 /* WasmOpcode.i32_load */);
                builder.appendMemarg(getMemberOffset(2 /* JiterpMember.StringLength */), 2);
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            }
            case 539 /* MintOpcode.MINT_GETCHR */: {
                builder.block();
                // index
                append_ldloc$1(builder, getArgU16(ip, 3), 40 /* WasmOpcode.i32_load */);
                // stash it, we'll be using it multiple times
                builder.local("index", 34 /* WasmOpcode.tee_local */);
                /*
                const constantIndex = get_known_constant_value(getArgU16(ip, 3));
                if (typeof (constantIndex) === "number")
                    console.log(`getchr in ${builder.functions[0].name} with constant index ${constantIndex}`);
                */
                // str
                let ptrLocal = "cknull_ptr";
                if (builder.options.zeroPageOptimization && isZeroPageReserved()) {
                    // load string ptr and stash it
                    // if the string ptr is null, the length check will fail and we will bail out,
                    //  so the null check is not necessary
                    modifyCounter(8 /* JiterpCounter.NullChecksFused */, 1);
                    append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                    ptrLocal = "src_ptr";
                    builder.local(ptrLocal, 34 /* WasmOpcode.tee_local */);
                }
                else
                    append_ldloc_cknull(builder, getArgU16(ip, 2), ip, true);
                // current stack layout is [index, ptr]
                // get string length
                builder.appendU8(40 /* WasmOpcode.i32_load */);
                builder.appendMemarg(getMemberOffset(2 /* JiterpMember.StringLength */), 2);
                // current stack layout is [index, length]
                // index < length
                builder.appendU8(72 /* WasmOpcode.i32_lt_s */);
                // index >= 0
                builder.local("index");
                builder.i32_const(0);
                builder.appendU8(78 /* WasmOpcode.i32_ge_s */);
                // (index >= 0) && (index < length)
                builder.appendU8(113 /* WasmOpcode.i32_and */);
                // If either of the index checks failed we will fall through to the bailout
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 11 /* BailoutReason.StringOperationFailed */);
                builder.endBlock();
                // The null check and range check both passed so we can load the character now
                // Pre-load destination for the stloc at the end (we can't do this inside the block above)
                builder.local("pLocals");
                // (index * 2) + offsetof(MonoString, chars) + pString
                builder.local("index");
                builder.i32_const(2);
                builder.appendU8(108 /* WasmOpcode.i32_mul */);
                builder.local(ptrLocal);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
                // Load char
                builder.appendU8(47 /* WasmOpcode.i32_load16_u */);
                builder.appendMemarg(getMemberOffset(3 /* JiterpMember.StringData */), 1);
                // Store into result
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            }
            case 342 /* MintOpcode.MINT_GETITEM_SPAN */:
            case 343 /* MintOpcode.MINT_GETITEM_LOCALSPAN */: {
                const elementSize = getArgI16(ip, 4);
                builder.block();
                // Load index and stash it
                append_ldloc$1(builder, getArgU16(ip, 3), 40 /* WasmOpcode.i32_load */);
                builder.local("index", 34 /* WasmOpcode.tee_local */);
                // Load address of the span structure
                let ptrLocal = "cknull_ptr";
                if (opcode === 342 /* MintOpcode.MINT_GETITEM_SPAN */) {
                    // span = *(MonoSpanOfVoid *)locals[2]
                    append_ldloc_cknull(builder, getArgU16(ip, 2), ip, true);
                }
                else {
                    // span = (MonoSpanOfVoid)locals[2]
                    append_ldloca$1(builder, getArgU16(ip, 2), 0);
                    ptrLocal = "src_ptr";
                    builder.local(ptrLocal, 34 /* WasmOpcode.tee_local */);
                }
                // length = span->length
                builder.appendU8(40 /* WasmOpcode.i32_load */);
                builder.appendMemarg(getMemberOffset(7 /* JiterpMember.SpanLength */), 2);
                // index < length
                builder.appendU8(73 /* WasmOpcode.i32_lt_u */);
                // index >= 0
                // FIXME: It would be nice to optimize this down to a single (index < length) comparison
                //  but interp.c doesn't do it - presumably because a span could be bigger than 2gb?
                builder.local("index");
                builder.i32_const(0);
                builder.appendU8(78 /* WasmOpcode.i32_ge_s */);
                // (index >= 0) && (index < length)
                builder.appendU8(113 /* WasmOpcode.i32_and */);
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 18 /* BailoutReason.SpanOperationFailed */);
                builder.endBlock();
                // We successfully null checked and bounds checked. Now compute
                //  the address and store it to the destination
                builder.local("pLocals");
                // src = span->_reference + (index * element_size);
                builder.local(ptrLocal);
                builder.appendU8(40 /* WasmOpcode.i32_load */);
                builder.appendMemarg(getMemberOffset(8 /* JiterpMember.SpanData */), 2);
                builder.local("index");
                builder.i32_const(elementSize);
                builder.appendU8(108 /* WasmOpcode.i32_mul */);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            }
            case 664 /* MintOpcode.MINT_INTRINS_SPAN_CTOR */: {
                // if (len < 0) bailout
                builder.block();
                // int len = LOCAL_VAR (ip [3], gint32);
                append_ldloc$1(builder, getArgU16(ip, 3), 40 /* WasmOpcode.i32_load */);
                builder.local("count", 34 /* WasmOpcode.tee_local */);
                builder.i32_const(0);
                builder.appendU8(78 /* WasmOpcode.i32_ge_s */);
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 18 /* BailoutReason.SpanOperationFailed */);
                builder.endBlock();
                // gpointer span = locals + ip [1];
                append_ldloca$1(builder, getArgU16(ip, 1), 16);
                builder.local("dest_ptr", 34 /* WasmOpcode.tee_local */);
                // *(gpointer*)span = ptr;
                append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                builder.appendU8(54 /* WasmOpcode.i32_store */);
                builder.appendMemarg(0, 0);
                // *(gint32*)((gpointer*)span + 1) = len;
                builder.local("dest_ptr");
                builder.local("count");
                builder.appendU8(54 /* WasmOpcode.i32_store */);
                builder.appendMemarg(4, 0);
                break;
            }
            case 577 /* MintOpcode.MINT_LD_DELEGATE_METHOD_PTR */: {
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                append_ldloca$1(builder, getArgU16(ip, 2), 4);
                builder.callImport("ld_del_ptr");
                break;
            }
            case 73 /* MintOpcode.MINT_LDTSFLDA */: {
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                // This value is unsigned but I32 is probably right
                builder.ptr_const(getArgI32(ip, 2));
                builder.callImport("ldtsflda");
                break;
            }
            case 663 /* MintOpcode.MINT_INTRINS_GET_TYPE */:
                builder.block();
                // dest, src
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                builder.callImport("gettype");
                // bailout if gettype failed
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 2 /* BailoutReason.NullCheck */);
                builder.endBlock();
                break;
            case 660 /* MintOpcode.MINT_INTRINS_ENUM_HASFLAG */: {
                const klass = get_imethod_data(frame, getArgU16(ip, 4));
                builder.ptr_const(klass);
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                append_ldloca$1(builder, getArgU16(ip, 3), 0);
                builder.callImport("hasflag");
                break;
            }
            case 669 /* MintOpcode.MINT_INTRINS_MEMORYMARSHAL_GETARRAYDATAREF */: {
                const offset = getMemberOffset(1 /* JiterpMember.ArrayData */);
                builder.local("pLocals");
                append_ldloc_cknull(builder, getArgU16(ip, 2), ip, true);
                builder.i32_const(offset);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            }
            case 661 /* MintOpcode.MINT_INTRINS_GET_HASHCODE */:
                builder.local("pLocals");
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                builder.callImport("hashcode");
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            case 662 /* MintOpcode.MINT_INTRINS_TRY_GET_HASHCODE */:
                builder.local("pLocals");
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                builder.callImport("try_hash");
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            case 665 /* MintOpcode.MINT_INTRINS_RUNTIMEHELPERS_OBJECT_HAS_COMPONENT_SIZE */:
                builder.local("pLocals");
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                builder.callImport("hascsize");
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            case 670 /* MintOpcode.MINT_INTRINS_ORDINAL_IGNORE_CASE_ASCII */: {
                builder.local("pLocals");
                // valueA (cache in lhs32, we need it again later)
                append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                builder.local("math_lhs32", 34 /* WasmOpcode.tee_local */);
                // valueB
                append_ldloc$1(builder, getArgU16(ip, 3), 40 /* WasmOpcode.i32_load */);
                // compute differentBits = (valueA ^ valueB) << 2
                builder.appendU8(115 /* WasmOpcode.i32_xor */);
                builder.i32_const(2);
                builder.appendU8(116 /* WasmOpcode.i32_shl */);
                builder.local("math_rhs32", 33 /* WasmOpcode.set_local */);
                // compute indicator
                builder.local("math_lhs32");
                builder.i32_const(0x00050005);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
                builder.i32_const(0x00A000A0);
                builder.appendU8(114 /* WasmOpcode.i32_or */);
                builder.i32_const(0x001A001A);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
                builder.i32_const(-8388737); // 0xFF7FFF7F == 4286578559U == -8388737
                builder.appendU8(114 /* WasmOpcode.i32_or */);
                // result = (differentBits & indicator) == 0
                builder.local("math_rhs32");
                builder.appendU8(113 /* WasmOpcode.i32_and */);
                builder.appendU8(69 /* WasmOpcode.i32_eqz */);
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            }
            case 541 /* MintOpcode.MINT_ARRAY_RANK */:
            case 542 /* MintOpcode.MINT_ARRAY_ELEMENT_SIZE */: {
                builder.block();
                // dest, src
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                builder.callImport(opcode === 541 /* MintOpcode.MINT_ARRAY_RANK */ ? "array_rank" : "a_elesize");
                // If the array was null we will bail out, otherwise continue
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 2 /* BailoutReason.NullCheck */);
                builder.endBlock();
                break;
            }
            case 289 /* MintOpcode.MINT_CASTCLASS_INTERFACE */:
            case 290 /* MintOpcode.MINT_ISINST_INTERFACE */: {
                const klass = get_imethod_data(frame, getArgU16(ip, 3)), isSpecialInterface = wrapped_c_functions.mono_jiterp_is_special_interface(klass), bailoutOnFailure = (opcode === 289 /* MintOpcode.MINT_CASTCLASS_INTERFACE */), destOffset = getArgU16(ip, 1);
                if (!klass) {
                    record_abort(builder.traceIndex, ip, traceName, "null-klass");
                    ip = abort;
                    continue;
                }
                builder.block(); // depth x -> 0 (opcode block)
                if (builder.options.zeroPageOptimization && isZeroPageReserved()) {
                    // Null check fusion is possible, so (obj->vtable) will be 0 for !obj
                    append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                    builder.local("dest_ptr", 34 /* WasmOpcode.tee_local */);
                    modifyCounter(8 /* JiterpCounter.NullChecksFused */, 1);
                }
                else {
                    builder.block(); // depth 0 -> 1 (null check block)
                    // src
                    append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                    builder.local("dest_ptr", 34 /* WasmOpcode.tee_local */);
                    // Null ptr check: If the ptr is non-null, skip this block
                    builder.appendU8(13 /* WasmOpcode.br_if */);
                    builder.appendULeb(0);
                    builder.local("pLocals");
                    builder.i32_const(0);
                    append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                    // at the end of this block (depth 0) we skip to the end of the opcode block (depth 1)
                    //  because we successfully zeroed the destination register
                    builder.appendU8(12 /* WasmOpcode.br */);
                    builder.appendULeb(1);
                    builder.endBlock(); // depth 1 -> 0 (end null check block)
                    // Put ptr back on the stack
                    builder.local("dest_ptr");
                }
                // the special interface version signature is (obj, vtable, klass), but
                //  the fast signature is (vtable, klass)
                if (isSpecialInterface) {
                    // load a second copy of obj to build the helper arglist (obj, vtable, klass)
                    builder.local("dest_ptr");
                }
                builder.appendU8(40 /* WasmOpcode.i32_load */); // obj->vtable
                builder.appendMemarg(getMemberOffset(14 /* JiterpMember.VTable */), 0); // fixme: alignment
                builder.ptr_const(klass);
                builder.callImport(isSpecialInterface ? "imp_iface_s" : "imp_iface");
                if (bailoutOnFailure) {
                    // generate a 1 for null ptrs so we don't bail out and instead write the 0
                    //  to the destination
                    builder.local("dest_ptr");
                    builder.appendU8(69 /* WasmOpcode.i32_eqz */);
                    builder.appendU8(114 /* WasmOpcode.i32_or */);
                }
                builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */); // if cast succeeded
                builder.local("pLocals");
                builder.local("dest_ptr");
                append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                builder.appendU8(5 /* WasmOpcode.else_ */); // else cast failed
                if (bailoutOnFailure) {
                    // so bailout
                    append_bailout(builder, ip, 19 /* BailoutReason.CastFailed */);
                }
                else {
                    // this is isinst, so write 0 to destination instead
                    builder.local("pLocals");
                    builder.i32_const(0);
                    append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                }
                builder.endBlock(); // endif
                builder.endBlock(); // depth 0 -> x (end opcode block)
                break;
            }
            case 291 /* MintOpcode.MINT_CASTCLASS_COMMON */:
            case 292 /* MintOpcode.MINT_ISINST_COMMON */:
            case 287 /* MintOpcode.MINT_CASTCLASS */:
            case 288 /* MintOpcode.MINT_ISINST */: {
                const klass = get_imethod_data(frame, getArgU16(ip, 3)), canDoFastCheck = (opcode === 291 /* MintOpcode.MINT_CASTCLASS_COMMON */) ||
                    (opcode === 292 /* MintOpcode.MINT_ISINST_COMMON */), bailoutOnFailure = (opcode === 287 /* MintOpcode.MINT_CASTCLASS */) ||
                    (opcode === 291 /* MintOpcode.MINT_CASTCLASS_COMMON */), destOffset = getArgU16(ip, 1);
                if (!klass) {
                    record_abort(builder.traceIndex, ip, traceName, "null-klass");
                    ip = abort;
                    continue;
                }
                builder.block(); // depth x -> 0 (opcode block)
                if (builder.options.zeroPageOptimization && isZeroPageReserved()) {
                    // Null check fusion is possible, so (obj->vtable)->klass will be 0 for !obj
                    append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                    builder.local("dest_ptr", 34 /* WasmOpcode.tee_local */);
                    modifyCounter(8 /* JiterpCounter.NullChecksFused */, 1);
                }
                else {
                    builder.block(); // depth 0 -> 1 (null check block)
                    // src
                    append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                    builder.local("dest_ptr", 34 /* WasmOpcode.tee_local */);
                    // Null ptr check: If the ptr is non-null, skip this block
                    builder.appendU8(13 /* WasmOpcode.br_if */);
                    builder.appendULeb(0);
                    builder.local("pLocals");
                    builder.i32_const(0);
                    append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                    // at the end of this block (depth 0) we skip to the end of the opcode block (depth 1)
                    //  because we successfully zeroed the destination register
                    builder.appendU8(12 /* WasmOpcode.br */);
                    builder.appendULeb(1);
                    builder.endBlock(); // depth 1 -> 0 (end null check block)
                    // Put ptr back on the stack
                    builder.local("dest_ptr");
                }
                // If we're here the null check passed and we now need to type-check
                builder.appendU8(40 /* WasmOpcode.i32_load */); // obj->vtable
                builder.appendMemarg(getMemberOffset(14 /* JiterpMember.VTable */), 0); // fixme: alignment
                builder.appendU8(40 /* WasmOpcode.i32_load */); // (obj->vtable)->klass
                builder.appendMemarg(getMemberOffset(15 /* JiterpMember.VTableKlass */), 0); // fixme: alignment
                // Stash obj->vtable->klass so we can do a fast has_parent check later
                if (canDoFastCheck)
                    builder.local("src_ptr", 34 /* WasmOpcode.tee_local */);
                builder.i32_const(klass);
                builder.appendU8(70 /* WasmOpcode.i32_eq */);
                builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */); // if A
                // Fast type-check passed (exact match), so store the ptr and continue
                builder.local("pLocals");
                builder.local("dest_ptr");
                append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                // Fast type-check failed, so call the helper function
                builder.appendU8(5 /* WasmOpcode.else_ */); // else A
                if (canDoFastCheck) {
                    // Fast path for ISINST_COMMON/CASTCLASS_COMMON. We know klass is a simple type
                    //  so all we need to do is a parentage check.
                    builder.local("src_ptr"); // obj->vtable->klass
                    builder.ptr_const(klass);
                    builder.callImport("hasparent");
                    if (bailoutOnFailure) {
                        // generate a 1 for null ptrs so we don't bail out and instead write the 0
                        //  to the destination
                        builder.local("dest_ptr");
                        builder.appendU8(69 /* WasmOpcode.i32_eqz */);
                        builder.appendU8(114 /* WasmOpcode.i32_or */);
                    }
                    builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */); // if B
                    // mono_class_has_parent_fast returned 1 so *destination = obj
                    builder.local("pLocals");
                    builder.local("dest_ptr");
                    append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                    builder.appendU8(5 /* WasmOpcode.else_ */); // else B
                    // mono_class_has_parent_fast returned 0
                    if (bailoutOnFailure) {
                        // so bailout
                        append_bailout(builder, ip, 19 /* BailoutReason.CastFailed */);
                    }
                    else {
                        // this is isinst, so write 0 to destination instead
                        builder.local("pLocals");
                        builder.i32_const(0);
                        append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                    }
                    builder.endBlock(); // endif B
                }
                else {
                    // Slow path for ISINST/CASTCLASS, handles things like generics and nullable.
                    // &dest
                    append_ldloca$1(builder, getArgU16(ip, 1), 4);
                    // src
                    builder.local("dest_ptr");
                    // klass
                    builder.ptr_const(klass);
                    // opcode
                    builder.i32_const(opcode);
                    builder.callImport("castv2");
                    // We don't need to do an explicit null check because mono_jiterp_cast_v2 does it
                    // Check whether the cast operation failed
                    builder.appendU8(69 /* WasmOpcode.i32_eqz */);
                    builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */); // if B
                    // Cast failed so bail out
                    append_bailout(builder, ip, 19 /* BailoutReason.CastFailed */);
                    builder.endBlock(); // endif B
                }
                builder.endBlock(); // endif A
                builder.endBlock(); // depth 0 -> x (end opcode block)
                break;
            }
            case 295 /* MintOpcode.MINT_BOX */:
            case 296 /* MintOpcode.MINT_BOX_VT */: {
                // MonoVTable *vtable = (MonoVTable*)frame->imethod->data_items [ip [3]];
                builder.ptr_const(get_imethod_data(frame, getArgU16(ip, 3)));
                // dest, src
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                builder.i32_const(opcode === 296 /* MintOpcode.MINT_BOX_VT */ ? 1 : 0);
                builder.callImport("box");
                break;
            }
            case 299 /* MintOpcode.MINT_UNBOX */: {
                const klass = get_imethod_data(frame, getArgU16(ip, 3)), 
                // The type check needs to examine the boxed value's rank and element class
                elementClassOffset = getMemberOffset(17 /* JiterpMember.ClassElementClass */), destOffset = getArgU16(ip, 1), 
                // Get the class's element class, which is what we will actually type-check against
                elementClass = getU32_unaligned(klass + elementClassOffset);
                if (!klass || !elementClass) {
                    record_abort(builder.traceIndex, ip, traceName, "null-klass");
                    ip = abort;
                    continue;
                }
                if (builder.options.zeroPageOptimization && isZeroPageReserved()) {
                    // Null check fusion is possible, so (obj->vtable)->klass will be 0 for !obj
                    append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                    builder.local("dest_ptr", 34 /* WasmOpcode.tee_local */);
                    modifyCounter(8 /* JiterpCounter.NullChecksFused */, 1);
                }
                else {
                    append_ldloc_cknull(builder, getArgU16(ip, 2), ip, true);
                    builder.local("dest_ptr", 34 /* WasmOpcode.tee_local */);
                }
                // Fetch the object's klass so we can perform a type check
                builder.appendU8(40 /* WasmOpcode.i32_load */); // obj->vtable
                builder.appendMemarg(getMemberOffset(14 /* JiterpMember.VTable */), 0); // fixme: alignment
                builder.appendU8(40 /* WasmOpcode.i32_load */); // (obj->vtable)->klass
                builder.appendMemarg(getMemberOffset(15 /* JiterpMember.VTableKlass */), 0); // fixme: alignment
                // Stash obj->vtable->klass, then check klass->element_class == expected
                builder.local("src_ptr", 34 /* WasmOpcode.tee_local */);
                builder.appendU8(40 /* WasmOpcode.i32_load */);
                builder.appendMemarg(elementClassOffset, 0);
                builder.i32_const(elementClass);
                builder.appendU8(70 /* WasmOpcode.i32_eq */);
                // Check klass->rank == 0
                builder.local("src_ptr");
                builder.appendU8(45 /* WasmOpcode.i32_load8_u */); // rank is a uint8
                builder.appendMemarg(getMemberOffset(16 /* JiterpMember.ClassRank */), 0);
                builder.appendU8(69 /* WasmOpcode.i32_eqz */);
                // (element_class == expected) && (rank == 0)
                builder.appendU8(113 /* WasmOpcode.i32_and */);
                builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */); // if type check passed
                // Type-check passed, so now compute the address of the object's data
                //  and store the address
                builder.local("pLocals");
                builder.local("dest_ptr");
                builder.i32_const(getMemberOffset(18 /* JiterpMember.BoxedValueData */));
                builder.appendU8(106 /* WasmOpcode.i32_add */);
                append_stloc_tail(builder, destOffset, 54 /* WasmOpcode.i32_store */);
                builder.appendU8(5 /* WasmOpcode.else_ */); // else type check failed
                //
                append_bailout(builder, ip, 21 /* BailoutReason.UnboxFailed */);
                builder.endBlock(); // endif A
                break;
            }
            case 294 /* MintOpcode.MINT_NEWSTR */: {
                builder.block();
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                builder.callImport("newstr");
                // If the newstr operation succeeded, continue, otherwise bailout
                // Note that this assumes the newstr operation will fail again when the interpreter does it
                //  (the only reason for a newstr to fail I can think of is an out-of-memory condition)
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 17 /* BailoutReason.AllocFailed */);
                builder.endBlock();
                break;
            }
            case 293 /* MintOpcode.MINT_NEWARR */: {
                builder.block();
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                const vtable = get_imethod_data(frame, getArgU16(ip, 3));
                builder.i32_const(vtable);
                append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
                builder.callImport("newarr");
                // If the newarr operation succeeded, continue, otherwise bailout
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 17 /* BailoutReason.AllocFailed */);
                builder.endBlock();
                break;
            }
            case 283 /* MintOpcode.MINT_NEWOBJ_INLINED */: {
                builder.block();
                // MonoObject *o = mono_gc_alloc_obj (vtable, m_class_get_instance_size (vtable->klass));
                append_ldloca$1(builder, getArgU16(ip, 1), 4);
                builder.ptr_const(get_imethod_data(frame, getArgU16(ip, 2)));
                // LOCAL_VAR (ip [1], MonoObject*) = o;
                builder.callImport("newobj_i");
                // If the newobj operation succeeded, continue, otherwise bailout
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 17 /* BailoutReason.AllocFailed */);
                builder.endBlock();
                break;
            }
            case 282 /* MintOpcode.MINT_NEWOBJ */:
            case 284 /* MintOpcode.MINT_NEWOBJ_VT */:
            case 544 /* MintOpcode.MINT_CALLVIRT_FAST */:
            case 543 /* MintOpcode.MINT_CALL */: {
                if (countCallTargets) {
                    const targetImethod = get_imethod_data(frame, getArgU16(ip, 3));
                    const targetMethod = getU32_unaligned(targetImethod);
                    const count = callTargetCounts[targetMethod];
                    if (typeof (count) === "number")
                        callTargetCounts[targetMethod] = count + 1;
                    else
                        callTargetCounts[targetMethod] = 1;
                }
                if (isConditionallyExecuted) {
                    // We generate a bailout instead of aborting, because we don't want calls
                    //  to abort the entire trace if we have branch support enabled - the call
                    //  might be infrequently hit and as a result it's worth it to keep going.
                    append_exit(builder, ip, exitOpcodeCounter, 15 /* BailoutReason.Call */);
                    pruneOpcodes = true;
                    opcodeValue = 0;
                }
                else {
                    // We're in a block that executes unconditionally, and no branches have been
                    //  executed before now so the trace will always need to bail out into the
                    //  interpreter here. No point in compiling more.
                    ip = abort;
                }
                break;
            }
            // TODO: Verify that this isn't worse. I think these may only show up in wrappers?
            // case MintOpcode.MINT_JIT_CALL:
            case 546 /* MintOpcode.MINT_CALLI */:
            case 547 /* MintOpcode.MINT_CALLI_NAT */:
            case 548 /* MintOpcode.MINT_CALLI_NAT_DYNAMIC */:
            case 549 /* MintOpcode.MINT_CALLI_NAT_FAST */:
            case 545 /* MintOpcode.MINT_CALL_DELEGATE */:
                // See comments for MINT_CALL
                if (isConditionallyExecuted) {
                    append_exit(builder, ip, exitOpcodeCounter, opcode == 545 /* MintOpcode.MINT_CALL_DELEGATE */
                        ? 22 /* BailoutReason.CallDelegate */
                        : 15 /* BailoutReason.Call */);
                    pruneOpcodes = true;
                }
                else {
                    ip = abort;
                }
                break;
            // Unlike regular rethrow which will only appear in catch blocks,
            //  MONO_RETHROW appears to show up in other places, so it's worth conditional bailout
            case 137 /* MintOpcode.MINT_MONO_RETHROW */:
            case 134 /* MintOpcode.MINT_THROW */:
                // Not an exit, because throws are by definition unlikely
                // We shouldn't make optimization decisions based on them.
                append_bailout(builder, ip, 16 /* BailoutReason.Throw */);
                pruneOpcodes = true;
                break;
            // These are generated in place of regular LEAVEs inside of the body of a catch clause.
            // We can safely assume that during normal execution, catch clauses won't be running.
            case 130 /* MintOpcode.MINT_LEAVE_CHECK */:
            case 131 /* MintOpcode.MINT_LEAVE_S_CHECK */:
                append_bailout(builder, ip, 26 /* BailoutReason.LeaveCheck */);
                pruneOpcodes = true;
                break;
            case 136 /* MintOpcode.MINT_ENDFINALLY */: {
                if ((builder.callHandlerReturnAddresses.length > 0) &&
                    (builder.callHandlerReturnAddresses.length <= maxCallHandlerReturnAddresses)) {
                    // mono_log_info(`endfinally @0x${(<any>ip).toString(16)}. return addresses:`, builder.callHandlerReturnAddresses.map(ra => (<any>ra).toString(16)));
                    // FIXME: Replace this with a chain of selects to more efficiently map from RA -> index, then
                    //  a single jump table at the end to jump to the right place. This will generate much smaller
                    //  code and be able to handle a larger number of return addresses.
                    // Load ret_ip
                    const clauseIndex = getArgU16(ip, 1), clauseDataOffset = get_imethod_clause_data_offset(frame, clauseIndex);
                    builder.local("pLocals");
                    builder.appendU8(40 /* WasmOpcode.i32_load */);
                    builder.appendMemarg(clauseDataOffset, 0);
                    // Stash it in a variable because we're going to need to use it multiple times
                    builder.local("index", 33 /* WasmOpcode.set_local */);
                    // Do a bunch of trivial comparisons to see if ret_ip is one of our expected return addresses,
                    //  and if it is, generate a branch back to the dispatcher at the top
                    for (let r = 0; r < builder.callHandlerReturnAddresses.length; r++) {
                        const ra = builder.callHandlerReturnAddresses[r];
                        builder.local("index");
                        builder.ptr_const(ra);
                        builder.appendU8(70 /* WasmOpcode.i32_eq */);
                        builder.cfg.branch(ra, ra < ip, 1 /* CfgBranchType.Conditional */);
                    }
                    // If none of the comparisons succeeded we won't have branched anywhere, so bail out
                    // This shouldn't happen during non-exception-handling execution unless the trace doesn't
                    //  contain the CALL_HANDLER that led here
                    append_bailout(builder, ip, 25 /* BailoutReason.UnexpectedRetIp */);
                    // FIXME: prune opcodes?
                }
                else {
                    ip = abort;
                }
                break;
            }
            case 135 /* MintOpcode.MINT_RETHROW */:
                ip = abort;
                break;
            // call C
            case 633 /* MintOpcode.MINT_PROF_ENTER */:
            case 634 /* MintOpcode.MINT_PROF_SAMPLEPOINT */:
            case 635 /* MintOpcode.MINT_PROF_EXIT */:
            case 636 /* MintOpcode.MINT_PROF_EXIT_VOID */:
                append_profiler_event(builder, ip, opcode);
                break;
            // Generating code for these is kind of complex due to the intersection of JS and int64,
            //  and it would bloat the implementation so we handle them all in C instead and match
            //  the interp implementation. Most of these are rare in runtime tests or browser bench
            case 493 /* MintOpcode.MINT_CONV_OVF_I4_I8 */:
            case 498 /* MintOpcode.MINT_CONV_OVF_U4_I8 */:
            case 494 /* MintOpcode.MINT_CONV_OVF_I4_U8 */:
            case 496 /* MintOpcode.MINT_CONV_OVF_I4_R8 */:
            case 503 /* MintOpcode.MINT_CONV_OVF_I8_R8 */:
            case 495 /* MintOpcode.MINT_CONV_OVF_I4_R4 */:
            case 502 /* MintOpcode.MINT_CONV_OVF_I8_R4 */:
            case 497 /* MintOpcode.MINT_CONV_OVF_U4_I4 */:
                builder.block();
                // dest, src
                append_ldloca$1(builder, getArgU16(ip, 1), 8);
                append_ldloca$1(builder, getArgU16(ip, 2), 0);
                builder.i32_const(opcode);
                builder.callImport("conv");
                // If the conversion succeeded, continue, otherwise bailout
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 13 /* BailoutReason.Overflow */); // could be underflow but awkward to tell
                builder.endBlock();
                break;
            /*
             *  The native conversion opcodes for these are not specified for nan/inf, and v8
             *  chooses to throw, so we have to do some tricks to identify non-finite values
             *  and substitute INTnn_MIN, like clang would.
             *  This attempts to reproduce what clang does in -O3 with no special flags set:
             *
             *  f64 -> i64
             *
             *  block
             *  local.get       0
             *  f64.abs
             *  f64.const       0x1p63
             *  f64.lt
             *  i32.eqz
             *  br_if           0                               # 0: down to label0
             *  local.get       0
             *  i64.trunc_f64_s
             *  return
             *  end_block                               # label0:
             *  i64.const       -9223372036854775808
             *
             *  f32 -> i32
             *
             *  block
             *  local.get       0
             *  f32.abs
             *  f32.const       0x1p31
             *  f32.lt
             *  i32.eqz
             *  br_if           0                               # 0: down to label3
             *  local.get       0
             *  i32.trunc_f32_s
             *  return
             *  end_block                               # label3:
             *  i32.const       -2147483648
             */
            case 456 /* MintOpcode.MINT_CONV_I4_R4 */:
            case 457 /* MintOpcode.MINT_CONV_I4_R8 */:
            case 462 /* MintOpcode.MINT_CONV_I8_R4 */:
            case 463 /* MintOpcode.MINT_CONV_I8_R8 */: {
                const isF32 = (opcode === 456 /* MintOpcode.MINT_CONV_I4_R4 */) ||
                    (opcode === 462 /* MintOpcode.MINT_CONV_I8_R4 */), isI64 = (opcode === 462 /* MintOpcode.MINT_CONV_I8_R4 */) ||
                    (opcode === 463 /* MintOpcode.MINT_CONV_I8_R8 */), limit = isI64
                    ? 9223372036854775807 // this will round up to 0x1p63
                    : 2147483648, // this is 0x1p31 exactly
                tempLocal = isF32 ? "temp_f32" : "temp_f64";
                // Pre-load locals for the result store at the end
                builder.local("pLocals");
                // Load src
                append_ldloc$1(builder, getArgU16(ip, 2), isF32 ? 42 /* WasmOpcode.f32_load */ : 43 /* WasmOpcode.f64_load */);
                builder.local(tempLocal, 34 /* WasmOpcode.tee_local */);
                // Detect whether the value is within the representable range for the target type
                builder.appendU8(isF32 ? 139 /* WasmOpcode.f32_abs */ : 153 /* WasmOpcode.f64_abs */);
                builder.appendU8(isF32 ? 67 /* WasmOpcode.f32_const */ : 68 /* WasmOpcode.f64_const */);
                if (isF32)
                    builder.appendF32(limit);
                else
                    builder.appendF64(limit);
                builder.appendU8(isF32 ? 93 /* WasmOpcode.f32_lt */ : 99 /* WasmOpcode.f64_lt */);
                // Select value via an if block that returns the result
                builder.block(isI64 ? 126 /* WasmValtype.i64 */ : 127 /* WasmValtype.i32 */, 4 /* WasmOpcode.if_ */);
                // Value in range so truncate it to the appropriate type
                builder.local(tempLocal);
                builder.appendU8(floatToIntTable[opcode]);
                builder.appendU8(5 /* WasmOpcode.else_ */);
                // Value out of range so load the appropriate boundary value
                builder.appendU8(isI64 ? 66 /* WasmOpcode.i64_const */ : 65 /* WasmOpcode.i32_const */);
                builder.appendBoundaryValue(isI64 ? 64 : 32, -1);
                builder.endBlock();
                append_stloc_tail(builder, getArgU16(ip, 1), isI64 ? 55 /* WasmOpcode.i64_store */ : 54 /* WasmOpcode.i32_store */);
                break;
            }
            case 529 /* MintOpcode.MINT_ADD_MUL_I4_IMM */:
            case 530 /* MintOpcode.MINT_ADD_MUL_I8_IMM */: {
                const isI32 = opcode === 529 /* MintOpcode.MINT_ADD_MUL_I4_IMM */;
                builder.local("pLocals");
                append_ldloc$1(builder, getArgU16(ip, 2), isI32 ? 40 /* WasmOpcode.i32_load */ : 41 /* WasmOpcode.i64_load */);
                const rhs = getArgI16(ip, 3), multiplier = getArgI16(ip, 4);
                if (isI32)
                    builder.i32_const(rhs);
                else
                    builder.i52_const(rhs);
                builder.appendU8(isI32 ? 106 /* WasmOpcode.i32_add */ : 124 /* WasmOpcode.i64_add */);
                if (isI32)
                    builder.i32_const(multiplier);
                else
                    builder.i52_const(multiplier);
                builder.appendU8(isI32 ? 108 /* WasmOpcode.i32_mul */ : 126 /* WasmOpcode.i64_mul */);
                append_stloc_tail(builder, getArgU16(ip, 1), isI32 ? 54 /* WasmOpcode.i32_store */ : 55 /* WasmOpcode.i64_store */);
                break;
            }
            case 650 /* MintOpcode.MINT_LOG2_I4 */:
            case 651 /* MintOpcode.MINT_LOG2_I8 */: {
                const isI64 = (opcode === 651 /* MintOpcode.MINT_LOG2_I8 */);
                builder.local("pLocals");
                append_ldloc$1(builder, getArgU16(ip, 2), isI64 ? 41 /* WasmOpcode.i64_load */ : 40 /* WasmOpcode.i32_load */);
                if (isI64)
                    builder.i52_const(1);
                else
                    builder.i32_const(1);
                builder.appendU8(isI64 ? 132 /* WasmOpcode.i64_or */ : 114 /* WasmOpcode.i32_or */);
                builder.appendU8(isI64 ? 121 /* WasmOpcode.i64_clz */ : 103 /* WasmOpcode.i32_clz */);
                if (isI64)
                    builder.appendU8(167 /* WasmOpcode.i32_wrap_i64 */);
                builder.i32_const(isI64 ? 63 : 31);
                builder.appendU8(115 /* WasmOpcode.i32_xor */);
                append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
                break;
            }
            case 531 /* MintOpcode.MINT_SHL_AND_I4 */:
            case 532 /* MintOpcode.MINT_SHL_AND_I8 */: {
                const isI32 = (opcode === 531 /* MintOpcode.MINT_SHL_AND_I4 */), loadOp = isI32 ? 40 /* WasmOpcode.i32_load */ : 41 /* WasmOpcode.i64_load */, storeOp = isI32 ? 54 /* WasmOpcode.i32_store */ : 55 /* WasmOpcode.i64_store */;
                builder.local("pLocals");
                append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
                append_ldloc$1(builder, getArgU16(ip, 3), loadOp);
                if (isI32)
                    builder.i32_const(31);
                else
                    builder.i52_const(63);
                builder.appendU8(isI32 ? 113 /* WasmOpcode.i32_and */ : 131 /* WasmOpcode.i64_and */);
                builder.appendU8(isI32 ? 116 /* WasmOpcode.i32_shl */ : 134 /* WasmOpcode.i64_shl */);
                append_stloc_tail(builder, getArgU16(ip, 1), storeOp);
                break;
            }
            case 591 /* MintOpcode.MINT_FMA */:
            case 618 /* MintOpcode.MINT_FMAF */: {
                const isF32 = (opcode === 618 /* MintOpcode.MINT_FMAF */), loadOp = isF32 ? 42 /* WasmOpcode.f32_load */ : 43 /* WasmOpcode.f64_load */, storeOp = isF32 ? 56 /* WasmOpcode.f32_store */ : 57 /* WasmOpcode.f64_store */;
                builder.local("pLocals");
                // LOCAL_VAR (ip [1], double) = fma (LOCAL_VAR (ip [2], double), LOCAL_VAR (ip [3], double), LOCAL_VAR (ip [4], double));
                append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
                append_ldloc$1(builder, getArgU16(ip, 3), loadOp);
                append_ldloc$1(builder, getArgU16(ip, 4), loadOp);
                builder.callImport(isF32 ? "fmaf" : "fma");
                append_stloc_tail(builder, getArgU16(ip, 1), storeOp);
                break;
            }
            default:
                if (((opcode >= 3 /* MintOpcode.MINT_RET */) &&
                    (opcode <= 12 /* MintOpcode.MINT_RET_U2 */)) ||
                    ((opcode >= 509 /* MintOpcode.MINT_RET_I4_IMM */) &&
                        (opcode <= 510 /* MintOpcode.MINT_RET_I8_IMM */))) {
                    if (isConditionallyExecuted || builder.options.countBailouts) {
                        // Not an exit, because returns are normal and we don't want to make them more expensive.
                        // FIXME: Or do we want to record them? Early conditional returns might reduce the value of a trace,
                        //  but the main problem is more likely to be calls early in traces. Worth testing later.
                        append_bailout(builder, ip, 14 /* BailoutReason.Return */);
                        pruneOpcodes = true;
                    }
                    else
                        ip = abort;
                }
                else if ((opcode >= 13 /* MintOpcode.MINT_LDC_I4_0 */) &&
                    (opcode <= 21 /* MintOpcode.MINT_LDC_R8 */)) {
                    if (!emit_ldc(builder, ip, opcode))
                        ip = abort;
                    else
                        skipDregInvalidation = true;
                }
                else if ((opcode >= 74 /* MintOpcode.MINT_MOV_I4_I1 */) &&
                    (opcode <= 85 /* MintOpcode.MINT_MOV_8_4 */)) {
                    if (!emit_mov(builder, ip, opcode))
                        ip = abort;
                }
                else if (
                // binops
                (opcode >= 344 /* MintOpcode.MINT_ADD_I4 */) &&
                    (opcode <= 427 /* MintOpcode.MINT_CLT_UN_R8 */)) {
                    if (!emit_binop(builder, ip, opcode))
                        ip = abort;
                }
                else if (unopTable[opcode]) {
                    if (!emit_unop(builder, ip, opcode))
                        ip = abort;
                }
                else if (relopbranchTable[opcode]) {
                    if (!emit_relop_branch(builder, ip, frame, opcode))
                        ip = abort;
                    else
                        isConditionallyExecuted = true;
                }
                else if (
                // instance ldfld/stfld
                (opcode >= 23 /* MintOpcode.MINT_LDFLD_I1 */) &&
                    (opcode <= 49 /* MintOpcode.MINT_STFLD_R8_UNALIGNED */)) {
                    if (!emit_fieldop(builder, frame, ip, opcode))
                        ip = abort;
                }
                else if (
                // static ldfld/stfld
                (opcode >= 50 /* MintOpcode.MINT_LDSFLD_I1 */) &&
                    (opcode <= 73 /* MintOpcode.MINT_LDTSFLDA */)) {
                    if (!emit_sfieldop(builder, frame, ip, opcode))
                        ip = abort;
                }
                else if (
                // indirect load/store
                (opcode >= 87 /* MintOpcode.MINT_LDIND_I1 */) &&
                    (opcode <= 127 /* MintOpcode.MINT_STIND_OFFSET_IMM_I8 */)) {
                    if (!emit_indirectop(builder, ip, opcode))
                        ip = abort;
                }
                else if (
                // math intrinsics
                (opcode >= 579 /* MintOpcode.MINT_ASIN */) &&
                    (opcode <= 632 /* MintOpcode.MINT_MAXF */)) {
                    if (!emit_math_intrinsic(builder, ip, opcode))
                        ip = abort;
                }
                else if ((opcode >= 315 /* MintOpcode.MINT_LDELEM_I1 */) &&
                    (opcode <= 341 /* MintOpcode.MINT_LDLEN */)) {
                    if (!emit_arrayop(builder, frame, ip, opcode))
                        ip = abort;
                }
                else if ((opcode >= 227 /* MintOpcode.MINT_BRFALSE_I4_SP */) &&
                    (opcode <= 270 /* MintOpcode.MINT_BLT_UN_I8_IMM_SP */)) {
                    // NOTE: This elseif comes last so that specific safepoint branch
                    //  types can be handled by emit_branch or emit_relop_branch,
                    //  to only perform a conditional bailout
                    // complex safepoint branches, just generate a bailout
                    if (builder.branchTargets.size > 0) {
                        // FIXME: Try to reduce the number of these
                        append_exit(builder, ip, exitOpcodeCounter, 8 /* BailoutReason.ComplexBranch */);
                        pruneOpcodes = true;
                    }
                    else
                        ip = abort;
                }
                else if ((opcode >= 652 /* MintOpcode.MINT_SIMD_V128_LDC */) &&
                    (opcode <= 659 /* MintOpcode.MINT_SIMD_INTRINS_P_PPP */)) {
                    builder.containsSimd = true;
                    if (!emit_simd(builder, ip, opcode, opname, simdIntrinsArgCount, simdIntrinsIndex))
                        ip = abort;
                    else
                        // We need to do dreg invalidation differently for simd, especially to handle ldc
                        skipDregInvalidation = true;
                }
                else if ((opcode >= 559 /* MintOpcode.MINT_MONO_MEMORY_BARRIER */) &&
                    (opcode <= 571 /* MintOpcode.MINT_MONO_CMPXCHG_I8 */)) {
                    builder.containsAtomics = true;
                    if (!emit_atomics(builder, ip, opcode))
                        ip = abort;
                }
                else if (opcodeValue === 0) {
                    // This means it was explicitly marked as no-value in the opcode value table
                    //  so we can just skip over it. This is done for things like nops.
                }
                else {
                    /*
                    if (opcodeValue > 0)
                        mono_log_info(`JITERP: aborting trace for opcode ${opname} with value ${opcodeValue}`);
                    */
                    ip = abort;
                }
                break;
        }
        if (ip) {
            if (!skipDregInvalidation) {
                // Invalidate cached values for all the instruction's destination registers.
                // This should have already happened, but it's possible there are opcodes where
                //  our invalidation is incorrect so it's best to do this for safety reasons
                const firstDreg = ip + 2;
                for (let r = 0; r < numDregs; r++) {
                    const dreg = getU16(firstDreg + (r * 2));
                    invalidate_local(dreg);
                }
            }
            if ((trace > 1) || traceOnError || mostRecentOptions.dumpTraces || instrumentedTraceId) {
                let stmtText = `${ip.toString(16)} ${opname} `;
                const firstDreg = ip + 2;
                const firstSreg = firstDreg + (numDregs * 2);
                // print sregs
                for (let r = 0; r < numSregs; r++) {
                    if (r !== 0)
                        stmtText += ", ";
                    stmtText += getU16(firstSreg + (r * 2));
                }
                // print dregs
                if (numDregs > 0)
                    stmtText += " -> ";
                for (let r = 0; r < numDregs; r++) {
                    if (r !== 0)
                        stmtText += ", ";
                    stmtText += getU16(firstDreg + (r * 2));
                }
                builder.traceBuf.push(stmtText);
            }
            if (opcodeValue > 0) {
                if (isConditionallyExecuted)
                    conditionalOpcodeCounter++;
                else
                    prologueOpcodeCounter++;
                result += opcodeValue;
            }
            else if (opcodeValue < 0) {
                // mono_log_info(`JITERP: opcode ${opname} did not abort but had value ${opcodeValue}`);
            }
            ip += (opLengthU16 * 2);
            if (ip <= endOfBody)
                rip = ip;
            // For debugging
            if (emitPadding)
                builder.appendU8(1 /* WasmOpcode.nop */);
        }
        else {
            if (instrumentedTraceId)
                mono_log_info(`instrumented trace ${traceName} aborted for opcode ${opname} @${_ip.toString(16)}`);
            record_abort(builder.traceIndex, _ip, traceName, opcode);
        }
    }
    if (emitPadding)
        builder.appendU8(1 /* WasmOpcode.nop */);
    // We need to close any open blocks before generating our closing ret,
    //  because wasm would allow branching past the ret otherwise
    while (builder.activeBlocks > 0)
        builder.endBlock();
    builder.cfg.exitIp = rip;
    // mono_log_info(`estimated size: ${builder.size + builder.cfg.overheadBytes + builder.bytesGeneratedSoFar}`);
    // HACK: Traces containing simd will be *much* shorter than non-simd traces,
    //  which will cause both the heuristic and our length requirement outside
    //  to reject them. For now, just add a big constant to the length
    if (builder.containsSimd)
        result += 10240;
    return result;
}
const notNullSince = new Map();
let cknullOffset = -1;
function eraseInferredState() {
    cknullOffset = -1;
    notNullSince.clear();
    knownConstants.clear();
}
function invalidate_local(offset) {
    if (cknullOffset === offset)
        cknullOffset = -1;
    notNullSince.delete(offset);
    knownConstants.delete(offset);
}
function invalidate_local_range(start, bytes) {
    for (let i = 0; i < bytes; i += 1)
        invalidate_local(start + i);
}
function append_branch_target_block(builder, ip, isBackBranchTarget) {
    builder.cfg.startBranchBlock(ip, isBackBranchTarget);
}
function computeMemoryAlignment(offset, opcodeOrPrefix, simdOpcode) {
    // First, compute the best possible alignment
    let alignment = 0;
    if (offset % 16 === 0)
        alignment = 4;
    else if (offset % 8 === 0)
        alignment = 3;
    else if (offset % 4 === 0)
        alignment = 2;
    else if (offset % 2 === 0)
        alignment = 1;
    // stackval is 8 bytes. interp aligns the stack to 16 bytes for v128.
    // wasm spec prohibits alignment higher than natural alignment, just to be annoying
    switch (opcodeOrPrefix) {
        case 253 /* WasmOpcode.PREFIX_simd */:
            // For loads that aren't a regular v128 load, assume weird things might be happening with alignment
            alignment = ((simdOpcode === 0 /* WasmSimdOpcode.v128_load */) ||
                (simdOpcode === 11 /* WasmSimdOpcode.v128_store */)) ? Math.min(alignment, 4) : 0;
            break;
        case 41 /* WasmOpcode.i64_load */:
        case 43 /* WasmOpcode.f64_load */:
        case 55 /* WasmOpcode.i64_store */:
        case 57 /* WasmOpcode.f64_store */:
            alignment = Math.min(alignment, 3);
            break;
        case 52 /* WasmOpcode.i64_load32_s */:
        case 53 /* WasmOpcode.i64_load32_u */:
        case 62 /* WasmOpcode.i64_store32 */:
        case 40 /* WasmOpcode.i32_load */:
        case 42 /* WasmOpcode.f32_load */:
        case 54 /* WasmOpcode.i32_store */:
        case 56 /* WasmOpcode.f32_store */:
            alignment = Math.min(alignment, 2);
            break;
        case 50 /* WasmOpcode.i64_load16_s */:
        case 51 /* WasmOpcode.i64_load16_u */:
        case 46 /* WasmOpcode.i32_load16_s */:
        case 47 /* WasmOpcode.i32_load16_u */:
        case 61 /* WasmOpcode.i64_store16 */:
        case 59 /* WasmOpcode.i32_store16 */:
            alignment = Math.min(alignment, 1);
            break;
        case 48 /* WasmOpcode.i64_load8_s */:
        case 49 /* WasmOpcode.i64_load8_u */:
        case 44 /* WasmOpcode.i32_load8_s */:
        case 45 /* WasmOpcode.i32_load8_u */:
        case 60 /* WasmOpcode.i64_store8 */:
        case 58 /* WasmOpcode.i32_store8 */:
            alignment = 0;
            break;
        default:
            alignment = 0;
            break;
    }
    return alignment;
}
function try_append_ldloc_cprop(builder, offset, opcodeOrPrefix, dryRun, requireNonzero) {
    if (builder.options.cprop && (opcodeOrPrefix === 40 /* WasmOpcode.i32_load */)) {
        // It's common to ldc.i4 or ldloca immediately before using the value
        // in these cases the known constant analysis will work consistently, and we can skip the extra
        //  memory load to read the constant we just wrote to a local. the resulting traces should be
        //  both smaller and faster, while still correct since the ldc still writes to memory
        // of course, if known constant analysis is broken, this will break too, but it's better to
        //  learn immediately whether known constant analysis has been broken this whole time
        // at least on x86 this will enable much better native code generation for the trace, since
        //  operations like memory stores have forms that accept an immediate as rhs
        const knownConstant = get_known_constant(builder, offset);
        if (knownConstant) {
            switch (knownConstant.type) {
                case "i32":
                    if (requireNonzero && (knownConstant.value === 0))
                        return false;
                    if (!dryRun)
                        builder.i32_const(knownConstant.value);
                    return true;
                case "ldloca":
                    // FIXME: Do we need to invalidate the local again? I don't think we do, we invalidated it
                    //  when the ldloca operation originally happened, and we're just propagating that address
                    //  constant forward to its point of use
                    // requireNonzero is a no-op since ldloca always produces a nonzero result
                    if (!dryRun)
                        append_ldloca$1(builder, knownConstant.offset, 0);
                    return true;
            }
        }
    }
    return false;
}
function append_ldloc$1(builder, offset, opcodeOrPrefix, simdOpcode) {
    if (try_append_ldloc_cprop(builder, offset, opcodeOrPrefix, false))
        return;
    builder.local("pLocals");
    if (!(opcodeOrPrefix >= 40 /* WasmOpcode.i32_load */)) mono_assert(false, `Expected load opcode but got ${opcodeOrPrefix}`); // inlined mono_assert condition
    builder.appendU8(opcodeOrPrefix);
    if (simdOpcode !== undefined) {
        // This looks wrong but I assure you it's correct.
        builder.appendULeb(simdOpcode);
    }
    else if (opcodeOrPrefix === 253 /* WasmOpcode.PREFIX_simd */) {
        throw new Error("PREFIX_simd ldloc without a simdOpcode");
    }
    const alignment = computeMemoryAlignment(offset, opcodeOrPrefix, simdOpcode);
    builder.appendMemarg(offset, alignment);
}
// You need to have pushed pLocals onto the stack *before* the value you intend to store
// Wasm store opcodes are shaped like xNN.store [offset] [alignment],
//  where the offset+alignment pair is referred to as a 'memarg' by the spec.
// The actual store operation is equivalent to `pBase[offset] = value` (alignment has no
//  observable impact on behavior, other than causing compilation failures if out of range)
function append_stloc_tail(builder, offset, opcodeOrPrefix, simdOpcode) {
    if (!(opcodeOrPrefix >= 54 /* WasmOpcode.i32_store */)) mono_assert(false, `Expected store opcode but got ${opcodeOrPrefix}`); // inlined mono_assert condition
    builder.appendU8(opcodeOrPrefix);
    if (simdOpcode !== undefined) {
        // This looks wrong but I assure you it's correct.
        builder.appendULeb(simdOpcode);
    }
    const alignment = computeMemoryAlignment(offset, opcodeOrPrefix, simdOpcode);
    builder.appendMemarg(offset, alignment);
    invalidate_local(offset);
    // HACK: Invalidate the second stack slot used by a simd vector
    if (simdOpcode !== undefined)
        invalidate_local(offset + 8);
}
// Pass bytesInvalidated=0 if you are reading from the local and the address will never be
//  used for writes
function append_ldloca$1(builder, localOffset, bytesInvalidated) {
    if (bytesInvalidated > 0)
        invalidate_local_range(localOffset, bytesInvalidated);
    builder.lea("pLocals", localOffset);
}
function append_memset_local(builder, localOffset, value, count) {
    invalidate_local_range(localOffset, count);
    // spec: pop n, pop val, pop d, fill from d[0] to d[n] with value val
    if (try_append_memset_fast(builder, localOffset, value, count, false))
        return;
    // spec: pop n, pop val, pop d, fill from d[0] to d[n] with value val
    append_ldloca$1(builder, localOffset, count);
    append_memset_dest(builder, value, count);
}
function append_memmove_local_local(builder, destLocalOffset, sourceLocalOffset, count) {
    invalidate_local_range(destLocalOffset, count);
    if (try_append_memmove_fast(builder, destLocalOffset, sourceLocalOffset, count, false))
        return true;
    // spec: pop n, pop s, pop d, copy n bytes from s to d
    append_ldloca$1(builder, destLocalOffset, count);
    append_ldloca$1(builder, sourceLocalOffset, 0);
    append_memmove_dest_src(builder, count);
}
function isAddressTaken(builder, localOffset) {
    return wrapped_c_functions.mono_jiterp_is_imethod_var_address_taken(get_imethod(builder.frame), localOffset) !== 0;
}
// Loads the specified i32 value and then bails out if it is null, leaving it in the cknull_ptr local.
function append_ldloc_cknull(builder, localOffset, ip, leaveOnStack) {
    const optimize = builder.allowNullCheckOptimization &&
        notNullSince.has(localOffset) &&
        !isAddressTaken(builder, localOffset);
    if (optimize) {
        modifyCounter(7 /* JiterpCounter.NullChecksEliminated */, 1);
        if (nullCheckCaching && (cknullOffset === localOffset)) {
            if (traceNullCheckOptimizations)
                mono_log_info(`(0x${ip.toString(16)}) cknull_ptr == locals[${localOffset}], not null since 0x${notNullSince.get(localOffset).toString(16)}`);
            if (leaveOnStack)
                builder.local("cknull_ptr");
        }
        else {
            // mono_log_info(`skipping null check for ${localOffset}`);
            append_ldloc$1(builder, localOffset, 40 /* WasmOpcode.i32_load */);
            builder.local("cknull_ptr", leaveOnStack ? 34 /* WasmOpcode.tee_local */ : 33 /* WasmOpcode.set_local */);
            if (traceNullCheckOptimizations)
                mono_log_info(`(0x${ip.toString(16)}) cknull_ptr := locals[${localOffset}] (fresh load, already null checked at 0x${notNullSince.get(localOffset).toString(16)})`);
            cknullOffset = localOffset;
        }
        if (nullCheckValidation) {
            builder.local("cknull_ptr");
            append_ldloc$1(builder, localOffset, 40 /* WasmOpcode.i32_load */);
            builder.i32_const(builder.traceIndex);
            builder.i32_const(ip);
            builder.callImport("notnull");
        }
        return;
    }
    append_ldloc$1(builder, localOffset, 40 /* WasmOpcode.i32_load */);
    builder.local("cknull_ptr", 34 /* WasmOpcode.tee_local */);
    builder.appendU8(69 /* WasmOpcode.i32_eqz */);
    builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
    append_bailout(builder, ip, 2 /* BailoutReason.NullCheck */);
    builder.endBlock();
    if (leaveOnStack)
        builder.local("cknull_ptr");
    if (builder.allowNullCheckOptimization &&
        !isAddressTaken(builder, localOffset)) {
        notNullSince.set(localOffset, ip);
        if (traceNullCheckOptimizations)
            mono_log_info(`(0x${ip.toString(16)}) cknull_ptr := locals[${localOffset}] (fresh load, fresh null check)`);
        cknullOffset = localOffset;
    }
    else
        cknullOffset = -1;
}
function emit_ldc(builder, ip, opcode) {
    let storeType = 54 /* WasmOpcode.i32_store */;
    let value;
    const tableEntry = ldcTable[opcode];
    if (tableEntry) {
        builder.local("pLocals");
        builder.appendU8(tableEntry[0]);
        value = tableEntry[1];
        builder.appendLeb(value);
    }
    else {
        switch (opcode) {
            case 15 /* MintOpcode.MINT_LDC_I4_S */:
                builder.local("pLocals");
                value = getArgI16(ip, 2);
                builder.i32_const(value);
                break;
            case 16 /* MintOpcode.MINT_LDC_I4 */:
                builder.local("pLocals");
                value = getArgI32(ip, 2);
                builder.i32_const(value);
                break;
            case 17 /* MintOpcode.MINT_LDC_I8_0 */:
                builder.local("pLocals");
                builder.i52_const(0);
                storeType = 55 /* WasmOpcode.i64_store */;
                break;
            case 19 /* MintOpcode.MINT_LDC_I8 */:
                builder.local("pLocals");
                builder.appendU8(66 /* WasmOpcode.i64_const */);
                builder.appendLebRef(ip + (2 * 2), true);
                storeType = 55 /* WasmOpcode.i64_store */;
                break;
            case 18 /* MintOpcode.MINT_LDC_I8_S */:
                builder.local("pLocals");
                builder.i52_const(getArgI16(ip, 2));
                storeType = 55 /* WasmOpcode.i64_store */;
                break;
            case 20 /* MintOpcode.MINT_LDC_R4 */:
                builder.local("pLocals");
                builder.appendU8(67 /* WasmOpcode.f32_const */);
                builder.appendF32(getArgF32(ip, 2));
                storeType = 56 /* WasmOpcode.f32_store */;
                break;
            case 21 /* MintOpcode.MINT_LDC_R8 */:
                builder.local("pLocals");
                builder.appendU8(68 /* WasmOpcode.f64_const */);
                builder.appendF64(getArgF64(ip, 2));
                storeType = 57 /* WasmOpcode.f64_store */;
                break;
            default:
                return false;
        }
    }
    // spec: pop c, pop i, i[offset]=c
    builder.appendU8(storeType);
    // These are constants being stored into locals and are always at least 4 bytes
    //  so we can use a 4 byte alignment (8 would be nice if we could guarantee
    //  that locals are 8-byte aligned)
    const localOffset = getArgU16(ip, 1);
    builder.appendMemarg(localOffset, 2);
    invalidate_local(localOffset);
    if (typeof (value) === "number")
        knownConstants.set(localOffset, { type: "i32", value: value });
    else
        knownConstants.delete(localOffset);
    return true;
}
function emit_mov(builder, ip, opcode) {
    let loadOp = 40 /* WasmOpcode.i32_load */, storeOp = 54 /* WasmOpcode.i32_store */;
    switch (opcode) {
        case 74 /* MintOpcode.MINT_MOV_I4_I1 */:
            loadOp = 44 /* WasmOpcode.i32_load8_s */;
            break;
        case 75 /* MintOpcode.MINT_MOV_I4_U1 */:
            loadOp = 45 /* WasmOpcode.i32_load8_u */;
            break;
        case 76 /* MintOpcode.MINT_MOV_I4_I2 */:
            loadOp = 46 /* WasmOpcode.i32_load16_s */;
            break;
        case 77 /* MintOpcode.MINT_MOV_I4_U2 */:
            loadOp = 47 /* WasmOpcode.i32_load16_u */;
            break;
        case 78 /* MintOpcode.MINT_MOV_1 */:
            loadOp = 45 /* WasmOpcode.i32_load8_u */;
            storeOp = 58 /* WasmOpcode.i32_store8 */;
            break;
        case 79 /* MintOpcode.MINT_MOV_2 */:
            loadOp = 47 /* WasmOpcode.i32_load16_u */;
            storeOp = 59 /* WasmOpcode.i32_store16 */;
            break;
        case 80 /* MintOpcode.MINT_MOV_4 */:
            break;
        case 81 /* MintOpcode.MINT_MOV_8 */:
            loadOp = 41 /* WasmOpcode.i64_load */;
            storeOp = 55 /* WasmOpcode.i64_store */;
            break;
        case 82 /* MintOpcode.MINT_MOV_VT */: {
            const sizeBytes = getArgU16(ip, 3);
            append_memmove_local_local(builder, getArgU16(ip, 1), getArgU16(ip, 2), sizeBytes);
            return true;
        }
        case 83 /* MintOpcode.MINT_MOV_8_2 */:
            append_memmove_local_local(builder, getArgU16(ip, 1), getArgU16(ip, 2), 8);
            append_memmove_local_local(builder, getArgU16(ip, 3), getArgU16(ip, 4), 8);
            return true;
        case 84 /* MintOpcode.MINT_MOV_8_3 */:
            append_memmove_local_local(builder, getArgU16(ip, 1), getArgU16(ip, 2), 8);
            append_memmove_local_local(builder, getArgU16(ip, 3), getArgU16(ip, 4), 8);
            append_memmove_local_local(builder, getArgU16(ip, 5), getArgU16(ip, 6), 8);
            return true;
        case 85 /* MintOpcode.MINT_MOV_8_4 */:
            append_memmove_local_local(builder, getArgU16(ip, 1), getArgU16(ip, 2), 8);
            append_memmove_local_local(builder, getArgU16(ip, 3), getArgU16(ip, 4), 8);
            append_memmove_local_local(builder, getArgU16(ip, 5), getArgU16(ip, 6), 8);
            append_memmove_local_local(builder, getArgU16(ip, 7), getArgU16(ip, 8), 8);
            return true;
        default:
            return false;
    }
    // i
    builder.local("pLocals");
    // c = LOCAL_VAR (ip [2], argtype2)
    append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
    append_stloc_tail(builder, getArgU16(ip, 1), storeOp);
    return true;
}
function append_vtable_initialize(builder, pVtable, ip) {
    // TODO: Actually initialize the vtable instead of just checking and bailing out?
    builder.block();
    // FIXME: This will prevent us from reusing traces between runs since the vtables can move
    // We could bake the offset of the flag into this but it's nice to have the vtable ptr
    //  in the trace as a constant visible in the wasm
    builder.ptr_const(pVtable);
    builder.appendU8(45 /* WasmOpcode.i32_load8_u */);
    builder.appendMemarg(getMemberOffset(0 /* JiterpMember.VtableInitialized */), 0);
    builder.appendU8(13 /* WasmOpcode.br_if */);
    builder.appendULeb(0);
    append_bailout(builder, ip, 3 /* BailoutReason.VtableNotInitialized */);
    builder.endBlock();
}
function emit_fieldop(builder, frame, ip, opcode) {
    const isLoad = ((opcode >= 23 /* MintOpcode.MINT_LDFLD_I1 */) &&
        (opcode <= 36 /* MintOpcode.MINT_LDFLDA_UNSAFE */)) ||
        ((opcode >= 50 /* MintOpcode.MINT_LDSFLD_I1 */) &&
            (opcode <= 60 /* MintOpcode.MINT_LDSFLD_W */));
    const objectOffset = getArgU16(ip, isLoad ? 2 : 1), fieldOffset = getArgU16(ip, 3), localOffset = getArgU16(ip, isLoad ? 1 : 2);
    // Check this before potentially emitting a cknull
    const notNull = builder.allowNullCheckOptimization &&
        notNullSince.has(objectOffset) &&
        !isAddressTaken(builder, objectOffset);
    // TODO: Figure out whether this is commonly used to access fields of structs that
    //  live on the stack, and if so, whether we want to do cprop of the ldloca
    if ((opcode !== 36 /* MintOpcode.MINT_LDFLDA_UNSAFE */) &&
        (opcode !== 45 /* MintOpcode.MINT_STFLD_O */))
        append_ldloc_cknull(builder, objectOffset, ip, false);
    let setter = 54 /* WasmOpcode.i32_store */, getter = 40 /* WasmOpcode.i32_load */;
    switch (opcode) {
        case 23 /* MintOpcode.MINT_LDFLD_I1 */:
            getter = 44 /* WasmOpcode.i32_load8_s */;
            break;
        case 24 /* MintOpcode.MINT_LDFLD_U1 */:
            getter = 45 /* WasmOpcode.i32_load8_u */;
            break;
        case 25 /* MintOpcode.MINT_LDFLD_I2 */:
            getter = 46 /* WasmOpcode.i32_load16_s */;
            break;
        case 26 /* MintOpcode.MINT_LDFLD_U2 */:
            getter = 47 /* WasmOpcode.i32_load16_u */;
            break;
        case 31 /* MintOpcode.MINT_LDFLD_O */:
        case 41 /* MintOpcode.MINT_STFLD_I4 */:
        case 27 /* MintOpcode.MINT_LDFLD_I4 */:
            // default
            break;
        case 43 /* MintOpcode.MINT_STFLD_R4 */:
        case 29 /* MintOpcode.MINT_LDFLD_R4 */:
            getter = 42 /* WasmOpcode.f32_load */;
            setter = 56 /* WasmOpcode.f32_store */;
            break;
        case 44 /* MintOpcode.MINT_STFLD_R8 */:
        case 30 /* MintOpcode.MINT_LDFLD_R8 */:
            getter = 43 /* WasmOpcode.f64_load */;
            setter = 57 /* WasmOpcode.f64_store */;
            break;
        case 37 /* MintOpcode.MINT_STFLD_I1 */:
        case 38 /* MintOpcode.MINT_STFLD_U1 */:
            setter = 58 /* WasmOpcode.i32_store8 */;
            break;
        case 39 /* MintOpcode.MINT_STFLD_I2 */:
        case 40 /* MintOpcode.MINT_STFLD_U2 */:
            setter = 59 /* WasmOpcode.i32_store16 */;
            break;
        case 28 /* MintOpcode.MINT_LDFLD_I8 */:
        case 42 /* MintOpcode.MINT_STFLD_I8 */:
            getter = 41 /* WasmOpcode.i64_load */;
            setter = 55 /* WasmOpcode.i64_store */;
            break;
        case 45 /* MintOpcode.MINT_STFLD_O */: {
            /*
             * Writing a ref-type field has to call an import to perform the write barrier anyway,
             *  and technically it should use a different kind of barrier from copy_ptr. So
             *  we define a special import that is responsible for performing the whole stfld_o
             *  operation with as little trace-side overhead as possible
             * Previously the pseudocode looked like:
             *  cknull_ptr = *(MonoObject *)&locals[objectOffset];
             *  if (!cknull_ptr) bailout;
             *  copy_ptr(cknull_ptr + fieldOffset, *(MonoObject *)&locals[localOffset])
             * The null check optimization also allows us to safely omit the bailout check
             *  if we know that the target object isn't null. Even if the target object were
             *  somehow null in this case (bad! shouldn't be possible!) it won't be a crash
             *  because the implementation of stfld_o does its own null check.
             */
            if (!notNull)
                builder.block();
            builder.local("pLocals");
            builder.i32_const(fieldOffset);
            builder.i32_const(objectOffset); // dest
            builder.i32_const(localOffset); // src
            builder.callImport("stfld_o");
            if (!notNull) {
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 2 /* BailoutReason.NullCheck */);
                builder.endBlock();
            }
            else {
                if (traceNullCheckOptimizations)
                    mono_log_info(`(0x${ip.toString(16)}) locals[${objectOffset}] not null since 0x${notNullSince.get(objectOffset).toString(16)}`);
                builder.appendU8(26 /* WasmOpcode.drop */);
                modifyCounter(7 /* JiterpCounter.NullChecksEliminated */, 1);
                if (nullCheckValidation) {
                    // cknull_ptr was not used here so all we can do is verify that the target object is not null
                    append_ldloc$1(builder, objectOffset, 40 /* WasmOpcode.i32_load */);
                    append_ldloc$1(builder, objectOffset, 40 /* WasmOpcode.i32_load */);
                    builder.i32_const(builder.traceIndex);
                    builder.i32_const(ip);
                    builder.callImport("notnull");
                }
            }
            return true;
        }
        case 32 /* MintOpcode.MINT_LDFLD_VT */: {
            const sizeBytes = getArgU16(ip, 4);
            // dest
            append_ldloca$1(builder, localOffset, sizeBytes);
            // src
            builder.local("cknull_ptr");
            if (fieldOffset !== 0) {
                builder.i32_const(fieldOffset);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
            }
            append_memmove_dest_src(builder, sizeBytes);
            return true;
        }
        case 46 /* MintOpcode.MINT_STFLD_VT */: {
            const klass = get_imethod_data(frame, getArgU16(ip, 4));
            // dest = (char*)o + ip [3]
            builder.local("cknull_ptr");
            if (fieldOffset !== 0) {
                builder.i32_const(fieldOffset);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
            }
            // src = locals + ip [2]
            append_ldloca$1(builder, localOffset, 0);
            builder.ptr_const(klass);
            builder.callImport("value_copy");
            return true;
        }
        case 47 /* MintOpcode.MINT_STFLD_VT_NOREF */: {
            const sizeBytes = getArgU16(ip, 4);
            // dest
            builder.local("cknull_ptr");
            if (fieldOffset !== 0) {
                builder.i32_const(fieldOffset);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
            }
            // src
            append_ldloca$1(builder, localOffset, 0);
            append_memmove_dest_src(builder, sizeBytes);
            return true;
        }
        case 36 /* MintOpcode.MINT_LDFLDA_UNSAFE */:
        case 35 /* MintOpcode.MINT_LDFLDA */:
            builder.local("pLocals");
            // cknull_ptr isn't always initialized here
            append_ldloc$1(builder, objectOffset, 40 /* WasmOpcode.i32_load */);
            if (fieldOffset !== 0) {
                builder.i32_const(fieldOffset);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
            }
            append_stloc_tail(builder, localOffset, setter);
            return true;
        default:
            return false;
    }
    if (isLoad)
        builder.local("pLocals");
    builder.local("cknull_ptr");
    if (isLoad) {
        builder.appendU8(getter);
        builder.appendMemarg(fieldOffset, 0);
        append_stloc_tail(builder, localOffset, setter);
        return true;
    }
    else {
        append_ldloc$1(builder, localOffset, getter);
        builder.appendU8(setter);
        builder.appendMemarg(fieldOffset, 0);
        return true;
    }
}
function emit_sfieldop(builder, frame, ip, opcode) {
    const isLoad = ((opcode >= 23 /* MintOpcode.MINT_LDFLD_I1 */) &&
        (opcode <= 36 /* MintOpcode.MINT_LDFLDA_UNSAFE */)) ||
        ((opcode >= 50 /* MintOpcode.MINT_LDSFLD_I1 */) &&
            (opcode <= 60 /* MintOpcode.MINT_LDSFLD_W */));
    const localOffset = getArgU16(ip, 1), pVtable = get_imethod_data(frame, getArgU16(ip, 2)), pStaticData = get_imethod_data(frame, getArgU16(ip, 3));
    append_vtable_initialize(builder, pVtable, ip);
    let setter = 54 /* WasmOpcode.i32_store */, getter = 40 /* WasmOpcode.i32_load */;
    switch (opcode) {
        case 50 /* MintOpcode.MINT_LDSFLD_I1 */:
            getter = 44 /* WasmOpcode.i32_load8_s */;
            break;
        case 51 /* MintOpcode.MINT_LDSFLD_U1 */:
            getter = 45 /* WasmOpcode.i32_load8_u */;
            break;
        case 52 /* MintOpcode.MINT_LDSFLD_I2 */:
            getter = 46 /* WasmOpcode.i32_load16_s */;
            break;
        case 53 /* MintOpcode.MINT_LDSFLD_U2 */:
            getter = 47 /* WasmOpcode.i32_load16_u */;
            break;
        case 58 /* MintOpcode.MINT_LDSFLD_O */:
        case 65 /* MintOpcode.MINT_STSFLD_I4 */:
        case 54 /* MintOpcode.MINT_LDSFLD_I4 */:
            // default
            break;
        case 67 /* MintOpcode.MINT_STSFLD_R4 */:
        case 56 /* MintOpcode.MINT_LDSFLD_R4 */:
            getter = 42 /* WasmOpcode.f32_load */;
            setter = 56 /* WasmOpcode.f32_store */;
            break;
        case 68 /* MintOpcode.MINT_STSFLD_R8 */:
        case 57 /* MintOpcode.MINT_LDSFLD_R8 */:
            getter = 43 /* WasmOpcode.f64_load */;
            setter = 57 /* WasmOpcode.f64_store */;
            break;
        case 61 /* MintOpcode.MINT_STSFLD_I1 */:
        case 62 /* MintOpcode.MINT_STSFLD_U1 */:
            setter = 58 /* WasmOpcode.i32_store8 */;
            break;
        case 63 /* MintOpcode.MINT_STSFLD_I2 */:
        case 64 /* MintOpcode.MINT_STSFLD_U2 */:
            setter = 59 /* WasmOpcode.i32_store16 */;
            break;
        case 55 /* MintOpcode.MINT_LDSFLD_I8 */:
        case 66 /* MintOpcode.MINT_STSFLD_I8 */:
            getter = 41 /* WasmOpcode.i64_load */;
            setter = 55 /* WasmOpcode.i64_store */;
            break;
        case 69 /* MintOpcode.MINT_STSFLD_O */:
            // dest
            builder.ptr_const(pStaticData);
            // src
            append_ldloca$1(builder, localOffset, 0);
            // We don't need to use gc_wbarrier_set_field_internal here because there's no object
            //  reference, interp does a raw write
            builder.callImport("copy_ptr");
            return true;
        case 59 /* MintOpcode.MINT_LDSFLD_VT */: {
            const sizeBytes = getArgU16(ip, 4);
            // dest
            append_ldloca$1(builder, localOffset, sizeBytes);
            // src
            builder.ptr_const(pStaticData);
            append_memmove_dest_src(builder, sizeBytes);
            return true;
        }
        case 72 /* MintOpcode.MINT_LDSFLDA */:
            builder.local("pLocals");
            builder.ptr_const(pStaticData);
            append_stloc_tail(builder, localOffset, setter);
            return true;
        default:
            return false;
    }
    if (isLoad) {
        builder.local("pLocals");
        builder.ptr_const(pStaticData);
        builder.appendU8(getter);
        builder.appendMemarg(0, 0);
        append_stloc_tail(builder, localOffset, setter);
        return true;
    }
    else {
        builder.ptr_const(pStaticData);
        append_ldloc$1(builder, localOffset, getter);
        builder.appendU8(setter);
        builder.appendMemarg(0, 0);
        return true;
    }
}
function emit_binop(builder, ip, opcode) {
    // operands are popped right to left, which means you build the arg list left to right
    let lhsLoadOp, rhsLoadOp, storeOp, lhsVar = "math_lhs32", rhsVar = "math_rhs32", info, operandsCached = false;
    const intrinsicFpBinop = intrinsicFpBinops[opcode];
    if (intrinsicFpBinop) {
        builder.local("pLocals");
        const isF64 = intrinsicFpBinop == 1 /* WasmOpcode.nop */;
        append_ldloc$1(builder, getArgU16(ip, 2), isF64 ? 43 /* WasmOpcode.f64_load */ : 42 /* WasmOpcode.f32_load */);
        if (!isF64)
            builder.appendU8(intrinsicFpBinop);
        append_ldloc$1(builder, getArgU16(ip, 3), isF64 ? 43 /* WasmOpcode.f64_load */ : 42 /* WasmOpcode.f32_load */);
        if (!isF64)
            builder.appendU8(intrinsicFpBinop);
        builder.i32_const(opcode);
        builder.callImport("relop_fp");
        append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
        return true;
    }
    switch (opcode) {
        case 382 /* MintOpcode.MINT_REM_R4 */:
        case 383 /* MintOpcode.MINT_REM_R8 */:
            return emit_math_intrinsic(builder, ip, opcode);
        default: {
            info = binopTable[opcode];
            if (!info)
                return false;
            if (info.length > 3) {
                lhsLoadOp = info[1];
                rhsLoadOp = info[2];
                storeOp = info[3];
            }
            else {
                lhsLoadOp = rhsLoadOp = info[1];
                storeOp = info[2];
            }
        }
    }
    switch (opcode) {
        case 356 /* MintOpcode.MINT_DIV_I4 */:
        case 357 /* MintOpcode.MINT_DIV_I8 */:
        case 360 /* MintOpcode.MINT_DIV_UN_I4 */:
        case 361 /* MintOpcode.MINT_DIV_UN_I8 */:
        case 380 /* MintOpcode.MINT_REM_I4 */:
        case 381 /* MintOpcode.MINT_REM_I8 */:
        case 384 /* MintOpcode.MINT_REM_UN_I4 */:
        case 385 /* MintOpcode.MINT_REM_UN_I8 */: {
            const is64 = (opcode === 361 /* MintOpcode.MINT_DIV_UN_I8 */) ||
                (opcode === 385 /* MintOpcode.MINT_REM_UN_I8 */) ||
                (opcode === 357 /* MintOpcode.MINT_DIV_I8 */) ||
                (opcode === 381 /* MintOpcode.MINT_REM_I8 */);
            lhsVar = is64 ? "math_lhs64" : "math_lhs32";
            rhsVar = is64 ? "math_rhs64" : "math_rhs32";
            builder.block();
            append_ldloc$1(builder, getArgU16(ip, 2), lhsLoadOp);
            builder.local(lhsVar, 33 /* WasmOpcode.set_local */);
            append_ldloc$1(builder, getArgU16(ip, 3), rhsLoadOp);
            builder.local(rhsVar, 34 /* WasmOpcode.tee_local */);
            operandsCached = true;
            // br_if requires an i32 so to do our divide by zero check on an i64
            //  we do i64_eqz and then i32_eqz to invert the flag
            if (is64) {
                builder.appendU8(80 /* WasmOpcode.i64_eqz */);
                builder.appendU8(69 /* WasmOpcode.i32_eqz */);
            }
            // If rhs is zero we want to bailout because it's a divide by zero.
            // A nonzero divisor will cause us to skip past this bailout
            builder.appendU8(13 /* WasmOpcode.br_if */);
            builder.appendULeb(0);
            append_bailout(builder, ip, 12 /* BailoutReason.DivideByZero */);
            builder.endBlock();
            // Also perform overflow check for signed division operations
            if ((opcode === 356 /* MintOpcode.MINT_DIV_I4 */) ||
                (opcode === 380 /* MintOpcode.MINT_REM_I4 */) ||
                (opcode === 357 /* MintOpcode.MINT_DIV_I8 */) ||
                (opcode === 381 /* MintOpcode.MINT_REM_I8 */)) {
                builder.block();
                builder.local(rhsVar);
                // If rhs is -1 and lhs is INTnn_MIN this is an overflow
                if (is64)
                    builder.i52_const(-1);
                else
                    builder.i32_const(-1);
                builder.appendU8(is64 ? 82 /* WasmOpcode.i64_ne */ : 71 /* WasmOpcode.i32_ne */);
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                // rhs was -1 since the previous br_if didn't execute. Now check lhs.
                builder.local(lhsVar);
                // INTnn_MIN
                builder.appendU8(is64 ? 66 /* WasmOpcode.i64_const */ : 65 /* WasmOpcode.i32_const */);
                builder.appendBoundaryValue(is64 ? 64 : 32, -1);
                builder.appendU8(is64 ? 82 /* WasmOpcode.i64_ne */ : 71 /* WasmOpcode.i32_ne */);
                builder.appendU8(13 /* WasmOpcode.br_if */);
                builder.appendULeb(0);
                append_bailout(builder, ip, 13 /* BailoutReason.Overflow */);
                builder.endBlock();
            }
            break;
        }
        case 362 /* MintOpcode.MINT_ADD_OVF_I4 */:
        case 364 /* MintOpcode.MINT_ADD_OVF_UN_I4 */:
        case 366 /* MintOpcode.MINT_MUL_OVF_I4 */:
        case 368 /* MintOpcode.MINT_MUL_OVF_UN_I4 */:
            // Perform overflow check before the operation
            append_ldloc$1(builder, getArgU16(ip, 2), lhsLoadOp);
            builder.local(lhsVar, 34 /* WasmOpcode.tee_local */);
            append_ldloc$1(builder, getArgU16(ip, 3), rhsLoadOp);
            builder.local(rhsVar, 34 /* WasmOpcode.tee_local */);
            builder.i32_const(opcode);
            builder.callImport(((opcode === 364 /* MintOpcode.MINT_ADD_OVF_UN_I4 */) ||
                (opcode === 368 /* MintOpcode.MINT_MUL_OVF_UN_I4 */))
                ? "ckovr_u4"
                : "ckovr_i4");
            builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
            append_bailout(builder, ip, 13 /* BailoutReason.Overflow */);
            builder.endBlock();
            operandsCached = true;
            break;
    }
    // i
    builder.local("pLocals");
    // c = (lhs op rhs)
    if (operandsCached) {
        builder.local(lhsVar);
        builder.local(rhsVar);
    }
    else {
        append_ldloc$1(builder, getArgU16(ip, 2), lhsLoadOp);
        append_ldloc$1(builder, getArgU16(ip, 3), rhsLoadOp);
    }
    builder.appendU8(info[0]);
    append_stloc_tail(builder, getArgU16(ip, 1), storeOp);
    return true;
}
function emit_unop(builder, ip, opcode) {
    // operands are popped right to left, which means you build the arg list left to right
    const info = unopTable[opcode];
    if (!info)
        return false;
    const loadOp = info[1];
    const storeOp = info[2];
    // i
    if ((opcode < 472 /* MintOpcode.MINT_CONV_OVF_I1_I4 */) ||
        (opcode > 507 /* MintOpcode.MINT_CONV_OVF_U8_R8 */))
        builder.local("pLocals");
    // c = (op value)
    switch (opcode) {
        case 428 /* MintOpcode.MINT_ADD1_I4 */:
        case 430 /* MintOpcode.MINT_SUB1_I4 */:
            // We implement this as binary 'x +/- 1', the table already has i32_add so we just
            //  need to emit a 1 constant
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            builder.i32_const(1);
            break;
        case 432 /* MintOpcode.MINT_NEG_I4 */:
            // there's no negate operator so we generate '0 - x'
            builder.i32_const(0);
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            break;
        case 436 /* MintOpcode.MINT_NOT_I4 */:
            // there's no not operator so we generate 'x xor -1'
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            builder.i32_const(-1);
            break;
        case 444 /* MintOpcode.MINT_CONV_U1_I4 */:
        case 445 /* MintOpcode.MINT_CONV_U1_I8 */:
            // For (unsigned char) cast of i32/i64 we do an & 255
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            if (loadOp === 41 /* WasmOpcode.i64_load */)
                builder.appendU8(167 /* WasmOpcode.i32_wrap_i64 */);
            builder.i32_const(0xFF);
            break;
        case 452 /* MintOpcode.MINT_CONV_U2_I4 */:
        case 453 /* MintOpcode.MINT_CONV_U2_I8 */:
            // For (unsigned short) cast of i32/i64 we do an & 65535
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            if (loadOp === 41 /* WasmOpcode.i64_load */)
                builder.appendU8(167 /* WasmOpcode.i32_wrap_i64 */);
            builder.i32_const(0xFFFF);
            break;
        case 440 /* MintOpcode.MINT_CONV_I1_I4 */:
        case 441 /* MintOpcode.MINT_CONV_I1_I8 */:
            // For (char) cast of i32 we do (val << 24) >> 24
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            if (loadOp === 41 /* WasmOpcode.i64_load */)
                builder.appendU8(167 /* WasmOpcode.i32_wrap_i64 */);
            builder.i32_const(24);
            builder.appendU8(116 /* WasmOpcode.i32_shl */);
            builder.i32_const(24);
            break;
        case 448 /* MintOpcode.MINT_CONV_I2_I4 */:
        case 449 /* MintOpcode.MINT_CONV_I2_I8 */:
            // For (char) cast of i32 we do (val << 16) >> 16
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            if (loadOp === 41 /* WasmOpcode.i64_load */)
                builder.appendU8(167 /* WasmOpcode.i32_wrap_i64 */);
            builder.i32_const(16);
            builder.appendU8(116 /* WasmOpcode.i32_shl */);
            builder.i32_const(16);
            break;
        case 429 /* MintOpcode.MINT_ADD1_I8 */:
        case 431 /* MintOpcode.MINT_SUB1_I8 */:
            // We implement this as binary 'x +/- 1', the table already has i32_add so we just
            //  need to emit a 1 constant
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            builder.i52_const(1);
            break;
        case 433 /* MintOpcode.MINT_NEG_I8 */:
            // there's no negate operator so we generate '0 - x'
            builder.i52_const(0);
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            break;
        case 437 /* MintOpcode.MINT_NOT_I8 */:
            // there's no not operator so we generate 'x xor -1'
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            builder.i52_const(-1);
            break;
        case 511 /* MintOpcode.MINT_ADD_I4_IMM */:
        case 515 /* MintOpcode.MINT_MUL_I4_IMM */:
        case 519 /* MintOpcode.MINT_AND_I4_IMM */:
        case 521 /* MintOpcode.MINT_OR_I4_IMM */:
        case 525 /* MintOpcode.MINT_SHL_I4_IMM */:
        case 527 /* MintOpcode.MINT_SHR_I4_IMM */:
        case 523 /* MintOpcode.MINT_SHR_UN_I4_IMM */:
        case 640 /* MintOpcode.MINT_ROL_I4_IMM */:
        case 642 /* MintOpcode.MINT_ROR_I4_IMM */:
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            builder.i32_const(getArgI16(ip, 3));
            break;
        case 512 /* MintOpcode.MINT_ADD_I4_IMM2 */:
        case 516 /* MintOpcode.MINT_MUL_I4_IMM2 */:
        case 520 /* MintOpcode.MINT_AND_I4_IMM2 */:
        case 522 /* MintOpcode.MINT_OR_I4_IMM2 */:
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            builder.i32_const(getArgI32(ip, 3));
            break;
        case 513 /* MintOpcode.MINT_ADD_I8_IMM */:
        case 517 /* MintOpcode.MINT_MUL_I8_IMM */:
        case 526 /* MintOpcode.MINT_SHL_I8_IMM */:
        case 528 /* MintOpcode.MINT_SHR_I8_IMM */:
        case 524 /* MintOpcode.MINT_SHR_UN_I8_IMM */:
        case 641 /* MintOpcode.MINT_ROL_I8_IMM */:
        case 643 /* MintOpcode.MINT_ROR_I8_IMM */:
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            builder.i52_const(getArgI16(ip, 3));
            break;
        case 514 /* MintOpcode.MINT_ADD_I8_IMM2 */:
        case 518 /* MintOpcode.MINT_MUL_I8_IMM2 */:
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            builder.i52_const(getArgI32(ip, 3));
            break;
        default:
            append_ldloc$1(builder, getArgU16(ip, 2), loadOp);
            break;
    }
    if (info[0] !== 1 /* WasmOpcode.nop */)
        builder.appendU8(info[0]);
    append_stloc_tail(builder, getArgU16(ip, 1), storeOp);
    return true;
}
function append_call_handler_store_ret_ip(builder, ip, frame, opcode) {
    const shortOffset = (opcode === 133 /* MintOpcode.MINT_CALL_HANDLER_S */), retIp = shortOffset ? ip + (3 * 2) : ip + (4 * 2), clauseIndex = getU16(retIp - 2), clauseDataOffset = get_imethod_clause_data_offset(frame, clauseIndex);
    // note: locals here is unsigned char *, not stackval *, so clauseDataOffset is in bytes
    // *(const guint16**)(locals + frame->imethod->clause_data_offsets [clause_index]) = ret_ip;
    builder.local("pLocals");
    builder.ptr_const(retIp);
    builder.appendU8(54 /* WasmOpcode.i32_store */);
    builder.appendMemarg(clauseDataOffset, 0); // FIXME: 32-bit alignment?
    // mono_log_info(`call_handler @0x${(<any>ip).toString(16)} retIp=0x${retIp.toString(16)}`);
    builder.callHandlerReturnAddresses.push(retIp);
}
function getBranchDisplacement(ip, opcode) {
    const opArgType = wrapped_c_functions.mono_jiterp_get_opcode_info(opcode, 4 /* OpcodeInfoType.OpArgType */), payloadOffset = wrapped_c_functions.mono_jiterp_get_opcode_info(opcode, 2 /* OpcodeInfoType.Sregs */), payloadAddress = ip + 2 + (payloadOffset * 2);
    let result;
    switch (opArgType) {
        case 7 /* MintOpArgType.MintOpBranch */:
            result = getI32_unaligned(payloadAddress);
            break;
        case 8 /* MintOpArgType.MintOpShortBranch */:
            result = getI16(payloadAddress);
            break;
        case 17 /* MintOpArgType.MintOpShortAndShortBranch */:
            result = getI16(payloadAddress + 2);
            break;
        default:
            return undefined;
    }
    if (traceBranchDisplacements)
        mono_log_info(`${getOpcodeName(opcode)} @${ip} displacement=${result}`);
    return result;
}
function emit_branch(builder, ip, frame, opcode) {
    const isSafepoint = (opcode >= 227 /* MintOpcode.MINT_BRFALSE_I4_SP */) &&
        (opcode <= 270 /* MintOpcode.MINT_BLT_UN_I8_IMM_SP */);
    const displacement = getBranchDisplacement(ip, opcode);
    if (typeof (displacement) !== "number")
        return false;
    // If the branch is taken we bail out to allow the interpreter to do it.
    // So for brtrue, we want to do 'cond == 0' to produce a bailout only
    //  when the branch will be taken (by skipping the bailout in this block)
    // When branches are enabled, instead we set eip and then break out of
    //  the current branch block and execution proceeds forward to find the
    //  branch target (if possible), bailing out at the end otherwise
    switch (opcode) {
        case 132 /* MintOpcode.MINT_CALL_HANDLER */:
        case 133 /* MintOpcode.MINT_CALL_HANDLER_S */:
        case 128 /* MintOpcode.MINT_BR */:
        case 129 /* MintOpcode.MINT_BR_S */: {
            const isCallHandler = (opcode === 132 /* MintOpcode.MINT_CALL_HANDLER */) ||
                (opcode === 133 /* MintOpcode.MINT_CALL_HANDLER_S */);
            const destination = ip + (displacement * 2);
            if (displacement <= 0) {
                if (builder.backBranchOffsets.indexOf(destination) >= 0) {
                    // We found a backward branch target we can branch to, so we branch out
                    //  to the top of the loop body
                    // append_safepoint(builder, ip);
                    if (builder.backBranchTraceLevel > 1)
                        mono_log_info(`0x${ip.toString(16)} performing backward branch to 0x${destination.toString(16)}`);
                    if (isCallHandler)
                        append_call_handler_store_ret_ip(builder, ip, frame, opcode);
                    builder.cfg.branch(destination, true, 0 /* CfgBranchType.Unconditional */);
                    modifyCounter(9 /* JiterpCounter.BackBranchesEmitted */, 1);
                    return true;
                }
                else {
                    if (destination < builder.cfg.entryIp) {
                        if ((builder.backBranchTraceLevel > 1) || (builder.cfg.trace > 1))
                            mono_log_info(`0x${ip.toString(16)} ${getOpcodeName(opcode)} target 0x${destination.toString(16)} before start of trace`);
                    }
                    else if ((builder.backBranchTraceLevel > 0) || (builder.cfg.trace > 0))
                        mono_log_info(`0x${ip.toString(16)} ${getOpcodeName(opcode)} target 0x${destination.toString(16)} not found in list ` +
                            builder.backBranchOffsets.map(bbo => "0x" + bbo.toString(16)).join(", "));
                    wrapped_c_functions.mono_jiterp_boost_back_branch_target(destination);
                    append_bailout(builder, destination, 5 /* BailoutReason.BackwardBranch */);
                    modifyCounter(10 /* JiterpCounter.BackBranchesNotEmitted */, 1);
                    return true;
                }
            }
            else {
                // Simple branches are enabled and this is a forward branch. We
                //  don't need to wrap things in a block here, we can just exit
                //  the current branch block after updating eip
                builder.branchTargets.add(destination);
                if (isCallHandler)
                    append_call_handler_store_ret_ip(builder, ip, frame, opcode);
                builder.cfg.branch(destination, false, 0 /* CfgBranchType.Unconditional */);
                return true;
            }
        }
        case 145 /* MintOpcode.MINT_BRTRUE_I4_S */:
        case 143 /* MintOpcode.MINT_BRFALSE_I4_S */:
        case 229 /* MintOpcode.MINT_BRTRUE_I4_SP */:
        case 227 /* MintOpcode.MINT_BRFALSE_I4_SP */:
        case 146 /* MintOpcode.MINT_BRTRUE_I8_S */:
        case 144 /* MintOpcode.MINT_BRFALSE_I8_S */: {
            const is64 = (opcode === 146 /* MintOpcode.MINT_BRTRUE_I8_S */) ||
                (opcode === 144 /* MintOpcode.MINT_BRFALSE_I8_S */);
            // Load the condition
            append_ldloc$1(builder, getArgU16(ip, 1), is64 ? 41 /* WasmOpcode.i64_load */ : 40 /* WasmOpcode.i32_load */);
            if ((opcode === 143 /* MintOpcode.MINT_BRFALSE_I4_S */) ||
                (opcode === 227 /* MintOpcode.MINT_BRFALSE_I4_SP */))
                builder.appendU8(69 /* WasmOpcode.i32_eqz */);
            else if (opcode === 144 /* MintOpcode.MINT_BRFALSE_I8_S */) {
                builder.appendU8(80 /* WasmOpcode.i64_eqz */);
            }
            else if (opcode === 146 /* MintOpcode.MINT_BRTRUE_I8_S */) {
                // do (i64 == 0) == 0 because br_if can only branch on an i32 operand
                builder.appendU8(80 /* WasmOpcode.i64_eqz */);
                builder.appendU8(69 /* WasmOpcode.i32_eqz */);
            }
            break;
        }
        default: {
            // relop branches already had the branch condition loaded by the caller,
            //  so we don't need to load anything. After the condition was loaded, we
            //  treat it like a brtrue
            if (relopbranchTable[opcode] === undefined)
                throw new Error(`Unsupported relop branch opcode: ${getOpcodeName(opcode)}`);
            if (wrapped_c_functions.mono_jiterp_get_opcode_info(opcode, 1 /* OpcodeInfoType.Length */) !== 4)
                throw new Error(`Unsupported long branch opcode: ${getOpcodeName(opcode)}`);
            break;
        }
    }
    const destination = ip + (displacement * 2);
    if (displacement < 0) {
        if (builder.backBranchOffsets.indexOf(destination) >= 0) {
            // We found a backwards branch target we can reach via our outer trace loop, so
            //  we update eip and branch out to the top of the loop block
            if (builder.backBranchTraceLevel > 1)
                mono_log_info(`0x${ip.toString(16)} performing conditional backward branch to 0x${destination.toString(16)}`);
            builder.cfg.branch(destination, true, isSafepoint ? 3 /* CfgBranchType.SafepointConditional */ : 1 /* CfgBranchType.Conditional */);
            modifyCounter(9 /* JiterpCounter.BackBranchesEmitted */, 1);
        }
        else {
            if (destination < builder.cfg.entryIp) {
                if ((builder.backBranchTraceLevel > 1) || (builder.cfg.trace > 1))
                    mono_log_info(`0x${ip.toString(16)} ${getOpcodeName(opcode)} target 0x${destination.toString(16)} before start of trace`);
            }
            else if ((builder.backBranchTraceLevel > 0) || (builder.cfg.trace > 0))
                mono_log_info(`0x${ip.toString(16)} ${getOpcodeName(opcode)} target 0x${destination.toString(16)} not found in list ` +
                    builder.backBranchOffsets.map(bbo => "0x" + bbo.toString(16)).join(", "));
            // We didn't find a loop to branch to, so bail out
            wrapped_c_functions.mono_jiterp_boost_back_branch_target(destination);
            builder.block(64 /* WasmValtype.void */, 4 /* WasmOpcode.if_ */);
            append_bailout(builder, destination, 5 /* BailoutReason.BackwardBranch */);
            builder.endBlock();
            modifyCounter(10 /* JiterpCounter.BackBranchesNotEmitted */, 1);
        }
    }
    else {
        // Branching is enabled, so set eip and exit the current branch block
        builder.branchTargets.add(destination);
        builder.cfg.branch(destination, false, isSafepoint ? 3 /* CfgBranchType.SafepointConditional */ : 1 /* CfgBranchType.Conditional */);
    }
    return true;
}
function emit_relop_branch(builder, ip, frame, opcode) {
    const relopBranchInfo = relopbranchTable[opcode];
    if (!relopBranchInfo)
        return false;
    const relop = Array.isArray(relopBranchInfo)
        ? relopBranchInfo[0]
        : relopBranchInfo;
    const relopInfo = binopTable[relop];
    const intrinsicFpBinop = intrinsicFpBinops[relop];
    if (!relopInfo && !intrinsicFpBinop)
        return false;
    const operandLoadOp = relopInfo
        ? relopInfo[1]
        : (intrinsicFpBinop === 1 /* WasmOpcode.nop */
            ? 43 /* WasmOpcode.f64_load */
            : 42 /* WasmOpcode.f32_load */);
    append_ldloc$1(builder, getArgU16(ip, 1), operandLoadOp);
    // Promote f32 lhs to f64 if necessary
    if (!relopInfo && (intrinsicFpBinop !== 1 /* WasmOpcode.nop */))
        builder.appendU8(intrinsicFpBinop);
    // Compare with immediate
    if (Array.isArray(relopBranchInfo) && relopBranchInfo[1]) {
        // For i8 immediates we need to generate an i64.const even though
        //  the immediate is 16 bits, so we store the relevant opcode
        //  in the relop branch info table
        builder.appendU8(relopBranchInfo[1]);
        builder.appendLeb(getArgI16(ip, 2));
    }
    else
        append_ldloc$1(builder, getArgU16(ip, 2), operandLoadOp);
    // Promote f32 rhs to f64 if necessary
    if (!relopInfo && (intrinsicFpBinop != 1 /* WasmOpcode.nop */))
        builder.appendU8(intrinsicFpBinop);
    if (relopInfo) {
        builder.appendU8(relopInfo[0]);
    }
    else {
        builder.i32_const(relop);
        builder.callImport("relop_fp");
    }
    return emit_branch(builder, ip, frame, opcode);
}
function emit_math_intrinsic(builder, ip, opcode) {
    let isUnary, isF32, name;
    let wasmOp;
    const destOffset = getArgU16(ip, 1), srcOffset = getArgU16(ip, 2), rhsOffset = getArgU16(ip, 3);
    const tableEntry = mathIntrinsicTable[opcode];
    if (tableEntry) {
        isUnary = tableEntry[0];
        isF32 = tableEntry[1];
        if (typeof (tableEntry[2]) === "string")
            name = tableEntry[2];
        else
            wasmOp = tableEntry[2];
    }
    else {
        return false;
    }
    // Pre-load locals for the stloc at the end
    builder.local("pLocals");
    if (isUnary) {
        append_ldloc$1(builder, srcOffset, isF32 ? 42 /* WasmOpcode.f32_load */ : 43 /* WasmOpcode.f64_load */);
        if (wasmOp) {
            builder.appendU8(wasmOp);
        }
        else if (name) {
            builder.callImport(name);
        }
        else
            throw new Error("internal error");
        append_stloc_tail(builder, destOffset, isF32 ? 56 /* WasmOpcode.f32_store */ : 57 /* WasmOpcode.f64_store */);
        return true;
    }
    else {
        append_ldloc$1(builder, srcOffset, isF32 ? 42 /* WasmOpcode.f32_load */ : 43 /* WasmOpcode.f64_load */);
        append_ldloc$1(builder, rhsOffset, isF32 ? 42 /* WasmOpcode.f32_load */ : 43 /* WasmOpcode.f64_load */);
        if (wasmOp) {
            builder.appendU8(wasmOp);
        }
        else if (name) {
            builder.callImport(name);
        }
        else
            throw new Error("internal error");
        append_stloc_tail(builder, destOffset, isF32 ? 56 /* WasmOpcode.f32_store */ : 57 /* WasmOpcode.f64_store */);
        return true;
    }
}
function emit_indirectop(builder, ip, opcode) {
    const isLoad = (opcode >= 87 /* MintOpcode.MINT_LDIND_I1 */) &&
        (opcode <= 112 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_I8 */);
    const isAddMul = ((opcode >= 107 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_I1 */) &&
        (opcode <= 112 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_I8 */));
    const isOffset = ((opcode >= 95 /* MintOpcode.MINT_LDIND_OFFSET_I1 */) &&
        (opcode <= 106 /* MintOpcode.MINT_LDIND_OFFSET_IMM_I8 */)) ||
        ((opcode >= 120 /* MintOpcode.MINT_STIND_OFFSET_I1 */) &&
            (opcode <= 127 /* MintOpcode.MINT_STIND_OFFSET_IMM_I8 */)) || isAddMul;
    const isImm = ((opcode >= 101 /* MintOpcode.MINT_LDIND_OFFSET_IMM_I1 */) &&
        (opcode <= 106 /* MintOpcode.MINT_LDIND_OFFSET_IMM_I8 */)) ||
        ((opcode >= 124 /* MintOpcode.MINT_STIND_OFFSET_IMM_I1 */) &&
            (opcode <= 127 /* MintOpcode.MINT_STIND_OFFSET_IMM_I8 */)) || isAddMul;
    let valueVarIndex, addressVarIndex, offsetVarIndex = -1, constantOffset = 0, constantMultiplier = 1;
    if (isAddMul) {
        valueVarIndex = getArgU16(ip, 1);
        addressVarIndex = getArgU16(ip, 2);
        offsetVarIndex = getArgU16(ip, 3);
        constantOffset = getArgI16(ip, 4);
        constantMultiplier = getArgI16(ip, 5);
    }
    else if (isOffset) {
        if (isImm) {
            if (isLoad) {
                valueVarIndex = getArgU16(ip, 1);
                addressVarIndex = getArgU16(ip, 2);
                constantOffset = getArgI16(ip, 3);
            }
            else {
                valueVarIndex = getArgU16(ip, 2);
                addressVarIndex = getArgU16(ip, 1);
                constantOffset = getArgI16(ip, 3);
            }
        }
        else {
            if (isLoad) {
                valueVarIndex = getArgU16(ip, 1);
                addressVarIndex = getArgU16(ip, 2);
                offsetVarIndex = getArgU16(ip, 3);
            }
            else {
                valueVarIndex = getArgU16(ip, 3);
                addressVarIndex = getArgU16(ip, 1);
                offsetVarIndex = getArgU16(ip, 2);
            }
        }
    }
    else if (isLoad) {
        addressVarIndex = getArgU16(ip, 2);
        valueVarIndex = getArgU16(ip, 1);
    }
    else {
        addressVarIndex = getArgU16(ip, 1);
        valueVarIndex = getArgU16(ip, 2);
    }
    let getter, setter = 54 /* WasmOpcode.i32_store */;
    switch (opcode) {
        case 87 /* MintOpcode.MINT_LDIND_I1 */:
        case 95 /* MintOpcode.MINT_LDIND_OFFSET_I1 */:
        case 101 /* MintOpcode.MINT_LDIND_OFFSET_IMM_I1 */:
        case 107 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_I1 */:
            getter = 44 /* WasmOpcode.i32_load8_s */;
            break;
        case 88 /* MintOpcode.MINT_LDIND_U1 */:
        case 96 /* MintOpcode.MINT_LDIND_OFFSET_U1 */:
        case 102 /* MintOpcode.MINT_LDIND_OFFSET_IMM_U1 */:
        case 108 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_U1 */:
            getter = 45 /* WasmOpcode.i32_load8_u */;
            break;
        case 89 /* MintOpcode.MINT_LDIND_I2 */:
        case 97 /* MintOpcode.MINT_LDIND_OFFSET_I2 */:
        case 103 /* MintOpcode.MINT_LDIND_OFFSET_IMM_I2 */:
        case 109 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_I2 */:
            getter = 46 /* WasmOpcode.i32_load16_s */;
            break;
        case 90 /* MintOpcode.MINT_LDIND_U2 */:
        case 98 /* MintOpcode.MINT_LDIND_OFFSET_U2 */:
        case 104 /* MintOpcode.MINT_LDIND_OFFSET_IMM_U2 */:
        case 110 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_U2 */:
            getter = 47 /* WasmOpcode.i32_load16_u */;
            break;
        case 113 /* MintOpcode.MINT_STIND_I1 */:
        case 120 /* MintOpcode.MINT_STIND_OFFSET_I1 */:
        case 124 /* MintOpcode.MINT_STIND_OFFSET_IMM_I1 */:
            getter = 40 /* WasmOpcode.i32_load */;
            setter = 58 /* WasmOpcode.i32_store8 */;
            break;
        case 114 /* MintOpcode.MINT_STIND_I2 */:
        case 121 /* MintOpcode.MINT_STIND_OFFSET_I2 */:
        case 125 /* MintOpcode.MINT_STIND_OFFSET_IMM_I2 */:
            getter = 40 /* WasmOpcode.i32_load */;
            setter = 59 /* WasmOpcode.i32_store16 */;
            break;
        case 91 /* MintOpcode.MINT_LDIND_I4 */:
        case 99 /* MintOpcode.MINT_LDIND_OFFSET_I4 */:
        case 105 /* MintOpcode.MINT_LDIND_OFFSET_IMM_I4 */:
        case 111 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_I4 */:
        case 115 /* MintOpcode.MINT_STIND_I4 */:
        case 122 /* MintOpcode.MINT_STIND_OFFSET_I4 */:
        case 126 /* MintOpcode.MINT_STIND_OFFSET_IMM_I4 */:
        case 119 /* MintOpcode.MINT_STIND_REF */:
            getter = 40 /* WasmOpcode.i32_load */;
            break;
        case 93 /* MintOpcode.MINT_LDIND_R4 */:
        case 117 /* MintOpcode.MINT_STIND_R4 */:
            getter = 42 /* WasmOpcode.f32_load */;
            setter = 56 /* WasmOpcode.f32_store */;
            break;
        case 94 /* MintOpcode.MINT_LDIND_R8 */:
        case 118 /* MintOpcode.MINT_STIND_R8 */:
            getter = 43 /* WasmOpcode.f64_load */;
            setter = 57 /* WasmOpcode.f64_store */;
            break;
        case 92 /* MintOpcode.MINT_LDIND_I8 */:
        case 100 /* MintOpcode.MINT_LDIND_OFFSET_I8 */:
        case 106 /* MintOpcode.MINT_LDIND_OFFSET_IMM_I8 */:
        case 112 /* MintOpcode.MINT_LDIND_OFFSET_ADD_MUL_IMM_I8 */:
        case 116 /* MintOpcode.MINT_STIND_I8 */:
        case 123 /* MintOpcode.MINT_STIND_OFFSET_I8 */:
        case 127 /* MintOpcode.MINT_STIND_OFFSET_IMM_I8 */:
            getter = 41 /* WasmOpcode.i64_load */;
            setter = 55 /* WasmOpcode.i64_store */;
            break;
        default:
            return false;
    }
    // Check whether ldloc cprop is possible for the address var, if it is, skip doing the ldloc_cknull.
    // We'll also skip loading cknull_ptr later.
    const addressCprop = try_append_ldloc_cprop(builder, addressVarIndex, 40 /* WasmOpcode.i32_load */, true, true);
    if (!addressCprop)
        append_ldloc_cknull(builder, addressVarIndex, ip, false);
    if (isLoad) {
        // pre-load pLocals for the store operation
        builder.local("pLocals");
        // Load address
        if (addressCprop)
            mono_assert(try_append_ldloc_cprop(builder, addressVarIndex, 40 /* WasmOpcode.i32_load */, false, true), "Unknown jiterpreter cprop failure");
        else
            builder.local("cknull_ptr");
        // For ldind_offset we need to load an offset from another local
        //  and then add it to the null checked address
        if (isAddMul) {
            // ptr = (char*)ptr + (LOCAL_VAR (ip [3], mono_i) + (gint16)ip [4]) * (gint16)ip [5];
            append_ldloc$1(builder, offsetVarIndex, 40 /* WasmOpcode.i32_load */);
            if (constantOffset !== 0) {
                builder.i32_const(constantOffset);
                builder.appendU8(106 /* WasmOpcode.i32_add */);
                constantOffset = 0;
            }
            if (constantMultiplier !== 1) {
                builder.i32_const(constantMultiplier);
                builder.appendU8(108 /* WasmOpcode.i32_mul */);
            }
            builder.appendU8(106 /* WasmOpcode.i32_add */);
        }
        else if (isOffset && offsetVarIndex >= 0) {
            append_ldloc$1(builder, offsetVarIndex, 40 /* WasmOpcode.i32_load */);
            builder.appendU8(106 /* WasmOpcode.i32_add */);
        }
        else if (constantOffset < 0) {
            // wasm memarg offsets are unsigned, so do a signed add
            builder.i32_const(constantOffset);
            builder.appendU8(106 /* WasmOpcode.i32_add */);
            constantOffset = 0;
        }
        // Load value from loaded address
        builder.appendU8(getter);
        builder.appendMemarg(constantOffset, 0);
        append_stloc_tail(builder, valueVarIndex, setter);
    }
    else if (opcode === 119 /* MintOpcode.MINT_STIND_REF */) {
        // Load destination address
        if (addressCprop)
            mono_assert(try_append_ldloc_cprop(builder, addressVarIndex, 40 /* WasmOpcode.i32_load */, false, true), "Unknown jiterpreter cprop failure");
        else
            builder.local("cknull_ptr");
        // Load address of value so that copy_managed_pointer can grab it
        append_ldloca$1(builder, valueVarIndex, 0);
        builder.callImport("copy_ptr");
    }
    else {
        // Pre-load address for the store operation
        if (addressCprop)
            mono_assert(try_append_ldloc_cprop(builder, addressVarIndex, 40 /* WasmOpcode.i32_load */, false, true), "Unknown jiterpreter cprop failure");
        else
            builder.local("cknull_ptr");
        // For ldind_offset we need to load an offset from another local
        //  and then add it to the null checked address
        if (isOffset && offsetVarIndex >= 0) {
            append_ldloc$1(builder, offsetVarIndex, 40 /* WasmOpcode.i32_load */);
            builder.appendU8(106 /* WasmOpcode.i32_add */);
        }
        else if (constantOffset < 0) {
            // wasm memarg offsets are unsigned, so do a signed add
            builder.i32_const(constantOffset);
            builder.appendU8(106 /* WasmOpcode.i32_add */);
            constantOffset = 0;
        }
        // Load value and then write to address
        append_ldloc$1(builder, valueVarIndex, getter);
        builder.appendU8(setter);
        builder.appendMemarg(constantOffset, 0);
    }
    return true;
}
function append_getelema1(builder, ip, objectOffset, indexOffset, elementSize) {
    builder.block();
    /*
    const constantIndex = get_known_constant_value(indexOffset);
    if (typeof (constantIndex) === "number")
        console.log(`getelema1 in ${builder.functions[0].name} with constant index ${constantIndex}`);
    */
    // load index for check
    append_ldloc$1(builder, indexOffset, 40 /* WasmOpcode.i32_load */);
    // stash it since we need it twice
    builder.local("index", 34 /* WasmOpcode.tee_local */);
    let ptrLocal = "cknull_ptr";
    if (builder.options.zeroPageOptimization && isZeroPageReserved()) {
        // load array ptr and stash it
        // if the array ptr is null, the length check will fail and we will bail out
        modifyCounter(8 /* JiterpCounter.NullChecksFused */, 1);
        append_ldloc$1(builder, objectOffset, 40 /* WasmOpcode.i32_load */);
        ptrLocal = "src_ptr";
        builder.local(ptrLocal, 34 /* WasmOpcode.tee_local */);
    }
    else
        // array null check
        append_ldloc_cknull(builder, objectOffset, ip, true);
    // current stack layout is [index, ptr]
    // load array length
    builder.appendU8(40 /* WasmOpcode.i32_load */);
    builder.appendMemarg(getMemberOffset(9 /* JiterpMember.ArrayLength */), 2);
    // current stack layout is [index, length]
    // check index < array.length, unsigned. if index is negative it will be interpreted as
    //  a massive value which is naturally going to be bigger than array.length. interp.c
    //  exploits this property so we can too
    // for a null array pointer array.length will also be zero thanks to the zero page optimization
    builder.appendU8(73 /* WasmOpcode.i32_lt_u */);
    // bailout unless (index < array.length)
    builder.appendU8(13 /* WasmOpcode.br_if */);
    builder.appendULeb(0);
    append_bailout(builder, ip, 9 /* BailoutReason.ArrayLoadFailed */);
    builder.endBlock();
    // We did a null check and bounds check so we can now compute the actual address
    builder.local(ptrLocal);
    builder.i32_const(getMemberOffset(1 /* JiterpMember.ArrayData */));
    builder.appendU8(106 /* WasmOpcode.i32_add */);
    builder.local("index");
    if (elementSize != 1) {
        builder.i32_const(elementSize);
        builder.appendU8(108 /* WasmOpcode.i32_mul */);
    }
    builder.appendU8(106 /* WasmOpcode.i32_add */);
    // append_getelema1 leaves the address on the stack
}
function emit_arrayop(builder, frame, ip, opcode) {
    const isLoad = ((opcode <= 328 /* MintOpcode.MINT_LDELEMA_TC */) && (opcode >= 315 /* MintOpcode.MINT_LDELEM_I1 */)) ||
        (opcode === 341 /* MintOpcode.MINT_LDLEN */), objectOffset = getArgU16(ip, isLoad ? 2 : 1), valueOffset = getArgU16(ip, isLoad ? 1 : 3), indexOffset = getArgU16(ip, isLoad ? 3 : 2);
    let elementGetter, elementSetter = 54 /* WasmOpcode.i32_store */, elementSize;
    switch (opcode) {
        case 341 /* MintOpcode.MINT_LDLEN */: {
            builder.local("pLocals");
            // array null check
            // note: zero page optimization is not valid here since we want to throw on null
            append_ldloc_cknull(builder, objectOffset, ip, true);
            // load array length
            builder.appendU8(40 /* WasmOpcode.i32_load */);
            builder.appendMemarg(getMemberOffset(9 /* JiterpMember.ArrayLength */), 2);
            append_stloc_tail(builder, valueOffset, 54 /* WasmOpcode.i32_store */);
            return true;
        }
        case 326 /* MintOpcode.MINT_LDELEMA1 */: {
            // Pre-load destination for the element address at the end
            builder.local("pLocals");
            elementSize = getArgU16(ip, 4);
            append_getelema1(builder, ip, objectOffset, indexOffset, elementSize);
            append_stloc_tail(builder, valueOffset, 54 /* WasmOpcode.i32_store */);
            return true;
        }
        case 337 /* MintOpcode.MINT_STELEM_REF */: {
            builder.block();
            // array
            append_ldloc$1(builder, getArgU16(ip, 1), 40 /* WasmOpcode.i32_load */);
            // index
            append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
            // value
            append_ldloc$1(builder, getArgU16(ip, 3), 40 /* WasmOpcode.i32_load */);
            builder.callImport("stelemr_tc");
            builder.appendU8(13 /* WasmOpcode.br_if */);
            builder.appendULeb(0);
            append_bailout(builder, ip, 10 /* BailoutReason.ArrayStoreFailed */);
            builder.endBlock();
            return true;
        }
        case 340 /* MintOpcode.MINT_STELEM_REF_UNCHECKED */: {
            // dest
            append_getelema1(builder, ip, objectOffset, indexOffset, 4);
            // &value (src)
            append_ldloca$1(builder, valueOffset, 0);
            builder.callImport("copy_ptr");
            return true;
        }
        case 324 /* MintOpcode.MINT_LDELEM_REF */:
            elementSize = 4;
            elementGetter = 40 /* WasmOpcode.i32_load */;
            break;
        case 315 /* MintOpcode.MINT_LDELEM_I1 */:
            elementSize = 1;
            elementGetter = 44 /* WasmOpcode.i32_load8_s */;
            break;
        case 316 /* MintOpcode.MINT_LDELEM_U1 */:
            elementSize = 1;
            elementGetter = 45 /* WasmOpcode.i32_load8_u */;
            break;
        case 330 /* MintOpcode.MINT_STELEM_U1 */:
        case 329 /* MintOpcode.MINT_STELEM_I1 */:
            elementSize = 1;
            elementGetter = 40 /* WasmOpcode.i32_load */;
            elementSetter = 58 /* WasmOpcode.i32_store8 */;
            break;
        case 317 /* MintOpcode.MINT_LDELEM_I2 */:
            elementSize = 2;
            elementGetter = 46 /* WasmOpcode.i32_load16_s */;
            break;
        case 318 /* MintOpcode.MINT_LDELEM_U2 */:
            elementSize = 2;
            elementGetter = 47 /* WasmOpcode.i32_load16_u */;
            break;
        case 332 /* MintOpcode.MINT_STELEM_U2 */:
        case 331 /* MintOpcode.MINT_STELEM_I2 */:
            elementSize = 2;
            elementGetter = 40 /* WasmOpcode.i32_load */;
            elementSetter = 59 /* WasmOpcode.i32_store16 */;
            break;
        case 320 /* MintOpcode.MINT_LDELEM_U4 */:
        case 319 /* MintOpcode.MINT_LDELEM_I4 */:
        case 333 /* MintOpcode.MINT_STELEM_I4 */:
            elementSize = 4;
            elementGetter = 40 /* WasmOpcode.i32_load */;
            break;
        case 322 /* MintOpcode.MINT_LDELEM_R4 */:
        case 335 /* MintOpcode.MINT_STELEM_R4 */:
            elementSize = 4;
            elementGetter = 42 /* WasmOpcode.f32_load */;
            elementSetter = 56 /* WasmOpcode.f32_store */;
            break;
        case 321 /* MintOpcode.MINT_LDELEM_I8 */:
        case 334 /* MintOpcode.MINT_STELEM_I8 */:
            elementSize = 8;
            elementGetter = 41 /* WasmOpcode.i64_load */;
            elementSetter = 55 /* WasmOpcode.i64_store */;
            break;
        case 323 /* MintOpcode.MINT_LDELEM_R8 */:
        case 336 /* MintOpcode.MINT_STELEM_R8 */:
            elementSize = 8;
            elementGetter = 43 /* WasmOpcode.f64_load */;
            elementSetter = 57 /* WasmOpcode.f64_store */;
            break;
        case 325 /* MintOpcode.MINT_LDELEM_VT */: {
            const elementSize = getArgU16(ip, 4);
            // dest
            builder.local("pLocals");
            builder.i32_const(getArgU16(ip, 1));
            builder.appendU8(106 /* WasmOpcode.i32_add */);
            // src
            append_getelema1(builder, ip, objectOffset, indexOffset, elementSize);
            // memcpy (locals + ip [1], src_addr, size);
            append_memmove_dest_src(builder, elementSize);
            invalidate_local_range(getArgU16(ip, 1), elementSize);
            return true;
        }
        case 338 /* MintOpcode.MINT_STELEM_VT */: {
            const elementSize = getArgU16(ip, 5), klass = get_imethod_data(frame, getArgU16(ip, 4));
            // dest
            append_getelema1(builder, ip, objectOffset, indexOffset, elementSize);
            // src
            append_ldloca$1(builder, valueOffset, 0);
            builder.ptr_const(klass);
            builder.callImport("value_copy");
            return true;
        }
        case 339 /* MintOpcode.MINT_STELEM_VT_NOREF */: {
            const elementSize = getArgU16(ip, 5);
            // dest
            append_getelema1(builder, ip, objectOffset, indexOffset, elementSize);
            // src
            append_ldloca$1(builder, valueOffset, 0);
            append_memmove_dest_src(builder, elementSize);
            return true;
        }
        default:
            return false;
    }
    if (isLoad) {
        // Pre-load destination for the value at the end
        builder.local("pLocals");
        // Get address of the element, then load it
        append_getelema1(builder, ip, objectOffset, indexOffset, elementSize);
        builder.appendU8(elementGetter);
        builder.appendMemarg(0, 0);
        append_stloc_tail(builder, valueOffset, elementSetter);
    }
    else {
        // Get address of the element first as our destination
        append_getelema1(builder, ip, objectOffset, indexOffset, elementSize);
        append_ldloc$1(builder, valueOffset, elementGetter);
        builder.appendU8(elementSetter);
        builder.appendMemarg(0, 0);
    }
    return true;
}
function get_import_name(builder, typeName, functionPtr) {
    const name = `${typeName}_${functionPtr.toString(16)}`;
    if (typeof (builder.importedFunctions[name]) !== "object")
        builder.defineImportedFunction("s", name, typeName, false, functionPtr);
    return name;
}
function emit_simd(builder, ip, opcode, opname, argCount, index) {
    // First, if compiling an intrinsic attempt to emit the special vectorized implementation
    // We only do this if SIMD is enabled since we'll be using the v128 opcodes.
    if (builder.options.enableSimd && runtimeHelpers.featureWasmSimd) {
        switch (argCount) {
            case 2:
                if (emit_simd_2(builder, ip, index))
                    return true;
                break;
            case 3:
                if (emit_simd_3(builder, ip, index))
                    return true;
                break;
            case 4:
                if (emit_simd_4(builder, ip, index))
                    return true;
                break;
        }
    }
    // Fall back to a mix of non-vectorized wasm and the interpreter's implementation of the opcodes
    switch (opcode) {
        case 652 /* MintOpcode.MINT_SIMD_V128_LDC */: {
            if (builder.options.enableSimd && runtimeHelpers.featureWasmSimd) {
                builder.local("pLocals");
                const view = localHeapViewU8().slice(ip + 4, ip + 4 + sizeOfV128);
                builder.v128_const(view);
                append_simd_store(builder, ip);
                knownConstants.set(getArgU16(ip, 1), { type: "v128", value: view });
            }
            else {
                // dest
                append_ldloca$1(builder, getArgU16(ip, 1), sizeOfV128);
                // src (ip + 2)
                builder.ptr_const(ip + 4);
                append_memmove_dest_src(builder, sizeOfV128);
            }
            return true;
        }
        case 653 /* MintOpcode.MINT_SIMD_V128_I1_CREATE */:
        case 654 /* MintOpcode.MINT_SIMD_V128_I2_CREATE */:
        case 655 /* MintOpcode.MINT_SIMD_V128_I4_CREATE */:
        case 656 /* MintOpcode.MINT_SIMD_V128_I8_CREATE */: {
            // These opcodes pack a series of locals into a vector
            const elementSize = simdCreateSizes[opcode], numElements = sizeOfV128 / elementSize, destOffset = getArgU16(ip, 1), srcOffset = getArgU16(ip, 2), loadOp = simdCreateLoadOps[opcode], storeOp = simdCreateStoreOps[opcode];
            for (let i = 0; i < numElements; i++) {
                builder.local("pLocals");
                // load element from stack slot
                append_ldloc$1(builder, srcOffset + (i * sizeOfStackval), loadOp);
                // then store to destination element
                append_stloc_tail(builder, destOffset + (i * elementSize), storeOp);
            }
            return true;
        }
        case 657 /* MintOpcode.MINT_SIMD_INTRINS_P_P */: {
            simdFallbackCounters[opname] = (simdFallbackCounters[opname] || 0) + 1;
            // res
            append_ldloca$1(builder, getArgU16(ip, 1), sizeOfV128);
            // src
            append_ldloca$1(builder, getArgU16(ip, 2), 0);
            const importName = get_import_name(builder, "simd_p_p", wrapped_c_functions.mono_jiterp_get_simd_intrinsic(1, index));
            builder.callImport(importName);
            return true;
        }
        case 658 /* MintOpcode.MINT_SIMD_INTRINS_P_PP */: {
            simdFallbackCounters[opname] = (simdFallbackCounters[opname] || 0) + 1;
            // res
            append_ldloca$1(builder, getArgU16(ip, 1), sizeOfV128);
            // src
            append_ldloca$1(builder, getArgU16(ip, 2), 0);
            append_ldloca$1(builder, getArgU16(ip, 3), 0);
            const importName = get_import_name(builder, "simd_p_pp", wrapped_c_functions.mono_jiterp_get_simd_intrinsic(2, index));
            builder.callImport(importName);
            return true;
        }
        case 659 /* MintOpcode.MINT_SIMD_INTRINS_P_PPP */: {
            simdFallbackCounters[opname] = (simdFallbackCounters[opname] || 0) + 1;
            // res
            append_ldloca$1(builder, getArgU16(ip, 1), sizeOfV128);
            // src
            append_ldloca$1(builder, getArgU16(ip, 2), 0);
            append_ldloca$1(builder, getArgU16(ip, 3), 0);
            append_ldloca$1(builder, getArgU16(ip, 4), 0);
            const importName = get_import_name(builder, "simd_p_ppp", wrapped_c_functions.mono_jiterp_get_simd_intrinsic(3, index));
            builder.callImport(importName);
            return true;
        }
        default:
            mono_log_info(`jiterpreter emit_simd failed for ${opname}`);
            return false;
    }
}
function append_simd_store(builder, ip) {
    append_stloc_tail(builder, getArgU16(ip, 1), 253 /* WasmOpcode.PREFIX_simd */, 11 /* WasmSimdOpcode.v128_store */);
}
function append_simd_2_load(builder, ip, loadOp) {
    builder.local("pLocals");
    // This || is harmless since v128_load is 0
    append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, loadOp || 0 /* WasmSimdOpcode.v128_load */);
}
function append_simd_3_load(builder, ip) {
    builder.local("pLocals");
    append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
    // FIXME: Can rhs be a scalar? We handle shifts separately already
    append_ldloc$1(builder, getArgU16(ip, 3), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
}
function append_simd_4_load(builder, ip) {
    builder.local("pLocals");
    append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
    append_ldloc$1(builder, getArgU16(ip, 3), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
    append_ldloc$1(builder, getArgU16(ip, 4), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
}
function emit_simd_2(builder, ip, index) {
    const simple = wrapped_c_functions.mono_jiterp_get_simd_opcode(1, index);
    if (simple >= 0) {
        if (simdLoadTable.has(index)) {
            // Indirect load, so v1 is T** and res is Vector128*
            builder.local("pLocals");
            append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
            builder.appendSimd(simple, true);
            builder.appendMemarg(0, 0);
            append_simd_store(builder, ip);
        }
        else {
            append_simd_2_load(builder, ip);
            builder.appendSimd(simple);
            append_simd_store(builder, ip);
        }
        return true;
    }
    const bitmask = bitmaskTable[index];
    if (bitmask) {
        append_simd_2_load(builder, ip);
        builder.appendSimd(bitmask);
        append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
        return true;
    }
    switch (index) {
        case 6 /* SimdIntrinsic2.V128_I1_CREATE_SCALAR */:
        case 7 /* SimdIntrinsic2.V128_I2_CREATE_SCALAR */:
        case 8 /* SimdIntrinsic2.V128_I4_CREATE_SCALAR */:
        case 9 /* SimdIntrinsic2.V128_I8_CREATE_SCALAR */: {
            const tableEntry = createScalarTable[index];
            builder.local("pLocals");
            // Make a zero vector
            builder.v128_const(0);
            // Load the scalar value
            append_ldloc$1(builder, getArgU16(ip, 2), tableEntry[0]);
            // Replace the first lane
            builder.appendSimd(tableEntry[1]);
            builder.appendU8(0);
            // Store result
            append_stloc_tail(builder, getArgU16(ip, 1), 253 /* WasmOpcode.PREFIX_simd */, 11 /* WasmSimdOpcode.v128_store */);
            return true;
        }
        case 14 /* SimdIntrinsic2.V128_I1_CREATE */:
            append_simd_2_load(builder, ip, 7 /* WasmSimdOpcode.v128_load8_splat */);
            append_simd_store(builder, ip);
            return true;
        case 15 /* SimdIntrinsic2.V128_I2_CREATE */:
            append_simd_2_load(builder, ip, 8 /* WasmSimdOpcode.v128_load16_splat */);
            append_simd_store(builder, ip);
            return true;
        case 16 /* SimdIntrinsic2.V128_I4_CREATE */:
            append_simd_2_load(builder, ip, 9 /* WasmSimdOpcode.v128_load32_splat */);
            append_simd_store(builder, ip);
            return true;
        case 17 /* SimdIntrinsic2.V128_I8_CREATE */:
            append_simd_2_load(builder, ip, 10 /* WasmSimdOpcode.v128_load64_splat */);
            append_simd_store(builder, ip);
            return true;
        default:
            return false;
    }
}
function emit_simd_3(builder, ip, index) {
    const simple = wrapped_c_functions.mono_jiterp_get_simd_opcode(2, index);
    if (simple >= 0) {
        const isShift = simdShiftTable.has(index), extractTup = simdExtractTable[index];
        if (isShift) {
            builder.local("pLocals");
            append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            append_ldloc$1(builder, getArgU16(ip, 3), 40 /* WasmOpcode.i32_load */);
            builder.appendSimd(simple);
            append_simd_store(builder, ip);
        }
        else if (Array.isArray(extractTup)) {
            const lane = get_known_constant_value(builder, getArgU16(ip, 3)), laneCount = extractTup[0];
            if (typeof (lane) !== "number") {
                mono_log_error(`${builder.functions[0].name}: Non-constant lane index passed to ExtractScalar`);
                return false;
            }
            else if ((lane >= laneCount) || (lane < 0)) {
                mono_log_error(`${builder.functions[0].name}: ExtractScalar index ${lane} out of range (0 - ${laneCount - 1})`);
                return false;
            }
            // load vec onto stack and then emit extract + lane imm
            builder.local("pLocals");
            append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            builder.appendSimd(simple);
            builder.appendU8(lane);
            // Store using the opcode from the tuple
            append_stloc_tail(builder, getArgU16(ip, 1), extractTup[1]);
        }
        else {
            append_simd_3_load(builder, ip);
            builder.appendSimd(simple);
            append_simd_store(builder, ip);
        }
        return true;
    }
    switch (index) {
        case 191 /* SimdIntrinsic3.StoreANY */:
            // Indirect store where args are [V128**, V128*]
            append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
            append_ldloc$1(builder, getArgU16(ip, 3), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            builder.appendSimd(11 /* WasmSimdOpcode.v128_store */);
            builder.appendMemarg(0, 0);
            return true;
        case 10 /* SimdIntrinsic3.V128_BITWISE_EQUALITY */:
        case 11 /* SimdIntrinsic3.V128_BITWISE_INEQUALITY */:
            append_simd_3_load(builder, ip);
            // FIXME: i64x2_ne and i64x2_any_true?
            builder.appendSimd(214 /* WasmSimdOpcode.i64x2_eq */);
            builder.appendSimd(195 /* WasmSimdOpcode.i64x2_all_true */);
            if (index === 11 /* SimdIntrinsic3.V128_BITWISE_INEQUALITY */)
                builder.appendU8(69 /* WasmOpcode.i32_eqz */);
            append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
            return true;
        case 12 /* SimdIntrinsic3.V128_R4_FLOAT_EQUALITY */:
        case 13 /* SimdIntrinsic3.V128_R8_FLOAT_EQUALITY */: {
            /*
            Vector128<T> result = Vector128.Equals(lhs, rhs) | ~(Vector128.Equals(lhs, lhs) | Vector128.Equals(rhs, rhs));
            return result.AsInt32() == Vector128<int>.AllBitsSet;
            */
            const isR8 = index === 13 /* SimdIntrinsic3.V128_R8_FLOAT_EQUALITY */, eqOpcode = isR8 ? 71 /* WasmSimdOpcode.f64x2_eq */ : 65 /* WasmSimdOpcode.f32x4_eq */;
            builder.local("pLocals");
            append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            builder.local("math_lhs128", 34 /* WasmOpcode.tee_local */);
            append_ldloc$1(builder, getArgU16(ip, 3), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            builder.local("math_rhs128", 34 /* WasmOpcode.tee_local */);
            builder.appendSimd(eqOpcode);
            builder.local("math_lhs128");
            builder.local("math_lhs128");
            builder.appendSimd(eqOpcode);
            builder.local("math_rhs128");
            builder.local("math_rhs128");
            builder.appendSimd(eqOpcode);
            builder.appendSimd(80 /* WasmSimdOpcode.v128_or */);
            builder.appendSimd(77 /* WasmSimdOpcode.v128_not */);
            builder.appendSimd(80 /* WasmSimdOpcode.v128_or */);
            builder.appendSimd(isR8 ? 195 /* WasmSimdOpcode.i64x2_all_true */ : 163 /* WasmSimdOpcode.i32x4_all_true */);
            append_stloc_tail(builder, getArgU16(ip, 1), 54 /* WasmOpcode.i32_store */);
            return true;
        }
        case 47 /* SimdIntrinsic3.V128_I1_SHUFFLE */: {
            // Detect a constant indices vector and turn it into a const. This allows
            //  v8 to use a more optimized implementation of the swizzle opcode
            const indicesOffset = getArgU16(ip, 3), constantIndices = get_known_constant_value(builder, indicesOffset);
            // Pre-load destination ptr
            builder.local("pLocals");
            // Load vec
            append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            if (typeof (constantIndices) === "object") {
                // HACK: Use the known constant vector directly instead of loading it from memory.
                builder.appendSimd(12 /* WasmSimdOpcode.v128_const */);
                builder.appendBytes(constantIndices);
            }
            else {
                // Load the indices from memory
                append_ldloc$1(builder, indicesOffset, 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            }
            // we now have two vectors on the stack, the values and the byte indices
            builder.appendSimd(14 /* WasmSimdOpcode.i8x16_swizzle */);
            append_simd_store(builder, ip);
            return true;
        }
        case 48 /* SimdIntrinsic3.V128_I2_SHUFFLE */:
        case 49 /* SimdIntrinsic3.V128_I4_SHUFFLE */:
            // FIXME: I8
            return emit_shuffle(builder, ip, index === 48 /* SimdIntrinsic3.V128_I2_SHUFFLE */ ? 8 : 4);
        default:
            return false;
    }
    return false;
}
// implement i16 and i32 shuffles on top of wasm's only shuffle opcode by expanding the
//  element shuffle indices into byte indices
function emit_shuffle(builder, ip, elementCount) {
    const elementSize = 16 / elementCount, indicesOffset = getArgU16(ip, 3), constantIndices = get_known_constant_value(builder, indicesOffset);
    if (!((elementSize === 2) || (elementSize === 4))) mono_assert(false, "Unsupported shuffle element size"); // inlined mono_assert condition
    // Pre-load destination ptr
    builder.local("pLocals");
    // Load vec
    append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
    if (typeof (constantIndices) === "object") {
        // HACK: We have a known constant shuffle vector with char or int indices. Expand it to
        //  byte indices and then embed a new constant in the trace.
        const newShuffleVector = new Uint8Array(sizeOfV128), nativeIndices = (elementSize === 2)
            ? new Uint16Array(constantIndices.buffer, constantIndices.byteOffset, elementCount)
            : new Uint32Array(constantIndices.buffer, constantIndices.byteOffset, elementCount);
        for (let i = 0, k = 0; i < elementCount; i++, k += elementSize) {
            const elementIndex = nativeIndices[i];
            for (let j = 0; j < elementSize; j++)
                newShuffleVector[k + j] = (elementIndex * elementSize) + j;
        }
        // console.log(`shuffle w/element size ${elementSize} with constant indices ${nativeIndices} (${constantIndices}) -> byte indices ${newShuffleVector}`);
        builder.appendSimd(12 /* WasmSimdOpcode.v128_const */);
        builder.appendBytes(newShuffleVector);
    }
    else {
        // Load indices (in chars)
        append_ldloc$1(builder, indicesOffset, 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
        // There's no direct narrowing opcode for i32 -> i8, so we have to do two steps :(
        if (elementCount === 4) {
            // i32{lane0 ... lane3} -> i16{lane0 ... lane3, 0 ...}
            builder.v128_const(0);
            builder.appendSimd(134 /* WasmSimdOpcode.i16x8_narrow_i32x4_u */);
        }
        // Load a zero vector (narrow takes two vectors)
        builder.v128_const(0);
        // i16{lane0 ... lane7} -> i8{lane0 ... lane7, 0 ...}
        builder.appendSimd(102 /* WasmSimdOpcode.i8x16_narrow_i16x8_u */);
        // i8{0, 1, 2, 3 ...} -> i8{0, 0, 1, 1, 2, 2, 3, 3 ...}
        builder.appendSimd(12 /* WasmSimdOpcode.v128_const */);
        for (let i = 0; i < elementCount; i++) {
            for (let j = 0; j < elementSize; j++)
                builder.appendU8(i);
        }
        builder.appendSimd(14 /* WasmSimdOpcode.i8x16_swizzle */);
        // multiply indices by 2 or 4 to scale from elt indices to byte indices
        builder.i32_const(elementCount === 4 ? 2 : 1);
        builder.appendSimd(107 /* WasmSimdOpcode.i8x16_shl */);
        // now add an offset to the additional bytes of each lane, i.e.
        // 0 1 2 3 0 1 2 3 ...
        builder.appendSimd(12 /* WasmSimdOpcode.v128_const */);
        for (let i = 0; i < elementCount; i++) {
            for (let j = 0; j < elementSize; j++)
                builder.appendU8(j);
        }
        // we can do a bitwise or since we know we previously multiplied all the lanes by 2 or 4,
        //  so the 1 and 2 bits are already clear
        builder.appendSimd(80 /* WasmSimdOpcode.v128_or */);
    }
    // we now have two vectors on the stack, the values and the byte indices
    builder.appendSimd(14 /* WasmSimdOpcode.i8x16_swizzle */);
    append_simd_store(builder, ip);
    return true;
}
function emit_simd_4(builder, ip, index) {
    const simple = wrapped_c_functions.mono_jiterp_get_simd_opcode(3, index);
    if (simple >= 0) {
        // [lane count, value load opcode]
        const rtup = simdReplaceTable[index], stup = simdStoreTable[index];
        if (Array.isArray(rtup)) {
            const laneCount = rtup[0], lane = get_known_constant_value(builder, getArgU16(ip, 3));
            if (typeof (lane) !== "number") {
                mono_log_error(`${builder.functions[0].name}: Non-constant lane index passed to ReplaceScalar`);
                return false;
            }
            else if ((lane >= laneCount) || (lane < 0)) {
                mono_log_error(`${builder.functions[0].name}: ReplaceScalar index ${lane} out of range (0 - ${laneCount - 1})`);
                return false;
            }
            // arrange stack as [vec, value] and then write replace + lane imm
            builder.local("pLocals");
            append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            append_ldloc$1(builder, getArgU16(ip, 4), rtup[1]);
            builder.appendSimd(simple);
            builder.appendU8(lane);
            append_simd_store(builder, ip);
        }
        else if (Array.isArray(stup)) {
            // Indirect store where args are [Scalar**, V128*]
            const laneCount = stup[0], lane = get_known_constant_value(builder, getArgU16(ip, 4));
            if (typeof (lane) !== "number") {
                mono_log_error(`${builder.functions[0].name}: Non-constant lane index passed to store method`);
                return false;
            }
            else if ((lane >= laneCount) || (lane < 0)) {
                mono_log_error(`${builder.functions[0].name}: Store lane ${lane} out of range (0 - ${laneCount - 1})`);
                return false;
            }
            append_ldloc$1(builder, getArgU16(ip, 2), 40 /* WasmOpcode.i32_load */);
            append_ldloc$1(builder, getArgU16(ip, 3), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            builder.appendSimd(simple);
            builder.appendMemarg(0, 0);
            builder.appendU8(lane);
        }
        else {
            append_simd_4_load(builder, ip);
            builder.appendSimd(simple);
            append_simd_store(builder, ip);
        }
        return true;
    }
    switch (index) {
        case 0 /* SimdIntrinsic4.V128_CONDITIONAL_SELECT */:
            builder.local("pLocals");
            // Wasm spec: result = ior𝑁(iand𝑁(𝑖1, 𝑖3), iand𝑁(𝑖2, inot𝑁(𝑖3)))
            // Our opcode: *arg0 = (*arg2 & *arg1) | (*arg3 & ~*arg1)
            append_ldloc$1(builder, getArgU16(ip, 3), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            append_ldloc$1(builder, getArgU16(ip, 4), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            builder.appendSimd(82 /* WasmSimdOpcode.v128_bitselect */);
            append_simd_store(builder, ip);
            return true;
        case 7 /* SimdIntrinsic4.ShuffleD1 */: {
            const indices = get_known_constant_value(builder, getArgU16(ip, 4));
            if (typeof (indices) !== "object") {
                mono_log_error(`${builder.functions[0].name}: Non-constant indices passed to PackedSimd.Shuffle`);
                return false;
            }
            for (let i = 0; i < 32; i++) {
                const lane = indices[i];
                if ((lane < 0) || (lane > 31)) {
                    mono_log_error(`${builder.functions[0].name}: Shuffle lane index #${i} (${lane}) out of range (0 - 31)`);
                    return false;
                }
            }
            builder.local("pLocals");
            append_ldloc$1(builder, getArgU16(ip, 2), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            append_ldloc$1(builder, getArgU16(ip, 3), 253 /* WasmOpcode.PREFIX_simd */, 0 /* WasmSimdOpcode.v128_load */);
            builder.appendSimd(13 /* WasmSimdOpcode.i8x16_shuffle */);
            builder.appendBytes(indices);
            append_simd_store(builder, ip);
            return true;
        }
        default:
            return false;
    }
}
function emit_atomics(builder, ip, opcode) {
    if (opcode === 559 /* MintOpcode.MINT_MONO_MEMORY_BARRIER */) {
        if (WasmEnableThreads) {
            // Mono memory barriers use sync_synchronize which generates atomic.fence on clang,
            //  provided you pass -pthread at compile time
            builder.appendAtomic(3 /* WasmAtomicOpcode.atomic_fence */);
            // The text format and other parts of the spec say atomic.fence has no operands,
            //  but the binary encoding contains a byte specifying whether the barrier is
            //  sequentially consistent (0) or acquire-release (1)
            // Mono memory barriers are sync_synchronize which is sequentially consistent.
            builder.appendU8(0);
        }
        return true;
    }
    if (!builder.options.enableAtomics)
        return false;
    // FIXME: We could probably unify most of the xchg/cmpxchg implementation into one implementation
    const xchg = xchgTable[opcode];
    if (xchg) {
        const is64 = xchg[2] > 2;
        // TODO: Generate alignment check to produce a better runtime error when address is not aligned?
        builder.local("pLocals"); // stloc head
        append_ldloc_cknull(builder, getArgU16(ip, 2), ip, true); // address
        append_ldloc$1(builder, getArgU16(ip, 3), is64 ? 41 /* WasmOpcode.i64_load */ : 40 /* WasmOpcode.i32_load */); // replacement
        builder.appendAtomic(xchg[0], false);
        builder.appendMemarg(0, xchg[2]);
        // Fixup the result if necessary
        if (xchg[1] !== 0 /* WasmOpcode.unreachable */)
            builder.appendU8(xchg[1]);
        // store old value
        append_stloc_tail(builder, getArgU16(ip, 1), is64 ? 55 /* WasmOpcode.i64_store */ : 54 /* WasmOpcode.i32_store */);
        return true;
    }
    const cmpxchg = cmpxchgTable[opcode];
    if (cmpxchg) {
        const is64 = cmpxchg[2] > 2;
        // TODO: Generate alignment check to produce a better runtime error when address is not aligned?
        builder.local("pLocals"); // stloc head
        append_ldloc_cknull(builder, getArgU16(ip, 2), ip, true); // address
        // FIXME: Do these loads need to be sized? I think it's well-defined even if there are garbage bytes in the i32,
        //  based on language from the spec that looks like this: 'expected wrapped from i32 to i8, 8-bit compare equal'
        append_ldloc$1(builder, getArgU16(ip, 4), is64 ? 41 /* WasmOpcode.i64_load */ : 40 /* WasmOpcode.i32_load */); // expected
        append_ldloc$1(builder, getArgU16(ip, 3), is64 ? 41 /* WasmOpcode.i64_load */ : 40 /* WasmOpcode.i32_load */); // replacement
        builder.appendAtomic(cmpxchg[0], false);
        builder.appendMemarg(0, cmpxchg[2]);
        // Fixup the result if necessary
        if (cmpxchg[1] !== 0 /* WasmOpcode.unreachable */)
            builder.appendU8(cmpxchg[1]);
        // store old value
        append_stloc_tail(builder, getArgU16(ip, 1), is64 ? 55 /* WasmOpcode.i64_store */ : 54 /* WasmOpcode.i32_store */);
        return true;
    }
    return false;
}
function emit_switch(builder, ip, exitOpcodeCounter) {
    const lengthU16 = getOpcodeLengthU16(ip, 271 /* MintOpcode.MINT_SWITCH */), table = decodeSwitch(ip);
    let failed = false;
    if (table.length > builder.options.maxSwitchSize) {
        failed = true;
    }
    else {
        // Record all the switch's forward branch targets.
        // If it contains any back branches they will bailout at runtime.
        for (const target of table) {
            if (target > ip)
                builder.branchTargets.add(target);
        }
    }
    if (failed) {
        modifyCounter(14 /* JiterpCounter.SwitchTargetsFailed */, table.length);
        append_bailout(builder, ip, 27 /* BailoutReason.SwitchSize */);
        return true;
    }
    const fallthrough = ip + (lengthU16 * 2);
    builder.branchTargets.add(fallthrough);
    // Jump table needs a block so it can `br 0` for missing targets
    builder.block();
    // Load selector
    append_ldloc$1(builder, getArgU16(ip, 1), 40 /* WasmOpcode.i32_load */);
    // Dispatch
    builder.cfg.jumpTable(table, fallthrough);
    // Missing target
    builder.endBlock();
    append_exit(builder, ip, exitOpcodeCounter, 28 /* BailoutReason.SwitchTarget */);
    return true;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Controls miscellaneous diagnostic output.
const trace$2 = 0;
const 
// Dumps all compiled wrappers
dumpWrappers$1 = false;
/*
typedef struct {
    InterpMethod *rmethod;
    gpointer this_arg;
    gpointer res;
    gpointer args [16];
    gpointer *many_args;
} InterpEntryData;

typedef struct {
    InterpMethod *rmethod; // 0
    ThreadContext *context; // 4
    gpointer orig_domain; // 8
    gpointer attach_cookie; // 12
    int params_count; // 16
} JiterpEntryDataHeader;
*/
const maxInlineArgs = 16, 
// just allocate a bunch of extra space
sizeOfJiterpEntryData = 64;
const maxJitQueueLength$1 = 4, queueFlushDelayMs = 10;
let trampBuilder$1;
let trampImports;
let fnTable$1;
let jitQueueTimeout = 0;
const infoTable = {};
/*
const enum WasmReftype {
    funcref = 0x70,
    externref = 0x6F,
}
*/
function getTrampImports() {
    if (trampImports)
        return trampImports;
    trampImports = [
        importDef("interp_entry_prologue", getRawCwrap("mono_jiterp_interp_entry_prologue")),
        importDef("interp_entry", getRawCwrap("mono_jiterp_interp_entry")),
        importDef("unbox", getRawCwrap("mono_jiterp_object_unbox")),
        importDef("stackval_from_data", getRawCwrap("mono_jiterp_stackval_from_data")),
    ];
    return trampImports;
}
let TrampolineInfo$1 = class TrampolineInfo {
    constructor(imethod, method, argumentCount, pParamTypes, unbox, hasThisReference, hasReturnValue, defaultImplementation) {
        this.imethod = imethod;
        this.method = method;
        this.argumentCount = argumentCount;
        this.unbox = unbox;
        this.hasThisReference = hasThisReference;
        this.hasReturnValue = hasReturnValue;
        this.paramTypes = new Array(argumentCount);
        for (let i = 0; i < argumentCount; i++)
            this.paramTypes[i] = getU32_unaligned(pParamTypes + (i * 4));
        this.defaultImplementation = defaultImplementation;
        this.result = 0;
        this.hitCount = 0;
    }
    generateName() {
        const namePtr = wrapped_c_functions.mono_wasm_method_get_full_name(this.method);
        try {
            const name = utf8ToString(namePtr);
            this.name = name;
            let subName = name;
            if (!subName) {
                subName = `${this.imethod.toString(16)}_${this.hasThisReference ? "i" : "s"}${this.hasReturnValue ? "_r" : ""}_${this.argumentCount}`;
            }
            else {
                // truncate the real method name so that it doesn't make the module too big. this isn't a big deal for module-per-function,
                //  but since we jit in groups now we need to keep the sizes reasonable. we keep the tail end of the name
                //  since it is likely to contain the method name and/or signature instead of type and noise
                const maxLength = 24;
                if (subName.length > maxLength)
                    subName = subName.substring(subName.length - maxLength, subName.length);
                subName = `${this.imethod.toString(16)}_${subName}`;
            }
            this.traceName = subName;
        }
        finally {
            if (namePtr)
                free(namePtr);
        }
    }
    getTraceName() {
        if (!this.traceName)
            this.generateName();
        return this.traceName || "unknown";
    }
    getName() {
        if (!this.name)
            this.generateName();
        return this.name || "unknown";
    }
};
let mostRecentOptions$1 = undefined;
// If a method is freed we need to remove its info (just in case another one gets
//  allocated at that exact memory offset later) and more importantly, ensure it is
//  not waiting in the jit queue
function mono_jiterp_free_method_data_interp_entry(imethod) {
    delete infoTable[imethod];
}
// FIXME: move this counter into C and make it thread safe
function mono_interp_record_interp_entry(imethod) {
    // clear the unbox bit
    imethod = imethod & ~0x1;
    const info = infoTable[imethod];
    // This shouldn't happen but it's not worth crashing over
    if (!info)
        return;
    if (!mostRecentOptions$1)
        mostRecentOptions$1 = getOptions();
    info.hitCount++;
    if (info.hitCount === mostRecentOptions$1.interpEntryFlushThreshold)
        flush_wasm_entry_trampoline_jit_queue();
    else if (info.hitCount !== mostRecentOptions$1.interpEntryHitCount)
        return;
    const jitQueueLength = wrapped_c_functions.mono_jiterp_tlqueue_add(1 /* JitQueue.InterpEntry */, imethod);
    if (jitQueueLength >= maxJitQueueLength$1)
        flush_wasm_entry_trampoline_jit_queue();
    else
        ensure_jit_is_scheduled();
}
// returns function pointer
function mono_interp_jit_wasm_entry_trampoline(imethod, method, argumentCount, pParamTypes, unbox, hasThisReference, hasReturnValue, defaultImplementation) {
    // HACK
    if (argumentCount > maxInlineArgs)
        return 0;
    const info = new TrampolineInfo$1(imethod, method, argumentCount, pParamTypes, unbox, hasThisReference, hasReturnValue, defaultImplementation);
    if (!fnTable$1)
        fnTable$1 = getWasmFunctionTable();
    // We start by creating a function pointer for this interp_entry trampoline, but instead of
    //  compiling it right away, we make it point to the default implementation for that signature
    // This gives us time to wait before jitting it so we can jit multiple trampolines at once.
    // Some entry wrappers are also only called a few dozen times, so it's valuable to wait
    //  until a wrapper is called a lot before wasting time/memory jitting it.
    const defaultImplementationFn = fnTable$1.get(defaultImplementation);
    const tableId = (hasThisReference
        ? (hasReturnValue
            ? 29 /* JiterpreterTable.InterpEntryInstanceRet0 */
            : 20 /* JiterpreterTable.InterpEntryInstance0 */)
        : (hasReturnValue
            ? 11 /* JiterpreterTable.InterpEntryStaticRet0 */
            : 2 /* JiterpreterTable.InterpEntryStatic0 */)) + argumentCount;
    info.result = addWasmFunctionPointer(tableId, defaultImplementationFn);
    infoTable[imethod] = info;
    return info.result;
}
function ensure_jit_is_scheduled() {
    if (jitQueueTimeout > 0)
        return;
    if (typeof (globalThis.setTimeout) !== "function")
        return;
    // We only want to wait a short period of time before jitting the trampolines.
    // In practice the queue should fill up pretty fast during startup, and we just
    //  want to make sure we catch the last few stragglers with this timeout handler.
    // Note that in console JS runtimes this means we will never automatically flush
    //  the queue unless it fills up, which is unfortunate but not fixable since
    //  there is no realistic way to efficiently maintain a hit counter for these trampolines
    jitQueueTimeout = globalThis.setTimeout(() => {
        jitQueueTimeout = 0;
        flush_wasm_entry_trampoline_jit_queue();
    }, queueFlushDelayMs);
}
function flush_wasm_entry_trampoline_jit_queue() {
    const jitQueue = [];
    let methodPtr = 0;
    while ((methodPtr = wrapped_c_functions.mono_jiterp_tlqueue_next(1 /* JitQueue.InterpEntry */)) != 0) {
        const info = infoTable[methodPtr];
        if (!info) {
            mono_log_info(`Failed to find corresponding info for method ptr ${methodPtr} from jit queue!`);
            continue;
        }
        jitQueue.push(info);
    }
    if (!jitQueue.length)
        return;
    // If the function signature contains types that need stackval_from_data, that'll use
    //  some constant slots, so make some extra space
    const constantSlots = (4 * jitQueue.length) + 1;
    let builder = trampBuilder$1;
    if (!builder) {
        trampBuilder$1 = builder = new WasmBuilder(constantSlots);
        builder.defineType("unbox", {
            "pMonoObject": 127 /* WasmValtype.i32 */,
        }, 127 /* WasmValtype.i32 */, true);
        builder.defineType("interp_entry_prologue", {
            "pData": 127 /* WasmValtype.i32 */,
            "this_arg": 127 /* WasmValtype.i32 */,
        }, 127 /* WasmValtype.i32 */, true);
        builder.defineType("interp_entry", {
            "pData": 127 /* WasmValtype.i32 */,
            "res": 127 /* WasmValtype.i32 */,
        }, 64 /* WasmValtype.void */, true);
        builder.defineType("stackval_from_data", {
            "type": 127 /* WasmValtype.i32 */,
            "result": 127 /* WasmValtype.i32 */,
            "value": 127 /* WasmValtype.i32 */
        }, 64 /* WasmValtype.void */, true);
    }
    else
        builder.clear(constantSlots);
    if (builder.options.wasmBytesLimit <= getCounter(6 /* JiterpCounter.BytesGenerated */)) {
        return;
    }
    const started = _now();
    let compileStarted = 0;
    let rejected = true, threw = false;
    try {
        // Magic number and version
        builder.appendU32(0x6d736100);
        builder.appendU32(1);
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            const sig = {};
            if (info.hasThisReference)
                sig["this_arg"] = 127 /* WasmValtype.i32 */;
            if (info.hasReturnValue)
                sig["res"] = 127 /* WasmValtype.i32 */;
            for (let i = 0; i < info.argumentCount; i++)
                sig[`arg${i}`] = 127 /* WasmValtype.i32 */;
            sig["rmethod"] = 127 /* WasmValtype.i32 */;
            // Function type for compiled traces
            builder.defineType(info.getTraceName(), sig, 64 /* WasmValtype.void */, false);
        }
        builder.generateTypeSection();
        // Import section
        const trampImports = getTrampImports();
        builder.compressImportNames = true;
        // Emit function imports
        for (let i = 0; i < trampImports.length; i++) {
            if (!(trampImports[i])) mono_assert(false, `trace #${i} missing`); // inlined mono_assert condition
            builder.defineImportedFunction("i", trampImports[i][0], trampImports[i][1], true, trampImports[i][2]);
        }
        // Assign import indices so they get emitted in the import section
        for (let i = 0; i < trampImports.length; i++)
            builder.markImportAsUsed(trampImports[i][0]);
        builder._generateImportSection(false);
        // Function section
        builder.beginSection(3);
        builder.appendULeb(jitQueue.length);
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            const traceName = info.getTraceName();
            // Function type for our compiled trace
            if (!(builder.functionTypes[traceName])) mono_assert(false, "func type missing"); // inlined mono_assert condition
            builder.appendULeb(builder.functionTypes[traceName][0]);
        }
        // Export section
        builder.beginSection(7);
        builder.appendULeb(jitQueue.length);
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            const traceName = info.getTraceName();
            builder.appendName(traceName);
            builder.appendU8(0);
            // Imports get added to the function index space, so we need to add
            //  the count of imported functions to get the index of our compiled trace
            builder.appendULeb(builder.importedFunctionCount + i);
        }
        // Code section
        builder.beginSection(10);
        builder.appendULeb(jitQueue.length);
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            const traceName = info.getTraceName();
            builder.beginFunction(traceName, {
                "sp_args": 127 /* WasmValtype.i32 */,
                "need_unbox": 127 /* WasmValtype.i32 */,
                "scratchBuffer": 127 /* WasmValtype.i32 */,
            });
            const ok = generate_wasm_body$1(builder, info);
            if (!ok)
                throw new Error(`Failed to generate ${traceName}`);
            builder.appendU8(11 /* WasmOpcode.end */);
            builder.endFunction(true);
        }
        builder.endSection();
        compileStarted = _now();
        const buffer = builder.getArrayView();
        if (trace$2 > 0)
            mono_log_info(`jit queue generated ${buffer.length} byte(s) of wasm`);
        modifyCounter(6 /* JiterpCounter.BytesGenerated */, buffer.length);
        const traceModule = new WebAssembly.Module(buffer);
        const wasmImports = builder.getWasmImports();
        const traceInstance = new WebAssembly.Instance(traceModule, wasmImports);
        // Now that we've jitted the trampolines, go through and fix up the function pointers
        //  to point to the new jitted trampolines instead of the default implementations
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            const traceName = info.getTraceName();
            // Get the exported trampoline
            const fn = traceInstance.exports[traceName];
            // Patch the function pointer for this function to use the trampoline now
            fnTable$1.set(info.result, fn);
            rejected = false;
        }
        modifyCounter(2 /* JiterpCounter.EntryWrappersCompiled */, jitQueue.length);
    }
    catch (exc) {
        threw = true;
        rejected = false;
        // console.error(`${traceName} failed: ${exc} ${exc.stack}`);
        // HACK: exc.stack is enormous garbage in v8 console
        mono_log_error(`interp_entry code generation failed: ${exc}`);
        recordFailure();
    }
    finally {
        const finished = _now();
        if (compileStarted) {
            modifyCounter(11 /* JiterpCounter.ElapsedGenerationMs */, compileStarted - started);
            modifyCounter(12 /* JiterpCounter.ElapsedCompilationMs */, finished - compileStarted);
        }
        else {
            modifyCounter(11 /* JiterpCounter.ElapsedGenerationMs */, finished - started);
        }
        if (threw || (!rejected && ((trace$2 >= 2) || dumpWrappers$1))) {
            mono_log_info(`// ${jitQueue.length} trampolines generated, blob follows //`);
            let s = "", j = 0;
            try {
                if (builder.inSection)
                    builder.endSection();
            }
            catch (_a) {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;
            }
            const buf = builder.getArrayView(false, true);
            for (let i = 0; i < buf.length; i++) {
                const b = buf[i];
                if (b < 0x10)
                    s += "0";
                s += b.toString(16);
                s += " ";
                if ((s.length % 10) === 0) {
                    mono_log_info(`${j}\t${s}`);
                    s = "";
                    j = i + 1;
                }
            }
            mono_log_info(`${j}\t${s}`);
            mono_log_info("// end blob //");
        }
        else if (rejected && !threw) {
            mono_log_error("failed to generate trampoline for unknown reason");
        }
    }
}
function append_stackval_from_data(builder, imethod, type, valueName, argIndex) {
    const rawSize = wrapped_c_functions.mono_jiterp_type_get_raw_value_size(type);
    const offset = wrapped_c_functions.mono_jiterp_get_arg_offset(imethod, 0, argIndex);
    switch (rawSize) {
        case 256: {
            // Copy pointers directly
            builder.local("sp_args");
            builder.local(valueName);
            builder.appendU8(54 /* WasmOpcode.i32_store */);
            builder.appendMemarg(offset, 2);
            break;
        }
        case -1:
        case -2:
        case 1:
        case 2:
        case 4: {
            // De-reference small primitives and then store them directly
            builder.local("sp_args");
            builder.local(valueName);
            switch (rawSize) {
                case -1:
                    builder.appendU8(45 /* WasmOpcode.i32_load8_u */);
                    builder.appendMemarg(0, 0);
                    break;
                case 1:
                    builder.appendU8(44 /* WasmOpcode.i32_load8_s */);
                    builder.appendMemarg(0, 0);
                    break;
                case -2:
                    builder.appendU8(47 /* WasmOpcode.i32_load16_u */);
                    builder.appendMemarg(0, 0);
                    break;
                case 2:
                    builder.appendU8(46 /* WasmOpcode.i32_load16_s */);
                    builder.appendMemarg(0, 0);
                    break;
                case 4:
                    builder.appendU8(40 /* WasmOpcode.i32_load */);
                    builder.appendMemarg(0, 2);
                    break;
                // FIXME: 8-byte ints (unaligned)
                // FIXME: 4 and 8-byte floats (unaligned)
            }
            builder.appendU8(54 /* WasmOpcode.i32_store */);
            builder.appendMemarg(offset, 2);
            break;
        }
        default: {
            // Call stackval_from_data to copy the value
            builder.ptr_const(type);
            // result
            builder.local("sp_args");
            // apply offset
            builder.i32_const(offset);
            builder.appendU8(106 /* WasmOpcode.i32_add */);
            // value
            builder.local(valueName);
            builder.callImport("stackval_from_data");
            break;
        }
    }
}
function generate_wasm_body$1(builder, info) {
    // FIXME: This is not thread-safe, but the alternative of alloca makes the trampoline
    //  more expensive
    // The solution is likely to put the address of the scratch buffer in a global that we provide
    //  at module instantiation time, so each thread can malloc its own copy of the buffer
    //  and then pass it in when instantiating instead of compiling the constant into the module
    // FIXME: Pre-allocate these buffers and their constant slots at the start before we
    //  generate function bodies, so that even if we run out of constant slots for MonoType we
    //  will always have put the buffers in a constant slot. This will be necessary for thread safety
    const scratchBuffer = malloc(sizeOfJiterpEntryData);
    _zero_region(scratchBuffer, sizeOfJiterpEntryData);
    // Initialize the parameter count in the data blob. This is used to calculate the new value of sp
    //  before entering the interpreter
    setI32(scratchBuffer + getMemberOffset(13 /* JiterpMember.ParamsCount */), info.paramTypes.length + (info.hasThisReference ? 1 : 0));
    // the this-reference may be a boxed struct that needs to be unboxed, for example calling
    //  methods like object.ToString on structs will end up with the unbox flag set
    // instead of passing an extra 'unbox' argument to every wrapper, though, the flag is hidden
    //  inside the rmethod/imethod parameter in the lowest bit (1), so we need to check it
    if (info.hasThisReference) {
        builder.block();
        // Find the unbox-this-reference flag in rmethod
        builder.local("rmethod");
        builder.i32_const(0x1);
        builder.appendU8(113 /* WasmOpcode.i32_and */);
        // If the flag is not set (rmethod & 0x1) == 0 then skip the unbox operation
        builder.appendU8(69 /* WasmOpcode.i32_eqz */);
        builder.appendU8(13 /* WasmOpcode.br_if */);
        builder.appendULeb(0);
        // otherwise, the flag was set, so unbox the this reference and update the local
        builder.local("this_arg");
        builder.callImport("unbox");
        builder.local("this_arg", 33 /* WasmOpcode.set_local */);
        builder.endBlock();
    }
    // Populate the scratch buffer containing call data
    builder.ptr_const(scratchBuffer);
    builder.local("scratchBuffer", 34 /* WasmOpcode.tee_local */);
    builder.local("rmethod");
    // Clear the unbox-this-reference flag if present (see above) so that rmethod is a valid ptr
    builder.i32_const(~0x1);
    builder.appendU8(113 /* WasmOpcode.i32_and */);
    // Store the cleaned up rmethod value into the data.rmethod field of the scratch buffer
    builder.appendU8(54 /* WasmOpcode.i32_store */);
    builder.appendMemarg(getMemberOffset(6 /* JiterpMember.Rmethod */), 0); // data.rmethod
    // prologue takes data->rmethod and initializes data->context, then returns a value for sp_args
    // prologue also performs thread attach
    builder.local("scratchBuffer");
    // prologue takes this_arg so it can handle delegates
    if (info.hasThisReference)
        builder.local("this_arg");
    else
        builder.i32_const(0);
    builder.callImport("interp_entry_prologue");
    builder.local("sp_args", 33 /* WasmOpcode.set_local */);
    /*
    if (sig->hasthis) {
        sp_args->data.p = data->this_arg;
        sp_args++;
    }
    */
    if (info.hasThisReference) {
        // null type for raw ptr copy
        append_stackval_from_data(builder, info.imethod, 0, "this_arg", 0);
    }
    /*
    for (i = 0; i < sig->param_count; ++i) {
        if (m_type_is_byref (sig->params [i])) {
            sp_args->data.p = params [i];
            sp_args++;
        } else {
            int size = stackval_from_data (sig->params [i], sp_args, params [i], FALSE);
            sp_args = STACK_ADD_BYTES (sp_args, size);
        }
    }
    */
    for (let i = 0; i < info.paramTypes.length; i++) {
        const type = info.paramTypes[i];
        append_stackval_from_data(builder, info.imethod, type, `arg${i}`, i + (info.hasThisReference ? 1 : 0));
    }
    builder.local("scratchBuffer");
    if (info.hasReturnValue)
        builder.local("res");
    else
        builder.i32_const(0);
    builder.callImport("interp_entry");
    builder.appendU8(15 /* WasmOpcode.return_ */);
    return true;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Controls miscellaneous diagnostic output.
const trace$1 = 0;
const 
// Dumps all compiled wrappers
dumpWrappers = false, 
// Compiled wrappers will have the full name of the target method instead of the short
//  disambiguated name. This adds overhead for jit calls that never get compiled
useFullNames$1 = false;
/*
struct _JitCallInfo {
    gpointer addr; // 0
    gpointer extra_arg; // 4
    gpointer wrapper; // 8
    MonoMethodSignature *sig; // 12
    guint8 *arginfo; // 16
    gint32 res_size; // 20
    int ret_mt; // 24
    gboolean no_wrapper; // 28
#if HOST_BROWSER
    int hit_count;
    WasmJitCallThunk jiterp_thunk;
#endif
};
*/
const offsetOfAddr = 0, 
// offsetOfExtraArg = 4,
offsetOfWrapper = 8, offsetOfSig = 12, offsetOfArgInfo = 16, offsetOfRetMt = 24, offsetOfNoWrapper = 28, JIT_ARG_BYVAL = 0;
const maxJitQueueLength = 6, maxSharedQueueLength = 12;
// sizeOfStackval = 8;
let trampBuilder;
let fnTable;
let nextDisambiguateIndex = 0;
const fnCache = [];
const targetCache = {};
const infosByMethod = {};
class TrampolineInfo {
    constructor(method, rmethod, cinfo, arg_offsets, catch_exceptions) {
        this.queue = [];
        if (!(arg_offsets)) mono_assert(false, "Expected nonzero arg_offsets pointer"); // inlined mono_assert condition
        this.method = method;
        this.rmethod = rmethod;
        this.catchExceptions = catch_exceptions;
        this.cinfo = cinfo;
        this.addr = getU32_unaligned(cinfo + offsetOfAddr);
        this.wrapper = getU32_unaligned(cinfo + offsetOfWrapper);
        this.signature = getU32_unaligned(cinfo + offsetOfSig);
        this.noWrapper = getU8(cinfo + offsetOfNoWrapper) !== 0;
        this.hasReturnValue = getI32_unaligned(cinfo + offsetOfRetMt) !== -1;
        this.returnType = wrapped_c_functions.mono_jiterp_get_signature_return_type(this.signature);
        this.paramCount = wrapped_c_functions.mono_jiterp_get_signature_param_count(this.signature);
        this.hasThisReference = wrapped_c_functions.mono_jiterp_get_signature_has_this(this.signature) !== 0;
        const ptr = wrapped_c_functions.mono_jiterp_get_signature_params(this.signature);
        this.paramTypes = new Array(this.paramCount);
        for (let i = 0; i < this.paramCount; i++)
            this.paramTypes[i] = getU32_unaligned(ptr + (i * 4));
        // See initialize_arg_offsets for where this array is built
        const argOffsetCount = this.paramCount + (this.hasThisReference ? 1 : 0);
        this.argOffsets = new Array(this.paramCount);
        for (let i = 0; i < argOffsetCount; i++)
            this.argOffsets[i] = getU32_unaligned(arg_offsets + (i * 4));
        this.target = this.noWrapper ? this.addr : this.wrapper;
        this.result = 0;
        this.wasmNativeReturnType = this.returnType && this.hasReturnValue
            ? wasmTypeFromCilOpcode[wrapped_c_functions.mono_jiterp_type_to_stind(this.returnType)]
            : 64 /* WasmValtype.void */;
        this.wasmNativeSignature = this.paramTypes.map(monoType => wasmTypeFromCilOpcode[wrapped_c_functions.mono_jiterp_type_to_ldind(monoType)]);
        this.enableDirect = getOptions().directJitCalls &&
            !this.noWrapper &&
            this.wasmNativeReturnType &&
            ((this.wasmNativeSignature.length === 0) ||
                this.wasmNativeSignature.every(vt => vt));
        if (this.enableDirect)
            this.target = this.addr;
        let suffix = this.target.toString(16);
        if (useFullNames$1) {
            const pMethodName = method ? wrapped_c_functions.mono_wasm_method_get_full_name(method) : 0;
            try {
                suffix = utf8ToString(pMethodName);
            }
            finally {
                if (pMethodName)
                    free(pMethodName);
            }
        }
        // FIXME: Without doing this we occasionally get name collisions while jitting.
        const disambiguate = nextDisambiguateIndex++;
        this.name = `${this.enableDirect ? "jcp" : "jcw"}_${suffix}_${disambiguate.toString(16)}`;
    }
}
// this is cached replacements for Module.getWasmTableEntry();
// we could add <EmccExportedLibraryFunction Include="$getWasmTableEntry" /> and <EmccExportedRuntimeMethod Include="getWasmTableEntry" />
// if we need to export the original
function getWasmTableEntry(index) {
    let result = fnCache[index];
    if (!result) {
        if (index >= fnCache.length)
            fnCache.length = index + 1;
        if (!fnTable)
            fnTable = getWasmFunctionTable();
        fnCache[index] = result = fnTable.get(index);
    }
    return result;
}
function mono_interp_invoke_wasm_jit_call_trampoline(thunkIndex, ret_sp, sp, ftndesc, thrown) {
    const thunk = getWasmTableEntry(thunkIndex);
    try {
        thunk(ret_sp, sp, ftndesc, thrown);
    }
    catch (exc) {
        receiveWorkerHeapViews();
        const exceptionTag = Module["wasmExports"]["__cpp_exception"];
        const haveTag = exceptionTag instanceof WebAssembly.Tag;
        if (!haveTag || ((exc instanceof WebAssembly.Exception) &&
            exc.is(exceptionTag))) {
            setU32_unchecked(thrown, 1);
            // Call begin_catch and then end_catch to clean it up.
            if (haveTag) {
                // Wasm EH is enabled, so we know that the current exception is a C++ exception
                const ptr = exc.getArg(exceptionTag, 0);
                wrapped_c_functions.mono_jiterp_begin_catch(ptr);
                wrapped_c_functions.mono_jiterp_end_catch();
            }
            else if (typeof (exc) === "number") {
                // emscripten JS exception
                wrapped_c_functions.mono_jiterp_begin_catch(exc);
                wrapped_c_functions.mono_jiterp_end_catch();
            }
            else
                throw exc;
        }
        else {
            throw exc;
        }
    }
}
// If a method is freed we need to remove its info (just in case another one gets
//  allocated at that exact memory offset later) and more importantly, ensure it is
//  not waiting in the jit queue
function mono_jiterp_free_method_data_jit_call(method) {
    // FIXME
    const infoArray = infosByMethod[method];
    if (!infoArray)
        return;
    for (let i = 0; i < infoArray.length; i++)
        delete targetCache[infoArray[i].addr];
    delete infosByMethod[method];
}
function mono_interp_jit_wasm_jit_call_trampoline(method, rmethod, cinfo, arg_offsets, catch_exceptions) {
    // multiple cinfos can share the same target function, so for that scenario we want to
    //  use the same TrampolineInfo for all of them. if that info has already been jitted
    //  we want to immediately store its pointer into the cinfo, otherwise we add it to
    //  a queue inside the info object so that all the cinfos will get updated once a
    //  jit operation happens
    const cacheKey = getU32_unaligned(cinfo + offsetOfAddr), existing = targetCache[cacheKey];
    if (existing) {
        if (existing.result > 0)
            wrapped_c_functions.mono_jiterp_register_jit_call_thunk(cinfo, existing.result);
        else {
            existing.queue.push(cinfo);
            // the jitQueue might never fill up if we have a bunch of cinfos that share
            //  the same target function, and they might never hit the call count threshold
            //  to flush the jit queue from the C side. since entering the queue at all
            //  requires hitting a minimum hit count on the C side, flush if we have too many
            //  shared cinfos all waiting for a JIT to happen.
            if (existing.queue.length > maxSharedQueueLength)
                mono_interp_flush_jitcall_queue();
        }
        return;
    }
    const info = new TrampolineInfo(method, rmethod, cinfo, arg_offsets, catch_exceptions !== 0);
    targetCache[cacheKey] = info;
    const jitQueueLength = wrapped_c_functions.mono_jiterp_tlqueue_add(0 /* JitQueue.JitCall */, method);
    let ibm = infosByMethod[method];
    if (!ibm)
        ibm = infosByMethod[method] = [];
    ibm.push(info);
    // we don't want the queue to get too long, both because jitting too many trampolines
    //  at once can hit the 4kb limit and because it makes it more likely that we will
    //  fail to jit them early enough
    if (jitQueueLength >= maxJitQueueLength)
        mono_interp_flush_jitcall_queue();
}
function mono_interp_flush_jitcall_queue() {
    const jitQueue = [];
    let methodPtr = 0;
    while ((methodPtr = wrapped_c_functions.mono_jiterp_tlqueue_next(0 /* JitQueue.JitCall */)) != 0) {
        const infos = infosByMethod[methodPtr];
        if (!infos) {
            mono_log_info(`Failed to find corresponding info list for method ptr ${methodPtr} from jit queue!`);
            continue;
        }
        for (let i = 0; i < infos.length; i++)
            if (infos[i].result === 0)
                jitQueue.push(infos[i]);
    }
    if (!jitQueue.length)
        return;
    let builder = trampBuilder;
    if (!builder) {
        trampBuilder = builder = new WasmBuilder(0);
        // Function type for compiled trampolines
        builder.defineType("trampoline", {
            "ret_sp": 127 /* WasmValtype.i32 */,
            "sp": 127 /* WasmValtype.i32 */,
            "ftndesc": 127 /* WasmValtype.i32 */,
            "thrown": 127 /* WasmValtype.i32 */,
        }, 64 /* WasmValtype.void */, true);
        builder.defineType("begin_catch", {
            "ptr": 127 /* WasmValtype.i32 */,
        }, 64 /* WasmValtype.void */, true);
        builder.defineType("end_catch", {}, 64 /* WasmValtype.void */, true);
        builder.defineImportedFunction("i", "begin_catch", "begin_catch", true, getRawCwrap("mono_jiterp_begin_catch"));
        builder.defineImportedFunction("i", "end_catch", "end_catch", true, getRawCwrap("mono_jiterp_end_catch"));
    }
    else
        builder.clear(0);
    if (builder.options.wasmBytesLimit <= getCounter(6 /* JiterpCounter.BytesGenerated */)) {
        wrapped_c_functions.mono_jiterp_tlqueue_clear(0 /* JitQueue.JitCall */);
        return;
    }
    if (builder.options.enableWasmEh) {
        if (!runtimeHelpers.featureWasmEh) {
            // The user requested to enable wasm EH but it's not supported, so turn the option back off
            applyOptions({ enableWasmEh: false });
            builder.options.enableWasmEh = false;
        }
    }
    const started = _now();
    let compileStarted = 0;
    let rejected = true, threw = false;
    const trampImports = [];
    try {
        if (!fnTable)
            fnTable = getWasmFunctionTable();
        // Magic number and version
        builder.appendU32(0x6d736100);
        builder.appendU32(1);
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            const sig = {};
            if (info.enableDirect) {
                if (info.hasThisReference)
                    sig["this"] = 127 /* WasmValtype.i32 */;
                for (let j = 0; j < info.wasmNativeSignature.length; j++)
                    sig[`arg${j}`] = info.wasmNativeSignature[j];
                sig["rgctx"] = 127 /* WasmValtype.i32 */;
            }
            else {
                const actualParamCount = (info.hasThisReference ? 1 : 0) +
                    (info.hasReturnValue ? 1 : 0) + info.paramCount;
                for (let j = 0; j < actualParamCount; j++)
                    sig[`arg${j}`] = 127 /* WasmValtype.i32 */;
                sig["ftndesc"] = 127 /* WasmValtype.i32 */;
            }
            builder.defineType(info.name, sig, info.enableDirect ? info.wasmNativeReturnType : 64 /* WasmValtype.void */, false);
            const callTarget = getWasmTableEntry(info.target);
            if (!(typeof (callTarget) === "function")) mono_assert(false, `expected call target to be function but was ${callTarget}`); // inlined mono_assert condition
            trampImports.push([info.name, info.name, callTarget]);
        }
        builder.generateTypeSection();
        builder.compressImportNames = true;
        // Emit function imports
        for (let i = 0; i < trampImports.length; i++)
            builder.defineImportedFunction("i", trampImports[i][0], trampImports[i][1], false, trampImports[i][2]);
        // Assign import indices so they get emitted in the import section
        for (let i = 0; i < trampImports.length; i++)
            builder.markImportAsUsed(trampImports[i][0]);
        builder.markImportAsUsed("begin_catch");
        builder.markImportAsUsed("end_catch");
        builder._generateImportSection(false);
        // Function section
        builder.beginSection(3);
        builder.appendULeb(jitQueue.length);
        // Function type for our compiled trampoline
        if (!(builder.functionTypes["trampoline"])) mono_assert(false, "func type missing"); // inlined mono_assert condition
        for (let i = 0; i < jitQueue.length; i++)
            builder.appendULeb(builder.functionTypes["trampoline"][0]);
        // Export section
        builder.beginSection(7);
        builder.appendULeb(jitQueue.length);
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            builder.appendName(info.name);
            builder.appendU8(0);
            // Imports get added to the function index space, so we need to add
            //  the count of imported functions to get the index of our compiled trace
            builder.appendULeb(builder.importedFunctionCount + i);
        }
        // Code section
        builder.beginSection(10);
        builder.appendULeb(jitQueue.length);
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            builder.beginFunction("trampoline", { "old_sp": 127 /* WasmValtype.i32 */ });
            const ok = generate_wasm_body(builder, info);
            // FIXME
            if (!ok)
                throw new Error(`Failed to generate ${info.name}`);
            builder.appendU8(11 /* WasmOpcode.end */);
            builder.endFunction(true);
        }
        builder.endSection();
        compileStarted = _now();
        const buffer = builder.getArrayView();
        if (trace$1 > 0)
            mono_log_info(`do_jit_call queue flush generated ${buffer.length} byte(s) of wasm`);
        modifyCounter(6 /* JiterpCounter.BytesGenerated */, buffer.length);
        const traceModule = new WebAssembly.Module(buffer);
        const wasmImports = builder.getWasmImports();
        const traceInstance = new WebAssembly.Instance(traceModule, wasmImports);
        for (let i = 0; i < jitQueue.length; i++) {
            const info = jitQueue[i];
            // Get the exported jit call thunk
            const jitted = traceInstance.exports[info.name];
            const idx = addWasmFunctionPointer(1 /* JiterpreterTable.JitCall */, jitted);
            if (trace$1 >= 2)
                mono_log_info(`${info.name} -> fn index ${idx}`);
            info.result = idx;
            if (idx > 0) {
                // We successfully registered a function pointer for this thunk,
                //  so now register it as the thunk for each call site in the queue
                wrapped_c_functions.mono_jiterp_register_jit_call_thunk(info.cinfo, idx);
                for (let j = 0; j < info.queue.length; j++)
                    wrapped_c_functions.mono_jiterp_register_jit_call_thunk(info.queue[j], idx);
                if (info.enableDirect)
                    modifyCounter(4 /* JiterpCounter.DirectJitCallsCompiled */, 1);
                modifyCounter(3 /* JiterpCounter.JitCallsCompiled */, 1);
            }
            // If we failed to register a function pointer we just continue, since it
            //  means that the table is full
            info.queue.length = 0;
            rejected = false;
        }
    }
    catch (exc) {
        threw = true;
        rejected = false;
        // console.error(`${traceName} failed: ${exc} ${exc.stack}`);
        // HACK: exc.stack is enormous garbage in v8 console
        mono_log_error(`jit_call code generation failed: ${exc}`);
        recordFailure();
    }
    finally {
        const finished = _now();
        if (compileStarted) {
            modifyCounter(11 /* JiterpCounter.ElapsedGenerationMs */, compileStarted - started);
            modifyCounter(12 /* JiterpCounter.ElapsedCompilationMs */, finished - compileStarted);
        }
        else {
            modifyCounter(11 /* JiterpCounter.ElapsedGenerationMs */, finished - started);
        }
        if (threw || rejected) {
            for (let i = 0; i < jitQueue.length; i++) {
                const info = jitQueue[i];
                info.result = -1;
            }
        }
        // FIXME
        if (threw || (!rejected && ((trace$1 >= 2) || dumpWrappers))) {
            mono_log_info(`// ${jitQueue.length} jit call wrappers generated, blob follows //`);
            for (let i = 0; i < jitQueue.length; i++)
                mono_log_info(`// #${i} === ${jitQueue[i].name} hasThis=${jitQueue[i].hasThisReference} hasRet=${jitQueue[i].hasReturnValue} wasmArgTypes=${jitQueue[i].wasmNativeSignature}`);
            let s = "", j = 0;
            try {
                if (builder.inSection)
                    builder.endSection();
            }
            catch (_a) {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;
            }
            const buf = builder.getArrayView(false, true);
            for (let i = 0; i < buf.length; i++) {
                const b = buf[i];
                if (b < 0x10)
                    s += "0";
                s += b.toString(16);
                s += " ";
                if ((s.length % 10) === 0) {
                    mono_log_info(`${j}\t${s}`);
                    s = "";
                    j = i + 1;
                }
            }
            mono_log_info(`${j}\t${s}`);
            mono_log_info("// end blob //");
        }
        else if (rejected && !threw) {
            mono_log_error("failed to generate trampoline for unknown reason");
        }
    }
}
// Maps a CIL ld/st opcode to the wasm type that will represent it
// We intentionally leave some opcodes out in order to disable direct calls
//  for wrappers that use that opcode.
const wasmTypeFromCilOpcode = {
    [65535 /* CilOpcodes.DUMMY_BYREF */]: 127 /* WasmValtype.i32 */,
    [70 /* CilOpcodes.LDIND_I1 */]: 127 /* WasmValtype.i32 */,
    [71 /* CilOpcodes.LDIND_U1 */]: 127 /* WasmValtype.i32 */,
    [72 /* CilOpcodes.LDIND_I2 */]: 127 /* WasmValtype.i32 */,
    [73 /* CilOpcodes.LDIND_U2 */]: 127 /* WasmValtype.i32 */,
    [74 /* CilOpcodes.LDIND_I4 */]: 127 /* WasmValtype.i32 */,
    [75 /* CilOpcodes.LDIND_U4 */]: 127 /* WasmValtype.i32 */,
    [76 /* CilOpcodes.LDIND_I8 */]: 126 /* WasmValtype.i64 */,
    [77 /* CilOpcodes.LDIND_I */]: 127 /* WasmValtype.i32 */,
    [78 /* CilOpcodes.LDIND_R4 */]: 125 /* WasmValtype.f32 */,
    [79 /* CilOpcodes.LDIND_R8 */]: 124 /* WasmValtype.f64 */,
    [80 /* CilOpcodes.LDIND_REF */]: 127 /* WasmValtype.i32 */,
    [81 /* CilOpcodes.STIND_REF */]: 127 /* WasmValtype.i32 */,
    [82 /* CilOpcodes.STIND_I1 */]: 127 /* WasmValtype.i32 */,
    [83 /* CilOpcodes.STIND_I2 */]: 127 /* WasmValtype.i32 */,
    [84 /* CilOpcodes.STIND_I4 */]: 127 /* WasmValtype.i32 */,
    [85 /* CilOpcodes.STIND_I8 */]: 126 /* WasmValtype.i64 */,
    [86 /* CilOpcodes.STIND_R4 */]: 125 /* WasmValtype.f32 */,
    [87 /* CilOpcodes.STIND_R8 */]: 124 /* WasmValtype.f64 */,
    [223 /* CilOpcodes.STIND_I */]: 127 /* WasmValtype.i32 */,
};
// Maps a CIL ld/st opcode to the wasm opcode to perform it, if any
const wasmOpcodeFromCilOpcode = {
    [70 /* CilOpcodes.LDIND_I1 */]: 44 /* WasmOpcode.i32_load8_s */,
    [71 /* CilOpcodes.LDIND_U1 */]: 45 /* WasmOpcode.i32_load8_u */,
    [72 /* CilOpcodes.LDIND_I2 */]: 46 /* WasmOpcode.i32_load16_s */,
    [73 /* CilOpcodes.LDIND_U2 */]: 47 /* WasmOpcode.i32_load16_u */,
    [74 /* CilOpcodes.LDIND_I4 */]: 40 /* WasmOpcode.i32_load */,
    [75 /* CilOpcodes.LDIND_U4 */]: 40 /* WasmOpcode.i32_load */,
    [76 /* CilOpcodes.LDIND_I8 */]: 41 /* WasmOpcode.i64_load */,
    [77 /* CilOpcodes.LDIND_I */]: 40 /* WasmOpcode.i32_load */,
    [78 /* CilOpcodes.LDIND_R4 */]: 42 /* WasmOpcode.f32_load */,
    [79 /* CilOpcodes.LDIND_R8 */]: 43 /* WasmOpcode.f64_load */,
    [80 /* CilOpcodes.LDIND_REF */]: 40 /* WasmOpcode.i32_load */, // TODO: Memory barrier?
    [81 /* CilOpcodes.STIND_REF */]: 54 /* WasmOpcode.i32_store */, // Memory barrier not needed
    [82 /* CilOpcodes.STIND_I1 */]: 58 /* WasmOpcode.i32_store8 */,
    [83 /* CilOpcodes.STIND_I2 */]: 59 /* WasmOpcode.i32_store16 */,
    [84 /* CilOpcodes.STIND_I4 */]: 54 /* WasmOpcode.i32_store */,
    [85 /* CilOpcodes.STIND_I8 */]: 55 /* WasmOpcode.i64_store */,
    [86 /* CilOpcodes.STIND_R4 */]: 56 /* WasmOpcode.f32_store */,
    [87 /* CilOpcodes.STIND_R8 */]: 57 /* WasmOpcode.f64_store */,
    [223 /* CilOpcodes.STIND_I */]: 54 /* WasmOpcode.i32_store */,
};
function append_ldloc(builder, offsetBytes, opcode) {
    builder.local("sp");
    builder.appendU8(opcode);
    builder.appendMemarg(offsetBytes, 0);
}
function append_ldloca(builder, offsetBytes) {
    builder.local("sp");
    builder.i32_const(offsetBytes);
    builder.appendU8(106 /* WasmOpcode.i32_add */);
}
function generate_wasm_body(builder, info) {
    let stack_index = 0;
    // If wasm EH is enabled we will perform the call inside a catch-all block and set a flag
    //  if it throws any exception
    if (builder.options.enableWasmEh)
        builder.block(64 /* WasmValtype.void */, 6 /* WasmOpcode.try_ */);
    // Wrapper signature: [thisptr], [&retval], &arg0, ..., &funcdef
    // Desired stack layout for direct calls: [&retval], [thisptr], arg0, ..., &rgctx
    /*
        if (sig->ret->type != MONO_TYPE_VOID)
            // Load return address
            mono_mb_emit_ldarg (mb, sig->hasthis ? 1 : 0);
    */
    // The return address comes first for direct calls so we can write into it after the call
    if (info.hasReturnValue && info.enableDirect)
        builder.local("ret_sp");
    /*
        if (sig->hasthis)
            mono_mb_emit_ldarg (mb, 0);
    */
    if (info.hasThisReference) {
        // The this-reference is always the first argument
        // Note that currently info.argOffsets[0] will always be 0, but it's best to
        //  read it from the array in case this behavior changes later.
        append_ldloc(builder, info.argOffsets[0], 40 /* WasmOpcode.i32_load */);
        stack_index++;
    }
    // Indirect passes the return address as the first post-this argument
    if (info.hasReturnValue && !info.enableDirect)
        builder.local("ret_sp");
    for (let i = 0; i < info.paramCount; i++) {
        // FIXME: STACK_ADD_BYTES does alignment, but we probably don't need to?
        const svalOffset = info.argOffsets[stack_index + i];
        const argInfoOffset = getU32_unaligned(info.cinfo + offsetOfArgInfo) + i;
        const argInfo = getU8(argInfoOffset);
        if (argInfo == JIT_ARG_BYVAL) {
            // pass the first four bytes of the stackval data union,
            //  which is 'p' where pointers live
            append_ldloc(builder, svalOffset, 40 /* WasmOpcode.i32_load */);
        }
        else if (info.enableDirect) {
            // The wrapper call convention is byref for all args. Now we convert it to the native calling convention
            const loadCilOp = wrapped_c_functions.mono_jiterp_type_to_ldind(info.paramTypes[i]);
            if (!(loadCilOp)) mono_assert(false, `No load opcode for ${info.paramTypes[i]}`); // inlined mono_assert condition
            /*
                if (m_type_is_byref (sig->params [i])) {
                    mono_mb_emit_ldarg (mb, args_start + i);
                } else {
                    ldind_op = mono_type_to_ldind (sig->params [i]);
                    mono_mb_emit_ldarg (mb, args_start + i);
                    // FIXME:
                    if (ldind_op == CEE_LDOBJ)
                        mono_mb_emit_op (mb, CEE_LDOBJ, mono_class_from_mono_type_internal (sig->params [i]));
                    else
                        mono_mb_emit_byte (mb, ldind_op);
            */
            if (loadCilOp === 65535 /* CilOpcodes.DUMMY_BYREF */) {
                // pass the address of the stackval data union
                append_ldloca(builder, svalOffset);
            }
            else {
                const loadWasmOp = wasmOpcodeFromCilOpcode[loadCilOp];
                if (!loadWasmOp) {
                    mono_log_error(`No wasm load op for arg #${i} type ${info.paramTypes[i]} cil opcode ${loadCilOp}`);
                    return false;
                }
                // FIXME: LDOBJ is not implemented
                append_ldloc(builder, svalOffset, loadWasmOp);
            }
        }
        else {
            // pass the address of the stackval data union
            append_ldloca(builder, svalOffset);
        }
    }
    /*
    // Rgctx arg
    mono_mb_emit_ldarg (mb, args_start + sig->param_count);
    mono_mb_emit_icon (mb, TARGET_SIZEOF_VOID_P);
    mono_mb_emit_byte (mb, CEE_ADD);
    mono_mb_emit_byte (mb, CEE_LDIND_I);
    */
    // We have to pass the ftndesc through from do_jit_call because the target function needs
    //  a rgctx value, which is not constant for a given wrapper if the target function is shared
    //  for multiple InterpMethods. We pass ftndesc instead of rgctx so that we can pass the
    //  address to gsharedvt wrappers without having to do our own stackAlloc
    builder.local("ftndesc");
    if (info.enableDirect || info.noWrapper) {
        // Native calling convention wants an rgctx, not a ftndesc. The rgctx
        //  lives at offset 4 in the ftndesc, after the call target
        builder.appendU8(40 /* WasmOpcode.i32_load */);
        builder.appendMemarg(4, 0);
    }
    /*
    // Method to call
    mono_mb_emit_ldarg (mb, args_start + sig->param_count);
    mono_mb_emit_byte (mb, CEE_LDIND_I);
    mono_mb_emit_calli (mb, normal_sig);
    */
    builder.callImport(info.name);
    /*
    if (sig->ret->type != MONO_TYPE_VOID) {
        // Store return value
        stind_op = mono_type_to_stind (sig->ret);
        // FIXME:
        if (stind_op == CEE_STOBJ)
            mono_mb_emit_op (mb, CEE_STOBJ, mono_class_from_mono_type_internal (sig->ret));
        else if (stind_op == CEE_STIND_REF)
            // Avoid write barriers, the vret arg points to the stack
            mono_mb_emit_byte (mb, CEE_STIND_I);
        else
            mono_mb_emit_byte (mb, stind_op);
    }
    */
    // The stack should now contain [ret_sp, retval], so write retval through the return address
    if (info.hasReturnValue && info.enableDirect) {
        const storeCilOp = wrapped_c_functions.mono_jiterp_type_to_stind(info.returnType);
        const storeWasmOp = wasmOpcodeFromCilOpcode[storeCilOp];
        if (!storeWasmOp) {
            mono_log_error(`No wasm store op for return type ${info.returnType} cil opcode ${storeCilOp}`);
            return false;
        }
        // FIXME: STOBJ is not implemented
        // NOTE: We don't need a write barrier because the return address is on the interp stack
        builder.appendU8(storeWasmOp);
        builder.appendMemarg(0, 0);
    }
    // If the call threw a JS or wasm exception, set the thrown flag
    if (builder.options.enableWasmEh) {
        builder.appendU8(7 /* WasmOpcode.catch_ */);
        builder.appendULeb(builder.getTypeIndex("__cpp_exception"));
        builder.callImport("begin_catch");
        builder.callImport("end_catch");
        builder.local("thrown");
        builder.i32_const(1);
        builder.appendU8(54 /* WasmOpcode.i32_store */);
        builder.appendMemarg(0, 2);
        builder.endBlock();
    }
    builder.appendU8(15 /* WasmOpcode.return_ */);
    return true;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// Controls miscellaneous diagnostic output.
const trace = 0;
const 
// Record a trace of all managed interpreter opcodes then dump it to console
//  if an error occurs while compiling the output wasm
traceOnError = false, 
// Trace the method name, location and reason for each abort
traceAbortLocations = false, 
// Count the number of times a given method is seen as a call target, then
//  dump a list of the most common ones when dumping stats
countCallTargets = false, 
// Trace when encountering branches
traceBranchDisplacements = false, 
// Trace when we reject something for being too small
traceTooSmall = false, 
// For instrumented methods, trace their exact IP during execution
traceEip = false, 
// When eliminating a null check, replace it with a runtime 'not null' assertion
//  that will print a diagnostic message if the value is actually null or if
//  the value does not match the value on the native interpreter stack in memory
nullCheckValidation = false, 
// Cache null-checked pointers in cknull_ptr between instructions. Incredibly fragile
//  for some reason I have not been able to identify
nullCheckCaching = true, 
// Print diagnostic information to the console when performing null check optimizations
traceNullCheckOptimizations = false, 
// Print diagnostic information when generating backward branches
// 1 = failures only, 2 = full detail
defaultTraceBackBranches = 0, 
// Enable generating conditional backward branches for ENDFINALLY opcodes if we saw some CALL_HANDLER
//  opcodes previously, up to this many potential return addresses. If a trace contains more potential
//  return addresses than this we will not emit code for the ENDFINALLY opcode
maxCallHandlerReturnAddresses = 3, 
// Controls how many individual items (traces, bailouts, etc) are shown in the breakdown
//  at the end of a run when stats are enabled. The N highest ranking items will be shown.
summaryStatCount = 30, 
// Emit a wasm nop between each managed interpreter opcode
emitPadding = false, 
// Generate compressed names for imports so that modules have more space for code
compressImportNames = true, 
// Always grab method full names
useFullNames = false, 
// Use the mono_debug_count() API (set the COUNT=n env var) to limit the number of traces to compile
useDebugCount = false, 
// Subtracted from the maxModuleSize option value to make space for a typical header
moduleHeaderSizeMargin = 300;
const callTargetCounts = {};
let mostRecentTrace;
let mostRecentOptions = undefined;
let traceTableIsFull = false;
// You can disable an opcode for debugging purposes by adding it to this list,
//  instead of aborting the trace it will insert a bailout instead. This means that you will
//  have trace code generated as if the opcode were otherwise enabled
const disabledOpcodes = [];
// Detailed output and/or instrumentation will happen when a trace is jitted if the method fullname has a match
// Having any items in this list will add some overhead to the jitting of *all* traces
// These names can be substrings and instrumentation will happen if the substring is found in the full name
const instrumentedMethodNames = [];
class InstrumentedTraceState {
    constructor(name) {
        this.name = name;
        this.eip = 0;
    }
}
class TraceInfo {
    constructor(ip, index, isVerbose) {
        this.ip = ip;
        this.index = index;
        this.isVerbose = !!isVerbose;
    }
    get hitCount() {
        return wrapped_c_functions.mono_jiterp_get_trace_hit_count(this.index);
    }
}
const instrumentedTraces = {};
let nextInstrumentedTraceId = 1;
let countLimitedPrintCounter = 10;
const abortCounts = {};
const traceInfo = {};
const sizeOfDataItem = 4, sizeOfObjectHeader = 8, sizeOfV128 = 16, sizeOfStackval = 8, 
// While stats are enabled, dump concise stats every N traces so that it's clear a long-running
//  task isn't frozen if it's jitting lots of traces
autoDumpInterval = 500;
/*
struct MonoVTable {
    MonoClass  *klass; // 0
    MonoGCDescriptor gc_descr; // 4
    MonoDomain *domain; // 8
    gpointer    type; // 12
    guint8     *interface_bitmap; // 16
    guint32     max_interface_id; // 20
    guint8      rank; // 21
    guint8      initialized; // 22
    guint8      flags;
*/
/*
struct InterpFrame {
    InterpFrame    *parent; // 0
    InterpMethod   *imethod; // 4
    stackval       *retval; // 8
    stackval       *stack; // 12
    InterpFrame    *next_free; // 16
    InterpState state; // 20
};

struct InterpMethod {
       MonoMethod *method;
       InterpMethod *next_jit_code_hash;

       // Sort pointers ahead of integers to minimize padding for alignment.

       unsigned short *code;
       MonoPIFunc func;
       MonoExceptionClause *clauses; // num_clauses
       void **data_items;
*/
let traceBuilder;
let traceImports;
const mathOps1d = [
    "asin",
    "acos",
    "atan",
    "asinh",
    "acosh",
    "atanh",
    "cos",
    "sin",
    "tan",
    "cosh",
    "sinh",
    "tanh",
    "exp",
    "log",
    "log2",
    "log10",
    "cbrt",
], mathOps2d = [
    "fmod",
    "atan2",
    "pow",
], mathOps1f = [
    "asinf",
    "acosf",
    "atanf",
    "asinhf",
    "acoshf",
    "atanhf",
    "cosf",
    "sinf",
    "tanf",
    "coshf",
    "sinhf",
    "tanhf",
    "expf",
    "logf",
    "log2f",
    "log10f",
    "cbrtf",
], mathOps2f = [
    "fmodf",
    "atan2f",
    "powf",
];
function recordBailout(ip, traceIndex, reason) {
    wrapped_c_functions.mono_jiterp_trace_bailout(reason);
    // Counting these is not meaningful and messes up the end of run statistics
    if (reason === 14 /* BailoutReason.Return */)
        return ip;
    const info = traceInfo[traceIndex];
    if (!info) {
        mono_log_error(`trace info not found for ${traceIndex}`);
        return;
    }
    let table = info.bailoutCounts;
    if (!table)
        info.bailoutCounts = table = {};
    const counter = table[reason];
    if (!counter)
        table[reason] = 1;
    else
        table[reason] = counter + 1;
    if (!info.bailoutCount)
        info.bailoutCount = 1;
    else
        info.bailoutCount++;
    return ip;
}
function getTraceImports() {
    if (traceImports)
        return traceImports;
    traceImports = [
        importDef("bailout", recordBailout),
        importDef("copy_ptr", getRawCwrap("mono_wasm_copy_managed_pointer")),
        importDef("entry", getRawCwrap("mono_jiterp_increase_entry_count")),
        importDef("value_copy", getRawCwrap("mono_jiterp_value_copy")),
        importDef("gettype", getRawCwrap("mono_jiterp_gettype_ref")),
        importDef("castv2", getRawCwrap("mono_jiterp_cast_v2")),
        importDef("hasparent", getRawCwrap("mono_jiterp_has_parent_fast")),
        importDef("imp_iface", getRawCwrap("mono_jiterp_implements_interface")),
        importDef("imp_iface_s", getRawCwrap("mono_jiterp_implements_special_interface")),
        importDef("box", getRawCwrap("mono_jiterp_box_ref")),
        importDef("localloc", getRawCwrap("mono_jiterp_localloc")),
        ["ckovr_i4", "overflow_check_i4", getRawCwrap("mono_jiterp_overflow_check_i4")],
        ["ckovr_u4", "overflow_check_i4", getRawCwrap("mono_jiterp_overflow_check_u4")],
        importDef("newobj_i", getRawCwrap("mono_jiterp_try_newobj_inlined")),
        importDef("newstr", getRawCwrap("mono_jiterp_try_newstr")),
        importDef("newarr", getRawCwrap("mono_jiterp_try_newarr")),
        importDef("ld_del_ptr", getRawCwrap("mono_jiterp_ld_delegate_method_ptr")),
        importDef("ldtsflda", getRawCwrap("mono_jiterp_ldtsflda")),
        importDef("conv", getRawCwrap("mono_jiterp_conv")),
        importDef("relop_fp", getRawCwrap("mono_jiterp_relop_fp")),
        importDef("safepoint", getRawCwrap("mono_jiterp_do_safepoint")),
        importDef("hashcode", getRawCwrap("mono_jiterp_get_hashcode")),
        importDef("try_hash", getRawCwrap("mono_jiterp_try_get_hashcode")),
        importDef("hascsize", getRawCwrap("mono_jiterp_object_has_component_size")),
        importDef("hasflag", getRawCwrap("mono_jiterp_enum_hasflag")),
        importDef("array_rank", getRawCwrap("mono_jiterp_get_array_rank")),
        ["a_elesize", "array_rank", getRawCwrap("mono_jiterp_get_array_element_size")],
        importDef("stfld_o", getRawCwrap("mono_jiterp_set_object_field")),
        ["stelemr_tc", "stelemr", getRawCwrap("mono_jiterp_stelem_ref")],
        importDef("fma", getRawCwrap("fma")),
        importDef("fmaf", getRawCwrap("fmaf")),
    ];
    if (instrumentedMethodNames.length > 0) {
        traceImports.push(["trace_eip", "trace_eip", trace_current_ip]);
        traceImports.push(["trace_args", "trace_eip", trace_operands]);
    }
    if (nullCheckValidation)
        traceImports.push(importDef("notnull", assert_not_null));
    if (runtimeHelpers.emscriptenBuildOptions.enablePerfTracing || runtimeHelpers.emscriptenBuildOptions.enableBrowserProfiler) {
        traceImports.push(importDef("prof_enter", getRawCwrap("mono_jiterp_prof_enter")));
        traceImports.push(importDef("prof_samplepoint", getRawCwrap("mono_jiterp_prof_samplepoint")));
        traceImports.push(importDef("prof_leave", getRawCwrap("mono_jiterp_prof_leave")));
    }
    const pushMathOps = (list, type) => {
        for (let i = 0; i < list.length; i++) {
            const mop = list[i];
            traceImports.push([mop, type, getRawCwrap(mop)]);
        }
    };
    pushMathOps(mathOps1f, "mathop_f_f");
    pushMathOps(mathOps2f, "mathop_ff_f");
    pushMathOps(mathOps1d, "mathop_d_d");
    pushMathOps(mathOps2d, "mathop_dd_d");
    return traceImports;
}
function initialize_builder(builder) {
    // Function type for compiled traces
    builder.defineType("trace", {
        "frame": 127 /* WasmValtype.i32 */,
        "pLocals": 127 /* WasmValtype.i32 */,
        "cinfo": 127 /* WasmValtype.i32 */,
        "ip": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("bailout", {
        "retval": 127 /* WasmValtype.i32 */,
        "base": 127 /* WasmValtype.i32 */,
        "reason": 127 /* WasmValtype.i32 */
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("copy_ptr", {
        "dest": 127 /* WasmValtype.i32 */,
        "src": 127 /* WasmValtype.i32 */
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("value_copy", {
        "dest": 127 /* WasmValtype.i32 */,
        "src": 127 /* WasmValtype.i32 */,
        "klass": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("entry", {
        "imethod": 127 /* WasmValtype.i32 */
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("strlen", {
        "ppString": 127 /* WasmValtype.i32 */,
        "pResult": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("getchr", {
        "ppString": 127 /* WasmValtype.i32 */,
        "pIndex": 127 /* WasmValtype.i32 */,
        "pResult": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("getspan", {
        "destination": 127 /* WasmValtype.i32 */,
        "span": 127 /* WasmValtype.i32 */,
        "index": 127 /* WasmValtype.i32 */,
        "element_size": 127 /* WasmValtype.i32 */
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("overflow_check_i4", {
        "lhs": 127 /* WasmValtype.i32 */,
        "rhs": 127 /* WasmValtype.i32 */,
        "opcode": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("mathop_d_d", {
        "value": 124 /* WasmValtype.f64 */,
    }, 124 /* WasmValtype.f64 */, true);
    builder.defineType("mathop_dd_d", {
        "lhs": 124 /* WasmValtype.f64 */,
        "rhs": 124 /* WasmValtype.f64 */,
    }, 124 /* WasmValtype.f64 */, true);
    builder.defineType("mathop_f_f", {
        "value": 125 /* WasmValtype.f32 */,
    }, 125 /* WasmValtype.f32 */, true);
    builder.defineType("mathop_ff_f", {
        "lhs": 125 /* WasmValtype.f32 */,
        "rhs": 125 /* WasmValtype.f32 */,
    }, 125 /* WasmValtype.f32 */, true);
    builder.defineType("fmaf", {
        "x": 125 /* WasmValtype.f32 */,
        "y": 125 /* WasmValtype.f32 */,
        "z": 125 /* WasmValtype.f32 */,
    }, 125 /* WasmValtype.f32 */, true);
    builder.defineType("fma", {
        "x": 124 /* WasmValtype.f64 */,
        "y": 124 /* WasmValtype.f64 */,
        "z": 124 /* WasmValtype.f64 */,
    }, 124 /* WasmValtype.f64 */, true);
    builder.defineType("trace_eip", {
        "traceId": 127 /* WasmValtype.i32 */,
        "eip": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("newobj_i", {
        "ppDestination": 127 /* WasmValtype.i32 */,
        "vtable": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("newstr", {
        "ppDestination": 127 /* WasmValtype.i32 */,
        "length": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("newarr", {
        "ppDestination": 127 /* WasmValtype.i32 */,
        "vtable": 127 /* WasmValtype.i32 */,
        "length": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("localloc", {
        "destination": 127 /* WasmValtype.i32 */,
        "len": 127 /* WasmValtype.i32 */,
        "frame": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("ld_del_ptr", {
        "ppDestination": 127 /* WasmValtype.i32 */,
        "ppSource": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("ldtsflda", {
        "ppDestination": 127 /* WasmValtype.i32 */,
        "offset": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("gettype", {
        "destination": 127 /* WasmValtype.i32 */,
        "source": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("castv2", {
        "destination": 127 /* WasmValtype.i32 */,
        "source": 127 /* WasmValtype.i32 */,
        "klass": 127 /* WasmValtype.i32 */,
        "opcode": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("hasparent", {
        "klass": 127 /* WasmValtype.i32 */,
        "parent": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("imp_iface", {
        "vtable": 127 /* WasmValtype.i32 */,
        "klass": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("imp_iface_s", {
        "obj": 127 /* WasmValtype.i32 */,
        "vtable": 127 /* WasmValtype.i32 */,
        "klass": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("box", {
        "vtable": 127 /* WasmValtype.i32 */,
        "destination": 127 /* WasmValtype.i32 */,
        "source": 127 /* WasmValtype.i32 */,
        "vt": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("conv", {
        "destination": 127 /* WasmValtype.i32 */,
        "source": 127 /* WasmValtype.i32 */,
        "opcode": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("relop_fp", {
        "lhs": 124 /* WasmValtype.f64 */,
        "rhs": 124 /* WasmValtype.f64 */,
        "opcode": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("safepoint", {
        "frame": 127 /* WasmValtype.i32 */,
        "ip": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("prof_enter", {
        "frame": 127 /* WasmValtype.i32 */,
        "ip": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("prof_samplepoint", {
        "frame": 127 /* WasmValtype.i32 */,
        "ip": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("prof_leave", {
        "frame": 127 /* WasmValtype.i32 */,
        "ip": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("hashcode", {
        "ppObj": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("try_hash", {
        "ppObj": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("hascsize", {
        "ppObj": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("hasflag", {
        "klass": 127 /* WasmValtype.i32 */,
        "dest": 127 /* WasmValtype.i32 */,
        "sp1": 127 /* WasmValtype.i32 */,
        "sp2": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("array_rank", {
        "destination": 127 /* WasmValtype.i32 */,
        "source": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("stfld_o", {
        "locals": 127 /* WasmValtype.i32 */,
        "fieldOffsetBytes": 127 /* WasmValtype.i32 */,
        "targetLocalOffsetBytes": 127 /* WasmValtype.i32 */,
        "sourceLocalOffsetBytes": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("notnull", {
        "ptr": 127 /* WasmValtype.i32 */,
        "expected": 127 /* WasmValtype.i32 */,
        "traceIp": 127 /* WasmValtype.i32 */,
        "ip": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("stelemr", {
        "o": 127 /* WasmValtype.i32 */,
        "aindex": 127 /* WasmValtype.i32 */,
        "ref": 127 /* WasmValtype.i32 */,
    }, 127 /* WasmValtype.i32 */, true);
    builder.defineType("simd_p_p", {
        "arg0": 127 /* WasmValtype.i32 */,
        "arg1": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("simd_p_pp", {
        "arg0": 127 /* WasmValtype.i32 */,
        "arg1": 127 /* WasmValtype.i32 */,
        "arg2": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    builder.defineType("simd_p_ppp", {
        "arg0": 127 /* WasmValtype.i32 */,
        "arg1": 127 /* WasmValtype.i32 */,
        "arg2": 127 /* WasmValtype.i32 */,
        "arg3": 127 /* WasmValtype.i32 */,
    }, 64 /* WasmValtype.void */, true);
    const traceImports = getTraceImports();
    // Pre-define function imports as persistent
    for (let i = 0; i < traceImports.length; i++) {
        if (!(traceImports[i])) mono_assert(false, `trace #${i} missing`); // inlined mono_assert condition
        builder.defineImportedFunction("i", traceImports[i][0], traceImports[i][1], true, traceImports[i][2]);
    }
}
function assert_not_null(value, expectedValue, traceIndex, ip) {
    if (value && (value === expectedValue))
        return;
    const info = traceInfo[traceIndex];
    throw new Error(`expected non-null value ${expectedValue} but found ${value} in trace ${info.name} @ 0x${ip.toString(16)}`);
}
// returns function id
function generate_wasm(frame, methodName, ip, startOfBody, sizeOfBody, traceIndex, methodFullName, backwardBranchTable, presetFunctionPointer) {
    // Pre-allocate a decent number of constant slots - this adds fixed size bloat
    //  to the trace but will make the actual pointer constants in the trace smaller
    // If we run out of constant slots it will transparently fall back to i32_const
    // For System.Runtime.Tests we only run out of slots ~50 times in 9100 test cases
    const constantSlotCount = 8;
    let builder = traceBuilder;
    if (!builder) {
        traceBuilder = builder = new WasmBuilder(constantSlotCount);
        initialize_builder(builder);
    }
    else
        builder.clear(constantSlotCount);
    mostRecentOptions = builder.options;
    // skip jiterpreter_enter
    // const _ip = ip;
    const traceOffset = ip - startOfBody;
    const endOfBody = startOfBody + sizeOfBody;
    const traceName = `${methodName}:${(traceOffset).toString(16)}`;
    if (useDebugCount) {
        if (wrapped_c_functions.mono_jiterp_debug_count() === 0) {
            if (countLimitedPrintCounter-- >= 0)
                mono_log_info(`COUNT limited: ${methodFullName || methodName} @${(traceOffset).toString(16)}`);
            return 0;
        }
    }
    const started = _now();
    let compileStarted = 0;
    let rejected = true, threw = false;
    const ti = traceInfo[traceIndex];
    const instrument = ti.isVerbose || (methodFullName && (instrumentedMethodNames.findIndex((filter) => methodFullName.indexOf(filter) >= 0) >= 0));
    if (!(!instrument || methodFullName)) mono_assert(false, "Expected methodFullName if trace is instrumented"); // inlined mono_assert condition
    const instrumentedTraceId = instrument ? nextInstrumentedTraceId++ : 0;
    if (instrument) {
        mono_log_info(`instrumenting: ${methodFullName}`);
        instrumentedTraces[instrumentedTraceId] = new InstrumentedTraceState(methodFullName);
    }
    builder.compressImportNames = compressImportNames && !instrument;
    try {
        // Magic number and version
        builder.appendU32(0x6d736100);
        builder.appendU32(1);
        builder.generateTypeSection();
        const traceLocals = {
            "disp": 127 /* WasmValtype.i32 */,
            "cknull_ptr": 127 /* WasmValtype.i32 */,
            "dest_ptr": 127 /* WasmValtype.i32 */,
            "src_ptr": 127 /* WasmValtype.i32 */,
            "memop_dest": 127 /* WasmValtype.i32 */,
            "memop_src": 127 /* WasmValtype.i32 */,
            "index": 127 /* WasmValtype.i32 */,
            "count": 127 /* WasmValtype.i32 */,
            "math_lhs32": 127 /* WasmValtype.i32 */,
            "math_rhs32": 127 /* WasmValtype.i32 */,
            "math_lhs64": 126 /* WasmValtype.i64 */,
            "math_rhs64": 126 /* WasmValtype.i64 */,
            "temp_f32": 125 /* WasmValtype.f32 */,
            "temp_f64": 124 /* WasmValtype.f64 */,
        };
        if (builder.options.enableSimd) {
            traceLocals["v128_zero"] = 123 /* WasmValtype.v128 */;
            traceLocals["math_lhs128"] = 123 /* WasmValtype.v128 */;
            traceLocals["math_rhs128"] = 123 /* WasmValtype.v128 */;
        }
        let keep = true, traceValue = 0;
        builder.defineFunction({
            type: "trace",
            name: traceName,
            export: true,
            locals: traceLocals
        }, () => {
            if (emitPadding) {
                builder.appendU8(1 /* WasmOpcode.nop */);
                builder.appendU8(1 /* WasmOpcode.nop */);
            }
            builder.base = ip;
            builder.traceIndex = traceIndex;
            builder.frame = frame;
            switch (getU16(ip)) {
                case 674 /* MintOpcode.MINT_TIER_PREPARE_JITERPRETER */:
                case 675 /* MintOpcode.MINT_TIER_NOP_JITERPRETER */:
                case 677 /* MintOpcode.MINT_TIER_MONITOR_JITERPRETER */:
                case 676 /* MintOpcode.MINT_TIER_ENTER_JITERPRETER */:
                    break;
                default:
                    throw new Error(`Expected *ip to be a jiterpreter opcode but it was ${getU16(ip)}`);
            }
            builder.cfg.initialize(startOfBody, backwardBranchTable, instrument ? 1 : 0);
            // TODO: Call generateWasmBody before generating any of the sections and headers.
            // This will allow us to do things like dynamically vary the number of locals, in addition
            //  to using global constants and figuring out how many constant slots we need in advance
            //  since a long trace might need many slots and that bloats the header.
            traceValue = generateWasmBody(frame, traceName, ip, startOfBody, endOfBody, builder, instrumentedTraceId, backwardBranchTable);
            keep = (traceValue >= mostRecentOptions.minimumTraceValue);
            return builder.cfg.generate();
        });
        builder.emitImportsAndFunctions(false);
        if (!keep) {
            if (ti && (ti.abortReason === "end-of-body"))
                ti.abortReason = "trace-too-small";
            if (traceTooSmall && (traceValue > 1))
                mono_log_info(`${traceName} too small: value=${traceValue}, ${builder.current.size} wasm bytes`);
            return 0;
        }
        compileStarted = _now();
        const buffer = builder.getArrayView();
        // mono_log_info(`bytes generated: ${buffer.length}`);
        if (trace > 0)
            mono_log_info(`${(builder.base).toString(16)} ${methodFullName || traceName} generated ${buffer.length} byte(s) of wasm`);
        modifyCounter(6 /* JiterpCounter.BytesGenerated */, buffer.length);
        if (buffer.length >= builder.options.maxModuleSize) {
            mono_log_warn(`Jiterpreter generated too much code (${buffer.length} bytes) for trace ${traceName}. Please report this issue.`);
            return 0;
        }
        const traceModule = new WebAssembly.Module(buffer);
        const wasmImports = builder.getWasmImports();
        const traceInstance = new WebAssembly.Instance(traceModule, wasmImports);
        // Get the exported trace function
        const fn = traceInstance.exports[traceName];
        rejected = false;
        let idx;
        if (presetFunctionPointer) {
            const fnTable = getWasmFunctionTable();
            fnTable.set(presetFunctionPointer, fn);
            idx = presetFunctionPointer;
        }
        else {
            idx = addWasmFunctionPointer(0 /* JiterpreterTable.Trace */, fn);
            if (idx === 0) {
                // Failed to add function pointer because trace table is full. Disable future
                //  trace generation to reduce CPU usage.
                traceTableIsFull = true;
            }
        }
        if (trace >= 2)
            mono_log_info(`${traceName} -> fn index ${idx}`);
        // Ensure that a bit of ongoing diagnostic output is printed for very long-running test
        //  suites or benchmarks if you've enabled stats
        const tracesCompiled = getCounter(1 /* JiterpCounter.TracesCompiled */);
        if (builder.options.enableStats && tracesCompiled && (tracesCompiled % autoDumpInterval) === 0)
            jiterpreter_dump_stats(true);
        return idx;
    }
    catch (exc) {
        threw = true;
        rejected = false;
        let desc = builder.containsSimd
            ? " (simd)"
            : "";
        if (builder.containsAtomics)
            desc += " (atomics)";
        mono_log_error(`${methodFullName || traceName}${desc} code generation failed: ${exc} ${exc.stack}`);
        recordFailure();
        return 0;
    }
    finally {
        const finished = _now();
        if (compileStarted) {
            modifyCounter(11 /* JiterpCounter.ElapsedGenerationMs */, compileStarted - started);
            modifyCounter(12 /* JiterpCounter.ElapsedCompilationMs */, finished - compileStarted);
        }
        else {
            modifyCounter(11 /* JiterpCounter.ElapsedGenerationMs */, finished - started);
        }
        if (threw || (!rejected && ((trace >= 2) || mostRecentOptions.dumpTraces)) || instrument) {
            if (threw || (trace >= 3) || mostRecentOptions.dumpTraces || instrument) {
                for (let i = 0; i < builder.traceBuf.length; i++)
                    mono_log_info(builder.traceBuf[i]);
            }
            mono_log_info(`// ${methodFullName || traceName} generated, blob follows //`);
            let s = "", j = 0;
            try {
                // We may have thrown an uncaught exception while inside a block,
                //  so we need to pop it for getArrayView to work.
                while (builder.activeBlocks > 0)
                    builder.endBlock();
                if (builder.inSection)
                    builder.endSection();
            }
            catch (_a) {
                // eslint-disable-next-line @typescript-eslint/no-extra-semi
                ;
            }
            const buf = builder.getArrayView(false, true);
            for (let i = 0; i < buf.length; i++) {
                const b = buf[i];
                if (b < 0x10)
                    s += "0";
                s += b.toString(16);
                s += " ";
                if ((s.length % 10) === 0) {
                    mono_log_info(`${j}\t${s}`);
                    s = "";
                    j = i + 1;
                }
            }
            mono_log_info(`${j}\t${s}`);
            mono_log_info("// end blob //");
        }
    }
}
function trace_current_ip(traceId, eip) {
    const tup = instrumentedTraces[traceId];
    if (!tup)
        throw new Error(`Unrecognized instrumented trace id ${traceId}`);
    tup.eip = eip;
    mostRecentTrace = tup;
}
function trace_operands(a, b) {
    if (!mostRecentTrace)
        throw new Error("No trace active");
    mostRecentTrace.operand1 = a >>> 0;
    mostRecentTrace.operand2 = b >>> 0;
}
function record_abort(traceIndex, ip, traceName, reason) {
    if (typeof (reason) === "number") {
        wrapped_c_functions.mono_jiterp_adjust_abort_count(reason, 1);
        reason = getOpcodeName(reason);
    }
    else {
        let abortCount = abortCounts[reason];
        if (typeof (abortCount) !== "number")
            abortCount = 1;
        else
            abortCount++;
        abortCounts[reason] = abortCount;
    }
    if ((traceAbortLocations && (reason !== "end-of-body")) || (trace >= 2))
        mono_log_info(`abort #${traceIndex} ${traceName}@${ip} ${reason}`);
    traceInfo[traceIndex].abortReason = reason;
}
const JITERPRETER_TRAINING = 0;
const JITERPRETER_NOT_JITTED = 1;
function mono_interp_tier_prepare_jiterpreter(frame, method, ip, index, startOfBody, sizeOfBody, isVerbose, presetFunctionPointer) {
    if (!(ip)) mono_assert(false, "expected instruction pointer"); // inlined mono_assert condition
    if (!mostRecentOptions)
        mostRecentOptions = getOptions();
    if (!mostRecentOptions.enableTraces)
        return JITERPRETER_NOT_JITTED;
    else if (mostRecentOptions.wasmBytesLimit <= getCounter(6 /* JiterpCounter.BytesGenerated */))
        return JITERPRETER_NOT_JITTED;
    else if (traceTableIsFull)
        return JITERPRETER_NOT_JITTED;
    let info = traceInfo[index];
    if (!info)
        traceInfo[index] = info = new TraceInfo(ip, index, isVerbose);
    modifyCounter(0 /* JiterpCounter.TraceCandidates */, 1);
    let methodFullName;
    if (mostRecentOptions.estimateHeat ||
        (instrumentedMethodNames.length > 0) || useFullNames ||
        info.isVerbose) {
        const pMethodName = wrapped_c_functions.mono_wasm_method_get_full_name(method);
        methodFullName = utf8ToString(pMethodName);
        free(pMethodName);
    }
    const methodName = utf8ToString(wrapped_c_functions.mono_wasm_method_get_name(method));
    info.name = methodFullName || methodName;
    let backwardBranchTable = mostRecentOptions.noExitBackwardBranches
        ? generateBackwardBranchTable(ip, startOfBody, sizeOfBody)
        : null;
    // If we're compiling a trace that doesn't start at the beginning of a method,
    //  it's possible all the backward branch targets precede it, so we won't want to
    //  actually wrap it in a loop and have the eip check at the beginning.
    if (backwardBranchTable && (ip !== startOfBody)) {
        const threshold = (ip - startOfBody) / 2;
        let foundReachableBranchTarget = false;
        for (let i = 0; i < backwardBranchTable.length; i++) {
            if (backwardBranchTable[i] >= threshold) {
                foundReachableBranchTarget = true;
                break;
            }
        }
        // We didn't find any backward branch targets we can reach from inside this trace,
        //  so null out the table.
        if (!foundReachableBranchTarget)
            backwardBranchTable = null;
    }
    const fnPtr = generate_wasm(frame, methodName, ip, startOfBody, sizeOfBody, index, methodFullName, backwardBranchTable, presetFunctionPointer);
    if (fnPtr) {
        modifyCounter(1 /* JiterpCounter.TracesCompiled */, 1);
        // FIXME: These could theoretically be 0 or 1, in which case the trace
        //  will never get invoked. Oh well
        info.fnPtr = fnPtr;
        return fnPtr;
    }
    else {
        return mostRecentOptions.estimateHeat ? JITERPRETER_TRAINING : JITERPRETER_NOT_JITTED;
    }
}
// NOTE: This will potentially be called once for every trace entry point
//  in a given method, not just once per method
function mono_wasm_free_method_data(method, imethod, traceIndex) {
    if (runtimeHelpers.emscriptenBuildOptions.enableBrowserProfiler) {
        mono_wasm_profiler_free_method(method);
    }
    // TODO: Uninstall the trace function pointer from the function pointer table,
    //  so that the compiled trace module can be freed by the browser eventually
    // Release the trace info object, if present
    delete traceInfo[traceIndex];
    // Remove any AOT data and queue entries associated with the method
    mono_jiterp_free_method_data_interp_entry(imethod);
    mono_jiterp_free_method_data_jit_call(method);
}
function jiterpreter_dump_stats(concise) {
    if (!runtimeHelpers.runtimeReady) {
        return;
    }
    if (!mostRecentOptions)
        mostRecentOptions = getOptions();
    if (!mostRecentOptions.enableStats)
        return;
    const backBranchesEmitted = getCounter(9 /* JiterpCounter.BackBranchesEmitted */), backBranchesNotEmitted = getCounter(10 /* JiterpCounter.BackBranchesNotEmitted */), nullChecksEliminated = getCounter(7 /* JiterpCounter.NullChecksEliminated */), nullChecksFused = getCounter(8 /* JiterpCounter.NullChecksFused */), jitCallsCompiled = getCounter(3 /* JiterpCounter.JitCallsCompiled */), directJitCallsCompiled = getCounter(4 /* JiterpCounter.DirectJitCallsCompiled */), entryWrappersCompiled = getCounter(2 /* JiterpCounter.EntryWrappersCompiled */), tracesCompiled = getCounter(1 /* JiterpCounter.TracesCompiled */), traceCandidates = getCounter(0 /* JiterpCounter.TraceCandidates */), bytesGenerated = getCounter(6 /* JiterpCounter.BytesGenerated */), elapsedGenerationMs = getCounter(11 /* JiterpCounter.ElapsedGenerationMs */), elapsedCompilationMs = getCounter(12 /* JiterpCounter.ElapsedCompilationMs */), switchTargetsOk = getCounter(13 /* JiterpCounter.SwitchTargetsOk */), switchTargetsFailed = getCounter(14 /* JiterpCounter.SwitchTargetsFailed */);
    const backBranchHitRate = (backBranchesEmitted / (backBranchesEmitted + backBranchesNotEmitted)) * 100, tracesRejected = wrapped_c_functions.mono_jiterp_get_rejected_trace_count(), nullChecksEliminatedText = mostRecentOptions.eliminateNullChecks ? nullChecksEliminated.toString() : "off", nullChecksFusedText = (mostRecentOptions.zeroPageOptimization ? nullChecksFused.toString() + (isZeroPageReserved() ? "" : " (disabled)") : "off"), backBranchesEmittedText = mostRecentOptions.enableBackwardBranches ? `emitted: ${backBranchesEmitted}, failed: ${backBranchesNotEmitted} (${backBranchHitRate.toFixed(1)}%)` : ": off", directJitCallsText = jitCallsCompiled ? (mostRecentOptions.directJitCalls ? `direct jit calls: ${directJitCallsCompiled} (${(directJitCallsCompiled / jitCallsCompiled * 100).toFixed(1)}%)` : "direct jit calls: off") : "";
    mono_log_info(`// jitted ${bytesGenerated}b; ${tracesCompiled} traces (${(tracesCompiled / traceCandidates * 100).toFixed(1)}%) (${tracesRejected} rejected); ${jitCallsCompiled} jit_calls; ${entryWrappersCompiled} interp_entries`);
    mono_log_info(`// cknulls pruned: ${nullChecksEliminatedText}, fused: ${nullChecksFusedText}; back-brs ${backBranchesEmittedText}; switch tgts ${switchTargetsOk}/${switchTargetsFailed + switchTargetsOk}; ${directJitCallsText}`);
    mono_log_info(`// time: ${elapsedGenerationMs | 0}ms generating, ${elapsedCompilationMs | 0}ms compiling wasm.`);
    if (concise)
        return;
    if (mostRecentOptions.countBailouts) {
        const traces = Object.values(traceInfo);
        traces.sort((lhs, rhs) => (rhs.bailoutCount || 0) - (lhs.bailoutCount || 0));
        for (let i = 0; i < BailoutReasonNames.length; i++) {
            const bailoutCount = wrapped_c_functions.mono_jiterp_get_trace_bailout_count(i);
            if (bailoutCount)
                mono_log_info(`// traces bailed out ${bailoutCount} time(s) due to ${BailoutReasonNames[i]}`);
        }
        for (let i = 0, c = 0; i < traces.length && c < summaryStatCount; i++) {
            const trace = traces[i];
            if (!trace.bailoutCount)
                continue;
            c++;
            mono_log_info(`${trace.name}: ${trace.bailoutCount} bailout(s)`);
            for (const k in trace.bailoutCounts)
                mono_log_info(`  ${BailoutReasonNames[k]} x${trace.bailoutCounts[k]}`);
        }
    }
    if (mostRecentOptions.estimateHeat) {
        const counts = {};
        const traces = Object.values(traceInfo);
        for (let i = 0; i < traces.length; i++) {
            const info = traces[i];
            if (!info.abortReason)
                continue;
            else if (info.abortReason === "end-of-body")
                continue;
            if (counts[info.abortReason])
                counts[info.abortReason] += info.hitCount;
            else
                counts[info.abortReason] = info.hitCount;
        }
        if (countCallTargets) {
            mono_log_info("// hottest call targets:");
            const targetPointers = Object.keys(callTargetCounts);
            targetPointers.sort((l, r) => callTargetCounts[Number(r)] - callTargetCounts[Number(l)]);
            for (let i = 0, c = Math.min(summaryStatCount, targetPointers.length); i < c; i++) {
                const targetMethod = Number(targetPointers[i]) | 0;
                const pMethodName = wrapped_c_functions.mono_wasm_method_get_full_name(targetMethod);
                const targetMethodName = utf8ToString(pMethodName);
                const hitCount = callTargetCounts[targetMethod];
                free(pMethodName);
                mono_log_info(`${targetMethodName} ${hitCount}`);
            }
        }
        traces.sort((l, r) => r.hitCount - l.hitCount);
        mono_log_info("// hottest failed traces:");
        for (let i = 0, c = 0; i < traces.length && c < summaryStatCount; i++) {
            // this means the trace has a low hit count and we don't know its identity. no value in
            //  logging it.
            if (!traces[i].name)
                continue;
            // This means the trace did compile and just aborted later on
            if (traces[i].fnPtr)
                continue;
            // Filter out noisy methods that we don't care about optimizing
            if (traces[i].name.indexOf("Xunit.") >= 0)
                continue;
            // FIXME: A single hot method can contain many failed traces. This creates a lot of noise
            //  here and also likely indicates the jiterpreter would add a lot of overhead to it
            // Filter out aborts that aren't meaningful since it is unlikely to ever make sense
            //  to fix them, either because they are rarely used or because putting them in
            //  traces would not meaningfully improve performance
            if (traces[i].abortReason) {
                if (traces[i].abortReason.startsWith("mono_icall_") ||
                    traces[i].abortReason.startsWith("ret."))
                    continue;
                switch (traces[i].abortReason) {
                    // not feasible to fix
                    case "trace-too-small":
                    case "trace-too-big":
                    case "call":
                    case "callvirt.fast":
                    case "calli.nat.fast":
                    case "calli.nat":
                    case "call.delegate":
                    case "newobj":
                    case "newobj_vt":
                    case "newobj_slow":
                    case "switch":
                    case "rethrow":
                    case "end-of-body":
                    case "ret":
                        continue;
                    // not worth implementing / too difficult
                    case "intrins_marvin_block":
                    case "intrins_ascii_chars_to_uppercase":
                        continue;
                }
            }
            c++;
            mono_log_info(`${traces[i].name} @${traces[i].ip} (${traces[i].hitCount} hits) ${traces[i].abortReason}`);
        }
        const tuples = [];
        for (const k in counts)
            tuples.push([k, counts[k]]);
        tuples.sort((l, r) => r[1] - l[1]);
        mono_log_info("// heat:");
        for (let i = 0; i < tuples.length; i++)
            mono_log_info(`// ${tuples[i][0]}: ${tuples[i][1]}`);
    }
    else {
        for (let i = 0; i < 691 /* MintOpcode.MINT_LASTOP */; i++) {
            const opname = getOpcodeName(i);
            const count = wrapped_c_functions.mono_jiterp_adjust_abort_count(i, 0);
            if (count > 0)
                abortCounts[opname] = count;
            else
                delete abortCounts[opname];
        }
        const keys = Object.keys(abortCounts);
        keys.sort((l, r) => abortCounts[r] - abortCounts[l]);
        for (let i = 0; i < keys.length; i++)
            mono_log_info(`// ${keys[i]}: ${abortCounts[keys[i]]} abort(s)`);
    }
    for (const k in simdFallbackCounters)
        mono_log_info(`// simd ${k}: ${simdFallbackCounters[k]} fallback insn(s)`);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const tablePrefix = "https://dotnet.generated.invalid/interp_pgo";
async function interp_pgo_save_data() {
    if (!loaderHelpers.is_runtime_running()) {
        mono_log_info("Skipped saving interp_pgo table (already exited)");
        return;
    }
    const cacheKey = await getCacheKey(tablePrefix);
    if (!cacheKey) {
        mono_log_error("Failed to save interp_pgo table (No cache key)");
        return;
    }
    try {
        const expectedSize = wrapped_c_functions.mono_interp_pgo_save_table(0, 0);
        // If save_table returned 0 despite not being passed a buffer, that means there is no
        //  table data to save, either because interp_pgo is disabled or no methods were tiered yet
        if (expectedSize <= 0) {
            mono_log_info("Failed to save interp_pgo table (No data to save)");
            return;
        }
        const pData = malloc(expectedSize);
        const saved = wrapped_c_functions.mono_interp_pgo_save_table(pData, expectedSize) === 0;
        if (!saved) {
            mono_log_error("Failed to save interp_pgo table (Unknown error)");
            return;
        }
        const u8 = localHeapViewU8();
        const data = u8.slice(pData, pData + expectedSize);
        if (await storeCacheEntry(cacheKey, data, "application/octet-stream")) {
            mono_log_info("Saved interp_pgo table to cache");
        }
        cleanupCache(tablePrefix, cacheKey); // no await
        free(pData);
    }
    catch (exc) {
        mono_log_error(`Failed to save interp_pgo table: ${exc}`);
    }
}
async function interp_pgo_load_data() {
    const cacheKey = await getCacheKey(tablePrefix);
    if (!cacheKey) {
        mono_log_error("Failed to create cache key for interp_pgo table");
        return;
    }
    const data = await getCacheEntry(cacheKey);
    if (!data) {
        mono_log_info("Failed to load interp_pgo table (No table found in cache)");
        return;
    }
    const pData = malloc(data.byteLength);
    const u8 = localHeapViewU8();
    u8.set(new Uint8Array(data), pData);
    if (wrapped_c_functions.mono_interp_pgo_load_table(pData, data.byteLength))
        mono_log_error("Failed to load interp_pgo table (Unknown error)");
    free(pData);
}
async function openCache() {
    // cache integrity is compromised if the first request has been served over http (except localhost)
    // in this case, we want to disable caching and integrity validation
    if (ENVIRONMENT_IS_WEB && globalThis.window.isSecureContext === false) {
        mono_log_warn("Failed to open the cache, running on an insecure origin");
        return null;
    }
    // caches will be undefined if we're running on an insecure origin (secure means https or localhost)
    if (typeof globalThis.caches === "undefined") {
        mono_log_warn("Failed to open the cache, probably running on an insecure origin");
        return null;
    }
    // Define a separate cache for each base href, so we're isolated from any other
    // Blazor application running on the same origin. We need this so that we're free
    // to purge from the cache anything we're not using and don't let it keep growing,
    // since we don't want to be worst offenders for space usage.
    const relativeBaseHref = document.baseURI.substring(document.location.origin.length);
    const cacheName = `dotnet-resources${relativeBaseHref}`;
    try {
        // There's a Chromium bug we need to be aware of here: the CacheStorage APIs say that when
        // caches.open(name) returns a promise that succeeds, the value is meant to be a Cache instance.
        // However, if the browser was launched with a --user-data-dir param that's "too long" in some sense,
        // then even through the promise resolves as success, the value given is `undefined`.
        // See https://stackoverflow.com/a/46626574 and https://bugs.chromium.org/p/chromium/issues/detail?id=1054541
        // If we see this happening, return "null" to mean "proceed without caching".
        return (await globalThis.caches.open(cacheName)) || null;
    }
    catch (_a) {
        // There's no known scenario where we should get an exception here, but considering the
        // Chromium bug above, let's tolerate it and treat as "proceed without caching".
        mono_log_warn("Failed to open cache");
        return null;
    }
}
async function getCacheEntry(cacheKey) {
    try {
        const cache = await openCache();
        if (!cache) {
            return undefined;
        }
        const res = await cache.match(cacheKey);
        if (!res) {
            return undefined;
        }
        return res.arrayBuffer();
    }
    catch (ex) {
        mono_log_warn("Failed to load entry from the cache: " + cacheKey, ex);
        return undefined;
    }
}
async function storeCacheEntry(cacheKey, memory, mimeType) {
    try {
        const cache = await openCache();
        if (!cache) {
            return false;
        }
        const copy = WasmEnableThreads
            // storing SHaredArrayBuffer in the cache is not working
            ? (new Uint8Array(memory)).slice(0)
            : memory;
        const responseToCache = new Response(copy, {
            headers: {
                "content-type": mimeType,
                "content-length": memory.byteLength.toString(),
            },
        });
        await cache.put(cacheKey, responseToCache);
        return true;
    }
    catch (ex) {
        mono_log_warn("Failed to store entry to the cache: " + cacheKey, ex);
        return false;
    }
}
async function cleanupCache(prefix, protectKey) {
    try {
        const cache = await openCache();
        if (!cache) {
            return;
        }
        const items = await cache.keys();
        for (const item of items) {
            if (item.url && item.url !== protectKey && item.url.startsWith(prefix)) {
                await cache.delete(item);
            }
        }
    }
    catch (ex) {
        return;
    }
}
// calculate hash of things which affect config hash
async function getCacheKey(prefix) {
    if (!runtimeHelpers.subtle) {
        return null;
    }
    const inputs = Object.assign({}, runtimeHelpers.config);
    // Now we remove assets collection from the hash.
    inputs.resourcesHash = inputs.resources.hash;
    delete inputs.assets;
    delete inputs.resources;
    // some things are calculated at runtime, so we need to add them to the hash
    inputs.preferredIcuAsset = loaderHelpers.preferredIcuAsset;
    // timezone is part of env variables, so it is already in the hash
    // some things are not relevant for config hash
    delete inputs.forwardConsoleLogsToWS;
    delete inputs.diagnosticTracing;
    delete inputs.appendElementOnExit;
    delete inputs.interopCleanupOnExit;
    delete inputs.dumpThreadsOnNonZeroExit;
    delete inputs.logExitCode;
    delete inputs.pthreadPoolInitialSize;
    delete inputs.pthreadPoolUnusedSize;
    delete inputs.asyncFlushOnExit;
    delete inputs.remoteSources;
    delete inputs.ignorePdbLoadErrors;
    delete inputs.maxParallelDownloads;
    delete inputs.enableDownloadRetry;
    delete inputs.extensions;
    delete inputs.runtimeId;
    delete inputs.jsThreadBlockingMode;
    inputs.GitHash = loaderHelpers.gitHash;
    inputs.ProductVersion = ProductVersion;
    const inputsJson = JSON.stringify(inputs);
    const sha256Buffer = await runtimeHelpers.subtle.digest("SHA-256", new TextEncoder().encode(inputsJson));
    const uint8ViewOfHash = new Uint8Array(sha256Buffer);
    const hashAsString = Array.from(uint8ViewOfHash).map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${prefix}-${hashAsString}`;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
async function loadLazyAssembly(assemblyNameToLoad) {
    const resources = loaderHelpers.config.resources;
    const lazyAssemblies = resources.lazyAssembly;
    if (!lazyAssemblies) {
        throw new Error("No assemblies have been marked as lazy-loadable. Use the 'BlazorWebAssemblyLazyLoad' item group in your project file to enable lazy loading an assembly.");
    }
    let assemblyNameWithoutExtension = assemblyNameToLoad;
    if (assemblyNameToLoad.endsWith(".dll"))
        assemblyNameWithoutExtension = assemblyNameToLoad.substring(0, assemblyNameToLoad.length - 4);
    else if (assemblyNameToLoad.endsWith(".wasm"))
        assemblyNameWithoutExtension = assemblyNameToLoad.substring(0, assemblyNameToLoad.length - 5);
    const assemblyNameToLoadDll = assemblyNameWithoutExtension + ".dll";
    const assemblyNameToLoadWasm = assemblyNameWithoutExtension + ".wasm";
    if (loaderHelpers.config.resources.fingerprinting) {
        const map = loaderHelpers.config.resources.fingerprinting;
        for (const fingerprintedName in map) {
            const nonFingerprintedName = map[fingerprintedName];
            if (nonFingerprintedName == assemblyNameToLoadDll || nonFingerprintedName == assemblyNameToLoadWasm) {
                assemblyNameToLoad = fingerprintedName;
                break;
            }
        }
    }
    if (!lazyAssemblies[assemblyNameToLoad]) {
        if (lazyAssemblies[assemblyNameToLoadDll]) {
            assemblyNameToLoad = assemblyNameToLoadDll;
        }
        else if (lazyAssemblies[assemblyNameToLoadWasm]) {
            assemblyNameToLoad = assemblyNameToLoadWasm;
        }
        else {
            throw new Error(`${assemblyNameToLoad} must be marked with 'BlazorWebAssemblyLazyLoad' item group in your project file to allow lazy-loading.`);
        }
    }
    const dllAsset = {
        name: assemblyNameToLoad,
        hash: lazyAssemblies[assemblyNameToLoad],
        behavior: "assembly",
    };
    if (loaderHelpers.loadedAssemblies.includes(assemblyNameToLoad)) {
        return false;
    }
    let pdbNameToLoad = assemblyNameWithoutExtension + ".pdb";
    let shouldLoadPdb = false;
    if (loaderHelpers.config.debugLevel != 0 && loaderHelpers.isDebuggingSupported()) {
        shouldLoadPdb = Object.prototype.hasOwnProperty.call(lazyAssemblies, pdbNameToLoad);
        if (loaderHelpers.config.resources.fingerprinting) {
            const map = loaderHelpers.config.resources.fingerprinting;
            for (const fingerprintedName in map) {
                const nonFingerprintedName = map[fingerprintedName];
                if (nonFingerprintedName == pdbNameToLoad) {
                    pdbNameToLoad = fingerprintedName;
                    shouldLoadPdb = true;
                    break;
                }
            }
        }
    }
    const dllBytesPromise = loaderHelpers.retrieve_asset_download(dllAsset);
    let dll = null;
    let pdb = null;
    if (shouldLoadPdb) {
        const pdbBytesPromise = lazyAssemblies[pdbNameToLoad]
            ? loaderHelpers.retrieve_asset_download({
                name: pdbNameToLoad,
                hash: lazyAssemblies[pdbNameToLoad],
                behavior: "pdb"
            })
            : Promise.resolve(null);
        const [dllBytes, pdbBytes] = await Promise.all([dllBytesPromise, pdbBytesPromise]);
        dll = new Uint8Array(dllBytes);
        pdb = pdbBytes ? new Uint8Array(pdbBytes) : null;
    }
    else {
        const dllBytes = await dllBytesPromise;
        dll = new Uint8Array(dllBytes);
        pdb = null;
    }
    load_lazy_assembly(dll, pdb);
    return true;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
async function loadSatelliteAssemblies(culturesToLoad) {
    const satelliteResources = loaderHelpers.config.resources.satelliteResources;
    if (!satelliteResources) {
        return;
    }
    await Promise.all(culturesToLoad
        .filter(culture => Object.prototype.hasOwnProperty.call(satelliteResources, culture))
        .map(culture => {
        const promises = [];
        for (const name in satelliteResources[culture]) {
            const asset = {
                name,
                hash: satelliteResources[culture][name],
                behavior: "resource",
                culture
            };
            promises.push(loaderHelpers.retrieve_asset_download(asset));
        }
        return promises;
    })
        .reduce((previous, next) => previous.concat(next), new Array())
        .map(async (bytesPromise) => {
        const bytes = await bytesPromise;
        load_satellite_assembly(new Uint8Array(bytes));
    }));
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function export_internal() {
    return {
        // tests
        mono_wasm_exit: (exit_code) => {
            Module.err("early exit " + exit_code);
        },
        forceDisposeProxies,
        mono_wasm_dump_threads: WasmEnableThreads ? mono_wasm_dump_threads : undefined,
        // with mono_wasm_debugger_log and mono_wasm_trace_logger
        logging: undefined,
        mono_wasm_stringify_as_error_with_stack,
        // used in debugger DevToolsHelper.cs
        mono_wasm_get_loaded_files,
        mono_wasm_send_dbg_command_with_parms,
        mono_wasm_send_dbg_command,
        mono_wasm_get_dbg_command_info,
        mono_wasm_get_details,
        mono_wasm_release_object,
        mono_wasm_call_function_on,
        mono_wasm_debugger_resume,
        mono_wasm_detach_debugger,
        mono_wasm_raise_debug_event,
        mono_wasm_change_debugger_log_level,
        mono_wasm_debugger_attached,
        mono_wasm_runtime_is_ready: runtimeHelpers.mono_wasm_runtime_is_ready,
        mono_wasm_get_func_id_to_name_mappings,
        // interop
        get_property,
        set_property,
        has_property,
        get_typeof_property,
        get_global_this,
        get_dotnet_instance: () => exportedRuntimeAPI,
        dynamic_import,
        mono_wasm_bind_cs_function,
        // BrowserWebSocket
        ws_wasm_create,
        ws_wasm_open,
        ws_wasm_send,
        ws_wasm_receive,
        ws_wasm_close,
        ws_wasm_abort,
        ws_get_state,
        // BrowserHttpHandler
        http_wasm_supports_streaming_request,
        http_wasm_supports_streaming_response,
        http_wasm_create_controller,
        http_wasm_get_response_type,
        http_wasm_get_response_status,
        http_wasm_abort,
        http_wasm_transform_stream_write,
        http_wasm_transform_stream_close,
        http_wasm_fetch,
        http_wasm_fetch_stream,
        http_wasm_fetch_bytes,
        http_wasm_get_response_header_names,
        http_wasm_get_response_header_values,
        http_wasm_get_response_bytes,
        http_wasm_get_response_length,
        http_wasm_get_streamed_response_bytes,
        // jiterpreter
        jiterpreter_dump_stats,
        jiterpreter_apply_options: applyOptions,
        jiterpreter_get_options: getOptions,
        // interpreter pgo
        interp_pgo_load_data,
        interp_pgo_save_data,
        // Blazor GC Lock support
        mono_wasm_gc_lock,
        mono_wasm_gc_unlock,
        // Blazor legacy replacement
        monoObjectAsBoolOrNullUnsafe,
        monoStringToStringUnsafe,
        loadLazyAssembly,
        loadSatelliteAssemblies
    };
}
function cwraps_internal(internal) {
    Object.assign(internal, {
        mono_wasm_exit: wrapped_c_functions.mono_wasm_exit,
        mono_wasm_profiler_init_aot: profiler_c_functions.mono_wasm_profiler_init_aot,
        mono_wasm_profiler_init_browser: profiler_c_functions.mono_wasm_profiler_init_browser,
        mono_wasm_exec_regression: wrapped_c_functions.mono_wasm_exec_regression,
        mono_wasm_print_thread_dump: WasmEnableThreads ? threads_c_functions.mono_wasm_print_thread_dump : undefined,
    });
}
/* @deprecated not GC safe, legacy support for Blazor */
function monoObjectAsBoolOrNullUnsafe(obj) {
    // TODO https://github.com/dotnet/runtime/issues/100411
    // after Blazor stops using monoObjectAsBoolOrNullUnsafe
    if (obj === MonoObjectNull) {
        return null;
    }
    const res = wrapped_c_functions.mono_wasm_read_as_bool_or_null_unsafe(obj);
    if (res === 0) {
        return false;
    }
    if (res === 1) {
        return true;
    }
    return null;
}

// batchedQuotaMax is the max number of bytes as specified by the api spec.
// If the byteLength of array is greater than 65536, throw a QuotaExceededError and terminate the algorithm.
// https://www.w3.org/TR/WebCryptoAPI/#Crypto-method-getRandomValues
const batchedQuotaMax = 65536;
function mono_wasm_browser_entropy(bufferPtr, bufferLength) {
    if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
        return -1;
    }
    const memoryView = localHeapViewU8();
    const targetView = memoryView.subarray(bufferPtr, bufferPtr + bufferLength);
    // When threading is enabled, Chrome doesn't want SharedArrayBuffer to be passed to crypto APIs
    const needsCopy = isSharedArrayBuffer(memoryView.buffer);
    const targetBuffer = needsCopy
        ? new Uint8Array(bufferLength)
        : targetView;
    // fill the targetBuffer in batches of batchedQuotaMax
    for (let i = 0; i < bufferLength; i += batchedQuotaMax) {
        const targetBatch = targetBuffer.subarray(i, i + Math.min(bufferLength - i, batchedQuotaMax));
        globalThis.crypto.getRandomValues(targetBatch);
    }
    if (needsCopy) {
        targetView.set(targetBuffer);
    }
    return 0;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
const OUTER_SEPARATOR = "##";
function normalizeLocale(locale) {
    if (!locale)
        return undefined;
    try {
        locale = locale.toLocaleLowerCase().replace("_", "-");
        if (locale.startsWith("zh-")) {
            // browser does not recognize "zh-chs" and "zh-cht" as equivalents of "zh-Hans" "zh-Hant", we are helping, otherwise
            // it would throw on getCanonicalLocales with "RangeError: Incorrect locale information provided"
            locale = locale.replace("-chs", "-Hans").replace("-cht", "-Hant");
        }
        const canonicalLocales = Intl.getCanonicalLocales(locale);
        return canonicalLocales.length > 0 ? canonicalLocales[0] : undefined;
    }
    catch (_a) {
        return undefined;
    }
}
function mono_wasm_get_locale_info(culture, cultureLength, locale, localeLength, dst, dstMaxLength, dstLength) {
    try {
        const localeNameOriginal = utf16ToString(locale, (locale + 2 * localeLength));
        const localeName = normalizeLocale(localeNameOriginal);
        if (!localeName && localeNameOriginal) {
            // handle non-standard or malformed locales by forwarding the locale code
            stringToUTF16(dst, dst + 2 * localeNameOriginal.length, localeNameOriginal);
            setI32(dstLength, localeNameOriginal.length);
            return VoidPtrNull;
        }
        const cultureNameOriginal = utf16ToString(culture, (culture + 2 * cultureLength));
        const cultureName = normalizeLocale(cultureNameOriginal);
        if (!localeName || !cultureName)
            throw new Error(`Locale or culture name is null or empty. localeName=${localeName}, cultureName=${cultureName}`);
        const localeParts = localeName.split("-");
        // cultureName can be in a form of:
        // 1) "language", e.g. "zh"
        // 2) "language-region", e.g. "zn-CN"
        // 3) "language-script-region", e.g. "zh-Hans-CN"
        // 4) "language-script", e.g. "zh-Hans" (served in the catch block below)
        let languageName, regionName;
        try {
            const region = localeParts.length > 1 ? localeParts.pop() : undefined;
            // this line might fail if form 4 from the comment above is used:
            regionName = region ? new Intl.DisplayNames([cultureName], { type: "region" }).of(region) : undefined;
            const language = localeParts.join("-");
            languageName = new Intl.DisplayNames([cultureName], { type: "language" }).of(language);
        }
        catch (error) {
            if (error instanceof RangeError) {
                // if it failed from this reason then cultureName is in a form "language-script", without region
                try {
                    languageName = new Intl.DisplayNames([cultureName], { type: "language" }).of(localeName);
                }
                catch (error) {
                    if (error instanceof RangeError && localeNameOriginal) {
                        // handle non-standard or malformed locales by forwarding the locale code, e.g. "xx-u-xx"
                        stringToUTF16(dst, dst + 2 * localeNameOriginal.length, localeNameOriginal);
                        setI32(dstLength, localeNameOriginal.length);
                        return VoidPtrNull;
                    }
                    throw error;
                }
            }
            else {
                throw error;
            }
        }
        const localeInfo = {
            LanguageName: languageName,
            RegionName: regionName,
        };
        const result = Object.values(localeInfo).join(OUTER_SEPARATOR);
        if (!result)
            throw new Error(`Locale info for locale=${localeName} is null or empty.`);
        if (result.length > dstMaxLength)
            throw new Error(`Locale info for locale=${localeName} exceeds length of ${dstMaxLength}.`);
        stringToUTF16(dst, dst + 2 * result.length, result);
        setI32(dstLength, result.length);
        return VoidPtrNull;
    }
    catch (ex) {
        setI32(dstLength, -1);
        return stringToUTF16Ptr(ex.toString());
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function ds_rt_websocket_create(urlPtr) {
    return diagnosticHelpers.ds_rt_websocket_create(urlPtr);
}
function ds_rt_websocket_send(client_socket, buffer, bytes_to_write) {
    return diagnosticHelpers.ds_rt_websocket_send(client_socket, buffer, bytes_to_write);
}
function ds_rt_websocket_poll(client_socket) {
    return diagnosticHelpers.ds_rt_websocket_poll(client_socket);
}
function ds_rt_websocket_recv(client_socket, buffer, bytes_to_read) {
    return diagnosticHelpers.ds_rt_websocket_recv(client_socket, buffer, bytes_to_read);
}
function ds_rt_websocket_close(client_socket) {
    return diagnosticHelpers.ds_rt_websocket_close(client_socket);
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// the JS methods would be visible to EMCC linker and become imports of the WASM module
const mono_wasm_threads_imports = !WasmEnableThreads ? [] : [
    // mono-threads-wasm.c
    mono_wasm_pthread_on_pthread_registered,
    mono_wasm_pthread_on_pthread_attached,
    mono_wasm_pthread_on_pthread_unregistered,
    mono_wasm_pthread_set_name,
    mono_wasm_start_deputy_thread_async,
    mono_wasm_start_io_thread_async,
    mono_wasm_schedule_synchronization_context,
    // mono-threads.c
    mono_wasm_dump_threads,
    // corebindings.c
    mono_wasm_install_js_worker_interop,
    mono_wasm_uninstall_js_worker_interop,
    mono_wasm_invoke_jsimport_MT,
    mono_wasm_warn_about_blocking_wait,
];
const mono_wasm_imports = [
    // mini-wasm.c
    mono_wasm_schedule_timer,
    // mini-wasm-debugger.c
    mono_wasm_asm_loaded,
    mono_wasm_debugger_log,
    mono_wasm_add_dbg_command_received,
    mono_wasm_fire_debugger_agent_message_with_data,
    mono_wasm_fire_debugger_agent_message_with_data_to_pause,
    // mono-threads-wasm.c
    schedule_background_exec,
    // interp.c and jiterpreter.c
    mono_interp_tier_prepare_jiterpreter,
    mono_interp_record_interp_entry,
    mono_interp_jit_wasm_entry_trampoline,
    mono_interp_jit_wasm_jit_call_trampoline,
    mono_interp_invoke_wasm_jit_call_trampoline,
    mono_interp_flush_jitcall_queue,
    mono_wasm_free_method_data,
    // browser.c, ep-rt-mono-runtime-provider.c
    mono_wasm_instrument_method,
    mono_wasm_profiler_now,
    mono_wasm_profiler_record,
    // driver.c
    mono_wasm_trace_logger,
    mono_wasm_set_entrypoint_breakpoint,
    // src/native/minipal/random.c
    mono_wasm_browser_entropy,
    // corebindings.c
    mono_wasm_console_clear,
    mono_wasm_release_cs_owned_object,
    mono_wasm_bind_js_import_ST,
    mono_wasm_invoke_js_function,
    mono_wasm_invoke_jsimport_ST,
    mono_wasm_resolve_or_reject_promise,
    mono_wasm_cancel_promise,
    mono_wasm_get_locale_info,
    //event pipe
    ds_rt_websocket_create,
    ds_rt_websocket_send,
    ds_rt_websocket_poll,
    ds_rt_websocket_recv,
    ds_rt_websocket_close,
];
// !!! Keep in sync with exports-linker.ts
const wasmImports = [
    ...mono_wasm_imports,
    // threading exports, if threading is enabled
    ...mono_wasm_threads_imports,
];
function replace_linker_placeholders(imports) {
    // the output from emcc contains wrappers for these linker imports which add overhead,
    //  but now we have what we need to replace them with the actual functions
    // By default the imports all live inside of 'env', but emscripten minification could rename it to 'a'.
    // See https://github.com/emscripten-core/emscripten/blob/c5d1a856592b788619be11bbdc1dd119dec4e24c/src/preamble.js#L933-L936
    const env = imports.env || imports.a;
    if (!env) {
        mono_log_warn("WARNING: Neither imports.env or imports.a were present when instantiating the wasm module. This likely indicates an emscripten configuration issue.");
        return;
    }
    // the import names could be minified by applyImportAndExportNameChanges in emcc
    // we call each stub function to get the runtime_idx, which is the index into the wasmImports array
    const indexToNameMap = new Array(wasmImports.length);
    for (const shortName in env) {
        const stub_fn = env[shortName];
        if (typeof stub_fn === "function" && stub_fn.toString().indexOf("runtime_idx") !== -1) {
            try {
                const { runtime_idx } = stub_fn();
                if (indexToNameMap[runtime_idx] !== undefined)
                    throw new Error(`Duplicate runtime_idx ${runtime_idx}`);
                indexToNameMap[runtime_idx] = shortName;
            }
            catch (_a) {
                // no-action
            }
        }
    }
    for (const [idx, realFn] of wasmImports.entries()) {
        const shortName = indexToNameMap[idx];
        // if it's not found it means the emcc linker didn't include it, which is fine
        if (shortName !== undefined) {
            const stubFn = env[shortName];
            if (typeof stubFn !== "function")
                throw new Error(`Expected ${shortName} to be a function`);
            env[shortName] = realFn;
        }
    }
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
/**
 * Possible signatures are described here  https://learn.microsoft.com/dotnet/csharp/fundamentals/program-structure/main-command-line
 */
async function mono_run_main_and_exit(main_assembly_name, args) {
    try {
        const result = await mono_run_main(main_assembly_name, args);
        loaderHelpers.mono_exit(result);
        return result;
    }
    catch (error) {
        try {
            loaderHelpers.mono_exit(1, error);
        }
        catch (e) {
            // ignore
        }
        if (error && typeof error.status === "number") {
            return error.status;
        }
        return 1;
    }
}
/**
 * Possible signatures are described here  https://learn.microsoft.com/dotnet/csharp/fundamentals/program-structure/main-command-line
 */
async function mono_run_main(main_assembly_name, args) {
    if (main_assembly_name === undefined || main_assembly_name === null || main_assembly_name === "") {
        main_assembly_name = loaderHelpers.config.mainAssemblyName;
        if (!(main_assembly_name)) mono_assert(false, "Null or empty config.mainAssemblyName"); // inlined mono_assert condition
    }
    if (args === undefined || args === null) {
        args = runtimeHelpers.config.applicationArguments;
    }
    if (args === undefined || args === null) {
        if (ENVIRONMENT_IS_NODE) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore:
            const process = await import(/*! webpackIgnore: true */ 'process');
            args = process.argv.slice(2);
        }
        else {
            args = [];
        }
    }
    mono_wasm_set_main_args(main_assembly_name, args);
    loaderHelpers.config.mainAssemblyName = main_assembly_name;
    if (runtimeHelpers.waitForDebugger == -1) {
        mono_log_info("waiting for debugger...");
        await mono_wasm_wait_for_debugger();
    }
    try {
        Module.runtimeKeepalivePush();
        // one more timer loop before we return, so that any remaining queued calls could run
        await new Promise(resolve => globalThis.setTimeout(resolve, 0));
        return await call_entry_point(main_assembly_name, args, runtimeHelpers.waitForDebugger == 1);
    }
    finally {
        Module.runtimeKeepalivePop(); // after await promise !
    }
}
function nativeExit(code) {
    if (runtimeHelpers.runtimeReady) {
        runtimeHelpers.runtimeReady = false;
        if (WasmEnableThreads) {
            postCancelThreads();
        }
        wrapped_c_functions.mono_wasm_exit(code);
    }
}
function nativeAbort(reason) {
    loaderHelpers.exitReason = reason;
    if (runtimeHelpers.runtimeReady) {
        runtimeHelpers.runtimeReady = false;
        if (WasmEnableThreads) {
            if (!ENVIRONMENT_IS_WORKER) {
                terminateAllThreads();
            }
            else {
                // just in case if the UI thread is blocked, we need to force exit
                // if UI thread receives message from Module.abort below, this thread will be terminated earlier
                setTimeout(() => {
                    mono_log_error("forcing abort 3000ms after nativeAbort attempt", reason);
                    // _emscripten_force_exit is proxied to UI thread and should also arrive in spin wait loop
                    Module._emscripten_force_exit(1);
                }, 3000);
            }
        }
        const reasonString = mono_wasm_stringify_as_error_with_stack(reason);
        Module.abort(reasonString);
    }
    throw reason;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
async function configureRuntimeStartup(module) {
    if (!module.out) {
        // eslint-disable-next-line no-console
        module.out = console.log.bind(console);
    }
    if (!module.err) {
        // eslint-disable-next-line no-console
        module.err = console.error.bind(console);
    }
    if (!module.print) {
        module.print = module.out;
    }
    if (!module.printErr) {
        module.printErr = module.err;
    }
    loaderHelpers.out = module.print;
    loaderHelpers.err = module.printErr;
    await init_polyfills_async();
}
// we are making emscripten startup async friendly
// emscripten is executing the events without awaiting it and so we need to block progress via PromiseControllers above
function configureEmscriptenStartup(module) {
    const mark = startMeasure();
    if (!module.locateFile) {
        // this is dummy plug so that wasmBinaryFile doesn't try to use URL class
        module.locateFile = module.__locateFile = (path) => loaderHelpers.scriptDirectory + path;
    }
    module.mainScriptUrlOrBlob = loaderHelpers.scriptUrl; // this is needed by worker threads
    // these all could be overridden on DotnetModuleConfig, we are chaing them to async below, as opposed to emscripten
    // when user set configSrc or config, we are running our default startup sequence.
    const userInstantiateWasm = module.instantiateWasm;
    const userPreInit = !module.preInit ? [] : typeof module.preInit === "function" ? [module.preInit] : module.preInit;
    const userPreRun = !module.preRun ? [] : typeof module.preRun === "function" ? [module.preRun] : module.preRun;
    const userpostRun = !module.postRun ? [] : typeof module.postRun === "function" ? [module.postRun] : module.postRun;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const userOnRuntimeInitialized = module.onRuntimeInitialized ? module.onRuntimeInitialized : () => { };
    // execution order == [0] ==
    // - default or user Module.instantiateWasm (will start downloading dotnet.native.wasm)
    module.instantiateWasm = (imports, callback) => instantiateWasm(imports, callback, userInstantiateWasm);
    // execution order == [1] ==
    module.preInit = [() => preInit(userPreInit)];
    // execution order == [2] ==
    module.preRun = [() => preRunAsync(userPreRun)];
    // execution order == [4] ==
    module.onRuntimeInitialized = () => onRuntimeInitializedAsync(userOnRuntimeInitialized);
    // execution order == [5] ==
    module.postRun = [() => postRunAsync(userpostRun)];
    // execution order == [6] ==
    module.ready.then(async () => {
        // wait for previous stage
        await runtimeHelpers.afterPostRun.promise;
        // startup end
        endMeasure(mark, "mono.emscriptenStartup" /* MeasuredBlock.emscriptenStartup */);
        // - here we resolve the promise returned by createDotnetRuntime export
        // - any code after createDotnetRuntime is executed now
        runtimeHelpers.dotnetReady.promise_control.resolve(exportedRuntimeAPI);
    }).catch(err => {
        runtimeHelpers.dotnetReady.promise_control.reject(err);
    });
    module.ready = runtimeHelpers.dotnetReady.promise;
}
function instantiateWasm(imports, successCallback, userInstantiateWasm) {
    // this is called so early that even Module exports like addRunDependency don't exist yet
    const mark = startMeasure();
    if (userInstantiateWasm) {
        const exports = userInstantiateWasm(imports, (instance, module) => {
            endMeasure(mark, "mono.instantiateWasm" /* MeasuredBlock.instantiateWasm */);
            runtimeHelpers.afterInstantiateWasm.promise_control.resolve();
            successCallback(instance, module);
        });
        return exports;
    }
    instantiate_wasm_module(imports, successCallback);
    return []; // No exports
}
async function instantiateWasmWorker(imports, successCallback) {
    if (!WasmEnableThreads)
        return;
    await ensureUsedWasmFeatures();
    // wait for the config to arrive by message from the main thread
    await loaderHelpers.afterConfigLoaded.promise;
    replace_linker_placeholders(imports);
    replaceEmscriptenPThreadInit();
    // Instantiate from the module posted from the main thread.
    // We can just use sync instantiation in the worker.
    const instance = new WebAssembly.Instance(Module.wasmModule, imports);
    successCallback(instance, undefined);
    Module.wasmModule = null;
}
function preInit(userPreInit) {
    Module.addRunDependency("mono_pre_init");
    const mark = startMeasure();
    try {
        mono_wasm_pre_init_essential(false);
        if (loaderHelpers.diagnosticTracing) mono_log_debug("preInit"); // inlined mono_log_debug condition
        runtimeHelpers.beforePreInit.promise_control.resolve();
        // all user Module.preInit callbacks
        userPreInit.forEach(fn => fn(Module));
    }
    catch (err) {
        mono_log_error("user preInint() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
    // this will start immediately but return on first await.
    // It will block our `preRun` by afterPreInit promise
    // It will block emscripten `userOnRuntimeInitialized` by pending addRunDependency("mono_pre_init")
    (async () => {
        try {
            // - init the rest of the polyfills
            await mono_wasm_pre_init_essential_async();
            endMeasure(mark, "mono.preInit" /* MeasuredBlock.preInit */);
        }
        catch (err) {
            loaderHelpers.mono_exit(1, err);
            throw err;
        }
        // signal next stage
        runtimeHelpers.afterPreInit.promise_control.resolve();
        Module.removeRunDependency("mono_pre_init");
    })();
}
async function preInitWorkerAsync() {
    if (!WasmEnableThreads)
        return;
    const mark = startMeasure();
    try {
        if (loaderHelpers.diagnosticTracing) mono_log_debug("preInitWorker"); // inlined mono_log_debug condition
        runtimeHelpers.beforePreInit.promise_control.resolve();
        mono_wasm_pre_init_essential(true);
        await ensureUsedWasmFeatures();
        await init_polyfills_async();
        if (loaderHelpers.config.exitOnUnhandledError) {
            loaderHelpers.installUnhandledErrorHandler();
        }
        runtimeHelpers.afterPreInit.promise_control.resolve();
        exportedRuntimeAPI.runtimeId = loaderHelpers.config.runtimeId;
        runtimeList.registerRuntime(exportedRuntimeAPI);
        endMeasure(mark, "mono.preInitWorker" /* MeasuredBlock.preInitWorker */);
    }
    catch (err) {
        mono_log_error("preInitWorker() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
// runs for each re-attached worker
function preRunWorker() {
    if (!WasmEnableThreads)
        return;
    const mark = startMeasure();
    try {
        jiterpreter_allocate_tables(); // this will return quickly if already allocated
        runtimeHelpers.nativeExit = nativeExit;
        runtimeHelpers.nativeAbort = nativeAbort;
        runtimeHelpers.runtimeReady = true;
        // signal next stage
        runtimeHelpers.afterPreRun.promise_control.resolve();
        endMeasure(mark, "mono.preRunWorker" /* MeasuredBlock.preRunWorker */);
    }
    catch (err) {
        mono_log_error("preRunWorker() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
async function preRunAsync(userPreRun) {
    Module.addRunDependency("mono_pre_run_async");
    // wait for previous stages
    try {
        await runtimeHelpers.afterInstantiateWasm.promise;
        await runtimeHelpers.afterPreInit.promise;
        if (loaderHelpers.diagnosticTracing) mono_log_debug("preRunAsync"); // inlined mono_log_debug condition
        const mark = startMeasure();
        // all user Module.preRun callbacks
        userPreRun.map(fn => fn(Module));
        endMeasure(mark, "mono.preRun" /* MeasuredBlock.preRun */);
    }
    catch (err) {
        mono_log_error("preRunAsync() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
    // signal next stage
    runtimeHelpers.afterPreRun.promise_control.resolve();
    Module.removeRunDependency("mono_pre_run_async");
}
async function onRuntimeInitializedAsync(userOnRuntimeInitialized) {
    try {
        // wait for previous stage
        await runtimeHelpers.afterPreRun.promise;
        if (loaderHelpers.diagnosticTracing) mono_log_debug("onRuntimeInitialized"); // inlined mono_log_debug condition
        runtimeHelpers.nativeExit = nativeExit;
        runtimeHelpers.nativeAbort = nativeAbort;
        const mark = startMeasure();
        // signal this stage, this will allow pending assets to allocate memory
        runtimeHelpers.beforeOnRuntimeInitialized.promise_control.resolve();
        let threadsReady;
        if (WasmEnableThreads) {
            threadsReady = mono_wasm_init_threads();
        }
        await runtimeHelpers.coreAssetsInMemory.promise;
        if (runtimeHelpers.config.virtualWorkingDirectory) {
            const FS = Module.FS;
            const cwd = runtimeHelpers.config.virtualWorkingDirectory;
            try {
                const wds = FS.stat(cwd);
                if (!wds) {
                    Module.FS_createPath("/", cwd, true, true);
                }
                else {
                    if (!(wds && FS.isDir(wds.mode))) mono_assert(false, `FS.chdir: ${cwd} is not a directory`); // inlined mono_assert condition
                }
            }
            catch (e) {
                Module.FS_createPath("/", cwd, true, true);
            }
            FS.chdir(cwd);
        }
        if (runtimeHelpers.config.interpreterPgo)
            setTimeout(maybeSaveInterpPgoTable, (runtimeHelpers.config.interpreterPgoSaveDelay || 15) * 1000);
        Module.runtimeKeepalivePush();
        if (WasmEnableThreads && BuildConfiguration === "Debug" && globalThis.setInterval)
            globalThis.setInterval(() => {
                mono_log_info("UI thread is alive!");
            }, 3000);
        if (WasmEnableThreads) {
            await threadsReady;
            // this will create thread and call start_runtime() on it
            runtimeHelpers.monoThreadInfo = monoThreadInfo;
            runtimeHelpers.isManagedRunningOnCurrentThread = false;
            update_thread_info();
            runtimeHelpers.managedThreadTID = threads_c_functions.mono_wasm_create_deputy_thread();
            // await mono started on deputy thread
            await runtimeHelpers.afterMonoStarted.promise;
            runtimeHelpers.ioThreadTID = threads_c_functions.mono_wasm_create_io_thread();
            // TODO make UI thread not managed/attached https://github.com/dotnet/runtime/issues/100411
            threads_c_functions.mono_wasm_register_ui_thread();
            monoThreadInfo.isAttached = true;
            monoThreadInfo.isRegistered = true;
            runtimeHelpers.runtimeReady = true;
            update_thread_info();
            bindings_init();
            threads_c_functions.mono_wasm_init_finalizer_thread();
            runtimeHelpers.disableManagedTransition = true;
        }
        else {
            // load mono runtime and apply environment settings (if necessary)
            await start_runtime();
        }
        if (WasmEnableThreads) {
            await runtimeHelpers.afterIOStarted.promise;
        }
        await wait_for_all_assets();
        if (WasmEnableThreads) {
            runtimeHelpers.deputyWorker.thread.postMessageToWorker({
                type: "deputyThread",
                cmd: "allAssetsLoaded" /* MainToWorkerMessageType.allAssetsLoaded */,
            });
            runtimeHelpers.proxyGCHandle = await runtimeHelpers.afterDeputyReady.promise;
        }
        runtimeList.registerRuntime(exportedRuntimeAPI);
        if (!runtimeHelpers.mono_wasm_runtime_is_ready)
            mono_wasm_runtime_ready();
        if (loaderHelpers.config.debugLevel !== 0 && loaderHelpers.config.cacheBootResources) {
            loaderHelpers.logDownloadStatsToConsole();
        }
        setTimeout(() => {
            loaderHelpers.purgeUnusedCacheEntriesAsync(); // Don't await - it's fine to run in background
        }, loaderHelpers.config.cachedResourcesPurgeDelay);
        // call user code
        try {
            userOnRuntimeInitialized(Module);
        }
        catch (err) {
            mono_log_error("user callback onRuntimeInitialized() failed", err);
            throw err;
        }
        // finish
        await mono_wasm_after_user_runtime_initialized();
        endMeasure(mark, "mono.onRuntimeInitialized" /* MeasuredBlock.onRuntimeInitialized */);
    }
    catch (err) {
        Module.runtimeKeepalivePop();
        mono_log_error("onRuntimeInitializedAsync() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
    // signal next stage
    runtimeHelpers.afterOnRuntimeInitialized.promise_control.resolve();
}
async function postRunAsync(userpostRun) {
    // wait for previous stage
    try {
        await runtimeHelpers.afterOnRuntimeInitialized.promise;
        if (loaderHelpers.diagnosticTracing) mono_log_debug("postRunAsync"); // inlined mono_log_debug condition
        const mark = startMeasure();
        // create /usr/share folder which is SpecialFolder.CommonApplicationData
        Module["FS_createPath"]("/", "usr", true, true);
        Module["FS_createPath"]("/", "usr/share", true, true);
        // all user Module.postRun callbacks
        userpostRun.map(fn => fn(Module));
        endMeasure(mark, "mono.postRun" /* MeasuredBlock.postRun */);
    }
    catch (err) {
        mono_log_error("postRunAsync() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
    // signal next stage
    runtimeHelpers.afterPostRun.promise_control.resolve();
}
// runs for each re-detached worker
function postRunWorker() {
    if (!WasmEnableThreads)
        return;
    const mark = startMeasure();
    try {
        if (runtimeHelpers.proxyGCHandle) {
            mono_log_warn("JSSynchronizationContext is still installed on worker.");
        }
        else {
            assertNoProxies();
        }
        // signal next stage
        runtimeHelpers.runtimeReady = false;
        runtimeHelpers.afterPreRun = createPromiseController();
        endMeasure(mark, "mono.postRunWorker" /* MeasuredBlock.postRunWorker */);
    }
    catch (err) {
        mono_log_error("postRunWorker() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
function mono_wasm_pre_init_essential(isWorker) {
    if (!isWorker)
        Module.addRunDependency("mono_wasm_pre_init_essential");
    if (loaderHelpers.diagnosticTracing) mono_log_debug("mono_wasm_pre_init_essential"); // inlined mono_log_debug condition
    if (loaderHelpers.gitHash !== runtimeHelpers.gitHash) {
        mono_log_warn(`The version of dotnet.runtime.js ${runtimeHelpers.gitHash} is different from the version of dotnet.js ${loaderHelpers.gitHash}!`);
    }
    if (loaderHelpers.gitHash !== runtimeHelpers.emscriptenBuildOptions.gitHash) {
        mono_log_warn(`The version of dotnet.native.js ${runtimeHelpers.emscriptenBuildOptions.gitHash}  is different from the version of dotnet.js ${loaderHelpers.gitHash}!`);
    }
    if (WasmEnableThreads !== runtimeHelpers.emscriptenBuildOptions.wasmEnableThreads) {
        mono_log_warn(`The threads of dotnet.native.js ${runtimeHelpers.emscriptenBuildOptions.wasmEnableThreads} is different from the version of dotnet.runtime.js ${WasmEnableThreads}!`);
    }
    init_c_exports();
    cwraps_internal(INTERNAL);
    // removeRunDependency triggers the dependenciesFulfilled callback (runCaller) in
    // emscripten - on a worker since we don't have any other dependencies that causes run() to get
    // called too soon; and then it will get called a second time when dotnet.native.js calls it directly.
    // on a worker run() short-cirtcuits and just calls   readyPromiseResolve, initRuntime and postMessage.
    // sending postMessage twice will break instantiateWasmPThreadWorkerPool on the main thread.
    if (!isWorker)
        Module.removeRunDependency("mono_wasm_pre_init_essential");
}
async function mono_wasm_pre_init_essential_async() {
    if (loaderHelpers.diagnosticTracing) mono_log_debug("mono_wasm_pre_init_essential_async"); // inlined mono_log_debug condition
    Module.addRunDependency("mono_wasm_pre_init_essential_async");
    if (WasmEnableThreads) {
        await populateEmscriptenPool();
    }
    Module.removeRunDependency("mono_wasm_pre_init_essential_async");
}
async function mono_wasm_after_user_runtime_initialized() {
    if (loaderHelpers.diagnosticTracing) mono_log_debug("mono_wasm_after_user_runtime_initialized"); // inlined mono_log_debug condition
    try {
        if (Module.onDotnetReady) {
            try {
                await Module.onDotnetReady();
            }
            catch (err) {
                mono_log_error("onDotnetReady () failed", err);
                throw err;
            }
        }
    }
    catch (err) {
        mono_log_error("mono_wasm_after_user_runtime_initialized () failed", err);
        throw err;
    }
}
// Set environment variable NAME to VALUE
// Should be called before mono_load_runtime_and_bcl () in most cases
function mono_wasm_setenv(name, value) {
    wrapped_c_functions.mono_wasm_setenv(name, value);
}
function mono_wasm_set_runtime_options(options) {
    if (!Array.isArray(options))
        throw new Error("Expected runtimeOptions to be an array of strings");
    const argv = malloc(options.length * 4);
    let aindex = 0;
    for (let i = 0; i < options.length; ++i) {
        const option = options[i];
        if (typeof (option) !== "string")
            throw new Error("Expected runtimeOptions to be an array of strings");
        Module.setValue(argv + (aindex * 4), wrapped_c_functions.mono_wasm_strdup(option), "i32");
        aindex += 1;
    }
    wrapped_c_functions.mono_wasm_parse_runtime_options(options.length, argv);
}
async function instantiate_wasm_module(imports, successCallback) {
    // this is called so early that even Module exports like addRunDependency don't exist yet
    try {
        await loaderHelpers.afterConfigLoaded;
        if (loaderHelpers.diagnosticTracing) mono_log_debug("instantiate_wasm_module"); // inlined mono_log_debug condition
        await runtimeHelpers.beforePreInit.promise;
        Module.addRunDependency("instantiate_wasm_module");
        await ensureUsedWasmFeatures();
        replace_linker_placeholders(imports);
        const compiledModule = await loaderHelpers.wasmCompilePromise.promise;
        const compiledInstance = await WebAssembly.instantiate(compiledModule, imports);
        successCallback(compiledInstance, compiledModule);
        if (loaderHelpers.diagnosticTracing) mono_log_debug("instantiate_wasm_module done"); // inlined mono_log_debug condition
        runtimeHelpers.afterInstantiateWasm.promise_control.resolve();
    }
    catch (err) {
        mono_log_error("instantiate_wasm_module() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
    Module.removeRunDependency("instantiate_wasm_module");
}
async function ensureUsedWasmFeatures() {
    runtimeHelpers.featureWasmSimd = await loaderHelpers.simd();
    runtimeHelpers.featureWasmEh = await loaderHelpers.exceptions();
    if (runtimeHelpers.emscriptenBuildOptions.wasmEnableSIMD) {
        if (!(runtimeHelpers.featureWasmSimd)) mono_assert(false, "This browser/engine doesn't support WASM SIMD. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"); // inlined mono_assert condition
    }
    if (runtimeHelpers.emscriptenBuildOptions.wasmEnableEH) {
        if (!(runtimeHelpers.featureWasmEh)) mono_assert(false, "This browser/engine doesn't support WASM exception handling. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"); // inlined mono_assert condition
    }
}
async function start_runtime() {
    try {
        const mark = startMeasure();
        const environmentVariables = runtimeHelpers.config.environmentVariables || {};
        if (loaderHelpers.diagnosticTracing) mono_log_debug("Initializing mono runtime"); // inlined mono_log_debug condition
        for (const k in environmentVariables) {
            const v = environmentVariables[k];
            if (typeof (v) === "string")
                mono_wasm_setenv(k, v);
            else
                throw new Error(`Expected environment variable '${k}' to be a string but it was ${typeof v}: '${v}'`);
        }
        if (runtimeHelpers.config.runtimeOptions)
            mono_wasm_set_runtime_options(runtimeHelpers.config.runtimeOptions);
        if (runtimeHelpers.emscriptenBuildOptions.enablePerfTracing) {
            const diagnosticPorts = "DOTNET_DiagnosticPorts";
            // connect JS client by default
            const jsReady = "js://ready";
            if (!environmentVariables[diagnosticPorts]) {
                environmentVariables[diagnosticPorts] = jsReady;
                mono_wasm_setenv(diagnosticPorts, jsReady);
            }
        }
        else if (runtimeHelpers.emscriptenBuildOptions.enableAotProfiler) {
            mono_wasm_init_aot_profiler(runtimeHelpers.config.aotProfilerOptions || {});
        }
        else if (runtimeHelpers.emscriptenBuildOptions.enableBrowserProfiler) {
            mono_wasm_init_browser_profiler(runtimeHelpers.config.browserProfilerOptions || {});
        }
        else if (runtimeHelpers.emscriptenBuildOptions.enableLogProfiler) {
            mono_wasm_init_log_profiler(runtimeHelpers.config.logProfilerOptions || {});
        }
        mono_wasm_load_runtime();
        jiterpreter_allocate_tables();
        bindings_init();
        runtimeHelpers.runtimeReady = true;
        if (WasmEnableThreads) {
            monoThreadInfo.isAttached = true;
            monoThreadInfo.isRunning = true;
            monoThreadInfo.isRegistered = true;
            runtimeHelpers.currentThreadTID = monoThreadInfo.pthreadId = runtimeHelpers.managedThreadTID = mono_wasm_pthread_ptr();
            update_thread_info();
            runtimeHelpers.isManagedRunningOnCurrentThread = true;
        }
        // get GCHandle of the ctx
        runtimeHelpers.afterMonoStarted.promise_control.resolve();
        if (runtimeHelpers.config.interpreterPgo) {
            await interp_pgo_load_data();
        }
        endMeasure(mark, "mono.startRuntime" /* MeasuredBlock.startRuntime */);
    }
    catch (err) {
        mono_log_error("start_runtime() failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
async function maybeSaveInterpPgoTable() {
    // If the application exited abnormally, don't save the table. It probably doesn't contain useful data,
    //  and saving would overwrite any existing table from a previous successful run.
    // We treat exiting with a code of 0 as equivalent to if the app is still running - it's perfectly fine
    //  to save the table once main has returned, since the table can still make future runs faster.
    if ((loaderHelpers.exitCode !== undefined) && (loaderHelpers.exitCode !== 0))
        return;
    await interp_pgo_save_data();
}
function mono_wasm_load_runtime() {
    if (loaderHelpers.diagnosticTracing) mono_log_debug("mono_wasm_load_runtime"); // inlined mono_log_debug condition
    try {
        const mark = startMeasure();
        let debugLevel = runtimeHelpers.config.debugLevel;
        if (debugLevel == undefined) {
            debugLevel = 0;
            if (runtimeHelpers.config.debugLevel) {
                debugLevel = 0 + debugLevel;
            }
        }
        if (!loaderHelpers.isDebuggingSupported() || !runtimeHelpers.config.resources.pdb) {
            debugLevel = 0;
        }
        wrapped_c_functions.mono_wasm_load_runtime(debugLevel);
        endMeasure(mark, "mono.loadRuntime" /* MeasuredBlock.loadRuntime */);
    }
    catch (err) {
        mono_log_error("mono_wasm_load_runtime () failed", err);
        loaderHelpers.mono_exit(1, err);
        throw err;
    }
}
function bindings_init() {
    if (runtimeHelpers.mono_wasm_bindings_is_ready) {
        return;
    }
    if (loaderHelpers.diagnosticTracing) mono_log_debug("bindings_init"); // inlined mono_log_debug condition
    runtimeHelpers.mono_wasm_bindings_is_ready = true;
    try {
        const mark = startMeasure();
        strings_init();
        init_managed_exports();
        initialize_marshalers_to_js();
        initialize_marshalers_to_cs();
        runtimeHelpers._i52_error_scratch_buffer = malloc(4);
        endMeasure(mark, "mono.bindingsInit" /* MeasuredBlock.bindingsInit */);
    }
    catch (err) {
        mono_log_error("Error in bindings_init", err);
        throw err;
    }
}
function mono_wasm_asm_loaded(assembly_name, assembly_ptr, assembly_len, pdb_ptr, pdb_len) {
    // Only trigger this codepath for assemblies loaded after app is ready
    if (runtimeHelpers.mono_wasm_runtime_is_ready !== true)
        return;
    const heapU8 = localHeapViewU8();
    const assembly_name_str = assembly_name !== CharPtrNull ? utf8ToString(assembly_name).concat(".dll") : "";
    const assembly_data = new Uint8Array(heapU8.buffer, assembly_ptr, assembly_len);
    const assembly_b64 = toBase64StringImpl(assembly_data);
    let pdb_b64;
    if (pdb_ptr) {
        const pdb_data = new Uint8Array(heapU8.buffer, pdb_ptr, pdb_len);
        pdb_b64 = toBase64StringImpl(pdb_data);
    }
    mono_wasm_raise_debug_event({
        eventName: "AssemblyLoaded",
        assembly_name: assembly_name_str,
        assembly_b64,
        pdb_b64
    });
}
function mono_wasm_set_main_args(name, allRuntimeArguments) {
    const main_argc = allRuntimeArguments.length + 1;
    const main_argv = malloc(main_argc * 4);
    let aindex = 0;
    Module.setValue(main_argv + (aindex * 4), wrapped_c_functions.mono_wasm_strdup(name), "i32");
    aindex += 1;
    for (let i = 0; i < allRuntimeArguments.length; ++i) {
        Module.setValue(main_argv + (aindex * 4), wrapped_c_functions.mono_wasm_strdup(allRuntimeArguments[i]), "i32");
        aindex += 1;
    }
    wrapped_c_functions.mono_wasm_set_main_args(main_argc, main_argv);
}
/// Called when dotnet.worker.js receives an emscripten "load" event from the main thread.
/// This method is comparable to configure_emscripten_startup function
///
/// Notes:
/// 1. Emscripten skips a lot of initialization on the pthread workers, Module may not have everything you expect.
/// 2. Emscripten does not run any event but preInit in the workers.
/// 3. At the point when this executes there is no pthread assigned to the worker yet.
async function configureWorkerStartup(module) {
    if (!WasmEnableThreads)
        return;
    initWorkerThreadEvents();
    currentWorkerThreadEvents.addEventListener(dotnetPthreadCreated, () => {
        // mono_log_debug("pthread created 0x" + ev.pthread_self.pthreadId.toString(16));
    });
    // these are the only events which are called on worker
    module.preInit = [() => preInitWorkerAsync()];
    module.instantiateWasm = instantiateWasmWorker;
    await runtimeHelpers.afterPreInit.promise;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
function export_api() {
    const api = {
        runMain: mono_run_main,
        runMainAndExit: mono_run_main_and_exit,
        exit: loaderHelpers.mono_exit,
        setEnvironmentVariable: mono_wasm_setenv,
        getAssemblyExports: mono_wasm_get_assembly_exports,
        setModuleImports: mono_wasm_set_module_imports,
        getConfig: () => {
            return runtimeHelpers.config;
        },
        invokeLibraryInitializers: loaderHelpers.invokeLibraryInitializers,
        setHeapB32: setB32,
        setHeapB8: setB8,
        setHeapU8: setU8,
        setHeapU16: setU16,
        setHeapU32: setU32,
        setHeapI8: setI8,
        setHeapI16: setI16,
        setHeapI32: setI32,
        setHeapI52: setI52,
        setHeapU52: setU52,
        setHeapI64Big: setI64Big,
        setHeapF32: setF32,
        setHeapF64: setF64,
        getHeapB32: getB32,
        getHeapB8: getB8,
        getHeapU8: getU8,
        getHeapU16: getU16,
        getHeapU32: getU32,
        getHeapI8: getI8,
        getHeapI16: getI16,
        getHeapI32: getI32,
        getHeapI52: getI52,
        getHeapU52: getU52,
        getHeapI64Big: getI64Big,
        getHeapF32: getF32,
        getHeapF64: getF64,
        localHeapViewU8: localHeapViewU8,
        localHeapViewU16: localHeapViewU16,
        localHeapViewU32: localHeapViewU32,
        localHeapViewI8: localHeapViewI8,
        localHeapViewI16: localHeapViewI16,
        localHeapViewI32: localHeapViewI32,
        localHeapViewI64Big: localHeapViewI64Big,
        localHeapViewF32: localHeapViewF32,
        localHeapViewF64: localHeapViewF64,
        collectCpuSamples: null,
        collectPerfCounters: null,
        collectGcDump: null,
        connectDSRouter: null,
    };
    return api;
}

// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
let runtimeList;
function initializeExports(globalObjects) {
    const module = Module;
    const globals = globalObjects;
    const globalThisAny = globalThis;
    Object.assign(globals.internal, export_internal());
    const rh = {
        stringify_as_error_with_stack: mono_wasm_stringify_as_error_with_stack,
        instantiate_symbols_asset,
        instantiate_asset,
        jiterpreter_dump_stats,
        forceDisposeProxies,
        utf8ToString,
        mono_background_exec: () => threads_c_functions.mono_background_exec(),
        mono_wasm_ds_exec: () => threads_c_functions.mono_wasm_ds_exec(),
    };
    if (WasmEnableThreads) {
        rh.dumpThreads = mono_wasm_dump_threads;
        rh.mono_wasm_print_thread_dump = () => threads_c_functions.mono_wasm_print_thread_dump();
    }
    Object.assign(runtimeHelpers, rh);
    const API = export_api();
    Object.assign(exportedRuntimeAPI, {
        INTERNAL: globals.internal,
        Module: module,
        runtimeBuildInfo: {
            productVersion: ProductVersion,
            gitHash: runtimeHelpers.gitHash,
            buildConfiguration: BuildConfiguration,
            wasmEnableThreads: WasmEnableThreads,
            wasmEnableSIMD: WasmEnableSIMD,
            wasmEnableExceptionHandling: WasmEnableExceptionHandling,
        },
        ...API,
    });
    // this code makes it possible to find dotnet runtime on a page via global namespace, even when there are multiple runtimes at the same time
    if (!globalThisAny.getDotnetRuntime) {
        globalThisAny.getDotnetRuntime = (runtimeId) => globalThisAny.getDotnetRuntime.__list.getRuntime(runtimeId);
        globalThisAny.getDotnetRuntime.__list = runtimeList = new RuntimeList();
    }
    else {
        runtimeList = globalThisAny.getDotnetRuntime.__list;
    }
    return exportedRuntimeAPI;
}
class RuntimeList {
    constructor() {
        this.list = {};
    }
    registerRuntime(api) {
        if (api.runtimeId === undefined) {
            api.runtimeId = Object.keys(this.list).length;
        }
        this.list[api.runtimeId] = create_weak_ref(api);
        loaderHelpers.config.runtimeId = api.runtimeId;
        return api.runtimeId;
    }
    getRuntime(runtimeId) {
        const wr = this.list[runtimeId];
        return wr ? wr.deref() : undefined;
    }
}

export { configureEmscriptenStartup, configureRuntimeStartup, configureWorkerStartup, initializeExports, initializeReplacements, passEmscriptenInternals, runtimeList, setRuntimeGlobals };
//# sourceMappingURL=dotnet.runtime.js.map
