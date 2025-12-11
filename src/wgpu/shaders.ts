const shaders = /* wgsl */`
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) colour : vec4f
}

struct VertexInput {
  @location(0) position : vec3f,
  @location(1) normal : vec3f
}

struct InstanceInput {
  @location(2) modelMat0 : vec4f,
  @location(3) modelMat1 : vec4f,
  @location(4) modelMat2 : vec4f,
  @location(5) modelMat3 : vec4f
}

@group(0) @binding(0) var<uniform> viewProjectionMatrix : mat4x4<f32>;

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

  output.position = modelViewProjectionMatrix * vec4f(vertex.position, 1.0);

  const lightDir = normalize(vec3f(0.5, 1.0, 0.75));
  let lightIntensity = 0.3 * dot(normalize(vertex.normal), lightDir) + 0.5;

  output.colour = vec4f(0.4 * lightIntensity, 0.6 * lightIntensity, 0.8 * lightIntensity, 1.0);

  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
  return fragData.colour;
}

`;


export { shaders };