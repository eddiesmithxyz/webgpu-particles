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

  let density = particleDensity(particles[id]);
  particles[id].density = density;
}

`;


// // testing neighbours
// var neighbourCellIdSum: u32 = 0;
// ${iterateNeighbours(/* wgsl */`
//   neighbourCellIdSum += particleB.cellIndex;
// `)}
// particles[id]._pad = neighbourCellIdSum;