import { Regl } from "regl";
import { blit } from "../blit";
import { DataStep } from "../datastep";
import { initEye } from "../initializers/eye";
import { randomDisc } from "../initializers/random";
import { zero } from "../initializers/zero";
import { PingPongBuffer } from "../PingPongBuffer";
import { drawPoints } from "../renderers/drawPoints";
import { drawLines } from "../renderers/drawLines";
import updatePositionShader from "../updatePosition.glsl";
import updateVelocityShader from "../updateVelocity.glsl";
import noise from "../noise.glsl"

export default function (regl: Regl) {
  const RADIUS = 512;

  const eyeInfo = new PingPongBuffer(regl, RADIUS, RADIUS, initEye(RADIUS));
  const positionOut = new PingPongBuffer(regl, RADIUS, RADIUS, initEye(RADIUS));

  const updatePosition = DataStep(
    regl,
    {
      inputs: { eyeInfo },
      output: positionOut,
    },
    `precision mediump float;
    uniform sampler2D eyeInfo;
    uniform float time;
    varying vec2 uv;

    ${noise}

    void main() {
      vec4 eyeInfo = texture2D(eyeInfo, uv);
      float r = eyeInfo.x * 0.8;
        float theta = eyeInfo.y;
        float rand = eyeInfo.z;

        theta += (rand - 0.5) * 0.1 * (1.0 - r);
        theta += cnoise(vec2(theta * 10.0, r * 5.0 - time )) * 0.1 * (1.0 - r);
        vec4 p = vec4(
            r * cos(theta),
            r * sin(theta),
            0.0,
            1.0
        );
      gl_FragColor = p;
    }`,
    {
        // @ts-ignore
        time: regl.prop("time")
    }
  );

  const draw = drawPoints(regl, positionOut);
  const drawL = drawLines(regl, positionOut);

  let mouse = [-4, -4];
  window.addEventListener("pointermove", (e) => {
    mouse[0] = (e.clientX / window.innerWidth) * 2 - 1;
    mouse[1] = (e.clientY / window.innerHeight) * -2 + 1;
  });
  const start = Date.now()

  return () => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
      stencil: 0,
    });

    updatePosition({
        time: (Date.now() - start) / 1000
    });
    draw();
    // drawL()
  };
}
