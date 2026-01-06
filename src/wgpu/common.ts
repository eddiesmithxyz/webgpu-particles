const instanceDataLength = 12; // 12*f32 per instance
const sideLength = 10; // number of instances per side in a cubic arrangement


const logInstanceData = (data: Float32Array, logCount = 10) => {
  let table = [];
  console.log(data);
  for (let instance = 0; instance < logCount; instance++) {
    let offset = instance * instanceDataLength;
    table = [...table,  {
      xPos: data[offset + 0],
      yPos: data[offset + 1],
      zPos: data[offset + 2],
      xVel: data[offset + 4],
      yVel: data[offset + 5],
      zVel: data[offset + 6],
      lastDist: data[offset + 8],
    }]
  }
  console.table(table);
}

function wgslNumStr(n: number) {
  return Number.isInteger(n) ? n.toFixed(1) : n.toString();
}

export { instanceDataLength, logInstanceData, sideLength, wgslNumStr };