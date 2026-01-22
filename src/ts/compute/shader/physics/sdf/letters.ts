import { primitiveSDFsSrc } from "./primitives";

export const letterSDFsSrc = /* wgsl */`
${primitiveSDFsSrc}

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


fn sdH(p: vec3<f32>, r: f32) -> f32 {
    let c1 = sdCapsule(
        p,
        vec3<f32>(0.3, -0.5, 0.0),
        vec3<f32>(0.3,  0.5, 0.0),
        r
    );

    let c2 = sdCapsule(
        p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>(-0.3,  0.5, 0.0),
        r
    );

    let c3 = sdCapsule(
        p,
        vec3<f32>(-0.3, 0.0, 0.0),
        vec3<f32>( 0.3, 0.0, 0.0),
        r
    );

    return min(c1, min(c2, c3));
}

fn sdI(p: vec3<f32>, r: f32) -> f32 {
    let c1 = sdCapsule(
        p,
        vec3<f32>(0.0, -0.5, 0.0),
        vec3<f32>(0.0,  0.5, 0.0),
        r
    );
    let c2 = sdCapsule(
        p,
        vec3<f32>(-0.3, 0.5, 0.0),
        vec3<f32>( 0.3, 0.5, 0.0),
        r
    );
    let c3 = sdCapsule(
        p,
        vec3<f32>(-0.3, -0.5, 0.0),
        vec3<f32>( 0.3, -0.5, 0.0),
        r
    );
    return min(c1, min(c2, c3));
}



`;