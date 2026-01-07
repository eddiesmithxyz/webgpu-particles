// https://wickedengine.net/2018/05/scalabe-gpu-fluid-simulation/comment-page-1/

import { sideLength, wgslNumStr as str } from "../../common";


// PARAMETERS
const smoothingRadius = 1;

const pressureConstant = 250;
const referenceDensity = 1;

const viscosityConstant = 0.218;

const particleCount = sideLength * sideLength * sideLength;
const particleMass = 1;



// INTERNAL PARAMS
const poly6const = str(315 / (64 * Math.PI * Math.pow(smoothingRadius, 9)));
const spikyConst = str(-45 / (Math.PI * Math.pow(smoothingRadius, 6)));
const viscConst = str(45 / (Math.PI * Math.pow(smoothingRadius, 6)));


// ------ SHADER ------
export const sphSrc = /* wgsl */`

const particleCount = ${particleCount};

const h = ${str(smoothingRadius)};
const h2 = ${str(Math.pow(smoothingRadius, 2))};
const h3 = ${str(Math.pow(smoothingRadius, 3))};

const particleFluidMass = ${str(particleMass)};
const p0 = ${str(referenceDensity)};
const K = ${str(pressureConstant)};
const e = ${str(viscosityConstant)};

fn particleDensity(pos: vec3<f32>) -> f32 {
  var density = 0.0;

  for (var i = 0; i < particleCount; i++) {
    let diff = pos - particles[i].position.xyz;
    let r2 = dot(diff, diff);
    if (r2 < h2) {
      let W = ${poly6const} * pow(h2 - r2, 3.0);
      density += particleFluidMass * W;
    }
  }
  return max(p0, density);
}

fn particlePressure(density: f32) -> f32 {
  return K * (density - p0);
}

fn fluidAccel(particle: Particle, id: u32) -> vec3<f32> {
  var pressureForce = vec3<f32>(0.0);
  var viscosityForce = vec3<f32>(0.0);

  for (var i: u32 = 0; i < particleCount; i++) {
    if (i != id) {
      let particleB = particles[i];

      let diff = particle.position.xyz - particleB.position.xyz;
      let r2 = dot(diff, diff);
        let r = sqrt(r2);

      if (r2 > 0 && r2 < h2) {
        let rNorm = diff / r;
        let r3 = r2 * r;


        // PRESSURE FORCE
        let W1 = ${spikyConst} * pow(h-r, 2.0);

        let pressureA = particlePressure(particle.density);
        let pressureB = particlePressure(particleB.density);

        pressureForce += W1 * rNorm * (pressureA + pressureB) / (2.0 * particle.density * particleB.density);


        // VISCOSITY FORCE
        // let W2 = -(r3 / (2.0 * h3)) + (r2 / h2) + (h / (2.0 * r)) - 1;
        let W2 = ${viscConst} * (h - r);
        viscosityForce += W2 * rNorm * (particleB.velocity.xyz - particle.velocity.xyz) / particleB.density;
      }
    }
  }

  let force = (e*viscosityForce - pressureForce) / particle.density;
  return force / particleFluidMass;
}


`;