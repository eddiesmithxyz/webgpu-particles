import { shaderInputLayoutSrc, mainFunc, getID } from "./shaderLayout";
import { gridAccessFuncs } from "./grid/gridAccess";
import { sphSrc } from "./physics/sph";


// compute densities


export const update1Src = /* wgsl */`

${shaderInputLayoutSrc}
${gridAccessFuncs}
${sphSrc}


${mainFunc} {
  let id = ${getID};

  let densityAndCentroid = particleDensity(particles0[id]);

  particles0[id].density = densityAndCentroid.x;
  particles0[id].groupCentroid = vec4<f32>(densityAndCentroid.yzw, 1.0);
}

`;