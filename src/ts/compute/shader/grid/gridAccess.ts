import { wgslNumStr as str, wgslVec3Str as strV, wgslIVec3Str as strIntV } from "../../../common"
import { vec3 } from "wgpu-matrix"


export const smoothingRadius = 0.9; // SPH smoothing radius, also defines the grid cell size

// unit size of spatial grid. this is centred around 0, so will span [-0.5*bound, +0.5*bound]
// points outside the bounds will be modulo'd 
// const bound = vec3.create(200, 100, 25); // for EDDIE
const bound = vec3.create(150, 150, 25); // for HI

export const gridSize = vec3.floor(vec3.divScalar(bound, smoothingRadius));
export const trueBound = vec3.mulScalar(gridSize, smoothingRadius); // reduce bound to nearest multiple of smoothingRadius


// console.log(strIntV(gridSize));
// console.log(strV(trueBound));


export const gridAccessFuncs = /* wgsl */`

const gridSize = ${strIntV(gridSize)};
const bounds = ${strV(trueBound)};

const cellWidth = ${str(smoothingRadius)};


fn imod3(a: vec3<i32>, b: vec3<i32>) -> vec3<i32> {
  let r = a % b;
  return select(r + b, r, r >= vec3<i32>(0));
}

fn getCellIdFlat(cellId3D: vec3<i32>) -> u32 {
  // TODO - could change loop for better spatial locality
  // e.g. if gridSize.x = 20, currently 21 =>  1, 22 =>  2, 41 => 1
  // but could flip this 20-40 range so 21 => 19, 22 => 18, 41 => 1
  let loopedId3D = imod3(cellId3D, gridSize);

  // TODO - use a space filling curve to improve neighbour locality
  let flatId =
    loopedId3D.x * gridSize.y * gridSize.z +
    loopedId3D.y * gridSize.z +
    loopedId3D.z;
  
  return u32(flatId);
}

fn getCellId3d(cellIdFlat: u32) -> vec3<i32> {
    const yz = gridSize.y * gridSize.z;

    let x = i32(cellIdFlat) / yz;
    let rem = i32(cellIdFlat) % yz;

    let y = rem / gridSize.z;
    let z = rem % gridSize.z;

    return vec3<i32>(x, y, z);
}
`;



export const iterateNeighbours = (body: string) => /* wgsl */`
// requires including gridAccessFuncs
// assumes "particle" is defined as the particle we are finding neighbours of
// loops over all "particleB" in this cell and neighbour cells
// uses the sorted spatial grid we have created

let particleCellIndex3d = getCellId3d(particle.cellIndex);
for (var i: i32 = -1; i <= 1; i++) {
  for (var j: i32 = -1; j <= 1; j++) {
    for (var k: i32 = -1; k <= 1; k++) {
      let neighbourIndex3d = particleCellIndex3d + vec3<i32>(i, j, k);
      let neighbourCellIndex = getCellIdFlat(neighbourIndex3d);

      // get the start of the cell sublist of particles 
      var neighbourIterator = cellOffsets[neighbourCellIndex];

      // iterate over particles in the neighbour cell
      while (neighbourIterator != 0xffffffff && neighbourIterator < uniforms.particleCount) {
        // let particleBIndex = particleIds[neighbourIterator]; // if we haven't reordered the particle buffer by cellId
        let particleBIndex = neighbourIterator;
        let particleB = particles0[particleBIndex];

        if (particleB.cellIndex != neighbourCellIndex) {
          // we have iterated over all particles in the neighbour cell sublist
          break;
        }

        ${body};

        neighbourIterator++;
      }
    }
  }
}
`;
