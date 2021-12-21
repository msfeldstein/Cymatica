# Cymatica

Cymatica is a particle playground to quickly experiment with high performance, large particle systems.  It uses GPGPU techniques to keep everything on the GPU to handle large amounts of particles.

The goal is to make this like lego blocks for high powered particle systems so we can easily experiment with different forces, and set up initial conditions that make the particles draw beautiful patterns for us.

## How it works

Information about particles (positions, colors, velocity, mass) get [initialized](/processes/blackhole.ts#L20-L21) and stored in Buffers that get uploaded to the GPU.  Those buffers get processed by [DataSteps](/steps/datastep.ts) which are shader programs that pass all the particles through a shader and output new values for one of the buffers.

One example of this is [updating the velocity, and then position](/processes/blackhole.ts#L25-L61), to simulate newtonian phsyics.  In the blackhole simulation we have two gravity wells (the mouse, and a mirrored mouse position) so we do two updateVelocity passes to write out a new velocity, and then have an update position shader that [takes in the position and velocity, and writes out a new position](/processes/blackhole.ts#L57-L58).

Once all the buffers have new particle attribute data we just [draw them to the screen as points](/processes/blackhole.ts#L63-L65), or we can use that data to draw something more complicated, like [lines that stretch out from the center](/main/renderers/drawLines.ts).  Right now it just draws in 2d but could easily be expanded to 3d.

We can also do optional post-processing for [zoom-blur](/postprocess/blur.ts) or [trails](/index.ts#L27-L30).

## Buffer representation

Particle information is stored in an image float-texture with each pixel representing values for the particle at that index.

These buffers are either [standard textures](/gl/Buffers.ts#L7-L25) for unchanging data, or [ping-pong buffers](/gl/Buffers.ts#L28-L71) for textures that change.  Ping-pong buffers are a technique used when you need to read in from a buffer in order to write new values to itself.  Since you can't read a texture while you're writing to it, we represent it with two textures, and read from the old values texture while writing into the new texture.

## Datastep representation

In userspace, datasteps get written as shaders