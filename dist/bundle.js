new EventSource('/esbuild').addEventListener('change', () => location.reload());
"use strict";
(() => {
  // src/wgpu/shaders.ts
  var shaders = (
    /* wgsl */
    `
struct VertexOut {
    @builtin(position) position : vec4f,
    @location(0) colour : vec4f
}

@vertex
fn vertex_main(@location(0) position : vec4f, @location(1) colour : vec4f) -> VertexOut {
    var output : VertexOut;
    output.position = vec4<f32>(position.x * 0.8, position.y * 0.8, position.z, position.w);
    output.colour = colour;
    return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
    return fragData.colour;
}

`
  );

  // src/wgpu/wrapper.ts
  var WGPU = class {
    device = {};
    ctx = {};
    renderPipeline = {};
    commandEncoder = {};
    async init() {
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
      });
      const canvas = document.querySelector("#gpuCanvas");
      this.ctx = canvas.getContext("webgpu");
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
        }
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
        0,
        0.6,
        0,
        1,
        1,
        0,
        0,
        1,
        -0.5,
        -0.6,
        0,
        1,
        0,
        1,
        0,
        1,
        1,
        -0.6,
        0,
        1,
        0,
        0,
        1,
        1
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
  };

  // src/main.ts
  async function main() {
    const wgpu = new WGPU();
    const success = await wgpu.init();
    if (!success)
      return;
    window.wgpu = wgpu;
    wgpu.render();
  }
  main();
})();
//# sourceMappingURL=bundle.js.map
