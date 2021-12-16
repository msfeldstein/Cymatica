import { Framebuffer, Regl } from "regl";
import { PingPongBuffer } from "./PingPongBuffer";

// positions is an FBO containing the x,y,vx,vy of each particle in a float pixel
export function drawPoints(regl: Regl, positions: PingPongBuffer, fbo: Framebuffer) {
  // @ts-ignore
  const dataSize = positions[0].width;
  // points is just an indexing array containing 1-N
  const points = new Array(dataSize * dataSize).fill(null).map((x, i) => i);
  return regl({
    framebuffer: fbo,
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
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 0.2);
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
        gl_PointSize = 2.0;
      }`,

    attributes: {
      index: regl.buffer(points),
    },

    uniforms: {
      positions: ({ tick }) => positions[tick % 2],
      dataSize: dataSize
    },
    count: dataSize * dataSize
  });
}
