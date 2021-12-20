import { Regl } from "regl";
import { randomDisc } from "../initializers/random";
import { PingPongBuffer, StaticBuffer } from "../PingPongBuffer";
import { drawPoints } from "../renderers/drawPoints";

export default function (
  regl: Regl,
) {
  const positions = new PingPongBuffer(regl, 1,2, 
    [0,0,0,1,
    .1,.1,0,1]);

  const colors = [
      1,0,0,1, //
    0,1,0,1]

  const draw = drawPoints(regl, positions, colors, {
      pointSize: 100
  });

  return () => {
    draw();
  };
}
