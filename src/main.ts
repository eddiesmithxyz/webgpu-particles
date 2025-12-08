import {WGPU} from "./wgpu/wrapper.ts"

async function main() {
  const wgpu = new WGPU();

  const success = await wgpu.init()
  if (!success) 
    return;
    

  window.wgpu = wgpu;

  wgpu.render()

}

main()