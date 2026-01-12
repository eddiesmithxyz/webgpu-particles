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
}
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

@group(0) @binding(3) var<storage, read_write> particleIds: array<u32>;
@group(0) @binding(4) var<storage, read_write> cellOffsets: array<u32>;

`;