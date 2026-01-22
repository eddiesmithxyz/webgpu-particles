import {WGPURenderer} from "./ts/render/renderer.ts"
import { WGPUComputer } from "./ts/compute/computer.ts"
import { Scene } from "./ts/scene.ts";
import { mat4 } from "wgpu-matrix";
import { workgroupSize } from "./ts/common.ts";


const particleCount = 1600 * workgroupSize; // must be multiple of workgroupSize
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
  


  scene.update(renderer.ctx.canvas as HTMLCanvasElement);

  computer.run(Math.min(deltaTime, 0.1), scene.mouseIntersection, scene.lastMouseIntersection);
  renderer.render(scene.viewProjectionMatrix, scene.camPos);
  requestAnimationFrame(() => render(renderer, computer));
}


async function main() {
  const renderer = new WGPURenderer();
  const success = await renderer.init()
  if (!success) 
    return;


  // resize oberserver
  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      const width = entry.contentBoxSize[0].inlineSize;
      const height = entry.contentBoxSize[0].blockSize;
      const canvas = entry.target as HTMLCanvasElement;
      canvas.width = Math.max(1, Math.min(width, renderer.device.limits.maxTextureDimension2D));
      canvas.height = Math.max(1, Math.min(height, renderer.device.limits.maxTextureDimension2D));
    }
  });
  observer.observe(renderer.canvas);


  const particleData = scene.createInitialParticleData(particleCount);
  renderer.createBuffersAndPipeline(particleCount);
  const computer = new WGPUComputer(renderer.device, particleCount, particleData, renderer.instanceBuffer);

  

  lastTime = Date.now();
  requestAnimationFrame(() => render(renderer, computer));
}

main()