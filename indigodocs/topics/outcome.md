---
id: outcome
title: Outcome Type
---

## What is an Outcome?

The `Outcome` type is one you'll see a lot.

At the end of updating the model or the view model, you must always produce an Outcome. An Outcome is the combination of an updated piece of state, and a list of `GlobalEvent`s that updating the state produced.

For example, let's say you update your game's model, and it turns out that the player has lost the game somehow. You might need to do two things:

1. Update the model to reflect the fact that the player's turn is over - perhaps calculating the final score.
1. Emit a `JumpTo(SceneName("game over"))` event to tell Indigo to render the Game Over screen.

This could be described in an Outcome as follows:

```scala
Outcome(model.copy(totalScore = calculateFinalScore(...)))
  .addGlobalEvents(JumpTo(GameOverScene.name))
```

Outcome isn't optional and isn't expected to fail, so you can always retrieve the state and global events it contains by simply accessing them:

```scala
outcome.state
outcome.globalEvents
```

## Examples of Operations on Outcomes

There are lots of ways to manipulate Outcomes, and all of them preserve the events contained in each Outcome.

### Basic operations

An Outcome behaves much like other Monadic types in Scala, bias towards the state it holds rather than the events. Some basic operations are below:

```scala
Outcome(10)                                // Outcome(10)
Outcome(10).map(_ * 20)                    // Outcome(200)
Outcome(10).ap(Outcome((i: Int) => i * 5)) // Outcome(50)
Outcome(10).flatMap(i => Outcome(i * 20))  // Outcome(200)
Outcome(10).merge(Outcome(20))(_ + _)      // Outcome(30)
Outcome("a") |+| Outcome("b")              // Outcome(("a", "b"))
```

`Outcome`'s map function is an alias for `mapState[A]`, but you can also modify the events with `mapGlobalEvents`.

Sequencing can be done as follows:

```scala
import Outcome._

List(Outcome(1), Outcome(2), Outcome(3)).sequence // Outcome(List(1, 2, 3))
```

## Creating events based on the state

Sometimes, you need to reference the new state to decide if we should emit an event:

```scala

val newState = Foo(count = 10)
val events = if(newState.count > 5) List(PlaySound("tada", Volume.Max)) else Nil

Outcome(newState)
  .addGlobalEvents(events)
```

But this is boring and requires the creation of a couple of variables. The thing to observe is that this scenario is about creating events based on the _updated_ state rather than the original state. Instead, you can do this:

```scala
Outcome(Foo(count = 10))
  .createGlobalEvents(foo => if(foo.count > 5) List(PlaySound("tada", Volume.Max)) else Nil)
```
