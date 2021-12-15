import { Regl } from "regl"
import { PingPongBuffer } from "./PingPongBuffer"
// Step forward a set of fbos using a fragment shader with
// previous data in a 'prevData' sampler

export type DatastepOpts = {
    inputs: {[key: string]: PingPongBuffer},
    output: PingPongBuffer
}
export function DataStep(regl: Regl, opts: DatastepOpts, shader, uniforms = {}) {
    const inputs = {
      time: () => regl.now()
    }
    console.log(opts.inputs)

    for (let key in opts.inputs) {

      inputs[key] = ({tick}) =>opts.inputs[key][tick % 2]
      inputs[key + 'Width'] = opts.inputs[key][0].width
      inputs[key + 'Height'] = opts.inputs[key][0].height
    }
    console.log("U", Object.assign(inputs, uniforms))
  
    return regl({
      primitive: 'triangles',
      framebuffer: ({tick}) => opts.output && opts.output[(tick + 1) % 2],
      vert: `
        precision mediump float;
        attribute vec2 position;
        varying vec2 uv;
        void main() {
          uv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0, 1);
        }
      `,
      
      frag: shader,
  
      attributes: {
        position: [[-1, -1], [-1, 1], [1, 1], [-1, -1], [1, 1], [1, -1]]
      },
      
      uniforms: Object.assign(inputs, uniforms),
  
      count: 6
    })
  }