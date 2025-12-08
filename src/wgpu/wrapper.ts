import { shaders } from "./shaders.ts";

export class WGPU {
  private device: GPUDevice = {} as GPUDevice;
  private ctx: GPUCanvasContext = {} as GPUCanvasContext;
  private renderPipeline: GPURenderPipeline = {} as GPURenderPipeline; 
  private commandEncoder: GPUCommandEncoder = {} as GPUCommandEncoder;

  
  async init(): Promise<boolean> {
    if (!navigator.gpu) {
      throw Error("WebGPU not supported.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw Error("Couldn't request WebGPU adapter.");
    }


    this.device = await adapter.requestDevice();

    const shaderModule = this.device.createShaderModule({
      code: shaders
    })

    const canvas = document.querySelector("#gpuCanvas") as HTMLCanvasElement;
    this.ctx = canvas.getContext("webgpu") as GPUCanvasContext;

    this.ctx.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat(),
      alphaMode: "opaque"
    });


    const vertBufferLayouts = [
      {
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: "float32x4"
          },
          {
            shaderLocation: 1,
            offset: 16,
            format: "float32x4"
          }
        ],
        arrayStride: 32,
        stepMode: "vertex"
      } as GPUVertexBufferLayout
    ];

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
        topology: "triangle-list"
      },
      layout: "auto"
    });

    this.commandEncoder = this.device.createCommandEncoder();

    return true;
  }


  render() {
    const verts = new Float32Array([
      0.0, 0.6, 0, 1, 
      1, 0, 0, 1, 
      
      -0.5, -0.6, 0, 1, 
      0, 1, 0, 1, 1, 
      
      -0.6, 0, 1, 
      0, 0, 1, 1,
    ]);

    const vertexBuffer = this.device.createBuffer({
      size: verts.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    });

    this.device.queue.writeBuffer(vertexBuffer, 0, verts, 0, verts.length);



    const passEncoder = this.commandEncoder.beginRenderPass({
      colorAttachments: [
      {
        clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
        loadOp: "clear",
        storeOp: "store",
        view: this.ctx.getCurrentTexture().createView()
      }
      ]
    });

    passEncoder.setPipeline(this.renderPipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(3);

    passEncoder.end();
    this.device.queue.submit([this.commandEncoder.finish()]);
  }
}