import { mainFunc, getID } from "../shaderLayout";

export const genCellOffsetsSrc = /* wgsl */`

@group(0) @binding(2) var<storage, read_write> cellIds: array<u32>;
@group(0) @binding(4) var<storage, read_write> cellOffsets: array<atomic<u32>>;

${mainFunc} {
  let id = ${getID};

  let cellId = cellIds[id];

  // the offset to the first appearance of each cell within the sorted cellId list is the minimum of ids
  atomicMin(&cellOffsets[cellId], id);
}
`;