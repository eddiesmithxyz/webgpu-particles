import { wgslNumStr as str } from "../../../../common";
import { primitiveSDFsSrc } from "./primitives";
import { wordSDFSrc } from "./word";

const mass = str(0.05);
const positionStiffness = str(-0.5);
const velocityDamping = str(-1);
const gravityClamp = str(200); // limit gravity so it doesn't explode if we're far away

const mouseDisturbRadius = str(3);
const mouseDisturbSharpness = str(20);


export const sdfSrc = /* wgsl */`
${wordSDFSrc}


fn sdDistort(pos: vec3<f32>) -> f32 {
    // const sharpness = 0.9;
    // const period = 0.5;
    // return max((sin(period*abs(pos.y) + uniforms.time)-sharpness)/(1.0-sharpness), 0.0);


    // MOUSE INTERACTION

    // find closest point on line between mouseIntersection and lastMouseIntersection
    let p1 = uniforms.mouseIntersection;
    let p2 = uniforms.lastMouseIntersection;  
    
    let v = p2 - p1;
    let w = pos.xy - p1;

    let t = saturate(dot(w, v) / dot(v, v));
    let closestPoint = p1 + t*v;


    const mouseDisturbRadius = ${mouseDisturbRadius};
    const mouseDisturbSharpness = ${mouseDisturbSharpness};

    var dist = pos.xy - closestPoint;
    dist *= 1.0/mouseDisturbRadius;
    

    return mouseDisturbSharpness*exp(-dot(dist, dist));
}

fn sdf(pos: vec3<f32>) -> f32 {
    var dist = sdfWord(pos);
    dist += sdDistort(pos);

    return dist;
}

const EPSILON: f32 = 0.0001;
fn sdfNormal(pos: vec3<f32>) -> vec3<f32> {
    let e = vec3<f32>(EPSILON, 0.0, 0.0);

    let dx = sdf(pos + e.xyy) - sdf(pos - e.xyy);
    let dy = sdf(pos + e.yxy) - sdf(pos - e.yxy);
    let dz = sdf(pos + e.yyx) - sdf(pos - e.yyx);

    return normalize(vec3<f32>(dx, dy, dz));
}

const gravityClamp = ${gravityClamp};
fn gravityAccel(pos: vec3<f32>, dist: f32, fieldNormal: vec3<f32>, lastDist: f32) -> vec3<f32> {
  let dist2 = dist; // max(dist, 0.0);         // uncomment to allow particles inside volumes
  let lastDist2 = lastDist; // max(lastDist, 0.0);

  let dDistdt = (dist2 - lastDist2) / uniforms.deltaTime;
  var gravityAmount = -${positionStiffness}*dist2 - ${velocityDamping}*dDistdt;
  gravityAmount = atan(gravityAmount / gravityClamp) * gravityClamp;

  var gravity = -fieldNormal * gravityAmount;

  return gravity / ${mass};

}


`;