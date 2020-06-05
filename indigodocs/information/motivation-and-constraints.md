---
id: motivation-and-constraints
title: Motivation & Constraints
---

## Motivation

There were two drivers for building Indigo:

1. Building games is hard, and testing games is harder... but does it have to be?
2. Can we build a game engine for functional programmers that is fun and productive?

The reason testing games is hard is the perception that they are random, and their behaviour non-deterministic by default, but this doesn't have to be the case.

Indigo encodes the idea of a frame update into one single, pure, stateless, immutable function. The new frame is always predictably the direct outcome of the values it was supplied at the beginning of the update. Even apparently random elements are in fact pseudo-random.

On of the aims of Indigo is to make frame updates referentially transparent. Of course, this depends on the game programmer. If they put a `Random` in the middle there isn't much we can do about it! (Use the `Dice` instead!)

To further increase reliability and code correctness, Indigo is written in Scala in order to take full advantage of it's relatively advanced type checker.

Indigo is not an FRP engine, and does not force a particular programming model on the developer. A game programmer could write "Scala-Java" or as close to pure FP code as Scala allows. To further empower the developer, the engine has very few dependencies, so mixing in a library like Cats or Scalaz should be no problem at all.

## Creative Constraints and subsequent limitations

There is a piece of general wisdom in the gaming community that can be summarised as:

> Never build your own game engine.

Why not? Well a lot of people who decide to build game engines actually start out intending to build a game. They then get bogged down in building an engine instead, because it takes absolutely ages, and never get around to building their game.

There is only one reason to build a game engine that people seem to agree on: There isn't already another one out there that does the very -very- specific thing you wanted from your engine.

What we wanted was a game engine that:

1. Supported Mac and Linux based development as a first class citizen;
2. Was a code only engine, we didn't want a big graphical editor;
3. Used a statically typed functional programming language to build it's games;
4. Was accessible, easy to understand and fun.

We looked hard at the options available, and started work on Indigo when we realised there wasn't anything else that quite fit our needs.

But building a game engine is not a small problem, games engines do a lot of different things like networking, asset management, rendering, sound, storage, and animation to name but a few.

The only way to stand a chance of completeing the work was the build the bare minimum by imposing contraints on what the first cut of the engine would be able to do and how it would work, including but not limited to:

1. Scala only - A full blooded FP language with a mac / linux friendly ecosystem.
2. 2D only - with pixel art as a first class citizen specifically.
3. Browser only - avoid platform purmutation issues.
4. No fonts - simplified text support.
5. No custom shaders - most people don't need them.

So if you look at indigo and wonder why something that might be standard in other engines isn't present, it is probably because it wasn't considered a bare minimum!

## Pixel art

Indigo is aimed primarily at Pixel Art! Why Pixel Art? Well, two reasons:

1. Pixel Art is relatively cheap to produce, and done well - like any other style - is still a wonderfully expressive graphical style. It's not about technical restrictions, it's about being able to make fun games efficiently.
1. If you want to make a AAA title with photo-realistic graphics or even a superslick 2D games and you have the resources to do that, there are better tools out there for the job! Pixel art requires us to build games that are _good games to play_ in spite of a limited visual style, games that draw people in because they are engaging, not because you can see every wrinkle on a characters face. Not unlike board games.

Forcing the engine to be aimed at pixel art has created a few interesting design outcomes:

1. Your game can be magnified. You design and code it to work on a 1 to 1 pixel scale, increase the magnification and everything goes with it. For instance, mouse positions and clicks are rescaled to remain accurate to your graphics.
1. Perfect pixel rendering. The whole engine works on whole pixels, and the shaders are written to render beautifully crisp, whole pixels.
