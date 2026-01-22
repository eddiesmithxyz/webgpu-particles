import { shaderInputLayoutSrc, mainFunc, getID } from "./shaderLayout";
import { gridAccessFuncs } from "./grid/gridAccess";
import { sdfSrc } from "./physics/sdf/sdf";
import { sphSrc } from "./physics/sph";


// compute pressure and viscosity forces

export const update2Src = /* wgsl */`

${shaderInputLayoutSrc}
${gridAccessFuncs}
${sphSrc}
${sdfSrc}

const accelDeltaTime = 0.01; // hardcoded deltaTime for acceleration calculation to prevent explosion
const velocityClamp = 100.0;


${mainFunc} {
  let id = ${getID};
  let particle = particles0[id];

  var position = particle.position.xyz;
  var velocity = particle.velocity.xyz;


  
  // fluid force
  var acceleration = fluidAccel(particle, id);
  
  // field gravity
  let fieldDist = sdf(position);
  let fieldNormal = sdfNormal(position);
  acceleration += gravityAccel(position, fieldDist, fieldNormal, particle.lastDist);

  // group move to top/bottom
  acceleration += vec3<f32>(0.0, -3.0*particle.group, 0.0);
  
  // apply forces
  velocity += acceleration * accelDeltaTime;
  velocity = atan(velocity / velocityClamp) * velocityClamp ;

  position += velocity * uniforms.deltaTime * uniforms.animSpeed;

  
  
  // particle normal (shading only) - move towards field normal
  const lerpSpeed = 0.1;
  let normal = normalize(lerpSpeed*fieldNormal + (1.0-lerpSpeed)*particle.normal.xyz);


  
  particles1[id] = Particle(
    vec4<f32>(position, 1.0),
    vec4<f32>(velocity, 1.0),
    vec4<f32>(normal, 1.0),
    fieldDist,
    particle.density,
    particle.cellIndex, // not really necessary
    particle.group,
    particle.groupCentroid
  );

}
`;