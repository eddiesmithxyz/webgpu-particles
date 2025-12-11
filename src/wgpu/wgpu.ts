import { shaders } from "./shaders.ts";

export class WGPU {
  private initialised = false;

  private device: GPUDevice = {} as GPUDevice;
  public ctx: GPUCanvasContext = {} as GPUCanvasContext;
  private renderPipeline: GPURenderPipeline = {} as GPURenderPipeline; 


  private instanceCount = 0;
  private vertexCount = 0;

  private vertexBuffer: GPUBuffer = {} as GPUBuffer;
  private instanceBuffer: GPUBuffer = {} as GPUBuffer;  
  private uniformBuffer: GPUBuffer = {} as GPUBuffer;
  private bindGroup: GPUBindGroup = {} as GPUBindGroup;

  private depthTexture: GPUTexture | null = null;

  public clearColour = { r: 0.1, g: 0.1, b: 0.1, a: 1 };
  
  async init(): Promise<boolean> {
    if (!navigator.gpu) {
      throw Error("WebGPU not supported.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw Error("Couldn't request WebGPU adapter.");
    }


    this.device = await adapter.requestDevice();

    const canvas = document.querySelector("#gpuCanvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("webgpu") as GPUCanvasContext;

    this.ctx.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: "opaque"
    });

    this.initialised = true;
    return true;
  }

  createBuffersAndPipeline(cubeData: Float32Array, instanceCount: number) {
    this.vertexCount = cubeData.length / 6;
    this.instanceCount = instanceCount;

    const vertBufferLayouts = [
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
            format: "float32x3"
          }
        ],
        arrayStride: 24,
        stepMode: "vertex"
      } as GPUVertexBufferLayout,

      {
        attributes: [
          {
            shaderLocation: 2,
            offset: 0,
            format: "float32x4"
          },
          {
            shaderLocation: 3,
            offset: 16,
            format: "float32x4"
          },
          {
            shaderLocation: 4,
            offset: 32,
            format: "float32x4"
          },
          {
            shaderLocation: 5,
            offset: 48,
            format: "float32x4"
          }
        ],
        arrayStride: 64,
        stepMode: "instance"
      } as GPUVertexBufferLayout,
    ];

    const shaderModule = this.device.createShaderModule({code: shaders});
    this.renderPipeline = this.device.createRenderPipeline({
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_main",
        buffers: vertBufferLayouts
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_main",
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }]
      },
      primitive: {
        topology: "triangle-list",
        frontFace: "ccw",
        cullMode: "back"
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
      layout: "auto"
    });


    // CREATE BUFFERS

    this.vertexBuffer = this.device.createBuffer({
      size: cubeData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });
    this.device.queue.writeBuffer(this.vertexBuffer, 0, cubeData as Float32Array<ArrayBuffer>, 0, cubeData.length);


    this.instanceBuffer = this.device.createBuffer({
      size: this.instanceCount * 64,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    
    // UNIFORMS
    this.uniformBuffer = this.device.createBuffer({
      size: 16*4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    
    this.bindGroup = this.device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer }},
      ],
    });

  }


  render(instanceMatrices: Float32Array, viewProjectionMatrix: Float32Array) {
    if (!this.initialised) {
      throw ("WebGPU not initialised");
    }

    
    this.device.queue.writeBuffer(this.instanceBuffer, 0, instanceMatrices as Float32Array<ArrayBuffer>, 0, this.instanceCount * 16);
    this.device.queue.writeBuffer(this.uniformBuffer, 0, viewProjectionMatrix as Float32Array<ArrayBuffer>, 0, 16);
    

    // create depth texture if needed
    const canvasTexture = this.ctx.getCurrentTexture();
    if (!this.depthTexture || this.depthTexture.width !== canvasTexture.width || this.depthTexture.height !== canvasTexture.height) {
      this.depthTexture?.destroy();
      this.depthTexture = this.device.createTexture({
        size: canvasTexture,  // canvasTexture has width, height, and depthOrArrayLayers properties
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });
    }


    const commandEncoder = this.device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          clearValue: this.clearColour,
          loadOp: "clear",
          storeOp: "store",
          view: canvasTexture.createView()
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