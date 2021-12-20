import { Regl, Texture } from "regl";
import { PingPongBuffer } from "./PingPongBuffer";

export function blit(regl: Regl) {
  return regl({
    primitive: "triangles",
    vert: `
        precision mediump float;
        attribute vec2 position;
        varying vec2 uv;
        void main() {
          uv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0, 1);
        }
      `,

    frag: `
        precision mediump float;
        varying vec2 uv;
        uniform sampler2D texture;
        uniform float fade;

        void main(){
          vec4 color = texture2D(texture, uv) -vec4 (vec3(fade), 0.0);
            gl_FragColor = color;
        }
      `,

      blend: {
        enable: false
      },

    depth: {
      enable: true,
    },

    uniforms: {
      texture: regl.prop("texture"),
      fade: regl.prop("fade")
    },

    attributes: {
      position: [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, 1],
        [1, -1],
      ],
    },

    count: 6,
  });
}
