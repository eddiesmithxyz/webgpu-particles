import { mat4, vec4, vec3, vec2, type Vec3, type Mat4, type Vec2 } from 'wgpu-matrix';
import { instanceDataLength, logInstanceData } from './common';

export class Scene {
  private viewDistance: number = 84;
  public camPos = vec3.create(0, 0, this.viewDistance);
  public viewMatrix: Mat4 = mat4.lookAt(this.camPos, [0, 0, 0], [0, 1, 0]);
  public viewProjectionMatrix: Mat4 = mat4.identity();
  private viewAngles: Vec2 = vec2.create(0, 0);


  public mouseCoord = vec2.create(0, 0);
  private mouseDown = false;
  private lastMouseCoord = vec2.create(0, 0);

  public mouseIntersection = vec3.create(0, 0, 0); // intersection of mouse ray with z=0 plane
  public lastMouseIntersection = vec3.create(0, 0, 0);

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
      pos = vec3.multiply(pos, vec3.create(20, 50, 20));

      const letterX = [-2.05, -1.05, 0, 1, 2].map(x => x*40);
      const letter = Math.floor(Math.random() * letterX.length);


      const side = Math.random() > 0.5 ? 1: -1;
      pos = vec3.add(pos, vec3.create(letterX[letter], 80 * side, 0));

      
      // pos = vec3.scale(pos, 7);
      // pos = vec3.add(pos, vec3.create(10, 20, 0));

      // start left of E
      // pos = vec3.mul(pos, vec3.create(20, 50, 10));
      // pos = vec3.add(pos, vec3.create(-200, 0, 0));


      // random velocity
      const startMaxSpeed = 20.0;
      // let velocity = vec3.create((Math.random()-0.5) * startMaxSpeed, (Math.random()-0.5) * startMaxSpeed, (Math.random()-0.5) * startMaxSpeed);
      let velocity = vec3.create(0, -20, 0);

      const normal = vec3.create(0, 1, 0);

      particleData.set([
        pos[0],       pos[1],      pos[2],      1, 
        velocity[0],  velocity[1], velocity[2], 1, 
        normal[0],    normal[1],   normal[2],   1,
        0, 0, 0, side,
      ], i * instanceDataLength);
      
    }
    // logInstanceData(particleData);
    return particleData;
  }


  update(canvas: HTMLCanvasElement) {
    // console.log(this.mouseCoord);
    if (this.mouseDown) {
      const deltaMouse = vec2.subtract(this.mouseCoord, this.lastMouseCoord);
      this.viewAngles[0] += deltaMouse[0] * 1.5;
      this.viewAngles[1] += deltaMouse[1] * -1;
    }


    this.camPos = vec3.create(0, 0, this.viewDistance);
    this.camPos = vec3.rotateX(this.camPos, vec3.zero(), this.viewAngles[1]);
    this.camPos = vec3.rotateY(this.camPos, vec3.zero(), this.viewAngles[0]);
    const viewMatrix = mat4.lookAt(this.camPos, [0, 0, 0], [0, 1, 0]);



    const projMatrix = mat4.perspective(
      1.0,
      canvas.width / canvas.height,
      0.1,
      1000.0
    );
    this.viewProjectionMatrix = mat4.multiply(projMatrix, viewMatrix);



    // find intersection of mouse ray with z=0 plane
    const nearClip = vec4.create(this.mouseCoord[0], this.mouseCoord[1], -1, 1);
    const farClip  = vec4.create(this.mouseCoord[0], this.mouseCoord[1],  1, 1);

    const invVP = mat4.inverse(this.viewProjectionMatrix);
    let nearWorld = vec4.transformMat4(nearClip, invVP);
    let farWorld  = vec4.transformMat4(farClip, invVP);

    nearWorld = vec3.create(nearWorld[0]/nearWorld[3], nearWorld[1]/nearWorld[3], nearWorld[2]/nearWorld[3] ); // perspective correction
    farWorld  = vec3.create(farWorld[0]/farWorld[3], farWorld[1]/farWorld[3], farWorld[2]/farWorld[3] );

    const rayOrigin = nearWorld;
    const rayDir = vec3.normalize(vec3.sub(farWorld, nearWorld));
    const t = -rayOrigin[2] / rayDir[2];
    
    this.lastMouseIntersection = this.mouseIntersection;
    this.mouseIntersection = vec3.add(rayOrigin, vec3.scale(rayDir, t));







    this.lastMouseCoord = vec2.clone(this.mouseCoord);
  }

}
