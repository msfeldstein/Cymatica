
precision mediump float;
uniform sampler2D positions;
uniform sampler2D velocities;
uniform vec2 gravityCenter;
uniform float gravityAmount;
uniform float terminalVelocity;
varying vec2 uv;
void main() {
  vec4 v = texture2D(velocities, uv);
  vec4 p = texture2D(positions, uv);
  float d = distance(p.xy, gravityCenter);
  vec2 dir = gravityCenter - p.xy;
  float mass = p.z;
  float r2 = d * d;
  float f = 1.0 / r2 * gravityAmount * (1.0 + 0.001 * mass);
  v.xy += f * dir * 0.1 ;
  v.xy = clamp(v.xy, vec2(-1.0 * terminalVelocity), vec2(terminalVelocity));
  // v.xy += 0.0001;
  gl_FragColor = v;
}