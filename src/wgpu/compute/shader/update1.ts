import { updateTemplate, numberedShaderLog } from "./updateTemplate"
// import { iterateNeighbours } from "./grid/gridAccess";

// compute densities


const update1body = /* wgsl */`

let density = particleDensity(particle);
particles[id].density = density;




`;
export const update1Src = updateTemplate(update1body);


// // testing neighbours
// var neighbourCellIdSum: u32 = 0;
// ${iterateNeighbours(/* wgsl */`
//   neighbourCellIdSum += particleB.cellIndex;
// `)}
// particles[id]._pad = neighbourCellIdSum;