---
id: rendering-technology
title: Rendering Technology
---

At the time of writing, there are five options for rendering 2D graphics into a browser page, if you are so inclined:

1. HTML + CSS + SVG
2. 2D Canvas page element
3. WebGL 1.0
4. WebGL 2.0
5. WebGPU (not yet released)

## Indigo uses WebGL

Indigo has been principally designed to render against WebGL 2.0 for the simple reason that it offers the best hardware accelerated API that is supported by a _good_ range of browsers, and they represent a good proportion of the market that we think are likely to be interested in playing games made with Indigo.

Admittedly, WebGL 2.0's adoption by the browser manufacturers has been slow, here's a great site showing the state of play:

[https://webglstats.com/](https://webglstats.com/)

At the time of writing, about 59% of _desktop_ users (according to that site) support WebGL 2.0. However, according to the same site, about 97% of _all_ browsers (not just desktop) support WebGL 1.0.

## Indigo's Renderer

By default, Indigo will attempt to detect whether WebGL 2.0 is supported, and if not, will fall back to a WebGL 1.0 renderer.

You may wonder how much of a loss to quality and performance the fall back is. In our tests of [the cursed pirate demo](https://twitter.com/davidjamessmith/status/1225182606192447488?s=20), there was no perceivable difference, other than a minor missing effect on the loading screen.

The WebGL 1.0 renderer is not feature complete in relation to the WebGL 2.0 version however, and probably never will be an exact match (we moved to WebGL 2.0 for a reason!). We do hope to bring them closer together over time. Moving from WebGL 2.0 down to 1.0 is lossy. Where features are supported they are identical, where they aren't they are simply ignored. Examples of things that the WebGL 1.0 renderer ignores currently are clones, dynamic lighting, distortions and all but the most basic effects.

Having said that, the WebGL 1.0 renderer - basic as it is - is suitable for a wide range of games, you just need to be a bit more creative!

You can force Indigo to only use WebGL 1.0 or 2.0 (or the default 2.0 falling back to 1.0) in the configuration options.

## Future implementations

Indigo can theoretically support any number of renderer implementations as the scene description is well separated from the rendering implementation, we just happen to have WebGL 1.0 and 2.0 support at the moment.

Some browser manufacturers seem to be holding out for WebGPU, but it's very much [a work in progress](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status). We intend to support it sooner or later if possible.

There are no plans to support an [HTML or Canvas based renderers](http://buildnewgames.com/dom-sprites/) at the moment, but there is no [technical reason why we couldn't](http://buildnewgames.com/assets/article//dom-sprites/dom-sprite-demo.html).
