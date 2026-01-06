import { mat4, vec3, vec2, type Vec3, type Mat4, type Vec2 } from 'wgpu-matrix';
import { instanceDataLength } from '../wgpu/common';

export class Scene {
  private viewDistance: number = 15;
  public viewMatrix: Mat4 = mat4.lookAt([0, 0, this.viewDistance], [0, 0, 0], [0, 1, 0]);
  private viewAngles: Vec2 = vec2.create(0, 0);


  private mouseCoord = vec2.create(0, 0);
  private mouseDown = false;
  private lastMouseCoord = vec2.create(0, 0);

  constructor(side = 9) {
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

  createInitialInstanceData(side: number = 9): { instanceCount: number, instanceData: Float32Array<ArrayBuffer> } {
    const instanceCount = side*side*side;
    const instanceData = new Float32Array(instanceCount * instanceDataLength);
    
    for (let x = 0; x < side; x++) {
      for (let y = 0; y < side; y++) {
        for (let z = 0; z < side; z++) {
          const i = x * side * side + y * side + z;
          // const i = y * side + z;
          


          // let pos = vec3.create(2*x-(side-1), 2*y-(side-1), 2*z-(side-1)) as Vec3;  // vec3.create(0, 2*y-(side-1), 2*z-(side-1))
          // pos = vec3.multiply(pos, vec3.create(15, 0.3, 0.3));
          // pos = vec3.add(pos, vec3.create(0, 50, 0));

          const s = side - 1;
          let pos = vec3.create(x/s, y/s, z/s);
          pos = vec3.sub(pos, vec3.create(0.5, 0.5, 0.5)); // 1x1 cube centred at origin
          pos = vec3.scale(pos, 4);

          // random velocity
          const startMaxSpeed = 5.0;
          const velocity = vec3.create((Math.random()-0.5) * startMaxSpeed, (Math.random()-0.5) * startMaxSpeed, (Math.random()-0.5) * startMaxSpeed);
          // const velocity = vec3.create(-1, -1, -1);

          instanceData.set([pos[0], pos[1], pos[2], 1, velocity[0], velocity[1], velocity[2], 1, 0, 0, 0, 0], i * instanceDataLength);
        }
      }
    }

    return { instanceCount, instanceData };
  }


  update() {
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
