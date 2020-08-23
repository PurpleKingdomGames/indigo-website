---
id: development-status
title: Indigo's Development Status
---

> Indigo version 0.3.0 was released on the 23th of August 2020, and should be considered to be in an "alpha" state i.e. We believe it's useful, but we expect issues will emerge through use.

## Can I use Indigo to build my game?

Yes! At this stage, we think it would be particularly suitable for small titles, prototypes, and [game jams!](https://itch.io/jams/upcoming)

We'd love you to try building your game in Indigo and let us know how you get on. After several years development, and the building of countless demos and small test games, we have every reason to believe it will work as expected.

## Known Unknowns

What we know that we don't know yet, are Indigo's limits.

We have a fair idea about things like general graphics [performance and how to squeeze more rendering juice out of it](information/performance.md), but we don't yet have a full view on what issues will emerge on titles that aren't necessarily graphically complex, but include a serious amount of gameplay logic or content.

A gentle word of caution then: As Indigo has only recently had it's first general release and is "unproven" on games of any serious complexity, we expect that things will need to change as people start to use it in anger. No doubt we've missed things, and the APIs are not as clear or consistent as we'd like them to be. Certainly the documentation needs expansion. There's bound to be the odd quirk we haven't noticed yet, or performance issues in scenarios we haven't considered.

Please consider lending a hand by [reporting or submitting fixes for any issues you come across!](https://github.com/PurpleKingdomGames/indigo/issues)

## How "complete" is Indigo?

The current release of Indigo is really only the foundation.

Game engines have to do a broad range of jobs to meet the needs of general purpose game development, and we believe Indigo covers most of them, including things like graphics, sound, input management, and networking for example. There are some things that Indigo doesn't do, like physics, either because a) we felt they were "nice to have" features rather than being absolutely essential or b) in some cases it simply wasn't clear how they fit Indigo's architectural principles and we wanted to spend more time thinking about it.

Development across the breath of features has been uneven. Since Indigo is unusual in the way it works, some areas of the code, like the main scene processing pipeline, have had huge amounts of time spent on them. Other areas by contrast are probably shockingly naive because we did the simple thing, saw that it worked, moved on, and have had no reason to revisit them.

We would be grateful if you highlighted any areas you feel need improvement by [raising an issue](https://github.com/PurpleKingdomGames/indigo/issues) or getting involved with development!
