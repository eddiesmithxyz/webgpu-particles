import { mat4, vec3, vec2, quat, type Quat, type Vec3, type Mat4, type Vec2 } from 'wgpu-matrix';

function sdCapsule(p: Vec3, a: Vec3, b: Vec3, r: number): number {
  const pa = vec3.subtract(p, a);
  const ba = vec3.subtract(b, a);
  const h = Math.max(0, Math.min(1, vec3.dot(pa, ba) / vec3.dot(ba, ba)));
  return vec3.length(vec3.subtract(pa, vec3.scale(ba, h))) - r;
}

function sdCappedTorus(p: Vec3, sc: Vec2, ra: number, rb: number): number {
  p = vec3.create(p[0], Math.abs(p[1]), p[2]);
  const p_xy = vec2.create(p[0], p[1]);
  const k = sc[1] * p[1] > sc[0] * p[0] ? vec2.dot(p_xy, sc) : vec2.length(p_xy);
  return Math.sqrt(vec3.dot(p, p) + ra * ra - 2.0 * ra * k) - rb;
}

const sdD = (p: Vec3, r: number): number => {
  const c1 = sdCapsule(p, vec3.create(-0.3, -0.5, 0), vec3.create(-0.3, 0.5, 0), r);
  const c2 = sdCapsule(p, vec3.create(-0.3, -0.5, 0), vec3.create(-0.1, -0.5, 0), r);
  const c3 = sdCapsule(p, vec3.create(-0.3, 0.5, 0), vec3.create(-0.1, 0.5, 0), r);
  const t1 = sdCappedTorus(vec3.subtract(p, vec3.create(-0.1, 0, 0)), vec2.create(1, 0), 0.5, r);
  
  return Math.min(Math.min(c1, c2), Math.min(c3, t1));
}

const sdE = (p: Vec3, r: number): number => {
  const c1 = sdCapsule(p, vec3.create(-0.3,  0.5, 0), vec3.create(0.3,  0.5, 0), r);
  const c2 = sdCapsule(p, vec3.create(-0.3,    0, 0), vec3.create(0.1,    0, 0), r);
  const c3 = sdCapsule(p, vec3.create(-0.3, -0.5, 0), vec3.create(0.3, -0.5, 0), r);
  const c4 = sdCapsule(p, vec3.create(-0.3, -0.5, 0), vec3.create(-0.3, 0.5, 0), r);
  
  return Math.min(Math.min(c1, c2), Math.min(c3, c4));
}

const sdI = (p: Vec3, r: number): number => {
  const c1 = sdCapsule(p, vec3.create(0, -0.5, 0), vec3.create(0, 0.5, 0), r);
  return c1;
}

function sdf(pos: Vec3): number {
  // SPHERE
  // const radius = 10;
  // return pos.length - radius;

  const r = 0.08;
  const scale = 40;
  // const dist1 = sdD(vec3.scale(pos, 1 / scale), r) * scale;
  // const dist2 = sdE(vec3.subtract(vec3.scale(pos, 1 / scale), vec3.create(-1, 0, 0)), r) * scale;
  // return Math.min(dist1, dist2);

  
  const letters: Array<[(p: Vec3, r: number) => number, Vec3]> = [
    [sdE, vec3.create(-2.1, 0, 0)],
    [sdD, vec3.create( -1.0, 0, 0)],
    [sdD, vec3.create( 0.0, 0, 0)],
    [sdI, vec3.create( 1.0, 0, 0)],
    [sdE, vec3.create( 2.0, 0, 0)],
  ];

  let minDist = 1e20;
  const posScaled = vec3.scale(pos, 1 / scale);
  for (const [sdFunc, offset] of letters) {
    const pOffset = vec3.subtract(posScaled, offset);
    const dist = sdFunc(pOffset, r)*scale;
    minDist = Math.min(minDist, dist);
  }
  return minDist;
}



const epsilon = 0.0001;
const epsXPos = vec3.create(epsilon, 0, 0);
const epsYPos = vec3.create(0, epsilon, 0);
const epsZPos = vec3.create(0, 0, epsilon);
const epsXNeg = vec3.create(-epsilon, 0, 0);
const epsYNeg = vec3.create(0, -epsilon, 0);
const epsZNeg = vec3.create(0, 0, -epsilon);
function sdfNormal(pos: Vec3): Vec3 {
  // SPHERE
  // return vec3.normalize(pos);


  // sdf gradient by central differences

  const dx = sdf(vec3.add(pos, epsXPos)) - sdf(vec3.add(pos, epsXNeg));
  const dy = sdf(vec3.add(pos, epsYPos)) - sdf(vec3.add(pos, epsYNeg));
  const dz = sdf(vec3.add(pos, epsZPos)) - sdf(vec3.add(pos, epsZNeg));

  return vec3.normalize(vec3.create(dx, dy, dz));
}
export { sdf, sdfNormal };