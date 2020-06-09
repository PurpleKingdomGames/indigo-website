---
id: subsystems
title: SubSystems
---

## What SubSystems are

`SubSystem`s are a way of breaking part of your game off into mini-games. They offer you a means of encapsulation for certain kinds of game system.

Here is their interface:

```scala
trait SubSystem {
  type EventType
  val eventFilter: GlobalEvent => Option[EventType]
  def update(context: FrameContext): EventType => Outcome[SubSystem]
  def render(context: FrameContext): SceneUpdateFragment
}
```

Typically a subsystem is made from a class or case class that extends this trait. They manage their own state*, and can produce renderable output or just sit and process things in the background. Either way their only mechanism for interacting with the main game is through the event loop.

>*This means they are somewhat impure. Given the limited scope they operate in, not only is this not a big problem and doesn't hugely impact your ability to reason about them, but makes them rather nice to work with as they're very self contained. However, we may look at moving to a pattern similar to the way `Scene`s work in the future.

As an example, consider this simple and arguably nonsense subsystem that tracks a score:

```scala
final case class PointsTrackerExample(points: Int) extends SubSystem {
  type EventType = PointsTrackerEvent

  val eventFilter: GlobalEvent => Option[PointsTrackerEvent] = {
    case e: PointsTrackerEvent => Option(e)
    case _                     => None
  }

  def update(context: FrameContext): PointsTrackerEvent => Outcome[SubSystem] = {
    case PointsTrackerEvent.Add(pts) =>
      Outcome(this.copy(points = points + pts))

    case PointsTrackerEvent.LoseAll =>
      Outcome(this.copy(points = 0))
        .addGlobalEvents(GameOver)
  }

  def render(context: FrameContext): SceneUpdateFragment =
    SceneUpdateFragment.empty
      .addGameLayerNodes(Text(points.toString, 0, 0, 1, FontKey("my font")))
}

sealed trait PointsTrackerEvent extends GlobalEvent with Product with Serializable
object PointsTrackerEvent {
  case class Add(points: Int) extends PointsTrackerEvent
  case object LoseAll         extends PointsTrackerEvent
}

case object GameOver extends GlobalEvent
```

SubSystems are really useful for doing nice bits of encapsulated work in that add that all important sense of polish to your game, but that you'd rather not have polluting your main game logic. For example: You might like to have a system of clouds floating through the sky, or a pinball score counter rattling up - they look great - but as purely visual effects the do not represent important data (in terms of saving your game state) and can be handled independently of your main game.

The Indigo Extras module contains SubSystems that give you two really helpful SubSystems: Automata for particle-like effects, and an "Asset Bundle Loader" that can be used for dynamically loading new assets during your game.

## How SubSystems work

Indigo's APIs are an exercise in composition, and if we ignore the state for a moment, the functions of a frame is approximately:

```scala
def update: context => Outcome
def render: context => SceneGraphUpdate
```

Which is exactly what you can see in the trait definition above. Yes, the standard entry points for indigo look more complicated, but really they all boil down to this.

Importantly, the context is immutable and the result types are monoidal.

This means we can imagine doing something like this and execute our frame:

```scala
// All the outcomes
(context) =>
  game.update(context) |+| subsystem1.update(context) |+| subsystem2.update(context)

// All the scene framements
(context) =>
  game.render(context) |+| subsystem1.render(context) |+| subsystem2.render(context)
```

That isn't accurate or the full picture by any means, but hopefully it gives you a sense of how Indigo puts things together.
