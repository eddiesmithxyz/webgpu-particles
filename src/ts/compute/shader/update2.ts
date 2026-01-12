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


${mainFunc} {
  let id = ${getID};
  let particle = particles[id];

  var position = particle.position.xyz;
  var velocity = particle.velocity.xyz;



  let fieldDist = sdf(position);
  var acceleration = gravityAccel(position, fieldDist, particle.lastDist);
  particles[id].lastDist = fieldDist;


  // const bound = 4.0;
  // const yBound = 4.0;
  // if (position.x >  bound) { position.x =  bound; velocity.x *= -1.0; }
  // if (position.x < -bound) { position.x = -bound; velocity.x *= -1.0; }
  // if (position.z >  bound) { position.z =  bound; velocity.z *= -1.0; }
  // if (position.z < -bound) { position.z = -bound; velocity.z *= -1.0; }
  // if (position.y >  bound) { position.y =  bound; velocity.y *= -1.0; }
  // if (position.y < -yBound) { position.y = -yBound; velocity.y *= -0.2; acceleration.y = 0.0; }


  acceleration += fluidAccel(particle, id);

  velocity += acceleration * accelDeltaTime;
  position += velocity * uniforms.deltaTime * uniforms.animSpeed;




  particles[id].position = vec4<f32>(position.xyz, 1.0);
  particles[id].velocity = vec4<f32>(velocity.xyz, 1.0);

  // particles[id].position = vec4<f32>(-21.3, -84.1, -0.1, 1.0);
}
`;