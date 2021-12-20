import { Framebuffer, Regl } from "regl";
import { PingPongBuffer } from "./PingPongBuffer";

// positions is an FBO containing the x,y,vx,vy of each particle in a float pixel
export function drawPoints(regl: Regl, positions: PingPongBuffer) {
  // @ts-ignore
  const dataSize = positions.read().width;
  // points is just an indexing array containing 1-N
  const points = new Array(dataSize * dataSize).fill(null).map((x, i) => i);
  return regl({
    primitive: "points",
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
    frag: `
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,

    vert: `
      precision mediump float;
      attribute float index;
      uniform float time;
      uniform sampler2D positions;
      uniform float dataSize;
      
      void main() {
        vec2 posDataPosition = vec2(
          mod(index, dataSize) / dataSize,
          floor(index / dataSize) / dataSize
        );
        vec4 pos = texture2D(positions, posDataPosition);
        gl_Position = pos;
        gl_PointSize = 1.0;
      }`,

    attributes: {
      index: regl.buffer(points),
    },

    uniforms: {
      positions: () => positions.read(),
      dataSize: dataSize,
      color: regl.prop("color")
    },
    count: dataSize * dataSize
  });
}
