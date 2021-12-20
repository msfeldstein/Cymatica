import { Framebuffer, Regl } from "regl";
import { StaticBuffer, TextureProvider } from "../gl/Buffers";
import { PingPongBuffer } from "../gl/Buffers";

// positions is an FBO containing the x,y,vx,vy of each particle in a float pixel
export type DrawPointsOpts = {
  pointSize?: number
}
export function drawPoints(regl: Regl, positions: PingPongBuffer, colors : Array<number>, opts: DrawPointsOpts = {}) {
  // @ts-ignore
  const w = positions.read().width;
  const h = positions.read().height

  // points is just an indexing array containing 1-N
  const points = new Array(w * h).fill(null).map((x, i) => i);
  return regl({
    primitive: "points",
    blend: {
      enable: true,
      func: {
        src: 'one',
        dst: 'one',
      },
    },
    depth: {
      enable: false,
    },
    frag: `
    precision mediump float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }`,

    vert: `
      precision mediump float;
      attribute float index;
      attribute vec4 color;
      varying vec4 vColor;
      uniform float time;
      uniform sampler2D positions;
      uniform float stride;
      uniform float pointSize;
      
      void main() {
        vec2 posDataPosition = vec2(
          mod(index, stride) / stride,
          floor(index / stride) / stride
        );
        vec4 pos = texture2D(positions, posDataPosition);
        gl_Position = pos;
        vColor = color;
        gl_PointSize = pointSize;
      }`,

    attributes: {
      index: regl.buffer(points),
      color: regl.buffer(colors)
    },

    uniforms: {
      positions: () => positions.read(),
      stride: w,
      pointSize: opts.pointSize || 2,
    },
    count: w * h
  });
}
