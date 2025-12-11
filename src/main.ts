import {WGPU} from "./wgpu/wgpu.ts"
import { createCubeData } from "./wgpu/cube.ts";




async function main() {
  const wgpu = new WGPU();

  const success = await wgpu.init()
  if (!success) 
    return;
    

  window.wgpu = wgpu;

  
  const cubeData = createCubeData();
  wgpu.createBuffersAndPipeline(cubeData);

  function render() {
    //wgpu.update();

    wgpu.render();
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

main()