import { shaders } from "./shaders.js";

async function init() {
  if (!navigator.gpu) {
    throw Error("WebGPU not supported.");
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw Error("Couldn't request WebGPU adapter.");
  }


  const device = await adapter.requestDevice();

  const shaderModule = device.createShaderModule({
    code: shaders
  })

  const canvas = document.querySelector("#gpuCanvas");
  const ctx = canvas.getContext("webgpu");

  ctx.configure({
    device: device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: "opaque"
  });

  const verts = new Float32Array([
      0.0, 0.6, 0, 1, 
      1, 0, 0, 1, 
      
      -0.5, -0.6, 0, 1, 
      0, 1, 0, 1, 1, 
      
      -0.6, 0, 1, 
      0, 0, 1, 1,
  ]);

  const vertexBuffer = device.createBuffer({
    size: verts.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
  });

  device.queue.writeBuffer(vertexBuffer, 0, verts, 0, verts.length);


  const vertBufferDescriptors = [
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
    }
  ];

  const renderPipeline = device.createRenderPipeline({
    vertex: {
        module: shaderModule,
        entryPoint: "vertex_main",
        buffers: vertBufferDescriptors
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

  

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        clearValue: { r: 0, g: 0.5, b: 1, a: 1 },
        loadOp: "clear",
        storeOp: "store",
        view: ctx.getCurrentTexture().createView()
      }
    ]
  });

  passEncoder.setPipeline(renderPipeline);
  passEncoder.setVertexBuffer(0, vertexBuffer);
  passEncoder.draw(3);

  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);

}



init();
