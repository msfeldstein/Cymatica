
precision mediump float;
uniform sampler2D positions;
uniform sampler2D velocities;
uniform sampler2D originalPositions;
uniform float gravityAmount;
uniform float terminalVelocity;

varying vec2 uv;
void main() {
  vec4 v = texture2D(velocities, uv);
  vec4 p = texture2D(positions, uv);
  vec4 originalPosition = texture2D(originalPositions, uv);
  float d = distance(p.xy, originalPosition.xy);
  vec2 dir = originalPosition.xy - p.xy;
  float r2 = d * d;
  float f = 1.0 / r2 * gravityAmount * 2.0;
  v.xy += f * dir * 0.1;
  v.xy = clamp(v.xy, vec2(-1.0 * terminalVelocity), vec2(terminalVelocity));
  if (d < 0.3 && gravityAmount > 0.5) {
    v.x *= 0.5;
  }
  // v.xy += 0.0001;
  gl_FragColor = v;
}