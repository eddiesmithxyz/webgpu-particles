import { wgslNumStr as str } from "../../common";

const mass = str(0.05);
const positionStiffness = str(-0.24);
const velocityDamping = str(-1);
const gravityClamp = str(200); // limit gravity


export const sdfSrc = /* wgsl */`

fn sdCapsule(p: vec3<f32>, a: vec3<f32>, b: vec3<f32>, r: f32) -> f32 {
    let pa = p - a;
    let ba = b - a;
    let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
}

fn sdCappedTorus(pIn: vec3<f32>, sc: vec2<f32>, ra: f32, rb: f32) -> f32 {
    var p = pIn;
    p.y = abs(p.y);

    let p_xy = p.xy;
    let k = select(
        length(p_xy),
        dot(p_xy, sc),
        sc.y * p.y > sc.x * p.x
    );

    return sqrt(dot(p, p) + ra * ra - 2.0 * ra * k) - rb;
}

fn sdD(p: vec3<f32>, r: f32) -> f32 {
    let c1 = sdCapsule(p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>(-0.3,  0.5, 0.0), r);

    let c2 = sdCapsule(p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>(-0.1, -0.5, 0.0), r);

    let c3 = sdCapsule(p,
        vec3<f32>(-0.3,  0.5, 0.0),
        vec3<f32>(-0.1,  0.5, 0.0), r);

    let t1 = sdCappedTorus(
        p - vec3<f32>(-0.1, 0.0, 0.0),
        vec2<f32>(1.0, 0.0),
        0.5, r
    );

    return min(min(c1, c2), min(c3, t1));
}

fn sdE(p: vec3<f32>, r: f32) -> f32 {
    let c1 = sdCapsule(p,
        vec3<f32>(-0.3,  0.5, 0.0),
        vec3<f32>( 0.3,  0.5, 0.0), r);

    let c2 = sdCapsule(p,
        vec3<f32>(-0.3,  0.0, 0.0),
        vec3<f32>( 0.1,  0.0, 0.0), r);

    let c3 = sdCapsule(p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>( 0.3, -0.5, 0.0), r);

    let c4 = sdCapsule(p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>(-0.3,  0.5, 0.0), r);

    return min(min(c1, c2), min(c3, c4));
}

fn sdI(p: vec3<f32>, r: f32) -> f32 {
    return sdCapsule(
        p,
        vec3<f32>(0.0, -0.5, 0.0),
        vec3<f32>(0.0,  0.5, 0.0),
        r
    );
}

fn sdf(pos: vec3<f32>) -> f32 {
    const r: f32 = 0.08;
    const scale: f32 = 40.0;

    let p = pos / scale;
    var minDist: f32 = 1e20;

    // E
    minDist = min(minDist, sdE(p - vec3<f32>(-2.1, 0.0, 0.0), r) * scale);

    // D D
    minDist = min(minDist, sdD(p - vec3<f32>(-1.0, 0.0, 0.0), r) * scale);
    minDist = min(minDist, sdD(p - vec3<f32>( 0.0, 0.0, 0.0), r) * scale);

    // I
    minDist = min(minDist, sdI(p - vec3<f32>( 1.0, 0.0, 0.0), r) * scale);

    // E
    minDist = min(minDist, sdE(p - vec3<f32>( 2.0, 0.0, 0.0), r) * scale);

    return minDist;
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
fn gravityAccel(pos: vec3<f32>, dist: f32, lastDist: f32) -> vec3<f32> {
  let dDistdt = (dist - lastDist) / uniforms.deltaTime;
  var gravityAmount = -${positionStiffness}*dist - ${velocityDamping}*dDistdt;
  gravityAmount = atan(gravityAmount / gravityClamp) * gravityClamp;

  let gravity = -sdfNormal(pos) * gravityAmount;
  return gravity / ${mass};

}


`;