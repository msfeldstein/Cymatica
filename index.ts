import Regl from "regl";
import { blit } from "./blit";
import { PingPongBuffer } from "./PingPongBuffer";

import blackhole from "./processes/blackhole";
import eye from "./processes/eye";

const regl = Regl({ extensions: "oes_texture_float" });

const fbo = new PingPongBuffer(regl, window.innerWidth, window.innerHeight);

const blitFbo = blit(regl);
// const draw = eye(regl)
const draw = blackhole(regl, [1.0, 1.0, 1.0, 0.4], 15);

regl.frame(() => {
  fbo.write().use(() => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
      stencil: 0,
    });
    // blitFbo({
    //   texture: fbo.read(),
    //   fade: 0.1
    // });
    draw();
  });
  fbo.swap();

  blitFbo({
    texture: fbo.read(),
    fade: 0
  });
});
