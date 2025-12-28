import { mat4, vec3, vec2, quat, type Quat, type Vec3, type Mat4, type Vec2 } from 'wgpu-matrix';
import { sdf, sdfNormal } from './sdf.ts';

function falloff(signedDist: number): number {
  // given the distance to the surface of the field (sdf=0),
  // get the amount we should be applying gravity

  // this attempts to push objects into a stable orbit through the sdf=0 region,
  // and pushes objects out from sdf<0


  // let x = Math.max(signedDist, -1);
  // let falloff1 = Math.sin(Math.PI * Math.sign(x) / (Math.abs(x) + 1));
  // return falloff1 + Math.min(signedDist, 0);


  // const someFactorIdrk = 2;
  // const x = Math.max(signedDist, 0.01);
  // const sign = Math.atan(4*(x-1));
  // const falloff = someFactorIdrk * sign / x;
  // return Math.max(falloff, -5);


  return Math.atan(signedDist) + 0.5*Math.min(signedDist, 0);
}

class CubeInstance {
  id: number;
  mass = 0.05;

  pos: Vec3;
  rot: Quat = quat.create(0, 0, 0, 1);

  velocity: Vec3 = vec3.create(0, 0, 0);
  lastDist = 0;

  constructor(id, pos: Vec3) {
    this.id = id;
    this.pos = pos;
    this.lastDist = sdf(this.pos);
  }

  private modelMatrix: Mat4 = mat4.identity();

  getModelMatrix(): Mat4 {
    const translationMatrix = mat4.translation(this.pos);
    const rotationMatrix = mat4.fromQuat(this.rot);
    this.modelMatrix = mat4.multiply(translationMatrix, rotationMatrix);
    return this.modelMatrix;
  }

  getInstanceData(): Float32Array {
    const modelMatrix = this.getModelMatrix();
    const instanceData = new Float32Array(17);
    instanceData.set(modelMatrix, 0);
    instanceData[16] = this.id;
    return instanceData;
  }

  update(deltaTime: number) {
    // const gravityAmount = falloff(sdf(this.pos));

    const dist = sdf(this.pos);
    const dDistdt = (dist - this.lastDist) / deltaTime;
    this.lastDist = dist;

    const positionStiffness = -0.24;
    const velocityDamping = -1;
    let gravityAmount = -positionStiffness*dist - velocityDamping*dDistdt;
    
    const gravityClamp = 200;
    gravityAmount = Math.atan(gravityAmount / gravityClamp) * gravityClamp;
    
    const gravity = vec3.scale(sdfNormal(this.pos), -gravityAmount);


    const accel = vec3.scale(gravity, 1 / this.mass);

    this.velocity = vec3.add(this.velocity, vec3.scale(accel, deltaTime));
    this.pos = vec3.add(this.pos, vec3.scale(this.velocity, deltaTime));

  }
}

export class Scene {
  private timeScale = 1.7;

  private viewDistance: number = 80;
  public viewMatrix: Mat4 = mat4.lookAt([0, 0, this.viewDistance], [0, 0, 0], [0, 1, 0]);
  private viewAngles: Vec2 = vec2.create(0, 0);

  private cubes: CubeInstance[] = [];
  public instanceCount: number;
  public instanceData: Float32Array;

  private mouseCoord = vec2.create(0, 0);
  private mouseDown = false;
  private lastMouseCoord = vec2.create(0, 0);

  constructor(side = 9) {
    this.instanceCount = side*side*side;
    this.instanceData = new Float32Array(this.instanceCount * 17);
    
    for (let x = 0; x < side; x++) {
      for (let y = 0; y < side; y++) {
        for (let z = 0; z < side; z++) {
          const i = x * side * side + y * side + z;
          // const i = x * side + y;

          this.cubes.push(new CubeInstance(
            i,
            vec3.create(2*x-(side-1), 2*y-(side-1), 2*z-(side-1))
            // vec3.create(2*x-(side-1), 2*y-(side-1), 15)
          ));

          if (i % 10 === 0) {
            this.cubes[i].mass = 1;
          }

          this.cubes[i].pos = vec3.multiply(this.cubes[i].pos, vec3.create(15, 0.3, 0.3));
          this.cubes[i].pos = vec3.add(this.cubes[i].pos, vec3.create(0, 50, 0));

          // random velocity
          const startMaxSpeed = 5.0;
          this.cubes[i].velocity = vec3.create((Math.random()-0.5) * startMaxSpeed, (Math.random()-0.5) * startMaxSpeed, (Math.random()-0.5) * startMaxSpeed);
          // this.cubes[i].velocity = vec3.create(0, 0, 0);
        }
      }
    }

    
    window.addEventListener('mousemove', (event) => {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      this.mouseCoord[0] = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseCoord[1] = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    });
    window.addEventListener('mousedown', (event) => {
      this.mouseDown = true;
    });
    window.addEventListener('mouseup', (event) => {
      this.mouseDown = false;
    });
    window.addEventListener('wheel', (event) => {
      // event.preventDefault();
      this.viewDistance += ((event as WheelEvent).deltaY > 0) ? 1 : -1;
      this.viewDistance = Math.max(5, Math.min(100, this.viewDistance));
    });
  }

  update(deltaTime: number) {
    deltaTime = Math.min(deltaTime, 0.1) * this.timeScale; // cap deltaTime to avoid issues

    for (let i = 0; i < this.instanceCount; i++) {
      const cube = this.cubes[i];
      cube.update(deltaTime);
      this.instanceData.set(cube.getInstanceData(), i * 17);
    }


    if (this.mouseDown) {
      const deltaMouse = vec2.subtract(this.mouseCoord, this.lastMouseCoord);
      this.viewAngles[0] += deltaMouse[0] * 1.5;
      this.viewAngles[1] += deltaMouse[1] * -1;
    }
    let eye = vec3.create(0, 0, this.viewDistance);
    eye = vec3.rotateX(eye, vec3.zero(), this.viewAngles[1]);
    eye = vec3.rotateY(eye, vec3.zero(), this.viewAngles[0]);
    this.viewMatrix = mat4.lookAt(eye, [0, 0, 0], [0, 1, 0]);


    this.lastMouseCoord = vec2.clone(this.mouseCoord);
  }

}
