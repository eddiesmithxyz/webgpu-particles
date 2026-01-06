import { updateTemplate } from "./updateTemplate"

// compute pressure and viscosity forces

const update1body = /* wgsl */`

var position = particle.position.xyz;
var velocity = particle.velocity.xyz;

var acceleration = vec3<f32>(0.0, -9.0, 0.0);

const bound = 10.0;
const yBound = 10.0;
if (position.x >  bound) { position.x =  bound; velocity.x *= -1.0; }
if (position.x < -bound) { position.x = -bound; velocity.x *= -1.0; }
if (position.z >  bound) { position.z =  bound; velocity.z *= -1.0; }
if (position.z < -bound) { position.z = -bound; velocity.z *= -1.0; }
if (position.y >  bound) { position.y =  bound; velocity.y *= -1.0; }
if (position.y < -yBound) { position.y = -yBound; velocity.y *=  0.0; acceleration.y = 0.0; }


let fluidF = fluidForce(particle, id); 
acceleration += fluidF / particleFluidMass;

velocity += acceleration * accelDeltaTime;
position += velocity * uniforms.deltaTime;




particles[id].position = vec4<f32>(position.xyz, 1.0);
particles[id].velocity = vec4<f32>(velocity.xyz, 1.0);


`;
export const update2Src = updateTemplate(update1body);