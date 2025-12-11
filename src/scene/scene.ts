import { mat4, vec3, quat, type Quat, type Vec3, type Mat4 } from 'wgpu-matrix';




class CubeInstance {
  pos: Vec3 = vec3.create(0, 0, 0);
  rot: Quat = quat.create(0, 0, 0, 1);

  velocity: Vec3 = vec3.create(0, 0, 0);

  private modelMatrix: Mat4 = mat4.identity();

  getModelMatrix(): Mat4 {
    const translationMatrix = mat4.translation(this.pos);
    const rotationMatrix = mat4.fromQuat(this.rot);
    this.modelMatrix = mat4.multiply(translationMatrix, rotationMatrix);
    return this.modelMatrix;
  }

  update(deltaTime: number) {
    this.pos = vec3.add(this.pos, vec3.mulScalar(this.velocity, deltaTime));
  }
}

export class Scene {
  public viewMatrix: Mat4 = mat4.translation([0, 0, -20]);

  public instanceCount;
  
  private cubes: CubeInstance[] = [];
  public instanceMatrices: Float32Array;

  constructor(side = 20) {
    this.instanceCount = side*side;
    this.instanceMatrices = new Float32Array(this.instanceCount * 16);

    for (let i = 0; i < this.instanceCount; i++) {
      this.cubes.push( new CubeInstance() );
      
      const x = i % side;
      const y = Math.floor(i / side);
      this.cubes[i].pos = vec3.create(2*x-(side-1), 2*y-(side-1), 0);
      
      // random velocity
      const maxSpeed = 20.0;
      this.cubes[i].velocity = vec3.create((Math.random()-0.5) * maxSpeed, (Math.random()-0.5) * maxSpeed, (Math.random()-0.5) * maxSpeed);
    }
  }

  update(deltaTime: number) {
    for (let i = 0; i < this.instanceCount; i++) {
      const cube = this.cubes[i];
      cube.update(deltaTime);
      this.instanceMatrices.set(cube.getModelMatrix(), i * 16);
    }
  }

}
