"use strict";(()=>{var Ft=Object.create;var mt=Object.defineProperty;var qt=Object.getOwnPropertyDescriptor;var Yt=Object.getOwnPropertyNames;var $t=Object.getPrototypeOf,Vt=Object.prototype.hasOwnProperty;var Zt=(l,v)=>()=>(v||l((v={exports:{}}).exports,v),v.exports);var Ht=(l,v,I,T)=>{if(v&&typeof v=="object"||typeof v=="function")for(let L of Yt(v))!Vt.call(l,L)&&L!==I&&mt(l,L,{get:()=>v[L],enumerable:!(T=qt(v,L))||T.enumerable});return l};var jt=(l,v,I)=>(I=l!=null?Ft($t(l)):{},Ht(v||!l||!l.__esModule?mt(I,"default",{value:l,enumerable:!0}):I,l));var Wt=Zt((ct,Lt)=>{(function(l,v){typeof ct=="object"&&typeof Lt<"u"?v(ct):typeof define=="function"&&define.amd?define(["exports"],v):(l=typeof globalThis<"u"?globalThis:l||self,v(l.RadixSort={}))})(ct,(function(l){"use strict";function v(O,y){(y==null||y>O.length)&&(y=O.length);for(var S=0,b=Array(y);S<y;S++)b[S]=O[S];return b}function I(O){if(Array.isArray(O))return v(O)}function T(O,y,S){if(typeof O=="function"?O===y:O.has(y))return arguments.length<3?y:S;throw new TypeError("Private element is not present on this object")}function L(O,y){if(y.has(O))throw new TypeError("Cannot initialize the same private elements twice on an object")}function A(O,y){if(!(O instanceof y))throw new TypeError("Cannot call a class as a function")}function Q(O,y){L(O,y),y.add(O)}function H(O,y){for(var S=0;S<y.length;S++){var b=y[S];b.enumerable=b.enumerable||!1,b.configurable=!0,"value"in b&&(b.writable=!0),Object.defineProperty(O,Oe(b.key),b)}}function F(O,y,S){return y&&H(O.prototype,y),S&&H(O,S),Object.defineProperty(O,"prototype",{writable:!1}),O}function $(O,y,S){return(y=Oe(y))in O?Object.defineProperty(O,y,{value:S,enumerable:!0,configurable:!0,writable:!0}):O[y]=S,O}function V(O){if(typeof Symbol<"u"&&O[Symbol.iterator]!=null||O["@@iterator"]!=null)return Array.from(O)}function j(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ae(O,y){var S=Object.keys(O);if(Object.getOwnPropertySymbols){var b=Object.getOwnPropertySymbols(O);y&&(b=b.filter(function(U){return Object.getOwnPropertyDescriptor(O,U).enumerable})),S.push.apply(S,b)}return S}function ne(O){for(var y=1;y<arguments.length;y++){var S=arguments[y]!=null?arguments[y]:{};y%2?ae(Object(S),!0).forEach(function(b){$(O,b,S[b])}):Object.getOwnPropertyDescriptors?Object.defineProperties(O,Object.getOwnPropertyDescriptors(S)):ae(Object(S)).forEach(function(b){Object.defineProperty(O,b,Object.getOwnPropertyDescriptor(S,b))})}return O}function te(O){return I(O)||V(O)||Ue(O)||j()}function _e(O,y){if(typeof O!="object"||!O)return O;var S=O[Symbol.toPrimitive];if(S!==void 0){var b=S.call(O,y||"default");if(typeof b!="object")return b;throw new TypeError("@@toPrimitive must return a primitive value.")}return(y==="string"?String:Number)(O)}function Oe(O){var y=_e(O,"string");return typeof y=="symbol"?y:y+""}function Ue(O,y){if(O){if(typeof O=="string")return v(O,y);var S={}.toString.call(O).slice(8,-1);return S==="Object"&&O.constructor&&(S=O.constructor.name),S==="Map"||S==="Set"?Array.from(O):S==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(S)?v(O,y):void 0}}var we=`

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
}`,ue=`

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
}`;function le(O,y){var S={x:y,y:1};if(y>O.limits.maxComputeWorkgroupsPerDimension){var b=Math.floor(Math.sqrt(y)),U=Math.ceil(y/b);S.x=b,S.y=U}return S}function re(O){var y=O.device,S=O.label,b=O.data,U=O.usage,G=U===void 0?0:U,g=y.createBuffer({label:S,usage:G,size:b.length*4,mappedAtCreation:!0}),D=new Uint32Array(g.getMappedRange());return D.set(b),g.unmap(),g}var ge=(function(){function O(y){var S=y.device,b=y.data,U=y.count,G=y.workgroup_size,g=G===void 0?{x:16,y:16}:G,D=y.avoid_bank_conflicts,u=D===void 0?!1:D;if(A(this,O),this.device=S,this.workgroup_size=g,this.threads_per_workgroup=g.x*g.y,this.items_per_workgroup=2*this.threads_per_workgroup,Math.log2(this.threads_per_workgroup)%1!==0)throw new Error("workgroup_size.x * workgroup_size.y must be a power of two. (current: ".concat(this.threads_per_workgroup,")"));this.pipelines=[],this.shaderModule=this.device.createShaderModule({label:"prefix-sum",code:u?ue:we}),this.create_pass_recursive(b,U)}return F(O,[{key:"create_pass_recursive",value:function(S,b){var U=Math.ceil(b/this.items_per_workgroup),G=le(this.device,U),g=this.device.createBuffer({label:"prefix-sum-block-sum",size:U*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),D=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),u=this.device.createBindGroup({label:"prefix-sum-bind-group",layout:D,entries:[{binding:0,resource:{buffer:S}},{binding:1,resource:{buffer:g}}]}),t=this.device.createPipelineLayout({bindGroupLayouts:[D]}),o=this.device.createComputePipeline({label:"prefix-sum-scan-pipeline",layout:t,compute:{module:this.shaderModule,entryPoint:"reduce_downsweep",constants:{WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y,THREADS_PER_WORKGROUP:this.threads_per_workgroup,ITEMS_PER_WORKGROUP:this.items_per_workgroup,ELEMENT_COUNT:b}}});if(this.pipelines.push({pipeline:o,bindGroup:u,dispatchSize:G}),U>1){this.create_pass_recursive(g,U);var r=this.device.createComputePipeline({label:"prefix-sum-add-block-pipeline",layout:t,compute:{module:this.shaderModule,entryPoint:"add_block_sums",constants:{WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y,THREADS_PER_WORKGROUP:this.threads_per_workgroup,ELEMENT_COUNT:b}}});this.pipelines.push({pipeline:r,bindGroup:u,dispatchSize:G})}}},{key:"get_dispatch_chain",value:function(){return this.pipelines.flatMap(function(S){return[S.dispatchSize.x,S.dispatchSize.y,1]})}},{key:"dispatch",value:function(S,b){for(var U=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,G=0;G<this.pipelines.length;G++){var g=this.pipelines[G],D=g.pipeline,u=g.bindGroup,t=g.dispatchSize;S.setPipeline(D),S.setBindGroup(0,u),b==null?S.dispatchWorkgroups(t.x,t.y,1):S.dispatchWorkgroupsIndirect(b,U+G*3*4)}}}])})(),Ge=`

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
}`,be=`

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
}`,se=function(){var y=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1,S=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,b=arguments.length>2&&arguments[2]!==void 0?arguments[2]:"full";return`

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
    `.concat(y?de:"s_data[TID] = select(0u, input[GID], GID < ELEMENT_COUNT);",`

    // Perform parallel reduction
    for (var d = 1u; d < THREADS_PER_WORKGROUP; d *= 2u) {      
        workgroupBarrier();  
        if (TID % (2u * d) == 0u) {
            s_data[TID] += s_data[TID + d];
        }
    }
    workgroupBarrier();

    // Write reduction result
    `).concat(S?ke(b):Te,`
}`)},Te=`
    if (TID == 0) {
        output[WORKGROUP_ID] = s_data[0];
    }
`,de=`
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

    `.concat(y=="full"?q:fe,`
`)},fe=`
    output[dispatchIndex] = select(0, original[dispatchIndex], s_data[0] == 0 && is_sorted == 0u);
`,q=`
    if (TID == 0 && s_data[0] == 0) {
        is_sorted = 1u;
    }

    output[dispatchIndex] = select(0, original[dispatchIndex], s_data[0] != 0);
`,K=(function(){function O(y){var S=y.device,b=y.data,U=y.result,G=y.original,g=y.is_sorted,D=y.count,u=y.start,t=u===void 0?0:u,o=y.mode,r=o===void 0?"full":o,f=y.workgroup_size,p=f===void 0?{x:16,y:16}:f;A(this,O),this.device=S,this.count=D,this.start=t,this.mode=r,this.workgroup_size=p,this.threads_per_workgroup=p.x*p.y,this.pipelines=[],this.buffers={data:b,result:U,original:G,is_sorted:g,outputs:[]},this.create_passes_recursive(b,D)}return F(O,[{key:"create_passes_recursive",value:function(S,b){var U=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,G=Math.ceil(b/this.threads_per_workgroup),g=U===0,D=G<=1,u="check-sort-".concat(this.mode,"-").concat(U),t=D?this.buffers.result:this.device.createBuffer({label:u,size:G*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),o=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}].concat(te(D?[{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]:[]))}),r=this.device.createBindGroup({layout:o,entries:[{binding:0,resource:{buffer:S}},{binding:1,resource:{buffer:t}}].concat(te(D?[{binding:2,resource:{buffer:this.buffers.original}},{binding:3,resource:{buffer:this.buffers.is_sorted}}]:[]))}),f=this.device.createPipelineLayout({bindGroupLayouts:[o]}),p=g?this.start+b:b,_=g?this.start:0,w=this.device.createComputePipeline({layout:f,compute:{module:this.device.createShaderModule({label:u,code:se(g,D,this.mode)}),entryPoint:this.mode=="reset"?"reset":"check_sort",constants:ne({ELEMENT_COUNT:p,WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y},this.mode!="reset"&&{THREADS_PER_WORKGROUP:this.threads_per_workgroup,START_ELEMENT:_})}});this.buffers.outputs.push(t),this.pipelines.push({pipeline:w,bindGroup:r}),D||this.create_passes_recursive(t,G,U+1)}},{key:"dispatch",value:function(S,b){for(var U=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,G=0;G<this.pipelines.length;G++){var g=this.pipelines[G],D=g.pipeline,u=g.bindGroup,t=this.mode!="reset"&&(this.mode=="full"||G<this.pipelines.length-1);S.setPipeline(D),S.setBindGroup(0,u),t?S.dispatchWorkgroupsIndirect(b,U+G*3*4):S.dispatchWorkgroups(1,1,1)}}}],[{key:"find_optimal_dispatch_chain",value:function(S,b,U){var G=U.x*U.y,g=[];do{var D=Math.ceil(b/G),u=le(S,D);g.push(u.x,u.y,1),b=D}while(b>1);return g}}])})(),C=new WeakSet,pe=(function(){function O(){var y=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},S=y.device,b=y.keys,U=y.values,G=y.count,g=y.bit_count,D=g===void 0?32:g,u=y.workgroup_size,t=u===void 0?{x:16,y:16}:u,o=y.check_order,r=o===void 0?!1:o,f=y.local_shuffle,p=f===void 0?!1:f,_=y.avoid_bank_conflicts,w=_===void 0?!1:_;if(A(this,O),Q(this,C),S==null)throw new Error("No device provided");if(b==null)throw new Error("No keys buffer provided");if(!Number.isInteger(G)||G<=0)throw new Error("Invalid count parameter");if(!Number.isInteger(D)||D<=0||D>32)throw new Error("Invalid bit_count parameter: ".concat(D));if(!Number.isInteger(t.x)||!Number.isInteger(t.y))throw new Error("Invalid workgroup_size parameter");if(D%4!=0)throw new Error("bit_count must be a multiple of 4");this.device=S,this.count=G,this.bit_count=D,this.workgroup_size=t,this.check_order=r,this.local_shuffle=p,this.avoid_bank_conflicts=w,this.threads_per_workgroup=t.x*t.y,this.workgroup_count=Math.ceil(G/this.threads_per_workgroup),this.prefix_block_workgroup_count=4*this.workgroup_count,this.has_values=U!=null,this.dispatchSize={},this.shaderModules={},this.kernels={},this.pipelines=[],this.buffers={keys:b,values:U},this.create_shader_modules(),this.create_pipelines()}return F(O,[{key:"create_shader_modules",value:function(){var S=function(G){return G.split(`
`).filter(function(g){return!g.toLowerCase().includes("values")}).join(`
`)},b=this.local_shuffle?be:Ge;this.shaderModules={blockSum:this.device.createShaderModule({label:"radix-sort-block-sum",code:this.has_values?b:S(b)}),reorder:this.device.createShaderModule({label:"radix-sort-reorder",code:this.has_values?ve:S(ve)})}}},{key:"create_pipelines",value:function(){this.create_prefix_sum_kernel();var S=this.calculate_dispatch_sizes();this.create_buffers(S),this.create_check_sort_kernels(S);for(var b=0;b<this.bit_count;b+=2){var U=b%4==0,G=U?this.buffers.keys:this.buffers.tmpKeys,g=U?this.buffers.values:this.buffers.tmpValues,D=U?this.buffers.tmpKeys:this.buffers.keys,u=U?this.buffers.tmpValues:this.buffers.values,t=this.create_block_sum_pipeline(G,g,b),o=this.create_reorder_pipeline(G,g,D,u,b);this.pipelines.push({blockSumPipeline:t,reorderPipeline:o})}}},{key:"create_prefix_sum_kernel",value:function(){var S=this.device.createBuffer({label:"radix-sort-prefix-block-sum",size:this.prefix_block_workgroup_count*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),b=new ge({device:this.device,data:S,count:this.prefix_block_workgroup_count,workgroup_size:this.workgroup_size,avoid_bank_conflicts:this.avoid_bank_conflicts});this.kernels.prefixSum=b,this.buffers.prefixBlockSum=S}},{key:"calculate_dispatch_sizes",value:function(){var S=le(this.device,this.workgroup_count),b=this.kernels.prefixSum.get_dispatch_chain(),U=Math.min(this.count,this.threads_per_workgroup*4),G=this.count-U,g=U-1,D=K.find_optimal_dispatch_chain(this.device,U,this.workgroup_size),u=K.find_optimal_dispatch_chain(this.device,G,this.workgroup_size),t=[S.x,S.y,1].concat(te(D.slice(0,3)),te(b));return this.dispatchOffsets={radix_sort:0,check_sort_fast:12,prefix_sum:24},this.dispatchSize=S,this.initialDispatch=t,{initialDispatch:t,dispatchSizesFull:u,check_sort_fast_count:U,check_sort_full_count:G,start_full:g}}},{key:"create_buffers",value:function(S){var b=this.device.createBuffer({label:"radix-sort-tmp-keys",size:this.count*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),U=this.has_values?this.device.createBuffer({label:"radix-sort-tmp-values",size:this.count*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}):null,G=this.device.createBuffer({label:"radix-sort-local-prefix-sum",size:this.count*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});if(this.buffers.tmpKeys=b,this.buffers.tmpValues=U,this.buffers.localPrefixSum=G,!!this.check_order){var g=re({device:this.device,label:"radix-sort-dispatch-size",data:S.initialDispatch,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.INDIRECT}),D=re({device:this.device,label:"radix-sort-dispatch-size-original",data:S.initialDispatch,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),u=re({label:"check-sort-full-dispatch-size",device:this.device,data:S.dispatchSizesFull,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.INDIRECT}),t=re({label:"check-sort-full-dispatch-size-original",device:this.device,data:S.dispatchSizesFull,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),o=re({label:"is-sorted",device:this.device,data:new Uint32Array([0]),usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST});this.buffers.dispatchSize=g,this.buffers.originalDispatchSize=D,this.buffers.checkSortFullDispatchSize=u,this.buffers.originalCheckSortFullDispatchSize=t,this.buffers.isSorted=o}}},{key:"create_check_sort_kernels",value:function(S){if(this.check_order){var b=S.check_sort_fast_count,U=S.check_sort_full_count,G=S.start_full,g=new K({mode:"full",device:this.device,data:this.buffers.keys,result:this.buffers.dispatchSize,original:this.buffers.originalDispatchSize,is_sorted:this.buffers.isSorted,count:U,start:G,workgroup_size:this.workgroup_size}),D=new K({mode:"fast",device:this.device,data:this.buffers.keys,result:this.buffers.checkSortFullDispatchSize,original:this.buffers.originalCheckSortFullDispatchSize,is_sorted:this.buffers.isSorted,count:b,workgroup_size:this.workgroup_size}),u=this.initialDispatch.length/3;if(D.threads_per_workgroup<g.pipelines.length||g.threads_per_workgroup<u){console.warn("Warning: workgroup size is too small to enable check sort optimization, disabling..."),this.check_order=!1;return}var t=new K({mode:"reset",device:this.device,data:this.buffers.keys,original:this.buffers.originalDispatchSize,result:this.buffers.dispatchSize,is_sorted:this.buffers.isSorted,count:u,workgroup_size:le(this.device,u)});this.kernels.checkSort={reset:t,fast:D,full:g}}}},{key:"create_block_sum_pipeline",value:function(S,b,U){var G=this.device.createBindGroupLayout({label:"radix-sort-block-sum",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:this.local_shuffle?"storage":"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}].concat(te(this.local_shuffle&&this.has_values?[{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]:[]))}),g=this.device.createBindGroup({layout:G,entries:[{binding:0,resource:{buffer:S}},{binding:1,resource:{buffer:this.buffers.localPrefixSum}},{binding:2,resource:{buffer:this.buffers.prefixBlockSum}}].concat(te(this.local_shuffle&&this.has_values?[{binding:3,resource:{buffer:b}}]:[]))}),D=this.device.createPipelineLayout({bindGroupLayouts:[G]}),u=this.device.createComputePipeline({label:"radix-sort-block-sum",layout:D,compute:{module:this.shaderModules.blockSum,entryPoint:"radix_sort",constants:{WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y,WORKGROUP_COUNT:this.workgroup_count,THREADS_PER_WORKGROUP:this.threads_per_workgroup,ELEMENT_COUNT:this.count,CURRENT_BIT:U}}});return{pipeline:u,bindGroup:g}}},{key:"create_reorder_pipeline",value:function(S,b,U,G,g){var D=this.device.createBindGroupLayout({label:"radix-sort-reorder",entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}].concat(te(this.has_values?[{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]:[]))}),u=this.device.createBindGroup({layout:D,entries:[{binding:0,resource:{buffer:S}},{binding:1,resource:{buffer:U}},{binding:2,resource:{buffer:this.buffers.localPrefixSum}},{binding:3,resource:{buffer:this.buffers.prefixBlockSum}}].concat(te(this.has_values?[{binding:4,resource:{buffer:b}},{binding:5,resource:{buffer:G}}]:[]))}),t=this.device.createPipelineLayout({bindGroupLayouts:[D]}),o=this.device.createComputePipeline({label:"radix-sort-reorder",layout:t,compute:{module:this.shaderModules.reorder,entryPoint:"radix_sort_reorder",constants:{WORKGROUP_SIZE_X:this.workgroup_size.x,WORKGROUP_SIZE_Y:this.workgroup_size.y,WORKGROUP_COUNT:this.workgroup_count,THREADS_PER_WORKGROUP:this.threads_per_workgroup,ELEMENT_COUNT:this.count,CURRENT_BIT:g}}});return{pipeline:o,bindGroup:u}}},{key:"dispatch",value:function(S){this.check_order?T(C,this,J).call(this,S):T(C,this,Be).call(this,S)}}])})();function Be(O){for(var y=0;y<this.bit_count/2;y++){var S=this.pipelines[y],b=S.blockSumPipeline,U=S.reorderPipeline;O.setPipeline(b.pipeline),O.setBindGroup(0,b.bindGroup),O.dispatchWorkgroups(this.dispatchSize.x,this.dispatchSize.y,1),this.kernels.prefixSum.dispatch(O),O.setPipeline(U.pipeline),O.setBindGroup(0,U.bindGroup),O.dispatchWorkgroups(this.dispatchSize.x,this.dispatchSize.y,1)}}function J(O){this.kernels.checkSort.reset.dispatch(O);for(var y=0;y<this.bit_count/2;y++){var S=this.pipelines[y],b=S.blockSumPipeline,U=S.reorderPipeline;y%2==0&&(this.kernels.checkSort.fast.dispatch(O,this.buffers.dispatchSize,this.dispatchOffsets.check_sort_fast),this.kernels.checkSort.full.dispatch(O,this.buffers.checkSortFullDispatchSize)),O.setPipeline(b.pipeline),O.setBindGroup(0,b.bindGroup),O.dispatchWorkgroupsIndirect(this.buffers.dispatchSize,this.dispatchOffsets.radix_sort),this.kernels.prefixSum.dispatch(O,this.buffers.dispatchSize,this.dispatchOffsets.prefix_sum),O.setPipeline(U.pipeline),O.setBindGroup(0,U.bindGroup),O.dispatchWorkgroupsIndirect(this.buffers.dispatchSize,this.dispatchOffsets.radix_sort)}}l.PrefixSumKernel=ge,l.RadixSortKernel=pe}))});var Dt=`
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

`;var yt=()=>{let l=[-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],v=[0,0,1,0,0,1,1,0,0,1,1,1],I=new Float32Array(l.length+v.length);for(let T=0;T<6;T++)I[5*T+0]=l[3*T+0],I[5*T+1]=l[3*T+1],I[5*T+2]=l[3*T+2],I[5*T+3]=v[2*T+0],I[5*T+4]=v[2*T+1];return I};function Xt(l,v){return class extends l{constructor(...I){super(...I),v(this)}}}var Qt=Xt(Array,l=>l.fill(0)),N=1e-6;function Jt(l){function v(p=0,_=0){let w=new l(2);return p!==void 0&&(w[0]=p,_!==void 0&&(w[1]=_)),w}let I=v;function T(p,_,w){let e=w??new l(2);return e[0]=p,e[1]=_,e}function L(p,_){let w=_??new l(2);return w[0]=Math.ceil(p[0]),w[1]=Math.ceil(p[1]),w}function A(p,_){let w=_??new l(2);return w[0]=Math.floor(p[0]),w[1]=Math.floor(p[1]),w}function Q(p,_){let w=_??new l(2);return w[0]=Math.round(p[0]),w[1]=Math.round(p[1]),w}function H(p,_=0,w=1,e){let a=e??new l(2);return a[0]=Math.min(w,Math.max(_,p[0])),a[1]=Math.min(w,Math.max(_,p[1])),a}function F(p,_,w){let e=w??new l(2);return e[0]=p[0]+_[0],e[1]=p[1]+_[1],e}function $(p,_,w,e){let a=e??new l(2);return a[0]=p[0]+_[0]*w,a[1]=p[1]+_[1]*w,a}function V(p,_){let w=p[0],e=p[1],a=_[0],s=_[1],i=Math.sqrt(w*w+e*e),n=Math.sqrt(a*a+s*s),c=i*n,h=c&&ve(p,_)/c;return Math.acos(h)}function j(p,_,w){let e=w??new l(2);return e[0]=p[0]-_[0],e[1]=p[1]-_[1],e}let ae=j;function ne(p,_){return Math.abs(p[0]-_[0])<N&&Math.abs(p[1]-_[1])<N}function te(p,_){return p[0]===_[0]&&p[1]===_[1]}function _e(p,_,w,e){let a=e??new l(2);return a[0]=p[0]+w*(_[0]-p[0]),a[1]=p[1]+w*(_[1]-p[1]),a}function Oe(p,_,w,e){let a=e??new l(2);return a[0]=p[0]+w[0]*(_[0]-p[0]),a[1]=p[1]+w[1]*(_[1]-p[1]),a}function Ue(p,_,w){let e=w??new l(2);return e[0]=Math.max(p[0],_[0]),e[1]=Math.max(p[1],_[1]),e}function we(p,_,w){let e=w??new l(2);return e[0]=Math.min(p[0],_[0]),e[1]=Math.min(p[1],_[1]),e}function ue(p,_,w){let e=w??new l(2);return e[0]=p[0]*_,e[1]=p[1]*_,e}let le=ue;function re(p,_,w){let e=w??new l(2);return e[0]=p[0]/_,e[1]=p[1]/_,e}function ge(p,_){let w=_??new l(2);return w[0]=1/p[0],w[1]=1/p[1],w}let Ge=ge;function be(p,_,w){let e=w??new l(3),a=p[0]*_[1]-p[1]*_[0];return e[0]=0,e[1]=0,e[2]=a,e}function ve(p,_){return p[0]*_[0]+p[1]*_[1]}function se(p){let _=p[0],w=p[1];return Math.sqrt(_*_+w*w)}let Te=se;function de(p){let _=p[0],w=p[1];return _*_+w*w}let ke=de;function fe(p,_){let w=p[0]-_[0],e=p[1]-_[1];return Math.sqrt(w*w+e*e)}let q=fe;function K(p,_){let w=p[0]-_[0],e=p[1]-_[1];return w*w+e*e}let C=K;function pe(p,_){let w=_??new l(2),e=p[0],a=p[1],s=Math.sqrt(e*e+a*a);return s>1e-5?(w[0]=e/s,w[1]=a/s):(w[0]=0,w[1]=0),w}function Be(p,_){let w=_??new l(2);return w[0]=-p[0],w[1]=-p[1],w}function J(p,_){let w=_??new l(2);return w[0]=p[0],w[1]=p[1],w}let O=J;function y(p,_,w){let e=w??new l(2);return e[0]=p[0]*_[0],e[1]=p[1]*_[1],e}let S=y;function b(p,_,w){let e=w??new l(2);return e[0]=p[0]/_[0],e[1]=p[1]/_[1],e}let U=b;function G(p=1,_){let w=_??new l(2),e=Math.random()*2*Math.PI;return w[0]=Math.cos(e)*p,w[1]=Math.sin(e)*p,w}function g(p){let _=p??new l(2);return _[0]=0,_[1]=0,_}function D(p,_,w){let e=w??new l(2),a=p[0],s=p[1];return e[0]=a*_[0]+s*_[4]+_[12],e[1]=a*_[1]+s*_[5]+_[13],e}function u(p,_,w){let e=w??new l(2),a=p[0],s=p[1];return e[0]=_[0]*a+_[4]*s+_[8],e[1]=_[1]*a+_[5]*s+_[9],e}function t(p,_,w,e){let a=e??new l(2),s=p[0]-_[0],i=p[1]-_[1],n=Math.sin(w),c=Math.cos(w);return a[0]=s*c-i*n+_[0],a[1]=s*n+i*c+_[1],a}function o(p,_,w){let e=w??new l(2);return pe(p,e),ue(e,_,e)}function r(p,_,w){let e=w??new l(2);return se(p)>_?o(p,_,e):J(p,e)}function f(p,_,w){let e=w??new l(2);return _e(p,_,.5,e)}return{create:v,fromValues:I,set:T,ceil:L,floor:A,round:Q,clamp:H,add:F,addScaled:$,angle:V,subtract:j,sub:ae,equalsApproximately:ne,equals:te,lerp:_e,lerpV:Oe,max:Ue,min:we,mulScalar:ue,scale:le,divScalar:re,inverse:ge,invert:Ge,cross:be,dot:ve,length:se,len:Te,lengthSq:de,lenSq:ke,distance:fe,dist:q,distanceSq:K,distSq:C,normalize:pe,negate:Be,copy:J,clone:O,multiply:y,mul:S,divide:b,div:U,random:G,zero:g,transformMat4:D,transformMat3:u,rotate:t,setLength:o,truncate:r,midpoint:f}}var Pt=new Map;function Mt(l){let v=Pt.get(l);return v||(v=Jt(l),Pt.set(l,v)),v}function en(l){function v(n,c,h){let d=new l(3);return n!==void 0&&(d[0]=n,c!==void 0&&(d[1]=c,h!==void 0&&(d[2]=h))),d}let I=v;function T(n,c,h,d){let m=d??new l(3);return m[0]=n,m[1]=c,m[2]=h,m}function L(n,c){let h=c??new l(3);return h[0]=Math.ceil(n[0]),h[1]=Math.ceil(n[1]),h[2]=Math.ceil(n[2]),h}function A(n,c){let h=c??new l(3);return h[0]=Math.floor(n[0]),h[1]=Math.floor(n[1]),h[2]=Math.floor(n[2]),h}function Q(n,c){let h=c??new l(3);return h[0]=Math.round(n[0]),h[1]=Math.round(n[1]),h[2]=Math.round(n[2]),h}function H(n,c=0,h=1,d){let m=d??new l(3);return m[0]=Math.min(h,Math.max(c,n[0])),m[1]=Math.min(h,Math.max(c,n[1])),m[2]=Math.min(h,Math.max(c,n[2])),m}function F(n,c,h){let d=h??new l(3);return d[0]=n[0]+c[0],d[1]=n[1]+c[1],d[2]=n[2]+c[2],d}function $(n,c,h,d){let m=d??new l(3);return m[0]=n[0]+c[0]*h,m[1]=n[1]+c[1]*h,m[2]=n[2]+c[2]*h,m}function V(n,c){let h=n[0],d=n[1],m=n[2],P=c[0],x=c[1],R=c[2],M=Math.sqrt(h*h+d*d+m*m),E=Math.sqrt(P*P+x*x+R*R),k=M*E,W=k&&ve(n,c)/k;return Math.acos(W)}function j(n,c,h){let d=h??new l(3);return d[0]=n[0]-c[0],d[1]=n[1]-c[1],d[2]=n[2]-c[2],d}let ae=j;function ne(n,c){return Math.abs(n[0]-c[0])<N&&Math.abs(n[1]-c[1])<N&&Math.abs(n[2]-c[2])<N}function te(n,c){return n[0]===c[0]&&n[1]===c[1]&&n[2]===c[2]}function _e(n,c,h,d){let m=d??new l(3);return m[0]=n[0]+h*(c[0]-n[0]),m[1]=n[1]+h*(c[1]-n[1]),m[2]=n[2]+h*(c[2]-n[2]),m}function Oe(n,c,h,d){let m=d??new l(3);return m[0]=n[0]+h[0]*(c[0]-n[0]),m[1]=n[1]+h[1]*(c[1]-n[1]),m[2]=n[2]+h[2]*(c[2]-n[2]),m}function Ue(n,c,h){let d=h??new l(3);return d[0]=Math.max(n[0],c[0]),d[1]=Math.max(n[1],c[1]),d[2]=Math.max(n[2],c[2]),d}function we(n,c,h){let d=h??new l(3);return d[0]=Math.min(n[0],c[0]),d[1]=Math.min(n[1],c[1]),d[2]=Math.min(n[2],c[2]),d}function ue(n,c,h){let d=h??new l(3);return d[0]=n[0]*c,d[1]=n[1]*c,d[2]=n[2]*c,d}let le=ue;function re(n,c,h){let d=h??new l(3);return d[0]=n[0]/c,d[1]=n[1]/c,d[2]=n[2]/c,d}function ge(n,c){let h=c??new l(3);return h[0]=1/n[0],h[1]=1/n[1],h[2]=1/n[2],h}let Ge=ge;function be(n,c,h){let d=h??new l(3),m=n[2]*c[0]-n[0]*c[2],P=n[0]*c[1]-n[1]*c[0];return d[0]=n[1]*c[2]-n[2]*c[1],d[1]=m,d[2]=P,d}function ve(n,c){return n[0]*c[0]+n[1]*c[1]+n[2]*c[2]}function se(n){let c=n[0],h=n[1],d=n[2];return Math.sqrt(c*c+h*h+d*d)}let Te=se;function de(n){let c=n[0],h=n[1],d=n[2];return c*c+h*h+d*d}let ke=de;function fe(n,c){let h=n[0]-c[0],d=n[1]-c[1],m=n[2]-c[2];return Math.sqrt(h*h+d*d+m*m)}let q=fe;function K(n,c){let h=n[0]-c[0],d=n[1]-c[1],m=n[2]-c[2];return h*h+d*d+m*m}let C=K;function pe(n,c){let h=c??new l(3),d=n[0],m=n[1],P=n[2],x=Math.sqrt(d*d+m*m+P*P);return x>1e-5?(h[0]=d/x,h[1]=m/x,h[2]=P/x):(h[0]=0,h[1]=0,h[2]=0),h}function Be(n,c){let h=c??new l(3);return h[0]=-n[0],h[1]=-n[1],h[2]=-n[2],h}function J(n,c){let h=c??new l(3);return h[0]=n[0],h[1]=n[1],h[2]=n[2],h}let O=J;function y(n,c,h){let d=h??new l(3);return d[0]=n[0]*c[0],d[1]=n[1]*c[1],d[2]=n[2]*c[2],d}let S=y;function b(n,c,h){let d=h??new l(3);return d[0]=n[0]/c[0],d[1]=n[1]/c[1],d[2]=n[2]/c[2],d}let U=b;function G(n=1,c){let h=c??new l(3),d=Math.random()*2*Math.PI,m=Math.random()*2-1,P=Math.sqrt(1-m*m)*n;return h[0]=Math.cos(d)*P,h[1]=Math.sin(d)*P,h[2]=m*n,h}function g(n){let c=n??new l(3);return c[0]=0,c[1]=0,c[2]=0,c}function D(n,c,h){let d=h??new l(3),m=n[0],P=n[1],x=n[2],R=c[3]*m+c[7]*P+c[11]*x+c[15]||1;return d[0]=(c[0]*m+c[4]*P+c[8]*x+c[12])/R,d[1]=(c[1]*m+c[5]*P+c[9]*x+c[13])/R,d[2]=(c[2]*m+c[6]*P+c[10]*x+c[14])/R,d}function u(n,c,h){let d=h??new l(3),m=n[0],P=n[1],x=n[2];return d[0]=m*c[0]+P*c[4]+x*c[8],d[1]=m*c[1]+P*c[5]+x*c[9],d[2]=m*c[2]+P*c[6]+x*c[10],d}function t(n,c,h){let d=h??new l(3),m=n[0],P=n[1],x=n[2];return d[0]=m*c[0]+P*c[4]+x*c[8],d[1]=m*c[1]+P*c[5]+x*c[9],d[2]=m*c[2]+P*c[6]+x*c[10],d}function o(n,c,h){let d=h??new l(3),m=c[0],P=c[1],x=c[2],R=c[3]*2,M=n[0],E=n[1],k=n[2],W=P*k-x*E,B=x*M-m*k,z=m*E-P*M;return d[0]=M+W*R+(P*z-x*B)*2,d[1]=E+B*R+(x*W-m*z)*2,d[2]=k+z*R+(m*B-P*W)*2,d}function r(n,c){let h=c??new l(3);return h[0]=n[12],h[1]=n[13],h[2]=n[14],h}function f(n,c,h){let d=h??new l(3),m=c*4;return d[0]=n[m+0],d[1]=n[m+1],d[2]=n[m+2],d}function p(n,c){let h=c??new l(3),d=n[0],m=n[1],P=n[2],x=n[4],R=n[5],M=n[6],E=n[8],k=n[9],W=n[10];return h[0]=Math.sqrt(d*d+m*m+P*P),h[1]=Math.sqrt(x*x+R*R+M*M),h[2]=Math.sqrt(E*E+k*k+W*W),h}function _(n,c,h,d){let m=d??new l(3),P=[],x=[];return P[0]=n[0]-c[0],P[1]=n[1]-c[1],P[2]=n[2]-c[2],x[0]=P[0],x[1]=P[1]*Math.cos(h)-P[2]*Math.sin(h),x[2]=P[1]*Math.sin(h)+P[2]*Math.cos(h),m[0]=x[0]+c[0],m[1]=x[1]+c[1],m[2]=x[2]+c[2],m}function w(n,c,h,d){let m=d??new l(3),P=[],x=[];return P[0]=n[0]-c[0],P[1]=n[1]-c[1],P[2]=n[2]-c[2],x[0]=P[2]*Math.sin(h)+P[0]*Math.cos(h),x[1]=P[1],x[2]=P[2]*Math.cos(h)-P[0]*Math.sin(h),m[0]=x[0]+c[0],m[1]=x[1]+c[1],m[2]=x[2]+c[2],m}function e(n,c,h,d){let m=d??new l(3),P=[],x=[];return P[0]=n[0]-c[0],P[1]=n[1]-c[1],P[2]=n[2]-c[2],x[0]=P[0]*Math.cos(h)-P[1]*Math.sin(h),x[1]=P[0]*Math.sin(h)+P[1]*Math.cos(h),x[2]=P[2],m[0]=x[0]+c[0],m[1]=x[1]+c[1],m[2]=x[2]+c[2],m}function a(n,c,h){let d=h??new l(3);return pe(n,d),ue(d,c,d)}function s(n,c,h){let d=h??new l(3);return se(n)>c?a(n,c,d):J(n,d)}function i(n,c,h){let d=h??new l(3);return _e(n,c,.5,d)}return{create:v,fromValues:I,set:T,ceil:L,floor:A,round:Q,clamp:H,add:F,addScaled:$,angle:V,subtract:j,sub:ae,equalsApproximately:ne,equals:te,lerp:_e,lerpV:Oe,max:Ue,min:we,mulScalar:ue,scale:le,divScalar:re,inverse:ge,invert:Ge,cross:be,dot:ve,length:se,len:Te,lengthSq:de,lenSq:ke,distance:fe,dist:q,distanceSq:K,distSq:C,normalize:pe,negate:Be,copy:J,clone:O,multiply:y,mul:S,divide:b,div:U,random:G,zero:g,transformMat4:D,transformMat4Upper3x3:u,transformMat3:t,transformQuat:o,getTranslation:r,getAxis:f,getScaling:p,rotateX:_,rotateY:w,rotateZ:e,setLength:a,truncate:s,midpoint:i}}var St=new Map;function st(l){let v=St.get(l);return v||(v=en(l),St.set(l,v)),v}function tn(l){let v=Mt(l),I=st(l);function T(t,o,r,f,p,_,w,e,a){let s=new l(12);return s[3]=0,s[7]=0,s[11]=0,t!==void 0&&(s[0]=t,o!==void 0&&(s[1]=o,r!==void 0&&(s[2]=r,f!==void 0&&(s[4]=f,p!==void 0&&(s[5]=p,_!==void 0&&(s[6]=_,w!==void 0&&(s[8]=w,e!==void 0&&(s[9]=e,a!==void 0&&(s[10]=a))))))))),s}function L(t,o,r,f,p,_,w,e,a,s){let i=s??new l(12);return i[0]=t,i[1]=o,i[2]=r,i[3]=0,i[4]=f,i[5]=p,i[6]=_,i[7]=0,i[8]=w,i[9]=e,i[10]=a,i[11]=0,i}function A(t,o){let r=o??new l(12);return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=0,r[4]=t[4],r[5]=t[5],r[6]=t[6],r[7]=0,r[8]=t[8],r[9]=t[9],r[10]=t[10],r[11]=0,r}function Q(t,o){let r=o??new l(12),f=t[0],p=t[1],_=t[2],w=t[3],e=f+f,a=p+p,s=_+_,i=f*e,n=p*e,c=p*a,h=_*e,d=_*a,m=_*s,P=w*e,x=w*a,R=w*s;return r[0]=1-c-m,r[1]=n+R,r[2]=h-x,r[3]=0,r[4]=n-R,r[5]=1-i-m,r[6]=d+P,r[7]=0,r[8]=h+x,r[9]=d-P,r[10]=1-i-c,r[11]=0,r}function H(t,o){let r=o??new l(12);return r[0]=-t[0],r[1]=-t[1],r[2]=-t[2],r[4]=-t[4],r[5]=-t[5],r[6]=-t[6],r[8]=-t[8],r[9]=-t[9],r[10]=-t[10],r}function F(t,o,r){let f=r??new l(12);return f[0]=t[0]*o,f[1]=t[1]*o,f[2]=t[2]*o,f[4]=t[4]*o,f[5]=t[5]*o,f[6]=t[6]*o,f[8]=t[8]*o,f[9]=t[9]*o,f[10]=t[10]*o,f}let $=F;function V(t,o,r){let f=r??new l(12);return f[0]=t[0]+o[0],f[1]=t[1]+o[1],f[2]=t[2]+o[2],f[4]=t[4]+o[4],f[5]=t[5]+o[5],f[6]=t[6]+o[6],f[8]=t[8]+o[8],f[9]=t[9]+o[9],f[10]=t[10]+o[10],f}function j(t,o){let r=o??new l(12);return r[0]=t[0],r[1]=t[1],r[2]=t[2],r[4]=t[4],r[5]=t[5],r[6]=t[6],r[8]=t[8],r[9]=t[9],r[10]=t[10],r}let ae=j;function ne(t,o){return Math.abs(t[0]-o[0])<N&&Math.abs(t[1]-o[1])<N&&Math.abs(t[2]-o[2])<N&&Math.abs(t[4]-o[4])<N&&Math.abs(t[5]-o[5])<N&&Math.abs(t[6]-o[6])<N&&Math.abs(t[8]-o[8])<N&&Math.abs(t[9]-o[9])<N&&Math.abs(t[10]-o[10])<N}function te(t,o){return t[0]===o[0]&&t[1]===o[1]&&t[2]===o[2]&&t[4]===o[4]&&t[5]===o[5]&&t[6]===o[6]&&t[8]===o[8]&&t[9]===o[9]&&t[10]===o[10]}function _e(t){let o=t??new l(12);return o[0]=1,o[1]=0,o[2]=0,o[4]=0,o[5]=1,o[6]=0,o[8]=0,o[9]=0,o[10]=1,o}function Oe(t,o){let r=o??new l(12);if(r===t){let c;return c=t[1],t[1]=t[4],t[4]=c,c=t[2],t[2]=t[8],t[8]=c,c=t[6],t[6]=t[9],t[9]=c,r}let f=t[0],p=t[1],_=t[2],w=t[4],e=t[5],a=t[6],s=t[8],i=t[9],n=t[10];return r[0]=f,r[1]=w,r[2]=s,r[4]=p,r[5]=e,r[6]=i,r[8]=_,r[9]=a,r[10]=n,r}function Ue(t,o){let r=o??new l(12),f=t[0],p=t[1],_=t[2],w=t[4],e=t[5],a=t[6],s=t[8],i=t[9],n=t[10],c=n*e-a*i,h=-n*w+a*s,d=i*w-e*s,m=1/(f*c+p*h+_*d);return r[0]=c*m,r[1]=(-n*p+_*i)*m,r[2]=(a*p-_*e)*m,r[4]=h*m,r[5]=(n*f-_*s)*m,r[6]=(-a*f+_*w)*m,r[8]=d*m,r[9]=(-i*f+p*s)*m,r[10]=(e*f-p*w)*m,r}function we(t){let o=t[0],r=t[1],f=t[2],p=t[4],_=t[5],w=t[6],e=t[8],a=t[9],s=t[10];return o*(_*s-a*w)-p*(r*s-a*f)+e*(r*w-_*f)}let ue=Ue;function le(t,o,r){let f=r??new l(12),p=t[0],_=t[1],w=t[2],e=t[4],a=t[5],s=t[6],i=t[8],n=t[9],c=t[10],h=o[0],d=o[1],m=o[2],P=o[4],x=o[5],R=o[6],M=o[8],E=o[9],k=o[10];return f[0]=p*h+e*d+i*m,f[1]=_*h+a*d+n*m,f[2]=w*h+s*d+c*m,f[4]=p*P+e*x+i*R,f[5]=_*P+a*x+n*R,f[6]=w*P+s*x+c*R,f[8]=p*M+e*E+i*k,f[9]=_*M+a*E+n*k,f[10]=w*M+s*E+c*k,f}let re=le;function ge(t,o,r){let f=r??_e();return t!==f&&(f[0]=t[0],f[1]=t[1],f[2]=t[2],f[4]=t[4],f[5]=t[5],f[6]=t[6]),f[8]=o[0],f[9]=o[1],f[10]=1,f}function Ge(t,o){let r=o??v.create();return r[0]=t[8],r[1]=t[9],r}function be(t,o,r){let f=r??v.create(),p=o*4;return f[0]=t[p+0],f[1]=t[p+1],f}function ve(t,o,r,f){let p=f===t?t:j(t,f),_=r*4;return p[_+0]=o[0],p[_+1]=o[1],p}function se(t,o){let r=o??v.create(),f=t[0],p=t[1],_=t[4],w=t[5];return r[0]=Math.sqrt(f*f+p*p),r[1]=Math.sqrt(_*_+w*w),r}function Te(t,o){let r=o??I.create(),f=t[0],p=t[1],_=t[2],w=t[4],e=t[5],a=t[6],s=t[8],i=t[9],n=t[10];return r[0]=Math.sqrt(f*f+p*p+_*_),r[1]=Math.sqrt(w*w+e*e+a*a),r[2]=Math.sqrt(s*s+i*i+n*n),r}function de(t,o){let r=o??new l(12);return r[0]=1,r[1]=0,r[2]=0,r[4]=0,r[5]=1,r[6]=0,r[8]=t[0],r[9]=t[1],r[10]=1,r}function ke(t,o,r){let f=r??new l(12),p=o[0],_=o[1],w=t[0],e=t[1],a=t[2],s=t[4],i=t[5],n=t[6],c=t[8],h=t[9],d=t[10];return t!==f&&(f[0]=w,f[1]=e,f[2]=a,f[4]=s,f[5]=i,f[6]=n),f[8]=w*p+s*_+c,f[9]=e*p+i*_+h,f[10]=a*p+n*_+d,f}function fe(t,o){let r=o??new l(12),f=Math.cos(t),p=Math.sin(t);return r[0]=f,r[1]=p,r[2]=0,r[4]=-p,r[5]=f,r[6]=0,r[8]=0,r[9]=0,r[10]=1,r}function q(t,o,r){let f=r??new l(12),p=t[0],_=t[1],w=t[2],e=t[4],a=t[5],s=t[6],i=Math.cos(o),n=Math.sin(o);return f[0]=i*p+n*e,f[1]=i*_+n*a,f[2]=i*w+n*s,f[4]=i*e-n*p,f[5]=i*a-n*_,f[6]=i*s-n*w,t!==f&&(f[8]=t[8],f[9]=t[9],f[10]=t[10]),f}function K(t,o){let r=o??new l(12),f=Math.cos(t),p=Math.sin(t);return r[0]=1,r[1]=0,r[2]=0,r[4]=0,r[5]=f,r[6]=p,r[8]=0,r[9]=-p,r[10]=f,r}function C(t,o,r){let f=r??new l(12),p=t[4],_=t[5],w=t[6],e=t[8],a=t[9],s=t[10],i=Math.cos(o),n=Math.sin(o);return f[4]=i*p+n*e,f[5]=i*_+n*a,f[6]=i*w+n*s,f[8]=i*e-n*p,f[9]=i*a-n*_,f[10]=i*s-n*w,t!==f&&(f[0]=t[0],f[1]=t[1],f[2]=t[2]),f}function pe(t,o){let r=o??new l(12),f=Math.cos(t),p=Math.sin(t);return r[0]=f,r[1]=0,r[2]=-p,r[4]=0,r[5]=1,r[6]=0,r[8]=p,r[9]=0,r[10]=f,r}function Be(t,o,r){let f=r??new l(12),p=t[0],_=t[1],w=t[2],e=t[8],a=t[9],s=t[10],i=Math.cos(o),n=Math.sin(o);return f[0]=i*p-n*e,f[1]=i*_-n*a,f[2]=i*w-n*s,f[8]=i*e+n*p,f[9]=i*a+n*_,f[10]=i*s+n*w,t!==f&&(f[4]=t[4],f[5]=t[5],f[6]=t[6]),f}let J=fe,O=q;function y(t,o){let r=o??new l(12);return r[0]=t[0],r[1]=0,r[2]=0,r[4]=0,r[5]=t[1],r[6]=0,r[8]=0,r[9]=0,r[10]=1,r}function S(t,o,r){let f=r??new l(12),p=o[0],_=o[1];return f[0]=p*t[0],f[1]=p*t[1],f[2]=p*t[2],f[4]=_*t[4],f[5]=_*t[5],f[6]=_*t[6],t!==f&&(f[8]=t[8],f[9]=t[9],f[10]=t[10]),f}function b(t,o){let r=o??new l(12);return r[0]=t[0],r[1]=0,r[2]=0,r[4]=0,r[5]=t[1],r[6]=0,r[8]=0,r[9]=0,r[10]=t[2],r}function U(t,o,r){let f=r??new l(12),p=o[0],_=o[1],w=o[2];return f[0]=p*t[0],f[1]=p*t[1],f[2]=p*t[2],f[4]=_*t[4],f[5]=_*t[5],f[6]=_*t[6],f[8]=w*t[8],f[9]=w*t[9],f[10]=w*t[10],f}function G(t,o){let r=o??new l(12);return r[0]=t,r[1]=0,r[2]=0,r[4]=0,r[5]=t,r[6]=0,r[8]=0,r[9]=0,r[10]=1,r}function g(t,o,r){let f=r??new l(12);return f[0]=o*t[0],f[1]=o*t[1],f[2]=o*t[2],f[4]=o*t[4],f[5]=o*t[5],f[6]=o*t[6],t!==f&&(f[8]=t[8],f[9]=t[9],f[10]=t[10]),f}function D(t,o){let r=o??new l(12);return r[0]=t,r[1]=0,r[2]=0,r[4]=0,r[5]=t,r[6]=0,r[8]=0,r[9]=0,r[10]=t,r}function u(t,o,r){let f=r??new l(12);return f[0]=o*t[0],f[1]=o*t[1],f[2]=o*t[2],f[4]=o*t[4],f[5]=o*t[5],f[6]=o*t[6],f[8]=o*t[8],f[9]=o*t[9],f[10]=o*t[10],f}return{add:V,clone:ae,copy:j,create:T,determinant:we,equals:te,equalsApproximately:ne,fromMat4:A,fromQuat:Q,get3DScaling:Te,getAxis:be,getScaling:se,getTranslation:Ge,identity:_e,inverse:Ue,invert:ue,mul:re,mulScalar:$,multiply:le,multiplyScalar:F,negate:H,rotate:q,rotateX:C,rotateY:Be,rotateZ:O,rotation:fe,rotationX:K,rotationY:pe,rotationZ:J,scale:S,scale3D:U,scaling:y,scaling3D:b,set:L,setAxis:ve,setTranslation:ge,translate:ke,translation:de,transpose:Oe,uniformScale:g,uniformScale3D:u,uniformScaling:G,uniformScaling3D:D}}var xt=new Map;function nn(l){let v=xt.get(l);return v||(v=tn(l),xt.set(l,v)),v}function rn(l){let v=st(l);function I(e,a,s,i,n,c,h,d,m,P,x,R,M,E,k,W){let B=new l(16);return e!==void 0&&(B[0]=e,a!==void 0&&(B[1]=a,s!==void 0&&(B[2]=s,i!==void 0&&(B[3]=i,n!==void 0&&(B[4]=n,c!==void 0&&(B[5]=c,h!==void 0&&(B[6]=h,d!==void 0&&(B[7]=d,m!==void 0&&(B[8]=m,P!==void 0&&(B[9]=P,x!==void 0&&(B[10]=x,R!==void 0&&(B[11]=R,M!==void 0&&(B[12]=M,E!==void 0&&(B[13]=E,k!==void 0&&(B[14]=k,W!==void 0&&(B[15]=W)))))))))))))))),B}function T(e,a,s,i,n,c,h,d,m,P,x,R,M,E,k,W,B){let z=B??new l(16);return z[0]=e,z[1]=a,z[2]=s,z[3]=i,z[4]=n,z[5]=c,z[6]=h,z[7]=d,z[8]=m,z[9]=P,z[10]=x,z[11]=R,z[12]=M,z[13]=E,z[14]=k,z[15]=W,z}function L(e,a){let s=a??new l(16);return s[0]=e[0],s[1]=e[1],s[2]=e[2],s[3]=0,s[4]=e[4],s[5]=e[5],s[6]=e[6],s[7]=0,s[8]=e[8],s[9]=e[9],s[10]=e[10],s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function A(e,a){let s=a??new l(16),i=e[0],n=e[1],c=e[2],h=e[3],d=i+i,m=n+n,P=c+c,x=i*d,R=n*d,M=n*m,E=c*d,k=c*m,W=c*P,B=h*d,z=h*m,Z=h*P;return s[0]=1-M-W,s[1]=R+Z,s[2]=E-z,s[3]=0,s[4]=R-Z,s[5]=1-x-W,s[6]=k+B,s[7]=0,s[8]=E+z,s[9]=k-B,s[10]=1-x-M,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function Q(e,a){let s=a??new l(16);return s[0]=-e[0],s[1]=-e[1],s[2]=-e[2],s[3]=-e[3],s[4]=-e[4],s[5]=-e[5],s[6]=-e[6],s[7]=-e[7],s[8]=-e[8],s[9]=-e[9],s[10]=-e[10],s[11]=-e[11],s[12]=-e[12],s[13]=-e[13],s[14]=-e[14],s[15]=-e[15],s}function H(e,a,s){let i=s??new l(16);return i[0]=e[0]+a[0],i[1]=e[1]+a[1],i[2]=e[2]+a[2],i[3]=e[3]+a[3],i[4]=e[4]+a[4],i[5]=e[5]+a[5],i[6]=e[6]+a[6],i[7]=e[7]+a[7],i[8]=e[8]+a[8],i[9]=e[9]+a[9],i[10]=e[10]+a[10],i[11]=e[11]+a[11],i[12]=e[12]+a[12],i[13]=e[13]+a[13],i[14]=e[14]+a[14],i[15]=e[15]+a[15],i}function F(e,a,s){let i=s??new l(16);return i[0]=e[0]*a,i[1]=e[1]*a,i[2]=e[2]*a,i[3]=e[3]*a,i[4]=e[4]*a,i[5]=e[5]*a,i[6]=e[6]*a,i[7]=e[7]*a,i[8]=e[8]*a,i[9]=e[9]*a,i[10]=e[10]*a,i[11]=e[11]*a,i[12]=e[12]*a,i[13]=e[13]*a,i[14]=e[14]*a,i[15]=e[15]*a,i}let $=F;function V(e,a){let s=a??new l(16);return s[0]=e[0],s[1]=e[1],s[2]=e[2],s[3]=e[3],s[4]=e[4],s[5]=e[5],s[6]=e[6],s[7]=e[7],s[8]=e[8],s[9]=e[9],s[10]=e[10],s[11]=e[11],s[12]=e[12],s[13]=e[13],s[14]=e[14],s[15]=e[15],s}let j=V;function ae(e,a){return Math.abs(e[0]-a[0])<N&&Math.abs(e[1]-a[1])<N&&Math.abs(e[2]-a[2])<N&&Math.abs(e[3]-a[3])<N&&Math.abs(e[4]-a[4])<N&&Math.abs(e[5]-a[5])<N&&Math.abs(e[6]-a[6])<N&&Math.abs(e[7]-a[7])<N&&Math.abs(e[8]-a[8])<N&&Math.abs(e[9]-a[9])<N&&Math.abs(e[10]-a[10])<N&&Math.abs(e[11]-a[11])<N&&Math.abs(e[12]-a[12])<N&&Math.abs(e[13]-a[13])<N&&Math.abs(e[14]-a[14])<N&&Math.abs(e[15]-a[15])<N}function ne(e,a){return e[0]===a[0]&&e[1]===a[1]&&e[2]===a[2]&&e[3]===a[3]&&e[4]===a[4]&&e[5]===a[5]&&e[6]===a[6]&&e[7]===a[7]&&e[8]===a[8]&&e[9]===a[9]&&e[10]===a[10]&&e[11]===a[11]&&e[12]===a[12]&&e[13]===a[13]&&e[14]===a[14]&&e[15]===a[15]}function te(e){let a=e??new l(16);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a}function _e(e,a){let s=a??new l(16);if(s===e){let Y;return Y=e[1],e[1]=e[4],e[4]=Y,Y=e[2],e[2]=e[8],e[8]=Y,Y=e[3],e[3]=e[12],e[12]=Y,Y=e[6],e[6]=e[9],e[9]=Y,Y=e[7],e[7]=e[13],e[13]=Y,Y=e[11],e[11]=e[14],e[14]=Y,s}let i=e[0],n=e[1],c=e[2],h=e[3],d=e[4],m=e[5],P=e[6],x=e[7],R=e[8],M=e[9],E=e[10],k=e[11],W=e[12],B=e[13],z=e[14],Z=e[15];return s[0]=i,s[1]=d,s[2]=R,s[3]=W,s[4]=n,s[5]=m,s[6]=M,s[7]=B,s[8]=c,s[9]=P,s[10]=E,s[11]=z,s[12]=h,s[13]=x,s[14]=k,s[15]=Z,s}function Oe(e,a){let s=a??new l(16),i=e[0],n=e[1],c=e[2],h=e[3],d=e[4],m=e[5],P=e[6],x=e[7],R=e[8],M=e[9],E=e[10],k=e[11],W=e[12],B=e[13],z=e[14],Z=e[15],Y=E*Z,ie=z*k,oe=P*Z,ce=z*x,he=P*k,me=E*x,De=c*Z,ye=z*h,Pe=c*k,Se=E*h,Ie=c*x,Me=P*h,Ee=R*B,Re=W*M,ze=d*B,Ae=W*m,Le=d*M,Xe=R*m,Qe=i*B,Je=W*n,et=i*M,tt=R*n,nt=i*m,rt=d*n,_t=Y*m+ce*M+he*B-(ie*m+oe*M+me*B),wt=ie*n+De*M+Se*B-(Y*n+ye*M+Pe*B),gt=oe*n+ye*m+Ie*B-(ce*n+De*m+Me*B),vt=me*n+Pe*m+Me*M-(he*n+Se*m+Ie*M),xe=1/(i*_t+d*wt+R*gt+W*vt);return s[0]=xe*_t,s[1]=xe*wt,s[2]=xe*gt,s[3]=xe*vt,s[4]=xe*(ie*d+oe*R+me*W-(Y*d+ce*R+he*W)),s[5]=xe*(Y*i+ye*R+Pe*W-(ie*i+De*R+Se*W)),s[6]=xe*(ce*i+De*d+Me*W-(oe*i+ye*d+Ie*W)),s[7]=xe*(he*i+Se*d+Ie*R-(me*i+Pe*d+Me*R)),s[8]=xe*(Ee*x+Ae*k+Le*Z-(Re*x+ze*k+Xe*Z)),s[9]=xe*(Re*h+Qe*k+tt*Z-(Ee*h+Je*k+et*Z)),s[10]=xe*(ze*h+Je*x+nt*Z-(Ae*h+Qe*x+rt*Z)),s[11]=xe*(Xe*h+et*x+rt*k-(Le*h+tt*x+nt*k)),s[12]=xe*(ze*E+Xe*z+Re*P-(Le*z+Ee*P+Ae*E)),s[13]=xe*(et*z+Ee*c+Je*E-(Qe*E+tt*z+Re*c)),s[14]=xe*(Qe*P+rt*z+Ae*c-(nt*z+ze*c+Je*P)),s[15]=xe*(nt*E+Le*c+tt*P-(et*P+rt*E+Xe*c)),s}function Ue(e){let a=e[0],s=e[1],i=e[2],n=e[3],c=e[4],h=e[5],d=e[6],m=e[7],P=e[8],x=e[9],R=e[10],M=e[11],E=e[12],k=e[13],W=e[14],B=e[15],z=R*B,Z=W*M,Y=d*B,ie=W*m,oe=d*M,ce=R*m,he=i*B,me=W*n,De=i*M,ye=R*n,Pe=i*m,Se=d*n,Ie=z*h+ie*x+oe*k-(Z*h+Y*x+ce*k),Me=Z*s+he*x+ye*k-(z*s+me*x+De*k),Ee=Y*s+me*h+Pe*k-(ie*s+he*h+Se*k),Re=ce*s+De*h+Se*x-(oe*s+ye*h+Pe*x);return a*Ie+c*Me+P*Ee+E*Re}let we=Oe;function ue(e,a,s){let i=s??new l(16),n=e[0],c=e[1],h=e[2],d=e[3],m=e[4],P=e[5],x=e[6],R=e[7],M=e[8],E=e[9],k=e[10],W=e[11],B=e[12],z=e[13],Z=e[14],Y=e[15],ie=a[0],oe=a[1],ce=a[2],he=a[3],me=a[4],De=a[5],ye=a[6],Pe=a[7],Se=a[8],Ie=a[9],Me=a[10],Ee=a[11],Re=a[12],ze=a[13],Ae=a[14],Le=a[15];return i[0]=n*ie+m*oe+M*ce+B*he,i[1]=c*ie+P*oe+E*ce+z*he,i[2]=h*ie+x*oe+k*ce+Z*he,i[3]=d*ie+R*oe+W*ce+Y*he,i[4]=n*me+m*De+M*ye+B*Pe,i[5]=c*me+P*De+E*ye+z*Pe,i[6]=h*me+x*De+k*ye+Z*Pe,i[7]=d*me+R*De+W*ye+Y*Pe,i[8]=n*Se+m*Ie+M*Me+B*Ee,i[9]=c*Se+P*Ie+E*Me+z*Ee,i[10]=h*Se+x*Ie+k*Me+Z*Ee,i[11]=d*Se+R*Ie+W*Me+Y*Ee,i[12]=n*Re+m*ze+M*Ae+B*Le,i[13]=c*Re+P*ze+E*Ae+z*Le,i[14]=h*Re+x*ze+k*Ae+Z*Le,i[15]=d*Re+R*ze+W*Ae+Y*Le,i}let le=ue;function re(e,a,s){let i=s??te();return e!==i&&(i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=e[3],i[4]=e[4],i[5]=e[5],i[6]=e[6],i[7]=e[7],i[8]=e[8],i[9]=e[9],i[10]=e[10],i[11]=e[11]),i[12]=a[0],i[13]=a[1],i[14]=a[2],i[15]=1,i}function ge(e,a){let s=a??v.create();return s[0]=e[12],s[1]=e[13],s[2]=e[14],s}function Ge(e,a,s){let i=s??v.create(),n=a*4;return i[0]=e[n+0],i[1]=e[n+1],i[2]=e[n+2],i}function be(e,a,s,i){let n=i===e?i:V(e,i),c=s*4;return n[c+0]=a[0],n[c+1]=a[1],n[c+2]=a[2],n}function ve(e,a){let s=a??v.create(),i=e[0],n=e[1],c=e[2],h=e[4],d=e[5],m=e[6],P=e[8],x=e[9],R=e[10];return s[0]=Math.sqrt(i*i+n*n+c*c),s[1]=Math.sqrt(h*h+d*d+m*m),s[2]=Math.sqrt(P*P+x*x+R*R),s}function se(e,a,s,i,n){let c=n??new l(16),h=Math.tan(Math.PI*.5-.5*e);if(c[0]=h/a,c[1]=0,c[2]=0,c[3]=0,c[4]=0,c[5]=h,c[6]=0,c[7]=0,c[8]=0,c[9]=0,c[11]=-1,c[12]=0,c[13]=0,c[15]=0,Number.isFinite(i)){let d=1/(s-i);c[10]=i*d,c[14]=i*s*d}else c[10]=-1,c[14]=-s;return c}function Te(e,a,s,i=1/0,n){let c=n??new l(16),h=1/Math.tan(e*.5);if(c[0]=h/a,c[1]=0,c[2]=0,c[3]=0,c[4]=0,c[5]=h,c[6]=0,c[7]=0,c[8]=0,c[9]=0,c[11]=-1,c[12]=0,c[13]=0,c[15]=0,i===1/0)c[10]=0,c[14]=s;else{let d=1/(i-s);c[10]=s*d,c[14]=i*s*d}return c}function de(e,a,s,i,n,c,h){let d=h??new l(16);return d[0]=2/(a-e),d[1]=0,d[2]=0,d[3]=0,d[4]=0,d[5]=2/(i-s),d[6]=0,d[7]=0,d[8]=0,d[9]=0,d[10]=1/(n-c),d[11]=0,d[12]=(a+e)/(e-a),d[13]=(i+s)/(s-i),d[14]=n/(n-c),d[15]=1,d}function ke(e,a,s,i,n,c,h){let d=h??new l(16),m=a-e,P=i-s,x=n-c;return d[0]=2*n/m,d[1]=0,d[2]=0,d[3]=0,d[4]=0,d[5]=2*n/P,d[6]=0,d[7]=0,d[8]=(e+a)/m,d[9]=(i+s)/P,d[10]=c/x,d[11]=-1,d[12]=0,d[13]=0,d[14]=n*c/x,d[15]=0,d}function fe(e,a,s,i,n,c=1/0,h){let d=h??new l(16),m=a-e,P=i-s;if(d[0]=2*n/m,d[1]=0,d[2]=0,d[3]=0,d[4]=0,d[5]=2*n/P,d[6]=0,d[7]=0,d[8]=(e+a)/m,d[9]=(i+s)/P,d[11]=-1,d[12]=0,d[13]=0,d[15]=0,c===1/0)d[10]=0,d[14]=n;else{let x=1/(c-n);d[10]=n*x,d[14]=c*n*x}return d}let q=v.create(),K=v.create(),C=v.create();function pe(e,a,s,i){let n=i??new l(16);return v.normalize(v.subtract(a,e,C),C),v.normalize(v.cross(s,C,q),q),v.normalize(v.cross(C,q,K),K),n[0]=q[0],n[1]=q[1],n[2]=q[2],n[3]=0,n[4]=K[0],n[5]=K[1],n[6]=K[2],n[7]=0,n[8]=C[0],n[9]=C[1],n[10]=C[2],n[11]=0,n[12]=e[0],n[13]=e[1],n[14]=e[2],n[15]=1,n}function Be(e,a,s,i){let n=i??new l(16);return v.normalize(v.subtract(e,a,C),C),v.normalize(v.cross(s,C,q),q),v.normalize(v.cross(C,q,K),K),n[0]=q[0],n[1]=q[1],n[2]=q[2],n[3]=0,n[4]=K[0],n[5]=K[1],n[6]=K[2],n[7]=0,n[8]=C[0],n[9]=C[1],n[10]=C[2],n[11]=0,n[12]=e[0],n[13]=e[1],n[14]=e[2],n[15]=1,n}function J(e,a,s,i){let n=i??new l(16);return v.normalize(v.subtract(e,a,C),C),v.normalize(v.cross(s,C,q),q),v.normalize(v.cross(C,q,K),K),n[0]=q[0],n[1]=K[0],n[2]=C[0],n[3]=0,n[4]=q[1],n[5]=K[1],n[6]=C[1],n[7]=0,n[8]=q[2],n[9]=K[2],n[10]=C[2],n[11]=0,n[12]=-(q[0]*e[0]+q[1]*e[1]+q[2]*e[2]),n[13]=-(K[0]*e[0]+K[1]*e[1]+K[2]*e[2]),n[14]=-(C[0]*e[0]+C[1]*e[1]+C[2]*e[2]),n[15]=1,n}function O(e,a){let s=a??new l(16);return s[0]=1,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=1,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=1,s[11]=0,s[12]=e[0],s[13]=e[1],s[14]=e[2],s[15]=1,s}function y(e,a,s){let i=s??new l(16),n=a[0],c=a[1],h=a[2],d=e[0],m=e[1],P=e[2],x=e[3],R=e[4],M=e[5],E=e[6],k=e[7],W=e[8],B=e[9],z=e[10],Z=e[11],Y=e[12],ie=e[13],oe=e[14],ce=e[15];return e!==i&&(i[0]=d,i[1]=m,i[2]=P,i[3]=x,i[4]=R,i[5]=M,i[6]=E,i[7]=k,i[8]=W,i[9]=B,i[10]=z,i[11]=Z),i[12]=d*n+R*c+W*h+Y,i[13]=m*n+M*c+B*h+ie,i[14]=P*n+E*c+z*h+oe,i[15]=x*n+k*c+Z*h+ce,i}function S(e,a){let s=a??new l(16),i=Math.cos(e),n=Math.sin(e);return s[0]=1,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=i,s[6]=n,s[7]=0,s[8]=0,s[9]=-n,s[10]=i,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function b(e,a,s){let i=s??new l(16),n=e[4],c=e[5],h=e[6],d=e[7],m=e[8],P=e[9],x=e[10],R=e[11],M=Math.cos(a),E=Math.sin(a);return i[4]=M*n+E*m,i[5]=M*c+E*P,i[6]=M*h+E*x,i[7]=M*d+E*R,i[8]=M*m-E*n,i[9]=M*P-E*c,i[10]=M*x-E*h,i[11]=M*R-E*d,e!==i&&(i[0]=e[0],i[1]=e[1],i[2]=e[2],i[3]=e[3],i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}function U(e,a){let s=a??new l(16),i=Math.cos(e),n=Math.sin(e);return s[0]=i,s[1]=0,s[2]=-n,s[3]=0,s[4]=0,s[5]=1,s[6]=0,s[7]=0,s[8]=n,s[9]=0,s[10]=i,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function G(e,a,s){let i=s??new l(16),n=e[0],c=e[1],h=e[2],d=e[3],m=e[8],P=e[9],x=e[10],R=e[11],M=Math.cos(a),E=Math.sin(a);return i[0]=M*n-E*m,i[1]=M*c-E*P,i[2]=M*h-E*x,i[3]=M*d-E*R,i[8]=M*m+E*n,i[9]=M*P+E*c,i[10]=M*x+E*h,i[11]=M*R+E*d,e!==i&&(i[4]=e[4],i[5]=e[5],i[6]=e[6],i[7]=e[7],i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}function g(e,a){let s=a??new l(16),i=Math.cos(e),n=Math.sin(e);return s[0]=i,s[1]=n,s[2]=0,s[3]=0,s[4]=-n,s[5]=i,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=1,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function D(e,a,s){let i=s??new l(16),n=e[0],c=e[1],h=e[2],d=e[3],m=e[4],P=e[5],x=e[6],R=e[7],M=Math.cos(a),E=Math.sin(a);return i[0]=M*n+E*m,i[1]=M*c+E*P,i[2]=M*h+E*x,i[3]=M*d+E*R,i[4]=M*m-E*n,i[5]=M*P-E*c,i[6]=M*x-E*h,i[7]=M*R-E*d,e!==i&&(i[8]=e[8],i[9]=e[9],i[10]=e[10],i[11]=e[11],i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}function u(e,a,s){let i=s??new l(16),n=e[0],c=e[1],h=e[2],d=Math.sqrt(n*n+c*c+h*h);n/=d,c/=d,h/=d;let m=n*n,P=c*c,x=h*h,R=Math.cos(a),M=Math.sin(a),E=1-R;return i[0]=m+(1-m)*R,i[1]=n*c*E+h*M,i[2]=n*h*E-c*M,i[3]=0,i[4]=n*c*E-h*M,i[5]=P+(1-P)*R,i[6]=c*h*E+n*M,i[7]=0,i[8]=n*h*E+c*M,i[9]=c*h*E-n*M,i[10]=x+(1-x)*R,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,i}let t=u;function o(e,a,s,i){let n=i??new l(16),c=a[0],h=a[1],d=a[2],m=Math.sqrt(c*c+h*h+d*d);c/=m,h/=m,d/=m;let P=c*c,x=h*h,R=d*d,M=Math.cos(s),E=Math.sin(s),k=1-M,W=P+(1-P)*M,B=c*h*k+d*E,z=c*d*k-h*E,Z=c*h*k-d*E,Y=x+(1-x)*M,ie=h*d*k+c*E,oe=c*d*k+h*E,ce=h*d*k-c*E,he=R+(1-R)*M,me=e[0],De=e[1],ye=e[2],Pe=e[3],Se=e[4],Ie=e[5],Me=e[6],Ee=e[7],Re=e[8],ze=e[9],Ae=e[10],Le=e[11];return n[0]=W*me+B*Se+z*Re,n[1]=W*De+B*Ie+z*ze,n[2]=W*ye+B*Me+z*Ae,n[3]=W*Pe+B*Ee+z*Le,n[4]=Z*me+Y*Se+ie*Re,n[5]=Z*De+Y*Ie+ie*ze,n[6]=Z*ye+Y*Me+ie*Ae,n[7]=Z*Pe+Y*Ee+ie*Le,n[8]=oe*me+ce*Se+he*Re,n[9]=oe*De+ce*Ie+he*ze,n[10]=oe*ye+ce*Me+he*Ae,n[11]=oe*Pe+ce*Ee+he*Le,e!==n&&(n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15]),n}let r=o;function f(e,a){let s=a??new l(16);return s[0]=e[0],s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=e[1],s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=e[2],s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function p(e,a,s){let i=s??new l(16),n=a[0],c=a[1],h=a[2];return i[0]=n*e[0],i[1]=n*e[1],i[2]=n*e[2],i[3]=n*e[3],i[4]=c*e[4],i[5]=c*e[5],i[6]=c*e[6],i[7]=c*e[7],i[8]=h*e[8],i[9]=h*e[9],i[10]=h*e[10],i[11]=h*e[11],e!==i&&(i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}function _(e,a){let s=a??new l(16);return s[0]=e,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=e,s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=e,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}function w(e,a,s){let i=s??new l(16);return i[0]=a*e[0],i[1]=a*e[1],i[2]=a*e[2],i[3]=a*e[3],i[4]=a*e[4],i[5]=a*e[5],i[6]=a*e[6],i[7]=a*e[7],i[8]=a*e[8],i[9]=a*e[9],i[10]=a*e[10],i[11]=a*e[11],e!==i&&(i[12]=e[12],i[13]=e[13],i[14]=e[14],i[15]=e[15]),i}return{add:H,aim:pe,axisRotate:o,axisRotation:u,cameraAim:Be,clone:j,copy:V,create:I,determinant:Ue,equals:ne,equalsApproximately:ae,fromMat3:L,fromQuat:A,frustum:ke,frustumReverseZ:fe,getAxis:Ge,getScaling:ve,getTranslation:ge,identity:te,inverse:Oe,invert:we,lookAt:J,mul:le,mulScalar:$,multiply:ue,multiplyScalar:F,negate:Q,ortho:de,perspective:se,perspectiveReverseZ:Te,rotate:r,rotateX:b,rotateY:G,rotateZ:D,rotation:t,rotationX:S,rotationY:U,rotationZ:g,scale:p,scaling:f,set:T,setAxis:be,setTranslation:re,translate:y,translation:O,transpose:_e,uniformScale:w,uniformScaling:_}}var Ot=new Map;function sn(l){let v=Ot.get(l);return v||(v=rn(l),Ot.set(l,v)),v}function on(l){let v=st(l);function I(g,D,u,t){let o=new l(4);return g!==void 0&&(o[0]=g,D!==void 0&&(o[1]=D,u!==void 0&&(o[2]=u,t!==void 0&&(o[3]=t)))),o}let T=I;function L(g,D,u,t,o){let r=o??new l(4);return r[0]=g,r[1]=D,r[2]=u,r[3]=t,r}function A(g,D,u){let t=u??new l(4),o=D*.5,r=Math.sin(o);return t[0]=r*g[0],t[1]=r*g[1],t[2]=r*g[2],t[3]=Math.cos(o),t}function Q(g,D){let u=D??v.create(3),t=Math.acos(g[3])*2,o=Math.sin(t*.5);return o>N?(u[0]=g[0]/o,u[1]=g[1]/o,u[2]=g[2]/o):(u[0]=1,u[1]=0,u[2]=0),{angle:t,axis:u}}function H(g,D){let u=se(g,D);return Math.acos(2*u*u-1)}function F(g,D,u){let t=u??new l(4),o=g[0],r=g[1],f=g[2],p=g[3],_=D[0],w=D[1],e=D[2],a=D[3];return t[0]=o*a+p*_+r*e-f*w,t[1]=r*a+p*w+f*_-o*e,t[2]=f*a+p*e+o*w-r*_,t[3]=p*a-o*_-r*w-f*e,t}let $=F;function V(g,D,u){let t=u??new l(4),o=D*.5,r=g[0],f=g[1],p=g[2],_=g[3],w=Math.sin(o),e=Math.cos(o);return t[0]=r*e+_*w,t[1]=f*e+p*w,t[2]=p*e-f*w,t[3]=_*e-r*w,t}function j(g,D,u){let t=u??new l(4),o=D*.5,r=g[0],f=g[1],p=g[2],_=g[3],w=Math.sin(o),e=Math.cos(o);return t[0]=r*e-p*w,t[1]=f*e+_*w,t[2]=p*e+r*w,t[3]=_*e-f*w,t}function ae(g,D,u){let t=u??new l(4),o=D*.5,r=g[0],f=g[1],p=g[2],_=g[3],w=Math.sin(o),e=Math.cos(o);return t[0]=r*e+f*w,t[1]=f*e-r*w,t[2]=p*e+_*w,t[3]=_*e-p*w,t}function ne(g,D,u,t){let o=t??new l(4),r=g[0],f=g[1],p=g[2],_=g[3],w=D[0],e=D[1],a=D[2],s=D[3],i=r*w+f*e+p*a+_*s;i<0&&(i=-i,w=-w,e=-e,a=-a,s=-s);let n,c;if(1-i>N){let h=Math.acos(i),d=Math.sin(h);n=Math.sin((1-u)*h)/d,c=Math.sin(u*h)/d}else n=1-u,c=u;return o[0]=n*r+c*w,o[1]=n*f+c*e,o[2]=n*p+c*a,o[3]=n*_+c*s,o}function te(g,D){let u=D??new l(4),t=g[0],o=g[1],r=g[2],f=g[3],p=t*t+o*o+r*r+f*f,_=p?1/p:0;return u[0]=-t*_,u[1]=-o*_,u[2]=-r*_,u[3]=f*_,u}function _e(g,D){let u=D??new l(4);return u[0]=-g[0],u[1]=-g[1],u[2]=-g[2],u[3]=g[3],u}function Oe(g,D){let u=D??new l(4),t=g[0]+g[5]+g[10];if(t>0){let o=Math.sqrt(t+1);u[3]=.5*o;let r=.5/o;u[0]=(g[6]-g[9])*r,u[1]=(g[8]-g[2])*r,u[2]=(g[1]-g[4])*r}else{let o=0;g[5]>g[0]&&(o=1),g[10]>g[o*4+o]&&(o=2);let r=(o+1)%3,f=(o+2)%3,p=Math.sqrt(g[o*4+o]-g[r*4+r]-g[f*4+f]+1);u[o]=.5*p;let _=.5/p;u[3]=(g[r*4+f]-g[f*4+r])*_,u[r]=(g[r*4+o]+g[o*4+r])*_,u[f]=(g[f*4+o]+g[o*4+f])*_}return u}function Ue(g,D,u,t,o){let r=o??new l(4),f=g*.5,p=D*.5,_=u*.5,w=Math.sin(f),e=Math.cos(f),a=Math.sin(p),s=Math.cos(p),i=Math.sin(_),n=Math.cos(_);switch(t){case"xyz":r[0]=w*s*n+e*a*i,r[1]=e*a*n-w*s*i,r[2]=e*s*i+w*a*n,r[3]=e*s*n-w*a*i;break;case"xzy":r[0]=w*s*n-e*a*i,r[1]=e*a*n-w*s*i,r[2]=e*s*i+w*a*n,r[3]=e*s*n+w*a*i;break;case"yxz":r[0]=w*s*n+e*a*i,r[1]=e*a*n-w*s*i,r[2]=e*s*i-w*a*n,r[3]=e*s*n+w*a*i;break;case"yzx":r[0]=w*s*n+e*a*i,r[1]=e*a*n+w*s*i,r[2]=e*s*i-w*a*n,r[3]=e*s*n-w*a*i;break;case"zxy":r[0]=w*s*n-e*a*i,r[1]=e*a*n+w*s*i,r[2]=e*s*i+w*a*n,r[3]=e*s*n-w*a*i;break;case"zyx":r[0]=w*s*n-e*a*i,r[1]=e*a*n+w*s*i,r[2]=e*s*i-w*a*n,r[3]=e*s*n+w*a*i;break;default:throw new Error(`Unknown rotation order: ${t}`)}return r}function we(g,D){let u=D??new l(4);return u[0]=g[0],u[1]=g[1],u[2]=g[2],u[3]=g[3],u}let ue=we;function le(g,D,u){let t=u??new l(4);return t[0]=g[0]+D[0],t[1]=g[1]+D[1],t[2]=g[2]+D[2],t[3]=g[3]+D[3],t}function re(g,D,u){let t=u??new l(4);return t[0]=g[0]-D[0],t[1]=g[1]-D[1],t[2]=g[2]-D[2],t[3]=g[3]-D[3],t}let ge=re;function Ge(g,D,u){let t=u??new l(4);return t[0]=g[0]*D,t[1]=g[1]*D,t[2]=g[2]*D,t[3]=g[3]*D,t}let be=Ge;function ve(g,D,u){let t=u??new l(4);return t[0]=g[0]/D,t[1]=g[1]/D,t[2]=g[2]/D,t[3]=g[3]/D,t}function se(g,D){return g[0]*D[0]+g[1]*D[1]+g[2]*D[2]+g[3]*D[3]}function Te(g,D,u,t){let o=t??new l(4);return o[0]=g[0]+u*(D[0]-g[0]),o[1]=g[1]+u*(D[1]-g[1]),o[2]=g[2]+u*(D[2]-g[2]),o[3]=g[3]+u*(D[3]-g[3]),o}function de(g){let D=g[0],u=g[1],t=g[2],o=g[3];return Math.sqrt(D*D+u*u+t*t+o*o)}let ke=de;function fe(g){let D=g[0],u=g[1],t=g[2],o=g[3];return D*D+u*u+t*t+o*o}let q=fe;function K(g,D){let u=D??new l(4),t=g[0],o=g[1],r=g[2],f=g[3],p=Math.sqrt(t*t+o*o+r*r+f*f);return p>1e-5?(u[0]=t/p,u[1]=o/p,u[2]=r/p,u[3]=f/p):(u[0]=0,u[1]=0,u[2]=0,u[3]=1),u}function C(g,D){return Math.abs(g[0]-D[0])<N&&Math.abs(g[1]-D[1])<N&&Math.abs(g[2]-D[2])<N&&Math.abs(g[3]-D[3])<N}function pe(g,D){return g[0]===D[0]&&g[1]===D[1]&&g[2]===D[2]&&g[3]===D[3]}function Be(g){let D=g??new l(4);return D[0]=0,D[1]=0,D[2]=0,D[3]=1,D}let J=v.create(),O=v.create(),y=v.create();function S(g,D,u){let t=u??new l(4),o=v.dot(g,D);return o<-.999999?(v.cross(O,g,J),v.len(J)<1e-6&&v.cross(y,g,J),v.normalize(J,J),A(J,Math.PI,t),t):o>.999999?(t[0]=0,t[1]=0,t[2]=0,t[3]=1,t):(v.cross(g,D,J),t[0]=J[0],t[1]=J[1],t[2]=J[2],t[3]=1+o,K(t,t))}let b=new l(4),U=new l(4);function G(g,D,u,t,o,r){let f=r??new l(4);return ne(g,t,o,b),ne(D,u,o,U),ne(b,U,2*o*(1-o),f),f}return{create:I,fromValues:T,set:L,fromAxisAngle:A,toAxisAngle:Q,angle:H,multiply:F,mul:$,rotateX:V,rotateY:j,rotateZ:ae,slerp:ne,inverse:te,conjugate:_e,fromMat:Oe,fromEuler:Ue,copy:we,clone:ue,add:le,subtract:re,sub:ge,mulScalar:Ge,scale:be,divScalar:ve,dot:se,lerp:Te,length:de,len:ke,lengthSq:fe,lenSq:q,normalize:K,equalsApproximately:C,equals:pe,identity:Be,rotationTo:S,sqlerp:G}}var bt=new Map;function cn(l){let v=bt.get(l);return v||(v=on(l),bt.set(l,v)),v}function an(l){function v(u,t,o,r){let f=new l(4);return u!==void 0&&(f[0]=u,t!==void 0&&(f[1]=t,o!==void 0&&(f[2]=o,r!==void 0&&(f[3]=r)))),f}let I=v;function T(u,t,o,r,f){let p=f??new l(4);return p[0]=u,p[1]=t,p[2]=o,p[3]=r,p}function L(u,t){let o=t??new l(4);return o[0]=Math.ceil(u[0]),o[1]=Math.ceil(u[1]),o[2]=Math.ceil(u[2]),o[3]=Math.ceil(u[3]),o}function A(u,t){let o=t??new l(4);return o[0]=Math.floor(u[0]),o[1]=Math.floor(u[1]),o[2]=Math.floor(u[2]),o[3]=Math.floor(u[3]),o}function Q(u,t){let o=t??new l(4);return o[0]=Math.round(u[0]),o[1]=Math.round(u[1]),o[2]=Math.round(u[2]),o[3]=Math.round(u[3]),o}function H(u,t=0,o=1,r){let f=r??new l(4);return f[0]=Math.min(o,Math.max(t,u[0])),f[1]=Math.min(o,Math.max(t,u[1])),f[2]=Math.min(o,Math.max(t,u[2])),f[3]=Math.min(o,Math.max(t,u[3])),f}function F(u,t,o){let r=o??new l(4);return r[0]=u[0]+t[0],r[1]=u[1]+t[1],r[2]=u[2]+t[2],r[3]=u[3]+t[3],r}function $(u,t,o,r){let f=r??new l(4);return f[0]=u[0]+t[0]*o,f[1]=u[1]+t[1]*o,f[2]=u[2]+t[2]*o,f[3]=u[3]+t[3]*o,f}function V(u,t,o){let r=o??new l(4);return r[0]=u[0]-t[0],r[1]=u[1]-t[1],r[2]=u[2]-t[2],r[3]=u[3]-t[3],r}let j=V;function ae(u,t){return Math.abs(u[0]-t[0])<N&&Math.abs(u[1]-t[1])<N&&Math.abs(u[2]-t[2])<N&&Math.abs(u[3]-t[3])<N}function ne(u,t){return u[0]===t[0]&&u[1]===t[1]&&u[2]===t[2]&&u[3]===t[3]}function te(u,t,o,r){let f=r??new l(4);return f[0]=u[0]+o*(t[0]-u[0]),f[1]=u[1]+o*(t[1]-u[1]),f[2]=u[2]+o*(t[2]-u[2]),f[3]=u[3]+o*(t[3]-u[3]),f}function _e(u,t,o,r){let f=r??new l(4);return f[0]=u[0]+o[0]*(t[0]-u[0]),f[1]=u[1]+o[1]*(t[1]-u[1]),f[2]=u[2]+o[2]*(t[2]-u[2]),f[3]=u[3]+o[3]*(t[3]-u[3]),f}function Oe(u,t,o){let r=o??new l(4);return r[0]=Math.max(u[0],t[0]),r[1]=Math.max(u[1],t[1]),r[2]=Math.max(u[2],t[2]),r[3]=Math.max(u[3],t[3]),r}function Ue(u,t,o){let r=o??new l(4);return r[0]=Math.min(u[0],t[0]),r[1]=Math.min(u[1],t[1]),r[2]=Math.min(u[2],t[2]),r[3]=Math.min(u[3],t[3]),r}function we(u,t,o){let r=o??new l(4);return r[0]=u[0]*t,r[1]=u[1]*t,r[2]=u[2]*t,r[3]=u[3]*t,r}let ue=we;function le(u,t,o){let r=o??new l(4);return r[0]=u[0]/t,r[1]=u[1]/t,r[2]=u[2]/t,r[3]=u[3]/t,r}function re(u,t){let o=t??new l(4);return o[0]=1/u[0],o[1]=1/u[1],o[2]=1/u[2],o[3]=1/u[3],o}let ge=re;function Ge(u,t){return u[0]*t[0]+u[1]*t[1]+u[2]*t[2]+u[3]*t[3]}function be(u){let t=u[0],o=u[1],r=u[2],f=u[3];return Math.sqrt(t*t+o*o+r*r+f*f)}let ve=be;function se(u){let t=u[0],o=u[1],r=u[2],f=u[3];return t*t+o*o+r*r+f*f}let Te=se;function de(u,t){let o=u[0]-t[0],r=u[1]-t[1],f=u[2]-t[2],p=u[3]-t[3];return Math.sqrt(o*o+r*r+f*f+p*p)}let ke=de;function fe(u,t){let o=u[0]-t[0],r=u[1]-t[1],f=u[2]-t[2],p=u[3]-t[3];return o*o+r*r+f*f+p*p}let q=fe;function K(u,t){let o=t??new l(4),r=u[0],f=u[1],p=u[2],_=u[3],w=Math.sqrt(r*r+f*f+p*p+_*_);return w>1e-5?(o[0]=r/w,o[1]=f/w,o[2]=p/w,o[3]=_/w):(o[0]=0,o[1]=0,o[2]=0,o[3]=0),o}function C(u,t){let o=t??new l(4);return o[0]=-u[0],o[1]=-u[1],o[2]=-u[2],o[3]=-u[3],o}function pe(u,t){let o=t??new l(4);return o[0]=u[0],o[1]=u[1],o[2]=u[2],o[3]=u[3],o}let Be=pe;function J(u,t,o){let r=o??new l(4);return r[0]=u[0]*t[0],r[1]=u[1]*t[1],r[2]=u[2]*t[2],r[3]=u[3]*t[3],r}let O=J;function y(u,t,o){let r=o??new l(4);return r[0]=u[0]/t[0],r[1]=u[1]/t[1],r[2]=u[2]/t[2],r[3]=u[3]/t[3],r}let S=y;function b(u){let t=u??new l(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function U(u,t,o){let r=o??new l(4),f=u[0],p=u[1],_=u[2],w=u[3];return r[0]=t[0]*f+t[4]*p+t[8]*_+t[12]*w,r[1]=t[1]*f+t[5]*p+t[9]*_+t[13]*w,r[2]=t[2]*f+t[6]*p+t[10]*_+t[14]*w,r[3]=t[3]*f+t[7]*p+t[11]*_+t[15]*w,r}function G(u,t,o){let r=o??new l(4);return K(u,r),we(r,t,r)}function g(u,t,o){let r=o??new l(4);return be(u)>t?G(u,t,r):pe(u,r)}function D(u,t,o){let r=o??new l(4);return te(u,t,.5,r)}return{create:v,fromValues:I,set:T,ceil:L,floor:A,round:Q,clamp:H,add:F,addScaled:$,subtract:V,sub:j,equalsApproximately:ae,equals:ne,lerp:te,lerpV:_e,max:Oe,min:Ue,mulScalar:we,scale:ue,divScalar:le,inverse:re,invert:ge,dot:Ge,length:be,len:ve,lengthSq:se,lenSq:Te,distance:de,dist:ke,distanceSq:fe,distSq:q,normalize:K,negate:C,copy:pe,clone:Be,multiply:J,mul:O,divide:y,div:S,zero:b,transformMat4:U,setLength:G,truncate:g,midpoint:D}}var It=new Map;function un(l){let v=It.get(l);return v||(v=an(l),It.set(l,v)),v}function ft(l,v,I,T,L,A){return{mat3:nn(l),mat4:sn(v),quat:cn(I),vec2:Mt(T),vec3:st(L),vec4:un(A)}}var{mat3:Mn,mat4:qe,quat:En,vec2:$e,vec3:X,vec4:He}=ft(Float32Array,Float32Array,Float32Array,Float32Array,Float32Array,Float32Array),{mat3:Rn,mat4:Un,quat:Gn,vec2:Tn,vec3:kn,vec4:Bn}=ft(Float64Array,Float64Array,Float64Array,Float64Array,Float64Array,Float64Array),{mat3:zn,mat4:An,quat:Ln,vec2:Wn,vec3:Nn,vec4:Kn}=ft(Qt,Array,Array,Array,Array,Array);var Ye=64,Ne=16,Et=(l,v=10)=>{let I=new Uint32Array(l.buffer),T=[];for(let L=0;L<v;L++){let A=L*Ne;T=[...T,{xPos:l[A+0],yPos:l[A+1],zPos:l[A+2],xVel:l[A+4],yVel:l[A+5],zVel:l[A+6],dist:l[A+8],dens:l[A+9],cell:I[A+10],test:I[A+11]}]}console.table(T)};function ee(l){return Number.isInteger(l)?l.toFixed(1):l.toString()}function Rt(l){return`vec3<f32>(${ee(l[0])}, ${ee(l[1])}, ${ee(l[2])})`}function Ut(l){let v=I=>I.toFixed(0);return`vec3<i32>(${v(l[0])}, ${v(l[1])}, ${v(l[2])})`}var it=class{initialised=!1;device={};ctx={};renderPipeline={};instanceCount=0;vertexCount=0;vertexBuffer={};instanceBuffer={};uniformBuffer={};bindGroup={};depthTexture=null;multisampleTexture=null;clearColour={r:.1,g:.1,b:.1,a:1};multisampleCount=4;async init(){let v=document.querySelector("#gpuCanvas");if(!navigator.gpu)throw Error("WebGPU not supported.");let I=await navigator.gpu.requestAdapter();if(!I)throw Error("Couldn't request WebGPU adapter.");return this.device=await I.requestDevice(),this.ctx=v.getContext("webgpu"),this.ctx.configure({device:this.device,format:navigator.gpu.getPreferredCanvasFormat(),alphaMode:"opaque"}),this.initialised=!0,!0}createBuffersAndPipeline(v){let I=yt();this.vertexCount=I.length/5,this.instanceCount=v;let T=[{attributes:[{shaderLocation:0,offset:0,format:"float32x3"},{shaderLocation:1,offset:12,format:"float32x2"}],arrayStride:20,stepMode:"vertex"},{attributes:[{shaderLocation:2,offset:0,format:"float32x4"},{shaderLocation:3,offset:16,format:"float32x4"},{shaderLocation:4,offset:32,format:"float32x4"},{shaderLocation:5,offset:48,format:"float32"},{shaderLocation:6,offset:52,format:"float32"},{shaderLocation:7,offset:56,format:"uint32"},{shaderLocation:8,offset:60,format:"float32"}],arrayStride:Ne*4,stepMode:"instance"}],L=this.device.createShaderModule({code:Dt});this.renderPipeline=this.device.createRenderPipeline({vertex:{module:L,entryPoint:"vertex_main",buffers:T},fragment:{module:L,entryPoint:"fragment_main",targets:[{format:navigator.gpu.getPreferredCanvasFormat()}]},primitive:{topology:"triangle-list",cullMode:"none"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:"auto",multisample:{count:this.multisampleCount}}),this.vertexBuffer=this.device.createBuffer({size:I.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.device.queue.writeBuffer(this.vertexBuffer,0,I,0,I.length),this.instanceBuffer=this.device.createBuffer({size:this.instanceCount*4*Ne,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});let A=96;this.uniformBuffer=this.device.createBuffer({size:A,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroup=this.device.createBindGroup({layout:this.renderPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]})}render(v){if(!this.initialised)throw"WebGPU not initialised";let I=this.ctx.getCurrentTexture(),T=new Float32Array([...v,this.clearColour.r,this.clearColour.g,this.clearColour.b,this.clearColour.a,I.width/I.height]);this.device.queue.writeBuffer(this.uniformBuffer,0,T,0),(!this.depthTexture||this.depthTexture.width!==I.width||this.depthTexture.height!==I.height)&&(this.depthTexture?.destroy(),this.depthTexture=this.device.createTexture({size:I,format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT,sampleCount:this.multisampleCount})),(!this.multisampleTexture||this.multisampleTexture.width!==I.width||this.multisampleTexture.height!==I.height)&&(this.multisampleTexture&&this.multisampleTexture.destroy(),this.multisampleTexture=this.device.createTexture({format:I.format,usage:GPUTextureUsage.RENDER_ATTACHMENT,size:[I.width,I.height],sampleCount:this.multisampleCount}));let L=this.device.createCommandEncoder(),A=L.beginRenderPass({colorAttachments:[{clearValue:this.clearColour,loadOp:"clear",storeOp:"store",view:this.multisampleTexture.createView(),resolveTarget:I.createView()}],depthStencilAttachment:{depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store",view:this.depthTexture.createView()}});A.setPipeline(this.renderPipeline),A.setVertexBuffer(0,this.vertexBuffer),A.setVertexBuffer(1,this.instanceBuffer),A.setBindGroup(0,this.bindGroup),A.draw(this.vertexCount,this.instanceCount,0,0),A.end(),this.device.queue.submit([L.finish()])}};var We=1,fn=X.create(200,100,25),Ve=X.floor(X.divScalar(fn,We)),ln=X.mulScalar(Ve,We),Ze=`

const gridSize = ${Ut(Ve)};
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
`;var dn=`
struct Particle {
  position: vec4<f32>, // xyz used
  velocity: vec4<f32>, // xyz used
  normal: vec4<f32>,
  lastDist: f32,
  density: f32,
  cellIndex: u32,
  group: f32,
}
`,Ke=`
${dn}
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

`,Ce=`
@compute @workgroup_size(${Ye}, 1, 1) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
)
`,Fe=`workgroup_id.x * ${Ye} + local_invocation_id.x`;var Gt=`

${Ke}


${Ze}


${Ce} {
  let id = ${Fe};

  var position = particles0[id].position.xyz;
  position += bounds * 0.5; // offset so grid bounding box applies from [-0.5*bound, +0.5*bound]
  
  var cellId3D = vec3<i32>(floor(position / cellWidth));
  let cellIdFlat = getCellIdFlat(cellId3D);

  particles0[id].cellIndex = cellIdFlat;
  particles1[id].cellIndex = cellIdFlat;

  cellIds[id] = cellIdFlat;
  particleIds[id] = id;
}

`;var Tt=`

${Ke.replace("cellOffsets: array<u32>","cellOffsets: array<atomic<u32>>")}

${Ce} {
  let id = ${Fe};

  let particleId = particleIds[id]; // index of this cell within the particles buffer
  let cellId = cellIds[id];

  particles0[id] = particles1[particleId];

  


  // the offset to the first appearance of each cell within the sorted cellId list is the minimum of ids
  atomicMin(&cellOffsets[cellId], id);
}
`;var kt=.8,pn=250,hn=1,_n=.118,wn=1,gn=ee(315/(64*Math.PI*Math.pow(We,9))),vn=ee(-45/(Math.PI*Math.pow(We,6))),mn=ee(45/(Math.PI*Math.pow(We,6))),ot=`

const h = ${ee(We)};
const h2 = ${ee(Math.pow(We,2))};
const h3 = ${ee(Math.pow(We,3))};

const densityH = ${ee(We*kt)};
const densityH2 = ${ee(Math.pow(We*kt,2))};

const particleFluidMass = ${ee(wn)};
const p0 = ${ee(hn)};
const K = ${ee(pn)};
const e = ${ee(_n)};

fn particleDensity(particle: Particle) -> f32 {
  var density = 0.0;

  ${lt(`
    let diff = particle.position.xyz - particleB.position.xyz;
    let r2 = dot(diff, diff);
    if (r2 < h2) {
      let W = ${gn} * pow(h2 - r2, 3.0);
      density += particleFluidMass * W;
    }
  `)}
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
        let pressureB = particlePressure(particleB.density);
        pressureForce += W1 * rNorm * (pressureA + pressureB) / (2.0 * particle.density * particleB.density);


        // VISCOSITY FORCE
        // let W2 = -(r3 / (2.0 * h3)) + (r2 / h2) + (h / (2.0 * r)) - 1;
        var W2 = ${mn} * (h - r);
        viscosityForce += (1.0-2.0*groupDist) * W2 * rNorm * (particleB.velocity.xyz - particle.velocity.xyz) / particleB.density;


        // GROUP COHESION
        sameGroupNeighbourPosSum += select(vec4<f32>(particleB.position.xyz, 1.0), vec4<f32>(0.0), groupDist > 0.5);
        diffGroupNeighbourPosSum += select(vec4<f32>(particleB.position.xyz, 1.0), vec4<f32>(0.0), groupDist < 0.5);
      }
    }
  `)}

  var force = (e*viscosityForce - pressureForce) / particle.density;

  let sameGroupCentroidDir = (sameGroupNeighbourPosSum.xyz / sameGroupNeighbourPosSum.w) - particle.position.xyz;
  let diffGroupCentroidDir = (diffGroupNeighbourPosSum.xyz / diffGroupNeighbourPosSum.w) - particle.position.xyz;
  force += 0.3* sameGroupCentroidDir - 0.0*diffGroupCentroidDir;

  return force / particleFluidMass;
}


`;var Bt=`

${Ke}
${Ze}
${ot}


${Ce} {
  let id = ${Fe};

  particles0[id].density = particleDensity(particles0[id]);
}

`;var Dn=ee(.05),yn=ee(-2),Pn=ee(-1),Sn=ee(200),zt=`

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

const gravityClamp = ${Sn};
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
${Ze}
${ot}
${zt}

const accelDeltaTime = 0.01; // hardcoded deltaTime for acceleration calculation to prevent explosion
const velocityClamp = 100.0;


${Ce} {
  let id = ${Fe};
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
`;var Nt=jt(Wt(),1);var at=class{device;computeShaders=[Gt,Tt,Bt,At];pipelines=[];bindGroup;particleCount;particleDataBuffer0;particleDataBuffer1;renderInstanceBuffer;cellIndexBuffer;particleIdBuffer;cellOffsetBuffer;cellOffsetStartBuffer;uniformBuffer;time=0;uniforms=new Map([["time",{length:1,value:new Float32Array([0])}],["deltaTime",{length:1,value:new Float32Array([0])}],["mouseIntersection",{length:2,value:new Float32Array([0,0])}],["lastMouseIntersection",{length:2,value:new Float32Array([0,0])}],["animSpeed",{length:1,value:new Float32Array([0])}],["particleCount",{length:1,value:new Uint32Array([0])}]]);uniformsLength=Array.from(this.uniforms.values()).reduce((v,I)=>v+I.length,0);resultBuffer;constructor(v,I,T,L){this.device=v,this.particleCount=I,this.renderInstanceBuffer=L;let A=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"uniform"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:5,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}}]}),Q=this.device.createPipelineLayout({bindGroupLayouts:[A]});for(let F=0;F<this.computeShaders.length;F++){let $=this.device.createShaderModule({label:`particle update ${F}`,code:this.computeShaders[F]});this.pipelines.push(v.createComputePipeline({label:`particle update ${F} pipeline`,layout:Q,compute:{module:$}}))}this.particleDataBuffer0=v.createBuffer({size:I*4*Ne,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),this.particleDataBuffer1=v.createBuffer({size:I*4*Ne,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST}),v.queue.writeBuffer(this.particleDataBuffer0,0,T),v.queue.writeBuffer(this.particleDataBuffer1,0,T),this.cellIndexBuffer=v.createBuffer({size:I*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),this.particleIdBuffer=v.createBuffer({size:I*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});let H=Ve[0]*Ve[1]*Ve[2];this.cellOffsetBuffer=v.createBuffer({size:H*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),this.cellOffsetStartBuffer=v.createBuffer({size:H*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC}),v.queue.writeBuffer(this.cellOffsetStartBuffer,0,new Uint32Array(H).fill(4294967295)),this.uniformBuffer=v.createBuffer({size:this.uniformsLength*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.resultBuffer=v.createBuffer({size:this.particleDataBuffer0.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.bindGroup=v.createBindGroup({layout:A,entries:[{binding:0,resource:{buffer:this.particleDataBuffer0}},{binding:1,resource:{buffer:this.particleDataBuffer1}},{binding:2,resource:{buffer:this.uniformBuffer}},{binding:3,resource:{buffer:this.cellIndexBuffer}},{binding:4,resource:{buffer:this.particleIdBuffer}},{binding:5,resource:{buffer:this.cellOffsetBuffer}}]})}sort(v){let I=new Nt.RadixSortKernel({device:this.device,keys:this.cellIndexBuffer,values:this.particleIdBuffer,count:this.particleCount,check_order:!1,bit_count:32,workgroup_size:{x:16,y:16}}),T=v.beginComputePass();I.dispatch(T),T.end()}async run(v,I,T){this.time+=v,this.uniforms.get("time").value[0]=this.time,this.uniforms.get("deltaTime").value[0]=v,this.uniforms.get("mouseIntersection").value=I,this.uniforms.get("lastMouseIntersection").value=T,this.uniforms.get("animSpeed").value[0]=window.PAUSE_UPDATE?0:1,this.uniforms.get("particleCount").value[0]=this.particleCount;let L=new Float32Array(this.uniformsLength),A=0;for(let[V,{length:j,value:ae}]of this.uniforms)L.set(ae,A),A+=j;this.device.queue.writeBuffer(this.uniformBuffer,0,L,0);let Q=this.device.createCommandEncoder();Q.copyBufferToBuffer(this.cellOffsetStartBuffer,this.cellOffsetBuffer);let H=V=>{let j=Q.beginComputePass();j.setPipeline(V),j.setBindGroup(0,this.bindGroup),j.dispatchWorkgroups(this.particleCount/Ye,1,1),j.end()};H(this.pipelines[0]),this.sort(Q),H(this.pipelines[1]),H(this.pipelines[2]),H(this.pipelines[3]),Q.copyBufferToBuffer(this.particleDataBuffer1,this.particleDataBuffer0),Q.copyBufferToBuffer(this.particleDataBuffer1,0,this.renderInstanceBuffer,0);let F=window.DEBUG_BUF===3?this.cellOffsetBuffer:window.DEBUG_BUF===2?this.particleIdBuffer:window.DEBUG_BUF===1?this.cellIndexBuffer:this.particleDataBuffer0;Q.copyBufferToBuffer(F,0,this.resultBuffer,0);let $=Q.finish();if(this.device.queue.submit([$]),window.LOG_INSTANCE_DATA){if(window.LOG_INSTANCE_DATA=!1,await this.resultBuffer.mapAsync(GPUMapMode.READ),window.DEBUG_BUF){let V=new Uint32Array(this.resultBuffer.getMappedRange());console.log(V)}else{let V=new Float32Array(this.resultBuffer.getMappedRange());Et(V)}this.resultBuffer.unmap()}}};var ut=class{viewDistance=84;viewMatrix=qe.lookAt([0,0,this.viewDistance],[0,0,0],[0,1,0]);viewProjectionMatrix=qe.identity();viewAngles=$e.create(0,0);mouseCoord=$e.create(0,0);mouseDown=!1;lastMouseCoord=$e.create(0,0);mouseIntersection=X.create(0,0,0);lastMouseIntersection=X.create(0,0,0);constructor(){window.addEventListener("mousemove",v=>{let I=v.target.getBoundingClientRect();this.mouseCoord[0]=(v.clientX-I.left)/I.width*2-1,this.mouseCoord[1]=-((v.clientY-I.top)/I.height*2-1)}),window.addEventListener("mousedown",v=>{this.mouseDown=!0}),window.addEventListener("mouseup",v=>{this.mouseDown=!1}),window.addEventListener("wheel",v=>{this.viewDistance+=.1*this.viewDistance*(v.deltaY>0?1:-1),this.viewDistance=Math.max(5,Math.min(200,this.viewDistance))})}createInitialParticleData(v){let I=new Float32Array(v*Ne);for(let T=0;T<v;T++){let L=X.create(Math.random(),Math.random(),Math.random());L=X.sub(L,X.create(.5,.5,.5)),L=X.multiply(L,X.create(20,100,20));let A=[-2.05,-1.05,0,1,2].map(j=>j*40),Q=Math.floor(Math.random()*A.length),H=Math.random()>.5?1:-1;L=X.add(L,X.create(A[Q],110*H,0));let F=20,$=X.create(0,-20,0),V=X.create(0,1,0);I.set([L[0],L[1],L[2],1,$[0],$[1],$[2],1,V[0],V[1],V[2],1,0,0,0,H],T*Ne)}return I}update(v){if(this.mouseDown){let ne=$e.subtract(this.mouseCoord,this.lastMouseCoord);this.viewAngles[0]+=ne[0]*1.5,this.viewAngles[1]+=ne[1]*-1}let I=X.create(0,0,this.viewDistance);I=X.rotateX(I,X.zero(),this.viewAngles[1]),I=X.rotateY(I,X.zero(),this.viewAngles[0]);let T=qe.lookAt(I,[0,0,0],[0,1,0]),L=qe.perspective(1,v.width/v.height,.1,1e3);this.viewProjectionMatrix=qe.multiply(L,T);let A=He.create(this.mouseCoord[0],this.mouseCoord[1],-1,1),Q=He.create(this.mouseCoord[0],this.mouseCoord[1],1,1),H=qe.inverse(this.viewProjectionMatrix),F=He.transformMat4(A,H),$=He.transformMat4(Q,H);F=X.create(F[0]/F[3],F[1]/F[3],F[2]/F[3]),$=X.create($[0]/$[3],$[1]/$[3],$[2]/$[3]);let V=F,j=X.normalize(X.sub($,F)),ae=-V[2]/j[2];this.lastMouseIntersection=this.mouseIntersection,this.mouseIntersection=X.add(V,X.scale(j,ae)),this.lastMouseCoord=$e.clone(this.mouseCoord)}};var dt=1600*Ye,je=new ut,ht=Date.now(),Kt=0,pt=0;function Ct(l,v){let I=Date.now(),T=(I-ht)/1e3;ht=I,Kt++,pt+=T,window.LOG_FPS&&Kt%100==0&&(console.log("FPS ",1/(pt/100)),pt=0),je.update(l.ctx.canvas),v.run(Math.min(T,.1),je.mouseIntersection,je.lastMouseIntersection),l.render(je.viewProjectionMatrix),requestAnimationFrame(()=>Ct(l,v))}async function xn(){let l=new it;if(!await l.init())return;let I=je.createInitialParticleData(dt);l.createBuffersAndPipeline(dt);let T=new at(l.device,dt,I,l.instanceBuffer);ht=Date.now(),requestAnimationFrame(()=>Ct(l,T))}xn();})();
