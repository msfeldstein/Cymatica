import blur from "./blur";
import blit, { fillRect } from "./blit"
import { DataStep } from "./datastep";
import { random, randomDisc } from "./initializers/random";
import { zero } from "./initializers/zero";
import { makePingPongBuffer } from "./PingPongBuffer";
import updatePositionShader from "./updatePosition.glsl";
import updateVelocityShader from "./updateVelocity.glsl";
import Regl from "regl"
import { drawLines } from "./renderers/drawLines";
const regl = Regl({ extensions: "oes_texture_float" });
const RADIUS = 1024;

const positions = makePingPongBuffer(regl, randomDisc(RADIUS, 0.1), RADIUS);
const velocities = makePingPongBuffer(regl, zero(RADIUS), RADIUS);

const fboTex = regl.texture({
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  wrap: "clamp",
})
const fbo = regl.framebuffer({
  color: fboTex,
  depth: false,
});

const updateVelocity = DataStep(
  regl,
  {
    inputs: { positions, velocities },
    output: velocities,
  },
  updateVelocityShader,
  {
    gravityCenter: regl.prop("gravityCenter"),
    terminalVelocity: 10.0
  }
);
const updatePosition = DataStep(
  regl,
  {
    inputs: { positions, velocities },
    output: positions,
  },
  updatePositionShader
);

const draw = drawLines(regl, positions, fbo);
const blitFbo = blit(regl, fboTex)
const fade = fillRect(regl, fboTex)

let mouse = [-4, -4];
window.addEventListener("pointermove", (e) => {
  mouse[0] = (e.clientX / window.innerWidth) * 2 - 1;
  mouse[1] = (e.clientY / window.innerHeight) * -2 + 1;
});
fbo.use(() => {

  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0,
  });
})
regl.frame(() => {
  fbo.use(() => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
      stencil: 0,
    });
    updateVelocity({
      gravityCenter: mouse,
    });
    updatePosition();
    draw();
  })
  blitFbo({
    resolution: [window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio]
  })
});
