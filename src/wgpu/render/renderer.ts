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
  private uniformBuffers: { viewProjectionMatrix: GPUBuffer, aspectRatio: GPUBuffer } = {} as { viewProjectionMatrix: GPUBuffer, aspectRatio: GPUBuffer };
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


    this.device = await adapter.requestDevice({
      requiredLimits: {
        maxComputeInvocationsPerWorkgroup: 1024
      }
    });

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
            format: "float32x3"
          },
          { // velocity
            shaderLocation: 3,
            offset: 12,
            format: "float32x3"
          },
          { // last dist
            shaderLocation: 4,
            offset: 24,
            format: "float32"
          },
          
        ],
        arrayStride: instanceDataLength * 4,
        stepMode: "instance"
      } as GPUVertexBufferLayout,
    ];
    const bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "uniform",
          },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "uniform",
          },
        },
      ],
    });
    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    });

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
      layout: pipelineLayout,
      // multisample: {
      //   count: 4,
      // },
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
    this.uniformBuffers.viewProjectionMatrix = this.device.createBuffer({
      size: 16*4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.uniformBuffers.aspectRatio = this.device.createBuffer({
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    

    
    this.bindGroup = this.device.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffers.viewProjectionMatrix }},
        { binding: 1, resource: { buffer: this.uniformBuffers.aspectRatio }},
      ],
    });

  }


  render(viewProjectionMatrix: Float32Array) {
    if (!this.initialised) {
      throw ("WebGPU not initialised");
    }


    const canvasTexture = this.ctx.getCurrentTexture();

    this.device.queue.writeBuffer(this.uniformBuffers.viewProjectionMatrix, 0, viewProjectionMatrix as Float32Array<ArrayBuffer>, 0, 16);
    this.device.queue.writeBuffer(this.uniformBuffers.aspectRatio, 0, new Float32Array([canvasTexture.width / canvasTexture.height]), 0, 1);

    // create depth texture if needed
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