import {WGPU} from "./wgpu/wgpu.ts"
import { createCubeData } from "./wgpu/cube.ts";
import { Scene } from "./scene/scene.ts";
import { mat4 } from "wgpu-matrix";


const scene = new Scene();

let lastTime = Date.now();

function render(wgpu: WGPU) {
  const currentTime = Date.now();
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  scene.update(deltaTime);

  const projMatrix = mat4.perspective(
    2.0,
    wgpu.ctx.canvas.width / wgpu.ctx.canvas.height,
    0.1,
    100.0
  );
  wgpu.render(scene.instanceMatrices, mat4.multiply(projMatrix, scene.viewMatrix));

  requestAnimationFrame(() => render(wgpu));
}


async function main() {
  const wgpu = new WGPU();

  const success = await wgpu.init()
  if (!success) 
    return;
    

  window.wgpu = wgpu; // debug

  
  const cubeData = createCubeData();
  wgpu.createBuffersAndPipeline(cubeData, scene.instanceCount);

  lastTime = Date.now();
  requestAnimationFrame(() => render(wgpu));
}

main()