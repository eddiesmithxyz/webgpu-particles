export const createCubeData = () => {
  const positions = [
    // Front face
    -0.5, -0.5,  0.5,
     0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
     0.5,  0.5,  0.5,

    // Back face
    -0.5, -0.5, -0.5,
     0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
     0.5,  0.5, -0.5,
  ];
  const posIndices = [
    0, 1, 2,  3, 2, 1,  // front
    6, 5, 4,  5, 6, 7,  // back
    6, 4, 0,  6, 0, 2,  // left
    1, 5, 3,  5, 7, 3,  // right
    2, 3, 6,  3, 7, 6,  // top
    0, 4, 5,  0, 5, 1   // bottom
  ];
  

  const normals = [
     0,  0,  1, // front
     0,  0, -1, // back
    -1,  0,  0, // left
     1,  0,  0, // right
     0,  1,  0, // top
     0, -1,  0, // bottom
  ];
  const normalIndices = [
    0, 0, 0,  0, 0, 0, // front
    1, 1, 1,  1, 1, 1, // back
    2, 2, 2,  2, 2, 2, // left 
    3, 3, 3,  3, 3, 3, // right
    4, 4, 4,  4, 4, 4, // top
    5, 5, 5,  5, 5, 5  // bottom
  ];

  
  // use indices to generate explicit position array
  // indexed drawing is possible. but juggling different position and normal indices is difficult,
  // and no examples exist (without passing all the data in as a uniform and having the indices as attributes (bad))
  const data = new Float32Array(posIndices.length * 3 + normalIndices.length * 3);

  for (let i = 0; i < posIndices.length; i++) {
    const posI = posIndices[i];
    data[6*i + 0] = positions[posI*3 + 0];
    data[6*i + 1] = positions[posI*3 + 1];
    data[6*i + 2] = positions[posI*3 + 2];
    
    const normalI = normalIndices[i];
    data[6*i + 3] = normals[3*normalI + 0];
    data[6*i + 4] = normals[3*normalI + 1];
    data[6*i + 5] = normals[3*normalI + 2];
  }
  return data;
}