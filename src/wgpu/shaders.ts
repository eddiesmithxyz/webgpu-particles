const shaders = /* wgsl */`
struct VertexOut {
    @builtin(position) position : vec4f,
    @location(0) colour : vec4f
}

@vertex
fn vertex_main(@location(0) position : vec4f, @location(1) colour : vec4f) -> VertexOut {
    var output : VertexOut;
    output.position = vec4<f32>(position.x * 0.8, position.y * 0.8, position.z, position.w);
    output.colour = colour;
    return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
    return fragData.colour;
}

`;


export { shaders };