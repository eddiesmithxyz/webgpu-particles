const shaders = /* wgsl */`
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
  @location(2) modelMat0 : vec4f,
  @location(3) modelMat1 : vec4f,
  @location(4) modelMat2 : vec4f,
  @location(5) modelMat3 : vec4f,
  @location(6) instanceID : f32
}

@group(0) @binding(0) var<uniform> viewProjectionMatrix : mat4x4<f32>;
@group(0) @binding(1) var<uniform> aspectRatio : f32;

@vertex
fn vertex_main(
  vertex: VertexInput,
  instance: InstanceInput
) -> VertexOut {
  let modelMatrix = mat4x4<f32>(
    instance.modelMat0,
    instance.modelMat1,
    instance.modelMat2,
    instance.modelMat3,
  );
  let modelViewProjectionMatrix = viewProjectionMatrix * modelMatrix;

  var output : VertexOut;

  const particleSize = 0.005;

  output.position = modelViewProjectionMatrix * vec4f(0., 0., 0., 1.);
  let vertPos = vertex.position.xy * vec2f(particleSize / aspectRatio, particleSize) * output.position.w;
  output.position += vec4f(vertPos, 0., 0.);

  // var baseColor = vec4f(0.4, 0.6, 0.8, 1.0);
  var baseColor = vec4f(0.8, 0.8, 0.8, 1.0);

  // const highlightID = 54.0;
  // if (instance.instanceID < highlightID + 0.5 && instance.instanceID >= highlightID - 0.5) { baseColor = vec4f(0.8, 0.6, 0.4, 1.0); }
  
  output.colour = baseColor;
  output.uv = vertex.uv;

  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
  // circle 
  // const falloff = 5.0;
  // let uvLength = length(fragData.uv - vec2f(0.5, 0.5)) * 2.0;
  // let alpha = clamp(falloff * (1.0 - uvLength), 0.0, 1.0);
  // return vec4f(fragData.colour.rgb * alpha, fragData.colour.a * alpha);

  return fragData.colour;
}

`;


export { shaders };