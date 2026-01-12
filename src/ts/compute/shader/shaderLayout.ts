export const particleStruct = /* wgsl */`
struct Particle {
  position: vec4<f32>, // xyz used
  velocity: vec4<f32>, // xyz used
  lastDist: f32,
  density: f32,
  cellIndex: u32,
  _pad: u32,
}
`;


export const shaderInputLayoutSrc = /* wgsl */`
${particleStruct}
@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;

struct Uniforms {
  deltaTime: f32,
  animSpeed: f32,
  particleCount: u32,
}
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

@group(0) @binding(3) var<storage, read_write> particleIds: array<u32>;
@group(0) @binding(4) var<storage, read_write> cellOffsets: array<u32>;

`;


import { workgroupSize } from "../../common";

// main function dispatch size/id gen for shaders iterating over each particle once
export const mainFunc = /* wgsl */`
@compute @workgroup_size(${workgroupSize}, 1, 1) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
)
`;

export const getID = /* wgsl */`workgroup_id.x * ${workgroupSize} + local_invocation_id.x`;