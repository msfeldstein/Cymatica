import { Framebuffer2D, Regl, Texture, TextureImageData } from "regl"
export class PingPongBuffer {
  fbos: Framebuffer2D[] = []
  textures: Texture[] = []
  private swapped = false
  constructor(regl: Regl, width: number, height: number, data: TextureImageData | undefined = undefined) {
    for (var i = 0; i < 2; i++) {
      const tex = regl.texture({
        width,
        height,
        data: data,
        type: 'float',
        // We need nearest to ensure we don't interpolate between values
        mag: 'nearest',
        min: 'nearest',
      })
      this.textures.push(tex)
      const fbo = regl.framebuffer({
        colorType: "float",
        color: tex,
        depthStencil: false
      });
      this.fbos.push(fbo)
      if (!data) fbo.use(() => {
        regl.clear({
          color: [0, 0, 0, 1],
          depth: 1,
          stencil: 0,
        });
      })
    }
  }

  swap() {
    this.swapped = !this.swapped
  }

  read() {
    return this.textures[this.swapped ? 0 : 1]
  }

  write() {
    return this.fbos[this.swapped ? 1 : 0]
  }
}
