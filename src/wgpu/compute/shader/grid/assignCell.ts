import { sideLength } from "../../../common"
import { shaderInputLayoutSrc } from "../inputLayout";
import { gridAccessFuncs } from "./gridAccess"



// ---------- SHADER ----------
export const assignCellShaderSrc = /* wgsl */`

${shaderInputLayoutSrc}


@group(0) @binding(2) var<storage, read_write> cellIds: array<u32>;


${gridAccessFuncs}


@compute @workgroup_size(1, ${sideLength}, ${sideLength}) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
) {
  let id = workgroup_id.x * ${sideLength * sideLength} + local_invocation_id.y * ${sideLength} + local_invocation_id.z;

  var position = particles[id].position.xyz;
  position += bounds * 0.5; // offset so grid bounding box applies from [-0.5*bound, +0.5*bound]
  
  var cellId3D = vec3<i32>(floor(position / cellWidth));
  let cellIdFlat = getCellIdFlat(cellId3D);

  particles[id].cellIndex = cellIdFlat;

  cellIds[id] = cellIdFlat;
  particleIds[id] = id;
}

`;
