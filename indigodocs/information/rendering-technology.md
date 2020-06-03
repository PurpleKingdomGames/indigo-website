---
id: rendering-technology
title: Rendering Technology
---

At the time of writing, there are 5 options for rendering 2D graphics into a browser, if you're so inclined:

1. HTML + CSS + SVG
2. 2D Canvas page element
3. WebGL 1.0
4. WebGL 2.0
5. WebGPU (not yet released to the general public)

## Indigo uses WebGL

Indigo has been principally designed to render against WebGL 2.0 for the simple reason that it offers the best hardware accelerated API that is supported by _a good_ range of browsers, and they represent a good proportion of the market.

Unfortunately WebGL 2.0's adoption by the browser manufacturors hasn't been what we hoped, here's a great site showing the state of play:

[https://webglstats.com/](https://webglstats.com/)

At the time of writing, about 59% of desktop users (according to that site) support WebGL 2.0. However, according to the same site, about 97% of _all_ browsers (not just desktop) support WebGL 1.0.

## Indigo's Renderer

By default, Indigo will attempt to detect whether WebGL 2.0 is supported and if not, will fall back to a WebGL 1.0 renderer.

The WebGL 1.0 render is not feature complete in relation to the WebGL 2.0 version, and probably never will be (we moved to WebGL 2.0 for a reason!). We do hope to bring them closer together over time. Examples of things that the WebGL 1.0 renderer simply ignores currently are clones, dynamic lighting, distortions and all but the most basic effects.

Having said that, the WebGL renderer - basic as it is - is suitable for a wide range of games, you just need to be a bit creative!

You can force Indigo to only use WebGL 1.0 or 2.0 in the configuration options.

## Future implementations

Indigo can theoretically support any number of renderer implementations and the scene description is well separated from the rendering implementation, we just happen to have WebGL 1.0 and 2.0 support at the moment.

Some browser manufacturors seem to be holding out for WebGPU, but it's very much [a work in progress](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status). We intend to support it sooner or later.

There are no plans to support an HTML or Canvas based renderers at the moment, but there's no reason technically why we couldn't do that if someone wanted to add that functionality.
