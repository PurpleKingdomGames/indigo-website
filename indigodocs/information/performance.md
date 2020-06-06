---
id: performance
title: Performance
---

## What is performance?

**Lets get one thing clear:** Indigo is not the fastest 2D game engine out there. Not even close. It might even be the slowest! We don't know and we don't care.

When people talk about game engine performance, they are usually talking about how many things it can do at once. If that's what you need and value - perfectly understandable - but Indigo probably isn't for you.

The way massive performance is achieved is by utilizing things like mutable data structures, reusing allocated memory to keep usage constant, insisting on never creating new objects, and multithreading.

All of that takes great care but can lead to high performance! ...and lots of bugs!

What if you could build games with an expectation of no bugs? Games that you _know_ work before you play them because you can bring to bear an advanced type system, refinement types, property based testing and any other code quality tool you can think of?

Couldn't developer productivity be considered a type of performance too?

_Please note: You're still going to have to play your game at some point. No automated test suite in the world will tell you if you've made something fun or not!_

## Is it fast enough?

Having establishing that you're never going to get [a billion triangles](https://www.unrealengine.com/en-US/blog/a-first-look-at-unreal-engine-5) though Indigo - what can you expect? Is the performance "good enough"?

Well, two perhaps disappointing observations about 2D games:

1. Most 2D games on the market actually have less than a 1000 things on screen at any one time - there's only so much screen real estate!
2. Most game logic is quite straight forward. The complexity is in how the elements interact.

If that's your benchmark then yes, absolutely, Indigo is easily fast enough without you have to do anything clever or special and still being able to hit 60 frames per second.

### Start on the assumption that it will be fast enough

In general, you should start by assuming Indigo will be fast enough. Build your game using good functional programming practices, and write your tests. You should only consider changing things if it really isn't fast enough when you test it. Remember that it's always easier to make clean, well written code faster, than trying to improve the performance of something messy.

## How to get more speed

Depending on what kind of things you're doing, you can make Indigo do more in less time.

Indigo is single threaded and runs in the browser. JavaScript code execution these days is very fast, and your game logic draining CPU power is probably not a concern, nor is available memory.

**Your main enemy in the quest for performance is memory allocation and subsequent garbage collection pauses.**

As mentioned earlier, the mantra of "real" game devs is to never allocate memory / create new objects during a frame. Ever. Indigo is build on Scala offering up an immutable API, so we're going to be making new objects _all the time_.

Generally your performance will suffer the more things you add to the screen. Our goal is to get the same effect by doing less work. Here are a few tips for squeezing out some extra juice.

### Measure twice, cut once

Modern browsers have amazing profile tools built into them these days. Get to know them by recording the performance of your running game, and then look for evidence of where you're creating things like GC pauses and what the culprits are.

If you aren't improving the slowest bottleneck of your game code, you aren't improving anything.

### Render batch size

>WebGL 2.0 only!

There is a batch size option in the main game config that you can tweak, it relates to the maximum number of renderable items that are bundled up before draw is called. It's a trade off: Bigger batches mean more memory usage but fewer calls to the graphics card.

In general fiddling will only affect games with a lot of scene elements.

### Automata

Automata a great fun, and a very convenient way to fire of short lived little entities with simple life cycles e.g. the points that appear above a characters head when they pick up a coin.

However, they can allocate a lot because the structures they use to make them fun and easy to use, are _not_ the most light weight way to solve the problem.

#### Tweak the pool size

A simple way to improve performance - depending on the circumstances - is to reduce the default pool size that controls how many automaton's can be alive at any one time. If your effect isn't mission critical, allow less of them.

#### SubSystems vs Automata

An Automata system is just a SubSystem. If you need simple particles in high volumes and are prepared to manage the state yourself, you can write much leaner code by hand by rolling your own `SubSystem`, especially in combination with clones.

### Use Clones

>WebGL 2.0 only!

Clones are Indigo's version of "instancing". Say you want to render lots (lots and lots and lots!) of things that are more or less identical, such as blades of grass or tiles in a tile map, you should consider using clones.

With clones, you set up a reference object (that you can update as you like), and then tell indigo to render many more of them. This shortcuts a lot of processing in the pipeline and allows for vast numbers of things to be drawn at the cost of a lack of variety.

Clone batches can also be declared static for even more performance, if they never change.

A recent test ran 10,000 animated clones at 60fps alongside other screen elements.

### Cache values

May seem obvious but some values are just expensive to work out. Object boundaries, particularly text, can be very expensive to calculate. If you (as the game programmer) know that a value is going to be used a lot but is never going to need to be recalculated, consider storing it and looking it up next time. In the example of boundaries, a good place might be as part of the view model.

### Consider the cost of different primitives

Different types of primitives have different costs, here they are ranked from cheapest to most expensive:

1. Clone - Unintelligent copies of things.
2. Graphic - bounds require no calculation, they have no clever inner workings and process no events.
3. Sprite - processes events, has animation state to update, bounds must be recalculated each time.
4. Text - no state, but processes events which are based on ver expensive bounds calculations.
5. Group - no state, no events, but bounds calculation is based on the contents - so can be big.

#### Reuse animations

One way to reduce the cost of animated elements is to reuse them!

**Scenario:**

If you have a number of background elements, say, and it's acceptable for all of them to be in on the same animation loop at the exact same position (e.g. you have a forest and 25% of the trees are identical), but you want to be able to interact with them individually (ruling out clones).

1. Establish a master sprite;
2. Give all of the sprites the same animation key;
3. Only update the animation of the master sprite;
4. All the others will be animated identically but with no processing cost.

#### Cache groups

If you have a big `Group` of static things, cache it in your view model and reuse it.

#### Manually accept interactions on Graphics

Graphics do not accept events / interactions in the same way that Sprites and Text do. This is to reduce the processing cost of graphics allow you to have a lot more of them on the screen.

For one off interactive elements though, you can avoid using a Sprite by mimicking the event handler behavior manually. For example, you can check the mouse position and whether or not it was clicked within graphics node's very cheap to calculate bounds during the view presentation function.

### Use UpdateList

Split expensive calculation work over multiple frames. This is probably unusual since it's a CPU rather than a memory issues, but worth mentioning.

**Scenario:**

You're writing a farming game and have a massive grid of crops to update. You can reduce the drawing overhead using some of the techniques previously mentioned, but what about updating them all?

To help with the time element, you could use a `TimeVaryingValue` that will automatically advance the value of the crops for a given time. However, updating all the elements is expensive - perhaps your calculation has to decide what's happening to the crop based on many conditions.

If you wrap your crops up in an `UpdateList` you can specific an update pattern, for example you could update 25% of the crops this frame, and 25% on each of the next three subsequent frames until they're all done. As long as your calculation is time based, and the accuracy of when you need to know the crops are ready is acceptable to be within 4 frames of the actual completion time, you can quarter your per frame processing costs.

> Note that you're still allocating for the whole grid! The assumption here is that it isn't the memory but the cost of calculating the next state that is causing your performance problems.
