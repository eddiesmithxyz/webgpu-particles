import { renderShaders } from "./shaders.ts";
import { createSquareData } from "./square.ts";
import { instanceDataLength } from "../common.ts";

export class WGPURenderer {
  private initialised = false;

  public device: GPUDevice = {} as GPUDevice;
  public ctx: GPUCanvasContext = {} as GPUCanvasContext;
  private renderPipeline: GPURenderPipeline = {} as GPURenderPipeline; 

  private instanceCount = 0;
  private vertexCount = 0;

  private vertexBuffer: GPUBuffer = {} as GPUBuffer;
  public instanceBuffer: GPUBuffer = {} as GPUBuffer;  
  private uniformBuffer: GPUBuffer = {} as GPUBuffer;
  private bindGroup: GPUBindGroup = {} as GPUBindGroup;

  private depthTexture: GPUTexture | null = null;
  private multisampleTexture: GPUTexture | null = null;

  public clearColour = { r: 0.1, g: 0.1, b: 0.1, a: 1 };
  public multisampleCount = 4;
  
  async init(): Promise<boolean> {
    const canvas = document.querySelector("#gpuCanvas") as HTMLCanvasElement;

    if (!navigator.gpu) {
      throw Error("WebGPU not supported.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw Error("Couldn't request WebGPU adapter.");
    }


    this.device = await adapter.requestDevice();
    this.ctx = canvas.getContext("webgpu") as GPUCanvasContext;

    this.ctx.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: "opaque"
    });

    this.initialised = true;
    return true;
  }

  createBuffersAndPipeline(instanceCount: number) {
    const vertData = createSquareData()

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
      } as GPUVertexBufferLayout,

      // INSTANCE
      {
        attributes: [
          { // position
            shaderLocation: 2,
            offset: 0,
            format: "float32x4"
          },
          { // velocity
            shaderLocation: 3,
            offset: 16,
            format: "float32x4"
          },
          { // normal
            shaderLocation: 4,
            offset: 32,
            format: "float32x4"
          },
          { // field dist
            shaderLocation: 5,
            offset: 48,
            format: "float32"
          },
          { // density
            shaderLocation: 6,
            offset: 52,
            format: "float32"
          },
          { // density
            shaderLocation: 7,
            offset: 56,
            format: "uint32"
          },
          { // density
            shaderLocation: 8,
            offset: 60,
            format: "float32"
          }
        ],
        arrayStride: instanceDataLength * 4,
        stepMode: "instance"
      } as GPUVertexBufferLayout,
    ];

    const shaderModule = this.device.createShaderModule({code: renderShaders});
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
        depthCompare: 'less',
        format: 'depth24plus',
      },
      layout: "auto",
      multisample: {
        count: this.multisampleCount,
      },
    });


    // CREATE BUFFERS

    this.vertexBuffer = this.device.createBuffer({
      size: vertData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    this.device.queue.writeBuffer(this.vertexBuffer, 0, vertData as Float32Array<ArrayBuffer>, 0, vertData.length);
    this.instanceBuffer = this.device.createBuffer({
      size: this.instanceCount * 4 * instanceDataLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    
    // UNIFORMS
    const uniformSize =
      16 * 4 +  // view-proj matrix
       1 * 4 +  // aspect ratio
       3 * 4;   // padding (required by webgpu)
    this.uniformBuffer = this.device.createBuffer({
      size: uniformSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    
    this.bindGroup = this.device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer }},
      ],
    });

  }


  render(viewProjectionMatrix: Float32Array) {
    if (!this.initialised) {
      throw ("WebGPU not initialised");
    }


    const canvasTexture = this.ctx.getCurrentTexture();

    const uniformData = new Float32Array([...viewProjectionMatrix, canvasTexture.width / canvasTexture.height])
    this.device.queue.writeBuffer(this.uniformBuffer, 0, uniformData, 0);

    // create depth texture if needed
    if (!this.depthTexture || this.depthTexture.width !== canvasTexture.width || this.depthTexture.height !== canvasTexture.height) {
      this.depthTexture?.destroy();
      this.depthTexture = this.device.createTexture({
        size: canvasTexture,  // canvasTexture has width, height, and depthOrArrayLayers properties
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
        sampleCount: this.multisampleCount,
      });
    }

    // If the multisample texture doesn't exist or
    // is the wrong size then make a new one.
    if (!this.multisampleTexture ||
        this.multisampleTexture.width !== canvasTexture.width ||
        this.multisampleTexture.height !== canvasTexture.height) {
 
      if (this.multisampleTexture) this.multisampleTexture.destroy();
 
      // Create a new multisample texture that matches our
      // canvas's size
      this.multisampleTexture = this.device.createTexture({
        format: canvasTexture.format,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
        size: [canvasTexture.width, canvasTexture.height],
        sampleCount: this.multisampleCount,
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
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
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
}