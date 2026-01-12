import { sideLength } from "../../../common";

export const genCellOffsetsSrc = /* wgsl */`

@group(0) @binding(2) var<storage, read_write> cellIds: array<u32>;
@group(0) @binding(4) var<storage, read_write> cellOffsets: array<atomic<u32>>;

@compute @workgroup_size(1, ${sideLength}, ${sideLength}) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
) {
  let id = workgroup_id.x * ${sideLength * sideLength} + local_invocation_id.y * ${sideLength} + local_invocation_id.z;

  let cellId = cellIds[id];

  // the offset to the first appearance of each cell within the sorted cellId list is the minimum of ids
  atomicMin(&cellOffsets[cellId], id);
}
`;