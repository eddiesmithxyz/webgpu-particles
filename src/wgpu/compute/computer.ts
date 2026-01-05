import { particleUpdateShaderSrc } from "./shader/particleUpdate";
import { instanceDataLength, logInstanceData, sideLength } from "../common";

export class WGPUComputer {
  private device: GPUDevice;


  private pipeline: GPUComputePipeline;
  private bindGroup: GPUBindGroup;

  private instanceCount: number;
  private instanceDataBuffer: GPUBuffer;
  private renderInstanceBuffer: GPUBuffer;
  private resultBuffer: GPUBuffer;


  constructor(device: GPUDevice, instanceCount: number, initialInstanceData: Float32Array<ArrayBuffer>, renderInstanceBuffer: GPUBuffer) {
    this.device = device;
    this.instanceCount = instanceCount;
    this.renderInstanceBuffer = renderInstanceBuffer;

    const module = this.device.createShaderModule({
      label: "particle update",
      code: particleUpdateShaderSrc
    });
    
    this.pipeline = device.createComputePipeline({
      label: "particle update pipeline",
      layout: "auto",
      compute: {
        module
      }
    });

    
    this.instanceDataBuffer = device.createBuffer({
      size: instanceCount * 4 * instanceDataLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
    });
    device.queue.writeBuffer(this.instanceDataBuffer, 0, initialInstanceData)

    this.resultBuffer = device.createBuffer({
      size: this.instanceDataBuffer.size,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
    });
    

    // add bindings for buffers to be used in the compute pipeline
    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.instanceDataBuffer }},
      ],
    })
  }

  async run() {
    
    // create compute commands
    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginComputePass();
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.dispatchWorkgroups(sideLength, 1, 1);
    pass.end();
    encoder.copyBufferToBuffer(this.instanceDataBuffer, 0, this.renderInstanceBuffer, 0);
    encoder.copyBufferToBuffer(this.instanceDataBuffer, 0, this.resultBuffer, 0);

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);

    if (window.BIGLOG) {
      // copy instance data to result buffer and print

      window.BIGLOG = false;
      await this.resultBuffer.mapAsync(GPUMapMode.READ);
      const result = new Float32Array(this.resultBuffer.getMappedRange());
      
      logInstanceData(result);

      this.resultBuffer.unmap();
    }
  }

}