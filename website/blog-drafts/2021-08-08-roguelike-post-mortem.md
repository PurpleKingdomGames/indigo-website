---
title: Post-Mortem: "RoguelikeDev Does The Complete Roguelike Tutorial" in Scala(.js)
author: Dave Smith
authorURL: http://twitter.com/davidjamessmith
---

!["A early screenshot of a roguelike made with Indigo"](https://raw.githubusercontent.com/davesmith00000/roguelike-tutorial/main/part3/roguelike-part3_2.gif)
_(A screen shot from part 3 of the roguelike tutorials.)_

**This is a brief write-up of how my attempt to do the ["RoguelikeDev Does The Complete Roguelike Tutorial"](https://www.reddit.com/r/roguelikedev/comments/o5x585/roguelikedev_does_the_complete_roguelike_tutorial/) in Scala went.**

I've been asked on several occasions if it would be possible to build a roguelike using Indigo. My answer has always been that yes, it could be done, but that it would probably be challenging because Indigo isn't built for rendering lots of text.

About a month before this year's annual "RoguelikeDev Does The Complete Roguelike Tutorial" I was asked again, and decided it was time to find out whether or not Indigo could handle this type of game.

<!--truncate-->

## Starting at the finish

### Where can I play it?

[All 13 parts of the roguelike tutorials](http://rogueliketutorials.com/) can be found in the following repo, along with playable links so that you can try out it's progression for yourself:

[https://github.com/davesmith00000/roguelike-tutorial](https://github.com/davesmith00000/roguelike-tutorial)

### What should I expect?

[The final playable version of the "game"](https://davesmith00000.github.io/roguelike-tutorial/part13/) is surprisingly playable.. for a while at least. :-)

Sure, the lack of game balance is quickly apparent and after about level 6 or 7 you'll run out of new things to do, but I'm really quite pleased with it. There's exploration, discovery, spells, potions, equipment, monsters, levels, an inventory, and menus - all the things in the tutorial! And considering I spent _no time at all_ selecting colors or which tileset to go with, it actually looks quite nice!

The code quality is.. ok.

When I began the project I had some lofty ideas about writing lovely clean code that was easy to follow, but as you can see if you look at the code base, by the end I was just pleased to be crossing the finishing line at the end of the marathon!

Maybe I'll refactor it next year..

## The tutorial

The tutorial is very well written and the "RoguelikeDev Does The Complete Roguelike Tutorial" follow-along is well paced taking me two to three evenings a week.

The difficulty with the tutorial is that it is aimed at Python developers, and as they say in the follow-along's description, if you're not using Python the expectation is that you'll blaze your own trail.

Two problems quickly became apparent.

The first is simply distilling the tutorial parts into the intended deliverables. The tutorials are written for Python developers, and they have a lovely conversational style, building a narrative as they go along. The authors take great care to go over code from previous parts - refactoring ready for the next section. Of course, if you're not a Python developer the result ,in places, is a lot of text to sift through to find the information you need - luckily the screenshots were a massive help here!

The second is the lack of ready-made tooling.

## Tooling

The Python version uses a library called [tcod](https://python-tcod.readthedocs.io/en/latest/) which basically gives you all of the functionality you need to build a roguelike, and your job in the tutorial is to build the game logic and data structures.

Following along in another language means you need to fend for yourself. In my case I ended up building a [roguelike starter kit](https://github.com/PurpleKingdomGames/indigo-roguelike-starterkit) to fill in some of the gaps.

The [README](https://github.com/PurpleKingdomGames/indigo-roguelike-starterkit/blob/main/README.md) on the starter kit's repo explains most of the functionality that the starter kit provides in a fair amount of detail, but the main things it does is:

1. Give you easy access to Dwarf Fortress assets.
2. Provide two ways of rendering coloured terminal-like text.

Dwarf Fortress is a very famous roguelike with [many different tilesets available](https://dwarffortresswiki.org/Tileset_repository). They are all based on the "IBM Code Page 437" or "Extended ASCII" table, and what you get is an image of a grid of characters and symbols. The starter kit uses a little compile time script to convert the tileset of your choice, into pre-baked classes containing all of the character information for use with either Indigo's `Text` primitive using the `TerminalText` material, or the `TerminalEntity`/`TerminalEmulator`.

It wasn't terribly difficult, but this little bit of tool sharpening was very satisfying to do and made the rest of the build much more fun.

## Lessons Learned

### What went well?

Taking the time to build the starter kit paid itself back many times over. Once I get into the game building I basically never had to think about how to do the rendering again.

Scala really works well with type of game, which has a lot of data structures that lend themselves to case classes and ADTs.

Converting the tutorial to pure functions and Indigo's uni-directional data flow was challenging at times, but made reasoning about the code easy, and in the few places where I really needed tests, it was easy to set them up. I didn't write very many tests however, because most of the game was plumbing that required little checking beyond making the compiler happy. Testing came into it's own wherever something non-trivial needed to be verified, such as path finding.

The tutorial descriptions of topics like procedural dungeon generation were really great and easy to follow.

### What went wrong?

I repeatedly underestimated the size of the tutorial!

Each chapter often does more than one thing and I was regularly halfway through a section when I realised I was going to have to do something much more complicated than I anticipated, or that I was fundamentally missing some piece of functionality / tooling.

Another unexpected problem was that the tutorials rely on a feature of game engines that Indigo considers a defect, and fixes by default. In Indigo you cannot modify the state of another actor during the current frame, or to put it another way, there is no "first mover" advantage to having the good fortune of being the first entity updated. Consider the following:

1. The Player attacks an Orc
2. The Orc is killed
3. The Orc cannot attack the Player because it's dead.

Seems reasonable.

In Python this translates easily:

1. On update, the Player attacks an Orc, directly calling it's damage method.
2. The Orc's health is reduced and it is killed.
3. ... that's it.

In Indigo things are not so simple, because in reality the combatants effectively both atacked at the same time in the same instant! Like this:

1. On update, the Player attacks the Orc, emitting an event with the amount of damage to be inflicted.
2. The Orc's health has not yet been reduced, so the Orc is still alive during the update.
3. The Orc attacks! It gets one last gasping attempt at killing the Player! The Orc also emits an event saying the Player has been damaged.
4. On the next frame, the damage is inflicted on both entities.
5. The Orc is killed as before... but the Player has been unexpectedly injured or killed too!

### What would I do differently next time?

My main regret is that the terminal emulator is rather heavy and can't be refreshed at 60 fps. For the purposes of the tutorial this isn't a problem since you only have to update on key press, but if you wanted to do any smoother effects it wouldn't be able to keep up. The other way this problem rears it's head is if someone is running a low power system, since it requires the ability to allocate some fairly chunky arrays on the GPU.

There are lots of ways to resolve this problem, I would have liked to have had the time to make it better.

Additionally I'd like to wrap up the starter kit into a library of some sort for ease of use by others.

## Final thoughts

Following the tutorial was great fun and I would highly recommend it.

That said, converting the tutorial to a purely functional language / approach often meant completely ignoring what the tutorial was saying, and trying to achieve the same outcome by totally different means. This would be very difficult if you didn't know your engine well in advance.

Hopefully the version I've pulled together will help the next adventurous soul that decides to have a go!
