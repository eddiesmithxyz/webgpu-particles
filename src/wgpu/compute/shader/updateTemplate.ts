import { instanceDataLength, sideLength } from "../../common"
import { sdfSrc } from "./sdf"
import { sphSrc } from "./sph"
export const updateTemplate = (body: string) => /* wgsl */`


const accelDeltaTime = 0.016; // hardcoded deltaTime for acceleration calculation to prevent explosion

struct Particle {
  position: vec4<f32>, // xyz used
  velocity: vec4<f32>, // xyz used
  lastDist: f32,
  density: f32,
  pressure: f32,
  _pad: f32,
}
@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;

struct Uniforms {
  deltaTime: f32
}
@group(0) @binding(1) var<uniform> uniforms: Uniforms;


${sdfSrc}

${sphSrc}


@compute @workgroup_size(1, ${sideLength}, ${sideLength}) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
) {
  let id = workgroup_id.x * ${sideLength * sideLength} + local_invocation_id.y * ${sideLength} + local_invocation_id.z;
  let particle = particles[id];

  // let fieldDist = sdf(position);
  // let acceleration = gravityAccel(position, fieldDist, particle.lastDist);
  // particles[id].lastDist = fieldDist;

  ${body}
}

`;





// print linked shader
const numbered = (src: string) => src
  .split('\n')  
  .map((line, i) => `${line} ${i + 1}`)
  .join('\n');  

// console.log(numbered);