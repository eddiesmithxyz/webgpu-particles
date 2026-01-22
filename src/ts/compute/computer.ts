// https://wickedengine.net/2018/05/scalabe-gpu-fluid-simulation/comment-page-1/

import { instanceDataLength, logInstanceData, workgroupSize } from "../common";
import { gridSize } from "./shader/grid/gridAccess";

import { assignCellShaderSrc } from "./shader/grid/assignCell";
import { createStructureSrc } from "./shader/grid/createStructure";
import { update1Src } from "./shader/update1";
import { update2Src } from "./shader/update2";

import { RadixSortKernel } from 'webgpu-radix-sort';

import { type Vec2 } from "wgpu-matrix";


export class WGPUComputer {
  private device: GPUDevice;

  private computeShaders = [assignCellShaderSrc, createStructureSrc, update1Src, update2Src]; // run in order, with a sort between shader[0] and shader[1]

  private pipelines: GPUComputePipeline[] = [];
  private bindGroup: GPUBindGroup;
  
  private particleCount = 0;
  private maxParticleCount: number;
  private readonly spawnPeriod = 3; // duration (seconds) of initial period where particles spawn in


  private particleDataBuffer0: GPUBuffer; // used as read/write for all but the final shader. used as read for final shader
  private particleDataBuffer1: GPUBuffer; // used as write for final shader (to avoid race conditions)

  private renderInstanceBuffer: GPUBuffer;

  // particles are given in a tuple (cellIndex, particleIndex in particleDataBuffer)
  // we sort these tuples by cellIndex, creating sublists in the list of tuples for each cell
  private cellIndexBuffer: GPUBuffer;
  private particleIdBuffer: GPUBuffer;

  private cellOffsetBuffer: GPUBuffer; // stores the offset each cell has in the sorted cellIndex array (0xffffffff if cell is empty)
  private cellOffsetStartBuffer: GPUBuffer; // buffer of 0xffffffff to reset cellOffset every frame - currently no encoder.fillBuffer :(


  private uniformBuffer: GPUBuffer;
  private time = 0;


  private uniforms = new Map<string, {length: number, value: Float32Array | Uint32Array}>([
    ["time",                  {length: 1, value: new Float32Array([0])}],
    ["deltaTime",             {length: 1, value: new Float32Array([0])}],
    ["mouseIntersection",     {length: 2, value: new Float32Array([0, 0])}],
    ["lastMouseIntersection", {length: 2, value: new Float32Array([0, 0])}],
    ["animSpeed",             {length: 1, value: new Float32Array([0])}],
    ["particleCount",         {length: 1, value: new Uint32Array([0])}],
  ]);
  private uniformsLength = Array.from(this.uniforms.values()).reduce((acc, u) => acc + u.length, 0);

  private resultBuffer: GPUBuffer; // for debug


