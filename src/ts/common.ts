import { vec3, type Vec3 } from "wgpu-matrix"

const workgroupSize = 64; // number of threads per compute workgroup
const instanceDataLength = 20; // n*f32 per instance


const logInstanceData = (data: Float32Array, logCount = 10) => {
  const uintView = new Uint32Array(data.buffer);

  let table: any = [];
  // console.log(data);
  for (let instance = 0; instance < logCount; instance++) {
    let offset = instance * instanceDataLength;
    table = [...table,  {
      xPos: data[offset + 0],
      yPos: data[offset + 1],
      zPos: data[offset + 2],
      xVel: data[offset + 4],
      yVel: data[offset + 5],
      zVel: data[offset + 6],
      dist: data[offset + 8],
      dens: data[offset + 9],
      cell: uintView[offset + 10],
      test: uintView[offset + 11]
    }]
  }
  console.table(table);
}

function wgslNumStr(n: number) {
  return Number.isInteger(n) ? n.toFixed(1) : n.toString();
}
function wgslVec3Str(v: Vec3) {
  return `vec3<f32>(${wgslNumStr(v[0])}, ${wgslNumStr(v[1])}, ${wgslNumStr(v[2])})`;
}
function wgslIVec3Str(v: Vec3) {
  const str = (n: number) => n.toFixed(0);
  return `vec3<i32>(${str(v[0])}, ${str(v[1])}, ${str(v[2])})`;
}

export { instanceDataLength, logInstanceData, workgroupSize, wgslNumStr, wgslVec3Str, wgslIVec3Str };