new EventSource('/esbuild').addEventListener('change', () => location.reload());
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/webgpu-radix-sort/dist/umd/radix-sort-umd.js
  var require_radix_sort_umd = __commonJS({
    "node_modules/webgpu-radix-sort/dist/umd/radix-sort-umd.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.RadixSort = {}));
      })(exports, (function(exports2) {
        "use strict";
        function _arrayLikeToArray(r, a) {
          (null == a || a > r.length) && (a = r.length);
          for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
          return n;
        }
        function _arrayWithoutHoles(r) {
          if (Array.isArray(r)) return _arrayLikeToArray(r);
        }
        function _assertClassBrand(e, t, n) {
          if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
          throw new TypeError("Private element is not present on this object");
        }
        function _checkPrivateRedeclaration(e, t) {
          if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
        }
        function _classCallCheck(a, n) {
          if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
        }
        function _classPrivateMethodInitSpec(e, a) {
          _checkPrivateRedeclaration(e, a), a.add(e);
        }
        function _defineProperties(e, r) {
          for (var t = 0; t < r.length; t++) {
            var o = r[t];
            o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
          }
        }
        function _createClass(e, r, t) {
          return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
            writable: false
          }), e;
        }
        function _defineProperty(e, r, t) {
          return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
            value: t,
            enumerable: true,
            configurable: true,
            writable: true
          }) : e[r] = t, e;
        }
        function _iterableToArray(r) {
          if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
        }
        function _nonIterableSpread() {
          throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }
        function ownKeys(e, r) {
          var t = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            r && (o = o.filter(function(r2) {
              return Object.getOwnPropertyDescriptor(e, r2).enumerable;
            })), t.push.apply(t, o);
          }
          return t;
        }
        function _objectSpread2(e) {
          for (var r = 1; r < arguments.length; r++) {
            var t = null != arguments[r] ? arguments[r] : {};
            r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
              _defineProperty(e, r2, t[r2]);
            }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
              Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
            });
          }
          return e;
        }
        function _toConsumableArray(r) {
          return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
        }
        function _toPrimitive(t, r) {
          if ("object" != typeof t || !t) return t;
          var e = t[Symbol.toPrimitive];
          if (void 0 !== e) {
            var i = e.call(t, r || "default");
            if ("object" != typeof i) return i;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === r ? String : Number)(t);
        }
        function _toPropertyKey(t) {
          var i = _toPrimitive(t, "string");
          return "symbol" == typeof i ? i : i + "";
        }
        function _unsupportedIterableToArray(r, a) {
          if (r) {
            if ("string" == typeof r) return _arrayLikeToArray(r, a);
            var t = {}.toString.call(r).slice(8, -1);
            return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
          }
        }
        var prefixSumSource = (
          /* wgsl */
          "\n\n@group(0) @binding(0) var<storage, read_write> items: array<u32>;\n@group(0) @binding(1) var<storage, read_write> blockSums: array<u32>;\n\noverride WORKGROUP_SIZE_X: u32;\noverride WORKGROUP_SIZE_Y: u32;\noverride THREADS_PER_WORKGROUP: u32;\noverride ITEMS_PER_WORKGROUP: u32;\noverride ELEMENT_COUNT: u32;\n\nvar<workgroup> temp: array<u32, ITEMS_PER_WORKGROUP*2>;\n\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn reduce_downsweep(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) {\n    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;\n    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;\n    let GID = WID + TID; // Global thread ID\n    \n    let ELM_TID = TID * 2; // Element pair local ID\n    let ELM_GID = GID * 2; // Element pair global ID\n    \n    // Load input to shared memory\n    temp[ELM_TID]     = select(items[ELM_GID], 0, ELM_GID >= ELEMENT_COUNT);\n    temp[ELM_TID + 1] = select(items[ELM_GID + 1], 0, ELM_GID + 1 >= ELEMENT_COUNT);\n\n    var offset: u32 = 1;\n\n    // Up-sweep (reduce) phase\n    for (var d: u32 = ITEMS_PER_WORKGROUP >> 1; d > 0; d >>= 1) {\n        workgroupBarrier();\n\n        if (TID < d) {\n            var ai: u32 = offset * (ELM_TID + 1) - 1;\n            var bi: u32 = offset * (ELM_TID + 2) - 1;\n            temp[bi] += temp[ai];\n        }\n\n        offset *= 2;\n    }\n\n    // Save workgroup sum and clear last element\n    if (TID == 0) {\n        let last_offset = ITEMS_PER_WORKGROUP - 1;\n\n        blockSums[WORKGROUP_ID] = temp[last_offset];\n        temp[last_offset] = 0;\n    }\n\n    // Down-sweep phase\n    for (var d: u32 = 1; d < ITEMS_PER_WORKGROUP; d *= 2) {\n        offset >>= 1;\n        workgroupBarrier();\n\n        if (TID < d) {\n            var ai: u32 = offset * (ELM_TID + 1) - 1;\n            var bi: u32 = offset * (ELM_TID + 2) - 1;\n\n            let t: u32 = temp[ai];\n            temp[ai] = temp[bi];\n            temp[bi] += t;\n        }\n    }\n    workgroupBarrier();\n\n    // Copy result from shared memory to global memory\n    if (ELM_GID >= ELEMENT_COUNT) {\n        return;\n    }\n    items[ELM_GID] = temp[ELM_TID];\n\n    if (ELM_GID + 1 >= ELEMENT_COUNT) {\n        return;\n    }\n    items[ELM_GID + 1] = temp[ELM_TID + 1];\n}\n\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn add_block_sums(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) {\n    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;\n    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;\n    let GID = WID + TID; // Global thread ID\n\n    let ELM_ID = GID * 2;\n\n    if (ELM_ID >= ELEMENT_COUNT) {\n        return;\n    }\n\n    let blockSum = blockSums[WORKGROUP_ID];\n\n    items[ELM_ID] += blockSum;\n\n    if (ELM_ID + 1 >= ELEMENT_COUNT) {\n        return;\n    }\n\n    items[ELM_ID + 1] += blockSum;\n}"
        );
        var prefixSumNoBankConflictSource = (
          /* wgsl */
          "\n\n@group(0) @binding(0) var<storage, read_write> items: array<u32>;\n@group(0) @binding(1) var<storage, read_write> blockSums: array<u32>;\n\noverride WORKGROUP_SIZE_X: u32;\noverride WORKGROUP_SIZE_Y: u32;\noverride THREADS_PER_WORKGROUP: u32;\noverride ITEMS_PER_WORKGROUP: u32;\noverride ELEMENT_COUNT: u32;\n\nconst NUM_BANKS: u32 = 32;\nconst LOG_NUM_BANKS: u32 = 5;\n\nfn get_offset(offset: u32) -> u32 {\n    // return offset >> LOG_NUM_BANKS; // Conflict-free\n    return (offset >> NUM_BANKS) + (offset >> (2 * LOG_NUM_BANKS)); // Zero bank conflict\n}\n\nvar<workgroup> temp: array<u32, ITEMS_PER_WORKGROUP*2>;\n\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn reduce_downsweep(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) {\n    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;\n    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;\n    let GID = WID + TID; // Global thread ID\n    \n    let ELM_TID = TID * 2; // Element pair local ID\n    let ELM_GID = GID * 2; // Element pair global ID\n    \n    // Load input to shared memory\n    let ai: u32 = TID;\n    let bi: u32 = TID + (ITEMS_PER_WORKGROUP >> 1);\n    let s_ai = ai + get_offset(ai);\n    let s_bi = bi + get_offset(bi);\n    let g_ai = ai + WID * 2;\n    let g_bi = bi + WID * 2;\n    temp[s_ai] = select(items[g_ai], 0, g_ai >= ELEMENT_COUNT);\n    temp[s_bi] = select(items[g_bi], 0, g_bi >= ELEMENT_COUNT);\n\n    var offset: u32 = 1;\n\n    // Up-sweep (reduce) phase\n    for (var d: u32 = ITEMS_PER_WORKGROUP >> 1; d > 0; d >>= 1) {\n        workgroupBarrier();\n\n        if (TID < d) {\n            var ai: u32 = offset * (ELM_TID + 1) - 1;\n            var bi: u32 = offset * (ELM_TID + 2) - 1;\n            ai += get_offset(ai);\n            bi += get_offset(bi);\n            temp[bi] += temp[ai];\n        }\n\n        offset *= 2;\n    }\n\n    // Save workgroup sum and clear last element\n    if (TID == 0) {\n        var last_offset = ITEMS_PER_WORKGROUP - 1;\n        last_offset += get_offset(last_offset);\n\n        blockSums[WORKGROUP_ID] = temp[last_offset];\n        temp[last_offset] = 0;\n    }\n\n    // Down-sweep phase\n    for (var d: u32 = 1; d < ITEMS_PER_WORKGROUP; d *= 2) {\n        offset >>= 1;\n        workgroupBarrier();\n\n        if (TID < d) {\n            var ai: u32 = offset * (ELM_TID + 1) - 1;\n            var bi: u32 = offset * (ELM_TID + 2) - 1;\n            ai += get_offset(ai);\n            bi += get_offset(bi);\n\n            let t: u32 = temp[ai];\n            temp[ai] = temp[bi];\n            temp[bi] += t;\n        }\n    }\n    workgroupBarrier();\n\n    // Copy result from shared memory to global memory\n    if (g_ai < ELEMENT_COUNT) {\n        items[g_ai] = temp[s_ai];\n    }\n    if (g_bi < ELEMENT_COUNT) {\n        items[g_bi] = temp[s_bi];\n    }\n}\n\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn add_block_sums(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) {\n    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;\n    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;\n    let GID = WID + TID; // Global thread ID\n\n    let ELM_ID = GID * 2;\n\n    if (ELM_ID >= ELEMENT_COUNT) {\n        return;\n    }\n\n    let blockSum = blockSums[WORKGROUP_ID];\n\n    items[ELM_ID] += blockSum;\n\n    if (ELM_ID + 1 >= ELEMENT_COUNT) {\n        return;\n    }\n\n    items[ELM_ID + 1] += blockSum;\n}"
        );
        function find_optimal_dispatch_size(device, workgroup_count) {
          var dispatchSize = {
            x: workgroup_count,
            y: 1
          };
          if (workgroup_count > device.limits.maxComputeWorkgroupsPerDimension) {
            var x = Math.floor(Math.sqrt(workgroup_count));
            var y = Math.ceil(workgroup_count / x);
            dispatchSize.x = x;
            dispatchSize.y = y;
          }
          return dispatchSize;
        }
        function create_buffer_from_data(_ref) {
          var device = _ref.device, label = _ref.label, data = _ref.data, _ref$usage = _ref.usage, usage = _ref$usage === void 0 ? 0 : _ref$usage;
          var dispatchSizes = device.createBuffer({
            label,
            usage,
            size: data.length * 4,
            mappedAtCreation: true
          });
          var dispatchData = new Uint32Array(dispatchSizes.getMappedRange());
          dispatchData.set(data);
          dispatchSizes.unmap();
          return dispatchSizes;
        }
        var PrefixSumKernel = /* @__PURE__ */ (function() {
          function PrefixSumKernel2(_ref) {
            var device = _ref.device, data = _ref.data, count = _ref.count, _ref$workgroup_size = _ref.workgroup_size, workgroup_size = _ref$workgroup_size === void 0 ? {
              x: 16,
              y: 16
            } : _ref$workgroup_size, _ref$avoid_bank_confl = _ref.avoid_bank_conflicts, avoid_bank_conflicts = _ref$avoid_bank_confl === void 0 ? false : _ref$avoid_bank_confl;
            _classCallCheck(this, PrefixSumKernel2);
            this.device = device;
            this.workgroup_size = workgroup_size;
            this.threads_per_workgroup = workgroup_size.x * workgroup_size.y;
            this.items_per_workgroup = 2 * this.threads_per_workgroup;
            if (Math.log2(this.threads_per_workgroup) % 1 !== 0) throw new Error("workgroup_size.x * workgroup_size.y must be a power of two. (current: ".concat(this.threads_per_workgroup, ")"));
            this.pipelines = [];
            this.shaderModule = this.device.createShaderModule({
              label: "prefix-sum",
              code: avoid_bank_conflicts ? prefixSumNoBankConflictSource : prefixSumSource
            });
            this.create_pass_recursive(data, count);
          }
          return _createClass(PrefixSumKernel2, [{
            key: "create_pass_recursive",
            value: function create_pass_recursive(data, count) {
              var workgroup_count = Math.ceil(count / this.items_per_workgroup);
              var dispatchSize = find_optimal_dispatch_size(this.device, workgroup_count);
              var blockSumBuffer = this.device.createBuffer({
                label: "prefix-sum-block-sum",
                size: workgroup_count * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
              });
              var bindGroupLayout = this.device.createBindGroupLayout({
                entries: [{
                  binding: 0,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }, {
                  binding: 1,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }]
              });
              var bindGroup = this.device.createBindGroup({
                label: "prefix-sum-bind-group",
                layout: bindGroupLayout,
                entries: [{
                  binding: 0,
                  resource: {
                    buffer: data
                  }
                }, {
                  binding: 1,
                  resource: {
                    buffer: blockSumBuffer
                  }
                }]
              });
              var pipelineLayout = this.device.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout]
              });
              var scanPipeline = this.device.createComputePipeline({
                label: "prefix-sum-scan-pipeline",
                layout: pipelineLayout,
                compute: {
                  module: this.shaderModule,
                  entryPoint: "reduce_downsweep",
                  constants: {
                    "WORKGROUP_SIZE_X": this.workgroup_size.x,
                    "WORKGROUP_SIZE_Y": this.workgroup_size.y,
                    "THREADS_PER_WORKGROUP": this.threads_per_workgroup,
                    "ITEMS_PER_WORKGROUP": this.items_per_workgroup,
                    "ELEMENT_COUNT": count
                  }
                }
              });
              this.pipelines.push({
                pipeline: scanPipeline,
                bindGroup,
                dispatchSize
              });
              if (workgroup_count > 1) {
                this.create_pass_recursive(blockSumBuffer, workgroup_count);
                var blockSumPipeline = this.device.createComputePipeline({
                  label: "prefix-sum-add-block-pipeline",
                  layout: pipelineLayout,
                  compute: {
                    module: this.shaderModule,
                    entryPoint: "add_block_sums",
                    constants: {
                      "WORKGROUP_SIZE_X": this.workgroup_size.x,
                      "WORKGROUP_SIZE_Y": this.workgroup_size.y,
                      "THREADS_PER_WORKGROUP": this.threads_per_workgroup,
                      "ELEMENT_COUNT": count
                    }
                  }
                });
                this.pipelines.push({
                  pipeline: blockSumPipeline,
                  bindGroup,
                  dispatchSize
                });
              }
            }
          }, {
            key: "get_dispatch_chain",
            value: function get_dispatch_chain() {
              return this.pipelines.flatMap(function(p) {
                return [p.dispatchSize.x, p.dispatchSize.y, 1];
              });
            }
            /**
             * Encode the prefix sum pipeline into the current pass.
             * If dispatchSizeBuffer is provided, the dispatch will be indirect (dispatchWorkgroupsIndirect)
             * 
             * @param {GPUComputePassEncoder} pass 
             * @param {GPUBuffer} dispatchSizeBuffer - (optional) Indirect dispatch buffer
             * @param {int} offset - (optional) Offset in bytes in the dispatch buffer. Default: 0
             */
          }, {
            key: "dispatch",
            value: function dispatch(pass, dispatchSizeBuffer) {
              var offset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
              for (var i = 0; i < this.pipelines.length; i++) {
                var _this$pipelines$i = this.pipelines[i], pipeline = _this$pipelines$i.pipeline, bindGroup = _this$pipelines$i.bindGroup, dispatchSize = _this$pipelines$i.dispatchSize;
                pass.setPipeline(pipeline);
                pass.setBindGroup(0, bindGroup);
                if (dispatchSizeBuffer == null) pass.dispatchWorkgroups(dispatchSize.x, dispatchSize.y, 1);
                else pass.dispatchWorkgroupsIndirect(dispatchSizeBuffer, offset + i * 3 * 4);
              }
            }
          }]);
        })();
        var radixSortSource = (
          /* wgsl */
          "\n\n@group(0) @binding(0) var<storage, read> input: array<u32>;\n@group(0) @binding(1) var<storage, read_write> local_prefix_sums: array<u32>;\n@group(0) @binding(2) var<storage, read_write> block_sums: array<u32>;\n\noverride WORKGROUP_COUNT: u32;\noverride THREADS_PER_WORKGROUP: u32;\noverride WORKGROUP_SIZE_X: u32;\noverride WORKGROUP_SIZE_Y: u32;\noverride CURRENT_BIT: u32;\noverride ELEMENT_COUNT: u32;\n\nvar<workgroup> s_prefix_sum: array<u32, 2 * (THREADS_PER_WORKGROUP + 1)>;\n\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn radix_sort(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) {\n    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;\n    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;\n    let GID = WID + TID; // Global thread ID\n\n    // Extract 2 bits from the input\n    let elm = select(input[GID], 0, GID >= ELEMENT_COUNT);\n    let extract_bits: u32 = (elm >> CURRENT_BIT) & 0x3;\n\n    var bit_prefix_sums = array<u32, 4>(0, 0, 0, 0);\n\n    // If the workgroup is inactive, prevent block_sums buffer update\n    var LAST_THREAD: u32 = 0xffffffff; \n\n    if (WORKGROUP_ID < WORKGROUP_COUNT) {\n        // Otherwise store the index of the last active thread in the workgroup\n        LAST_THREAD = min(THREADS_PER_WORKGROUP, ELEMENT_COUNT - WID) - 1;\n    }\n\n    // Initialize parameters for double-buffering\n    let TPW = THREADS_PER_WORKGROUP + 1;\n    var swapOffset: u32 = 0;\n    var inOffset:  u32 = TID;\n    var outOffset: u32 = TID + TPW;\n\n    // 4-way prefix sum\n    for (var b: u32 = 0; b < 4; b++) {\n        // Initialize local prefix with bitmask\n        let bitmask = select(0u, 1u, extract_bits == b);\n        s_prefix_sum[inOffset + 1] = bitmask;\n        workgroupBarrier();\n\n        var prefix_sum: u32 = 0;\n\n        // Prefix sum\n        for (var offset: u32 = 1; offset < THREADS_PER_WORKGROUP; offset *= 2) {\n            if (TID >= offset) {\n                prefix_sum = s_prefix_sum[inOffset] + s_prefix_sum[inOffset - offset];\n            } else {\n                prefix_sum = s_prefix_sum[inOffset];\n            }\n\n            s_prefix_sum[outOffset] = prefix_sum;\n            \n            // Swap buffers\n            outOffset = inOffset;\n            swapOffset = TPW - swapOffset;\n            inOffset = TID + swapOffset;\n            \n            workgroupBarrier();\n        }\n\n        // Store prefix sum for current bit\n        bit_prefix_sums[b] = prefix_sum;\n\n        if (TID == LAST_THREAD) {\n            // Store block sum to global memory\n            let total_sum: u32 = prefix_sum + bitmask;\n            block_sums[b * WORKGROUP_COUNT + WORKGROUP_ID] = total_sum;\n        }\n\n        // Swap buffers\n        outOffset = inOffset;\n        swapOffset = TPW - swapOffset;\n        inOffset = TID + swapOffset;\n    }\n\n    if (GID < ELEMENT_COUNT) {\n        // Store local prefix sum to global memory\n        local_prefix_sums[GID] = bit_prefix_sums[extract_bits];\n    }\n}"
        );
        var radixSortCoalescedSource = (
          /* wgsl */
          "\n\n@group(0) @binding(0) var<storage, read_write> input: array<u32>;\n@group(0) @binding(1) var<storage, read_write> local_prefix_sums: array<u32>;\n@group(0) @binding(2) var<storage, read_write> block_sums: array<u32>;\n@group(0) @binding(3) var<storage, read_write> values: array<u32>;\n\noverride WORKGROUP_COUNT: u32;\noverride THREADS_PER_WORKGROUP: u32;\noverride WORKGROUP_SIZE_X: u32;\noverride WORKGROUP_SIZE_Y: u32;\noverride CURRENT_BIT: u32;\noverride ELEMENT_COUNT: u32;\n\nvar<workgroup> s_prefix_sum: array<u32, 2 * (THREADS_PER_WORKGROUP + 1)>;\nvar<workgroup> s_prefix_sum_scan: array<u32, 4>;\n\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn radix_sort(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) {\n    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;\n    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;\n    let GID = WID + TID; // Global thread ID\n\n    // Extract 2 bits from the input\n    var elm: u32 = 0;\n    var val: u32 = 0;\n    if (GID < ELEMENT_COUNT) {\n        elm = input[GID];\n        val = values[GID];\n    }\n    let extract_bits: u32 = (elm >> CURRENT_BIT) & 0x3;\n\n    var bit_prefix_sums = array<u32, 4>(0, 0, 0, 0);\n\n    // If the workgroup is inactive, prevent block_sums buffer update\n    var LAST_THREAD: u32 = 0xffffffff; \n\n    if (WORKGROUP_ID < WORKGROUP_COUNT) {\n        // Otherwise store the index of the last active thread in the workgroup\n        LAST_THREAD = min(THREADS_PER_WORKGROUP, ELEMENT_COUNT - WID) - 1;\n    }\n\n    // Initialize parameters for double-buffering\n    let TPW = THREADS_PER_WORKGROUP + 1;\n    var swapOffset: u32 = 0;\n    var inOffset:  u32 = TID;\n    var outOffset: u32 = TID + TPW;\n\n    // 4-way prefix sum\n    for (var b: u32 = 0; b < 4; b++) {\n        // Initialize local prefix with bitmask\n        let bitmask = select(0u, 1u, extract_bits == b);\n        s_prefix_sum[inOffset + 1] = bitmask;\n        workgroupBarrier();\n\n        var prefix_sum: u32 = 0;\n\n        // Prefix sum\n        for (var offset: u32 = 1; offset < THREADS_PER_WORKGROUP; offset *= 2) {\n            if (TID >= offset) {\n                prefix_sum = s_prefix_sum[inOffset] + s_prefix_sum[inOffset - offset];\n            } else {\n                prefix_sum = s_prefix_sum[inOffset];\n            }\n\n            s_prefix_sum[outOffset] = prefix_sum;\n\n            // Swap buffers\n            outOffset = inOffset;\n            swapOffset = TPW - swapOffset;\n            inOffset = TID + swapOffset;\n            \n            workgroupBarrier();\n        }\n\n        // Store prefix sum for current bit\n        bit_prefix_sums[b] = prefix_sum;\n\n        if (TID == LAST_THREAD) {\n            // Store block sum to global memory\n            let total_sum: u32 = prefix_sum + bitmask;\n            block_sums[b * WORKGROUP_COUNT + WORKGROUP_ID] = total_sum;\n        }\n\n        // Swap buffers\n        outOffset = inOffset;\n        swapOffset = TPW - swapOffset;\n        inOffset = TID + swapOffset;\n    }\n\n    let prefix_sum = bit_prefix_sums[extract_bits];   \n\n    // Scan bit prefix sums\n    if (TID == LAST_THREAD) {\n        var sum: u32 = 0;\n        bit_prefix_sums[extract_bits] += 1;\n        for (var i: u32 = 0; i < 4; i++) {\n            s_prefix_sum_scan[i] = sum;\n            sum += bit_prefix_sums[i];\n        }\n    }\n    workgroupBarrier();\n\n    if (GID < ELEMENT_COUNT) {\n        // Compute new position\n        let new_pos: u32 = prefix_sum + s_prefix_sum_scan[extract_bits];\n\n        // Shuffle elements locally\n        input[WID + new_pos] = elm;\n        values[WID + new_pos] = val;\n        local_prefix_sums[WID + new_pos] = prefix_sum;\n    }\n}"
        );
        var radixSortReorderSource = (
          /* wgsl */
          "\n\n@group(0) @binding(0) var<storage, read> inputKeys: array<u32>;\n@group(0) @binding(1) var<storage, read_write> outputKeys: array<u32>;\n@group(0) @binding(2) var<storage, read> local_prefix_sum: array<u32>;\n@group(0) @binding(3) var<storage, read> prefix_block_sum: array<u32>;\n@group(0) @binding(4) var<storage, read> inputValues: array<u32>;\n@group(0) @binding(5) var<storage, read_write> outputValues: array<u32>;\n\noverride WORKGROUP_COUNT: u32;\noverride THREADS_PER_WORKGROUP: u32;\noverride WORKGROUP_SIZE_X: u32;\noverride WORKGROUP_SIZE_Y: u32;\noverride CURRENT_BIT: u32;\noverride ELEMENT_COUNT: u32;\n\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn radix_sort_reorder(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) { \n    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;\n    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;\n    let GID = WID + TID; // Global thread ID\n\n    if (GID >= ELEMENT_COUNT) {\n        return;\n    }\n\n    let k = inputKeys[GID];\n    let v = inputValues[GID];\n\n    let local_prefix = local_prefix_sum[GID];\n\n    // Calculate new position\n    let extract_bits = (k >> CURRENT_BIT) & 0x3;\n    let pid = extract_bits * WORKGROUP_COUNT + WORKGROUP_ID;\n    let sorted_position = prefix_block_sum[pid] + local_prefix;\n    \n    outputKeys[sorted_position] = k;\n    outputValues[sorted_position] = v;\n}"
        );
        var checkSortSource = function checkSortSource2() {
          var isFirstPass = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
          var isLastPass = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
          var kernelMode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "full";
          return (
            /* wgsl */
            "\n\n@group(0) @binding(0) var<storage, read> input: array<u32>;\n@group(0) @binding(1) var<storage, read_write> output: array<u32>;\n@group(0) @binding(2) var<storage, read> original: array<u32>;\n@group(0) @binding(3) var<storage, read_write> is_sorted: u32;\n\noverride WORKGROUP_SIZE_X: u32;\noverride WORKGROUP_SIZE_Y: u32;\noverride THREADS_PER_WORKGROUP: u32;\noverride ELEMENT_COUNT: u32;\noverride START_ELEMENT: u32;\n\nvar<workgroup> s_data: array<u32, THREADS_PER_WORKGROUP>;\n\n// Reset dispatch buffer and is_sorted flag\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn reset(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) {\n    if (TID >= ELEMENT_COUNT) {\n        return;\n    }\n\n    if (TID == 0) {\n        is_sorted = 0u;\n    }\n\n    let ELM_ID = TID * 3;\n\n    output[ELM_ID] = original[ELM_ID];\n}\n\n@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)\nfn check_sort(\n    @builtin(workgroup_id) w_id: vec3<u32>,\n    @builtin(num_workgroups) w_dim: vec3<u32>,\n    @builtin(local_invocation_index) TID: u32, // Local thread ID\n) {\n    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;\n    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP + START_ELEMENT;\n    let GID = TID + WID; // Global thread ID\n\n    // Load data into shared memory\n    ".concat(isFirstPass ? first_pass_load_data : "s_data[TID] = select(0u, input[GID], GID < ELEMENT_COUNT);", "\n\n    // Perform parallel reduction\n    for (var d = 1u; d < THREADS_PER_WORKGROUP; d *= 2u) {      \n        workgroupBarrier();  \n        if (TID % (2u * d) == 0u) {\n            s_data[TID] += s_data[TID + d];\n        }\n    }\n    workgroupBarrier();\n\n    // Write reduction result\n    ").concat(isLastPass ? last_pass(kernelMode) : write_reduction_result, "\n}")
          );
        };
        var write_reduction_result = (
          /* wgsl */
          "\n    if (TID == 0) {\n        output[WORKGROUP_ID] = s_data[0];\n    }\n"
        );
        var first_pass_load_data = (
          /* wgsl */
          "\n    let LAST_THREAD = min(THREADS_PER_WORKGROUP, ELEMENT_COUNT - WID) - 1;\n\n    // Load current element into shared memory\n    // Also load next element for comparison\n    let elm = select(0u, input[GID], GID < ELEMENT_COUNT);\n    let next = select(0u, input[GID + 1], GID < ELEMENT_COUNT-1);\n    s_data[TID] = elm;\n    workgroupBarrier();\n\n    s_data[TID] = select(0u, 1u, GID < ELEMENT_COUNT-1 && elm > next);\n"
        );
        var last_pass = function last_pass2(kernelMode) {
          return (
            /* wgsl */
            "\n    let fullDispatchLength = arrayLength(&output);\n    let dispatchIndex = TID * 3;\n\n    if (dispatchIndex >= fullDispatchLength) {\n        return;\n    }\n\n    ".concat(kernelMode == "full" ? last_pass_full : last_pass_fast, "\n")
          );
        };
        var last_pass_fast = (
          /* wgsl */
          "\n    output[dispatchIndex] = select(0, original[dispatchIndex], s_data[0] == 0 && is_sorted == 0u);\n"
        );
        var last_pass_full = (
          /* wgsl */
          "\n    if (TID == 0 && s_data[0] == 0) {\n        is_sorted = 1u;\n    }\n\n    output[dispatchIndex] = select(0, original[dispatchIndex], s_data[0] != 0);\n"
        );
        var CheckSortKernel = /* @__PURE__ */ (function() {
          function CheckSortKernel2(_ref) {
            var device = _ref.device, data = _ref.data, result = _ref.result, original = _ref.original, is_sorted = _ref.is_sorted, count = _ref.count, _ref$start = _ref.start, start = _ref$start === void 0 ? 0 : _ref$start, _ref$mode = _ref.mode, mode = _ref$mode === void 0 ? "full" : _ref$mode, _ref$workgroup_size = _ref.workgroup_size, workgroup_size = _ref$workgroup_size === void 0 ? {
              x: 16,
              y: 16
            } : _ref$workgroup_size;
            _classCallCheck(this, CheckSortKernel2);
            this.device = device;
            this.count = count;
            this.start = start;
            this.mode = mode;
            this.workgroup_size = workgroup_size;
            this.threads_per_workgroup = workgroup_size.x * workgroup_size.y;
            this.pipelines = [];
            this.buffers = {
              data,
              result,
              original,
              is_sorted,
              outputs: []
            };
            this.create_passes_recursive(data, count);
          }
          return _createClass(CheckSortKernel2, [{
            key: "create_passes_recursive",
            value: function create_passes_recursive(buffer, count) {
              var passIndex = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
              var workgroup_count = Math.ceil(count / this.threads_per_workgroup);
              var isFirstPass = passIndex === 0;
              var isLastPass = workgroup_count <= 1;
              var label = "check-sort-".concat(this.mode, "-").concat(passIndex);
              var outputBuffer = isLastPass ? this.buffers.result : this.device.createBuffer({
                label,
                size: workgroup_count * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
              });
              var bindGroupLayout = this.device.createBindGroupLayout({
                entries: [{
                  binding: 0,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "read-only-storage"
                  }
                }, {
                  binding: 1,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }].concat(_toConsumableArray(isLastPass ? [{
                  binding: 2,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "read-only-storage"
                  }
                }, {
                  binding: 3,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }] : []))
              });
              var bindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: [{
                  binding: 0,
                  resource: {
                    buffer
                  }
                }, {
                  binding: 1,
                  resource: {
                    buffer: outputBuffer
                  }
                }].concat(_toConsumableArray(isLastPass ? [{
                  binding: 2,
                  resource: {
                    buffer: this.buffers.original
                  }
                }, {
                  binding: 3,
                  resource: {
                    buffer: this.buffers.is_sorted
                  }
                }] : []))
              });
              var pipelineLayout = this.device.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout]
              });
              var element_count = isFirstPass ? this.start + count : count;
              var start_element = isFirstPass ? this.start : 0;
              var checkSortPipeline = this.device.createComputePipeline({
                layout: pipelineLayout,
                compute: {
                  module: this.device.createShaderModule({
                    label,
                    code: checkSortSource(isFirstPass, isLastPass, this.mode)
                  }),
                  entryPoint: this.mode == "reset" ? "reset" : "check_sort",
                  constants: _objectSpread2({
                    "ELEMENT_COUNT": element_count,
                    "WORKGROUP_SIZE_X": this.workgroup_size.x,
                    "WORKGROUP_SIZE_Y": this.workgroup_size.y
                  }, this.mode != "reset" && {
                    "THREADS_PER_WORKGROUP": this.threads_per_workgroup,
                    "START_ELEMENT": start_element
                  })
                }
              });
              this.buffers.outputs.push(outputBuffer);
              this.pipelines.push({
                pipeline: checkSortPipeline,
                bindGroup
              });
              if (!isLastPass) {
                this.create_passes_recursive(outputBuffer, workgroup_count, passIndex + 1);
              }
            }
          }, {
            key: "dispatch",
            value: function dispatch(pass, dispatchSize) {
              var offset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
              for (var i = 0; i < this.pipelines.length; i++) {
                var _this$pipelines$i = this.pipelines[i], pipeline = _this$pipelines$i.pipeline, bindGroup = _this$pipelines$i.bindGroup;
                var dispatchIndirect = this.mode != "reset" && (this.mode == "full" || i < this.pipelines.length - 1);
                pass.setPipeline(pipeline);
                pass.setBindGroup(0, bindGroup);
                if (dispatchIndirect) pass.dispatchWorkgroupsIndirect(dispatchSize, offset + i * 3 * 4);
                else
                  pass.dispatchWorkgroups(1, 1, 1);
              }
            }
          }], [{
            key: "find_optimal_dispatch_chain",
            value: function find_optimal_dispatch_chain(device, item_count, workgroup_size) {
              var threads_per_workgroup = workgroup_size.x * workgroup_size.y;
              var sizes = [];
              do {
                var target_workgroup_count = Math.ceil(item_count / threads_per_workgroup);
                var dispatchSize = find_optimal_dispatch_size(device, target_workgroup_count);
                sizes.push(dispatchSize.x, dispatchSize.y, 1);
                item_count = target_workgroup_count;
              } while (item_count > 1);
              return sizes;
            }
          }]);
        })();
        var _RadixSortKernel_brand = /* @__PURE__ */ new WeakSet();
        var RadixSortKernel2 = /* @__PURE__ */ (function() {
          function RadixSortKernel3() {
            var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, device = _ref.device, keys = _ref.keys, values = _ref.values, count = _ref.count, _ref$bit_count = _ref.bit_count, bit_count = _ref$bit_count === void 0 ? 32 : _ref$bit_count, _ref$workgroup_size = _ref.workgroup_size, workgroup_size = _ref$workgroup_size === void 0 ? {
              x: 16,
              y: 16
            } : _ref$workgroup_size, _ref$check_order = _ref.check_order, check_order = _ref$check_order === void 0 ? false : _ref$check_order, _ref$local_shuffle = _ref.local_shuffle, local_shuffle = _ref$local_shuffle === void 0 ? false : _ref$local_shuffle, _ref$avoid_bank_confl = _ref.avoid_bank_conflicts, avoid_bank_conflicts = _ref$avoid_bank_confl === void 0 ? false : _ref$avoid_bank_confl;
            _classCallCheck(this, RadixSortKernel3);
            _classPrivateMethodInitSpec(this, _RadixSortKernel_brand);
            if (device == null) throw new Error("No device provided");
            if (keys == null) throw new Error("No keys buffer provided");
            if (!Number.isInteger(count) || count <= 0) throw new Error("Invalid count parameter");
            if (!Number.isInteger(bit_count) || bit_count <= 0 || bit_count > 32) throw new Error("Invalid bit_count parameter: ".concat(bit_count));
            if (!Number.isInteger(workgroup_size.x) || !Number.isInteger(workgroup_size.y)) throw new Error("Invalid workgroup_size parameter");
            if (bit_count % 4 != 0) throw new Error("bit_count must be a multiple of 4");
            this.device = device;
            this.count = count;
            this.bit_count = bit_count;
            this.workgroup_size = workgroup_size;
            this.check_order = check_order;
            this.local_shuffle = local_shuffle;
            this.avoid_bank_conflicts = avoid_bank_conflicts;
            this.threads_per_workgroup = workgroup_size.x * workgroup_size.y;
            this.workgroup_count = Math.ceil(count / this.threads_per_workgroup);
            this.prefix_block_workgroup_count = 4 * this.workgroup_count;
            this.has_values = values != null;
            this.dispatchSize = {};
            this.shaderModules = {};
            this.kernels = {};
            this.pipelines = [];
            this.buffers = {
              // GPUBuffers
              keys,
              values
            };
            this.create_shader_modules();
            this.create_pipelines();
          }
          return _createClass(RadixSortKernel3, [{
            key: "create_shader_modules",
            value: function create_shader_modules() {
              var remove_values = function remove_values2(source) {
                return source.split("\n").filter(function(line) {
                  return !line.toLowerCase().includes("values");
                }).join("\n");
              };
              var blockSumSource = this.local_shuffle ? radixSortCoalescedSource : radixSortSource;
              this.shaderModules = {
                blockSum: this.device.createShaderModule({
                  label: "radix-sort-block-sum",
                  code: this.has_values ? blockSumSource : remove_values(blockSumSource)
                }),
                reorder: this.device.createShaderModule({
                  label: "radix-sort-reorder",
                  code: this.has_values ? radixSortReorderSource : remove_values(radixSortReorderSource)
                })
              };
            }
          }, {
            key: "create_pipelines",
            value: function create_pipelines() {
              this.create_prefix_sum_kernel();
              var dispatchData = this.calculate_dispatch_sizes();
              this.create_buffers(dispatchData);
              this.create_check_sort_kernels(dispatchData);
              for (var bit = 0; bit < this.bit_count; bit += 2) {
                var even = bit % 4 == 0;
                var inKeys = even ? this.buffers.keys : this.buffers.tmpKeys;
                var inValues = even ? this.buffers.values : this.buffers.tmpValues;
                var outKeys = even ? this.buffers.tmpKeys : this.buffers.keys;
                var outValues = even ? this.buffers.tmpValues : this.buffers.values;
                var blockSumPipeline = this.create_block_sum_pipeline(inKeys, inValues, bit);
                var reorderPipeline = this.create_reorder_pipeline(inKeys, inValues, outKeys, outValues, bit);
                this.pipelines.push({
                  blockSumPipeline,
                  reorderPipeline
                });
              }
            }
          }, {
            key: "create_prefix_sum_kernel",
            value: function create_prefix_sum_kernel() {
              var prefixBlockSumBuffer = this.device.createBuffer({
                label: "radix-sort-prefix-block-sum",
                size: this.prefix_block_workgroup_count * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
              });
              var prefixSumKernel = new PrefixSumKernel({
                device: this.device,
                data: prefixBlockSumBuffer,
                count: this.prefix_block_workgroup_count,
                workgroup_size: this.workgroup_size,
                avoid_bank_conflicts: this.avoid_bank_conflicts
              });
              this.kernels.prefixSum = prefixSumKernel;
              this.buffers.prefixBlockSum = prefixBlockSumBuffer;
            }
          }, {
            key: "calculate_dispatch_sizes",
            value: function calculate_dispatch_sizes() {
              var dispatchSize = find_optimal_dispatch_size(this.device, this.workgroup_count);
              var prefixSumDispatchSize = this.kernels.prefixSum.get_dispatch_chain();
              var check_sort_fast_count = Math.min(this.count, this.threads_per_workgroup * 4);
              var check_sort_full_count = this.count - check_sort_fast_count;
              var start_full = check_sort_fast_count - 1;
              var dispatchSizesFast = CheckSortKernel.find_optimal_dispatch_chain(this.device, check_sort_fast_count, this.workgroup_size);
              var dispatchSizesFull = CheckSortKernel.find_optimal_dispatch_chain(this.device, check_sort_full_count, this.workgroup_size);
              var initialDispatch = [dispatchSize.x, dispatchSize.y, 1].concat(_toConsumableArray(dispatchSizesFast.slice(0, 3)), _toConsumableArray(prefixSumDispatchSize));
              this.dispatchOffsets = {
                radix_sort: 0,
                check_sort_fast: 3 * 4,
                prefix_sum: 6 * 4
              };
              this.dispatchSize = dispatchSize;
              this.initialDispatch = initialDispatch;
              return {
                initialDispatch,
                dispatchSizesFull,
                check_sort_fast_count,
                check_sort_full_count,
                start_full
              };
            }
          }, {
            key: "create_buffers",
            value: function create_buffers(dispatchData) {
              var tmpKeysBuffer = this.device.createBuffer({
                label: "radix-sort-tmp-keys",
                size: this.count * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
              });
              var tmpValuesBuffer = !this.has_values ? null : this.device.createBuffer({
                label: "radix-sort-tmp-values",
                size: this.count * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
              });
              var localPrefixSumBuffer = this.device.createBuffer({
                label: "radix-sort-local-prefix-sum",
                size: this.count * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
              });
              this.buffers.tmpKeys = tmpKeysBuffer;
              this.buffers.tmpValues = tmpValuesBuffer;
              this.buffers.localPrefixSum = localPrefixSumBuffer;
              if (!this.check_order) {
                return;
              }
              var dispatchBuffer = create_buffer_from_data({
                device: this.device,
                label: "radix-sort-dispatch-size",
                data: dispatchData.initialDispatch,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.INDIRECT
              });
              var originalDispatchBuffer = create_buffer_from_data({
                device: this.device,
                label: "radix-sort-dispatch-size-original",
                data: dispatchData.initialDispatch,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
              });
              var checkSortFullDispatchBuffer = create_buffer_from_data({
                label: "check-sort-full-dispatch-size",
                device: this.device,
                data: dispatchData.dispatchSizesFull,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.INDIRECT
              });
              var checkSortFullOriginalDispatchBuffer = create_buffer_from_data({
                label: "check-sort-full-dispatch-size-original",
                device: this.device,
                data: dispatchData.dispatchSizesFull,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
              });
              var isSortedBuffer = create_buffer_from_data({
                label: "is-sorted",
                device: this.device,
                data: new Uint32Array([0]),
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
              });
              this.buffers.dispatchSize = dispatchBuffer;
              this.buffers.originalDispatchSize = originalDispatchBuffer;
              this.buffers.checkSortFullDispatchSize = checkSortFullDispatchBuffer;
              this.buffers.originalCheckSortFullDispatchSize = checkSortFullOriginalDispatchBuffer;
              this.buffers.isSorted = isSortedBuffer;
            }
          }, {
            key: "create_check_sort_kernels",
            value: function create_check_sort_kernels(checkSortPartitionData) {
              if (!this.check_order) {
                return;
              }
              var check_sort_fast_count = checkSortPartitionData.check_sort_fast_count, check_sort_full_count = checkSortPartitionData.check_sort_full_count, start_full = checkSortPartitionData.start_full;
              var checkSortFull = new CheckSortKernel({
                mode: "full",
                device: this.device,
                data: this.buffers.keys,
                result: this.buffers.dispatchSize,
                original: this.buffers.originalDispatchSize,
                is_sorted: this.buffers.isSorted,
                count: check_sort_full_count,
                start: start_full,
                workgroup_size: this.workgroup_size
              });
              var checkSortFast = new CheckSortKernel({
                mode: "fast",
                device: this.device,
                data: this.buffers.keys,
                result: this.buffers.checkSortFullDispatchSize,
                original: this.buffers.originalCheckSortFullDispatchSize,
                is_sorted: this.buffers.isSorted,
                count: check_sort_fast_count,
                workgroup_size: this.workgroup_size
              });
              var initialDispatchElementCount = this.initialDispatch.length / 3;
              if (checkSortFast.threads_per_workgroup < checkSortFull.pipelines.length || checkSortFull.threads_per_workgroup < initialDispatchElementCount) {
                console.warn("Warning: workgroup size is too small to enable check sort optimization, disabling...");
                this.check_order = false;
                return;
              }
              var checkSortReset = new CheckSortKernel({
                mode: "reset",
                device: this.device,
                data: this.buffers.keys,
                original: this.buffers.originalDispatchSize,
                result: this.buffers.dispatchSize,
                is_sorted: this.buffers.isSorted,
                count: initialDispatchElementCount,
                workgroup_size: find_optimal_dispatch_size(this.device, initialDispatchElementCount)
              });
              this.kernels.checkSort = {
                reset: checkSortReset,
                fast: checkSortFast,
                full: checkSortFull
              };
            }
          }, {
            key: "create_block_sum_pipeline",
            value: function create_block_sum_pipeline(inKeys, inValues, bit) {
              var bindGroupLayout = this.device.createBindGroupLayout({
                label: "radix-sort-block-sum",
                entries: [{
                  binding: 0,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: this.local_shuffle ? "storage" : "read-only-storage"
                  }
                }, {
                  binding: 1,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }, {
                  binding: 2,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }].concat(_toConsumableArray(this.local_shuffle && this.has_values ? [{
                  binding: 3,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }] : []))
              });
              var bindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: [{
                  binding: 0,
                  resource: {
                    buffer: inKeys
                  }
                }, {
                  binding: 1,
                  resource: {
                    buffer: this.buffers.localPrefixSum
                  }
                }, {
                  binding: 2,
                  resource: {
                    buffer: this.buffers.prefixBlockSum
                  }
                }].concat(_toConsumableArray(this.local_shuffle && this.has_values ? [{
                  binding: 3,
                  resource: {
                    buffer: inValues
                  }
                }] : []))
              });
              var pipelineLayout = this.device.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout]
              });
              var blockSumPipeline = this.device.createComputePipeline({
                label: "radix-sort-block-sum",
                layout: pipelineLayout,
                compute: {
                  module: this.shaderModules.blockSum,
                  entryPoint: "radix_sort",
                  constants: {
                    "WORKGROUP_SIZE_X": this.workgroup_size.x,
                    "WORKGROUP_SIZE_Y": this.workgroup_size.y,
                    "WORKGROUP_COUNT": this.workgroup_count,
                    "THREADS_PER_WORKGROUP": this.threads_per_workgroup,
                    "ELEMENT_COUNT": this.count,
                    "CURRENT_BIT": bit
                  }
                }
              });
              return {
                pipeline: blockSumPipeline,
                bindGroup
              };
            }
          }, {
            key: "create_reorder_pipeline",
            value: function create_reorder_pipeline(inKeys, inValues, outKeys, outValues, bit) {
              var bindGroupLayout = this.device.createBindGroupLayout({
                label: "radix-sort-reorder",
                entries: [{
                  binding: 0,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "read-only-storage"
                  }
                }, {
                  binding: 1,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }, {
                  binding: 2,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "read-only-storage"
                  }
                }, {
                  binding: 3,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "read-only-storage"
                  }
                }].concat(_toConsumableArray(this.has_values ? [{
                  binding: 4,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "read-only-storage"
                  }
                }, {
                  binding: 5,
                  visibility: GPUShaderStage.COMPUTE,
                  buffer: {
                    type: "storage"
                  }
                }] : []))
              });
              var bindGroup = this.device.createBindGroup({
                layout: bindGroupLayout,
                entries: [{
                  binding: 0,
                  resource: {
                    buffer: inKeys
                  }
                }, {
                  binding: 1,
                  resource: {
                    buffer: outKeys
                  }
                }, {
                  binding: 2,
                  resource: {
                    buffer: this.buffers.localPrefixSum
                  }
                }, {
                  binding: 3,
                  resource: {
                    buffer: this.buffers.prefixBlockSum
                  }
                }].concat(_toConsumableArray(this.has_values ? [{
                  binding: 4,
                  resource: {
                    buffer: inValues
                  }
                }, {
                  binding: 5,
                  resource: {
                    buffer: outValues
                  }
                }] : []))
              });
              var pipelineLayout = this.device.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout]
              });
              var reorderPipeline = this.device.createComputePipeline({
                label: "radix-sort-reorder",
                layout: pipelineLayout,
                compute: {
                  module: this.shaderModules.reorder,
                  entryPoint: "radix_sort_reorder",
                  constants: {
                    "WORKGROUP_SIZE_X": this.workgroup_size.x,
                    "WORKGROUP_SIZE_Y": this.workgroup_size.y,
                    "WORKGROUP_COUNT": this.workgroup_count,
                    "THREADS_PER_WORKGROUP": this.threads_per_workgroup,
                    "ELEMENT_COUNT": this.count,
                    "CURRENT_BIT": bit
                  }
                }
              });
              return {
                pipeline: reorderPipeline,
                bindGroup
              };
            }
            /**
             * Encode all pipelines into the current pass
             * 
             * @param {GPUComputePassEncoder} pass 
             */
          }, {
            key: "dispatch",
            value: function dispatch(pass) {
              if (!this.check_order) {
                _assertClassBrand(_RadixSortKernel_brand, this, _dispatchPipelines).call(this, pass);
              } else {
                _assertClassBrand(_RadixSortKernel_brand, this, _dispatchPipelinesIndirect).call(this, pass);
              }
            }
          }]);
        })();
        function _dispatchPipelines(pass) {
          for (var i = 0; i < this.bit_count / 2; i++) {
            var _this$pipelines$i = this.pipelines[i], blockSumPipeline = _this$pipelines$i.blockSumPipeline, reorderPipeline = _this$pipelines$i.reorderPipeline;
            pass.setPipeline(blockSumPipeline.pipeline);
            pass.setBindGroup(0, blockSumPipeline.bindGroup);
            pass.dispatchWorkgroups(this.dispatchSize.x, this.dispatchSize.y, 1);
            this.kernels.prefixSum.dispatch(pass);
            pass.setPipeline(reorderPipeline.pipeline);
            pass.setBindGroup(0, reorderPipeline.bindGroup);
            pass.dispatchWorkgroups(this.dispatchSize.x, this.dispatchSize.y, 1);
          }
        }
        function _dispatchPipelinesIndirect(pass) {
          this.kernels.checkSort.reset.dispatch(pass);
          for (var i = 0; i < this.bit_count / 2; i++) {
            var _this$pipelines$i2 = this.pipelines[i], blockSumPipeline = _this$pipelines$i2.blockSumPipeline, reorderPipeline = _this$pipelines$i2.reorderPipeline;
            if (i % 2 == 0) {
              this.kernels.checkSort.fast.dispatch(pass, this.buffers.dispatchSize, this.dispatchOffsets.check_sort_fast);
              this.kernels.checkSort.full.dispatch(pass, this.buffers.checkSortFullDispatchSize);
            }
            pass.setPipeline(blockSumPipeline.pipeline);
            pass.setBindGroup(0, blockSumPipeline.bindGroup);
            pass.dispatchWorkgroupsIndirect(this.buffers.dispatchSize, this.dispatchOffsets.radix_sort);
            this.kernels.prefixSum.dispatch(pass, this.buffers.dispatchSize, this.dispatchOffsets.prefix_sum);
            pass.setPipeline(reorderPipeline.pipeline);
            pass.setBindGroup(0, reorderPipeline.bindGroup);
            pass.dispatchWorkgroupsIndirect(this.buffers.dispatchSize, this.dispatchOffsets.radix_sort);
          }
        }
        exports2.PrefixSumKernel = PrefixSumKernel;
        exports2.RadixSortKernel = RadixSortKernel2;
      }));
    }
  });

  // src/ts/render/shaders.ts
  var renderShaders = (
    /* wgsl */
    `
struct Uniforms {
  viewProjectionMatrix : mat4x4<f32>,
  backgroundColour: vec4<f32>,
  aspectRatio : f32,
}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) colour : vec4f,
  @location(1) uv : vec2f
}

struct VertexInput {
  @location(0) position : vec3f,
  @location(1) uv : vec2f
}

struct InstanceInput {
  @location(2) position : vec4f,
  @location(3) velocity : vec4f,
  @location(4) normal : vec4f,
  @location(5) dist : f32,
  @location(6) density : f32,
  @location(7) cellIndex: u32,
  @location(8) group: f32
}


@vertex
fn vertex_main(
  vertex: VertexInput,
  instance: InstanceInput
) -> VertexOut {
  var output : VertexOut;
  output.position = uniforms.viewProjectionMatrix * instance.position;

  // SCREEN SPACE SIZE PARTICLES (zoom invariant)
  // const particleSize = 0.003;
  // let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize) * output.position.w;

  // WORLD SPACE SIZE PARTICLES
  const particleSize = 0.5;
  let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize);
  

  output.position += vec4f(vertPos, 0., 0.);

  const baseColor1 = vec4f(0.7, 0.3, 0.8, 1.0);
  const baseColor2 = vec4f(0.3, 0.7, 0.8, 1.0);
  var colour = select(baseColor1, baseColor2, instance.group > 0);

  // // SHADE COLLISIONS
  // const densityRange = 0.1; // density scalar will vary for density values in range [1, 1+densityRange]
  // let densityScalar = saturate((instance.density - 1.1)/densityRange); // 0 for no collisions, 1 for big collision
  // var colour = (1.0-densityScalar) * baseColor1 + densityScalar * baseColor2;

  const lightDir = normalize(vec3<f32>(0.0, 0.2, 1.0));
  var lightIntensity = dot(lightDir, instance.normal.xyz);
  lightIntensity = 0.45*lightIntensity + 0.55;
  colour *= lightIntensity;


  // hide particles when they're coming in
  const startFadeY = 40;
  const endFadeY = 20;

  let fadeFac = saturate((abs(instance.position.y)-startFadeY)/(endFadeY-startFadeY));
  colour = mix(uniforms.backgroundColour, colour, fadeFac);


  output.colour = colour;
  output.uv = vertex.uv;

  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
  // circle (need to switch on alpha blending)
  // const falloff = 5.0;
  // let uvLength = length(fragData.uv - vec2f(0.5, 0.5)) * 2.0;
  // let alpha = clamp(falloff * (1.0 - uvLength), 0.0, 1.0);
  // return vec4f(fragData.colour.rgb * alpha, fragData.colour.a * alpha);

  return fragData.colour;
}

`
  );

  // src/ts/render/square.ts
  var createSquareData = () => {
    const positions = [
      -0.5,
      -0.5,
      0,
      0.5,
      -0.5,
      0,
      -0.5,
      0.5,
      0,
      0.5,
      -0.5,
      0,
      -0.5,
      0.5,
      0,
      0.5,
      0.5,
      0
    ];
    const uvs = [
      0,
      0,
      1,
      0,
      0,
      1,
      1,
      0,
      0,
      1,
      1,
      1
    ];
    const data = new Float32Array(positions.length + uvs.length);
    for (let i = 0; i < 6; i++) {
      data[5 * i + 0] = positions[3 * i + 0];
      data[5 * i + 1] = positions[3 * i + 1];
      data[5 * i + 2] = positions[3 * i + 2];
      data[5 * i + 3] = uvs[2 * i + 0];
      data[5 * i + 4] = uvs[2 * i + 1];
    }
    return data;
  };

  // node_modules/wgpu-matrix/dist/3.x/wgpu-matrix.module.js
  function wrapConstructor(OriginalConstructor, modifier) {
    return class extends OriginalConstructor {
      constructor(...args) {
        super(...args);
        modifier(this);
      }
    };
  }
  var ZeroArray = wrapConstructor(Array, (a) => a.fill(0));
  var EPSILON = 1e-6;
  function getAPIImpl$5(Ctor) {
    function create(x = 0, y = 0) {
      const newDst = new Ctor(2);
      if (x !== void 0) {
        newDst[0] = x;
        if (y !== void 0) {
          newDst[1] = y;
        }
      }
      return newDst;
    }
    const fromValues = create;
    function set(x, y, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = x;
      newDst[1] = y;
      return newDst;
    }
    function ceil(v, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = Math.ceil(v[0]);
      newDst[1] = Math.ceil(v[1]);
      return newDst;
    }
    function floor(v, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = Math.floor(v[0]);
      newDst[1] = Math.floor(v[1]);
      return newDst;
    }
    function round(v, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = Math.round(v[0]);
      newDst[1] = Math.round(v[1]);
      return newDst;
    }
    function clamp(v, min2 = 0, max2 = 1, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = Math.min(max2, Math.max(min2, v[0]));
      newDst[1] = Math.min(max2, Math.max(min2, v[1]));
      return newDst;
    }
    function add(a, b, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = a[0] + b[0];
      newDst[1] = a[1] + b[1];
      return newDst;
    }
    function addScaled(a, b, scale2, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = a[0] + b[0] * scale2;
      newDst[1] = a[1] + b[1] * scale2;
      return newDst;
    }
    function angle(a, b) {
      const ax = a[0];
      const ay = a[1];
      const bx = b[0];
      const by = b[1];
      const mag1 = Math.sqrt(ax * ax + ay * ay);
      const mag2 = Math.sqrt(bx * bx + by * by);
      const mag = mag1 * mag2;
      const cosine = mag && dot(a, b) / mag;
      return Math.acos(cosine);
    }
    function subtract(a, b, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = a[0] - b[0];
      newDst[1] = a[1] - b[1];
      return newDst;
    }
    const sub = subtract;
    function equalsApproximately(a, b) {
      return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
    }
    function equals(a, b) {
      return a[0] === b[0] && a[1] === b[1];
    }
    function lerp(a, b, t, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = a[0] + t * (b[0] - a[0]);
      newDst[1] = a[1] + t * (b[1] - a[1]);
      return newDst;
    }
    function lerpV(a, b, t, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = a[0] + t[0] * (b[0] - a[0]);
      newDst[1] = a[1] + t[1] * (b[1] - a[1]);
      return newDst;
    }
    function max(a, b, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = Math.max(a[0], b[0]);
      newDst[1] = Math.max(a[1], b[1]);
      return newDst;
    }
    function min(a, b, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = Math.min(a[0], b[0]);
      newDst[1] = Math.min(a[1], b[1]);
      return newDst;
    }
    function mulScalar(v, k, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = v[0] * k;
      newDst[1] = v[1] * k;
      return newDst;
    }
    const scale = mulScalar;
    function divScalar(v, k, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = v[0] / k;
      newDst[1] = v[1] / k;
      return newDst;
    }
    function inverse(v, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = 1 / v[0];
      newDst[1] = 1 / v[1];
      return newDst;
    }
    const invert = inverse;
    function cross(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      const z = a[0] * b[1] - a[1] * b[0];
      newDst[0] = 0;
      newDst[1] = 0;
      newDst[2] = z;
      return newDst;
    }
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1];
    }
    function length(v) {
      const v0 = v[0];
      const v1 = v[1];
      return Math.sqrt(v0 * v0 + v1 * v1);
    }
    const len = length;
    function lengthSq(v) {
      const v0 = v[0];
      const v1 = v[1];
      return v0 * v0 + v1 * v1;
    }
    const lenSq = lengthSq;
    function distance(a, b) {
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      return Math.sqrt(dx * dx + dy * dy);
    }
    const dist = distance;
    function distanceSq(a, b) {
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      return dx * dx + dy * dy;
    }
    const distSq = distanceSq;
    function normalize(v, dst) {
      const newDst = dst ?? new Ctor(2);
      const v0 = v[0];
      const v1 = v[1];
      const len2 = Math.sqrt(v0 * v0 + v1 * v1);
      if (len2 > 1e-5) {
        newDst[0] = v0 / len2;
        newDst[1] = v1 / len2;
      } else {
        newDst[0] = 0;
        newDst[1] = 0;
      }
      return newDst;
    }
    function negate(v, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = -v[0];
      newDst[1] = -v[1];
      return newDst;
    }
    function copy(v, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = v[0];
      newDst[1] = v[1];
      return newDst;
    }
    const clone = copy;
    function multiply(a, b, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = a[0] * b[0];
      newDst[1] = a[1] * b[1];
      return newDst;
    }
    const mul = multiply;
    function divide(a, b, dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = a[0] / b[0];
      newDst[1] = a[1] / b[1];
      return newDst;
    }
    const div = divide;
    function random(scale2 = 1, dst) {
      const newDst = dst ?? new Ctor(2);
      const angle2 = Math.random() * 2 * Math.PI;
      newDst[0] = Math.cos(angle2) * scale2;
      newDst[1] = Math.sin(angle2) * scale2;
      return newDst;
    }
    function zero(dst) {
      const newDst = dst ?? new Ctor(2);
      newDst[0] = 0;
      newDst[1] = 0;
      return newDst;
    }
    function transformMat4(v, m, dst) {
      const newDst = dst ?? new Ctor(2);
      const x = v[0];
      const y = v[1];
      newDst[0] = x * m[0] + y * m[4] + m[12];
      newDst[1] = x * m[1] + y * m[5] + m[13];
      return newDst;
    }
    function transformMat3(v, m, dst) {
      const newDst = dst ?? new Ctor(2);
      const x = v[0];
      const y = v[1];
      newDst[0] = m[0] * x + m[4] * y + m[8];
      newDst[1] = m[1] * x + m[5] * y + m[9];
      return newDst;
    }
    function rotate(a, b, rad, dst) {
      const newDst = dst ?? new Ctor(2);
      const p0 = a[0] - b[0];
      const p1 = a[1] - b[1];
      const sinC = Math.sin(rad);
      const cosC = Math.cos(rad);
      newDst[0] = p0 * cosC - p1 * sinC + b[0];
      newDst[1] = p0 * sinC + p1 * cosC + b[1];
      return newDst;
    }
    function setLength(a, len2, dst) {
      const newDst = dst ?? new Ctor(2);
      normalize(a, newDst);
      return mulScalar(newDst, len2, newDst);
    }
    function truncate(a, maxLen, dst) {
      const newDst = dst ?? new Ctor(2);
      if (length(a) > maxLen) {
        return setLength(a, maxLen, newDst);
      }
      return copy(a, newDst);
    }
    function midpoint(a, b, dst) {
      const newDst = dst ?? new Ctor(2);
      return lerp(a, b, 0.5, newDst);
    }
    return {
      create,
      fromValues,
      set,
      ceil,
      floor,
      round,
      clamp,
      add,
      addScaled,
      angle,
      subtract,
      sub,
      equalsApproximately,
      equals,
      lerp,
      lerpV,
      max,
      min,
      mulScalar,
      scale,
      divScalar,
      inverse,
      invert,
      cross,
      dot,
      length,
      len,
      lengthSq,
      lenSq,
      distance,
      dist,
      distanceSq,
      distSq,
      normalize,
      negate,
      copy,
      clone,
      multiply,
      mul,
      divide,
      div,
      random,
      zero,
      transformMat4,
      transformMat3,
      rotate,
      setLength,
      truncate,
      midpoint
    };
  }
  var cache$5 = /* @__PURE__ */ new Map();
  function getAPI$5(Ctor) {
    let api = cache$5.get(Ctor);
    if (!api) {
      api = getAPIImpl$5(Ctor);
      cache$5.set(Ctor, api);
    }
    return api;
  }
  function getAPIImpl$4(Ctor) {
    function create(x, y, z) {
      const newDst = new Ctor(3);
      if (x !== void 0) {
        newDst[0] = x;
        if (y !== void 0) {
          newDst[1] = y;
          if (z !== void 0) {
            newDst[2] = z;
          }
        }
      }
      return newDst;
    }
    const fromValues = create;
    function set(x, y, z, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = x;
      newDst[1] = y;
      newDst[2] = z;
      return newDst;
    }
    function ceil(v, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = Math.ceil(v[0]);
      newDst[1] = Math.ceil(v[1]);
      newDst[2] = Math.ceil(v[2]);
      return newDst;
    }
    function floor(v, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = Math.floor(v[0]);
      newDst[1] = Math.floor(v[1]);
      newDst[2] = Math.floor(v[2]);
      return newDst;
    }
    function round(v, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = Math.round(v[0]);
      newDst[1] = Math.round(v[1]);
      newDst[2] = Math.round(v[2]);
      return newDst;
    }
    function clamp(v, min2 = 0, max2 = 1, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = Math.min(max2, Math.max(min2, v[0]));
      newDst[1] = Math.min(max2, Math.max(min2, v[1]));
      newDst[2] = Math.min(max2, Math.max(min2, v[2]));
      return newDst;
    }
    function add(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = a[0] + b[0];
      newDst[1] = a[1] + b[1];
      newDst[2] = a[2] + b[2];
      return newDst;
    }
    function addScaled(a, b, scale2, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = a[0] + b[0] * scale2;
      newDst[1] = a[1] + b[1] * scale2;
      newDst[2] = a[2] + b[2] * scale2;
      return newDst;
    }
    function angle(a, b) {
      const ax = a[0];
      const ay = a[1];
      const az = a[2];
      const bx = b[0];
      const by = b[1];
      const bz = b[2];
      const mag1 = Math.sqrt(ax * ax + ay * ay + az * az);
      const mag2 = Math.sqrt(bx * bx + by * by + bz * bz);
      const mag = mag1 * mag2;
      const cosine = mag && dot(a, b) / mag;
      return Math.acos(cosine);
    }
    function subtract(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = a[0] - b[0];
      newDst[1] = a[1] - b[1];
      newDst[2] = a[2] - b[2];
      return newDst;
    }
    const sub = subtract;
    function equalsApproximately(a, b) {
      return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON;
    }
    function equals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    }
    function lerp(a, b, t, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = a[0] + t * (b[0] - a[0]);
      newDst[1] = a[1] + t * (b[1] - a[1]);
      newDst[2] = a[2] + t * (b[2] - a[2]);
      return newDst;
    }
    function lerpV(a, b, t, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = a[0] + t[0] * (b[0] - a[0]);
      newDst[1] = a[1] + t[1] * (b[1] - a[1]);
      newDst[2] = a[2] + t[2] * (b[2] - a[2]);
      return newDst;
    }
    function max(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = Math.max(a[0], b[0]);
      newDst[1] = Math.max(a[1], b[1]);
      newDst[2] = Math.max(a[2], b[2]);
      return newDst;
    }
    function min(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = Math.min(a[0], b[0]);
      newDst[1] = Math.min(a[1], b[1]);
      newDst[2] = Math.min(a[2], b[2]);
      return newDst;
    }
    function mulScalar(v, k, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = v[0] * k;
      newDst[1] = v[1] * k;
      newDst[2] = v[2] * k;
      return newDst;
    }
    const scale = mulScalar;
    function divScalar(v, k, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = v[0] / k;
      newDst[1] = v[1] / k;
      newDst[2] = v[2] / k;
      return newDst;
    }
    function inverse(v, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = 1 / v[0];
      newDst[1] = 1 / v[1];
      newDst[2] = 1 / v[2];
      return newDst;
    }
    const invert = inverse;
    function cross(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      const t1 = a[2] * b[0] - a[0] * b[2];
      const t2 = a[0] * b[1] - a[1] * b[0];
      newDst[0] = a[1] * b[2] - a[2] * b[1];
      newDst[1] = t1;
      newDst[2] = t2;
      return newDst;
    }
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
    function length(v) {
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);
    }
    const len = length;
    function lengthSq(v) {
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      return v0 * v0 + v1 * v1 + v2 * v2;
    }
    const lenSq = lengthSq;
    function distance(a, b) {
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    const dist = distance;
    function distanceSq(a, b) {
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      return dx * dx + dy * dy + dz * dz;
    }
    const distSq = distanceSq;
    function normalize(v, dst) {
      const newDst = dst ?? new Ctor(3);
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      const len2 = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2);
      if (len2 > 1e-5) {
        newDst[0] = v0 / len2;
        newDst[1] = v1 / len2;
        newDst[2] = v2 / len2;
      } else {
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
      }
      return newDst;
    }
    function negate(v, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = -v[0];
      newDst[1] = -v[1];
      newDst[2] = -v[2];
      return newDst;
    }
    function copy(v, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = v[0];
      newDst[1] = v[1];
      newDst[2] = v[2];
      return newDst;
    }
    const clone = copy;
    function multiply(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = a[0] * b[0];
      newDst[1] = a[1] * b[1];
      newDst[2] = a[2] * b[2];
      return newDst;
    }
    const mul = multiply;
    function divide(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = a[0] / b[0];
      newDst[1] = a[1] / b[1];
      newDst[2] = a[2] / b[2];
      return newDst;
    }
    const div = divide;
    function random(scale2 = 1, dst) {
      const newDst = dst ?? new Ctor(3);
      const angle2 = Math.random() * 2 * Math.PI;
      const z = Math.random() * 2 - 1;
      const zScale = Math.sqrt(1 - z * z) * scale2;
      newDst[0] = Math.cos(angle2) * zScale;
      newDst[1] = Math.sin(angle2) * zScale;
      newDst[2] = z * scale2;
      return newDst;
    }
    function zero(dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = 0;
      newDst[1] = 0;
      newDst[2] = 0;
      return newDst;
    }
    function transformMat4(v, m, dst) {
      const newDst = dst ?? new Ctor(3);
      const x = v[0];
      const y = v[1];
      const z = v[2];
      const w = m[3] * x + m[7] * y + m[11] * z + m[15] || 1;
      newDst[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
      newDst[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
      newDst[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
      return newDst;
    }
    function transformMat4Upper3x3(v, m, dst) {
      const newDst = dst ?? new Ctor(3);
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      newDst[0] = v0 * m[0 * 4 + 0] + v1 * m[1 * 4 + 0] + v2 * m[2 * 4 + 0];
      newDst[1] = v0 * m[0 * 4 + 1] + v1 * m[1 * 4 + 1] + v2 * m[2 * 4 + 1];
      newDst[2] = v0 * m[0 * 4 + 2] + v1 * m[1 * 4 + 2] + v2 * m[2 * 4 + 2];
      return newDst;
    }
    function transformMat3(v, m, dst) {
      const newDst = dst ?? new Ctor(3);
      const x = v[0];
      const y = v[1];
      const z = v[2];
      newDst[0] = x * m[0] + y * m[4] + z * m[8];
      newDst[1] = x * m[1] + y * m[5] + z * m[9];
      newDst[2] = x * m[2] + y * m[6] + z * m[10];
      return newDst;
    }
    function transformQuat(v, q, dst) {
      const newDst = dst ?? new Ctor(3);
      const qx = q[0];
      const qy = q[1];
      const qz = q[2];
      const w2 = q[3] * 2;
      const x = v[0];
      const y = v[1];
      const z = v[2];
      const uvX = qy * z - qz * y;
      const uvY = qz * x - qx * z;
      const uvZ = qx * y - qy * x;
      newDst[0] = x + uvX * w2 + (qy * uvZ - qz * uvY) * 2;
      newDst[1] = y + uvY * w2 + (qz * uvX - qx * uvZ) * 2;
      newDst[2] = z + uvZ * w2 + (qx * uvY - qy * uvX) * 2;
      return newDst;
    }
    function getTranslation(m, dst) {
      const newDst = dst ?? new Ctor(3);
      newDst[0] = m[12];
      newDst[1] = m[13];
      newDst[2] = m[14];
      return newDst;
    }
    function getAxis(m, axis, dst) {
      const newDst = dst ?? new Ctor(3);
      const off = axis * 4;
      newDst[0] = m[off + 0];
      newDst[1] = m[off + 1];
      newDst[2] = m[off + 2];
      return newDst;
    }
    function getScaling(m, dst) {
      const newDst = dst ?? new Ctor(3);
      const xx = m[0];
      const xy = m[1];
      const xz = m[2];
      const yx = m[4];
      const yy = m[5];
      const yz = m[6];
      const zx = m[8];
      const zy = m[9];
      const zz = m[10];
      newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
      newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
      newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
      return newDst;
    }
    function rotateX(a, b, rad, dst) {
      const newDst = dst ?? new Ctor(3);
      const p = [];
      const r = [];
      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2];
      r[0] = p[0];
      r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
      r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
      newDst[0] = r[0] + b[0];
      newDst[1] = r[1] + b[1];
      newDst[2] = r[2] + b[2];
      return newDst;
    }
    function rotateY(a, b, rad, dst) {
      const newDst = dst ?? new Ctor(3);
      const p = [];
      const r = [];
      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2];
      r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
      r[1] = p[1];
      r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
      newDst[0] = r[0] + b[0];
      newDst[1] = r[1] + b[1];
      newDst[2] = r[2] + b[2];
      return newDst;
    }
    function rotateZ(a, b, rad, dst) {
      const newDst = dst ?? new Ctor(3);
      const p = [];
      const r = [];
      p[0] = a[0] - b[0];
      p[1] = a[1] - b[1];
      p[2] = a[2] - b[2];
      r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
      r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
      r[2] = p[2];
      newDst[0] = r[0] + b[0];
      newDst[1] = r[1] + b[1];
      newDst[2] = r[2] + b[2];
      return newDst;
    }
    function setLength(a, len2, dst) {
      const newDst = dst ?? new Ctor(3);
      normalize(a, newDst);
      return mulScalar(newDst, len2, newDst);
    }
    function truncate(a, maxLen, dst) {
      const newDst = dst ?? new Ctor(3);
      if (length(a) > maxLen) {
        return setLength(a, maxLen, newDst);
      }
      return copy(a, newDst);
    }
    function midpoint(a, b, dst) {
      const newDst = dst ?? new Ctor(3);
      return lerp(a, b, 0.5, newDst);
    }
    return {
      create,
      fromValues,
      set,
      ceil,
      floor,
      round,
      clamp,
      add,
      addScaled,
      angle,
      subtract,
      sub,
      equalsApproximately,
      equals,
      lerp,
      lerpV,
      max,
      min,
      mulScalar,
      scale,
      divScalar,
      inverse,
      invert,
      cross,
      dot,
      length,
      len,
      lengthSq,
      lenSq,
      distance,
      dist,
      distanceSq,
      distSq,
      normalize,
      negate,
      copy,
      clone,
      multiply,
      mul,
      divide,
      div,
      random,
      zero,
      transformMat4,
      transformMat4Upper3x3,
      transformMat3,
      transformQuat,
      getTranslation,
      getAxis,
      getScaling,
      rotateX,
      rotateY,
      rotateZ,
      setLength,
      truncate,
      midpoint
    };
  }
  var cache$4 = /* @__PURE__ */ new Map();
  function getAPI$4(Ctor) {
    let api = cache$4.get(Ctor);
    if (!api) {
      api = getAPIImpl$4(Ctor);
      cache$4.set(Ctor, api);
    }
    return api;
  }
  function getAPIImpl$3(Ctor) {
    const vec22 = getAPI$5(Ctor);
    const vec32 = getAPI$4(Ctor);
    function create(v0, v1, v2, v3, v4, v5, v6, v7, v8) {
      const newDst = new Ctor(12);
      newDst[3] = 0;
      newDst[7] = 0;
      newDst[11] = 0;
      if (v0 !== void 0) {
        newDst[0] = v0;
        if (v1 !== void 0) {
          newDst[1] = v1;
          if (v2 !== void 0) {
            newDst[2] = v2;
            if (v3 !== void 0) {
              newDst[4] = v3;
              if (v4 !== void 0) {
                newDst[5] = v4;
                if (v5 !== void 0) {
                  newDst[6] = v5;
                  if (v6 !== void 0) {
                    newDst[8] = v6;
                    if (v7 !== void 0) {
                      newDst[9] = v7;
                      if (v8 !== void 0) {
                        newDst[10] = v8;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return newDst;
    }
    function set(v0, v1, v2, v3, v4, v5, v6, v7, v8, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = v0;
      newDst[1] = v1;
      newDst[2] = v2;
      newDst[3] = 0;
      newDst[4] = v3;
      newDst[5] = v4;
      newDst[6] = v5;
      newDst[7] = 0;
      newDst[8] = v6;
      newDst[9] = v7;
      newDst[10] = v8;
      newDst[11] = 0;
      return newDst;
    }
    function fromMat4(m4, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = m4[0];
      newDst[1] = m4[1];
      newDst[2] = m4[2];
      newDst[3] = 0;
      newDst[4] = m4[4];
      newDst[5] = m4[5];
      newDst[6] = m4[6];
      newDst[7] = 0;
      newDst[8] = m4[8];
      newDst[9] = m4[9];
      newDst[10] = m4[10];
      newDst[11] = 0;
      return newDst;
    }
    function fromQuat(q, dst) {
      const newDst = dst ?? new Ctor(12);
      const x = q[0];
      const y = q[1];
      const z = q[2];
      const w = q[3];
      const x2 = x + x;
      const y2 = y + y;
      const z2 = z + z;
      const xx = x * x2;
      const yx = y * x2;
      const yy = y * y2;
      const zx = z * x2;
      const zy = z * y2;
      const zz = z * z2;
      const wx = w * x2;
      const wy = w * y2;
      const wz = w * z2;
      newDst[0] = 1 - yy - zz;
      newDst[1] = yx + wz;
      newDst[2] = zx - wy;
      newDst[3] = 0;
      newDst[4] = yx - wz;
      newDst[5] = 1 - xx - zz;
      newDst[6] = zy + wx;
      newDst[7] = 0;
      newDst[8] = zx + wy;
      newDst[9] = zy - wx;
      newDst[10] = 1 - xx - yy;
      newDst[11] = 0;
      return newDst;
    }
    function negate(m, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = -m[0];
      newDst[1] = -m[1];
      newDst[2] = -m[2];
      newDst[4] = -m[4];
      newDst[5] = -m[5];
      newDst[6] = -m[6];
      newDst[8] = -m[8];
      newDst[9] = -m[9];
      newDst[10] = -m[10];
      return newDst;
    }
    function multiplyScalar(m, s, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = m[0] * s;
      newDst[1] = m[1] * s;
      newDst[2] = m[2] * s;
      newDst[4] = m[4] * s;
      newDst[5] = m[5] * s;
      newDst[6] = m[6] * s;
      newDst[8] = m[8] * s;
      newDst[9] = m[9] * s;
      newDst[10] = m[10] * s;
      return newDst;
    }
    const mulScalar = multiplyScalar;
    function add(a, b, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = a[0] + b[0];
      newDst[1] = a[1] + b[1];
      newDst[2] = a[2] + b[2];
      newDst[4] = a[4] + b[4];
      newDst[5] = a[5] + b[5];
      newDst[6] = a[6] + b[6];
      newDst[8] = a[8] + b[8];
      newDst[9] = a[9] + b[9];
      newDst[10] = a[10] + b[10];
      return newDst;
    }
    function copy(m, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = m[0];
      newDst[1] = m[1];
      newDst[2] = m[2];
      newDst[4] = m[4];
      newDst[5] = m[5];
      newDst[6] = m[6];
      newDst[8] = m[8];
      newDst[9] = m[9];
      newDst[10] = m[10];
      return newDst;
    }
    const clone = copy;
    function equalsApproximately(a, b) {
      return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON && Math.abs(a[4] - b[4]) < EPSILON && Math.abs(a[5] - b[5]) < EPSILON && Math.abs(a[6] - b[6]) < EPSILON && Math.abs(a[8] - b[8]) < EPSILON && Math.abs(a[9] - b[9]) < EPSILON && Math.abs(a[10] - b[10]) < EPSILON;
    }
    function equals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10];
    }
    function identity(dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = 1;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[4] = 0;
      newDst[5] = 1;
      newDst[6] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = 1;
      return newDst;
    }
    function transpose(m, dst) {
      const newDst = dst ?? new Ctor(12);
      if (newDst === m) {
        let t;
        t = m[1];
        m[1] = m[4];
        m[4] = t;
        t = m[2];
        m[2] = m[8];
        m[8] = t;
        t = m[6];
        m[6] = m[9];
        m[9] = t;
        return newDst;
      }
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      newDst[0] = m00;
      newDst[1] = m10;
      newDst[2] = m20;
      newDst[4] = m01;
      newDst[5] = m11;
      newDst[6] = m21;
      newDst[8] = m02;
      newDst[9] = m12;
      newDst[10] = m22;
      return newDst;
    }
    function inverse(m, dst) {
      const newDst = dst ?? new Ctor(12);
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      const b01 = m22 * m11 - m12 * m21;
      const b11 = -m22 * m10 + m12 * m20;
      const b21 = m21 * m10 - m11 * m20;
      const invDet = 1 / (m00 * b01 + m01 * b11 + m02 * b21);
      newDst[0] = b01 * invDet;
      newDst[1] = (-m22 * m01 + m02 * m21) * invDet;
      newDst[2] = (m12 * m01 - m02 * m11) * invDet;
      newDst[4] = b11 * invDet;
      newDst[5] = (m22 * m00 - m02 * m20) * invDet;
      newDst[6] = (-m12 * m00 + m02 * m10) * invDet;
      newDst[8] = b21 * invDet;
      newDst[9] = (-m21 * m00 + m01 * m20) * invDet;
      newDst[10] = (m11 * m00 - m01 * m10) * invDet;
      return newDst;
    }
    function determinant(m) {
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      return m00 * (m11 * m22 - m21 * m12) - m10 * (m01 * m22 - m21 * m02) + m20 * (m01 * m12 - m11 * m02);
    }
    const invert = inverse;
    function multiply(a, b, dst) {
      const newDst = dst ?? new Ctor(12);
      const a00 = a[0];
      const a01 = a[1];
      const a02 = a[2];
      const a10 = a[4 + 0];
      const a11 = a[4 + 1];
      const a12 = a[4 + 2];
      const a20 = a[8 + 0];
      const a21 = a[8 + 1];
      const a22 = a[8 + 2];
      const b00 = b[0];
      const b01 = b[1];
      const b02 = b[2];
      const b10 = b[4 + 0];
      const b11 = b[4 + 1];
      const b12 = b[4 + 2];
      const b20 = b[8 + 0];
      const b21 = b[8 + 1];
      const b22 = b[8 + 2];
      newDst[0] = a00 * b00 + a10 * b01 + a20 * b02;
      newDst[1] = a01 * b00 + a11 * b01 + a21 * b02;
      newDst[2] = a02 * b00 + a12 * b01 + a22 * b02;
      newDst[4] = a00 * b10 + a10 * b11 + a20 * b12;
      newDst[5] = a01 * b10 + a11 * b11 + a21 * b12;
      newDst[6] = a02 * b10 + a12 * b11 + a22 * b12;
      newDst[8] = a00 * b20 + a10 * b21 + a20 * b22;
      newDst[9] = a01 * b20 + a11 * b21 + a21 * b22;
      newDst[10] = a02 * b20 + a12 * b21 + a22 * b22;
      return newDst;
    }
    const mul = multiply;
    function setTranslation(a, v, dst) {
      const newDst = dst ?? identity();
      if (a !== newDst) {
        newDst[0] = a[0];
        newDst[1] = a[1];
        newDst[2] = a[2];
        newDst[4] = a[4];
        newDst[5] = a[5];
        newDst[6] = a[6];
      }
      newDst[8] = v[0];
      newDst[9] = v[1];
      newDst[10] = 1;
      return newDst;
    }
    function getTranslation(m, dst) {
      const newDst = dst ?? vec22.create();
      newDst[0] = m[8];
      newDst[1] = m[9];
      return newDst;
    }
    function getAxis(m, axis, dst) {
      const newDst = dst ?? vec22.create();
      const off = axis * 4;
      newDst[0] = m[off + 0];
      newDst[1] = m[off + 1];
      return newDst;
    }
    function setAxis(m, v, axis, dst) {
      const newDst = dst === m ? m : copy(m, dst);
      const off = axis * 4;
      newDst[off + 0] = v[0];
      newDst[off + 1] = v[1];
      return newDst;
    }
    function getScaling(m, dst) {
      const newDst = dst ?? vec22.create();
      const xx = m[0];
      const xy = m[1];
      const yx = m[4];
      const yy = m[5];
      newDst[0] = Math.sqrt(xx * xx + xy * xy);
      newDst[1] = Math.sqrt(yx * yx + yy * yy);
      return newDst;
    }
    function get3DScaling(m, dst) {
      const newDst = dst ?? vec32.create();
      const xx = m[0];
      const xy = m[1];
      const xz = m[2];
      const yx = m[4];
      const yy = m[5];
      const yz = m[6];
      const zx = m[8];
      const zy = m[9];
      const zz = m[10];
      newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
      newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
      newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
      return newDst;
    }
    function translation(v, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = 1;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[4] = 0;
      newDst[5] = 1;
      newDst[6] = 0;
      newDst[8] = v[0];
      newDst[9] = v[1];
      newDst[10] = 1;
      return newDst;
    }
    function translate(m, v, dst) {
      const newDst = dst ?? new Ctor(12);
      const v0 = v[0];
      const v1 = v[1];
      const m00 = m[0];
      const m01 = m[1];
      const m02 = m[2];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      if (m !== newDst) {
        newDst[0] = m00;
        newDst[1] = m01;
        newDst[2] = m02;
        newDst[4] = m10;
        newDst[5] = m11;
        newDst[6] = m12;
      }
      newDst[8] = m00 * v0 + m10 * v1 + m20;
      newDst[9] = m01 * v0 + m11 * v1 + m21;
      newDst[10] = m02 * v0 + m12 * v1 + m22;
      return newDst;
    }
    function rotation(angleInRadians, dst) {
      const newDst = dst ?? new Ctor(12);
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = c;
      newDst[1] = s;
      newDst[2] = 0;
      newDst[4] = -s;
      newDst[5] = c;
      newDst[6] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = 1;
      return newDst;
    }
    function rotate(m, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(12);
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = c * m00 + s * m10;
      newDst[1] = c * m01 + s * m11;
      newDst[2] = c * m02 + s * m12;
      newDst[4] = c * m10 - s * m00;
      newDst[5] = c * m11 - s * m01;
      newDst[6] = c * m12 - s * m02;
      if (m !== newDst) {
        newDst[8] = m[8];
        newDst[9] = m[9];
        newDst[10] = m[10];
      }
      return newDst;
    }
    function rotationX(angleInRadians, dst) {
      const newDst = dst ?? new Ctor(12);
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = 1;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[4] = 0;
      newDst[5] = c;
      newDst[6] = s;
      newDst[8] = 0;
      newDst[9] = -s;
      newDst[10] = c;
      return newDst;
    }
    function rotateX(m, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(12);
      const m10 = m[4];
      const m11 = m[5];
      const m12 = m[6];
      const m20 = m[8];
      const m21 = m[9];
      const m22 = m[10];
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[4] = c * m10 + s * m20;
      newDst[5] = c * m11 + s * m21;
      newDst[6] = c * m12 + s * m22;
      newDst[8] = c * m20 - s * m10;
      newDst[9] = c * m21 - s * m11;
      newDst[10] = c * m22 - s * m12;
      if (m !== newDst) {
        newDst[0] = m[0];
        newDst[1] = m[1];
        newDst[2] = m[2];
      }
      return newDst;
    }
    function rotationY(angleInRadians, dst) {
      const newDst = dst ?? new Ctor(12);
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = c;
      newDst[1] = 0;
      newDst[2] = -s;
      newDst[4] = 0;
      newDst[5] = 1;
      newDst[6] = 0;
      newDst[8] = s;
      newDst[9] = 0;
      newDst[10] = c;
      return newDst;
    }
    function rotateY(m, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(12);
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = c * m00 - s * m20;
      newDst[1] = c * m01 - s * m21;
      newDst[2] = c * m02 - s * m22;
      newDst[8] = c * m20 + s * m00;
      newDst[9] = c * m21 + s * m01;
      newDst[10] = c * m22 + s * m02;
      if (m !== newDst) {
        newDst[4] = m[4];
        newDst[5] = m[5];
        newDst[6] = m[6];
      }
      return newDst;
    }
    const rotationZ = rotation;
    const rotateZ = rotate;
    function scaling(v, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = v[0];
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[4] = 0;
      newDst[5] = v[1];
      newDst[6] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = 1;
      return newDst;
    }
    function scale(m, v, dst) {
      const newDst = dst ?? new Ctor(12);
      const v0 = v[0];
      const v1 = v[1];
      newDst[0] = v0 * m[0 * 4 + 0];
      newDst[1] = v0 * m[0 * 4 + 1];
      newDst[2] = v0 * m[0 * 4 + 2];
      newDst[4] = v1 * m[1 * 4 + 0];
      newDst[5] = v1 * m[1 * 4 + 1];
      newDst[6] = v1 * m[1 * 4 + 2];
      if (m !== newDst) {
        newDst[8] = m[8];
        newDst[9] = m[9];
        newDst[10] = m[10];
      }
      return newDst;
    }
    function scaling3D(v, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = v[0];
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[4] = 0;
      newDst[5] = v[1];
      newDst[6] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = v[2];
      return newDst;
    }
    function scale3D(m, v, dst) {
      const newDst = dst ?? new Ctor(12);
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      newDst[0] = v0 * m[0 * 4 + 0];
      newDst[1] = v0 * m[0 * 4 + 1];
      newDst[2] = v0 * m[0 * 4 + 2];
      newDst[4] = v1 * m[1 * 4 + 0];
      newDst[5] = v1 * m[1 * 4 + 1];
      newDst[6] = v1 * m[1 * 4 + 2];
      newDst[8] = v2 * m[2 * 4 + 0];
      newDst[9] = v2 * m[2 * 4 + 1];
      newDst[10] = v2 * m[2 * 4 + 2];
      return newDst;
    }
    function uniformScaling(s, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = s;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[4] = 0;
      newDst[5] = s;
      newDst[6] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = 1;
      return newDst;
    }
    function uniformScale(m, s, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = s * m[0 * 4 + 0];
      newDst[1] = s * m[0 * 4 + 1];
      newDst[2] = s * m[0 * 4 + 2];
      newDst[4] = s * m[1 * 4 + 0];
      newDst[5] = s * m[1 * 4 + 1];
      newDst[6] = s * m[1 * 4 + 2];
      if (m !== newDst) {
        newDst[8] = m[8];
        newDst[9] = m[9];
        newDst[10] = m[10];
      }
      return newDst;
    }
    function uniformScaling3D(s, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = s;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[4] = 0;
      newDst[5] = s;
      newDst[6] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = s;
      return newDst;
    }
    function uniformScale3D(m, s, dst) {
      const newDst = dst ?? new Ctor(12);
      newDst[0] = s * m[0 * 4 + 0];
      newDst[1] = s * m[0 * 4 + 1];
      newDst[2] = s * m[0 * 4 + 2];
      newDst[4] = s * m[1 * 4 + 0];
      newDst[5] = s * m[1 * 4 + 1];
      newDst[6] = s * m[1 * 4 + 2];
      newDst[8] = s * m[2 * 4 + 0];
      newDst[9] = s * m[2 * 4 + 1];
      newDst[10] = s * m[2 * 4 + 2];
      return newDst;
    }
    return {
      add,
      clone,
      copy,
      create,
      determinant,
      equals,
      equalsApproximately,
      fromMat4,
      fromQuat,
      get3DScaling,
      getAxis,
      getScaling,
      getTranslation,
      identity,
      inverse,
      invert,
      mul,
      mulScalar,
      multiply,
      multiplyScalar,
      negate,
      rotate,
      rotateX,
      rotateY,
      rotateZ,
      rotation,
      rotationX,
      rotationY,
      rotationZ,
      scale,
      scale3D,
      scaling,
      scaling3D,
      set,
      setAxis,
      setTranslation,
      translate,
      translation,
      transpose,
      uniformScale,
      uniformScale3D,
      uniformScaling,
      uniformScaling3D
    };
  }
  var cache$3 = /* @__PURE__ */ new Map();
  function getAPI$3(Ctor) {
    let api = cache$3.get(Ctor);
    if (!api) {
      api = getAPIImpl$3(Ctor);
      cache$3.set(Ctor, api);
    }
    return api;
  }
  function getAPIImpl$2(Ctor) {
    const vec32 = getAPI$4(Ctor);
    function create(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15) {
      const newDst = new Ctor(16);
      if (v0 !== void 0) {
        newDst[0] = v0;
        if (v1 !== void 0) {
          newDst[1] = v1;
          if (v2 !== void 0) {
            newDst[2] = v2;
            if (v3 !== void 0) {
              newDst[3] = v3;
              if (v4 !== void 0) {
                newDst[4] = v4;
                if (v5 !== void 0) {
                  newDst[5] = v5;
                  if (v6 !== void 0) {
                    newDst[6] = v6;
                    if (v7 !== void 0) {
                      newDst[7] = v7;
                      if (v8 !== void 0) {
                        newDst[8] = v8;
                        if (v9 !== void 0) {
                          newDst[9] = v9;
                          if (v10 !== void 0) {
                            newDst[10] = v10;
                            if (v11 !== void 0) {
                              newDst[11] = v11;
                              if (v12 !== void 0) {
                                newDst[12] = v12;
                                if (v13 !== void 0) {
                                  newDst[13] = v13;
                                  if (v14 !== void 0) {
                                    newDst[14] = v14;
                                    if (v15 !== void 0) {
                                      newDst[15] = v15;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return newDst;
    }
    function set(v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = v0;
      newDst[1] = v1;
      newDst[2] = v2;
      newDst[3] = v3;
      newDst[4] = v4;
      newDst[5] = v5;
      newDst[6] = v6;
      newDst[7] = v7;
      newDst[8] = v8;
      newDst[9] = v9;
      newDst[10] = v10;
      newDst[11] = v11;
      newDst[12] = v12;
      newDst[13] = v13;
      newDst[14] = v14;
      newDst[15] = v15;
      return newDst;
    }
    function fromMat3(m3, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = m3[0];
      newDst[1] = m3[1];
      newDst[2] = m3[2];
      newDst[3] = 0;
      newDst[4] = m3[4];
      newDst[5] = m3[5];
      newDst[6] = m3[6];
      newDst[7] = 0;
      newDst[8] = m3[8];
      newDst[9] = m3[9];
      newDst[10] = m3[10];
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    function fromQuat(q, dst) {
      const newDst = dst ?? new Ctor(16);
      const x = q[0];
      const y = q[1];
      const z = q[2];
      const w = q[3];
      const x2 = x + x;
      const y2 = y + y;
      const z2 = z + z;
      const xx = x * x2;
      const yx = y * x2;
      const yy = y * y2;
      const zx = z * x2;
      const zy = z * y2;
      const zz = z * z2;
      const wx = w * x2;
      const wy = w * y2;
      const wz = w * z2;
      newDst[0] = 1 - yy - zz;
      newDst[1] = yx + wz;
      newDst[2] = zx - wy;
      newDst[3] = 0;
      newDst[4] = yx - wz;
      newDst[5] = 1 - xx - zz;
      newDst[6] = zy + wx;
      newDst[7] = 0;
      newDst[8] = zx + wy;
      newDst[9] = zy - wx;
      newDst[10] = 1 - xx - yy;
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    function negate(m, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = -m[0];
      newDst[1] = -m[1];
      newDst[2] = -m[2];
      newDst[3] = -m[3];
      newDst[4] = -m[4];
      newDst[5] = -m[5];
      newDst[6] = -m[6];
      newDst[7] = -m[7];
      newDst[8] = -m[8];
      newDst[9] = -m[9];
      newDst[10] = -m[10];
      newDst[11] = -m[11];
      newDst[12] = -m[12];
      newDst[13] = -m[13];
      newDst[14] = -m[14];
      newDst[15] = -m[15];
      return newDst;
    }
    function add(a, b, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = a[0] + b[0];
      newDst[1] = a[1] + b[1];
      newDst[2] = a[2] + b[2];
      newDst[3] = a[3] + b[3];
      newDst[4] = a[4] + b[4];
      newDst[5] = a[5] + b[5];
      newDst[6] = a[6] + b[6];
      newDst[7] = a[7] + b[7];
      newDst[8] = a[8] + b[8];
      newDst[9] = a[9] + b[9];
      newDst[10] = a[10] + b[10];
      newDst[11] = a[11] + b[11];
      newDst[12] = a[12] + b[12];
      newDst[13] = a[13] + b[13];
      newDst[14] = a[14] + b[14];
      newDst[15] = a[15] + b[15];
      return newDst;
    }
    function multiplyScalar(m, s, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = m[0] * s;
      newDst[1] = m[1] * s;
      newDst[2] = m[2] * s;
      newDst[3] = m[3] * s;
      newDst[4] = m[4] * s;
      newDst[5] = m[5] * s;
      newDst[6] = m[6] * s;
      newDst[7] = m[7] * s;
      newDst[8] = m[8] * s;
      newDst[9] = m[9] * s;
      newDst[10] = m[10] * s;
      newDst[11] = m[11] * s;
      newDst[12] = m[12] * s;
      newDst[13] = m[13] * s;
      newDst[14] = m[14] * s;
      newDst[15] = m[15] * s;
      return newDst;
    }
    const mulScalar = multiplyScalar;
    function copy(m, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = m[0];
      newDst[1] = m[1];
      newDst[2] = m[2];
      newDst[3] = m[3];
      newDst[4] = m[4];
      newDst[5] = m[5];
      newDst[6] = m[6];
      newDst[7] = m[7];
      newDst[8] = m[8];
      newDst[9] = m[9];
      newDst[10] = m[10];
      newDst[11] = m[11];
      newDst[12] = m[12];
      newDst[13] = m[13];
      newDst[14] = m[14];
      newDst[15] = m[15];
      return newDst;
    }
    const clone = copy;
    function equalsApproximately(a, b) {
      return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON && Math.abs(a[3] - b[3]) < EPSILON && Math.abs(a[4] - b[4]) < EPSILON && Math.abs(a[5] - b[5]) < EPSILON && Math.abs(a[6] - b[6]) < EPSILON && Math.abs(a[7] - b[7]) < EPSILON && Math.abs(a[8] - b[8]) < EPSILON && Math.abs(a[9] - b[9]) < EPSILON && Math.abs(a[10] - b[10]) < EPSILON && Math.abs(a[11] - b[11]) < EPSILON && Math.abs(a[12] - b[12]) < EPSILON && Math.abs(a[13] - b[13]) < EPSILON && Math.abs(a[14] - b[14]) < EPSILON && Math.abs(a[15] - b[15]) < EPSILON;
    }
    function equals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
    }
    function identity(dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = 1;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = 1;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = 1;
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    function transpose(m, dst) {
      const newDst = dst ?? new Ctor(16);
      if (newDst === m) {
        let t;
        t = m[1];
        m[1] = m[4];
        m[4] = t;
        t = m[2];
        m[2] = m[8];
        m[8] = t;
        t = m[3];
        m[3] = m[12];
        m[12] = t;
        t = m[6];
        m[6] = m[9];
        m[9] = t;
        t = m[7];
        m[7] = m[13];
        m[13] = t;
        t = m[11];
        m[11] = m[14];
        m[14] = t;
        return newDst;
      }
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m03 = m[0 * 4 + 3];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m13 = m[1 * 4 + 3];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      const m23 = m[2 * 4 + 3];
      const m30 = m[3 * 4 + 0];
      const m31 = m[3 * 4 + 1];
      const m32 = m[3 * 4 + 2];
      const m33 = m[3 * 4 + 3];
      newDst[0] = m00;
      newDst[1] = m10;
      newDst[2] = m20;
      newDst[3] = m30;
      newDst[4] = m01;
      newDst[5] = m11;
      newDst[6] = m21;
      newDst[7] = m31;
      newDst[8] = m02;
      newDst[9] = m12;
      newDst[10] = m22;
      newDst[11] = m32;
      newDst[12] = m03;
      newDst[13] = m13;
      newDst[14] = m23;
      newDst[15] = m33;
      return newDst;
    }
    function inverse(m, dst) {
      const newDst = dst ?? new Ctor(16);
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m03 = m[0 * 4 + 3];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m13 = m[1 * 4 + 3];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      const m23 = m[2 * 4 + 3];
      const m30 = m[3 * 4 + 0];
      const m31 = m[3 * 4 + 1];
      const m32 = m[3 * 4 + 2];
      const m33 = m[3 * 4 + 3];
      const tmp0 = m22 * m33;
      const tmp1 = m32 * m23;
      const tmp2 = m12 * m33;
      const tmp3 = m32 * m13;
      const tmp4 = m12 * m23;
      const tmp5 = m22 * m13;
      const tmp6 = m02 * m33;
      const tmp7 = m32 * m03;
      const tmp8 = m02 * m23;
      const tmp9 = m22 * m03;
      const tmp10 = m02 * m13;
      const tmp11 = m12 * m03;
      const tmp12 = m20 * m31;
      const tmp13 = m30 * m21;
      const tmp14 = m10 * m31;
      const tmp15 = m30 * m11;
      const tmp16 = m10 * m21;
      const tmp17 = m20 * m11;
      const tmp18 = m00 * m31;
      const tmp19 = m30 * m01;
      const tmp20 = m00 * m21;
      const tmp21 = m20 * m01;
      const tmp22 = m00 * m11;
      const tmp23 = m10 * m01;
      const t0 = tmp0 * m11 + tmp3 * m21 + tmp4 * m31 - (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
      const t1 = tmp1 * m01 + tmp6 * m21 + tmp9 * m31 - (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
      const t2 = tmp2 * m01 + tmp7 * m11 + tmp10 * m31 - (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
      const t3 = tmp5 * m01 + tmp8 * m11 + tmp11 * m21 - (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
      const d = 1 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);
      newDst[0] = d * t0;
      newDst[1] = d * t1;
      newDst[2] = d * t2;
      newDst[3] = d * t3;
      newDst[4] = d * (tmp1 * m10 + tmp2 * m20 + tmp5 * m30 - (tmp0 * m10 + tmp3 * m20 + tmp4 * m30));
      newDst[5] = d * (tmp0 * m00 + tmp7 * m20 + tmp8 * m30 - (tmp1 * m00 + tmp6 * m20 + tmp9 * m30));
      newDst[6] = d * (tmp3 * m00 + tmp6 * m10 + tmp11 * m30 - (tmp2 * m00 + tmp7 * m10 + tmp10 * m30));
      newDst[7] = d * (tmp4 * m00 + tmp9 * m10 + tmp10 * m20 - (tmp5 * m00 + tmp8 * m10 + tmp11 * m20));
      newDst[8] = d * (tmp12 * m13 + tmp15 * m23 + tmp16 * m33 - (tmp13 * m13 + tmp14 * m23 + tmp17 * m33));
      newDst[9] = d * (tmp13 * m03 + tmp18 * m23 + tmp21 * m33 - (tmp12 * m03 + tmp19 * m23 + tmp20 * m33));
      newDst[10] = d * (tmp14 * m03 + tmp19 * m13 + tmp22 * m33 - (tmp15 * m03 + tmp18 * m13 + tmp23 * m33));
      newDst[11] = d * (tmp17 * m03 + tmp20 * m13 + tmp23 * m23 - (tmp16 * m03 + tmp21 * m13 + tmp22 * m23));
      newDst[12] = d * (tmp14 * m22 + tmp17 * m32 + tmp13 * m12 - (tmp16 * m32 + tmp12 * m12 + tmp15 * m22));
      newDst[13] = d * (tmp20 * m32 + tmp12 * m02 + tmp19 * m22 - (tmp18 * m22 + tmp21 * m32 + tmp13 * m02));
      newDst[14] = d * (tmp18 * m12 + tmp23 * m32 + tmp15 * m02 - (tmp22 * m32 + tmp14 * m02 + tmp19 * m12));
      newDst[15] = d * (tmp22 * m22 + tmp16 * m02 + tmp21 * m12 - (tmp20 * m12 + tmp23 * m22 + tmp17 * m02));
      return newDst;
    }
    function determinant(m) {
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m03 = m[0 * 4 + 3];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m13 = m[1 * 4 + 3];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      const m23 = m[2 * 4 + 3];
      const m30 = m[3 * 4 + 0];
      const m31 = m[3 * 4 + 1];
      const m32 = m[3 * 4 + 2];
      const m33 = m[3 * 4 + 3];
      const tmp0 = m22 * m33;
      const tmp1 = m32 * m23;
      const tmp2 = m12 * m33;
      const tmp3 = m32 * m13;
      const tmp4 = m12 * m23;
      const tmp5 = m22 * m13;
      const tmp6 = m02 * m33;
      const tmp7 = m32 * m03;
      const tmp8 = m02 * m23;
      const tmp9 = m22 * m03;
      const tmp10 = m02 * m13;
      const tmp11 = m12 * m03;
      const t0 = tmp0 * m11 + tmp3 * m21 + tmp4 * m31 - (tmp1 * m11 + tmp2 * m21 + tmp5 * m31);
      const t1 = tmp1 * m01 + tmp6 * m21 + tmp9 * m31 - (tmp0 * m01 + tmp7 * m21 + tmp8 * m31);
      const t2 = tmp2 * m01 + tmp7 * m11 + tmp10 * m31 - (tmp3 * m01 + tmp6 * m11 + tmp11 * m31);
      const t3 = tmp5 * m01 + tmp8 * m11 + tmp11 * m21 - (tmp4 * m01 + tmp9 * m11 + tmp10 * m21);
      return m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3;
    }
    const invert = inverse;
    function multiply(a, b, dst) {
      const newDst = dst ?? new Ctor(16);
      const a00 = a[0];
      const a01 = a[1];
      const a02 = a[2];
      const a03 = a[3];
      const a10 = a[4 + 0];
      const a11 = a[4 + 1];
      const a12 = a[4 + 2];
      const a13 = a[4 + 3];
      const a20 = a[8 + 0];
      const a21 = a[8 + 1];
      const a22 = a[8 + 2];
      const a23 = a[8 + 3];
      const a30 = a[12 + 0];
      const a31 = a[12 + 1];
      const a32 = a[12 + 2];
      const a33 = a[12 + 3];
      const b00 = b[0];
      const b01 = b[1];
      const b02 = b[2];
      const b03 = b[3];
      const b10 = b[4 + 0];
      const b11 = b[4 + 1];
      const b12 = b[4 + 2];
      const b13 = b[4 + 3];
      const b20 = b[8 + 0];
      const b21 = b[8 + 1];
      const b22 = b[8 + 2];
      const b23 = b[8 + 3];
      const b30 = b[12 + 0];
      const b31 = b[12 + 1];
      const b32 = b[12 + 2];
      const b33 = b[12 + 3];
      newDst[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
      newDst[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
      newDst[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
      newDst[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
      newDst[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
      newDst[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
      newDst[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
      newDst[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
      newDst[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
      newDst[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
      newDst[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
      newDst[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
      newDst[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
      newDst[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
      newDst[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
      newDst[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
      return newDst;
    }
    const mul = multiply;
    function setTranslation(a, v, dst) {
      const newDst = dst ?? identity();
      if (a !== newDst) {
        newDst[0] = a[0];
        newDst[1] = a[1];
        newDst[2] = a[2];
        newDst[3] = a[3];
        newDst[4] = a[4];
        newDst[5] = a[5];
        newDst[6] = a[6];
        newDst[7] = a[7];
        newDst[8] = a[8];
        newDst[9] = a[9];
        newDst[10] = a[10];
        newDst[11] = a[11];
      }
      newDst[12] = v[0];
      newDst[13] = v[1];
      newDst[14] = v[2];
      newDst[15] = 1;
      return newDst;
    }
    function getTranslation(m, dst) {
      const newDst = dst ?? vec32.create();
      newDst[0] = m[12];
      newDst[1] = m[13];
      newDst[2] = m[14];
      return newDst;
    }
    function getAxis(m, axis, dst) {
      const newDst = dst ?? vec32.create();
      const off = axis * 4;
      newDst[0] = m[off + 0];
      newDst[1] = m[off + 1];
      newDst[2] = m[off + 2];
      return newDst;
    }
    function setAxis(m, v, axis, dst) {
      const newDst = dst === m ? dst : copy(m, dst);
      const off = axis * 4;
      newDst[off + 0] = v[0];
      newDst[off + 1] = v[1];
      newDst[off + 2] = v[2];
      return newDst;
    }
    function getScaling(m, dst) {
      const newDst = dst ?? vec32.create();
      const xx = m[0];
      const xy = m[1];
      const xz = m[2];
      const yx = m[4];
      const yy = m[5];
      const yz = m[6];
      const zx = m[8];
      const zy = m[9];
      const zz = m[10];
      newDst[0] = Math.sqrt(xx * xx + xy * xy + xz * xz);
      newDst[1] = Math.sqrt(yx * yx + yy * yy + yz * yz);
      newDst[2] = Math.sqrt(zx * zx + zy * zy + zz * zz);
      return newDst;
    }
    function perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
      const newDst = dst ?? new Ctor(16);
      const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
      newDst[0] = f / aspect;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = f;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[11] = -1;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[15] = 0;
      if (Number.isFinite(zFar)) {
        const rangeInv = 1 / (zNear - zFar);
        newDst[10] = zFar * rangeInv;
        newDst[14] = zFar * zNear * rangeInv;
      } else {
        newDst[10] = -1;
        newDst[14] = -zNear;
      }
      return newDst;
    }
    function perspectiveReverseZ(fieldOfViewYInRadians, aspect, zNear, zFar = Infinity, dst) {
      const newDst = dst ?? new Ctor(16);
      const f = 1 / Math.tan(fieldOfViewYInRadians * 0.5);
      newDst[0] = f / aspect;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = f;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[11] = -1;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[15] = 0;
      if (zFar === Infinity) {
        newDst[10] = 0;
        newDst[14] = zNear;
      } else {
        const rangeInv = 1 / (zFar - zNear);
        newDst[10] = zNear * rangeInv;
        newDst[14] = zFar * zNear * rangeInv;
      }
      return newDst;
    }
    function ortho(left, right, bottom, top, near, far, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = 2 / (right - left);
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = 2 / (top - bottom);
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = 1 / (near - far);
      newDst[11] = 0;
      newDst[12] = (right + left) / (left - right);
      newDst[13] = (top + bottom) / (bottom - top);
      newDst[14] = near / (near - far);
      newDst[15] = 1;
      return newDst;
    }
    function frustum(left, right, bottom, top, near, far, dst) {
      const newDst = dst ?? new Ctor(16);
      const dx = right - left;
      const dy = top - bottom;
      const dz = near - far;
      newDst[0] = 2 * near / dx;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = 2 * near / dy;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = (left + right) / dx;
      newDst[9] = (top + bottom) / dy;
      newDst[10] = far / dz;
      newDst[11] = -1;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = near * far / dz;
      newDst[15] = 0;
      return newDst;
    }
    function frustumReverseZ(left, right, bottom, top, near, far = Infinity, dst) {
      const newDst = dst ?? new Ctor(16);
      const dx = right - left;
      const dy = top - bottom;
      newDst[0] = 2 * near / dx;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = 2 * near / dy;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = (left + right) / dx;
      newDst[9] = (top + bottom) / dy;
      newDst[11] = -1;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[15] = 0;
      if (far === Infinity) {
        newDst[10] = 0;
        newDst[14] = near;
      } else {
        const rangeInv = 1 / (far - near);
        newDst[10] = near * rangeInv;
        newDst[14] = far * near * rangeInv;
      }
      return newDst;
    }
    const xAxis = vec32.create();
    const yAxis = vec32.create();
    const zAxis = vec32.create();
    function aim(position, target, up, dst) {
      const newDst = dst ?? new Ctor(16);
      vec32.normalize(vec32.subtract(target, position, zAxis), zAxis);
      vec32.normalize(vec32.cross(up, zAxis, xAxis), xAxis);
      vec32.normalize(vec32.cross(zAxis, xAxis, yAxis), yAxis);
      newDst[0] = xAxis[0];
      newDst[1] = xAxis[1];
      newDst[2] = xAxis[2];
      newDst[3] = 0;
      newDst[4] = yAxis[0];
      newDst[5] = yAxis[1];
      newDst[6] = yAxis[2];
      newDst[7] = 0;
      newDst[8] = zAxis[0];
      newDst[9] = zAxis[1];
      newDst[10] = zAxis[2];
      newDst[11] = 0;
      newDst[12] = position[0];
      newDst[13] = position[1];
      newDst[14] = position[2];
      newDst[15] = 1;
      return newDst;
    }
    function cameraAim(eye, target, up, dst) {
      const newDst = dst ?? new Ctor(16);
      vec32.normalize(vec32.subtract(eye, target, zAxis), zAxis);
      vec32.normalize(vec32.cross(up, zAxis, xAxis), xAxis);
      vec32.normalize(vec32.cross(zAxis, xAxis, yAxis), yAxis);
      newDst[0] = xAxis[0];
      newDst[1] = xAxis[1];
      newDst[2] = xAxis[2];
      newDst[3] = 0;
      newDst[4] = yAxis[0];
      newDst[5] = yAxis[1];
      newDst[6] = yAxis[2];
      newDst[7] = 0;
      newDst[8] = zAxis[0];
      newDst[9] = zAxis[1];
      newDst[10] = zAxis[2];
      newDst[11] = 0;
      newDst[12] = eye[0];
      newDst[13] = eye[1];
      newDst[14] = eye[2];
      newDst[15] = 1;
      return newDst;
    }
    function lookAt(eye, target, up, dst) {
      const newDst = dst ?? new Ctor(16);
      vec32.normalize(vec32.subtract(eye, target, zAxis), zAxis);
      vec32.normalize(vec32.cross(up, zAxis, xAxis), xAxis);
      vec32.normalize(vec32.cross(zAxis, xAxis, yAxis), yAxis);
      newDst[0] = xAxis[0];
      newDst[1] = yAxis[0];
      newDst[2] = zAxis[0];
      newDst[3] = 0;
      newDst[4] = xAxis[1];
      newDst[5] = yAxis[1];
      newDst[6] = zAxis[1];
      newDst[7] = 0;
      newDst[8] = xAxis[2];
      newDst[9] = yAxis[2];
      newDst[10] = zAxis[2];
      newDst[11] = 0;
      newDst[12] = -(xAxis[0] * eye[0] + xAxis[1] * eye[1] + xAxis[2] * eye[2]);
      newDst[13] = -(yAxis[0] * eye[0] + yAxis[1] * eye[1] + yAxis[2] * eye[2]);
      newDst[14] = -(zAxis[0] * eye[0] + zAxis[1] * eye[1] + zAxis[2] * eye[2]);
      newDst[15] = 1;
      return newDst;
    }
    function translation(v, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = 1;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = 1;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = 1;
      newDst[11] = 0;
      newDst[12] = v[0];
      newDst[13] = v[1];
      newDst[14] = v[2];
      newDst[15] = 1;
      return newDst;
    }
    function translate(m, v, dst) {
      const newDst = dst ?? new Ctor(16);
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      const m00 = m[0];
      const m01 = m[1];
      const m02 = m[2];
      const m03 = m[3];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m13 = m[1 * 4 + 3];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      const m23 = m[2 * 4 + 3];
      const m30 = m[3 * 4 + 0];
      const m31 = m[3 * 4 + 1];
      const m32 = m[3 * 4 + 2];
      const m33 = m[3 * 4 + 3];
      if (m !== newDst) {
        newDst[0] = m00;
        newDst[1] = m01;
        newDst[2] = m02;
        newDst[3] = m03;
        newDst[4] = m10;
        newDst[5] = m11;
        newDst[6] = m12;
        newDst[7] = m13;
        newDst[8] = m20;
        newDst[9] = m21;
        newDst[10] = m22;
        newDst[11] = m23;
      }
      newDst[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
      newDst[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
      newDst[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
      newDst[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;
      return newDst;
    }
    function rotationX(angleInRadians, dst) {
      const newDst = dst ?? new Ctor(16);
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = 1;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = c;
      newDst[6] = s;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = -s;
      newDst[10] = c;
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    function rotateX(m, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(16);
      const m10 = m[4];
      const m11 = m[5];
      const m12 = m[6];
      const m13 = m[7];
      const m20 = m[8];
      const m21 = m[9];
      const m22 = m[10];
      const m23 = m[11];
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[4] = c * m10 + s * m20;
      newDst[5] = c * m11 + s * m21;
      newDst[6] = c * m12 + s * m22;
      newDst[7] = c * m13 + s * m23;
      newDst[8] = c * m20 - s * m10;
      newDst[9] = c * m21 - s * m11;
      newDst[10] = c * m22 - s * m12;
      newDst[11] = c * m23 - s * m13;
      if (m !== newDst) {
        newDst[0] = m[0];
        newDst[1] = m[1];
        newDst[2] = m[2];
        newDst[3] = m[3];
        newDst[12] = m[12];
        newDst[13] = m[13];
        newDst[14] = m[14];
        newDst[15] = m[15];
      }
      return newDst;
    }
    function rotationY(angleInRadians, dst) {
      const newDst = dst ?? new Ctor(16);
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = c;
      newDst[1] = 0;
      newDst[2] = -s;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = 1;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = s;
      newDst[9] = 0;
      newDst[10] = c;
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    function rotateY(m, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(16);
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m03 = m[0 * 4 + 3];
      const m20 = m[2 * 4 + 0];
      const m21 = m[2 * 4 + 1];
      const m22 = m[2 * 4 + 2];
      const m23 = m[2 * 4 + 3];
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = c * m00 - s * m20;
      newDst[1] = c * m01 - s * m21;
      newDst[2] = c * m02 - s * m22;
      newDst[3] = c * m03 - s * m23;
      newDst[8] = c * m20 + s * m00;
      newDst[9] = c * m21 + s * m01;
      newDst[10] = c * m22 + s * m02;
      newDst[11] = c * m23 + s * m03;
      if (m !== newDst) {
        newDst[4] = m[4];
        newDst[5] = m[5];
        newDst[6] = m[6];
        newDst[7] = m[7];
        newDst[12] = m[12];
        newDst[13] = m[13];
        newDst[14] = m[14];
        newDst[15] = m[15];
      }
      return newDst;
    }
    function rotationZ(angleInRadians, dst) {
      const newDst = dst ?? new Ctor(16);
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = c;
      newDst[1] = s;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = -s;
      newDst[5] = c;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = 1;
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    function rotateZ(m, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(16);
      const m00 = m[0 * 4 + 0];
      const m01 = m[0 * 4 + 1];
      const m02 = m[0 * 4 + 2];
      const m03 = m[0 * 4 + 3];
      const m10 = m[1 * 4 + 0];
      const m11 = m[1 * 4 + 1];
      const m12 = m[1 * 4 + 2];
      const m13 = m[1 * 4 + 3];
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      newDst[0] = c * m00 + s * m10;
      newDst[1] = c * m01 + s * m11;
      newDst[2] = c * m02 + s * m12;
      newDst[3] = c * m03 + s * m13;
      newDst[4] = c * m10 - s * m00;
      newDst[5] = c * m11 - s * m01;
      newDst[6] = c * m12 - s * m02;
      newDst[7] = c * m13 - s * m03;
      if (m !== newDst) {
        newDst[8] = m[8];
        newDst[9] = m[9];
        newDst[10] = m[10];
        newDst[11] = m[11];
        newDst[12] = m[12];
        newDst[13] = m[13];
        newDst[14] = m[14];
        newDst[15] = m[15];
      }
      return newDst;
    }
    function axisRotation(axis, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(16);
      let x = axis[0];
      let y = axis[1];
      let z = axis[2];
      const n = Math.sqrt(x * x + y * y + z * z);
      x /= n;
      y /= n;
      z /= n;
      const xx = x * x;
      const yy = y * y;
      const zz = z * z;
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      const oneMinusCosine = 1 - c;
      newDst[0] = xx + (1 - xx) * c;
      newDst[1] = x * y * oneMinusCosine + z * s;
      newDst[2] = x * z * oneMinusCosine - y * s;
      newDst[3] = 0;
      newDst[4] = x * y * oneMinusCosine - z * s;
      newDst[5] = yy + (1 - yy) * c;
      newDst[6] = y * z * oneMinusCosine + x * s;
      newDst[7] = 0;
      newDst[8] = x * z * oneMinusCosine + y * s;
      newDst[9] = y * z * oneMinusCosine - x * s;
      newDst[10] = zz + (1 - zz) * c;
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    const rotation = axisRotation;
    function axisRotate(m, axis, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(16);
      let x = axis[0];
      let y = axis[1];
      let z = axis[2];
      const n = Math.sqrt(x * x + y * y + z * z);
      x /= n;
      y /= n;
      z /= n;
      const xx = x * x;
      const yy = y * y;
      const zz = z * z;
      const c = Math.cos(angleInRadians);
      const s = Math.sin(angleInRadians);
      const oneMinusCosine = 1 - c;
      const r00 = xx + (1 - xx) * c;
      const r01 = x * y * oneMinusCosine + z * s;
      const r02 = x * z * oneMinusCosine - y * s;
      const r10 = x * y * oneMinusCosine - z * s;
      const r11 = yy + (1 - yy) * c;
      const r12 = y * z * oneMinusCosine + x * s;
      const r20 = x * z * oneMinusCosine + y * s;
      const r21 = y * z * oneMinusCosine - x * s;
      const r22 = zz + (1 - zz) * c;
      const m00 = m[0];
      const m01 = m[1];
      const m02 = m[2];
      const m03 = m[3];
      const m10 = m[4];
      const m11 = m[5];
      const m12 = m[6];
      const m13 = m[7];
      const m20 = m[8];
      const m21 = m[9];
      const m22 = m[10];
      const m23 = m[11];
      newDst[0] = r00 * m00 + r01 * m10 + r02 * m20;
      newDst[1] = r00 * m01 + r01 * m11 + r02 * m21;
      newDst[2] = r00 * m02 + r01 * m12 + r02 * m22;
      newDst[3] = r00 * m03 + r01 * m13 + r02 * m23;
      newDst[4] = r10 * m00 + r11 * m10 + r12 * m20;
      newDst[5] = r10 * m01 + r11 * m11 + r12 * m21;
      newDst[6] = r10 * m02 + r11 * m12 + r12 * m22;
      newDst[7] = r10 * m03 + r11 * m13 + r12 * m23;
      newDst[8] = r20 * m00 + r21 * m10 + r22 * m20;
      newDst[9] = r20 * m01 + r21 * m11 + r22 * m21;
      newDst[10] = r20 * m02 + r21 * m12 + r22 * m22;
      newDst[11] = r20 * m03 + r21 * m13 + r22 * m23;
      if (m !== newDst) {
        newDst[12] = m[12];
        newDst[13] = m[13];
        newDst[14] = m[14];
        newDst[15] = m[15];
      }
      return newDst;
    }
    const rotate = axisRotate;
    function scaling(v, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = v[0];
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = v[1];
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = v[2];
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    function scale(m, v, dst) {
      const newDst = dst ?? new Ctor(16);
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      newDst[0] = v0 * m[0 * 4 + 0];
      newDst[1] = v0 * m[0 * 4 + 1];
      newDst[2] = v0 * m[0 * 4 + 2];
      newDst[3] = v0 * m[0 * 4 + 3];
      newDst[4] = v1 * m[1 * 4 + 0];
      newDst[5] = v1 * m[1 * 4 + 1];
      newDst[6] = v1 * m[1 * 4 + 2];
      newDst[7] = v1 * m[1 * 4 + 3];
      newDst[8] = v2 * m[2 * 4 + 0];
      newDst[9] = v2 * m[2 * 4 + 1];
      newDst[10] = v2 * m[2 * 4 + 2];
      newDst[11] = v2 * m[2 * 4 + 3];
      if (m !== newDst) {
        newDst[12] = m[12];
        newDst[13] = m[13];
        newDst[14] = m[14];
        newDst[15] = m[15];
      }
      return newDst;
    }
    function uniformScaling(s, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = s;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      newDst[4] = 0;
      newDst[5] = s;
      newDst[6] = 0;
      newDst[7] = 0;
      newDst[8] = 0;
      newDst[9] = 0;
      newDst[10] = s;
      newDst[11] = 0;
      newDst[12] = 0;
      newDst[13] = 0;
      newDst[14] = 0;
      newDst[15] = 1;
      return newDst;
    }
    function uniformScale(m, s, dst) {
      const newDst = dst ?? new Ctor(16);
      newDst[0] = s * m[0 * 4 + 0];
      newDst[1] = s * m[0 * 4 + 1];
      newDst[2] = s * m[0 * 4 + 2];
      newDst[3] = s * m[0 * 4 + 3];
      newDst[4] = s * m[1 * 4 + 0];
      newDst[5] = s * m[1 * 4 + 1];
      newDst[6] = s * m[1 * 4 + 2];
      newDst[7] = s * m[1 * 4 + 3];
      newDst[8] = s * m[2 * 4 + 0];
      newDst[9] = s * m[2 * 4 + 1];
      newDst[10] = s * m[2 * 4 + 2];
      newDst[11] = s * m[2 * 4 + 3];
      if (m !== newDst) {
        newDst[12] = m[12];
        newDst[13] = m[13];
        newDst[14] = m[14];
        newDst[15] = m[15];
      }
      return newDst;
    }
    return {
      add,
      aim,
      axisRotate,
      axisRotation,
      cameraAim,
      clone,
      copy,
      create,
      determinant,
      equals,
      equalsApproximately,
      fromMat3,
      fromQuat,
      frustum,
      frustumReverseZ,
      getAxis,
      getScaling,
      getTranslation,
      identity,
      inverse,
      invert,
      lookAt,
      mul,
      mulScalar,
      multiply,
      multiplyScalar,
      negate,
      ortho,
      perspective,
      perspectiveReverseZ,
      rotate,
      rotateX,
      rotateY,
      rotateZ,
      rotation,
      rotationX,
      rotationY,
      rotationZ,
      scale,
      scaling,
      set,
      setAxis,
      setTranslation,
      translate,
      translation,
      transpose,
      uniformScale,
      uniformScaling
    };
  }
  var cache$2 = /* @__PURE__ */ new Map();
  function getAPI$2(Ctor) {
    let api = cache$2.get(Ctor);
    if (!api) {
      api = getAPIImpl$2(Ctor);
      cache$2.set(Ctor, api);
    }
    return api;
  }
  function getAPIImpl$1(Ctor) {
    const vec32 = getAPI$4(Ctor);
    function create(x, y, z, w) {
      const newDst = new Ctor(4);
      if (x !== void 0) {
        newDst[0] = x;
        if (y !== void 0) {
          newDst[1] = y;
          if (z !== void 0) {
            newDst[2] = z;
            if (w !== void 0) {
              newDst[3] = w;
            }
          }
        }
      }
      return newDst;
    }
    const fromValues = create;
    function set(x, y, z, w, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = x;
      newDst[1] = y;
      newDst[2] = z;
      newDst[3] = w;
      return newDst;
    }
    function fromAxisAngle(axis, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(4);
      const halfAngle = angleInRadians * 0.5;
      const s = Math.sin(halfAngle);
      newDst[0] = s * axis[0];
      newDst[1] = s * axis[1];
      newDst[2] = s * axis[2];
      newDst[3] = Math.cos(halfAngle);
      return newDst;
    }
    function toAxisAngle(q, dst) {
      const newDst = dst ?? vec32.create(3);
      const angle2 = Math.acos(q[3]) * 2;
      const s = Math.sin(angle2 * 0.5);
      if (s > EPSILON) {
        newDst[0] = q[0] / s;
        newDst[1] = q[1] / s;
        newDst[2] = q[2] / s;
      } else {
        newDst[0] = 1;
        newDst[1] = 0;
        newDst[2] = 0;
      }
      return { angle: angle2, axis: newDst };
    }
    function angle(a, b) {
      const d = dot(a, b);
      return Math.acos(2 * d * d - 1);
    }
    function multiply(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      const ax = a[0];
      const ay = a[1];
      const az = a[2];
      const aw = a[3];
      const bx = b[0];
      const by = b[1];
      const bz = b[2];
      const bw = b[3];
      newDst[0] = ax * bw + aw * bx + ay * bz - az * by;
      newDst[1] = ay * bw + aw * by + az * bx - ax * bz;
      newDst[2] = az * bw + aw * bz + ax * by - ay * bx;
      newDst[3] = aw * bw - ax * bx - ay * by - az * bz;
      return newDst;
    }
    const mul = multiply;
    function rotateX(q, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(4);
      const halfAngle = angleInRadians * 0.5;
      const qx = q[0];
      const qy = q[1];
      const qz = q[2];
      const qw = q[3];
      const bx = Math.sin(halfAngle);
      const bw = Math.cos(halfAngle);
      newDst[0] = qx * bw + qw * bx;
      newDst[1] = qy * bw + qz * bx;
      newDst[2] = qz * bw - qy * bx;
      newDst[3] = qw * bw - qx * bx;
      return newDst;
    }
    function rotateY(q, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(4);
      const halfAngle = angleInRadians * 0.5;
      const qx = q[0];
      const qy = q[1];
      const qz = q[2];
      const qw = q[3];
      const by = Math.sin(halfAngle);
      const bw = Math.cos(halfAngle);
      newDst[0] = qx * bw - qz * by;
      newDst[1] = qy * bw + qw * by;
      newDst[2] = qz * bw + qx * by;
      newDst[3] = qw * bw - qy * by;
      return newDst;
    }
    function rotateZ(q, angleInRadians, dst) {
      const newDst = dst ?? new Ctor(4);
      const halfAngle = angleInRadians * 0.5;
      const qx = q[0];
      const qy = q[1];
      const qz = q[2];
      const qw = q[3];
      const bz = Math.sin(halfAngle);
      const bw = Math.cos(halfAngle);
      newDst[0] = qx * bw + qy * bz;
      newDst[1] = qy * bw - qx * bz;
      newDst[2] = qz * bw + qw * bz;
      newDst[3] = qw * bw - qz * bz;
      return newDst;
    }
    function slerp(a, b, t, dst) {
      const newDst = dst ?? new Ctor(4);
      const ax = a[0];
      const ay = a[1];
      const az = a[2];
      const aw = a[3];
      let bx = b[0];
      let by = b[1];
      let bz = b[2];
      let bw = b[3];
      let cosOmega = ax * bx + ay * by + az * bz + aw * bw;
      if (cosOmega < 0) {
        cosOmega = -cosOmega;
        bx = -bx;
        by = -by;
        bz = -bz;
        bw = -bw;
      }
      let scale0;
      let scale1;
      if (1 - cosOmega > EPSILON) {
        const omega = Math.acos(cosOmega);
        const sinOmega = Math.sin(omega);
        scale0 = Math.sin((1 - t) * omega) / sinOmega;
        scale1 = Math.sin(t * omega) / sinOmega;
      } else {
        scale0 = 1 - t;
        scale1 = t;
      }
      newDst[0] = scale0 * ax + scale1 * bx;
      newDst[1] = scale0 * ay + scale1 * by;
      newDst[2] = scale0 * az + scale1 * bz;
      newDst[3] = scale0 * aw + scale1 * bw;
      return newDst;
    }
    function inverse(q, dst) {
      const newDst = dst ?? new Ctor(4);
      const a0 = q[0];
      const a1 = q[1];
      const a2 = q[2];
      const a3 = q[3];
      const dot2 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
      const invDot = dot2 ? 1 / dot2 : 0;
      newDst[0] = -a0 * invDot;
      newDst[1] = -a1 * invDot;
      newDst[2] = -a2 * invDot;
      newDst[3] = a3 * invDot;
      return newDst;
    }
    function conjugate(q, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = -q[0];
      newDst[1] = -q[1];
      newDst[2] = -q[2];
      newDst[3] = q[3];
      return newDst;
    }
    function fromMat(m, dst) {
      const newDst = dst ?? new Ctor(4);
      const trace = m[0] + m[5] + m[10];
      if (trace > 0) {
        const root = Math.sqrt(trace + 1);
        newDst[3] = 0.5 * root;
        const invRoot = 0.5 / root;
        newDst[0] = (m[6] - m[9]) * invRoot;
        newDst[1] = (m[8] - m[2]) * invRoot;
        newDst[2] = (m[1] - m[4]) * invRoot;
      } else {
        let i = 0;
        if (m[5] > m[0]) {
          i = 1;
        }
        if (m[10] > m[i * 4 + i]) {
          i = 2;
        }
        const j = (i + 1) % 3;
        const k = (i + 2) % 3;
        const root = Math.sqrt(m[i * 4 + i] - m[j * 4 + j] - m[k * 4 + k] + 1);
        newDst[i] = 0.5 * root;
        const invRoot = 0.5 / root;
        newDst[3] = (m[j * 4 + k] - m[k * 4 + j]) * invRoot;
        newDst[j] = (m[j * 4 + i] + m[i * 4 + j]) * invRoot;
        newDst[k] = (m[k * 4 + i] + m[i * 4 + k]) * invRoot;
      }
      return newDst;
    }
    function fromEuler(xAngleInRadians, yAngleInRadians, zAngleInRadians, order, dst) {
      const newDst = dst ?? new Ctor(4);
      const xHalfAngle = xAngleInRadians * 0.5;
      const yHalfAngle = yAngleInRadians * 0.5;
      const zHalfAngle = zAngleInRadians * 0.5;
      const sx = Math.sin(xHalfAngle);
      const cx = Math.cos(xHalfAngle);
      const sy = Math.sin(yHalfAngle);
      const cy = Math.cos(yHalfAngle);
      const sz = Math.sin(zHalfAngle);
      const cz = Math.cos(zHalfAngle);
      switch (order) {
        case "xyz":
          newDst[0] = sx * cy * cz + cx * sy * sz;
          newDst[1] = cx * sy * cz - sx * cy * sz;
          newDst[2] = cx * cy * sz + sx * sy * cz;
          newDst[3] = cx * cy * cz - sx * sy * sz;
          break;
        case "xzy":
          newDst[0] = sx * cy * cz - cx * sy * sz;
          newDst[1] = cx * sy * cz - sx * cy * sz;
          newDst[2] = cx * cy * sz + sx * sy * cz;
          newDst[3] = cx * cy * cz + sx * sy * sz;
          break;
        case "yxz":
          newDst[0] = sx * cy * cz + cx * sy * sz;
          newDst[1] = cx * sy * cz - sx * cy * sz;
          newDst[2] = cx * cy * sz - sx * sy * cz;
          newDst[3] = cx * cy * cz + sx * sy * sz;
          break;
        case "yzx":
          newDst[0] = sx * cy * cz + cx * sy * sz;
          newDst[1] = cx * sy * cz + sx * cy * sz;
          newDst[2] = cx * cy * sz - sx * sy * cz;
          newDst[3] = cx * cy * cz - sx * sy * sz;
          break;
        case "zxy":
          newDst[0] = sx * cy * cz - cx * sy * sz;
          newDst[1] = cx * sy * cz + sx * cy * sz;
          newDst[2] = cx * cy * sz + sx * sy * cz;
          newDst[3] = cx * cy * cz - sx * sy * sz;
          break;
        case "zyx":
          newDst[0] = sx * cy * cz - cx * sy * sz;
          newDst[1] = cx * sy * cz + sx * cy * sz;
          newDst[2] = cx * cy * sz - sx * sy * cz;
          newDst[3] = cx * cy * cz + sx * sy * sz;
          break;
        default:
          throw new Error(`Unknown rotation order: ${order}`);
      }
      return newDst;
    }
    function copy(q, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = q[0];
      newDst[1] = q[1];
      newDst[2] = q[2];
      newDst[3] = q[3];
      return newDst;
    }
    const clone = copy;
    function add(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] + b[0];
      newDst[1] = a[1] + b[1];
      newDst[2] = a[2] + b[2];
      newDst[3] = a[3] + b[3];
      return newDst;
    }
    function subtract(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] - b[0];
      newDst[1] = a[1] - b[1];
      newDst[2] = a[2] - b[2];
      newDst[3] = a[3] - b[3];
      return newDst;
    }
    const sub = subtract;
    function mulScalar(v, k, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = v[0] * k;
      newDst[1] = v[1] * k;
      newDst[2] = v[2] * k;
      newDst[3] = v[3] * k;
      return newDst;
    }
    const scale = mulScalar;
    function divScalar(v, k, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = v[0] / k;
      newDst[1] = v[1] / k;
      newDst[2] = v[2] / k;
      newDst[3] = v[3] / k;
      return newDst;
    }
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    function lerp(a, b, t, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] + t * (b[0] - a[0]);
      newDst[1] = a[1] + t * (b[1] - a[1]);
      newDst[2] = a[2] + t * (b[2] - a[2]);
      newDst[3] = a[3] + t * (b[3] - a[3]);
      return newDst;
    }
    function length(v) {
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      const v3 = v[3];
      return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
    }
    const len = length;
    function lengthSq(v) {
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      const v3 = v[3];
      return v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3;
    }
    const lenSq = lengthSq;
    function normalize(v, dst) {
      const newDst = dst ?? new Ctor(4);
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      const v3 = v[3];
      const len2 = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
      if (len2 > 1e-5) {
        newDst[0] = v0 / len2;
        newDst[1] = v1 / len2;
        newDst[2] = v2 / len2;
        newDst[3] = v3 / len2;
      } else {
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 1;
      }
      return newDst;
    }
    function equalsApproximately(a, b) {
      return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON && Math.abs(a[3] - b[3]) < EPSILON;
    }
    function equals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    function identity(dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = 0;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 1;
      return newDst;
    }
    const tempVec3 = vec32.create();
    const xUnitVec3 = vec32.create();
    const yUnitVec3 = vec32.create();
    function rotationTo(aUnit, bUnit, dst) {
      const newDst = dst ?? new Ctor(4);
      const dot2 = vec32.dot(aUnit, bUnit);
      if (dot2 < -0.999999) {
        vec32.cross(xUnitVec3, aUnit, tempVec3);
        if (vec32.len(tempVec3) < 1e-6) {
          vec32.cross(yUnitVec3, aUnit, tempVec3);
        }
        vec32.normalize(tempVec3, tempVec3);
        fromAxisAngle(tempVec3, Math.PI, newDst);
        return newDst;
      } else if (dot2 > 0.999999) {
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 1;
        return newDst;
      } else {
        vec32.cross(aUnit, bUnit, tempVec3);
        newDst[0] = tempVec3[0];
        newDst[1] = tempVec3[1];
        newDst[2] = tempVec3[2];
        newDst[3] = 1 + dot2;
        return normalize(newDst, newDst);
      }
    }
    const tempQuat1 = new Ctor(4);
    const tempQuat2 = new Ctor(4);
    function sqlerp(a, b, c, d, t, dst) {
      const newDst = dst ?? new Ctor(4);
      slerp(a, d, t, tempQuat1);
      slerp(b, c, t, tempQuat2);
      slerp(tempQuat1, tempQuat2, 2 * t * (1 - t), newDst);
      return newDst;
    }
    return {
      create,
      fromValues,
      set,
      fromAxisAngle,
      toAxisAngle,
      angle,
      multiply,
      mul,
      rotateX,
      rotateY,
      rotateZ,
      slerp,
      inverse,
      conjugate,
      fromMat,
      fromEuler,
      copy,
      clone,
      add,
      subtract,
      sub,
      mulScalar,
      scale,
      divScalar,
      dot,
      lerp,
      length,
      len,
      lengthSq,
      lenSq,
      normalize,
      equalsApproximately,
      equals,
      identity,
      rotationTo,
      sqlerp
    };
  }
  var cache$1 = /* @__PURE__ */ new Map();
  function getAPI$1(Ctor) {
    let api = cache$1.get(Ctor);
    if (!api) {
      api = getAPIImpl$1(Ctor);
      cache$1.set(Ctor, api);
    }
    return api;
  }
  function getAPIImpl(Ctor) {
    function create(x, y, z, w) {
      const newDst = new Ctor(4);
      if (x !== void 0) {
        newDst[0] = x;
        if (y !== void 0) {
          newDst[1] = y;
          if (z !== void 0) {
            newDst[2] = z;
            if (w !== void 0) {
              newDst[3] = w;
            }
          }
        }
      }
      return newDst;
    }
    const fromValues = create;
    function set(x, y, z, w, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = x;
      newDst[1] = y;
      newDst[2] = z;
      newDst[3] = w;
      return newDst;
    }
    function ceil(v, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = Math.ceil(v[0]);
      newDst[1] = Math.ceil(v[1]);
      newDst[2] = Math.ceil(v[2]);
      newDst[3] = Math.ceil(v[3]);
      return newDst;
    }
    function floor(v, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = Math.floor(v[0]);
      newDst[1] = Math.floor(v[1]);
      newDst[2] = Math.floor(v[2]);
      newDst[3] = Math.floor(v[3]);
      return newDst;
    }
    function round(v, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = Math.round(v[0]);
      newDst[1] = Math.round(v[1]);
      newDst[2] = Math.round(v[2]);
      newDst[3] = Math.round(v[3]);
      return newDst;
    }
    function clamp(v, min2 = 0, max2 = 1, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = Math.min(max2, Math.max(min2, v[0]));
      newDst[1] = Math.min(max2, Math.max(min2, v[1]));
      newDst[2] = Math.min(max2, Math.max(min2, v[2]));
      newDst[3] = Math.min(max2, Math.max(min2, v[3]));
      return newDst;
    }
    function add(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] + b[0];
      newDst[1] = a[1] + b[1];
      newDst[2] = a[2] + b[2];
      newDst[3] = a[3] + b[3];
      return newDst;
    }
    function addScaled(a, b, scale2, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] + b[0] * scale2;
      newDst[1] = a[1] + b[1] * scale2;
      newDst[2] = a[2] + b[2] * scale2;
      newDst[3] = a[3] + b[3] * scale2;
      return newDst;
    }
    function subtract(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] - b[0];
      newDst[1] = a[1] - b[1];
      newDst[2] = a[2] - b[2];
      newDst[3] = a[3] - b[3];
      return newDst;
    }
    const sub = subtract;
    function equalsApproximately(a, b) {
      return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON && Math.abs(a[2] - b[2]) < EPSILON && Math.abs(a[3] - b[3]) < EPSILON;
    }
    function equals(a, b) {
      return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }
    function lerp(a, b, t, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] + t * (b[0] - a[0]);
      newDst[1] = a[1] + t * (b[1] - a[1]);
      newDst[2] = a[2] + t * (b[2] - a[2]);
      newDst[3] = a[3] + t * (b[3] - a[3]);
      return newDst;
    }
    function lerpV(a, b, t, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] + t[0] * (b[0] - a[0]);
      newDst[1] = a[1] + t[1] * (b[1] - a[1]);
      newDst[2] = a[2] + t[2] * (b[2] - a[2]);
      newDst[3] = a[3] + t[3] * (b[3] - a[3]);
      return newDst;
    }
    function max(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = Math.max(a[0], b[0]);
      newDst[1] = Math.max(a[1], b[1]);
      newDst[2] = Math.max(a[2], b[2]);
      newDst[3] = Math.max(a[3], b[3]);
      return newDst;
    }
    function min(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = Math.min(a[0], b[0]);
      newDst[1] = Math.min(a[1], b[1]);
      newDst[2] = Math.min(a[2], b[2]);
      newDst[3] = Math.min(a[3], b[3]);
      return newDst;
    }
    function mulScalar(v, k, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = v[0] * k;
      newDst[1] = v[1] * k;
      newDst[2] = v[2] * k;
      newDst[3] = v[3] * k;
      return newDst;
    }
    const scale = mulScalar;
    function divScalar(v, k, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = v[0] / k;
      newDst[1] = v[1] / k;
      newDst[2] = v[2] / k;
      newDst[3] = v[3] / k;
      return newDst;
    }
    function inverse(v, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = 1 / v[0];
      newDst[1] = 1 / v[1];
      newDst[2] = 1 / v[2];
      newDst[3] = 1 / v[3];
      return newDst;
    }
    const invert = inverse;
    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    function length(v) {
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      const v3 = v[3];
      return Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
    }
    const len = length;
    function lengthSq(v) {
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      const v3 = v[3];
      return v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3;
    }
    const lenSq = lengthSq;
    function distance(a, b) {
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      const dw = a[3] - b[3];
      return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
    }
    const dist = distance;
    function distanceSq(a, b) {
      const dx = a[0] - b[0];
      const dy = a[1] - b[1];
      const dz = a[2] - b[2];
      const dw = a[3] - b[3];
      return dx * dx + dy * dy + dz * dz + dw * dw;
    }
    const distSq = distanceSq;
    function normalize(v, dst) {
      const newDst = dst ?? new Ctor(4);
      const v0 = v[0];
      const v1 = v[1];
      const v2 = v[2];
      const v3 = v[3];
      const len2 = Math.sqrt(v0 * v0 + v1 * v1 + v2 * v2 + v3 * v3);
      if (len2 > 1e-5) {
        newDst[0] = v0 / len2;
        newDst[1] = v1 / len2;
        newDst[2] = v2 / len2;
        newDst[3] = v3 / len2;
      } else {
        newDst[0] = 0;
        newDst[1] = 0;
        newDst[2] = 0;
        newDst[3] = 0;
      }
      return newDst;
    }
    function negate(v, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = -v[0];
      newDst[1] = -v[1];
      newDst[2] = -v[2];
      newDst[3] = -v[3];
      return newDst;
    }
    function copy(v, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = v[0];
      newDst[1] = v[1];
      newDst[2] = v[2];
      newDst[3] = v[3];
      return newDst;
    }
    const clone = copy;
    function multiply(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] * b[0];
      newDst[1] = a[1] * b[1];
      newDst[2] = a[2] * b[2];
      newDst[3] = a[3] * b[3];
      return newDst;
    }
    const mul = multiply;
    function divide(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = a[0] / b[0];
      newDst[1] = a[1] / b[1];
      newDst[2] = a[2] / b[2];
      newDst[3] = a[3] / b[3];
      return newDst;
    }
    const div = divide;
    function zero(dst) {
      const newDst = dst ?? new Ctor(4);
      newDst[0] = 0;
      newDst[1] = 0;
      newDst[2] = 0;
      newDst[3] = 0;
      return newDst;
    }
    function transformMat4(v, m, dst) {
      const newDst = dst ?? new Ctor(4);
      const x = v[0];
      const y = v[1];
      const z = v[2];
      const w = v[3];
      newDst[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
      newDst[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
      newDst[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
      newDst[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
      return newDst;
    }
    function setLength(a, len2, dst) {
      const newDst = dst ?? new Ctor(4);
      normalize(a, newDst);
      return mulScalar(newDst, len2, newDst);
    }
    function truncate(a, maxLen, dst) {
      const newDst = dst ?? new Ctor(4);
      if (length(a) > maxLen) {
        return setLength(a, maxLen, newDst);
      }
      return copy(a, newDst);
    }
    function midpoint(a, b, dst) {
      const newDst = dst ?? new Ctor(4);
      return lerp(a, b, 0.5, newDst);
    }
    return {
      create,
      fromValues,
      set,
      ceil,
      floor,
      round,
      clamp,
      add,
      addScaled,
      subtract,
      sub,
      equalsApproximately,
      equals,
      lerp,
      lerpV,
      max,
      min,
      mulScalar,
      scale,
      divScalar,
      inverse,
      invert,
      dot,
      length,
      len,
      lengthSq,
      lenSq,
      distance,
      dist,
      distanceSq,
      distSq,
      normalize,
      negate,
      copy,
      clone,
      multiply,
      mul,
      divide,
      div,
      zero,
      transformMat4,
      setLength,
      truncate,
      midpoint
    };
  }
  var cache = /* @__PURE__ */ new Map();
  function getAPI(Ctor) {
    let api = cache.get(Ctor);
    if (!api) {
      api = getAPIImpl(Ctor);
      cache.set(Ctor, api);
    }
    return api;
  }
  function wgpuMatrixAPI(Mat3Ctor, Mat4Ctor, QuatCtor, Vec2Ctor, Vec3Ctor, Vec4Ctor) {
    return {
      /** @namespace mat3 */
      mat3: getAPI$3(Mat3Ctor),
      /** @namespace mat4 */
      mat4: getAPI$2(Mat4Ctor),
      /** @namespace quat */
      quat: getAPI$1(QuatCtor),
      /** @namespace vec2 */
      vec2: getAPI$5(Vec2Ctor),
      /** @namespace vec3 */
      vec3: getAPI$4(Vec3Ctor),
      /** @namespace vec4 */
      vec4: getAPI(Vec4Ctor)
    };
  }
  var {
    /**
     * 3x3 Matrix functions that default to returning `Float32Array`
     * @namespace
     */
    mat3,
    /**
     * 4x4 Matrix functions that default to returning `Float32Array`
     * @namespace
     */
    mat4,
    /**
     * Quaternion functions that default to returning `Float32Array`
     * @namespace
     */
    quat,
    /**
     * Vec2 functions that default to returning `Float32Array`
     * @namespace
     */
    vec2,
    /**
     * Vec3 functions that default to returning `Float32Array`
     * @namespace
     */
    vec3,
    /**
     * Vec3 functions that default to returning `Float32Array`
     * @namespace
     */
    vec4
  } = wgpuMatrixAPI(Float32Array, Float32Array, Float32Array, Float32Array, Float32Array, Float32Array);
  var {
    /**
     * 3x3 Matrix functions that default to returning `Float64Array`
     * @namespace
     */
    mat3: mat3d,
    /**
     * 4x4 Matrix functions that default to returning `Float64Array`
     * @namespace
     */
    mat4: mat4d,
    /**
     * Quaternion functions that default to returning `Float64Array`
     * @namespace
     */
    quat: quatd,
    /**
     * Vec2 functions that default to returning `Float64Array`
     * @namespace
     */
    vec2: vec2d,
    /**
     * Vec3 functions that default to returning `Float64Array`
     * @namespace
     */
    vec3: vec3d,
    /**
     * Vec3 functions that default to returning `Float64Array`
     * @namespace
     */
    vec4: vec4d
  } = wgpuMatrixAPI(Float64Array, Float64Array, Float64Array, Float64Array, Float64Array, Float64Array);
  var {
    /**
     * 3x3 Matrix functions that default to returning `number[]`
     * @namespace
     */
    mat3: mat3n,
    /**
     * 4x4 Matrix functions that default to returning `number[]`
     * @namespace
     */
    mat4: mat4n,
    /**
     * Quaternion functions that default to returning `number[]`
     * @namespace
     */
    quat: quatn,
    /**
     * Vec2 functions that default to returning `number[]`
     * @namespace
     */
    vec2: vec2n,
    /**
     * Vec3 functions that default to returning `number[]`
     * @namespace
     */
    vec3: vec3n,
    /**
     * Vec3 functions that default to returning `number[]`
     * @namespace
     */
    vec4: vec4n
  } = wgpuMatrixAPI(ZeroArray, Array, Array, Array, Array, Array);

  // src/ts/common.ts
  var workgroupSize = 64;
  var instanceDataLength = 16;
  var logInstanceData = (data, logCount = 10) => {
    const uintView = new Uint32Array(data.buffer);
    let table = [];
    for (let instance = 0; instance < logCount; instance++) {
      let offset = instance * instanceDataLength;
      table = [...table, {
        xPos: data[offset + 0],
        yPos: data[offset + 1],
        zPos: data[offset + 2],
        xVel: data[offset + 4],
        yVel: data[offset + 5],
        zVel: data[offset + 6],
        dist: data[offset + 8],
        dens: data[offset + 9],
        cell: uintView[offset + 10],
        test: uintView[offset + 11]
      }];
    }
    console.table(table);
  };
  function wgslNumStr(n) {
    return Number.isInteger(n) ? n.toFixed(1) : n.toString();
  }
  function wgslVec3Str(v) {
    return `vec3<f32>(${wgslNumStr(v[0])}, ${wgslNumStr(v[1])}, ${wgslNumStr(v[2])})`;
  }
  function wgslIVec3Str(v) {
    const str = (n) => n.toFixed(0);
    return `vec3<i32>(${str(v[0])}, ${str(v[1])}, ${str(v[2])})`;
  }

  // src/ts/render/renderer.ts
  var WGPURenderer = class {
    initialised = false;
    device = {};
    ctx = {};
    renderPipeline = {};
    instanceCount = 0;
    vertexCount = 0;
    vertexBuffer = {};
    instanceBuffer = {};
    uniformBuffer = {};
    bindGroup = {};
    depthTexture = null;
    multisampleTexture = null;
    clearColour = { r: 0.1, g: 0.1, b: 0.1, a: 1 };
    multisampleCount = 4;
    async init() {
      const canvas = document.querySelector("#gpuCanvas");
      if (!navigator.gpu) {
        throw Error("WebGPU not supported.");
      }
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw Error("Couldn't request WebGPU adapter.");
      }
      this.device = await adapter.requestDevice();
      this.ctx = canvas.getContext("webgpu");
      this.ctx.configure({
        device: this.device,
        format: navigator.gpu.getPreferredCanvasFormat(),
        alphaMode: "opaque"
      });
      this.initialised = true;
      return true;
    }
    createBuffersAndPipeline(instanceCount) {
      const vertData = createSquareData();
      this.vertexCount = vertData.length / 5;
      this.instanceCount = instanceCount;
      const bufferLayouts = [
        // VERTEX
        {
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x3"
            },
            {
              shaderLocation: 1,
              offset: 12,
              format: "float32x2"
            }
          ],
          arrayStride: 20,
          stepMode: "vertex"
        },
        // INSTANCE
        {
          attributes: [
            {
              // position
              shaderLocation: 2,
              offset: 0,
              format: "float32x4"
            },
            {
              // velocity
              shaderLocation: 3,
              offset: 16,
              format: "float32x4"
            },
            {
              // normal
              shaderLocation: 4,
              offset: 32,
              format: "float32x4"
            },
            {
              // field dist
              shaderLocation: 5,
              offset: 48,
              format: "float32"
            },
            {
              // density
              shaderLocation: 6,
              offset: 52,
              format: "float32"
            },
            {
              // density
              shaderLocation: 7,
              offset: 56,
              format: "uint32"
            },
            {
              // density
              shaderLocation: 8,
              offset: 60,
              format: "float32"
            }
          ],
          arrayStride: instanceDataLength * 4,
          stepMode: "instance"
        }
      ];
      const shaderModule = this.device.createShaderModule({ code: renderShaders });
      this.renderPipeline = this.device.createRenderPipeline({
        vertex: {
          module: shaderModule,
          entryPoint: "vertex_main",
          buffers: bufferLayouts
        },
        fragment: {
          module: shaderModule,
          entryPoint: "fragment_main",
          targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }]
        },
        primitive: {
          topology: "triangle-list",
          // frontFace: "ccw",
          // cullMode: "back"
          cullMode: "none"
        },
        depthStencil: {
          depthWriteEnabled: true,
          depthCompare: "less",
          format: "depth24plus"
        },
        layout: "auto",
        multisample: {
          count: this.multisampleCount
        }
      });
      this.vertexBuffer = this.device.createBuffer({
        size: vertData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
      });
      this.device.queue.writeBuffer(this.vertexBuffer, 0, vertData, 0, vertData.length);
      this.instanceBuffer = this.device.createBuffer({
        size: this.instanceCount * 4 * instanceDataLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
      });
      const uniformSize = 16 * 4 + // view-proj matrix
      4 * 4 + // background colour
      1 * 4 + // aspect ratio
      3 * 4;
      this.uniformBuffer = this.device.createBuffer({
        size: uniformSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      this.bindGroup = this.device.createBindGroup({
        layout: this.renderPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: { buffer: this.uniformBuffer } }
        ]
      });
    }
    render(viewProjectionMatrix) {
      if (!this.initialised) {
        throw "WebGPU not initialised";
      }
      const canvasTexture = this.ctx.getCurrentTexture();
      const uniformData = new Float32Array([
        ...viewProjectionMatrix,
        this.clearColour.r,
        this.clearColour.g,
        this.clearColour.b,
        this.clearColour.a,
        canvasTexture.width / canvasTexture.height
      ]);
      this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0);
      if (!this.depthTexture || this.depthTexture.width !== canvasTexture.width || this.depthTexture.height !== canvasTexture.height) {
        this.depthTexture?.destroy();
        this.depthTexture = this.device.createTexture({
          size: canvasTexture,
          // canvasTexture has width, height, and depthOrArrayLayers properties
          format: "depth24plus",
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
          sampleCount: this.multisampleCount
        });
      }
      if (!this.multisampleTexture || this.multisampleTexture.width !== canvasTexture.width || this.multisampleTexture.height !== canvasTexture.height) {
        if (this.multisampleTexture) this.multisampleTexture.destroy();
        this.multisampleTexture = this.device.createTexture({
          format: canvasTexture.format,
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
          size: [canvasTexture.width, canvasTexture.height],
          sampleCount: this.multisampleCount
        });
      }
      const commandEncoder = this.device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            clearValue: this.clearColour,
            loadOp: "clear",
            storeOp: "store",
            view: this.multisampleTexture.createView(),
            resolveTarget: canvasTexture.createView()
          }
        ],
        depthStencilAttachment: {
          depthClearValue: 1,
          depthLoadOp: "clear",
          depthStoreOp: "store",
          view: this.depthTexture.createView()
        }
      });
      passEncoder.setPipeline(this.renderPipeline);
      passEncoder.setVertexBuffer(0, this.vertexBuffer);
      passEncoder.setVertexBuffer(1, this.instanceBuffer);
      passEncoder.setBindGroup(0, this.bindGroup);
      passEncoder.draw(this.vertexCount, this.instanceCount, 0, 0);
      passEncoder.end();
      this.device.queue.submit([commandEncoder.finish()]);
    }
  };

  // src/ts/compute/shader/grid/gridAccess.ts
  var smoothingRadius = 1;
  var bound = vec3.create(200, 100, 25);
  var gridSize = vec3.floor(vec3.divScalar(bound, smoothingRadius));
  var trueBound = vec3.mulScalar(gridSize, smoothingRadius);
  var gridAccessFuncs = (
    /* wgsl */
    `

const gridSize = ${wgslIVec3Str(gridSize)};
const bounds = ${wgslVec3Str(trueBound)};

const cellWidth = ${wgslNumStr(smoothingRadius)};


fn imod3(a: vec3<i32>, b: vec3<i32>) -> vec3<i32> {
  let r = a % b;
  return select(r + b, r, r >= vec3<i32>(0));
}

fn getCellIdFlat(cellId3D: vec3<i32>) -> u32 {
  // TODO - could change loop for better spatial locality
  // e.g. if gridSize.x = 20, currently 21 =>  1, 22 =>  2, 41 => 1
  // but could flip this 20-40 range so 21 => 19, 22 => 18, 41 => 1
  let loopedId3D = imod3(cellId3D, gridSize);

  // TODO - use a space filling curve to improve neighbour locality
  let flatId =
    loopedId3D.x * gridSize.y * gridSize.z +
    loopedId3D.y * gridSize.z +
    loopedId3D.z;
  
  return u32(flatId);
}

fn getCellId3d(cellIdFlat: u32) -> vec3<i32> {
    const yz = gridSize.y * gridSize.z;

    let x = i32(cellIdFlat) / yz;
    let rem = i32(cellIdFlat) % yz;

    let y = rem / gridSize.z;
    let z = rem % gridSize.z;

    return vec3<i32>(x, y, z);
}
`
  );
  var iterateNeighbours = (body) => (
    /* wgsl */
    `
// requires including gridAccessFuncs
// assumes "particle" is defined as the particle we are finding neighbours of
// loops over all "particleB" in this cell and neighbour cells
// uses the sorted spatial grid we have created

let particleCellIndex3d = getCellId3d(particle.cellIndex);
for (var i: i32 = -1; i <= 1; i++) {
  for (var j: i32 = -1; j <= 1; j++) {
    for (var k: i32 = -1; k <= 1; k++) {
      let neighbourIndex3d = particleCellIndex3d + vec3<i32>(i, j, k);
      let neighbourCellIndex = getCellIdFlat(neighbourIndex3d);

      // get the start of the cell sublist of particles 
      var neighbourIterator = cellOffsets[neighbourCellIndex];

      // iterate over particles in the neighbour cell
      while (neighbourIterator != 0xffffffff && neighbourIterator < uniforms.particleCount) {
        // let particleBIndex = particleIds[neighbourIterator]; // if we haven't reordered the particle buffer by cellId
        let particleBIndex = neighbourIterator;
        let particleB = particles0[particleBIndex];

        if (particleB.cellIndex != neighbourCellIndex) {
          // we have iterated over all particles in the neighbour cell sublist
          break;
        }

        ${body};

        neighbourIterator++;
      }
    }
  }
}
`
  );

  // src/ts/compute/shader/shaderLayout.ts
  var particleStruct = (
    /* wgsl */
    `
struct Particle {
  position: vec4<f32>, // xyz used
  velocity: vec4<f32>, // xyz used
  normal: vec4<f32>,
  lastDist: f32,
  density: f32,
  cellIndex: u32,
  group: f32,
}
`
  );
  var shaderInputLayoutSrc = (
    /* wgsl */
    `
${particleStruct}
@group(0) @binding(0) var<storage, read_write> particles0: array<Particle>;
@group(0) @binding(1) var<storage, read_write> particles1: array<Particle>;

struct Uniforms {
  time: f32,
  deltaTime: f32,
  mouseIntersection: vec2<f32>,
  lastMouseIntersection: vec2<f32>,
  animSpeed: f32,
  particleCount: u32,
}
@group(0) @binding(2) var<uniform> uniforms: Uniforms;
@group(0) @binding(3) var<storage, read_write> cellIds: array<u32>;
@group(0) @binding(4) var<storage, read_write> particleIds: array<u32>;
@group(0) @binding(5) var<storage, read_write> cellOffsets: array<u32>;

`
  );
  var mainFunc = (
    /* wgsl */
    `
@compute @workgroup_size(${workgroupSize}, 1, 1) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
)
`
  );
  var getID = (
    /* wgsl */
    `workgroup_id.x * ${workgroupSize} + local_invocation_id.x`
  );

  // src/ts/compute/shader/grid/assignCell.ts
  var assignCellShaderSrc = (
    /* wgsl */
    `

${shaderInputLayoutSrc}


${gridAccessFuncs}


${mainFunc} {
  let id = ${getID};

  var position = particles0[id].position.xyz;
  position += bounds * 0.5; // offset so grid bounding box applies from [-0.5*bound, +0.5*bound]
  
  var cellId3D = vec3<i32>(floor(position / cellWidth));
  let cellIdFlat = getCellIdFlat(cellId3D);

  particles0[id].cellIndex = cellIdFlat;
  particles1[id].cellIndex = cellIdFlat;

  cellIds[id] = cellIdFlat;
  particleIds[id] = id;
}

`
  );

  // src/ts/compute/shader/grid/createStructure.ts
  var createStructureSrc = (
    /* wgsl */
    `

${shaderInputLayoutSrc.replace("cellOffsets: array<u32>", "cellOffsets: array<atomic<u32>>")}

${mainFunc} {
  let id = ${getID};

  let particleId = particleIds[id]; // index of this cell within the particles buffer
  let cellId = cellIds[id];

  particles0[id] = particles1[particleId];

  


  // the offset to the first appearance of each cell within the sorted cellId list is the minimum of ids
  atomicMin(&cellOffsets[cellId], id);
}
`
  );

  // src/ts/compute/shader/physics/sph.ts
  var densityNeighbourFraction = 0.8;
  var pressureConstant = 250;
  var referenceDensity = 1;
  var viscosityConstant = 0.118;
  var particleMass = 1;
  var poly6const = wgslNumStr(315 / (64 * Math.PI * Math.pow(smoothingRadius, 9)));
  var spikyConst = wgslNumStr(-45 / (Math.PI * Math.pow(smoothingRadius, 6)));
  var viscConst = wgslNumStr(45 / (Math.PI * Math.pow(smoothingRadius, 6)));
  var sphSrc = (
    /* wgsl */
    `

const h = ${wgslNumStr(smoothingRadius)};
const h2 = ${wgslNumStr(Math.pow(smoothingRadius, 2))};
const h3 = ${wgslNumStr(Math.pow(smoothingRadius, 3))};

const densityH = ${wgslNumStr(smoothingRadius * densityNeighbourFraction)};
const densityH2 = ${wgslNumStr(Math.pow(smoothingRadius * densityNeighbourFraction, 2))};

const particleFluidMass = ${wgslNumStr(particleMass)};
const p0 = ${wgslNumStr(referenceDensity)};
const K = ${wgslNumStr(pressureConstant)};
const e = ${wgslNumStr(viscosityConstant)};

fn particleDensity(particle: Particle) -> f32 {
  var density = 0.0;

  ${iterateNeighbours(
      /* wgsl */
      `
    let diff = particle.position.xyz - particleB.position.xyz;
    let r2 = dot(diff, diff);
    if (r2 < h2) {
      let W = ${poly6const} * pow(h2 - r2, 3.0);
      density += particleFluidMass * W;
    }
  `
    )}
  return max(p0, density);
}

fn particlePressure(density: f32) -> f32 {
  return K * (density - p0);
}

fn fluidAccel(particle: Particle, id: u32) -> vec3<f32> {
  var pressureForce = vec3<f32>(0.0);
  var viscosityForce = vec3<f32>(0.0);

  let pressureA = particlePressure(particle.density);

  var sameGroupNeighbourPosSum = vec4<f32>(0.0, 0.0, 0.0, 0.01); // z component stores count
  var diffGroupNeighbourPosSum = vec4<f32>(0.0, 0.0, 0.0, 0.01);
  
  ${iterateNeighbours(
      /* wgsl */
      `
    if (particleBIndex != id) {

      let diff = particle.position.xyz - particleB.position.xyz;
      let r2 = dot(diff, diff);
        let r = sqrt(r2);

      if (r2 > 0 && r2 < h2) {
        let rNorm = diff / r;
        let r3 = r2 * r;

        let groupDist = 0.5*abs(particle.group - particleB.group); // 0 if the same, 1 if different

        // PRESSURE FORCE
        let W1 = ${spikyConst} * pow(h-r, 2.0);
        let pressureB = particlePressure(particleB.density);
        pressureForce += W1 * rNorm * (pressureA + pressureB) / (2.0 * particle.density * particleB.density);


        // VISCOSITY FORCE
        // let W2 = -(r3 / (2.0 * h3)) + (r2 / h2) + (h / (2.0 * r)) - 1;
        var W2 = ${viscConst} * (h - r);
        viscosityForce += (1.0-2.0*groupDist) * W2 * rNorm * (particleB.velocity.xyz - particle.velocity.xyz) / particleB.density;


        // GROUP COHESION
        sameGroupNeighbourPosSum += select(vec4<f32>(particleB.position.xyz, 1.0), vec4<f32>(0.0), groupDist > 0.5);
        diffGroupNeighbourPosSum += select(vec4<f32>(particleB.position.xyz, 1.0), vec4<f32>(0.0), groupDist < 0.5);
      }
    }
  `
    )}

  var force = (e*viscosityForce - pressureForce) / particle.density;

  let sameGroupCentroidDir = (sameGroupNeighbourPosSum.xyz / sameGroupNeighbourPosSum.w) - particle.position.xyz;
  let diffGroupCentroidDir = (diffGroupNeighbourPosSum.xyz / diffGroupNeighbourPosSum.w) - particle.position.xyz;
  force += 0.3* sameGroupCentroidDir - 0.0*diffGroupCentroidDir;

  return force / particleFluidMass;
}


`
  );

  // src/ts/compute/shader/update1.ts
  var update1Src = (
    /* wgsl */
    `

${shaderInputLayoutSrc}
${gridAccessFuncs}
${sphSrc}


${mainFunc} {
  let id = ${getID};

  particles0[id].density = particleDensity(particles0[id]);
}

`
  );

  // src/ts/compute/shader/physics/sdf.ts
  var mass = wgslNumStr(0.05);
  var positionStiffness = wgslNumStr(-2);
  var velocityDamping = wgslNumStr(-1);
  var gravityClamp = wgslNumStr(200);
  var sdfSrc = (
    /* wgsl */
    `

const internalForceMultiplier = 1.0; // scale the force when particle is inside field (currently not working i think)

fn sdCapsule(p: vec3<f32>, a: vec3<f32>, b: vec3<f32>, r: f32) -> f32 {
    let pa = p - a;
    let ba = b - a;
    let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
}

fn sdCappedTorus(pIn: vec3<f32>, sc: vec2<f32>, ra: f32, rb: f32) -> f32 {
    var p = pIn;
    p.y = abs(p.y);

    let p_xy = p.xy;
    let k = select(
        length(p_xy),
        dot(p_xy, sc),
        sc.y * p.y > sc.x * p.x
    );

    return sqrt(dot(p, p) + ra * ra - 2.0 * ra * k) - rb;
}

fn sdD(p: vec3<f32>, r: f32) -> f32 {
    let c1 = sdCapsule(p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>(-0.3,  0.5, 0.0), r);

    let c2 = sdCapsule(p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>(-0.1, -0.5, 0.0), r);

    let c3 = sdCapsule(p,
        vec3<f32>(-0.3,  0.5, 0.0),
        vec3<f32>(-0.1,  0.5, 0.0), r);

    let t1 = sdCappedTorus(
        p - vec3<f32>(-0.1, 0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        0.5, r
    );

    return min(min(c1, c2), min(c3, t1));
}

fn sdE(p: vec3<f32>, r: f32) -> f32 {
    let c1 = sdCapsule(p,
        vec3<f32>(-0.3,  0.5, 0.0),
        vec3<f32>( 0.3,  0.5, 0.0), r);

    let c2 = sdCapsule(p,
        vec3<f32>(-0.3,  0.0, 0.0),
        vec3<f32>( 0.1,  0.0, 0.0), r);

    let c3 = sdCapsule(p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>( 0.3, -0.5, 0.0), r);

    let c4 = sdCapsule(p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>(-0.3,  0.5, 0.0), r);

    return min(min(c1, c2), min(c3, c4));
}

fn sdI(p: vec3<f32>, r: f32) -> f32 {
    let c1 = sdCapsule(
        p,
        vec3<f32>(0.0, -0.5, 0.0),
        vec3<f32>(0.0,  0.5, 0.0),
        r
    );
    let c2 = sdCapsule(
        p,
        vec3<f32>(-0.3, 0.5, 0.0),
        vec3<f32>( 0.3, 0.5, 0.0),
        r
    );
    let c3 = sdCapsule(
        p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>( 0.3, -0.5, 0.0),
        r
    );
    return min(c1, min(c2, c3));
}

fn sdDistort(pos: vec3<f32>) -> f32 {
    // const sharpness = 0.9;
    // const period = 0.5;
    // return max((sin(period*abs(pos.y) + uniforms.time)-sharpness)/(1.0-sharpness), 0.0);


    // find closest point on line between mouseIntersection and lastMouseIntersection
    let p1 = uniforms.mouseIntersection;
    let p2 = uniforms.lastMouseIntersection;  
    
    let v = p2 - p1;
    let w = pos.xy - p1;

    let t = saturate(dot(w, v) / dot(v, v));
    let closestPoint = p1 + t*v;

    let dist = pos.xy - closestPoint;

    return 30.0*exp(-0.5*dot(dist, dist));
}

fn sdf(pos: vec3<f32>) -> f32 {
    const r: f32 = 0.08;
    const scale: f32 = 40.0;

    let p = pos / scale;
    var minDist: f32 = 1e20;

    // E
    minDist = min(minDist, sdE(p - vec3<f32>(-2.05, 0.0, 0.0), r) * scale);

    // D D
    minDist = min(minDist, sdD(p - vec3<f32>(-1.05, 0.0, 0.0), r) * scale);
    minDist = min(minDist, sdD(p - vec3<f32>( 0.0, 0.0, 0.0), r) * scale);

    // I
    minDist = min(minDist, sdI(p - vec3<f32>( 1.0, 0.0, 0.0), r) * scale);

    // E
    minDist = min(minDist, sdE(p - vec3<f32>( 2.0, 0.0, 0.0), r) * scale);

    minDist += sdDistort(pos);

    return minDist;
}

const EPSILON: f32 = 0.0001;
fn sdfNormal(pos: vec3<f32>) -> vec3<f32> {
    let e = vec3<f32>(EPSILON, 0.0, 0.0);

    let dx = sdf(pos + e.xyy) - sdf(pos - e.xyy);
    let dy = sdf(pos + e.yxy) - sdf(pos - e.yxy);
    let dz = sdf(pos + e.yyx) - sdf(pos - e.yyx);

    return normalize(vec3<f32>(dx, dy, dz));
}

const gravityClamp = ${gravityClamp};
fn gravityAccel(pos: vec3<f32>, dist: f32, fieldNormal: vec3<f32>, lastDist: f32) -> vec3<f32> {
  let dist2 = dist; // max(dist, 0.0);         // uncomment to allow particles inside volumes
  let lastDist2 = lastDist; // max(lastDist, 0.0);

  let dDistdt = (dist2 - lastDist2) / uniforms.deltaTime;
  var gravityAmount = -${positionStiffness}*dist2 - ${velocityDamping}*dDistdt;
  gravityAmount = atan(gravityAmount / gravityClamp) * gravityClamp;

  var gravity = -fieldNormal * gravityAmount;

  return gravity / ${mass};

}


`
  );

  // src/ts/compute/shader/update2.ts
  var update2Src = (
    /* wgsl */
    `

${shaderInputLayoutSrc}
${gridAccessFuncs}
${sphSrc}
${sdfSrc}

const accelDeltaTime = 0.01; // hardcoded deltaTime for acceleration calculation to prevent explosion
const velocityClamp = 100.0;


${mainFunc} {
  let id = ${getID};
  let particle = particles0[id];

  var position = particle.position.xyz;
  var velocity = particle.velocity.xyz;


  
  // fluid force
  var acceleration = fluidAccel(particle, id);
  
  // field gravity
  let fieldDist = sdf(position);
  let fieldNormal = sdfNormal(position);
  acceleration += gravityAccel(position, fieldDist, fieldNormal, particle.lastDist);
  
  // apply forces
  velocity += acceleration * accelDeltaTime;
  velocity = atan(velocity / velocityClamp) * velocityClamp ;

  position += velocity * uniforms.deltaTime * uniforms.animSpeed;

  
  
  // particle normal (shading only) - move towards field normal
  const lerpSpeed = 0.1;
  let normal = normalize(lerpSpeed*fieldNormal + (1.0-lerpSpeed)*particle.normal.xyz);


  
  particles1[id] = Particle(
    vec4<f32>(position, 1.0),
    vec4<f32>(velocity, 1.0),
    vec4<f32>(normal, 1.0),
    fieldDist,
    particle.density,
    particle.cellIndex, // not really necessary
    particle.group
  );

}
`
  );

  // src/ts/compute/computer.ts
  var import_webgpu_radix_sort = __toESM(require_radix_sort_umd(), 1);
  var WGPUComputer = class {
    device;
    computeShaders = [assignCellShaderSrc, createStructureSrc, update1Src, update2Src];
    // run in order, with a sort between shader[0] and shader[1]
    pipelines = [];
    bindGroup;
    particleCount;
    particleDataBuffer0;
    // used as read/write for all but the final shader. used as read for final shader
    particleDataBuffer1;
    // used as write for final shader (to avoid race conditions)
    renderInstanceBuffer;
    // particles are given in a tuple (cellIndex, particleIndex in particleDataBuffer)
    // we sort these tuples by cellIndex, creating sublists in the list of tuples for each cell
    cellIndexBuffer;
    particleIdBuffer;
    cellOffsetBuffer;
    // stores the offset each cell has in the sorted cellIndex array (0xffffffff if cell is empty)
    cellOffsetStartBuffer;
    // buffer of 0xffffffff to reset cellOffset every frame - currently no encoder.fillBuffer :(
    uniformBuffer;
    time = 0;
    // could auto-generate this list from the shader code but not necessary for a small number
    uniforms = /* @__PURE__ */ new Map([
      ["time", { length: 1, value: new Float32Array([0]) }],
      ["deltaTime", { length: 1, value: new Float32Array([0]) }],
      ["mouseIntersection", { length: 2, value: new Float32Array([0, 0]) }],
      ["lastMouseIntersection", { length: 2, value: new Float32Array([0, 0]) }],
      ["animSpeed", { length: 1, value: new Float32Array([0]) }],
      ["particleCount", { length: 1, value: new Uint32Array([0]) }]
    ]);
    uniformsLength = Array.from(this.uniforms.values()).reduce((acc, u) => acc + u.length, 0);
    resultBuffer;
    // for debug
    constructor(device, particleCount2, initialInstanceData, renderInstanceBuffer) {
      this.device = device;
      this.particleCount = particleCount2;
      this.renderInstanceBuffer = renderInstanceBuffer;
      const bindGroupLayout = this.device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "storage" }
          },
          {
            binding: 1,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "storage" }
          },
          {
            binding: 2,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "uniform" }
          },
          {
            binding: 3,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "storage" }
          },
          {
            binding: 4,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "storage" }
          },
          {
            binding: 5,
            visibility: GPUShaderStage.COMPUTE,
            buffer: { type: "storage" }
          }
        ]
      });
      const pipelineLayout = this.device.createPipelineLayout({
        bindGroupLayouts: [bindGroupLayout]
      });
      for (let i = 0; i < this.computeShaders.length; i++) {
        const module = this.device.createShaderModule({
          label: `particle update ${i}`,
          code: this.computeShaders[i]
        });
        this.pipelines.push(device.createComputePipeline({
          label: `particle update ${i} pipeline`,
          layout: pipelineLayout,
          compute: {
            module
          }
        }));
      }
      this.particleDataBuffer0 = device.createBuffer({
        size: particleCount2 * 4 * instanceDataLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
      });
      this.particleDataBuffer1 = device.createBuffer({
        size: particleCount2 * 4 * instanceDataLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
      });
      device.queue.writeBuffer(this.particleDataBuffer0, 0, initialInstanceData);
      device.queue.writeBuffer(this.particleDataBuffer1, 0, initialInstanceData);
      this.cellIndexBuffer = device.createBuffer({
        size: particleCount2 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
      });
      this.particleIdBuffer = device.createBuffer({
        size: particleCount2 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
      });
      const cellOffsetBufSize = gridSize[0] * gridSize[1] * gridSize[2];
      this.cellOffsetBuffer = device.createBuffer({
        size: cellOffsetBufSize * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
      });
      this.cellOffsetStartBuffer = device.createBuffer({
        size: cellOffsetBufSize * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
      });
      device.queue.writeBuffer(this.cellOffsetStartBuffer, 0, new Uint32Array(cellOffsetBufSize).fill(4294967295));
      this.uniformBuffer = device.createBuffer({
        size: this.uniformsLength * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      this.resultBuffer = device.createBuffer({
        size: this.particleDataBuffer0.size,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
      });
      this.bindGroup = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: this.particleDataBuffer0 } },
          { binding: 1, resource: { buffer: this.particleDataBuffer1 } },
          { binding: 2, resource: { buffer: this.uniformBuffer } },
          { binding: 3, resource: { buffer: this.cellIndexBuffer } },
          { binding: 4, resource: { buffer: this.particleIdBuffer } },
          { binding: 5, resource: { buffer: this.cellOffsetBuffer } }
        ]
      });
    }
    sort(encoder) {
      const radixSortKernel = new import_webgpu_radix_sort.RadixSortKernel({
        device: this.device,
        keys: this.cellIndexBuffer,
        values: this.particleIdBuffer,
        count: this.particleCount,
        check_order: false,
        bit_count: 32,
        workgroup_size: { x: 16, y: 16 }
        // Workgroup size in x and y dimensions. (x * y) must be a power of two
      });
      const pass = encoder.beginComputePass();
      radixSortKernel.dispatch(pass);
      pass.end();
    }
    async run(deltaTime, mouseIntersection, lastMouseIntersection) {
      this.time += deltaTime;
      this.uniforms.get("time").value[0] = this.time;
      this.uniforms.get("deltaTime").value[0] = deltaTime;
      this.uniforms.get("mouseIntersection").value = mouseIntersection;
      this.uniforms.get("lastMouseIntersection").value = lastMouseIntersection;
      this.uniforms.get("animSpeed").value[0] = window.PAUSE_UPDATE ? 0 : 1;
      this.uniforms.get("particleCount").value[0] = this.particleCount;
      const uniformData = new Float32Array(this.uniformsLength);
      let i = 0;
      for (const [_, { length, value }] of this.uniforms) {
        uniformData.set(value, i);
        i += length;
      }
      this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0);
      const encoder = this.device.createCommandEncoder();
      encoder.copyBufferToBuffer(this.cellOffsetStartBuffer, this.cellOffsetBuffer);
      const runPipeline = (pipeline) => {
        const pass = encoder.beginComputePass();
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, this.bindGroup);
        pass.dispatchWorkgroups(this.particleCount / workgroupSize, 1, 1);
        pass.end();
      };
      runPipeline(this.pipelines[0]);
      this.sort(encoder);
      runPipeline(this.pipelines[1]);
      runPipeline(this.pipelines[2]);
      runPipeline(this.pipelines[3]);
      encoder.copyBufferToBuffer(this.particleDataBuffer1, this.particleDataBuffer0);
      encoder.copyBufferToBuffer(this.particleDataBuffer1, 0, this.renderInstanceBuffer, 0);
      const debugBuffer = window.DEBUG_BUF === 3 ? this.cellOffsetBuffer : window.DEBUG_BUF === 2 ? this.particleIdBuffer : window.DEBUG_BUF === 1 ? this.cellIndexBuffer : this.particleDataBuffer0;
      encoder.copyBufferToBuffer(debugBuffer, 0, this.resultBuffer, 0);
      const commandBuffer = encoder.finish();
      this.device.queue.submit([commandBuffer]);
      if (window.LOG_INSTANCE_DATA) {
        window.LOG_INSTANCE_DATA = false;
        await this.resultBuffer.mapAsync(GPUMapMode.READ);
        if (!window.DEBUG_BUF) {
          const result = new Float32Array(this.resultBuffer.getMappedRange());
          logInstanceData(result);
        } else {
          const result = new Uint32Array(this.resultBuffer.getMappedRange());
          console.log(result);
        }
        this.resultBuffer.unmap();
      }
    }
  };

  // src/ts/scene.ts
  var Scene = class {
    viewDistance = 84;
    viewMatrix = mat4.lookAt([0, 0, this.viewDistance], [0, 0, 0], [0, 1, 0]);
    viewProjectionMatrix = mat4.identity();
    viewAngles = vec2.create(0, 0);
    mouseCoord = vec2.create(0, 0);
    mouseDown = false;
    lastMouseCoord = vec2.create(0, 0);
    mouseIntersection = vec3.create(0, 0, 0);
    // intersection of mouse ray with z=0 plane
    lastMouseIntersection = vec3.create(0, 0, 0);
    constructor() {
      window.addEventListener("mousemove", (event) => {
        const rect = event.target.getBoundingClientRect();
        this.mouseCoord[0] = (event.clientX - rect.left) / rect.width * 2 - 1;
        this.mouseCoord[1] = -((event.clientY - rect.top) / rect.height * 2 - 1);
      });
      window.addEventListener("mousedown", (event) => {
        this.mouseDown = true;
      });
      window.addEventListener("mouseup", (event) => {
        this.mouseDown = false;
      });
      window.addEventListener("wheel", (event) => {
        this.viewDistance += 0.1 * this.viewDistance * (event.deltaY > 0 ? 1 : -1);
        this.viewDistance = Math.max(5, Math.min(200, this.viewDistance));
      });
    }
    createInitialParticleData(particleCount2) {
      const particleData = new Float32Array(particleCount2 * instanceDataLength);
      for (let i = 0; i < particleCount2; i++) {
        let pos = vec3.create(Math.random(), Math.random(), Math.random());
        pos = vec3.sub(pos, vec3.create(0.5, 0.5, 0.5));
        pos = vec3.multiply(pos, vec3.create(20, 100, 20));
        const letterX = [-2.05, -1.05, 0, 1, 2].map((x) => x * 40);
        const letter = Math.floor(Math.random() * letterX.length);
        const side = Math.random() > 0.5 ? 1 : -1;
        pos = vec3.add(pos, vec3.create(letterX[letter], 110 * side, 0));
        const startMaxSpeed = 20;
        let velocity = vec3.create(0, -20, 0);
        const normal = vec3.create(0, 1, 0);
        particleData.set([
          pos[0],
          pos[1],
          pos[2],
          1,
          velocity[0],
          velocity[1],
          velocity[2],
          1,
          normal[0],
          normal[1],
          normal[2],
          1,
          0,
          0,
          0,
          side
        ], i * instanceDataLength);
      }
      return particleData;
    }
    update(canvas) {
      if (this.mouseDown) {
        const deltaMouse = vec2.subtract(this.mouseCoord, this.lastMouseCoord);
        this.viewAngles[0] += deltaMouse[0] * 1.5;
        this.viewAngles[1] += deltaMouse[1] * -1;
      }
      let eye = vec3.create(0, 0, this.viewDistance);
      eye = vec3.rotateX(eye, vec3.zero(), this.viewAngles[1]);
      eye = vec3.rotateY(eye, vec3.zero(), this.viewAngles[0]);
      const viewMatrix = mat4.lookAt(eye, [0, 0, 0], [0, 1, 0]);
      const projMatrix = mat4.perspective(
        1,
        canvas.width / canvas.height,
        0.1,
        1e3
      );
      this.viewProjectionMatrix = mat4.multiply(projMatrix, viewMatrix);
      const nearClip = vec4.create(this.mouseCoord[0], this.mouseCoord[1], -1, 1);
      const farClip = vec4.create(this.mouseCoord[0], this.mouseCoord[1], 1, 1);
      const invVP = mat4.inverse(this.viewProjectionMatrix);
      let nearWorld = vec4.transformMat4(nearClip, invVP);
      let farWorld = vec4.transformMat4(farClip, invVP);
      nearWorld = vec3.create(nearWorld[0] / nearWorld[3], nearWorld[1] / nearWorld[3], nearWorld[2] / nearWorld[3]);
      farWorld = vec3.create(farWorld[0] / farWorld[3], farWorld[1] / farWorld[3], farWorld[2] / farWorld[3]);
      const rayOrigin = nearWorld;
      const rayDir = vec3.normalize(vec3.sub(farWorld, nearWorld));
      const t = -rayOrigin[2] / rayDir[2];
      this.lastMouseIntersection = this.mouseIntersection;
      this.mouseIntersection = vec3.add(rayOrigin, vec3.scale(rayDir, t));
      this.lastMouseCoord = vec2.clone(this.mouseCoord);
    }
  };

  // src/main.ts
  var particleCount = 1600 * workgroupSize;
  var scene = new Scene();
  var lastTime = Date.now();
  var frameCount = 0;
  var frameTimeSum = 0;
  function render(renderer, computer) {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1e3;
    lastTime = currentTime;
    frameCount++;
    frameTimeSum += deltaTime;
    if (window.LOG_FPS && frameCount % 100 == 0) {
      console.log("FPS ", 1 / (frameTimeSum / 100));
      frameTimeSum = 0;
    }
    scene.update(renderer.ctx.canvas);
    computer.run(Math.min(deltaTime, 0.1), scene.mouseIntersection, scene.lastMouseIntersection);
    renderer.render(scene.viewProjectionMatrix);
    requestAnimationFrame(() => render(renderer, computer));
  }
  async function main() {
    const renderer = new WGPURenderer();
    const success = await renderer.init();
    if (!success)
      return;
    const particleData = scene.createInitialParticleData(particleCount);
    renderer.createBuffersAndPipeline(particleCount);
    const computer = new WGPUComputer(renderer.device, particleCount, particleData, renderer.instanceBuffer);
    lastTime = Date.now();
    requestAnimationFrame(() => render(renderer, computer));
  }
  main();
})();
//# sourceMappingURL=bundle.js.map
