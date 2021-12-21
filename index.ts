import Regl from "regl";
import { blit } from "./postprocess/blit";
import blur from "./postprocess/blur";
import { PingPongBuffer } from "./gl/Buffers";

import blackhole from "./processes/blackhole";
import eye from "./processes/eye";
import testBlend from "./processes/testBlend";
import sacred from "./processes/sacredgeometry";

const regl = Regl({ extensions: "oes_texture_float" });

const main = async function () {
  const fbo = new PingPongBuffer(regl, window.innerWidth, window.innerHeight);

  const blitFbo = blit(regl);
  const blurFbo = blur(regl, fbo);
  // const draw = eye(regl)
  // const draw = blackhole(regl, [1.0, 1.0, 1.0, 0.4], 15);
  const draw = await sacred(regl);
  // const draw = testBlend(regl)

  regl.frame(() => {
    fbo.write().use(() => {
      regl.clear({
        color: [0, 0, 0, 1],
        depth: 1,
        stencil: 0,
      });
      // blitFbo({
      //   texture: fbo.read(),
      //   fade: 0.5
      // });
      draw();
    });
    fbo.swap();
    blitFbo({
      texture: fbo.read(),
      fade: 0,
    });
    // blurFbo({
    //   texture: fbo.read(),
    //   resolution: [window.innerWidth, window.innerHeight]
    // })
  });
};

main()