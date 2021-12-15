import { DataStep } from "./datastep";
import { drawPoints } from "./drawPoints";
import  {random, randomDisc } from "./initializers/random";
import { zero } from "./initializers/zero";
import { makePingPongBuffer } from "./PingPongBuffer";
import updatePositionShader from "./updatePosition.glsl"
import updateVelocityShader from "./updateVelocity.glsl"


const regl = require("regl")({ extensions: "oes_texture_float" });
const RADIUS = 1024;

const positions = makePingPongBuffer(regl, randomDisc(RADIUS, 0.1), RADIUS);
const velocities = makePingPongBuffer(regl, zero(RADIUS), RADIUS);

const updateVelocity = DataStep(
  regl,
  {
    inputs: {positions, velocities },
    output: velocities
  },
  updateVelocityShader, {
    gravityCenter: regl.prop("gravityCenter")
  }
)
const updatePosition = DataStep(
  regl,
  {
    inputs: { positions, velocities },
    output: positions,
  },
  updatePositionShader
);

const draw = drawPoints(regl, positions)

let mouse = [-4, -4]
window.addEventListener('pointermove', (e) => {
  mouse[0] = e.clientX / window.innerWidth * 2 - 1
  mouse[1] = e.clientY / window.innerHeight * -2 + 1
})
regl.frame(() => {

  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0
  })
  updateVelocity({
    gravityCenter: mouse
  })
  updatePosition()
  draw()
})
