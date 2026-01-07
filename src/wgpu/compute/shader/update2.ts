import { updateTemplate } from "./updateTemplate"

// compute pressure and viscosity forces

const update1body = /* wgsl */`

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
position += velocity * accelDeltaTime;




particles[id].position = vec4<f32>(position.xyz, 1.0);
particles[id].velocity = vec4<f32>(velocity.xyz, 1.0);


`;
export const update2Src = updateTemplate(update1body);