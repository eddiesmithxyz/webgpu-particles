import { shaderInputLayoutSrc, mainFunc, getID } from "../shaderLayout";
import { gridAccessFuncs } from "./gridAccess"



// ---------- SHADER ----------
export const assignCellShaderSrc = /* wgsl */`

${shaderInputLayoutSrc}


${gridAccessFuncs}


${mainFunc} {
  let id = ${getID};

  var position = particles0[id].position.xyz;
  position += bounds * 0.5; // offset so grid bounding box applies from [-0.5*bound, +0.5*bound]
  
  var cellId3D = vec3<i32>(floor(position / cellWidth));
  var cellIdFlat = getCellIdFlat(cellId3D);

  // cellIdFlat = select(cellIdFlat, UNSPAWNED_PARTICLE, id >= uniforms.particleCount);

  particles0[id].cellIndex = cellIdFlat;
  particles1[id].cellIndex = cellIdFlat;

  cellIds[id] = cellIdFlat;
  particleIds[id] = id;
}

`;
