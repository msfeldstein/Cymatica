import { Regl } from "regl";
import { DataStep } from "../datastep";
import { randomDisc } from "../initializers/random";
import { zero } from "../initializers/zero";
import { PingPongBuffer } from "../PingPongBuffer";
import { drawLines } from "../renderers/drawLines";
import { drawPoints } from "../renderers/drawPoints";
import updatePositionShader from "../updatePosition.glsl";
import updateVelocityShader from "../updateVelocity.glsl";

export default function (regl: Regl, color: number[], terminalVelocity: number) {
  const RADIUS = 1024;

  const positions = new PingPongBuffer(regl, RADIUS, RADIUS, randomDisc(RADIUS, 0.1));
  const velocities = new PingPongBuffer(regl, RADIUS, RADIUS, zero(RADIUS));

  const updateVelocity = DataStep(
    regl,
    {
      inputs: { positions, velocities },
      output: velocities,
    },
    updateVelocityShader,
    {
      //@ts-ignore
      gravityCenter: regl.prop("gravityCenter"),
      terminalVelocity,
    }
  );

  const updateVelocity2 = DataStep(
    regl,
    {
      inputs: { positions, velocities },
      output: velocities,
    },
    updateVelocityShader,
    {
      //@ts-ignore
      gravityCenter: regl.prop("gravityCenter"),
      terminalVelocity,
    }
  );
  const updatePosition = DataStep(
    regl,
    {
      inputs: { positions, velocities },
      output: positions,
    },
    updatePositionShader
  );

  const draw = drawPoints(regl, positions);

  let mouse = [-4, -4];
  window.addEventListener("pointermove", (e) => {
    mouse[0] = (e.clientX / window.innerWidth) * 2 - 1;
    mouse[1] = (e.clientY / window.innerHeight) * -2 + 1;
  });

  return () => {
    updateVelocity({
      gravityCenter: mouse,
    });
    updateVelocity2({
      gravityCenter: [-mouse[0], -mouse[1]],
    });
    updatePosition();
    draw({
      color
    });
  };
}
