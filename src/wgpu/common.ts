const instanceDataLength = 8; // 8*f32 per instance
const sideLength = 32; // number of instances per side in a cubic arrangement


const logInstanceData = (data: Float32Array, logCount = 10) => {
  let table = [];
  console.log(data);
  for (let instance = 0; instance < logCount; instance++) {
    let offset = instance * instanceDataLength;
    table = [...table,  {
      xPos: data[offset + 0],
      yPos: data[offset + 1],
      zPos: data[offset + 2],
      xVel: data[offset + 3],
      yVel: data[offset + 4],
      zVel: data[offset + 5],
    }]
  }
  console.table(table);
}

export { instanceDataLength, logInstanceData, sideLength };