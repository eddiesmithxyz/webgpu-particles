export const createSquareData = () => {
  const positions = [
    -0.5, -0.5,  0,
     0.5, -0.5,  0,
    -0.5,  0.5,  0,

     0.5, -0.5,  0,
    -0.5,  0.5,  0,
     0.5,  0.5,  0
    ];

  const uvs = [
    0, 0,
    1, 0,
    0, 1,

    1, 0,
    0, 1,
    1, 1
  ];
  
  const data = new Float32Array(positions.length + uvs.length);
  for (let i = 0; i < 6; i++) {
    data[5*i + 0] = positions[3*i + 0];
    data[5*i + 1] = positions[3*i + 1];
    data[5*i + 2] = positions[3*i + 2];

    data[5*i + 3] = uvs[2*i + 0];
    data[5*i + 4] = uvs[2*i + 1];
  }
  return data;
}