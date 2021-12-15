
precision mediump float;
uniform sampler2D positions;
uniform sampler2D velocities;
uniform vec2 gravityCenter;
uniform float gravityAmount;
varying vec2 uv;
void main() {
  vec4 v = texture2D(velocities, uv);
  vec4 p = texture2D(positions, uv);
  float d = distance(p.xy, gravityCenter);
  vec2 dir = gravityCenter - p.xy;
  float r2 = d * d;
  float f = 1.0 / r2;
  v.xy += f * dir * 0.1;
  // v.xy += 0.0001;
  gl_FragColor = v;
}