  constructor(device: GPUDevice, particleCount: number, initialInstanceData: Float32Array<ArrayBuffer>, renderInstanceBuffer: GPUBuffer) {
    this.device = device;
    this.maxParticleCount = particleCount;
    this.particleCount = 0;
    this.renderInstanceBuffer = renderInstanceBuffer;

    
    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "uniform" },
        },
        {
          binding: 3,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
        {
          binding: 4,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
        {
          binding: 5,
          visibility: GPUShaderStage.COMPUTE,
          buffer: { type: "storage" },
        },
      ],
    });
    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });

    
    // create a pipeline for each shader 
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

    
    // BUFFERS

    this.particleDataBuffer0 = device.createBuffer({
      size: this.maxParticleCount * 4 * instanceDataLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    });
    this.particleDataBuffer1 = device.createBuffer({
      size: this.maxParticleCount * 4 * instanceDataLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(this.particleDataBuffer0, 0, initialInstanceData)
    device.queue.writeBuffer(this.particleDataBuffer1, 0, initialInstanceData)

    this.cellIndexBuffer = device.createBuffer({
      size: this.maxParticleCount * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    })
    this.particleIdBuffer = device.createBuffer({
      size: this.maxParticleCount * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
    })

    const cellOffsetBufSize = gridSize[0] * gridSize[1] * gridSize[2]
    this.cellOffsetBuffer = device.createBuffer({
      size: cellOffsetBufSize * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    });
    this.cellOffsetStartBuffer = device.createBuffer({
      size: cellOffsetBufSize * 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC
    })
    device.queue.writeBuffer(this.cellOffsetStartBuffer, 0, new Uint32Array(cellOffsetBufSize).fill(0xffffffff))




    this.uniformBuffer = device.createBuffer({
      size: this.uniformsLength * 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    this.resultBuffer = device.createBuffer({
      size: this.particleDataBuffer0.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    


    // BINDINGS
    this.bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.particleDataBuffer0 }},
        { binding: 1, resource: { buffer: this.particleDataBuffer1 }},
        { binding: 2, resource: { buffer: this.uniformBuffer }},
        { binding: 3, resource: { buffer: this.cellIndexBuffer }},
        { binding: 4, resource: { buffer: this.particleIdBuffer }},
        { binding: 5, resource: { buffer: this.cellOffsetBuffer }}
      ],
    })
  }

  sort(encoder: GPUCommandEncoder) {
    // sort (cell id, particle id) list by cell id
    const radixSortKernel = new RadixSortKernel({
      device: this.device,
      keys: this.cellIndexBuffer,
      values: this.particleIdBuffer,
      count: this.maxParticleCount,
      check_order: false, 
      bit_count: 32,
      workgroup_size: { x: 16, y: 16 },  // Workgroup size in x and y dimensions. (x * y) must be a power of two
    });
    const pass = encoder.beginComputePass();
    radixSortKernel.dispatch(pass);
    pass.end();
  }

  async run(deltaTime: number, mouseIntersection: Vec2, lastMouseIntersection: Vec2) {
    this.time += deltaTime;

    // spawn more particles
    this.particleCount += this.maxParticleCount * (deltaTime / this.spawnPeriod);
    this.particleCount = Math.min(this.particleCount, this.maxParticleCount);
    

    // update uniforms
    this.uniforms.get("time")!.value[0] = this.time;
    this.uniforms.get("deltaTime")!.value[0] = deltaTime;
    this.uniforms.get("mouseIntersection")!.value = mouseIntersection;
    this.uniforms.get("lastMouseIntersection")!.value = lastMouseIntersection;
    this.uniforms.get("animSpeed")!.value[0] = window.PAUSE_UPDATE ? 0 : 1;
    this.uniforms.get("particleCount")!.value[0] = this.particleCount;

    // write uniforms
    const uniformData = new Float32Array(this.uniformsLength);
    let i = 0;
    for (const [_, { length, value }] of this.uniforms) {
      uniformData.set(value, i);
      i += length;
    }
    this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0);


    
    // run each compute shader
    const encoder = this.device.createCommandEncoder();
    encoder.copyBufferToBuffer(this.cellOffsetStartBuffer, this.cellOffsetBuffer); // reset cell offsets to max value (indicating empty cell)

    const runPipeline = (pipeline: GPUComputePipeline) => {
      const pass = encoder.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, this.bindGroup);
      pass.dispatchWorkgroups(this.maxParticleCount / workgroupSize, 1, 1);
      pass.end();
    }
    
    runPipeline(this.pipelines[0]); // assign cell
    this.sort(encoder);
    runPipeline(this.pipelines[1]); // create offset list and reorder particle data
    runPipeline(this.pipelines[2]); // physics update 1
    runPipeline(this.pipelines[3]); // physics update 2

    encoder.copyBufferToBuffer(this.particleDataBuffer1, this.particleDataBuffer0);
    encoder.copyBufferToBuffer(this.particleDataBuffer1, 0, this.renderInstanceBuffer, 0);




    // DEBUGGING

    const debugBuffer = 
      window.DEBUG_BUF === 3 ? this.cellOffsetBuffer : (
      window.DEBUG_BUF === 2 ? this.particleIdBuffer : (
      window.DEBUG_BUF === 1 ? this.cellIndexBuffer : this.particleDataBuffer0))
    encoder.copyBufferToBuffer(debugBuffer, 0, this.resultBuffer, 0);

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);

    if (window.LOG_INSTANCE_DATA) 
      {
      // copy instance data to result buffer and print

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

}