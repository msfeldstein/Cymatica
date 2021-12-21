import { Regl } from "regl";
import { DataStep } from "../steps/datastep";
import { randomDisc } from "../initializers/random";
import { zero } from "../initializers/zero";
import { PingPongBuffer, StaticBuffer } from "../gl/Buffers";
import { drawLines } from "../renderers/drawLines";
import { drawPoints } from "../renderers/drawPoints";
import updatePositionShader from "../steps/updatePosition.glsl";
import updateVelocityShader from "../steps/updateVelocity.glsl";
import returnToShapeShader from "../steps/returnToShape.glsl"
import forceShader from "../steps/force.glsl";
import { colorFromPos } from "../initializers/colorFromPos";
import { fromSvg } from "../initializers/svg";
import svg from "bundle-text:../initializers/svgs/sacred.svg";

export default async function (regl: Regl) {
  const RADIUS = 1024;
  const { positions, colors, count } = await fromSvg(svg, RADIUS, RADIUS);
  
  const radius = Math.ceil(Math.sqrt(positions.length / 4))
  const originalPositions =  new StaticBuffer(regl, radius, radius, positions)
  const velocities = new PingPongBuffer(regl, radius, radius, zero(radius));
  const positionBuffer = new PingPongBuffer(regl, radius, radius, positions);
console.log("Made pos")
  const updateVelocity = DataStep(
    regl,
    {
      inputs: { positions: positionBuffer, velocities },
      output: velocities,
    },
    updateVelocityShader,
    {
      //@ts-ignore
      gravityCenter: regl.prop("gravityCenter"),
      terminalVelocity: 10,
      //@ts-ignore
      gravityAmount: regl.prop("gravityAmount"),
    }
  );

  const updateVelocity2 = DataStep(
    regl,
    {
      inputs: { positions: positionBuffer, velocities },
      output: velocities,
    },
    updateVelocityShader,
    {
      //@ts-ignore
      gravityCenter: regl.prop("gravityCenter"),
      terminalVelocity: 10,
      //@ts-ignore
      gravityAmount: regl.prop("gravityAmount"),
    }
  );

  const returnToShape = DataStep(
    regl,
    {
      inputs: { positions: positionBuffer, velocities, originalPositions },
      output: velocities,
    },
    returnToShapeShader,
    {
      //@ts-ignore
      terminalVelocity: 10,
      //@ts-ignore
      gravityAmount: regl.prop("gravityAmount")
    }
  );

  const updatePosition = DataStep(
    regl,
    {
      inputs: { positions: positionBuffer, velocities },
      output: positionBuffer,
    },
    updatePositionShader
  );

  const draw = drawPoints(regl, positionBuffer, {
    pointSize: 1,
    colors,
    count,
  });

  let mouse = [-4, -4];
  window.addEventListener("pointermove", (e) => {
    mouse[0] = (e.clientX / window.innerWidth) * 2 - 1;
    mouse[1] = (e.clientY / window.innerHeight) * -2 + 1;
  });

  let mousedown = 0;
  window.addEventListener("mousedown", () => (mousedown = 1));
  window.addEventListener("mouseup", () => (mousedown = 0));

  return () => {
    updateVelocity({
      gravityCenter: mouse,
      gravityAmount: mousedown,
    });
    updateVelocity2({
      gravityCenter: [-mouse[0], -mouse[1]],
      gravityAmount: mousedown,
    });

    returnToShape({
      gravityAmount: 1 - mousedown
    })
    updatePosition();
    draw({});
  };
}
