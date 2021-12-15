precision mediump float;
uniform sampler2D positions;
uniform sampler2D velocities;
varying vec2 uv;
void main() {
  vec4 v = texture2D(velocities, uv);
  vec4 p = texture2D(positions, uv);
  p.xyz += v.xyz * 0.001;
  gl_FragColor = p;
}