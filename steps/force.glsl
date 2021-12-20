precision mediump float;
uniform sampler2D positions;
uniform sampler2D velocities;
varying vec2 uv;
void main() {
  vec4 v = texture2D(velocities, uv);
  v.x += 0.01;
  gl_FragColor = p;
}