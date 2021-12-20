import { Framebuffer, Regl } from "regl";
import { PingPongBuffer } from "../PingPongBuffer";
//@ts-ignore
import vert from "./drawLines.glsl"
// @ts-ignore
import frag from "./drawLinesFrag.glsl"
console.log({frag})
// positions is an FBO containing the x,y,vx,vy of each particle in a float pixel
export function drawLines(regl: Regl, positions: PingPongBuffer) {
  // @ts-ignore
  const dataSize = positions.read().width;
  // points is just an indexing array containing 1-N * 2 for start and end of each line
  const idx = new Array(dataSize * dataSize * 2).fill(null).map((x, i) => Math.floor(i / 2));
  // iterate between 0 and 1 for the start(0) and end(1) of each line
  const ends = new Array(dataSize * dataSize * 2).fill(null).map((x, i) => i % 2);

  return regl({
    primitive: "lines",
    blend: {
      enable: true,
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 'src alpha',
        dstRGB: 'one minus src alpha',
        dstAlpha: 'one minus src alpha',
      },
    },
    depth: {
      enable: false,
    },
    frag: frag,

    vert: vert,

    attributes: {
      index: regl.buffer(idx),
      ends: regl.buffer(ends)
    },

    uniforms: {
      positions: () => positions.read(),
      dataSize: dataSize
    },
    count: dataSize * dataSize
  });
}
