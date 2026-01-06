export const renderShaders = /* wgsl */`
struct Uniforms {
  viewProjectionMatrix : mat4x4<f32>,
  aspectRatio : f32
}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) colour : vec4f,
  @location(1) uv : vec2f
}

struct VertexInput {
  @location(0) position : vec3f,
  @location(1) uv : vec2f
}

struct InstanceInput {
  @location(2) position : vec4f,
  @location(3) velocity : vec4f,
  @location(4) lastDist : vec4f
}


@vertex
fn vertex_main(
  vertex: VertexInput,
  instance: InstanceInput
) -> VertexOut {
  var output : VertexOut;

  const particleSize = 0.005;

  output.position = uniforms.viewProjectionMatrix * instance.position;
  let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize) * output.position.w;
  output.position += vec4f(vertPos, 0., 0.);

  var baseColor = vec4f(0.8, 0.8, 0.8, 1.0);
  
  output.colour = baseColor;
  output.uv = vertex.uv;

  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
  // circle (need to switch on alpha blending)
  // const falloff = 5.0;
  // let uvLength = length(fragData.uv - vec2f(0.5, 0.5)) * 2.0;
  // let alpha = clamp(falloff * (1.0 - uvLength), 0.0, 1.0);
  // return vec4f(fragData.colour.rgb * alpha, fragData.colour.a * alpha);

  return fragData.colour;
}

`;
