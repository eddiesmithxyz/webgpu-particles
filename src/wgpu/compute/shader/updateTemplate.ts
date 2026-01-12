import { instanceDataLength, sideLength } from "../../common"
import { shaderInputLayoutSrc } from "./inputLayout";
import { sdfSrc } from "./physics/sdf"
import { sphSrc } from "./physics/sph"
import { gridAccessFuncs } from "./grid/gridAccess";
export const updateTemplate = (body: string) => /* wgsl */`


const accelDeltaTime = 0.01; // hardcoded deltaTime for acceleration calculation to prevent explosion

${shaderInputLayoutSrc}

${gridAccessFuncs}


${sdfSrc}

${sphSrc}




@compute @workgroup_size(1, ${sideLength}, ${sideLength}) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
) {
  let id = workgroup_id.x * ${sideLength * sideLength} + local_invocation_id.y * ${sideLength} + local_invocation_id.z;
  let particle = particles[id];

  ${body}
}

`;





// print linked shader
export const numberedShaderLog = (src: string) => console.log(src
  .split('\n')  
  .map((line, i) => `${line} ${i + 1}`)
  .join('\n'));  
