precision mediump float;
uniform sampler2D positions;
uniform sampler2D velocities;
uniform float terminalVelocity;
varying vec2 uv;
void main() {
  vec4 v = texture2D(velocities, uv);
  v.x += 0.02;
  v.x = clamp(v.x, -terminalVelocity, terminalVelocity);
  gl_FragColor = v;
}