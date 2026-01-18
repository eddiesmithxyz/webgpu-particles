import { mat4, vec3, vec2, type Vec3, type Mat4, type Vec2 } from 'wgpu-matrix';
import { instanceDataLength, logInstanceData } from './common';

export class Scene {
  private viewDistance: number = 84;
  public viewMatrix: Mat4 = mat4.lookAt([0, 0, this.viewDistance], [0, 0, 0], [0, 1, 0]);
  public viewProjectionMatrix: Mat4 = mat4.identity();
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

  createInitialParticleData(particleCount: number): Float32Array<ArrayBuffer> {
    const particleData = new Float32Array(particleCount * instanceDataLength);

    for (let i = 0; i < particleCount; i++) {


      let pos = vec3.create(Math.random(), Math.random(), Math.random());
      pos = vec3.sub(pos, vec3.create(0.5, 0.5, 0.5)); // 1x1 cube centred at origin

      pos = vec3.multiply(pos, vec3.create(200, 10, 10));

      const side = Math.random() > 0.5 ? 1: -1;
      pos = vec3.add(pos, vec3.create(0, 40 * side, 0));

      
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

      const normal = vec3.create(0, 1, 0);

      particleData.set([
        pos[0],       pos[1],      pos[2],      1, 
        velocity[0],  velocity[1], velocity[2], 1, 
        normal[0],    normal[1],   normal[2],   1,
        0, 0, 0, side
      ], i * instanceDataLength);
      
    }
    // logInstanceData(particleData);
    return particleData;
  }


  update(canvas: HTMLCanvasElement) {
    console.log(this.mouseCoord);
    if (this.mouseDown) {
      const deltaMouse = vec2.subtract(this.mouseCoord, this.lastMouseCoord);
      this.viewAngles[0] += deltaMouse[0] * 1.5;
      this.viewAngles[1] += deltaMouse[1] * -1;
    }


    let eye = vec3.create(0, 0, this.viewDistance);
    eye = vec3.rotateX(eye, vec3.zero(), this.viewAngles[1]);
    eye = vec3.rotateY(eye, vec3.zero(), this.viewAngles[0]);
    const viewMatrix = mat4.lookAt(eye, [0, 0, 0], [0, 1, 0]);


    // const near = 0.1;
    // const far = 1000;
    // const fovY = 2.0;
    // const h = near * Math.tan(fovY / 2);
    // const w = h * (canvas.width / canvas.height);

    // const parallax = 0.2;
    // const dx = this.mouseCoord[0] * w * parallax;
    // const dy = this.mouseCoord[1] * w * parallax;

    // const projMatrix = mat4.frustum(
    //   -w + dx,
    //    w ,
    //   -h + dy,
    //    h + dy,
    //    near,
    //    far
    // )


    const projMatrix = mat4.perspective(
      1.0,
      canvas.width / canvas.height,
      0.1,
      1000.0
    );



    this.viewProjectionMatrix = mat4.multiply(projMatrix, viewMatrix);

    this.lastMouseCoord = vec2.clone(this.mouseCoord);
  }

}
