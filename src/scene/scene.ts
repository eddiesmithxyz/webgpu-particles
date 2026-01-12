import { mat4, vec3, vec2, type Vec3, type Mat4, type Vec2 } from 'wgpu-matrix';
import { instanceDataLength, logInstanceData } from '../wgpu/common';

export class Scene {
  private viewDistance: number = 100;
  public viewMatrix: Mat4 = mat4.lookAt([0, 0, this.viewDistance], [0, 0, 0], [0, 1, 0]);
  private viewAngles: Vec2 = vec2.create(0, 0);


  private mouseCoord = vec2.create(0, 0);
  private mouseDown = false;
  private lastMouseCoord = vec2.create(0, 0);

  constructor() {
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
      this.viewDistance += 0.1 * this.viewDistance * ((event as WheelEvent).deltaY > 0 ? 1 : -1);
      this.viewDistance = Math.max(5, Math.min(200, this.viewDistance));
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
          

          let pos = vec3.create(x/side, y/side, z/side);
          pos = vec3.sub(pos, vec3.create(0.5, 0.5, 0.5)); // 1x1 cube centred at origin

          pos = vec3.multiply(pos, vec3.create(300, 0.3, 0.3));
          pos = vec3.add(pos, vec3.create(0, 60, 0));

          
          // pos = vec3.scale(pos, 7);
          // pos = vec3.add(pos, vec3.create(10, 20, 0));

          // start left of E
          // pos = vec3.mul(pos, vec3.create(20, 50, 10));
          // pos = vec3.add(pos, vec3.create(-200, 0, 0));


          // random velocity
          const startMaxSpeed = 20.0;
          let velocity = vec3.create((Math.random()-0.5) * startMaxSpeed, (Math.random()-0.5) * startMaxSpeed, (Math.random()-0.5) * startMaxSpeed);
          // velocity = vec3.add(velocity, vec3.create(0, -20, 0))
          velocity = vec3.add(velocity, vec3.create(0, 0, 0));

          instanceData.set([pos[0], pos[1], pos[2], 1, velocity[0], velocity[1], velocity[2], 1, 0, 0, 0, 0], i * instanceDataLength);
        }
      }
    }
    logInstanceData(instanceData);
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
