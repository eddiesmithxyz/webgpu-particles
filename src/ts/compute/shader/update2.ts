import { shaderInputLayoutSrc, mainFunc, getID } from "./shaderLayout";
import { gridAccessFuncs } from "./grid/gridAccess";
import { sdfSrc } from "./physics/sdf";
import { sphSrc } from "./physics/sph";


// compute pressure and viscosity forces

export const update2Src = /* wgsl */`

${shaderInputLayoutSrc}
${gridAccessFuncs}
${sphSrc}
${sdfSrc}

const accelDeltaTime = 0.01; // hardcoded deltaTime for acceleration calculation to prevent explosion
const velocityClamp = 50.0;


${mainFunc} {
  let id = ${getID};
  let particle = particles[id];

  var position = particle.position.xyz;
  var velocity = particle.velocity.xyz;


  
  // fluid force
  var acceleration = fluidAccel(particle, id);
  
  // field gravity
  let fieldDist = sdf(position);
  let fieldNormal = sdfNormal(position);
  acceleration += gravityAccel(position, fieldDist, fieldNormal, particle.lastDist);
  
  // apply forces
  velocity += acceleration * accelDeltaTime;
  velocity = atan(velocity / velocityClamp) * velocityClamp ;

  position += velocity * uniforms.deltaTime * uniforms.animSpeed;




  
  particles[id].lastDist = fieldDist;



  particles[id].position = vec4<f32>(position.xyz, 1.0);
  particles[id].velocity = vec4<f32>(velocity.xyz, 1.0);
  
  // particle normal (shading only) - move towards field normal
  const lerpSpeed = 0.1;
  let newNormal = normalize(lerpSpeed*fieldNormal + (1.0-lerpSpeed)*particle.normal.xyz);
  particles[id].normal = vec4<f32>(newNormal, 1.0);

}
`;