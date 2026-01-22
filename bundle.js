"use strict";(()=>{var Ft=Object.create;var mt=Object.defineProperty;var qt=Object.getOwnPropertyDescriptor;var Yt=Object.getOwnPropertyNames;var $t=Object.getPrototypeOf,Ht=Object.prototype.hasOwnProperty;var Vt=(l,v)=>()=>(v||l((v={exports:{}}).exports,v),v.exports);var Zt=(l,v,T,R)=>{if(v&&typeof v=="object"||typeof v=="function")for(let A of Yt(v))!Ht.call(l,A)&&A!==T&&mt(l,A,{get:()=>v[A],enumerable:!(R=qt(v,A))||R.enumerable});return l};var jt=(l,v,T)=>(T=l!=null?Ft($t(l)):{},Zt(v||!l||!l.__esModule?mt(T,"default",{value:l,enumerable:!0}):T,l));var Wt=Vt((ct,Lt)=>{(function(l,v){typeof ct=="object"&&typeof Lt<"u"?v(ct):typeof define=="function"&&define.amd?define(["exports"],v):(l=typeof globalThis<"u"?globalThis:l||self,v(l.RadixSort={}))})(ct,(function(l){"use strict";function v(b,y){(y==null||y>b.length)&&(y=b.length);for(var x=0,O=Array(y);x<y;x++)O[x]=b[x];return O}function T(b){if(Array.isArray(b))return v(b)}function R(b,y,x){if(typeof b=="function"?b===y:b.has(y))return arguments.length<3?y:x;throw new TypeError("Private element is not present on this object")}function A(b,y){if(y.has(b))throw new TypeError("Cannot initialize the same private elements twice on an object")}function L(b,y){if(!(b instanceof y))throw new TypeError("Cannot call a class as a function")}function C(b,y){A(b,y),y.add(b)}function K(b,y){for(var x=0;x<y.length;x++){var O=y[x];O.enumerable=O.enumerable||!1,O.configurable=!0,"value"in O&&(O.writable=!0),Object.defineProperty(b,be(O.key),O)}}function F(b,y,x){return y&&K(b.prototype,y),x&&K(b,x),Object.defineProperty(b,"prototype",{writable:!1}),b}function Q(b,y,x){return(y=be(y))in b?Object.defineProperty(b,y,{value:x,enumerable:!0,configurable:!0,writable:!0}):b[y]=x,b}function V(b){if(typeof Symbol<"u"&&b[Symbol.iterator]!=null||b["@@iterator"]!=null)return Array.from(b)}function X(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ne(b,y){var x=Object.keys(b);if(Object.getOwnPropertySymbols){var O=Object.getOwnPropertySymbols(b);y&&(O=O.filter(function(U){return Object.getOwnPropertyDescriptor(b,U).enumerable})),x.push.apply(x,O)}return x}function he(b){for(var y=1;y<arguments.length;y++){var x=arguments[y]!=null?arguments[y]:{};y%2?ne(Object(x),!0).forEach(function(O){Q(b,O,x[O])}):Object.getOwnPropertyDescriptors?Object.defineProperties(b,Object.getOwnPropertyDescriptors(x)):ne(Object(x)).forEach(function(O){Object.defineProperty(b,O,Object.getOwnPropertyDescriptor(x,O))})}return b}function te(b){return T(b)||V(b)||Ue(b)||X()}function _e(b,y){if(typeof b!="object"||!b)return b;var x=b[Symbol.toPrimitive];if(x!==void 0){var O=x.call(b,y||"default");if(typeof O!="object")return O;throw new TypeError("@@toPrimitive must return a primitive value.")}return(y==="string"?String:Number)(b)}function be(b){var y=_e(b,"string");return typeof y=="symbol"?y:y+""}function Ue(b,y){if(b){if(typeof b=="string")return v(b,y);var x={}.toString.call(b).slice(8,-1);return x==="Object"&&b.constructor&&(x=b.constructor.name),x==="Map"||x==="Set"?Array.from(b):x==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(x)?v(b,y):void 0}}var ge=`

@group(0) @binding(0) var<storage, read_write> items: array<u32>;
@group(0) @binding(1) var<storage, read_write> blockSums: array<u32>;

override WORKGROUP_SIZE_X: u32;
override WORKGROUP_SIZE_Y: u32;
override THREADS_PER_WORKGROUP: u32;
override ITEMS_PER_WORKGROUP: u32;
override ELEMENT_COUNT: u32;

var<workgroup> temp: array<u32, ITEMS_PER_WORKGROUP*2>;

@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn reduce_downsweep(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) {
    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;
    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;
    let GID = WID + TID; // Global thread ID
    
    let ELM_TID = TID * 2; // Element pair local ID
    let ELM_GID = GID * 2; // Element pair global ID
    
    // Load input to shared memory
    temp[ELM_TID]     = select(items[ELM_GID], 0, ELM_GID >= ELEMENT_COUNT);
    temp[ELM_TID + 1] = select(items[ELM_GID + 1], 0, ELM_GID + 1 >= ELEMENT_COUNT);

    var offset: u32 = 1;

    // Up-sweep (reduce) phase
    for (var d: u32 = ITEMS_PER_WORKGROUP >> 1; d > 0; d >>= 1) {
        workgroupBarrier();

        if (TID < d) {
            var ai: u32 = offset * (ELM_TID + 1) - 1;
            var bi: u32 = offset * (ELM_TID + 2) - 1;
            temp[bi] += temp[ai];
        }

        offset *= 2;
    }

    // Save workgroup sum and clear last element
    if (TID == 0) {
        let last_offset = ITEMS_PER_WORKGROUP - 1;

        blockSums[WORKGROUP_ID] = temp[last_offset];
        temp[last_offset] = 0;
    }

    // Down-sweep phase
    for (var d: u32 = 1; d < ITEMS_PER_WORKGROUP; d *= 2) {
        offset >>= 1;
        workgroupBarrier();

        if (TID < d) {
            var ai: u32 = offset * (ELM_TID + 1) - 1;
            var bi: u32 = offset * (ELM_TID + 2) - 1;

            let t: u32 = temp[ai];
            temp[ai] = temp[bi];
            temp[bi] += t;
        }
    }
    workgroupBarrier();

    // Copy result from shared memory to global memory
    if (ELM_GID >= ELEMENT_COUNT) {
        return;
    }
    items[ELM_GID] = temp[ELM_TID];

    if (ELM_GID + 1 >= ELEMENT_COUNT) {
        return;
    }
    items[ELM_GID + 1] = temp[ELM_TID + 1];
}

@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn add_block_sums(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) {
    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;
    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;
    let GID = WID + TID; // Global thread ID

    let ELM_ID = GID * 2;

    if (ELM_ID >= ELEMENT_COUNT) {
        return;
    }

    let blockSum = blockSums[WORKGROUP_ID];

    items[ELM_ID] += blockSum;

    if (ELM_ID + 1 >= ELEMENT_COUNT) {
        return;
    }

    items[ELM_ID + 1] += blockSum;
}`,ae=`

@group(0) @binding(0) var<storage, read_write> items: array<u32>;
@group(0) @binding(1) var<storage, read_write> blockSums: array<u32>;

override WORKGROUP_SIZE_X: u32;
override WORKGROUP_SIZE_Y: u32;
override THREADS_PER_WORKGROUP: u32;
override ITEMS_PER_WORKGROUP: u32;
override ELEMENT_COUNT: u32;

const NUM_BANKS: u32 = 32;
const LOG_NUM_BANKS: u32 = 5;

fn get_offset(offset: u32) -> u32 {
    // return offset >> LOG_NUM_BANKS; // Conflict-free
    return (offset >> NUM_BANKS) + (offset >> (2 * LOG_NUM_BANKS)); // Zero bank conflict
}

var<workgroup> temp: array<u32, ITEMS_PER_WORKGROUP*2>;

@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn reduce_downsweep(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) {
    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;
    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;
    let GID = WID + TID; // Global thread ID
    
    let ELM_TID = TID * 2; // Element pair local ID
    let ELM_GID = GID * 2; // Element pair global ID
    
    // Load input to shared memory
    let ai: u32 = TID;
    let bi: u32 = TID + (ITEMS_PER_WORKGROUP >> 1);
    let s_ai = ai + get_offset(ai);
    let s_bi = bi + get_offset(bi);
    let g_ai = ai + WID * 2;
    let g_bi = bi + WID * 2;
    temp[s_ai] = select(items[g_ai], 0, g_ai >= ELEMENT_COUNT);
    temp[s_bi] = select(items[g_bi], 0, g_bi >= ELEMENT_COUNT);

    var offset: u32 = 1;

    // Up-sweep (reduce) phase
    for (var d: u32 = ITEMS_PER_WORKGROUP >> 1; d > 0; d >>= 1) {
        workgroupBarrier();

        if (TID < d) {
            var ai: u32 = offset * (ELM_TID + 1) - 1;
            var bi: u32 = offset * (ELM_TID + 2) - 1;
            ai += get_offset(ai);
            bi += get_offset(bi);
            temp[bi] += temp[ai];
        }

        offset *= 2;
    }

    // Save workgroup sum and clear last element
    if (TID == 0) {
        var last_offset = ITEMS_PER_WORKGROUP - 1;
        last_offset += get_offset(last_offset);

        blockSums[WORKGROUP_ID] = temp[last_offset];
        temp[last_offset] = 0;
    }

    // Down-sweep phase
    for (var d: u32 = 1; d < ITEMS_PER_WORKGROUP; d *= 2) {
        offset >>= 1;
        workgroupBarrier();

        if (TID < d) {
            var ai: u32 = offset * (ELM_TID + 1) - 1;
            var bi: u32 = offset * (ELM_TID + 2) - 1;
            ai += get_offset(ai);
            bi += get_offset(bi);

            let t: u32 = temp[ai];
            temp[ai] = temp[bi];
            temp[bi] += t;
        }
    }
    workgroupBarrier();

    // Copy result from shared memory to global memory
    if (g_ai < ELEMENT_COUNT) {
        items[g_ai] = temp[s_ai];
    }
    if (g_bi < ELEMENT_COUNT) {
        items[g_bi] = temp[s_bi];
    }
}

@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn add_block_sums(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) {
    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;
    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;
    let GID = WID + TID; // Global thread ID

    let ELM_ID = GID * 2;

    if (ELM_ID >= ELEMENT_COUNT) {
        return;
    }

    let blockSum = blockSums[WORKGROUP_ID];

    items[ELM_ID] += blockSum;

    if (ELM_ID + 1 >= ELEMENT_COUNT) {
        return;
    }

    items[ELM_ID + 1] += blockSum;
}`;function fe(b,y){var x={x:y,y:1};if(y>b.limits.maxComputeWorkgroupsPerDimension){var O=Math.floor(Math.sqrt(y)),U=Math.ceil(y/O);x.x=O,x.y=U}return x}function re(b){var y=b.device,x=b.label,O=b.data,U=b.usage,G=U===void 0?0:U,w=y.createBuffer({label:x,usage:G,size:O.length*4,mappedAtCreation:!0}),D=new Uint32Array(w.getMappedRange());return D.set(O),w.unmap(),w}var we=(function(){function b(y){var x=y.device,O=y.data,U=y.count,G=y.workgroup_size,w=G===void 0?{x:16,y:16}:G,D=y.avoid_bank_conflicts,u=D===void 0?!1:D;if(L(this,b),this.device=x,this.workgroup_size=w,this.threads_per_workgroup=w.x*w.y,this.items_per_workgroup=2*this.threads_per_workgroup,Math.log2(this.threads_per_workgroup)%1!==0)throw new Error("workgroup_size.x * workgroup_size.y must be a power of two. (current: ".concat(this.threads_per_workgroup,")"));this.pipelines=[],this.shaderModule=this.device.createShaderModule({label:"prefix-sum",code:u?ae:ge}),this.create_pass_recursive(O,U)}return F(b,[{key:"create_pass_recursive",value:function(x,O){var U=Math.ceil(O/this.items_per_workgroup),G=fe(this.device,U),w=this.device.createBuffer({label:"prefix-sum-block-sum",size:U*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),D=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=this.device.createBindGroup({label:"prefix-sum-bind-group",layout:D,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:w}}]}),t=this.device.createPipelineLayout({bindGroupLayouts:[D]}),o=this.device.createComputePipeline({label:"prefix-sum-scan-pipeline",layout:t,compute:{module:this.shaderModule,entryPoint:"reduce_downsweep",constants:{WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y,THREADS_PER_WORKGROUP:this.threads_per_workgroup,ITEMS_PER_WORKGROUP:this.items_per_workgroup,ELEMENT_COUNT:O}}});if(this.pipelines.push({pipeline:o,bindGroup:u,dispatchSize:G}),U>1){this.create_pass_recursive(w,U);var r=this.device.createComputePipeline({label:"prefix-sum-add-block-pipeline",layout:t,compute:{module:this.shaderModule,entryPoint:"add_block_sums",constants:{WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y,THREADS_PER_WORKGROUP:this.threads_per_workgroup,ELEMENT_COUNT:O}}});this.pipelines.push({pipeline:r,bindGroup:u,dispatchSize:G})}}},{key:"get_dispatch_chain",value:function(){return this.pipelines.flatMap(function(x){return[x.dispatchSize.x,x.dispatchSize.y,1]})}},{key:"dispatch",value:function(x,O){for(var U=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,G=0;G<this.pipelines.length;G++){var w=this.pipelines[G],D=w.pipeline,u=w.bindGroup,t=w.dispatchSize;x.setPipeline(D),x.setBindGroup(0,u),O==null?x.dispatchWorkgroups(t.x,t.y,1):x.dispatchWorkgroupsIndirect(O,U+G*3*4)}}}])})(),Te=`

@group(0) @binding(0) var<storage, read> input: array<u32>;
@group(0) @binding(1) var<storage, read_write> local_prefix_sums: array<u32>;
@group(0) @binding(2) var<storage, read_write> block_sums: array<u32>;

override WORKGROUP_COUNT: u32;
override THREADS_PER_WORKGROUP: u32;
override WORKGROUP_SIZE_X: u32;
override WORKGROUP_SIZE_Y: u32;
override CURRENT_BIT: u32;
override ELEMENT_COUNT: u32;

var<workgroup> s_prefix_sum: array<u32, 2 * (THREADS_PER_WORKGROUP + 1)>;

@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn radix_sort(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) {
    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;
    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;
    let GID = WID + TID; // Global thread ID

    // Extract 2 bits from the input
    let elm = select(input[GID], 0, GID >= ELEMENT_COUNT);
    let extract_bits: u32 = (elm >> CURRENT_BIT) & 0x3;

    var bit_prefix_sums = array<u32, 4>(0, 0, 0, 0);

    // If the workgroup is inactive, prevent block_sums buffer update
    var LAST_THREAD: u32 = 0xffffffff; 

    if (WORKGROUP_ID < WORKGROUP_COUNT) {
        // Otherwise store the index of the last active thread in the workgroup
        LAST_THREAD = min(THREADS_PER_WORKGROUP, ELEMENT_COUNT - WID) - 1;
    }

    // Initialize parameters for double-buffering
    let TPW = THREADS_PER_WORKGROUP + 1;
    var swapOffset: u32 = 0;
    var inOffset:  u32 = TID;
    var outOffset: u32 = TID + TPW;

    // 4-way prefix sum
    for (var b: u32 = 0; b < 4; b++) {
        // Initialize local prefix with bitmask
        let bitmask = select(0u, 1u, extract_bits == b);
        s_prefix_sum[inOffset + 1] = bitmask;
        workgroupBarrier();

        var prefix_sum: u32 = 0;

        // Prefix sum
        for (var offset: u32 = 1; offset < THREADS_PER_WORKGROUP; offset *= 2) {
            if (TID >= offset) {
                prefix_sum = s_prefix_sum[inOffset] + s_prefix_sum[inOffset - offset];
            } else {
                prefix_sum = s_prefix_sum[inOffset];
            }

            s_prefix_sum[outOffset] = prefix_sum;
            
            // Swap buffers
            outOffset = inOffset;
            swapOffset = TPW - swapOffset;
            inOffset = TID + swapOffset;
            
            workgroupBarrier();
        }

        // Store prefix sum for current bit
        bit_prefix_sums[b] = prefix_sum;

        if (TID == LAST_THREAD) {
            // Store block sum to global memory
            let total_sum: u32 = prefix_sum + bitmask;
            block_sums[b * WORKGROUP_COUNT + WORKGROUP_ID] = total_sum;
        }

        // Swap buffers
        outOffset = inOffset;
        swapOffset = TPW - swapOffset;
        inOffset = TID + swapOffset;
    }

    if (GID < ELEMENT_COUNT) {
        // Store local prefix sum to global memory
        local_prefix_sums[GID] = bit_prefix_sums[extract_bits];
    }
}`,Oe=`

@group(0) @binding(0) var<storage, read_write> input: array<u32>;
@group(0) @binding(1) var<storage, read_write> local_prefix_sums: array<u32>;
@group(0) @binding(2) var<storage, read_write> block_sums: array<u32>;
@group(0) @binding(3) var<storage, read_write> values: array<u32>;

override WORKGROUP_COUNT: u32;
override THREADS_PER_WORKGROUP: u32;
override WORKGROUP_SIZE_X: u32;
override WORKGROUP_SIZE_Y: u32;
override CURRENT_BIT: u32;
override ELEMENT_COUNT: u32;

var<workgroup> s_prefix_sum: array<u32, 2 * (THREADS_PER_WORKGROUP + 1)>;
var<workgroup> s_prefix_sum_scan: array<u32, 4>;

@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn radix_sort(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) {
    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;
    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;
    let GID = WID + TID; // Global thread ID

    // Extract 2 bits from the input
    var elm: u32 = 0;
    var val: u32 = 0;
    if (GID < ELEMENT_COUNT) {
        elm = input[GID];
        val = values[GID];
    }
    let extract_bits: u32 = (elm >> CURRENT_BIT) & 0x3;

    var bit_prefix_sums = array<u32, 4>(0, 0, 0, 0);

    // If the workgroup is inactive, prevent block_sums buffer update
    var LAST_THREAD: u32 = 0xffffffff; 

    if (WORKGROUP_ID < WORKGROUP_COUNT) {
        // Otherwise store the index of the last active thread in the workgroup
        LAST_THREAD = min(THREADS_PER_WORKGROUP, ELEMENT_COUNT - WID) - 1;
    }

    // Initialize parameters for double-buffering
    let TPW = THREADS_PER_WORKGROUP + 1;
    var swapOffset: u32 = 0;
    var inOffset:  u32 = TID;
    var outOffset: u32 = TID + TPW;

    // 4-way prefix sum
    for (var b: u32 = 0; b < 4; b++) {
        // Initialize local prefix with bitmask
        let bitmask = select(0u, 1u, extract_bits == b);
        s_prefix_sum[inOffset + 1] = bitmask;
        workgroupBarrier();

        var prefix_sum: u32 = 0;

        // Prefix sum
        for (var offset: u32 = 1; offset < THREADS_PER_WORKGROUP; offset *= 2) {
            if (TID >= offset) {
                prefix_sum = s_prefix_sum[inOffset] + s_prefix_sum[inOffset - offset];
            } else {
                prefix_sum = s_prefix_sum[inOffset];
            }

            s_prefix_sum[outOffset] = prefix_sum;

            // Swap buffers
            outOffset = inOffset;
            swapOffset = TPW - swapOffset;
            inOffset = TID + swapOffset;
            
            workgroupBarrier();
        }

        // Store prefix sum for current bit
        bit_prefix_sums[b] = prefix_sum;

        if (TID == LAST_THREAD) {
            // Store block sum to global memory
            let total_sum: u32 = prefix_sum + bitmask;
            block_sums[b * WORKGROUP_COUNT + WORKGROUP_ID] = total_sum;
        }

        // Swap buffers
        outOffset = inOffset;
        swapOffset = TPW - swapOffset;
        inOffset = TID + swapOffset;
    }

    let prefix_sum = bit_prefix_sums[extract_bits];   

    // Scan bit prefix sums
    if (TID == LAST_THREAD) {
        var sum: u32 = 0;
        bit_prefix_sums[extract_bits] += 1;
        for (var i: u32 = 0; i < 4; i++) {
            s_prefix_sum_scan[i] = sum;
            sum += bit_prefix_sums[i];
        }
    }
    workgroupBarrier();

    if (GID < ELEMENT_COUNT) {
        // Compute new position
        let new_pos: u32 = prefix_sum + s_prefix_sum_scan[extract_bits];

        // Shuffle elements locally
        input[WID + new_pos] = elm;
        values[WID + new_pos] = val;
        local_prefix_sums[WID + new_pos] = prefix_sum;
    }
}`,ve=`

@group(0) @binding(0) var<storage, read> inputKeys: array<u32>;
@group(0) @binding(1) var<storage, read_write> outputKeys: array<u32>;
@group(0) @binding(2) var<storage, read> local_prefix_sum: array<u32>;
@group(0) @binding(3) var<storage, read> prefix_block_sum: array<u32>;
@group(0) @binding(4) var<storage, read> inputValues: array<u32>;
@group(0) @binding(5) var<storage, read_write> outputValues: array<u32>;

override WORKGROUP_COUNT: u32;
override THREADS_PER_WORKGROUP: u32;
override WORKGROUP_SIZE_X: u32;
override WORKGROUP_SIZE_Y: u32;
override CURRENT_BIT: u32;
override ELEMENT_COUNT: u32;

@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn radix_sort_reorder(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) { 
    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;
    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP;
    let GID = WID + TID; // Global thread ID

    if (GID >= ELEMENT_COUNT) {
        return;
    }

    let k = inputKeys[GID];
    let v = inputValues[GID];

    let local_prefix = local_prefix_sum[GID];

    // Calculate new position
    let extract_bits = (k >> CURRENT_BIT) & 0x3;
    let pid = extract_bits * WORKGROUP_COUNT + WORKGROUP_ID;
    let sorted_position = prefix_block_sum[pid] + local_prefix;
    
    outputKeys[sorted_position] = k;
    outputValues[sorted_position] = v;
}`,se=function(){var y=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1,x=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,O=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"full";return`

@group(0) @binding(0) var<storage, read> input: array<u32>;
@group(0) @binding(1) var<storage, read_write> output: array<u32>;
@group(0) @binding(2) var<storage, read> original: array<u32>;
@group(0) @binding(3) var<storage, read_write> is_sorted: u32;

override WORKGROUP_SIZE_X: u32;
override WORKGROUP_SIZE_Y: u32;
override THREADS_PER_WORKGROUP: u32;
override ELEMENT_COUNT: u32;
override START_ELEMENT: u32;

var<workgroup> s_data: array<u32, THREADS_PER_WORKGROUP>;

// Reset dispatch buffer and is_sorted flag
@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn reset(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) {
    if (TID >= ELEMENT_COUNT) {
        return;
    }

    if (TID == 0) {
        is_sorted = 0u;
    }

    let ELM_ID = TID * 3;

    output[ELM_ID] = original[ELM_ID];
}

@compute @workgroup_size(WORKGROUP_SIZE_X, WORKGROUP_SIZE_Y, 1)
fn check_sort(
    @builtin(workgroup_id) w_id: vec3<u32>,
    @builtin(num_workgroups) w_dim: vec3<u32>,
    @builtin(local_invocation_index) TID: u32, // Local thread ID
) {
    let WORKGROUP_ID = w_id.x + w_id.y * w_dim.x;
    let WID = WORKGROUP_ID * THREADS_PER_WORKGROUP + START_ELEMENT;
    let GID = TID + WID; // Global thread ID

    // Load data into shared memory
    `.concat(y?le:"s_data[TID] = select(0u, input[GID], GID < ELEMENT_COUNT);",`

    // Perform parallel reduction
    for (var d = 1u; d < THREADS_PER_WORKGROUP; d *= 2u) {      
        workgroupBarrier();  
        if (TID % (2u * d) == 0u) {
            s_data[TID] += s_data[TID + d];
        }
    }
    workgroupBarrier();

    // Write reduction result
    `).concat(x?ke(O):Ge,`
}`)},Ge=`
    if (TID == 0) {
        output[WORKGROUP_ID] = s_data[0];
    }
`,le=`
    let LAST_THREAD = min(THREADS_PER_WORKGROUP, ELEMENT_COUNT - WID) - 1;

    // Load current element into shared memory
    // Also load next element for comparison
    let elm = select(0u, input[GID], GID < ELEMENT_COUNT);
    let next = select(0u, input[GID + 1], GID < ELEMENT_COUNT-1);
    s_data[TID] = elm;
    workgroupBarrier();

    s_data[TID] = select(0u, 1u, GID < ELEMENT_COUNT-1 && elm > next);
`,ke=function(y){return`
    let fullDispatchLength = arrayLength(&output);
    let dispatchIndex = TID * 3;

    if (dispatchIndex >= fullDispatchLength) {
        return;
    }

    `.concat(y=="full"?$:ue,`
`)},ue=`
    output[dispatchIndex] = select(0, original[dispatchIndex], s_data[0] == 0 && is_sorted == 0u);
`,$=`
    if (TID == 0 && s_data[0] == 0) {
        is_sorted = 1u;
    }

    output[dispatchIndex] = select(0, original[dispatchIndex], s_data[0] != 0);
`,q=(function(){function b(y){var x=y.device,O=y.data,U=y.result,G=y.original,w=y.is_sorted,D=y.count,u=y.start,t=u===void 0?0:u,o=y.mode,r=o===void 0?"full":o,f=y.workgroup_size,d=f===void 0?{x:16,y:16}:f;L(this,b),this.device=x,this.count=D,this.start=t,this.mode=r,this.workgroup_size=d,this.threads_per_workgroup=d.x*d.y,this.pipelines=[],this.buffers={data:O,result:U,original:G,is_sorted:w,outputs:[]},this.create_passes_recursive(O,D)}return F(b,[{key:"create_passes_recursive",value:function(x,O){var U=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,G=Math.ceil(O/this.threads_per_workgroup),w=U===0,D=G<=1,u="check-sort-".concat(this.mode,"-").concat(U),t=D?this.buffers.result:this.device.createBuffer({label:u,size:G*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),o=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}].concat(te(D?[{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]:[]))}),r=this.device.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:t}}].concat(te(D?[{binding:2,resource:{buffer:this.buffers.original}},{binding:3,resource:{buffer:this.buffers.is_sorted}}]:[]))}),f=this.device.createPipelineLayout({bindGroupLayouts:[o]}),d=w?this.start+O:O,_=w?this.start:0,g=this.device.createComputePipeline({layout:f,compute:{module:this.device.createShaderModule({label:u,code:se(w,D,this.mode)}),entryPoint:this.mode=="reset"?"reset":"check_sort",constants:he({ELEMENT_COUNT:d,WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y},this.mode!="reset"&&{THREADS_PER_WORKGROUP:this.threads_per_workgroup,START_ELEMENT:_})}});this.buffers.outputs.push(t),this.pipelines.push({pipeline:g,bindGroup:r}),D||this.create_passes_recursive(t,G,U+1)}},{key:"dispatch",value:function(x,O){for(var U=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,G=0;G<this.pipelines.length;G++){var w=this.pipelines[G],D=w.pipeline,u=w.bindGroup,t=this.mode!="reset"&&(this.mode=="full"||G<this.pipelines.length-1);x.setPipeline(D),x.setBindGroup(0,u),t?x.dispatchWorkgroupsIndirect(O,U+G*3*4):x.dispatchWorkgroups(1,1,1)}}}],[{key:"find_optimal_dispatch_chain",value:function(x,O,U){var G=U.x*U.y,w=[];do{var D=Math.ceil(O/G),u=fe(x,D);w.push(u.x,u.y,1),O=D}while(O>1);return w}}])})(),Y=new WeakSet,pe=(function(){function b(){var y=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},x=y.device,O=y.keys,U=y.values,G=y.count,w=y.bit_count,D=w===void 0?32:w,u=y.workgroup_size,t=u===void 0?{x:16,y:16}:u,o=y.check_order,r=o===void 0?!1:o,f=y.local_shuffle,d=f===void 0?!1:f,_=y.avoid_bank_conflicts,g=_===void 0?!1:_;if(L(this,b),C(this,Y),x==null)throw new Error("No device provided");if(O==null)throw new Error("No keys buffer provided");if(!Number.isInteger(G)||G<=0)throw new Error("Invalid count parameter");if(!Number.isInteger(D)||D<=0||D>32)throw new Error("Invalid bit_count parameter: ".concat(D));if(!Number.isInteger(t.x)||!Number.isInteger(t.y))throw new Error("Invalid workgroup_size parameter");if(D%4!=0)throw new Error("bit_count must be a multiple of 4");this.device=x,this.count=G,this.bit_count=D,this.workgroup_size=t,this.check_order=r,this.local_shuffle=d,this.avoid_bank_conflicts=g,this.threads_per_workgroup=t.x*t.y,this.workgroup_count=Math.ceil(G/this.threads_per_workgroup),this.prefix_block_workgroup_count=4*this.workgroup_count,this.has_values=U!=null,this.dispatchSize={},this.shaderModules={},this.kernels={},this.pipelines=[],this.buffers={keys:O,values:U},this.create_shader_modules(),this.create_pipelines()}return F(b,[{key:"create_shader_modules",value:function(){var x=function(G){return G.split(`
`).filter(function(w){return!w.toLowerCase().includes("values")}).join(`
`)},O=this.local_shuffle?Oe:Te;this.shaderModules={blockSum:this.device.createShaderModule({label:"radix-sort-block-sum",code:this.has_values?O:x(O)}),reorder:this.device.createShaderModule({label:"radix-sort-reorder",code:this.has_values?ve:x(ve)})}}},{key:"create_pipelines",value:function(){this.create_prefix_sum_kernel();var x=this.calculate_dispatch_sizes();this.create_buffers(x),this.create_check_sort_kernels(x);for(var O=0;O<this.bit_count;O+=2){var U=O%4==0,G=U?this.buffers.keys:this.buffers.tmpKeys,w=U?this.buffers.values:this.buffers.tmpValues,D=U?this.buffers.tmpKeys:this.buffers.keys,u=U?this.buffers.tmpValues:this.buffers.values,t=this.create_block_sum_pipeline(G,w,O),o=this.create_reorder_pipeline(G,w,D,u,O);this.pipelines.push({blockSumPipeline:t,reorderPipeline:o})}}},{key:"create_prefix_sum_kernel",value:function(){var x=this.device.createBuffer({label:"radix-sort-prefix-block-sum",size:this.prefix_block_workgroup_count*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),O=new we({device:this.device,data:x,count:this.prefix_block_workgroup_count,workgroup_size:this.workgroup_size,avoid_bank_conflicts:this.avoid_bank_conflicts});this.kernels.prefixSum=O,this.buffers.prefixBlockSum=x}},{key:"calculate_dispatch_sizes",value:function(){var x=fe(this.device,this.workgroup_count),O=this.kernels.prefixSum.get_dispatch_chain(),U=Math.min(this.count,this.threads_per_workgroup*4),G=this.count-U,w=U-1,D=q.find_optimal_dispatch_chain(this.device,U,this.workgroup_size),u=q.find_optimal_dispatch_chain(this.device,G,this.workgroup_size),t=[x.x,x.y,1].concat(te(D.slice(0,3)),te(O));return this.dispatchOffsets={radix_sort:0,check_sort_fast:12,prefix_sum:24},this.dispatchSize=x,this.initialDispatch=t,{initialDispatch:t,dispatchSizesFull:u,check_sort_fast_count:U,check_sort_full_count:G,start_full:w}}},{key:"create_buffers",value:function(x){var O=this.device.createBuffer({label:"radix-sort-tmp-keys",size:this.count*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),U=this.has_values?this.device.createBuffer({label:"radix-sort-tmp-values",size:this.count*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}):null,G=this.device.createBuffer({label:"radix-sort-local-prefix-sum",size:this.count*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});if(this.buffers.tmpKeys=O,this.buffers.tmpValues=U,this.buffers.localPrefixSum=G,!!this.check_order){var w=re({device:this.device,label:"radix-sort-dispatch-size",data:x.initialDispatch,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.INDIRECT}),D=re({device:this.device,label:"radix-sort-dispatch-size-original",data:x.initialDispatch,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),u=re({label:"check-sort-full-dispatch-size",device:this.device,data:x.dispatchSizesFull,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.INDIRECT}),t=re({label:"check-sort-full-dispatch-size-original",device:this.device,data:x.dispatchSizesFull,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),o=re({label:"is-sorted",device:this.device,data:new Uint32Array([0]),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});this.buffers.dispatchSize=w,this.buffers.originalDispatchSize=D,this.buffers.checkSortFullDispatchSize=u,this.buffers.originalCheckSortFullDispatchSize=t,this.buffers.isSorted=o}}},{key:"create_check_sort_kernels",value:function(x){if(this.check_order){var O=x.check_sort_fast_count,U=x.check_sort_full_count,G=x.start_full,w=new q({mode:"full",device:this.device,data:this.buffers.keys,result:this.buffers.dispatchSize,original:this.buffers.originalDispatchSize,is_sorted:this.buffers.isSorted,count:U,start:G,workgroup_size:this.workgroup_size}),D=new q({mode:"fast",device:this.device,data:this.buffers.keys,result:this.buffers.checkSortFullDispatchSize,original:this.buffers.originalCheckSortFullDispatchSize,is_sorted:this.buffers.isSorted,count:O,workgroup_size:this.workgroup_size}),u=this.initialDispatch.length/3;if(D.threads_per_workgroup<w.pipelines.length||w.threads_per_workgroup<u){console.warn("Warning: workgroup size is too small to enable check sort optimization, disabling..."),this.check_order=!1;return}var t=new q({mode:"reset",device:this.device,data:this.buffers.keys,original:this.buffers.originalDispatchSize,result:this.buffers.dispatchSize,is_sorted:this.buffers.isSorted,count:u,workgroup_size:fe(this.device,u)});this.kernels.checkSort={reset:t,fast:D,full:w}}}},{key:"create_block_sum_pipeline",value:function(x,O,U){var G=this.device.createBindGroupLayout({label:"radix-sort-block-sum",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:this.local_shuffle?"storage":"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}].concat(te(this.local_shuffle&&this.has_values?[{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]:[]))}),w=this.device.createBindGroup({layout:G,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:this.buffers.localPrefixSum}},{binding:2,resource:{buffer:this.buffers.prefixBlockSum}}].concat(te(this.local_shuffle&&this.has_values?[{binding:3,resource:{buffer:O}}]:[]))}),D=this.device.createPipelineLayout({bindGroupLayouts:[G]}),u=this.device.createComputePipeline({label:"radix-sort-block-sum",layout:D,compute:{module:this.shaderModules.blockSum,entryPoint:"radix_sort",constants:{WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y,WORKGROUP_COUNT:this.workgroup_count,THREADS_PER_WORKGROUP:this.threads_per_workgroup,ELEMENT_COUNT:this.count,CURRENT_BIT:U}}});return{pipeline:u,bindGroup:w}}},{key:"create_reorder_pipeline",value:function(x,O,U,G,w){var D=this.device.createBindGroupLayout({label:"radix-sort-reorder",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}].concat(te(this.has_values?[{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]:[]))}),u=this.device.createBindGroup({layout:D,entries:[{binding:0,resource:{buffer:x}},{binding:1,resource:{buffer:U}},{binding:2,resource:{buffer:this.buffers.localPrefixSum}},{binding:3,resource:{buffer:this.buffers.prefixBlockSum}}].concat(te(this.has_values?[{binding:4,resource:{buffer:O}},{binding:5,resource:{buffer:G}}]:[]))}),t=this.device.createPipelineLayout({bindGroupLayouts:[D]}),o=this.device.createComputePipeline({label:"radix-sort-reorder",layout:t,compute:{module:this.shaderModules.reorder,entryPoint:"radix_sort_reorder",constants:{WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y,WORKGROUP_COUNT:this.workgroup_count,THREADS_PER_WORKGROUP:this.threads_per_workgroup,ELEMENT_COUNT:this.count,CURRENT_BIT:w}}});return{pipeline:o,bindGroup:u}}},{key:"dispatch",value:function(x){this.check_order?R(Y,this,J).call(this,x):R(Y,this,ze).call(this,x)}}])})();function ze(b){for(var y=0;y<this.bit_count/2;y++){var x=this.pipelines[y],O=x.blockSumPipeline,U=x.reorderPipeline;b.setPipeline(O.pipeline),b.setBindGroup(0,O.bindGroup),b.dispatchWorkgroups(this.dispatchSize.x,this.dispatchSize.y,1),this.kernels.prefixSum.dispatch(b),b.setPipeline(U.pipeline),b.setBindGroup(0,U.bindGroup),b.dispatchWorkgroups(this.dispatchSize.x,this.dispatchSize.y,1)}}function J(b){this.kernels.checkSort.reset.dispatch(b);for(var y=0;y<this.bit_count/2;y++){var x=this.pipelines[y],O=x.blockSumPipeline,U=x.reorderPipeline;y%2==0&&(this.kernels.checkSort.fast.dispatch(b,this.buffers.dispatchSize,this.dispatchOffsets.check_sort_fast),this.kernels.checkSort.full.dispatch(b,this.buffers.checkSortFullDispatchSize)),b.setPipeline(O.pipeline),b.setBindGroup(0,O.bindGroup),b.dispatchWorkgroupsIndirect(this.buffers.dispatchSize,this.dispatchOffsets.radix_sort),this.kernels.prefixSum.dispatch(b,this.buffers.dispatchSize,this.dispatchOffsets.prefix_sum),b.setPipeline(U.pipeline),b.setBindGroup(0,U.bindGroup),b.dispatchWorkgroupsIndirect(this.buffers.dispatchSize,this.dispatchOffsets.radix_sort)}}l.PrefixSumKernel=we,l.RadixSortKernel=pe}))});var Dt=`
struct Uniforms {
  viewProjectionMatrix : mat4x4<f32>,
  invVPMatrix : mat4x4<f32>,
  backgroundColour: vec4<f32>,
  camPos: vec3<f32>,
  aspectRatio : f32,
}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) colour : vec4f,
  @location(1) uv : vec2f,
  @location(2) worldPos: vec3f,
  @location(3) normal: vec3f,
  @location(4) fadeFac: f32,
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
  var position = instance.position;

  // // WARP PARTICLE POSITION
  // const R = 100.0;
  // let theta = position.x / R;
  
  // // base arc point (radius R)
  // let bx = R * sin(theta);
  // let bz = R * (1.0 - cos(theta));

  // // apply radial offset
  // position.x = bx + position.z * sin(theta);
  // position.z = bz + position.z * -cos(theta);


  output.position = uniforms.viewProjectionMatrix * position;

  // SCREEN SPACE SIZE PARTICLES (zoom invariant)
  // const particleSize = 0.003;
  // let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize) * output.position.w;

  // WORLD SPACE SIZE PARTICLES
  const particleSize = 1.0;
  let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize);
  

  output.position += vec4f(vertPos, 0., 0.);
  output.worldPos = (uniforms.invVPMatrix * output.position).xyz;

  const baseColor1 = vec4f(0.3, 0.7, 0.8, 1.0);
  const baseColor2 = vec4f(0.0, 0.3, 0.8, 1.0);
  output.colour = mix(baseColor1, baseColor2, 0.5*instance.group + 0.5);

  // // SHADE COLLISIONS
  // const densityRange = 0.1; // density scalar will vary for density values in range [1, 1+densityRange]
  // let densityScalar = saturate((instance.density - 1.1)/densityRange); // 0 for no collisions, 1 for big collision
  // var colour = (1.0-densityScalar) * baseColor1 + densityScalar * baseColor2;


  // FADE PARTICLES IN AT THE START
  const startFadeY = 40;
  const endFadeY = 20;
  output.fadeFac = saturate((abs(instance.position.y)-startFadeY)/(endFadeY-startFadeY));


  output.uv = vertex.uv;
  output.normal = instance.normal.xyz; // could use improvement so normal is not constant across all fragments

  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
  let uvLength = length(fragData.uv - vec2f(0.5, 0.5)) * 2.0;
  if (uvLength > 1.0) {
    discard;
  } 
  // smooth circle edge (need to switch on alpha blending)
  // const falloff = 5.0;
  // let alpha = clamp(falloff * (1.0 - uvLength), 0.0, 1.0);
  // return vec4f(fragData.colour.rgb * alpha, fragData.colour.a * alpha);


  const lightDir = normalize(vec3<f32>(0.1, 0.8, 1.0));

  // DIFFUSE SHADING
  const diffuseStrength = 0.5;
  let diffuseIntensity = diffuseStrength * dot(lightDir, fragData.normal) + 0.9 - diffuseStrength; 

  // SPECULAR SHADING
  let viewDir = normalize(uniforms.camPos - fragData.worldPos);
  
  const specularColour = vec4<f32>(1.0);
  const specularExponent = 50.0;
  let halfDir = normalize(normalize(lightDir) + viewDir);
  let specularIntensity = 0.3*pow(max(dot(fragData.normal, halfDir), 0.0), specularExponent);




  
  var colour = saturate(diffuseIntensity*fragData.colour + specularIntensity*specularColour);


  
  colour = mix(uniforms.backgroundColour, colour, fragData.fadeFac);

  return colour;
}

`;var yt=()=>{let l=[-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],v=[0,0,1,0,0,1,1,0,0,1,1,1],T=new Float32Array(l.length+v.length);for(let R=0;R<6;R++)T[5*R+0]=l[3*R+0],T[5*R+1]=l[3*R+1],T[5*R+2]=l[3*R+2],T[5*R+3]=v[2*R+0],T[5*R+4]=v[2*R+1];return T};function Xt(l,v){return class extends l{constructor(...T){super(...T),v(this)}}}var Qt=Xt(Array,l=>l.fill(0)),N=1e-6;function Jt(l){function v(d=0,_=0){let g=new l(2);return d!==void 0&&(g[0]=d,_!==void 0&&(g[1]=_)),g}let T=v;function R(d,_,g){let e=g??new l(2);return e[0]=d,e[1]=_,e}function A(d,_){let g=_??new l(2);return g[0]=Math.ceil(d[0]),g[1]=Math.ceil(d[1]),g}function L(d,_){let g=_??new l(2);return g[0]=Math.floor(d[0]),g[1]=Math.floor(d[1]),g}function C(d,_){let g=_??new l(2);return g[0]=Math.round(d[0]),g[1]=Math.round(d[1]),g}function K(d,_=0,g=1,e){let a=e??new l(2);return a[0]=Math.min(g,Math.max(_,d[0])),a[1]=Math.min(g,Math.max(_,d[1])),a}function F(d,_,g){let e=g??new l(2);return e[0]=d[0]+_[0],e[1]=d[1]+_[1],e}function Q(d,_,g,e){let a=e??new l(2);return a[0]=d[0]+_[0]*g,a[1]=d[1]+_[1]*g,a}function V(d,_){let g=d[0],e=d[1],a=_[0],s=_[1],i=Math.sqrt(g*g+e*e),n=Math.sqrt(a*a+s*s),c=i*n,h=c&&ve(d,_)/c;return Math.acos(h)}function X(d,_,g){let e=g??new l(2);return e[0]=d[0]-_[0],e[1]=d[1]-_[1],e}let ne=X;function he(d,_){return Math.abs(d[0]-_[0])<N&&Math.abs(d[1]-_[1])<N}function te(d,_){return d[0]===_[0]&&d[1]===_[1]}function _e(d,_,g,e){let a=e??new l(2);return a[0]=d[0]+g*(_[0]-d[0]),a[1]=d[1]+g*(_[1]-d[1]),a}function be(d,_,g,e){let a=e??new l(2);return a[0]=d[0]+g[0]*(_[0]-d[0]),a[1]=d[1]+g[1]*(_[1]-d[1]),a}function Ue(d,_,g){let e=g??new l(2);return e[0]=Math.max(d[0],_[0]),e[1]=Math.max(d[1],_[1]),e}function ge(d,_,g){let e=g??new l(2);return e[0]=Math.min(d[0],_[0]),e[1]=Math.min(d[1],_[1]),e}function ae(d,_,g){let e=g??new l(2);return e[0]=d[0]*_,e[1]=d[1]*_,e}let fe=ae;function re(d,_,g){let e=g??new l(2);return e[0]=d[0]/_,e[1]=d[1]/_,e}function we(d,_){let g=_??new l(2);return g[0]=1/d[0],g[1]=1/d[1],g}let Te=we;function Oe(d,_,g){let e=g??new l(3),a=d[0]*_[1]-d[1]*_[0];return e[0]=0,e[1]=0,e[2]=a,e}function ve(d,_){return d[0]*_[0]+d[1]*_[1]}function se(d){let _=d[0],g=d[1];return Math.sqrt(_*_+g*g)}let Ge=se;function le(d){let _=d[0],g=d[1];return _*_+g*g}let ke=le;function ue(d,_){let g=d[0]-_[0],e=d[1]-_[1];return Math.sqrt(g*g+e*e)}let $=ue;function q(d,_){let g=d[0]-_[0],e=d[1]-_[1];return g*g+e*e}let Y=q;function pe(d,_){let g=_??new l(2),e=d[0],a=d[1],s=Math.sqrt(e*e+a*a);return s>1e-5?(g[0]=e/s,g[1]=a/s):(g[0]=0,g[1]=0),g}function ze(d,_){let g=_??new l(2);return g[0]=-d[0],g[1]=-d[1],g}function J(d,_){let g=_??new l(2);return g[0]=d[0],g[1]=d[1],g}let b=J;function y(d,_,g){let e=g??new l(2);return e[0]=d[0]*_[0],e[1]=d[1]*_[1],e}let x=y;function O(d,_,g){let e=g??new l(2);return e[0]=d[0]/_[0],e[1]=d[1]/_[1],e}let U=O;function G(d=1,_){let g=_??new l(2),e=Math.random()*2*Math.PI;return g[0]=Math.cos(e)*d,g[1]=Math.sin(e)*d,g}function w(d){let _=d??new l(2);return _[0]=0,_[1]=0,_}function D(d,_,g){let e=g??new l(2),a=d[0],s=d[1];return e[0]=a*_[0]+s*_[4]+_[12],e[1]=a*_[1]+s*_[5]+_[13],e}function u(d,_,g){let e=g??new l(2),a=d[0],s=d[1];return e[0]=_[0]*a+_[4]*s+_[8],e[1]=_[1]*a+_[5]*s+_[9],e}function t(d,_,g,e){let a=e??new l(2),s=d[0]-_[0],i=d[1]-_[1],n=Math.sin(g),c=Math.cos(g);return a[0]=s*c-i*n+_[0],a[1]=s*n+i*c+_[1],a}function o(d,_,g){let e=g??new l(2);return pe(d,e),ae(e,_,e)}function r(d,_,g){let e=g??new l(2);return se(d)>_?o(d,_,e):J(d,e)}function f(d,_,g){let e=g??new l(2);return _e(d,_,.5,e)}return{create:v,fromValues:T,set:R,ceil:A,floor:L,round:C,clamp:K,add:F,addScaled:Q,angle:V,subtract:X,sub:ne,equalsApproximately:he,equals:te,lerp:_e,lerpV:be,max:Ue,min:ge,mulScalar:ae,scale:fe,divScalar:re,inverse:we,invert:Te,cross:Oe,dot:ve,length:se,len:Ge,lengthSq:le,lenSq:ke,distance:ue,dist:$,distanceSq:q,distSq:Y,normalize:pe,negate:ze,copy:J,clone:b,multiply:y,mul:x,divide:O,div:U,random:G,zero:w,transformMat4:D,transformMat3:u,rotate:t,setLength:o,truncate:r,midpoint:f}}var Pt=new Map;function Mt(l){let v=Pt.get(l);return v||(v=Jt(l),Pt.set(l,v)),v}function en(l){function v(n,c,h){let p=new l(3);return n!==void 0&&(p[0]=n,c!==void 0&&(p[1]=c,h!==void 0&&(p[2]=h))),p}let T=v;function R(n,c,h,p){let m=p??new l(3);return m[0]=n,m[1]=c,m[2]=h,m}function A(n,c){let h=c??new l(3);return h[0]=Math.ceil(n[0]),h[1]=Math.ceil(n[1]),h[2]=Math.ceil(n[2]),h}function L(n,c){let h=c??new l(3);return h[0]=Math.floor(n[0]),h[1]=Math.floor(n[1]),h[2]=Math.floor(n[2]),h}function C(n,c){let h=c??new l(3);return h[0]=Math.round(n[0]),h[1]=Math.round(n[1]),h[2]=Math.round(n[2]),h}function K(n,c=0,h=1,p){let m=p??new l(3);return m[0]=Math.min(h,Math.max(c,n[0])),m[1]=Math.min(h,Math.max(c,n[1])),m[2]=Math.min(h,Math.max(c,n[2])),m}function F(n,c,h){let p=h??new l(3);return p[0]=n[0]+c[0],p[1]=n[1]+c[1],p[2]=n[2]+c[2],p}function Q(n,c,h,p){let m=p??new l(3);return m[0]=n[0]+c[0]*h,m[1]=n[1]+c[1]*h,m[2]=n[2]+c[2]*h,m}function V(n,c){let h=n[0],p=n[1],m=n[2],P=c[0],S=c[1],E=c[2],I=Math.sqrt(h*h+p*p+m*m),M=Math.sqrt(P*P+S*S+E*E),k=I*M,W=k&&ve(n,c)/k;return Math.acos(W)}function X(n,c,h){let p=h??new l(3);return p[0]=n[0]-c[0],p[1]=n[1]-c[1],p[2]=n[2]-c[2],p}let ne=X;function he(n,c){return Math.abs(n[0]-c[0])<N&&Math.abs(n[1]-c[1])<N&&Math.abs(n[2]-c[2])<N}function te(n,c){return n[0]===c[0]&&n[1]===c[1]&&n[2]===c[2]}function _e(n,c,h,p){let m=p??new l(3);return m[0]=n[0]+h*(c[0]-n[0]),m[1]=n[1]+h*(c[1]-n[1]),m[2]=n[2]+h*(c[2]-n[2]),m}function be(n,c,h,p){let m=p??new l(3);return m[0]=n[0]+h[0]*(c[0]-n[0]),m[1]=n[1]+h[1]*(c[1]-n[1]),m[2]=n[2]+h[2]*(c[2]-n[2]),m}function Ue(n,c,h){let p=h??new l(3);return p[0]=Math.max(n[0],c[0]),p[1]=Math.max(n[1],c[1]),p[2]=Math.max(n[2],c[2]),p}function ge(n,c,h){let p=h??new l(3);return p[0]=Math.min(n[0],c[0]),p[1]=Math.min(n[1],c[1]),p[2]=Math.min(n[2],c[2]),p}function ae(n,c,h){let p=h??new l(3);return p[0]=n[0]*c,p[1]=n[1]*c,p[2]=n[2]*c,p}let fe=ae;function re(n,c,h){let p=h??new l(3);return p[0]=n[0]/c,p[1]=n[1]/c,p[2]=n[2]/c,p}function we(n,c){let h=c??new l(3);return h[0]=1/n[0],h[1]=1/n[1],h[2]=1/n[2],h}let Te=we;function Oe(n,c,h){let p=h??new l(3),m=n[2]*c[0]-n[0]*c[2],P=n[0]*c[1]-n[1]*c[0];return p[0]=n[1]*c[2]-n[2]*c[1],p[1]=m,p[2]=P,p}function ve(n,c){return n[0]*c[0]+n[1]*c[1]+n[2]*c[2]}function se(n){let c=n[0],h=n[1],p=n[2];return Math.sqrt(c*c+h*h+p*p)}let Ge=se;function le(n){let c=n[0],h=n[1],p=n[2];return c*c+h*h+p*p}let ke=le;function ue(n,c){let h=n[0]-c[0],p=n[1]-c[1],m=n[2]-c[2];return Math.sqrt(h*h+p*p+m*m)}let $=ue;function q(n,c){let h=n[0]-c[0],p=n[1]-c[1],m=n[2]-c[2];return h*h+p*p+m*m}let Y=q;function pe(n,c){let h=c??new l(3),p=n[0],m=n[1],P=n[2],S=Math.sqrt(p*p+m*m+P*P);return S>1e-5?(h[0]=p/S,h[1]=m/S,h[2]=P/S):(h[0]=0,h[1]=0,h[2]=0),h}function ze(n,c){let h=c??new l(3);return h[0]=-n[0],h[1]=-n[1],h[2]=-n[2],h}function J(n,c){let h=c??new l(3);return h[0]=n[0],h[1]=n[1],h[2]=n[2],h}let b=J;function y(n,c,h){let p=h??new l(3);return p[0]=n[0]*c[0],p[1]=n[1]*c[1],p[2]=n[2]*c[2],p}let x=y;function O(n,c,h){let p=h??new l(3);return p[0]=n[0]/c[0],p[1]=n[1]/c[1],p[2]=n[2]/c[2],p}let U=O;function G(n=1,c){let h=c??new l(3),p=Math.random()*2*Math.PI,m=Math.random()*2-1,P=Math.sqrt(1-m*m)*n;return h[0]=Math.cos(p)*P,h[1]=Math.sin(p)*P,h[2]=m*n,h}function w(n){let c=n??new l(3);return c[0]=0,c[1]=0,c[2]=0,c}function D(n,c,h){let p=h??new l(3),m=n[0],P=n[1],S=n[2],E=c[3]*m+c[7]*P+c[11]*S+c[15]||1;return p[0]=(c[0]*m+c[4]*P+c[8]*S+c[12])/E,p[1]=(c[1]*m+c[5]*P+c[9]*S+c[13])/E,p[2]=(c[2]*m+c[6]*P+c[10]*S+c[14])/E,p}function u(n,c,h){let p=h??new l(3),m=n[0],P=n[1],S=n[2];return p[0]=m*c[0]+P*c[4]+S*c[8],p[1]=m*c[1]+P*c[5]+S*c[9],p[2]=m*c[2]+P*c[6]+S*c[10],p}function t(n,c,h){let p=h??new l(3),m=n[0],P=n[1],S=n[2];return p[0]=m*c[0]+P*c[4]+S*c[8],p[1]=m*c[1]+P*c[5]+S*c[9],p[2]=m*c[2]+P*c[6]+S*c[10],p}function o(n,c,h){let p=h??new l(3),m=c[0],P=c[1],S=c[2],E=c[3]*2,I=n[0],M=n[1],k=n[2],W=P*k-S*M,z=S*I-m*k,B=m*M-P*I;return p[0]=I+W*E+(P*B-S*z)*2,p[1]=M+z*E+(S*W-m*B)*2,p[2]=k+B*E+(m*z-P*W)*2,p}function r(n,c){let h=c??new l(3);return h[0]=n[12],h[1]=n[13],h[2]=n[14],h}function f(n,c,h){let p=h??new l(3),m=c*4;return p[0]=n[m+0],p[1]=n[m+1],p[2]=n[m+2],p}function d(n,c){let h=c??new l(3),p=n[0],m=n[1],P=n[2],S=n[4],E=n[5],I=n[6],M=n[8],k=n[9],W=n[10];return h[0]=Math.sqrt(p*p+m*m+P*P),h[1]=Math.sqrt(S*S+E*E+I*I),h[2]=Math.sqrt(M*M+k*k+W*W),h}function _(n,c,h,p){let m=p??new l(3),P=[],S=[];return P[0]=n[0]-c[0],P[1]=n[1]-c[1],P[2]=n[2]-c[2],S[0]=P[0],S[1]=P[1]*Math.cos(h)-P[2]*Math.sin(h),S[2]=P[1]*Math.sin(h)+P[2]*Math.cos(h),m[0]=S[0]+c[0],m[1]=S[1]+c[1],m[2]=S[2]+c[2],m}function g(n,c,h,p){let m=p??new l(3),P=[],S=[];return P[0]=n[0]-c[0],P[1]=n[1]-c[1],P[2]=n[2]-c[2],S[0]=P[2]*Math.sin(h)+P[0]*Math.cos(h),S[1]=P[1],S[2]=P[2]*Math.cos(h)-P[0]*Math.sin(h),m[0]=S[0]+c[0],m[1]=S[1]+c[1],m[2]=S[2]+c[2],m}function e(n,c,h,p){let m=p??new l(3),P=[],S=[];return P[0]=n[0]-c[0],P[1]=n[1]-c[1],P[2]=n[2]-c[2],S[0]=P[0]*Math.cos(h)-P[1]*Math.sin(h),S[1]=P[0]*Math.sin(h)+P[1]*Math.cos(h),S[2]=P[2],m[0]=S[0]+c[0],m[1]=S[1]+c[1],m[2]=S[2]+c[2],m}function a(n,c,h){let p=h??new l(3);return pe(n,p),ae(p,c,p)}function s(n,c,h){let p=h??new l(3);return se(n)>c?a(n,c,p):J(n,p)}function i(n,c,h){let p=h??new l(3);return _e(n,c,.5,p)}return{create:v,fromValues:T,set:R,ceil:A,floor:L,round:C,clamp:K,add:F,addScaled:Q,angle:V,subtract:X,sub:ne,equalsApproximately:he,equals:te,lerp:_e,lerpV:be,max:Ue,min:ge,mulScalar:ae,scale:fe,divScalar:re,inverse:we,invert:Te,cross:Oe,dot:ve,length:se,len:Ge,lengthSq:le,lenSq:ke,distance:ue,dist:$,distanceSq:q,distSq:Y,normalize:pe,negate:ze,copy:J,clone:b,multiply:y,mul:x,divide:O,div:U,random:G,zero:w,transformMat4:D,transformMat4Upper3x3:u,transformMat3:t,transformQuat:o,getTranslation:r,getAxis:f,getScaling:d,rotateX:_,rotateY:g,rotateZ:e,setLength:a,truncate:s,midpoint:i}}var xt=new Map;function st(l){let v=xt.get(l);return v||(v=en(l),xt.set(l,v)),v}function tn(l){let v=Mt(l),T=st(l);function R(t,o,r,f,d,_,g,e,a){let s=new l(12);return s[3]=0,s[7]=0,s[11]=0,t!==void 0&&(s[0]=t,o!==void 0&&(s[1]=o,r!==void 0&&(s[2]=r,f!==void 0&&(s[4]=f,d!==void 0&&(s[5]=d,_!==void 0&&(s[6]=_,g!==void 0&&(s[8]=g,e!==void 0&&(s[9]=e,a!==void 0&&(s[10]=a))))))))),s}function A(t,o,r,f,d,_,g,e,a,s){let i=s??new l(12);return i[0]=t,i[1]=o,i[2]=r,i[3]=0,i[4]=f,i[5]=d,i[6]=_,i[7]=0,i[8]=g,i[9]=e,i[10]=a,i[11]=0,i}function L(t,o){let r=o??new l(12);return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=0,r[4]=t[4],r[5]=t[5],r[6]=t[6],r[7]=0,r[8]=t[8],r[9]=t[9],r[10]=t[10],r[11]=0,r}function C(t,o){let r=o??new l(12),f=t[0],d=t[1],_=t[2],g=t[3],e=f+f,a=d+d,s=_+_,i=f*e,n=d*e,c=d*a,h=_*e,p=_*a,m=_*s,P=g*e,S=g*a,E=g*s;return r[0]=1-c-m,r[1]=n+E,r[2]=h-S,r[3]=0,r[4]=n-E,r[5]=1-i-m,r[6]=p+P,r[7]=0,r[8]=h+S,r[9]=p-P,r[10]=1-i-c,r[11]=0,r}function K(t,o){let r=o??new l(12);return r[0]=-t[0],r[1]=-t[1],r[2]=-t[2],r[4]=-t[4],r[5]=-t[5],r[6]=-t[6],r[8]=-t[8],r[9]=-t[9],r[10]=-t[10],r}function F(t,o,r){let f=r??new l(12);return f[0]=t[0]*o,f[1]=t[1]*o,f[2]=t[2]*o,f[4]=t[4]*o,f[5]=t[5]*o,f[6]=t[6]*o,f[8]=t[8]*o,f[9]=t[9]*o,f[10]=t[10]*o,f}let Q=F;function V(t,o,r){let f=r??new l(12);return f[0]=t[0]+o[0],f[1]=t[1]+o[1],f[2]=t[2]+o[2],f[4]=t[4]+o[4],f[5]=t[5]+o[5],f[6]=t[6]+o[6],f[8]=t[8]+o[8],f[9]=t[9]+o[9],f[10]=t[10]+o[10],f}function X(t,o){let r=o??new l(12);return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[4]=t[4],r[5]=t[5],r[6]=t[6],r[8]=t[8],r[9]=t[9],r[10]=t[10],r}let ne=X;function he(t,o){return Math.abs(t[0]-o[0])<N&&Math.abs(t[1]-o[1])<N&&Math.abs(t[2]-o[2])<N&&Math.abs(t[4]-o[4])<N&&Math.abs(t[5]-o[5])<N&&Math.abs(t[6]-o[6])<N&&Math.abs(t[8]-o[8])<N&&Math.abs(t[9]-o[9])<N&&Math.abs(t[10]-o[10])<N}function te(t,o){return t[0]===o[0]&&t[1]===o[1]&&t[2]===o[2]&&t[4]===o[4]&&t[5]===o[5]&&t[6]===o[6]&&t[8]===o[8]&&t[9]===o[9]&&t[10]===o[10]}function _e(t){let o=t??new l(12);return o[0]=1,o[1]=0,o[2]=0,o[4]=0,o[5]=1,o[6]=0,o[8]=0,o[9]=0,o[10]=1,o}function be(t,o){let r=o??new l(12);if(r===t){let c;return c=t[1],t[1]=t[4],t[4]=c,c=t[2],t[2]=t[8],t[8]=c,c=t[6],t[6]=t[9],t[9]=c,r}let f=t[0],d=t[1],_=t[2],g=t[4],e=t[5],a=t[6],s=t[8],i=t[9],n=t[10];return r[0]=f,r[1]=g,r[2]=s,r[4]=d,r[5]=e,r[6]=i,r[8]=_,r[9]=a,r[10]=n,r}function Ue(t,o){let r=o??new l(12),f=t[0],d=t[1],_=t[2],g=t[4],e=t[5],a=t[6],s=t[8],i=t[9],n=t[10],c=n*e-a*i,h=-n*g+a*s,p=i*g-e*s,m=1/(f*c+d*h+_*p);return r[0]=c*m,r[1]=(-n*d+_*i)*m,r[2]=(a*d-_*e)*m,r[4]=h*m,r[5]=(n*f-_*s)*m,r[6]=(-a*f+_*g)*m,r[8]=p*m,r[9]=(-i*f+d*s)*m,r[10]=(e*f-d*g)*m,r}function ge(t){let o=t[0],r=t[1],f=t[2],d=t[4],_=t[5],g=t[6],e=t[8],a=t[9],s=t[10];return o*(_*s-a*g)-d*(r*s-a*f)+e*(r*g-_*f)}let ae=Ue;function fe(t,o,r){let f=r??new l(12),d=t[0],_=t[1],g=t[2],e=t[4],a=t[5],s=t[6],i=t[8],n=t[9],c=t[10],h=o[0],p=o[1],m=o[2],P=o[4],S=o[5],E=o[6],I=o[8],M=o[9],k=o[10];return f[0]=d*h+e*p+i*m,f[1]=_*h+a*p+n*m,f[2]=g*h+s*p+c*m,f[4]=d*P+e*S+i*E,f[5]=_*P+a*S+n*E,f[6]=g*P+s*S+c*E,f[8]=d*I+e*M+i*k,f[9]=_*I+a*M+n*k,f[10]=g*I+s*M+c*k,f}let re=fe;function we(t,o,r){let f=r??_e();return t!==f&&(f[0]=t[0],f[1]=t[1],f[2]=t[2],f[4]=t[4],f[5]=t[5],f[6]=t[6]),f[8]=o[0],f[9]=o[1],f[10]=1,f}function Te(t,o){let r=o??v.create();return r[0]=t[8],r[1]=t[9],r}function Oe(t,o,r){let f=r??v.create(),d=o*4;return f[0]=t[d+0],f[1]=t[d+1],f}function ve(t,o,r,f){let d=f===t?t:X(t,f),_=r*4;return d[_+0]=o[0],d[_+1]=o[1],d}function se(t,o){let r=o??v.create(),f=t[0],d=t[1],_=t[4],g=t[5];return r[0]=Math.sqrt(f*f+d*d),r[1]=Math.sqrt(_*_+g*g),r}function Ge(t,o){let r=o??T.create(),f=t[0],d=t[1],_=t[2],g=t[4],e=t[5],a=t[6],s=t[8],i=t[9],n=t[10];return r[0]=Math.sqrt(f*f+d*d+_*_),r[1]=Math.sqrt(g*g+e*e+a*a),r[2]=Math.sqrt(s*s+i*i+n*n),r}function le(t,o){let r=o??new l(12);return r[0]=1,r[1]=0,r[2]=0,r[4]=0,r[5]=1,r[6]=0,r[8]=t[0],r[9]=t[1],r[10]=1,r}function ke(t,o,r){let f=r??new l(12),d=o[0],_=o[1],g=t[0],e=t[1],a=t[2],s=t[4],i=t[5],n=t[6],c=t[8],h=t[9],p=t[10];return t!==f&&(f[0]=g,f[1]=e,f[2]=a,f[4]=s,f[5]=i,f[6]=n),f[8]=g*d+s*_+c,f[9]=e*d+i*_+h,f[10]=a*d+n*_+p,f}function ue(t,o){let r=o??new l(12),f=Math.cos(t),d=Math.sin(t);return r[0]=f,r[1]=d,r[2]=0,r[4]=-d,r[5]=f,r[6]=0,r[8]=0,r[9]=0,r[10]=1,r}function $(t,o,r){let f=r??new l(12),d=t[0],_=t[1],g=t[2],e=t[4],a=t[5],s=t[6],i=Math.cos(o),n=Math.sin(o);return f[0]=i*d+n*e,f[1]=i*_+n*a,f[2]=i*g+n*s,f[4]=i*e-n*d,f[5]=i*a-n*_,f[6]=i*s-n*g,t!==f&&(f[8]=t[8],f[9]=t[9],f[10]=t[10]),f}function q(t,o){let r=o??new l(12),f=Math.cos(t),d=Math.sin(t);return r[0]=1,r[1]=0,r[2]=0,r[4]=0,r[5]=f,r[6]=d,r[8]=0,r[9]=-d,r[10]=f,r}function Y(t,o,r){let f=r??new l(12),d=t[4],_=t[5],g=t[6],e=t[8],a=t[9],s=t[10],i=Math.cos(o),n=Math.sin(o);return f[4]=i*d+n*e,f[5]=i*_+n*a,f[6]=i*g+n*s,f[8]=i*e-n*d,f[9]=i*a-n*_,f[10]=i*s-n*g,t!==f&&(f[0]=t[0],f[1]=t[1],f[2]=t[2]),f}function pe(t,o){let r=o??new l(12),f=Math.cos(t),d=Math.sin(t);return r[0]=f,r[1]=0,r[2]=-d,r[4]=0,r[5]=1,r[6]=0,r[8]=d,r[9]=0,r[10]=f,r}function ze(t,o,r){let f=r??new l(12),d=t[0],_=t[1],g=t[2],e=t[8],a=t[9],s=t[10],i=Math.cos(o),n=Math.sin(o);return f[0]=i*d-n*e,f[1]=i*_-n*a,f[2]=i*g-n*s,f[8]=i*e+n*d,f[9]=i*a+n*_,f[10]=i*s+n*g,t!==f&&(f[4]=t[4],f[5]=t[5],f[6]=t[6]),f}let J=ue,b=$;function y(t,o){let r=o??new l(12);return r[0]=t[0],r[1]=0,r[2]=0,r[4]=0,r[5]=t[1],r[6]=0,r[8]=0,r[9]=0,r[10]=1,r}function x(t,o,r){let f=r??new l(12),d=o[0],_=o[1];return f[0]=d*t[0],f[1]=d*t[1],f[2]=d*t[2],f[4]=_*t[4],f[5]=_*t[5],f[6]=_*t[6],t!==f&&(f[8]=t[8],f[9]=t[9],f[10]=t[10]),f}function O(t,o){let r=o??new l(12);return r[0]=t[0],r[1]=0,r[2]=0,r[4]=0,r[5]=t[1],r[6]=0,r[8]=0,r[9]=0,r[10]=t[2],r}function U(t,o,r){let f=r??new l(12),d=o[0],_=o[1],g=o[2];return f[0]=d*t[0],f[1]=d*t[1],f[2]=d*t[2],f[4]=_*t[4],f[5]=_*t[5],f[6]=_*t[6],f[8]=g*t[8],f[9]=g*t[9],f[10]=g*t[10],f}function G(t,o){let r=o??new l(12);return r[0]=t,r[1]=0,r[2]=0,r[4]=0,r[5]=t,r[6]=0,r[8]=0,r[9]=0,r[10]=1,r}function w(t,o,r){let f=r??new l(12);return f[0]=o*t[0],f[1]=o*t[1],f[2]=o*t[2],f[4]=o*t[4],f[5]=o*t[5],f[6]=o*t[6],t!==f&&(f[8]=t[8],f[9]=t[9],f[10]=t[10]),f}function D(t,o){let r=o??new l(12);return r[0]=t,r[1]=0,r[2]=0,r[4]=0,r[5]=t,r[6]=0,r[8]=0,r[9]=0,r[10]=t,r}function u(t,o,r){let f=r??new l(12);return f[0]=o*t[0],f[1]=o*t[1],f[2]=o*t[2],f[4]=o*t[4],f[5]=o*t[5],f[6]=o*t[6],f[8]=o*t[8],f[9]=o*t[9],f[10]=o*t[10],f}return{add:V,clone:ne,copy:X,create:R,determinant:ge,equals:te,equalsApproximately:he,fromMat4:L,fromQuat:C,get3DScaling:Ge,getAxis:Oe,getScaling:se,getTranslation:Te,identity:_e,inverse:Ue,invert:ae,mul:re,mulScalar:Q,multiply:fe,multiplyScalar:F,negate:K,rotate:$,rotateX:Y,rotateY:ze,rotateZ:b,rotation:ue,rotationX:q,rotationY:pe,rotationZ:J,scale:x,scale3D:U,scaling:y,scaling3D:O,set:A,setAxis:ve,setTranslation:we,translate:ke,translation:le,transpose:be,uniformScale:w,uniformScale3D:u,uniformScaling:G,uniformScaling3D:D}}var St=new Map;function nn(l){let v=St.get(l);return v||(v=tn(l),St.set(l,v)),v}function rn(l){let v=st(l);function T(e,a,s,i,n,c,h,p,m,P,S,E,I,M,k,W){let z=new l(16);return e!==void 0&&(z[0]=e,a!==void 0&&(z[1]=a,s!==void 0&&(z[2]=s,i!==void 0&&(z[3]=i,n!==void 0&&(z[4]=n,c!==void 0&&(z[5]=c,h!==void 0&&(z[6]=h,p!==void 0&&(z[7]=p,m!==void 0&&(z[8]=m,P!==void 0&&(z[9]=P,S!==void 0&&(z[10]=S,E!==void 0&&(z[11]=E,I!==void 0&&(z[12]=I,M!==void 0&&(z[13]=M,k!==void 0&&(z[14]=k,W!==void 0&&(z[15]=W)))))))))))))))),z}function R(e,a,s,i,n,c,h,p,m,P,S,E,I,M,k,W,z){let B=z??new l(16);return B[0]=e,B[1]=a,B[2]=s,B[3]=i,B[4]=n,B[5]=c,B[6]=h,B[7]=p,B[8]=m,B[9]=P,B[10]=S,B[11]=E,B[12]=I,B[13]=M,B[14]=k,B[15]=W,B}function A(e,a){let s=a??new l(16);return s[0]=e[0],s[1]=e[1],s[2]=e[2],s[3]=0,s[4]=e[4],s[5]=e[5],s[6]=e[6],s[7]=0,s[8]=e[8],s[9]=e[9],s[10]=e[10],s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function L(e,a){let s=a??new l(16),i=e[0],n=e[1],c=e[2],h=e[3],p=i+i,m=n+n,P=c+c,S=i*p,E=n*p,I=n*m,M=c*p,k=c*m,W=c*P,z=h*p,B=h*m,Z=h*P;return s[0]=1-I-W,s[1]=E+Z,s[2]=M-B,s[3]=0,s[4]=E-Z,s[5]=1-S-W,s[6]=k+z,s[7]=0,s[8]=M+B,s[9]=k-z,s[10]=1-S-I,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function C(e,a){let s=a??new l(16);return s[0]=-e[0],s[1]=-e[1],s[2]=-e[2],s[3]=-e[3],s[4]=-e[4],s[5]=-e[5],s[6]=-e[6],s[7]=-e[7],s[8]=-e[8],s[9]=-e[9],s[10]=-e[10],s[11]=-e[11],s[12]=-e[12],s[13]=-e[13],s[14]=-e[14],s[15]=-e[15],s}function K(e,a,s){let i=s??new l(16);return i[0]=e[0]+a[0],i[1]=e[1]+a[1],i[2]=e[2]+a[2],i[3]=e[3]+a[3],i[4]=e[4]+a[4],i[5]=e[5]+a[5],i[6]=e[6]+a[6],i[7]=e[7]+a[7],i[8]=e[8]+a[8],i[9]=e[9]+a[9],i[10]=e[10]+a[10],i[11]=e[11]+a[11],i[12]=e[12]+a[12],i[13]=e[13]+a[13],i[14]=e[14]+a[14],i[15]=e[15]+a[15],i}function F(e,a,s){let i=s??new l(16);return i[0]=e[0]*a,i[1]=e[1]*a,i[2]=e[2]*a,i[3]=e[3]*a,i[4]=e[4]*a,i[5]=e[5]*a,i[6]=e[6]*a,i[7]=e[7]*a,i[8]=e[8]*a,i[9]=e[9]*a,i[10]=e[10]*a,i[11]=e[11]*a,i[12]=e[12]*a,i[13]=e[13]*a,i[14]=e[14]*a,i[15]=e[15]*a,i}let Q=F;function V(e,a){let s=a??new l(16);return s[0]=e[0],s[1]=e[1],s[2]=e[2],s[3]=e[3],s[4]=e[4],s[5]=e[5],s[6]=e[6],s[7]=e[7],s[8]=e[8],s[9]=e[9],s[10]=e[10],s[11]=e[11],s[12]=e[12],s[13]=e[13],s[14]=e[14],s[15]=e[15],s}let X=V;function ne(e,a){return Math.abs(e[0]-a[0])<N&&Math.abs(e[1]-a[1])<N&&Math.abs(e[2]-a[2])<N&&Math.abs(e[3]-a[3])<N&&Math.abs(e[4]-a[4])<N&&Math.abs(e[5]-a[5])<N&&Math.abs(e[6]-a[6])<N&&Math.abs(e[7]-a[7])<N&&Math.abs(e[8]-a[8])<N&&Math.abs(e[9]-a[9])<N&&Math.abs(e[10]-a[10])<N&&Math.abs(e[11]-a[11])<N&&Math.abs(e[12]-a[12])<N&&Math.abs(e[13]-a[13])<N&&Math.abs(e[14]-a[14])<N&&Math.abs(e[15]-a[15])<N}function he(e,a){return e[0]===a[0]&&e[1]===a[1]&&e[2]===a[2]&&e[3]===a[3]&&e[4]===a[4]&&e[5]===a[5]&&e[6]===a[6]&&e[7]===a[7]&&e[8]===a[8]&&e[9]===a[9]&&e[10]===a[10]&&e[11]===a[11]&&e[12]===a[12]&&e[13]===a[13]&&e[14]===a[14]&&e[15]===a[15]}function te(e){let a=e??new l(16);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a}function _e(e,a){let s=a??new l(16);if(s===e){let H;return H=e[1],e[1]=e[4],e[4]=H,H=e[2],e[2]=e[8],e[8]=H,H=e[3],e[3]=e[12],e[12]=H,H=e[6],e[6]=e[9],e[9]=H,H=e[7],e[7]=e[13],e[13]=H,H=e[11],e[11]=e[14],e[14]=H,s}let i=e[0],n=e[1],c=e[2],h=e[3],p=e[4],m=e[5],P=e[6],S=e[7],E=e[8],I=e[9],M=e[10],k=e[11],W=e[12],z=e[13],B=e[14],Z=e[15];return s[0]=i,s[1]=p,s[2]=E,s[3]=W,s[4]=n,s[5]=m,s[6]=I,s[7]=z,s[8]=c,s[9]=P,s[10]=M,s[11]=B,s[12]=h,s[13]=S,s[14]=k,s[15]=Z,s}function be(e,a){let s=a??new l(16),i=e[0],n=e[1],c=e[2],h=e[3],p=e[4],m=e[5],P=e[6],S=e[7],E=e[8],I=e[9],M=e[10],k=e[11],W=e[12],z=e[13],B=e[14],Z=e[15],H=M*Z,ie=B*k,oe=P*Z,ce=B*S,de=P*k,me=M*S,De=c*Z,ye=B*h,Pe=c*k,xe=M*h,Ie=c*S,Me=P*h,Ee=E*z,Re=W*I,Be=p*z,Ae=W*m,Le=p*I,Xe=E*m,Qe=i*z,Je=W*n,et=i*I,tt=E*n,nt=i*m,rt=p*n,_t=H*m+ce*I+de*z-(ie*m+oe*I+me*z),gt=ie*n+De*I+xe*z-(H*n+ye*I+Pe*z),wt=oe*n+ye*m+Ie*z-(ce*n+De*m+Me*z),vt=me*n+Pe*m+Me*I-(de*n+xe*m+Ie*I),Se=1/(i*_t+p*gt+E*wt+W*vt);return s[0]=Se*_t,s[1]=Se*gt,s[2]=Se*wt,s[3]=Se*vt,s[4]=Se*(ie*p+oe*E+me*W-(H*p+ce*E+de*W)),s[5]=Se*(H*i+ye*E+Pe*W-(ie*i+De*E+xe*W)),s[6]=Se*(ce*i+De*p+Me*W-(oe*i+ye*p+Ie*W)),s[7]=Se*(de*i+xe*p+Ie*E-(me*i+Pe*p+Me*E)),s[8]=Se*(Ee*S+Ae*k+Le*Z-(Re*S+Be*k+Xe*Z)),s[9]=Se*(Re*h+Qe*k+tt*Z-(Ee*h+Je*k+et*Z)),s[10]=Se*(Be*h+Je*S+nt*Z-(Ae*h+Qe*S+rt*Z)),s[11]=Se*(Xe*h+et*S+rt*k-(Le*h+tt*S+nt*k)),s[12]=Se*(Be*M+Xe*B+Re*P-(Le*B+Ee*P+Ae*M)),s[13]=Se*(et*B+Ee*c+Je*M-(Qe*M+tt*B+Re*c)),s[14]=Se*(Qe*P+rt*B+Ae*c-(nt*B+Be*c+Je*P)),s[15]=Se*(nt*M+Le*c+tt*P-(et*P+rt*M+Xe*c)),s}function Ue(e){let a=e[0],s=e[1],i=e[2],n=e[3],c=e[4],h=e[5],p=e[6],m=e[7],P=e[8],S=e[9],E=e[10],I=e[11],M=e[12],k=e[13],W=e[14],z=e[15],B=E*z,Z=W*I,H=p*z,ie=W*m,oe=p*I,ce=E*m,de=i*z,me=W*n,De=i*I,ye=E*n,Pe=i*m,xe=p*n,Ie=B*h+ie*S+oe*k-(Z*h+H*S+ce*k),Me=Z*s+de*S+ye*k-(B*s+me*S+De*k),Ee=H*s+me*h+Pe*k-(ie*s+de*h+xe*k),Re=ce*s+De*h+xe*S-(oe*s+ye*h+Pe*S);return a*Ie+c*Me+P*Ee+M*Re}let ge=be;function ae(e,a,s){let i=s??new l(16),n=e[0],c=e[1],h=e[2],p=e[3],m=e[4],P=e[5],S=e[6],E=e[7],I=e[8],M=e[9],k=e[10],W=e[11],z=e[12],B=e[13],Z=e[14],H=e[15],ie=a[0],oe=a[1],ce=a[2],de=a[3],me=a[4],De=a[5],ye=a[6],Pe=a[7],xe=a[8],Ie=a[9],Me=a[10],Ee=a[11],Re=a[12],Be=a[13],Ae=a[14],Le=a[15];return i[0]=n*ie+m*oe+I*ce+z*de,i[1]=c*ie+P*oe+M*ce+B*de,i[2]=h*ie+S*oe+k*ce+Z*de,i[3]=p*ie+E*oe+W*ce+H*de,i[4]=n*me+m*De+I*ye+z*Pe,i[5]=c*me+P*De+M*ye+B*Pe,i[6]=h*me+S*De+k*ye+Z*Pe,i[7]=p*me+E*De+W*ye+H*Pe,i[8]=n*xe+m*Ie+I*Me+z*Ee,i[9]=c*xe+P*Ie+M*Me+B*Ee,i[10]=h*xe+S*Ie+k*Me+Z*Ee,i[11]=p*xe+E*Ie+W*Me+H*Ee,i[12]=n*Re+m*Be+I*Ae+z*Le,i[13]=c*Re+P*Be+M*Ae+B*Le,i[14]=h*Re+S*Be+k*Ae+Z*Le,i[15]=p*Re+E*Be+W*Ae+H*Le,i}let fe=ae;function re(e,a,s){let i=s??te();return e!==i&&(i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=e[3],i[4]=e[4],i[5]=e[5],i[6]=e[6],i[7]=e[7],i[8]=e[8],i[9]=e[9],i[10]=e[10],i[11]=e[11]),i[12]=a[0],i[13]=a[1],i[14]=a[2],i[15]=1,i}function we(e,a){let s=a??v.create();return s[0]=e[12],s[1]=e[13],s[2]=e[14],s}function Te(e,a,s){let i=s??v.create(),n=a*4;return i[0]=e[n+0],i[1]=e[n+1],i[2]=e[n+2],i}function Oe(e,a,s,i){let n=i===e?i:V(e,i),c=s*4;return n[c+0]=a[0],n[c+1]=a[1],n[c+2]=a[2],n}function ve(e,a){let s=a??v.create(),i=e[0],n=e[1],c=e[2],h=e[4],p=e[5],m=e[6],P=e[8],S=e[9],E=e[10];return s[0]=Math.sqrt(i*i+n*n+c*c),s[1]=Math.sqrt(h*h+p*p+m*m),s[2]=Math.sqrt(P*P+S*S+E*E),s}function se(e,a,s,i,n){let c=n??new l(16),h=Math.tan(Math.PI*.5-.5*e);if(c[0]=h/a,c[1]=0,c[2]=0,c[3]=0,c[4]=0,c[5]=h,c[6]=0,c[7]=0,c[8]=0,c[9]=0,c[11]=-1,c[12]=0,c[13]=0,c[15]=0,Number.isFinite(i)){let p=1/(s-i);c[10]=i*p,c[14]=i*s*p}else c[10]=-1,c[14]=-s;return c}function Ge(e,a,s,i=1/0,n){let c=n??new l(16),h=1/Math.tan(e*.5);if(c[0]=h/a,c[1]=0,c[2]=0,c[3]=0,c[4]=0,c[5]=h,c[6]=0,c[7]=0,c[8]=0,c[9]=0,c[11]=-1,c[12]=0,c[13]=0,c[15]=0,i===1/0)c[10]=0,c[14]=s;else{let p=1/(i-s);c[10]=s*p,c[14]=i*s*p}return c}function le(e,a,s,i,n,c,h){let p=h??new l(16);return p[0]=2/(a-e),p[1]=0,p[2]=0,p[3]=0,p[4]=0,p[5]=2/(i-s),p[6]=0,p[7]=0,p[8]=0,p[9]=0,p[10]=1/(n-c),p[11]=0,p[12]=(a+e)/(e-a),p[13]=(i+s)/(s-i),p[14]=n/(n-c),p[15]=1,p}function ke(e,a,s,i,n,c,h){let p=h??new l(16),m=a-e,P=i-s,S=n-c;return p[0]=2*n/m,p[1]=0,p[2]=0,p[3]=0,p[4]=0,p[5]=2*n/P,p[6]=0,p[7]=0,p[8]=(e+a)/m,p[9]=(i+s)/P,p[10]=c/S,p[11]=-1,p[12]=0,p[13]=0,p[14]=n*c/S,p[15]=0,p}function ue(e,a,s,i,n,c=1/0,h){let p=h??new l(16),m=a-e,P=i-s;if(p[0]=2*n/m,p[1]=0,p[2]=0,p[3]=0,p[4]=0,p[5]=2*n/P,p[6]=0,p[7]=0,p[8]=(e+a)/m,p[9]=(i+s)/P,p[11]=-1,p[12]=0,p[13]=0,p[15]=0,c===1/0)p[10]=0,p[14]=n;else{let S=1/(c-n);p[10]=n*S,p[14]=c*n*S}return p}let $=v.create(),q=v.create(),Y=v.create();function pe(e,a,s,i){let n=i??new l(16);return v.normalize(v.subtract(a,e,Y),Y),v.normalize(v.cross(s,Y,$),$),v.normalize(v.cross(Y,$,q),q),n[0]=$[0],n[1]=$[1],n[2]=$[2],n[3]=0,n[4]=q[0],n[5]=q[1],n[6]=q[2],n[7]=0,n[8]=Y[0],n[9]=Y[1],n[10]=Y[2],n[11]=0,n[12]=e[0],n[13]=e[1],n[14]=e[2],n[15]=1,n}function ze(e,a,s,i){let n=i??new l(16);return v.normalize(v.subtract(e,a,Y),Y),v.normalize(v.cross(s,Y,$),$),v.normalize(v.cross(Y,$,q),q),n[0]=$[0],n[1]=$[1],n[2]=$[2],n[3]=0,n[4]=q[0],n[5]=q[1],n[6]=q[2],n[7]=0,n[8]=Y[0],n[9]=Y[1],n[10]=Y[2],n[11]=0,n[12]=e[0],n[13]=e[1],n[14]=e[2],n[15]=1,n}function J(e,a,s,i){let n=i??new l(16);return v.normalize(v.subtract(e,a,Y),Y),v.normalize(v.cross(s,Y,$),$),v.normalize(v.cross(Y,$,q),q),n[0]=$[0],n[1]=q[0],n[2]=Y[0],n[3]=0,n[4]=$[1],n[5]=q[1],n[6]=Y[1],n[7]=0,n[8]=$[2],n[9]=q[2],n[10]=Y[2],n[11]=0,n[12]=-($[0]*e[0]+$[1]*e[1]+$[2]*e[2]),n[13]=-(q[0]*e[0]+q[1]*e[1]+q[2]*e[2]),n[14]=-(Y[0]*e[0]+Y[1]*e[1]+Y[2]*e[2]),n[15]=1,n}function b(e,a){let s=a??new l(16);return s[0]=1,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=1,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=1,s[11]=0,s[12]=e[0],s[13]=e[1],s[14]=e[2],s[15]=1,s}function y(e,a,s){let i=s??new l(16),n=a[0],c=a[1],h=a[2],p=e[0],m=e[1],P=e[2],S=e[3],E=e[4],I=e[5],M=e[6],k=e[7],W=e[8],z=e[9],B=e[10],Z=e[11],H=e[12],ie=e[13],oe=e[14],ce=e[15];return e!==i&&(i[0]=p,i[1]=m,i[2]=P,i[3]=S,i[4]=E,i[5]=I,i[6]=M,i[7]=k,i[8]=W,i[9]=z,i[10]=B,i[11]=Z),i[12]=p*n+E*c+W*h+H,i[13]=m*n+I*c+z*h+ie,i[14]=P*n+M*c+B*h+oe,i[15]=S*n+k*c+Z*h+ce,i}function x(e,a){let s=a??new l(16),i=Math.cos(e),n=Math.sin(e);return s[0]=1,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=i,s[6]=n,s[7]=0,s[8]=0,s[9]=-n,s[10]=i,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function O(e,a,s){let i=s??new l(16),n=e[4],c=e[5],h=e[6],p=e[7],m=e[8],P=e[9],S=e[10],E=e[11],I=Math.cos(a),M=Math.sin(a);return i[4]=I*n+M*m,i[5]=I*c+M*P,i[6]=I*h+M*S,i[7]=I*p+M*E,i[8]=I*m-M*n,i[9]=I*P-M*c,i[10]=I*S-M*h,i[11]=I*E-M*p,e!==i&&(i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=e[3],i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}function U(e,a){let s=a??new l(16),i=Math.cos(e),n=Math.sin(e);return s[0]=i,s[1]=0,s[2]=-n,s[3]=0,s[4]=0,s[5]=1,s[6]=0,s[7]=0,s[8]=n,s[9]=0,s[10]=i,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function G(e,a,s){let i=s??new l(16),n=e[0],c=e[1],h=e[2],p=e[3],m=e[8],P=e[9],S=e[10],E=e[11],I=Math.cos(a),M=Math.sin(a);return i[0]=I*n-M*m,i[1]=I*c-M*P,i[2]=I*h-M*S,i[3]=I*p-M*E,i[8]=I*m+M*n,i[9]=I*P+M*c,i[10]=I*S+M*h,i[11]=I*E+M*p,e!==i&&(i[4]=e[4],i[5]=e[5],i[6]=e[6],i[7]=e[7],i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}function w(e,a){let s=a??new l(16),i=Math.cos(e),n=Math.sin(e);return s[0]=i,s[1]=n,s[2]=0,s[3]=0,s[4]=-n,s[5]=i,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=1,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function D(e,a,s){let i=s??new l(16),n=e[0],c=e[1],h=e[2],p=e[3],m=e[4],P=e[5],S=e[6],E=e[7],I=Math.cos(a),M=Math.sin(a);return i[0]=I*n+M*m,i[1]=I*c+M*P,i[2]=I*h+M*S,i[3]=I*p+M*E,i[4]=I*m-M*n,i[5]=I*P-M*c,i[6]=I*S-M*h,i[7]=I*E-M*p,e!==i&&(i[8]=e[8],i[9]=e[9],i[10]=e[10],i[11]=e[11],i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}function u(e,a,s){let i=s??new l(16),n=e[0],c=e[1],h=e[2],p=Math.sqrt(n*n+c*c+h*h);n/=p,c/=p,h/=p;let m=n*n,P=c*c,S=h*h,E=Math.cos(a),I=Math.sin(a),M=1-E;return i[0]=m+(1-m)*E,i[1]=n*c*M+h*I,i[2]=n*h*M-c*I,i[3]=0,i[4]=n*c*M-h*I,i[5]=P+(1-P)*E,i[6]=c*h*M+n*I,i[7]=0,i[8]=n*h*M+c*I,i[9]=c*h*M-n*I,i[10]=S+(1-S)*E,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,i}let t=u;function o(e,a,s,i){let n=i??new l(16),c=a[0],h=a[1],p=a[2],m=Math.sqrt(c*c+h*h+p*p);c/=m,h/=m,p/=m;let P=c*c,S=h*h,E=p*p,I=Math.cos(s),M=Math.sin(s),k=1-I,W=P+(1-P)*I,z=c*h*k+p*M,B=c*p*k-h*M,Z=c*h*k-p*M,H=S+(1-S)*I,ie=h*p*k+c*M,oe=c*p*k+h*M,ce=h*p*k-c*M,de=E+(1-E)*I,me=e[0],De=e[1],ye=e[2],Pe=e[3],xe=e[4],Ie=e[5],Me=e[6],Ee=e[7],Re=e[8],Be=e[9],Ae=e[10],Le=e[11];return n[0]=W*me+z*xe+B*Re,n[1]=W*De+z*Ie+B*Be,n[2]=W*ye+z*Me+B*Ae,n[3]=W*Pe+z*Ee+B*Le,n[4]=Z*me+H*xe+ie*Re,n[5]=Z*De+H*Ie+ie*Be,n[6]=Z*ye+H*Me+ie*Ae,n[7]=Z*Pe+H*Ee+ie*Le,n[8]=oe*me+ce*xe+de*Re,n[9]=oe*De+ce*Ie+de*Be,n[10]=oe*ye+ce*Me+de*Ae,n[11]=oe*Pe+ce*Ee+de*Le,e!==n&&(n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15]),n}let r=o;function f(e,a){let s=a??new l(16);return s[0]=e[0],s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=e[1],s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=e[2],s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function d(e,a,s){let i=s??new l(16),n=a[0],c=a[1],h=a[2];return i[0]=n*e[0],i[1]=n*e[1],i[2]=n*e[2],i[3]=n*e[3],i[4]=c*e[4],i[5]=c*e[5],i[6]=c*e[6],i[7]=c*e[7],i[8]=h*e[8],i[9]=h*e[9],i[10]=h*e[10],i[11]=h*e[11],e!==i&&(i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}function _(e,a){let s=a??new l(16);return s[0]=e,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=e,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=e,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function g(e,a,s){let i=s??new l(16);return i[0]=a*e[0],i[1]=a*e[1],i[2]=a*e[2],i[3]=a*e[3],i[4]=a*e[4],i[5]=a*e[5],i[6]=a*e[6],i[7]=a*e[7],i[8]=a*e[8],i[9]=a*e[9],i[10]=a*e[10],i[11]=a*e[11],e!==i&&(i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}return{add:K,aim:pe,axisRotate:o,axisRotation:u,cameraAim:ze,clone:X,copy:V,create:T,determinant:Ue,equals:he,equalsApproximately:ne,fromMat3:A,fromQuat:L,frustum:ke,frustumReverseZ:ue,getAxis:Te,getScaling:ve,getTranslation:we,identity:te,inverse:be,invert:ge,lookAt:J,mul:fe,mulScalar:Q,multiply:ae,multiplyScalar:F,negate:C,ortho:le,perspective:se,perspectiveReverseZ:Ge,rotate:r,rotateX:O,rotateY:G,rotateZ:D,rotation:t,rotationX:x,rotationY:U,rotationZ:w,scale:d,scaling:f,set:R,setAxis:Oe,setTranslation:re,translate:y,translation:b,transpose:_e,uniformScale:g,uniformScaling:_}}var bt=new Map;function sn(l){let v=bt.get(l);return v||(v=rn(l),bt.set(l,v)),v}function on(l){let v=st(l);function T(w,D,u,t){let o=new l(4);return w!==void 0&&(o[0]=w,D!==void 0&&(o[1]=D,u!==void 0&&(o[2]=u,t!==void 0&&(o[3]=t)))),o}let R=T;function A(w,D,u,t,o){let r=o??new l(4);return r[0]=w,r[1]=D,r[2]=u,r[3]=t,r}function L(w,D,u){let t=u??new l(4),o=D*.5,r=Math.sin(o);return t[0]=r*w[0],t[1]=r*w[1],t[2]=r*w[2],t[3]=Math.cos(o),t}function C(w,D){let u=D??v.create(3),t=Math.acos(w[3])*2,o=Math.sin(t*.5);return o>N?(u[0]=w[0]/o,u[1]=w[1]/o,u[2]=w[2]/o):(u[0]=1,u[1]=0,u[2]=0),{angle:t,axis:u}}function K(w,D){let u=se(w,D);return Math.acos(2*u*u-1)}function F(w,D,u){let t=u??new l(4),o=w[0],r=w[1],f=w[2],d=w[3],_=D[0],g=D[1],e=D[2],a=D[3];return t[0]=o*a+d*_+r*e-f*g,t[1]=r*a+d*g+f*_-o*e,t[2]=f*a+d*e+o*g-r*_,t[3]=d*a-o*_-r*g-f*e,t}let Q=F;function V(w,D,u){let t=u??new l(4),o=D*.5,r=w[0],f=w[1],d=w[2],_=w[3],g=Math.sin(o),e=Math.cos(o);return t[0]=r*e+_*g,t[1]=f*e+d*g,t[2]=d*e-f*g,t[3]=_*e-r*g,t}function X(w,D,u){let t=u??new l(4),o=D*.5,r=w[0],f=w[1],d=w[2],_=w[3],g=Math.sin(o),e=Math.cos(o);return t[0]=r*e-d*g,t[1]=f*e+_*g,t[2]=d*e+r*g,t[3]=_*e-f*g,t}function ne(w,D,u){let t=u??new l(4),o=D*.5,r=w[0],f=w[1],d=w[2],_=w[3],g=Math.sin(o),e=Math.cos(o);return t[0]=r*e+f*g,t[1]=f*e-r*g,t[2]=d*e+_*g,t[3]=_*e-d*g,t}function he(w,D,u,t){let o=t??new l(4),r=w[0],f=w[1],d=w[2],_=w[3],g=D[0],e=D[1],a=D[2],s=D[3],i=r*g+f*e+d*a+_*s;i<0&&(i=-i,g=-g,e=-e,a=-a,s=-s);let n,c;if(1-i>N){let h=Math.acos(i),p=Math.sin(h);n=Math.sin((1-u)*h)/p,c=Math.sin(u*h)/p}else n=1-u,c=u;return o[0]=n*r+c*g,o[1]=n*f+c*e,o[2]=n*d+c*a,o[3]=n*_+c*s,o}function te(w,D){let u=D??new l(4),t=w[0],o=w[1],r=w[2],f=w[3],d=t*t+o*o+r*r+f*f,_=d?1/d:0;return u[0]=-t*_,u[1]=-o*_,u[2]=-r*_,u[3]=f*_,u}function _e(w,D){let u=D??new l(4);return u[0]=-w[0],u[1]=-w[1],u[2]=-w[2],u[3]=w[3],u}function be(w,D){let u=D??new l(4),t=w[0]+w[5]+w[10];if(t>0){let o=Math.sqrt(t+1);u[3]=.5*o;let r=.5/o;u[0]=(w[6]-w[9])*r,u[1]=(w[8]-w[2])*r,u[2]=(w[1]-w[4])*r}else{let o=0;w[5]>w[0]&&(o=1),w[10]>w[o*4+o]&&(o=2);let r=(o+1)%3,f=(o+2)%3,d=Math.sqrt(w[o*4+o]-w[r*4+r]-w[f*4+f]+1);u[o]=.5*d;let _=.5/d;u[3]=(w[r*4+f]-w[f*4+r])*_,u[r]=(w[r*4+o]+w[o*4+r])*_,u[f]=(w[f*4+o]+w[o*4+f])*_}return u}function Ue(w,D,u,t,o){let r=o??new l(4),f=w*.5,d=D*.5,_=u*.5,g=Math.sin(f),e=Math.cos(f),a=Math.sin(d),s=Math.cos(d),i=Math.sin(_),n=Math.cos(_);switch(t){case"xyz":r[0]=g*s*n+e*a*i,r[1]=e*a*n-g*s*i,r[2]=e*s*i+g*a*n,r[3]=e*s*n-g*a*i;break;case"xzy":r[0]=g*s*n-e*a*i,r[1]=e*a*n-g*s*i,r[2]=e*s*i+g*a*n,r[3]=e*s*n+g*a*i;break;case"yxz":r[0]=g*s*n+e*a*i,r[1]=e*a*n-g*s*i,r[2]=e*s*i-g*a*n,r[3]=e*s*n+g*a*i;break;case"yzx":r[0]=g*s*n+e*a*i,r[1]=e*a*n+g*s*i,r[2]=e*s*i-g*a*n,r[3]=e*s*n-g*a*i;break;case"zxy":r[0]=g*s*n-e*a*i,r[1]=e*a*n+g*s*i,r[2]=e*s*i+g*a*n,r[3]=e*s*n-g*a*i;break;case"zyx":r[0]=g*s*n-e*a*i,r[1]=e*a*n+g*s*i,r[2]=e*s*i-g*a*n,r[3]=e*s*n+g*a*i;break;default:throw new Error(`Unknown rotation order: ${t}`)}return r}function ge(w,D){let u=D??new l(4);return u[0]=w[0],u[1]=w[1],u[2]=w[2],u[3]=w[3],u}let ae=ge;function fe(w,D,u){let t=u??new l(4);return t[0]=w[0]+D[0],t[1]=w[1]+D[1],t[2]=w[2]+D[2],t[3]=w[3]+D[3],t}function re(w,D,u){let t=u??new l(4);return t[0]=w[0]-D[0],t[1]=w[1]-D[1],t[2]=w[2]-D[2],t[3]=w[3]-D[3],t}let we=re;function Te(w,D,u){let t=u??new l(4);return t[0]=w[0]*D,t[1]=w[1]*D,t[2]=w[2]*D,t[3]=w[3]*D,t}let Oe=Te;function ve(w,D,u){let t=u??new l(4);return t[0]=w[0]/D,t[1]=w[1]/D,t[2]=w[2]/D,t[3]=w[3]/D,t}function se(w,D){return w[0]*D[0]+w[1]*D[1]+w[2]*D[2]+w[3]*D[3]}function Ge(w,D,u,t){let o=t??new l(4);return o[0]=w[0]+u*(D[0]-w[0]),o[1]=w[1]+u*(D[1]-w[1]),o[2]=w[2]+u*(D[2]-w[2]),o[3]=w[3]+u*(D[3]-w[3]),o}function le(w){let D=w[0],u=w[1],t=w[2],o=w[3];return Math.sqrt(D*D+u*u+t*t+o*o)}let ke=le;function ue(w){let D=w[0],u=w[1],t=w[2],o=w[3];return D*D+u*u+t*t+o*o}let $=ue;function q(w,D){let u=D??new l(4),t=w[0],o=w[1],r=w[2],f=w[3],d=Math.sqrt(t*t+o*o+r*r+f*f);return d>1e-5?(u[0]=t/d,u[1]=o/d,u[2]=r/d,u[3]=f/d):(u[0]=0,u[1]=0,u[2]=0,u[3]=1),u}function Y(w,D){return Math.abs(w[0]-D[0])<N&&Math.abs(w[1]-D[1])<N&&Math.abs(w[2]-D[2])<N&&Math.abs(w[3]-D[3])<N}function pe(w,D){return w[0]===D[0]&&w[1]===D[1]&&w[2]===D[2]&&w[3]===D[3]}function ze(w){let D=w??new l(4);return D[0]=0,D[1]=0,D[2]=0,D[3]=1,D}let J=v.create(),b=v.create(),y=v.create();function x(w,D,u){let t=u??new l(4),o=v.dot(w,D);return o<-.999999?(v.cross(b,w,J),v.len(J)<1e-6&&v.cross(y,w,J),v.normalize(J,J),L(J,Math.PI,t),t):o>.999999?(t[0]=0,t[1]=0,t[2]=0,t[3]=1,t):(v.cross(w,D,J),t[0]=J[0],t[1]=J[1],t[2]=J[2],t[3]=1+o,q(t,t))}let O=new l(4),U=new l(4);function G(w,D,u,t,o,r){let f=r??new l(4);return he(w,t,o,O),he(D,u,o,U),he(O,U,2*o*(1-o),f),f}return{create:T,fromValues:R,set:A,fromAxisAngle:L,toAxisAngle:C,angle:K,multiply:F,mul:Q,rotateX:V,rotateY:X,rotateZ:ne,slerp:he,inverse:te,conjugate:_e,fromMat:be,fromEuler:Ue,copy:ge,clone:ae,add:fe,subtract:re,sub:we,mulScalar:Te,scale:Oe,divScalar:ve,dot:se,lerp:Ge,length:le,len:ke,lengthSq:ue,lenSq:$,normalize:q,equalsApproximately:Y,equals:pe,identity:ze,rotationTo:x,sqlerp:G}}var Ot=new Map;function cn(l){let v=Ot.get(l);return v||(v=on(l),Ot.set(l,v)),v}function an(l){function v(u,t,o,r){let f=new l(4);return u!==void 0&&(f[0]=u,t!==void 0&&(f[1]=t,o!==void 0&&(f[2]=o,r!==void 0&&(f[3]=r)))),f}let T=v;function R(u,t,o,r,f){let d=f??new l(4);return d[0]=u,d[1]=t,d[2]=o,d[3]=r,d}function A(u,t){let o=t??new l(4);return o[0]=Math.ceil(u[0]),o[1]=Math.ceil(u[1]),o[2]=Math.ceil(u[2]),o[3]=Math.ceil(u[3]),o}function L(u,t){let o=t??new l(4);return o[0]=Math.floor(u[0]),o[1]=Math.floor(u[1]),o[2]=Math.floor(u[2]),o[3]=Math.floor(u[3]),o}function C(u,t){let o=t??new l(4);return o[0]=Math.round(u[0]),o[1]=Math.round(u[1]),o[2]=Math.round(u[2]),o[3]=Math.round(u[3]),o}function K(u,t=0,o=1,r){let f=r??new l(4);return f[0]=Math.min(o,Math.max(t,u[0])),f[1]=Math.min(o,Math.max(t,u[1])),f[2]=Math.min(o,Math.max(t,u[2])),f[3]=Math.min(o,Math.max(t,u[3])),f}function F(u,t,o){let r=o??new l(4);return r[0]=u[0]+t[0],r[1]=u[1]+t[1],r[2]=u[2]+t[2],r[3]=u[3]+t[3],r}function Q(u,t,o,r){let f=r??new l(4);return f[0]=u[0]+t[0]*o,f[1]=u[1]+t[1]*o,f[2]=u[2]+t[2]*o,f[3]=u[3]+t[3]*o,f}function V(u,t,o){let r=o??new l(4);return r[0]=u[0]-t[0],r[1]=u[1]-t[1],r[2]=u[2]-t[2],r[3]=u[3]-t[3],r}let X=V;function ne(u,t){return Math.abs(u[0]-t[0])<N&&Math.abs(u[1]-t[1])<N&&Math.abs(u[2]-t[2])<N&&Math.abs(u[3]-t[3])<N}function he(u,t){return u[0]===t[0]&&u[1]===t[1]&&u[2]===t[2]&&u[3]===t[3]}function te(u,t,o,r){let f=r??new l(4);return f[0]=u[0]+o*(t[0]-u[0]),f[1]=u[1]+o*(t[1]-u[1]),f[2]=u[2]+o*(t[2]-u[2]),f[3]=u[3]+o*(t[3]-u[3]),f}function _e(u,t,o,r){let f=r??new l(4);return f[0]=u[0]+o[0]*(t[0]-u[0]),f[1]=u[1]+o[1]*(t[1]-u[1]),f[2]=u[2]+o[2]*(t[2]-u[2]),f[3]=u[3]+o[3]*(t[3]-u[3]),f}function be(u,t,o){let r=o??new l(4);return r[0]=Math.max(u[0],t[0]),r[1]=Math.max(u[1],t[1]),r[2]=Math.max(u[2],t[2]),r[3]=Math.max(u[3],t[3]),r}function Ue(u,t,o){let r=o??new l(4);return r[0]=Math.min(u[0],t[0]),r[1]=Math.min(u[1],t[1]),r[2]=Math.min(u[2],t[2]),r[3]=Math.min(u[3],t[3]),r}function ge(u,t,o){let r=o??new l(4);return r[0]=u[0]*t,r[1]=u[1]*t,r[2]=u[2]*t,r[3]=u[3]*t,r}let ae=ge;function fe(u,t,o){let r=o??new l(4);return r[0]=u[0]/t,r[1]=u[1]/t,r[2]=u[2]/t,r[3]=u[3]/t,r}function re(u,t){let o=t??new l(4);return o[0]=1/u[0],o[1]=1/u[1],o[2]=1/u[2],o[3]=1/u[3],o}let we=re;function Te(u,t){return u[0]*t[0]+u[1]*t[1]+u[2]*t[2]+u[3]*t[3]}function Oe(u){let t=u[0],o=u[1],r=u[2],f=u[3];return Math.sqrt(t*t+o*o+r*r+f*f)}let ve=Oe;function se(u){let t=u[0],o=u[1],r=u[2],f=u[3];return t*t+o*o+r*r+f*f}let Ge=se;function le(u,t){let o=u[0]-t[0],r=u[1]-t[1],f=u[2]-t[2],d=u[3]-t[3];return Math.sqrt(o*o+r*r+f*f+d*d)}let ke=le;function ue(u,t){let o=u[0]-t[0],r=u[1]-t[1],f=u[2]-t[2],d=u[3]-t[3];return o*o+r*r+f*f+d*d}let $=ue;function q(u,t){let o=t??new l(4),r=u[0],f=u[1],d=u[2],_=u[3],g=Math.sqrt(r*r+f*f+d*d+_*_);return g>1e-5?(o[0]=r/g,o[1]=f/g,o[2]=d/g,o[3]=_/g):(o[0]=0,o[1]=0,o[2]=0,o[3]=0),o}function Y(u,t){let o=t??new l(4);return o[0]=-u[0],o[1]=-u[1],o[2]=-u[2],o[3]=-u[3],o}function pe(u,t){let o=t??new l(4);return o[0]=u[0],o[1]=u[1],o[2]=u[2],o[3]=u[3],o}let ze=pe;function J(u,t,o){let r=o??new l(4);return r[0]=u[0]*t[0],r[1]=u[1]*t[1],r[2]=u[2]*t[2],r[3]=u[3]*t[3],r}let b=J;function y(u,t,o){let r=o??new l(4);return r[0]=u[0]/t[0],r[1]=u[1]/t[1],r[2]=u[2]/t[2],r[3]=u[3]/t[3],r}let x=y;function O(u){let t=u??new l(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function U(u,t,o){let r=o??new l(4),f=u[0],d=u[1],_=u[2],g=u[3];return r[0]=t[0]*f+t[4]*d+t[8]*_+t[12]*g,r[1]=t[1]*f+t[5]*d+t[9]*_+t[13]*g,r[2]=t[2]*f+t[6]*d+t[10]*_+t[14]*g,r[3]=t[3]*f+t[7]*d+t[11]*_+t[15]*g,r}function G(u,t,o){let r=o??new l(4);return q(u,r),ge(r,t,r)}function w(u,t,o){let r=o??new l(4);return Oe(u)>t?G(u,t,r):pe(u,r)}function D(u,t,o){let r=o??new l(4);return te(u,t,.5,r)}return{create:v,fromValues:T,set:R,ceil:A,floor:L,round:C,clamp:K,add:F,addScaled:Q,subtract:V,sub:X,equalsApproximately:ne,equals:he,lerp:te,lerpV:_e,max:be,min:Ue,mulScalar:ge,scale:ae,divScalar:fe,inverse:re,invert:we,dot:Te,length:Oe,len:ve,lengthSq:se,lenSq:Ge,distance:le,dist:ke,distanceSq:ue,distSq:$,normalize:q,negate:Y,copy:pe,clone:ze,multiply:J,mul:b,divide:y,div:x,zero:O,transformMat4:U,setLength:G,truncate:w,midpoint:D}}var It=new Map;function un(l){let v=It.get(l);return v||(v=an(l),It.set(l,v)),v}function ft(l,v,T,R,A,L){return{mat3:nn(l),mat4:sn(v),quat:cn(T),vec2:Mt(R),vec3:st(A),vec4:un(L)}}var{mat3:Mn,mat4:Ce,quat:En,vec2:$e,vec3:j,vec4:je}=ft(Float32Array,Float32Array,Float32Array,Float32Array,Float32Array,Float32Array),{mat3:Rn,mat4:Un,quat:Tn,vec2:Gn,vec3:kn,vec4:zn}=ft(Float64Array,Float64Array,Float64Array,Float64Array,Float64Array,Float64Array),{mat3:Bn,mat4:An,quat:Ln,vec2:Wn,vec3:Nn,vec4:Cn}=ft(Qt,Array,Array,Array,Array,Array);var Ye=64,Ne=20,Et=(l,v=10)=>{let T=new Uint32Array(l.buffer),R=[];for(let A=0;A<v;A++){let L=A*Ne;R=[...R,{xPos:l[L+0],yPos:l[L+1],zPos:l[L+2],xVel:l[L+4],yVel:l[L+5],zVel:l[L+6],dist:l[L+8],dens:l[L+9],cell:T[L+10],test:T[L+11]}]}console.table(R)};function ee(l){return Number.isInteger(l)?l.toFixed(1):l.toString()}function Rt(l){return`vec3<f32>(${ee(l[0])}, ${ee(l[1])}, ${ee(l[2])})`}function Ut(l){let v=T=>T.toFixed(0);return`vec3<i32>(${v(l[0])}, ${v(l[1])}, ${v(l[2])})`}var it=class{initialised=!1;device={};canvas={};ctx={};renderPipeline={};instanceCount=0;vertexCount=0;vertexBuffer={};instanceBuffer={};uniformBuffer={};bindGroup={};depthTexture=null;multisampleTexture=null;clearColour={r:.1,g:.1,b:.1,a:1};multisampleCount=4;async init(){if(this.canvas=document.querySelector("#gpuCanvas"),!navigator.gpu)throw Error("WebGPU not supported.");let v=await navigator.gpu.requestAdapter();if(!v)throw Error("Couldn't request WebGPU adapter.");return this.device=await v.requestDevice(),this.ctx=this.canvas.getContext("webgpu"),this.ctx.configure({device:this.device,format:navigator.gpu.getPreferredCanvasFormat(),alphaMode:"opaque"}),this.initialised=!0,!0}createBuffersAndPipeline(v){let T=yt();this.vertexCount=T.length/5,this.instanceCount=v;let R=[{attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x2"}],arrayStride:20,stepMode:"vertex"},{attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32"},{shaderLocation:6,offset:52,format:"float32"},{shaderLocation:7,offset:56,format:"uint32"},{shaderLocation:8,offset:60,format:"float32"}],arrayStride:Ne*4,stepMode:"instance"}],A=this.device.createShaderModule({code:Dt});this.renderPipeline=this.device.createRenderPipeline({vertex:{module:A,entryPoint:"vertex_main",buffers:R},fragment:{module:A,entryPoint:"fragment_main",targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto",multisample:{count:this.multisampleCount}}),this.vertexBuffer=this.device.createBuffer({size:T.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.device.queue.writeBuffer(this.vertexBuffer,0,T,0,T.length),this.instanceBuffer=this.device.createBuffer({size:this.instanceCount*4*Ne,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});let L=160;this.uniformBuffer=this.device.createBuffer({size:L,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroup=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]})}render(v,T){if(!this.initialised)throw"WebGPU not initialised";let R=this.ctx.getCurrentTexture(),A=new Float32Array([...v,...Ce.inverse(v),this.clearColour.r,this.clearColour.g,this.clearColour.b,this.clearColour.a,...T,R.width/R.height]);this.device.queue.writeBuffer(this.uniformBuffer,0,A,0),(!this.depthTexture||this.depthTexture.width!==R.width||this.depthTexture.height!==R.height)&&(this.depthTexture?.destroy(),this.depthTexture=this.device.createTexture({size:R,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT,sampleCount:this.multisampleCount})),(!this.multisampleTexture||this.multisampleTexture.width!==R.width||this.multisampleTexture.height!==R.height)&&(this.multisampleTexture&&this.multisampleTexture.destroy(),this.multisampleTexture=this.device.createTexture({format:R.format,usage:GPUTextureUsage.RENDER_ATTACHMENT,size:[R.width,R.height],sampleCount:this.multisampleCount}));let L=this.device.createCommandEncoder(),C=L.beginRenderPass({colorAttachments:[{clearValue:this.clearColour,loadOp:"clear",storeOp:"store",view:this.multisampleTexture.createView(),resolveTarget:R.createView()}],depthStencilAttachment:{depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store",view:this.depthTexture.createView()}});C.setPipeline(this.renderPipeline),C.setVertexBuffer(0,this.vertexBuffer),C.setVertexBuffer(1,this.instanceBuffer),C.setBindGroup(0,this.bindGroup),C.draw(this.vertexCount,this.instanceCount,0,0),C.end(),this.device.queue.submit([L.finish()])}};var We=1,fn=j.create(200,100,25),He=j.floor(j.divScalar(fn,We)),ln=j.mulScalar(He,We),Ve=`

const gridSize = ${Ut(He)};
const bounds = ${Rt(ln)};

const cellWidth = ${ee(We)};


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
`,lt=l=>`
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

        ${l};

        neighbourIterator++;
      }
    }
  }
}
`;var pn=`
struct Particle {
  position: vec4<f32>, // xyz used
  velocity: vec4<f32>, // xyz used
  normal: vec4<f32>,
  lastDist: f32,
  density: f32,
  cellIndex: u32,
  group: f32,
  groupCentroid: vec4<f32>
}
const UNSPAWNED_PARTICLE: u32 = 0xFFFFFFFF;
`,Ke=`
${pn}
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

`,Fe=`
@compute @workgroup_size(${Ye}, 1, 1) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
)
`,qe=`workgroup_id.x * ${Ye} + local_invocation_id.x`;var Tt=`

${Ke}


${Ve}


${Fe} {
  let id = ${qe};

  var position = particles0[id].position.xyz;
  position += bounds * 0.5; // offset so grid bounding box applies from [-0.5*bound, +0.5*bound]
  
  var cellId3D = vec3<i32>(floor(position / cellWidth));
  var cellIdFlat = getCellIdFlat(cellId3D);

  // cellIdFlat = select(cellIdFlat, UNSPAWNED_PARTICLE, id >= uniforms.particleCount);

  particles0[id].cellIndex = cellIdFlat;
  particles1[id].cellIndex = cellIdFlat;

  cellIds[id] = cellIdFlat;
  particleIds[id] = id;
}

`;var Gt=`

${Ke.replace("cellOffsets: array<u32>","cellOffsets: array<atomic<u32>>")}

${Fe} {
  let id = ${qe};

  let particleId = particleIds[id]; // index of this cell within the particles buffer
  let cellId = cellIds[id];

  particles0[id] = particles1[particleId];

  


  // the offset to the first appearance of each cell within the sorted cellId list is the minimum of ids
  atomicMin(&cellOffsets[cellId], id);
}
`;var kt=.8,dn=250,hn=1,_n=.118,gn=1,wn=ee(315/(64*Math.PI*Math.pow(We,9))),vn=ee(-45/(Math.PI*Math.pow(We,6))),mn=ee(45/(Math.PI*Math.pow(We,6))),ot=`

const h = ${ee(We)};
const h2 = ${ee(Math.pow(We,2))};
const h3 = ${ee(Math.pow(We,3))};

const densityH = ${ee(We*kt)};
const densityH2 = ${ee(Math.pow(We*kt,2))};

const particleFluidMass = ${ee(gn)};
const p0 = ${ee(hn)};
const K = ${ee(dn)};
const e = ${ee(_n)};

fn particleDensity(particle: Particle) -> vec4<f32> {
  // also finds group neighbour centroid (.yzw of return)
  var density = 0.0;

  var groupCentroid = particle.position.xyz;
  var groupNeighbourCount = 1.0;

  ${lt(`
    let diff = particle.position.xyz - particleB.position.xyz;
    let r2 = dot(diff, diff);
    if (r2 < h2) {
      let W = ${wn} * pow(h2 - r2, 3.0);
      density += particleFluidMass * W;

      let groupDist = 0.5*abs(particle.group - particleB.group); // 0 if the same, 1 if different
      groupCentroid += (1.0-groupDist) * particleB.position.xyz; 
      groupNeighbourCount += 1.0-groupDist;
    }
  `)}

  groupCentroid /= groupNeighbourCount;
  

  return vec4<f32>(max(p0, density), groupCentroid.x, groupCentroid.y, groupCentroid.z);
}

fn particlePressure(density: f32) -> f32 {
  return K * (density - p0);
}

fn fluidAccel(particle: Particle, id: u32) -> vec3<f32> {
  var pressureForce = vec3<f32>(0.0);
  var viscosityForce = vec3<f32>(0.0);

  let pressureA = particlePressure(particle.density);

  var groupNeighbourPosSum = vec3<f32>(0.0);
  var neighbourCount = 0.01;
  
  ${lt(`
    if (particleBIndex != id) {

      let diff = particle.position.xyz - particleB.position.xyz;
      let r2 = dot(diff, diff);
        let r = sqrt(r2);

      if (r2 > 0 && r2 < h2) {
        let rNorm = diff / r;
        let r3 = r2 * r;

        let groupDist = 0.5*abs(particle.group - particleB.group); // 0 if the same, 1 if different

        // PRESSURE FORCE
        let W1 = ${vn} * pow(h-r, 2.0);
        let pressureB = (1.0 + 10.0*groupDist) * particlePressure(particleB.density);
        pressureForce += W1 * rNorm * (pressureA + pressureB) / (2.0 * particle.density * particleB.density);


        // VISCOSITY FORCE
        // let W2 = -(r3 / (2.0 * h3)) + (r2 / h2) + (h / (2.0 * r)) - 1;
        var W2 = ${mn} * (h - r);
        viscosityForce += (1.0-2.0*groupDist) * W2 * rNorm * (particleB.velocity.xyz - particle.velocity.xyz) / particleB.density;


        // GROUP COHESION
        // move towards particles of same group
        groupNeighbourPosSum += (1.0-groupDist) * particleB.groupCentroid.xyz; 
        neighbourCount += 1.0-groupDist;
        
      }
    }
  `)}

  var force = (e*viscosityForce - pressureForce) / particle.density;


  // group cohesion force (disabled)
  // // let sameGroupCentroidDir = (sameGroupNeighbourPosSum.xyz / sameGroupNeighbourPosSum.w) - particle.position.xyz;
  // // let diffGroupCentroidDir = (diffGroupNeighbourPosSum.xyz / diffGroupNeighbourPosSum.w) - particle.position.xyz;
  // // force += 0.3* sameGroupCentroidDir - 0.0*diffGroupCentroidDir;
  // force += 1.0 * (groupNeighbourPosSum / neighbourCount - particle.position.xyz);

  return force / particleFluidMass;
}


`;var zt=`

${Ke}
${Ve}
${ot}


${Fe} {
  let id = ${qe};

  let densityAndCentroid = particleDensity(particles0[id]);

  particles0[id].density = densityAndCentroid.x;
  particles0[id].groupCentroid = vec4<f32>(densityAndCentroid.yzw, 1.0);
}

`;var Dn=ee(.05),yn=ee(-2),Pn=ee(-1),xn=ee(200),Bt=`

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


    // MOUSE INTERACTION

    // find closest point on line between mouseIntersection and lastMouseIntersection
    let p1 = uniforms.mouseIntersection;
    let p2 = uniforms.lastMouseIntersection;  
    
    let v = p2 - p1;
    let w = pos.xy - p1;

    let t = saturate(dot(w, v) / dot(v, v));
    let closestPoint = p1 + t*v;


    const mouseDisturbRadius = 5.0;
    const mouseDisturbSharpness = 18.0;

    var dist = pos.xy - closestPoint;
    dist *= 1.0/mouseDisturbRadius;
    

    return mouseDisturbSharpness*exp(-dot(dist, dist));
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

const gravityClamp = ${xn};
fn gravityAccel(pos: vec3<f32>, dist: f32, fieldNormal: vec3<f32>, lastDist: f32) -> vec3<f32> {
  let dist2 = dist; // max(dist, 0.0);         // uncomment to allow particles inside volumes
  let lastDist2 = lastDist; // max(lastDist, 0.0);

  let dDistdt = (dist2 - lastDist2) / uniforms.deltaTime;
  var gravityAmount = -${yn}*dist2 - ${Pn}*dDistdt;
  gravityAmount = atan(gravityAmount / gravityClamp) * gravityClamp;

  var gravity = -fieldNormal * gravityAmount;

  return gravity / ${Dn};

}


`;var At=`

${Ke}
${Ve}
${ot}
${Bt}

const accelDeltaTime = 0.01; // hardcoded deltaTime for acceleration calculation to prevent explosion
const velocityClamp = 100.0;


${Fe} {
  let id = ${qe};
  let particle = particles0[id];

  var position = particle.position.xyz;
  var velocity = particle.velocity.xyz;


  
  // fluid force
  var acceleration = fluidAccel(particle, id);
  
  // field gravity
  let fieldDist = sdf(position);
  let fieldNormal = sdfNormal(position);
  acceleration += gravityAccel(position, fieldDist, fieldNormal, particle.lastDist);

  // group move to top/bottom
  acceleration += vec3<f32>(0.0, -3.0*particle.group, 0.0);
  
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
    particle.group,
    particle.groupCentroid
  );

}
`;var Nt=jt(Wt(),1);var at=class{device;computeShaders=[Tt,Gt,zt,At];pipelines=[];bindGroup;particleCount=0;maxParticleCount;spawnPeriod=3;particleDataBuffer0;particleDataBuffer1;renderInstanceBuffer;cellIndexBuffer;particleIdBuffer;cellOffsetBuffer;cellOffsetStartBuffer;uniformBuffer;time=0;uniforms=new Map([["time",{length:1,value:new Float32Array([0])}],["deltaTime",{length:1,value:new Float32Array([0])}],["mouseIntersection",{length:2,value:new Float32Array([0,0])}],["lastMouseIntersection",{length:2,value:new Float32Array([0,0])}],["animSpeed",{length:1,value:new Float32Array([0])}],["particleCount",{length:1,value:new Uint32Array([0])}]]);uniformsLength=Array.from(this.uniforms.values()).reduce((v,T)=>v+T.length,0);resultBuffer;constructor(v,T,R,A){this.device=v,this.maxParticleCount=T,this.particleCount=0,this.renderInstanceBuffer=A;let L=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),C=this.device.createPipelineLayout({bindGroupLayouts:[L]});for(let F=0;F<this.computeShaders.length;F++){let Q=this.device.createShaderModule({label:`particle update ${F}`,code:this.computeShaders[F]});this.pipelines.push(v.createComputePipeline({label:`particle update ${F} pipeline`,layout:C,compute:{module:Q}}))}this.particleDataBuffer0=v.createBuffer({size:this.maxParticleCount*4*Ne,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this.particleDataBuffer1=v.createBuffer({size:this.maxParticleCount*4*Ne,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),v.queue.writeBuffer(this.particleDataBuffer0,0,R),v.queue.writeBuffer(this.particleDataBuffer1,0,R),this.cellIndexBuffer=v.createBuffer({size:this.maxParticleCount*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.particleIdBuffer=v.createBuffer({size:this.maxParticleCount*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});let K=He[0]*He[1]*He[2];this.cellOffsetBuffer=v.createBuffer({size:K*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.cellOffsetStartBuffer=v.createBuffer({size:K*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),v.queue.writeBuffer(this.cellOffsetStartBuffer,0,new Uint32Array(K).fill(4294967295)),this.uniformBuffer=v.createBuffer({size:this.uniformsLength*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.resultBuffer=v.createBuffer({size:this.particleDataBuffer0.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.bindGroup=v.createBindGroup({layout:L,entries:[{binding:0,resource:{buffer:this.particleDataBuffer0}},{binding:1,resource:{buffer:this.particleDataBuffer1}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.cellIndexBuffer}},{binding:4,resource:{buffer:this.particleIdBuffer}},{binding:5,resource:{buffer:this.cellOffsetBuffer}}]})}sort(v){let T=new Nt.RadixSortKernel({device:this.device,keys:this.cellIndexBuffer,values:this.particleIdBuffer,count:this.maxParticleCount,check_order:!1,bit_count:32,workgroup_size:{x:16,y:16}}),R=v.beginComputePass();T.dispatch(R),R.end()}async run(v,T,R){this.time+=v,this.particleCount+=this.maxParticleCount*(v/this.spawnPeriod),this.particleCount=Math.min(this.particleCount,this.maxParticleCount),this.uniforms.get("time").value[0]=this.time,this.uniforms.get("deltaTime").value[0]=v,this.uniforms.get("mouseIntersection").value=T,this.uniforms.get("lastMouseIntersection").value=R,this.uniforms.get("animSpeed").value[0]=window.PAUSE_UPDATE?0:1,this.uniforms.get("particleCount").value[0]=this.particleCount;let A=new Float32Array(this.uniformsLength),L=0;for(let[V,{length:X,value:ne}]of this.uniforms)A.set(ne,L),L+=X;this.device.queue.writeBuffer(this.uniformBuffer,0,A,0);let C=this.device.createCommandEncoder();C.copyBufferToBuffer(this.cellOffsetStartBuffer,this.cellOffsetBuffer);let K=V=>{let X=C.beginComputePass();X.setPipeline(V),X.setBindGroup(0,this.bindGroup),X.dispatchWorkgroups(this.maxParticleCount/Ye,1,1),X.end()};K(this.pipelines[0]),this.sort(C),K(this.pipelines[1]),K(this.pipelines[2]),K(this.pipelines[3]),C.copyBufferToBuffer(this.particleDataBuffer1,this.particleDataBuffer0),C.copyBufferToBuffer(this.particleDataBuffer1,0,this.renderInstanceBuffer,0);let F=window.DEBUG_BUF===3?this.cellOffsetBuffer:window.DEBUG_BUF===2?this.particleIdBuffer:window.DEBUG_BUF===1?this.cellIndexBuffer:this.particleDataBuffer0;C.copyBufferToBuffer(F,0,this.resultBuffer,0);let Q=C.finish();if(this.device.queue.submit([Q]),window.LOG_INSTANCE_DATA){if(window.LOG_INSTANCE_DATA=!1,await this.resultBuffer.mapAsync(GPUMapMode.READ),window.DEBUG_BUF){let V=new Uint32Array(this.resultBuffer.getMappedRange());console.log(V)}else{let V=new Float32Array(this.resultBuffer.getMappedRange());Et(V)}this.resultBuffer.unmap()}}};var ut=class{viewDistance=84;camPos=j.create(0,0,this.viewDistance);viewMatrix=Ce.lookAt(this.camPos,[0,0,0],[0,1,0]);viewProjectionMatrix=Ce.identity();viewAngles=$e.create(0,0);mouseCoord=$e.create(0,0);mouseDown=!1;lastMouseCoord=$e.create(0,0);mouseIntersection=j.create(0,0,0);lastMouseIntersection=j.create(0,0,0);constructor(){window.addEventListener("mousemove",v=>{let T=v.target.getBoundingClientRect();this.mouseCoord[0]=(v.clientX-T.left)/T.width*2-1,this.mouseCoord[1]=-((v.clientY-T.top)/T.height*2-1)}),window.addEventListener("mousedown",v=>{this.mouseDown=!0}),window.addEventListener("mouseup",v=>{this.mouseDown=!1}),window.addEventListener("wheel",v=>{this.viewDistance+=.1*this.viewDistance*(v.deltaY>0?1:-1),this.viewDistance=Math.max(5,Math.min(200,this.viewDistance))})}createInitialParticleData(v){let T=new Float32Array(v*Ne);for(let R=0;R<v;R++){let A=j.create(Math.random(),Math.random(),Math.random());A=j.sub(A,j.create(.5,.5,.5)),A=j.multiply(A,j.create(20,50,20));let L=[-2.05,-1.05,0,1,2].map(X=>X*40),C=Math.floor(Math.random()*L.length),K=Math.random()>.5?1:-1;A=j.add(A,j.create(L[C],80*K,0));let F=20,Q=j.create(0,-20,0),V=j.create(0,1,0);T.set([A[0],A[1],A[2],1,Q[0],Q[1],Q[2],1,V[0],V[1],V[2],1,0,0,0,K],R*Ne)}return T}update(v){if(this.mouseDown){let ne=$e.subtract(this.mouseCoord,this.lastMouseCoord);this.viewAngles[0]+=ne[0]*1.5,this.viewAngles[1]+=ne[1]*-1}this.camPos=j.create(0,0,this.viewDistance),this.camPos=j.rotateX(this.camPos,j.zero(),this.viewAngles[1]),this.camPos=j.rotateY(this.camPos,j.zero(),this.viewAngles[0]);let T=Ce.lookAt(this.camPos,[0,0,0],[0,1,0]),R=Ce.perspective(1,v.width/v.height,.1,1e3);this.viewProjectionMatrix=Ce.multiply(R,T);let A=je.create(this.mouseCoord[0],this.mouseCoord[1],-1,1),L=je.create(this.mouseCoord[0],this.mouseCoord[1],1,1),C=Ce.inverse(this.viewProjectionMatrix),K=je.transformMat4(A,C),F=je.transformMat4(L,C);K=j.create(K[0]/K[3],K[1]/K[3],K[2]/K[3]),F=j.create(F[0]/F[3],F[1]/F[3],F[2]/F[3]);let Q=K,V=j.normalize(j.sub(F,K)),X=-Q[2]/V[2];this.lastMouseIntersection=this.mouseIntersection,this.mouseIntersection=j.add(Q,j.scale(V,X)),this.lastMouseCoord=$e.clone(this.mouseCoord)}};var pt=1600*Ye,Ze=new ut,ht=Date.now(),Ct=0,dt=0;function Kt(l,v){let T=Date.now(),R=(T-ht)/1e3;ht=T,Ct++,dt+=R,window.LOG_FPS&&Ct%100==0&&(console.log("FPS ",1/(dt/100)),dt=0),Ze.update(l.ctx.canvas),v.run(Math.min(R,.1),Ze.mouseIntersection,Ze.lastMouseIntersection),l.render(Ze.viewProjectionMatrix,Ze.camPos),requestAnimationFrame(()=>Kt(l,v))}async function Sn(){let l=new it;if(!await l.init())return;new ResizeObserver(L=>{for(let C of L){let K=C.contentBoxSize[0].inlineSize,F=C.contentBoxSize[0].blockSize,Q=C.target;Q.width=Math.max(1,Math.min(K,l.device.limits.maxTextureDimension2D)),Q.height=Math.max(1,Math.min(F,l.device.limits.maxTextureDimension2D))}}).observe(l.canvas);let R=Ze.createInitialParticleData(pt);l.createBuffersAndPipeline(pt);let A=new at(l.device,pt,R,l.instanceBuffer);ht=Date.now(),requestAnimationFrame(()=>Kt(l,A))}Sn();})();
