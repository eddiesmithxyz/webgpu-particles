import { instanceDataLength, sideLength } from "../../common"
import { sdfSrc } from "./sdf"
export const particleUpdateShaderSrc = /* wgsl */`

const mass = 0.05;
const positionStiffness = -0.24;
const velocityDamping = -1;
const gravityClamp = 200.0; // limit gravity
const accelDeltaTime = 0.03; // hardcoded deltaTime for acceleration calculation to prevent explosion

const deltaTime = 0.03; // REPLACE WITH UNIFORM

@group(0) @binding(0) var<storage, read_write> data: array<f32>;

${sdfSrc}


@compute @workgroup_size(1, ${sideLength}, ${sideLength}) fn update(
  @builtin(workgroup_id) workgroup_id : vec3<u32>,
  @builtin(local_invocation_id) local_invocation_id : vec3<u32>
) {
  let id = workgroup_id.x * ${sideLength * sideLength} + local_invocation_id.y * ${sideLength} + local_invocation_id.z;
  let offset = id * ${instanceDataLength};

  // get values
  var position = vec3f(data[offset+0], data[offset+1], data[offset+2]);
  var velocity = vec3f(data[offset+3], data[offset+4], data[offset+5]);
  let lastDist = data[offset+6];

  // process
  let dist = sdf(position);

  let dDistdt = (dist - lastDist) / deltaTime;
  var gravityAmount = -positionStiffness*dist - velocityDamping*dDistdt;
  gravityAmount = atan(gravityAmount / gravityClamp) * gravityClamp;

  let gravity = -sdfNormal(position) * gravityAmount;
  let acceleration = gravity / mass;

  velocity += acceleration * accelDeltaTime;
  position += velocity * deltaTime;




  // place in new values
  data[offset+0] = position.x;
  data[offset+1] = position.y;
  data[offset+2] = position.z;

  data[offset+3] = velocity.x;
  data[offset+4] = velocity.y;
  data[offset+5] = velocity.z;

  data[offset+6] = dist;

}




`;