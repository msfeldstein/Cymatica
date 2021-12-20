import { Regl } from "regl";
import { DataStep } from "../steps/datastep";
import { randomDisc } from "../initializers/random";
import { zero } from "../initializers/zero";
import { PingPongBuffer, StaticBuffer } from "../gl/Buffers";
import { drawLines } from "../renderers/drawLines";
import { drawPoints } from "../renderers/drawPoints";
import updatePositionShader from "../steps/updatePosition.glsl";
import updateVelocityShader from "../steps/updateVelocity.glsl";
import forceShader from "../steps/force.glsl";
import { colorFromPos } from "../initializers/colorFromPos";

export default function (
  regl: Regl,
  color: number[],
  terminalVelocity: number
) {
  const RADIUS = 1024;

  const initialPositions = randomDisc(RADIUS, 0.1);
  const positions = new PingPongBuffer(regl, RADIUS, RADIUS, initialPositions);
  const velocities = new PingPongBuffer(regl, RADIUS, RADIUS, zero(RADIUS));
  const colors = colorFromPos(initialPositions)

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

  const force = DataStep(
    regl,
    {
      inputs: { positions, velocities },
      output: velocities,
    },
    forceShader,
    {
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

  const draw = drawPoints(regl, positions, colors, {
    pointSize: 1
  });

  let mouse = [-4, -4];
  window.addEventListener("pointermove", (e) => {
    mouse[0] = (e.clientX / window.innerWidth) * 2 - 1;
    mouse[1] = (e.clientY / window.innerHeight) * -2 + 1;
  });

  return () => {
    // force();
    updateVelocity({
      gravityCenter: mouse,
    });
    updateVelocity2({
      gravityCenter: [-mouse[0], -mouse[1]],
    });
    updatePosition();
    draw({
      color,
    });
  };
}
