import { update1Src } from "./shader/update1";
import { update2Src } from "./shader/update2";
import { instanceDataLength, logInstanceData, sideLength } from "../common";

export class WGPUComputer {
  private device: GPUDevice;


  private pipelines: GPUComputePipeline[];
  private bindGroup: GPUBindGroup;

  private instanceCount: number;
  private instanceDataBuffer: GPUBuffer;
  private renderInstanceBuffer: GPUBuffer;


  private uniformBuffer: GPUBuffer;


  // could auto-generate this list from the shader code but not necessary for a small number
  private uniforms = new Map<string, {length: number, value: number[]}>([
    ["deltaTime",       {length: 1, value: [0]}],
  ]);
  private uniformsLength = Array.from(this.uniforms.values()).reduce((acc, u) => acc + u.length, 0);

  private resultBuffer: GPUBuffer; // debug


  constructor(device: GPUDevice, instanceCount: number, initialInstanceData: Float32Array<ArrayBuffer>, renderInstanceBuffer: GPUBuffer) {
    this.device = device;
    this.instanceCount = instanceCount;
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
          buffer: { type: "uniform" },
        },
      ],
    });
    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });

    
    this.pipelines = [[1, update1Src], [2, update2Src]]
      .map(([id, src]) => {
      const module = this.device.createShaderModule({
        label: `particle update ${id}`,
        code: src as string
      });

      return device.createComputePipeline({
        label: `particle update ${id} pipeline`,
        layout: pipelineLayout,
        compute: {
          module
        }
      });
    })



    
    this.instanceDataBuffer = device.createBuffer({
      size: instanceCount * 4 * instanceDataLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(this.instanceDataBuffer, 0, initialInstanceData)

    this.uniformBuffer = device.createBuffer({
      size: this.uniformsLength * 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });

    this.resultBuffer = device.createBuffer({
      size: this.instanceDataBuffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    

    // add bindings for buffers to be used in the compute pipeline
    this.bindGroup = device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.instanceDataBuffer }},
        { binding: 1, resource: { buffer: this.uniformBuffer }},
      ],
    })
  }

  async run(deltaTime: number) {
    // update uniforms
    this.uniforms.get("deltaTime")!.value[0] = deltaTime;

    // write uniforms
    const uniformData = new Float32Array(this.uniformsLength);
    let i = 0;
    for (const [_, { length, value }] of this.uniforms) {
      uniformData.set(value, i);
      i += length;
    }
    this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0);


    
    // create compute commands
    const encoder = this.device.createCommandEncoder();
    for (const pipeline of this.pipelines) {
      const pass = encoder.beginComputePass();
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, this.bindGroup);
      pass.dispatchWorkgroups(sideLength, 1, 1);
      pass.end();
    }
    encoder.copyBufferToBuffer(this.instanceDataBuffer, 0, this.renderInstanceBuffer, 0);
    encoder.copyBufferToBuffer(this.instanceDataBuffer, 0, this.resultBuffer, 0);

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);

    if (window.LOG_INSTANCE_DATA) {
      // copy instance data to result buffer and print

      window.LOG_INSTANCE_DATA = false;
      await this.resultBuffer.mapAsync(GPUMapMode.READ);
      const result = new Float32Array(this.resultBuffer.getMappedRange());
      
      logInstanceData(result);

      this.resultBuffer.unmap();
    }
  }

}