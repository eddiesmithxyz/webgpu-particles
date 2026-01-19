import { mainFunc, getID, shaderInputLayoutSrc } from "../shaderLayout";

// creates offset list
// orders particles0 list by cellID, using the (particleID, cellID) list. this isn't necessary for correctness but speeds up access


export const createStructureSrc = /* wgsl */`

${shaderInputLayoutSrc.replace("cellOffsets: array<u32>", "cellOffsets: array<atomic<u32>>")}

${mainFunc} {
  let id = ${getID};

  let particleId = particleIds[id]; // index of this cell within the particles buffer
  let cellId = cellIds[id];

  particles0[id] = particles1[particleId];

  


  // the offset to the first appearance of each cell within the sorted cellId list is the minimum of ids
  atomicMin(&cellOffsets[cellId], id);
}
`;