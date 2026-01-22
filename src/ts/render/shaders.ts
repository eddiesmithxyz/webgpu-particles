import { wgslNumStr as str } from "../common"


const particleSize = str(0.9);

export const renderShaders = /* wgsl */`
struct Uniforms {
  viewProjectionMatrix : mat4x4<f32>,
  invVPMatrix : mat4x4<f32>,
  backgroundColour: vec4<f32>,
  camPos: vec3<f32>,
  aspectRatio : f32,
}
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) colour : vec4f,
  @location(1) uv : vec2f,
  @location(2) worldPos: vec3f,
  @location(3) normal: vec3f,
  @location(4) fadeFac: f32,
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
  var position = instance.position;

  // // WARP PARTICLE POSITION
  // const R = 100.0;
  // let theta = position.x / R;
  
  // // base arc point (radius R)
  // let bx = R * sin(theta);
  // let bz = R * (1.0 - cos(theta));

  // // apply radial offset
  // position.x = bx + position.z * sin(theta);
  // position.z = bz + position.z * -cos(theta);


  output.position = uniforms.viewProjectionMatrix * position;

  // SCREEN SPACE SIZE PARTICLES (zoom invariant)
  // const particleSize = 0.003;
  // let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize) * output.position.w;

  // WORLD SPACE SIZE PARTICLES
  const particleSize = ${particleSize};
  let vertPos = vertex.position.xy * vec2f(particleSize / uniforms.aspectRatio, particleSize);
  

  output.position += vec4f(vertPos, 0., 0.);
  output.worldPos = (uniforms.invVPMatrix * output.position).xyz;

  const baseColor1 = vec4f(0.3, 0.7, 0.8, 1.0);
  const baseColor2 = vec4f(0.0, 0.3, 0.8, 1.0);
  output.colour = mix(baseColor1, baseColor2, 0.5*instance.group + 0.5);

  // // SHADE COLLISIONS
  // const densityRange = 0.1; // density scalar will vary for density values in range [1, 1+densityRange]
  // let densityScalar = saturate((instance.density - 1.1)/densityRange); // 0 for no collisions, 1 for big collision
  // var colour = (1.0-densityScalar) * baseColor1 + densityScalar * baseColor2;


  // FADE PARTICLES IN AT THE START
  const startFadeY = 40;
  const endFadeY = 20;
  output.fadeFac = saturate((abs(instance.position.y)-startFadeY)/(endFadeY-startFadeY));


  output.uv = vertex.uv;
  output.normal = instance.normal.xyz; // could use improvement so normal is not constant across all fragments

  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
  let uvLength = length(fragData.uv - vec2f(0.5, 0.5)) * 2.0;
  if (uvLength > 1.0) {
    discard;
  } 
  // smooth circle edge (need to switch on alpha blending)
  // const falloff = 5.0;
  // let alpha = clamp(falloff * (1.0 - uvLength), 0.0, 1.0);
  // return vec4f(fragData.colour.rgb * alpha, fragData.colour.a * alpha);


  const lightDir = normalize(vec3<f32>(0.1, 0.8, 1.0));

  // DIFFUSE SHADING
  const diffuseStrength = 0.5;
  let diffuseIntensity = diffuseStrength * dot(lightDir, fragData.normal) + 0.9 - diffuseStrength; 

  // SPECULAR SHADING
  let viewDir = normalize(uniforms.camPos - fragData.worldPos);
  
  const specularColour = vec4<f32>(1.0);
  const specularExponent = 50.0;
  let halfDir = normalize(normalize(lightDir) + viewDir);
  let specularIntensity = 0.3*pow(max(dot(fragData.normal, halfDir), 0.0), specularExponent);




  
  var colour = saturate(diffuseIntensity*fragData.colour + specularIntensity*specularColour);


  
  colour = mix(uniforms.backgroundColour, colour, fragData.fadeFac);

  return colour;
}

`;
