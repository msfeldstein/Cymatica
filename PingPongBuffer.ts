import { Framebuffer, Regl, TextureImageData } from "regl"

export type PingPongBuffer = Framebuffer[]
export function makePingPongBuffer(regl: Regl, data: TextureImageData, size: number) : PingPongBuffer {
    return (Array(2)).fill(null).map(() =>
      regl.framebuffer({
        colorType: "float",
        color: regl.texture({
          radius: size,
          data: data,
          type: 'float',
          // We need nearest to ensure we don't interpolate between values
          mag: 'nearest',
          min: 'nearest',

        }),
        depthStencil: false
      }))
  }