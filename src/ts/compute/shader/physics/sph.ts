// https://wickedengine.net/2018/05/scalabe-gpu-fluid-simulation/comment-page-1/

import { wgslNumStr as str } from "../../../common.ts";
import { smoothingRadius, iterateNeighbours } from "../grid/gridAccess.ts";


// PARAMETERS

// fraction of h that is used when finding density
// means viscosity is influenced by further neighbours than pressure
// should be <= 1
const densityNeighbourFraction = 0.8;

const pressureConstant = 250;
const referenceDensity = 1;

const viscosityConstant = 0.118;

const particleMass = 1;



// INTERNAL PARAMS
const poly6const = str(315 / (64 * Math.PI * Math.pow(smoothingRadius, 9)));
const spikyConst = str(-45 / (Math.PI * Math.pow(smoothingRadius, 6)));
const viscConst = str(45 / (Math.PI * Math.pow(smoothingRadius, 6)));

// ------ SHADER ------
export const sphSrc = /* wgsl */`

const h = ${str(smoothingRadius)};
const h2 = ${str(Math.pow(smoothingRadius, 2))};
const h3 = ${str(Math.pow(smoothingRadius, 3))};

const densityH = ${str(smoothingRadius * densityNeighbourFraction)};
const densityH2 = ${str(Math.pow(smoothingRadius * densityNeighbourFraction, 2))};

const particleFluidMass = ${str(particleMass)};
const p0 = ${str(referenceDensity)};
const K = ${str(pressureConstant)};
const e = ${str(viscosityConstant)};

fn particleDensity(particle: Particle) -> f32 {
  var density = 0.0;

  ${iterateNeighbours(/* wgsl */`
    let diff = particle.position.xyz - particleB.position.xyz;
    let r2 = dot(diff, diff);
    if (r2 < h2) {
      let W = ${poly6const} * pow(h2 - r2, 3.0);
      density += particleFluidMass * W;
    }
  `)}
  return max(p0, density);
}

fn particlePressure(density: f32) -> f32 {
  return K * (density - p0);
}

fn fluidAccel(particle: Particle, id: u32) -> vec3<f32> {
  var pressureForce = vec3<f32>(0.0);
  var viscosityForce = vec3<f32>(0.0);

  let pressureA = particlePressure(particle.density);

  var sameGroupNeighbourPosSum = vec4<f32>(0.0, 0.0, 0.0, 0.01); // z component stores count
  var diffGroupNeighbourPosSum = vec4<f32>(0.0, 0.0, 0.0, 0.01);
  
  ${iterateNeighbours(/* wgsl */`
    if (particleBIndex != id) {

      let diff = particle.position.xyz - particleB.position.xyz;
      let r2 = dot(diff, diff);
        let r = sqrt(r2);

      if (r2 > 0 && r2 < h2) {
        let rNorm = diff / r;
        let r3 = r2 * r;

        let groupDist = 0.5*abs(particle.group - particleB.group); // 0 if the same, 1 if different

        // PRESSURE FORCE
        let W1 = ${spikyConst} * pow(h-r, 2.0);
        let pressureB = particlePressure(particleB.density);
        pressureForce += W1 * rNorm * (pressureA + pressureB) / (2.0 * particle.density * particleB.density);


        // VISCOSITY FORCE
        // let W2 = -(r3 / (2.0 * h3)) + (r2 / h2) + (h / (2.0 * r)) - 1;
        var W2 = ${viscConst} * (h - r);
        viscosityForce += (1.0-2.0*groupDist) * W2 * rNorm * (particleB.velocity.xyz - particle.velocity.xyz) / particleB.density;


        // GROUP COHESION
        sameGroupNeighbourPosSum += select(vec4<f32>(particleB.position.xyz, 1.0), vec4<f32>(0.0), groupDist > 0.5);
        diffGroupNeighbourPosSum += select(vec4<f32>(particleB.position.xyz, 1.0), vec4<f32>(0.0), groupDist < 0.5);
      }
    }
  `)}

  var force = (e*viscosityForce - pressureForce) / particle.density;

  let sameGroupCentroidDir = (sameGroupNeighbourPosSum.xyz / sameGroupNeighbourPosSum.w) - particle.position.xyz;
  let diffGroupCentroidDir = (diffGroupNeighbourPosSum.xyz / diffGroupNeighbourPosSum.w) - particle.position.xyz;
  force += 0.3* sameGroupCentroidDir - 0.05*diffGroupCentroidDir;

  return force / particleFluidMass;
}


`;