export const renderShaders = /* wgsl */`
struct Uniforms {
  viewProjectionMatrix : mat4x4<f32>,
  backgroundColour: vec4<f32>,
  aspectRatio : f32,
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
  @location(4) normal : vec4f,
  @location(5) dist : f32,
  @location(6) density : f32,
  @location(7) cellIndex: u32,
  @location(8) group: f32
}


@vertex
fn vertex_main(
  vertex: VertexInput,
  instance: InstanceInput
) -> VertexOut {
  var output : VertexOut;

  // WARP PARTICLE POSITION
  const R = 100.0;
  var position = instance.position;
  let theta = position.x / R;
  
  // base arc point (radius R)
  let bx = R * sin(theta);
  let bz = R * (1.0 - cos(theta));

  // apply radial offset
  // position.x = bx + position.z * sin(theta);
  // position.z = bz + position.z * -cos(theta);

  output.position = uniforms.viewProjectionMatrix * position;

  let vp = uniforms.viewProjectionMatrix;
  let eye = vec3<f32>(vp[0][3], vp[1][3], vp[2][3]); // not sure if this is right
  let viewDir = normalize(instance.position.xyz - eye); 

  // SCREEN SPACE SIZE PARTICLES (zoom invariant)
  // const particleSize = 0.003;
  // let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize) * output.position.w;

  // WORLD SPACE SIZE PARTICLES
  const particleSize = 0.5;
  let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize);
  

  output.position += vec4f(vertPos, 0., 0.);

  const baseColor1 = vec4f(0.3, 0.7, 0.8, 1.0);
  const baseColor2 = vec4f(0.0, 0.3, 0.8, 1.0);
  let baseColour = mix(baseColor1, baseColor2, 0.5*instance.group + 0.5);

  // // SHADE COLLISIONS
  // const densityRange = 0.1; // density scalar will vary for density values in range [1, 1+densityRange]
  // let densityScalar = saturate((instance.density - 1.1)/densityRange); // 0 for no collisions, 1 for big collision
  // var colour = (1.0-densityScalar) * baseColor1 + densityScalar * baseColor2;


  // DIFFUSE SHADING
  const lightDir = normalize(vec3<f32>(0.0, 0.5, 1.0));
  const diffuseStrength = 0.6;
  let diffuseIntensity = diffuseStrength * dot(lightDir, instance.normal.xyz) + 1.0 - diffuseStrength;
 
  // SPECULAR SHADING 
  // const specularColour = vec4<f32>(1.0);
  // const specularExponent = 7.0;
  // let specularIntensity = 0.7 * pow(max(dot(instance.normal.xyz, viewDir), 0), specularExponent);

  var colour = saturate(diffuseIntensity*baseColour);// + specularIntensity*specularColour);


  // FADE PARTICLES IN AT THE START
  const startFadeY = 40;
  const endFadeY = 20;
  let fadeFac = saturate((abs(instance.position.y)-startFadeY)/(endFadeY-startFadeY));
  colour = mix(uniforms.backgroundColour, colour, fadeFac);


  output.colour = colour;
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
