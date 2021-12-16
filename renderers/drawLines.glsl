
precision mediump float;
attribute float index;
uniform float time;
uniform sampler2D positions;
uniform float dataSize;
attribute float ends;
varying float a;
void main() {
    vec2 posDataPosition = vec2(
        mod(index, dataSize) / dataSize,
        floor(index / dataSize) / dataSize
    );
    vec4 pos = texture2D(positions, posDataPosition);
    pos.xyz += ends * pos.xyz * 0.1;
    a = 1.0 - ends;
    gl_Position = pos;
    gl_PointSize = 2.0;
}