import { shaderInputLayoutSrc, mainFunc, getID } from "../shaderLayout";
import { gridAccessFuncs } from "./gridAccess"



// ---------- SHADER ----------
export const assignCellShaderSrc = /* wgsl */`

${shaderInputLayoutSrc}


@group(0) @binding(2) var<storage, read_write> cellIds: array<u32>;


${gridAccessFuncs}


${mainFunc} {
  let id = ${getID};

  var position = particles[id].position.xyz;
  position += bounds * 0.5; // offset so grid bounding box applies from [-0.5*bound, +0.5*bound]
  
  var cellId3D = vec3<i32>(floor(position / cellWidth));
  let cellIdFlat = getCellIdFlat(cellId3D);

  particles[id].cellIndex = cellIdFlat;

  cellIds[id] = cellIdFlat;
  particleIds[id] = id;
}

`;
