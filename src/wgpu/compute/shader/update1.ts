import { updateTemplate } from "./updateTemplate"

// compute densities


const update1body = /* wgsl */`

var position = particle.position.xyz;

let density = particleDensity(position);
particles[id].density = density;

`;
export const update1Src = updateTemplate(update1body);