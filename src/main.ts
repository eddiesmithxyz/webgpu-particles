import {WGPU} from "./wgpu/wgpu.ts"
import { createSquareData } from "./wgpu/square.ts";
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
    1000.0
  );
  wgpu.render(scene.instanceData, mat4.multiply(projMatrix, scene.viewMatrix));

  requestAnimationFrame(() => render(wgpu));
}


async function main() {
  const wgpu = new WGPU();

  const success = await wgpu.init()
  if (!success) 
    return;
    

  (window as any).wgpu = wgpu; // debug


  const vertData = createSquareData();
  wgpu.createBuffersAndPipeline(vertData, scene.instanceCount);

  lastTime = Date.now();
  requestAnimationFrame(() => render(wgpu));
}

main()