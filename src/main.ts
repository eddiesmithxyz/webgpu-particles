import {WGPURenderer} from "./wgpu/render/renderer.ts"
import { WGPUComputer } from "./wgpu/compute/computer.ts"
import { Scene } from "./scene/scene.ts";
import { mat4 } from "wgpu-matrix";
import { sideLength, logInstanceData } from "./wgpu/common.ts";

const scene = new Scene();

let lastTime = Date.now();
let frameCount = 0;
let frameTimeSum = 0;
function render(renderer: WGPURenderer, computer: WGPUComputer) {
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  frameCount++;
  frameTimeSum += deltaTime;
  if (window.LOG_FPS && frameCount % 100 == 0) {
    console.log("FPS ", 1 / (frameTimeSum / 100))
    frameTimeSum = 0;
  }
  


  scene.update();

  const projMatrix = mat4.perspective(
    2.0,
    renderer.ctx.canvas.width / renderer.ctx.canvas.height,
    0.1,
    1000.0
  );

  computer.run(deltaTime);
  renderer.render(mat4.multiply(projMatrix, scene.viewMatrix));
  requestAnimationFrame(() => render(renderer, computer));
}


async function main() {
  const renderer = new WGPURenderer();
  const success = await renderer.init()
  if (!success) 
    return;

  const { instanceCount, instanceData } = scene.createInitialInstanceData(sideLength);
  renderer.createBuffersAndPipeline(instanceCount);
  const computer = new WGPUComputer(renderer.device, instanceCount, instanceData, renderer.instanceBuffer);

  

  lastTime = Date.now();
  requestAnimationFrame(() => render(renderer, computer));
}

main()