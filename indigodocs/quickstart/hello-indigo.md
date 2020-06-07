---
id: hello-indigo
title: Hello, Indigo!
---

This is a quick start tutorial to help you build something with Indigo.

There is a [repository](https://github.com/PurpleKingdomGames/hello-indigo) that goes with this guide, please note that you can follow the games progression by looking through the commits.

## Choose your game API style

Indigo comes with three game templates. Called entry points, they are just traits you extend that help give your game some shape, and can be described as:

1. `IndigoSandbox` - The smallest API interface, great for trying things out, doesn't scale as well and is missing some functionality.
2. `IndigoDemo` - Technically gives you access to everything, but doesn't provide Scene management (you'd have to roll your own).
3. `IndigoGame` - Like demo, but with Scene management built it.

>You can also write you're own entry point, take a look at the code for IndigoSandbox in the repo.

In this guide, we'll be using `IndigoSandbox` for brevity and our "game" will be called `helloindigo`.

>Reminder: The sandbox is limited in what it can do, and it geared towards briefly trying things out without the clutter of the two larger interfaces.

## "Hello, Indigo!"

We'll skip over the initial project set up and assume that you followed the [set up guide](setup-and-configuration.md), or have [checked out the repo](https://github.com/PurpleKingdomGames/hello-indigo) for reference.

Here is our starting point:

```scala
import indigo._
import scala.scalajs.js.annotation.JSExportTopLevel

@JSExportTopLevel("IndigoGame")
object HelloIndigo extends IndigoSandbox[Unit, Unit] {

  val config: GameConfig =
    GameConfig.default

  val animations: Set[Animation] =
    Set()

  val assets: Set[AssetType] =
    Set()

  val fonts: Set[FontInfo] =
    Set()

  def setup(
      assetCollection: AssetCollection,
      dice: Dice
  ): Startup[StartupErrors, Unit] =
    Startup.Success(())

  def initialModel(startupData: Unit): Unit =
    ()

  def updateModel(
      context: FrameContext,
      model: Unit
  ): GlobalEvent => Outcome[Unit] =
    _ => Outcome(())

  def present(
      context: FrameContext,
      model: Unit
  ): SceneUpdateFragment =
    SceneUpdateFragment.empty

}
```

A lot of this is self explanatory hopefully, but let's go through a couple of the more note worthy points.

The `indigo._` import is optional, but conveniently brings in all of the basic syntax so that you don't need to worry about finding things.

```scala
import scala.scalajs.js.annotation.JSExportTopLevel
@JSExportTopLevel("IndigoGame")
```

Indigo games are Scala.js projects. We've worked hard to make Indigo feel as much like a normal Scala project as possible, however, we do need a hook for the page. If you're using the standard Indigo Mill or SBT plugins, you _must_ name your game "IndigoGame" or it won't work. Once you move to your own page embed you can call it whatever you like!

```scala
object HelloIndigo extends IndigoSandbox[Unit, Unit]
```

`IndigoSandbox` takes two type parameters that define your start up data type, and the type of your model. Later on we'll introduce a real model, but for now we're just using `Unit` to say "I'm not using these".

Everything else is just filling in the blanks to make it compile. Note the use of `Unit` all over the place, to match the type parameters on the trait. Also most types in Indigo try to provide sensible defaults such as `GameConfig.default` and `SceneUpdateFragment.empty`, so it's always worth checking the companion object.

### Running the demo - a blank screen!

Assuming you have [Mill](http://www.lihaoyi.com/mill/) and http-server set up as the [guide](setup-and-configuration.md) suggests, to run the demo, do the following from your command line:

```bash
mill helloindigo.buildGame
```

Which will generate output similar to:

```bash
> mill helloindigo.buildGame
(...)
[44/46] helloindigo.indigoBuildJS
dirPath: /Users/(...)/hello-indigo/out/helloindigo/indigoBuildJS/dest
Copying assets...
/Users/(...)/hello-indigo/out/helloindigo/indigoBuildJS/dest/index.html
[46/46] helloindigo.buildGame
```

Then do:

1. `cd /Users/(...)/hello-indigo/out/helloindigo/indigoBuildJS/dest/`
2. `http-server -c-1`
3. Navigate to [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in your browser of choice.

## Putting something on the screen

Assuming you've got the same assets as the demo repo (note that you can change the asset source folder in the build settings!).

Replace:

```scala
val assets: Set[AssetType] =
  Set()
```

with:

```scala
val assetName = AssetName("dots")

val assets: Set[indigo.AssetType] = Set(
  AssetType.Image(assetName, AssetPath("assets/dots.png"))
)
```

This tells indigo to load your image asset and file it away for future reference. To recall it when needed, you give it an `AssetName`.

Next replace:

```scala
SceneUpdateFragment.empty
```

with:

```scala
SceneUpdateFragment(
  Graphic(Rectangle(0, 0, 32, 32), 1, Material.Textured(assetName))
)
```

Note the use of `assetName` again to identify which image you want to use.

Graphic is a member of the `SceneGraphNode` types, which also include things like `Sprite`, `Text`, `Group`, and `Clone`. Please note that most of these have a range of constructors to try and make using them easier, and all of them follow a fluent API design to modify their parameters.

Run the demo again and you should see a graphic in the top left corner at position `(0,0)`!

It's quite small though... so come back to you code and replace `GameConfig.default` with:

```scala
val magnification = 3

val config: indigo.GameConfig =
  GameConfig.default.withMagnification(magnification)
```

Indigo is built for pixel art, and will automatically scale up not just your graphics, but also things like mouse positions. You just have to build your game as if the game was running at a 1:1 pixel ratio and Indigo will do the rest.

## What else can `Graphic`s do?

Graphic are relatively cheap on-screen objects, but their unique party trick is being able to crop their contents. Update this:

```scala
SceneUpdateFragment(
  Graphic(Rectangle(0, 0, 32, 32), 1, Material.Textured(assetName))
)
```

to:

```scala
SceneUpdateFragment(
  Graphic(Rectangle(0, 0, 32, 32), 1, Material.Textured(assetName)),
  Graphic(Rectangle(0, 0, 32, 32), 1, Material.Textured(assetName))
    .withCrop(Rectangle(16, 16, 16, 16))
    .withRef(8, 8)
    .moveTo(config.viewport.giveDimensions(magnification).center)
)
```

Run it again and you should now have just the yellow circle right in the middle of the screen. The image is 32x32, and we've cropped down to the bottom right corner which is at location 16x16 and is 16x16 pixels in size. We've then moved the "reference point" which is the point Indigo used to position, scale, and rotate things to being in the middle of the new graphic, i.e. 8x8. Finally we moved it to the middle of the screen. Normally the top left of the image would now be at the screen's center, but because we moved the reference point, the graphic is placed evenly over the mid point.

## Let's make the dot move

We're going to make the dot move using a `Signal`. Signals are powerful but a bit complicated, so we're going to use it here just to show you them in action and get rid of it again in the next step.

Replace:

```scala
.moveTo(config.viewport.giveDimensions(magnification).center)
```

with:

```scala
.moveTo(
  Signal
    .Orbit(config.viewport.giveDimensions(magnification).center, 30)
    .map(_.toPoint)
    .at(context.gameTime.running)
)
```

Signals are just a function from `t:Time => A`. This code uses an inbuilt Signal called Orbit that rotates around a point at a fixed distance based on the current time.

```text
Question: Orbit looks a bit simple, what if you wanted it to rotate slower or faster?

Answer: Slow down or speed up time!
```

Stepping through the code, we request an Orbit signal that rotates around the center of the screen at a distance of 30 pixels. The signal produces a `Vector2` so we have to map that to a `Point` because Indigo insists that everything is drawn on a whole pixel. Finally we tell the signal what time it is, and it produces the value we want: A point to move our dot to.

## Time matters

Before we move on, if you're new to game dev, it's worth noting the importance of that last bit. All movement in your real game should be based on time, one way or another.

Consider how we might move something along the x-axis:

```scala
graphic.moveBy(10, 0)
```

Every time that code is run, it will increment the graphic's x position by 10. Great! our games runs at 60 frames per second (FPS) so we're going to move at a velocity of 600 pixels per second. Or are we?

The problem is the frame processing times vary, meaning that at _best_ you'll get 60 FPS / 600 pixels movement, but more likely your frame rate will fluctuate, peaking at 60 and occasionally dropping lower, maybe for a minor GC pause, maybe because you suddenly had a massive bit of processing to do for your game.

Either way the result is that your x-axis movement is no longer smooth.

The solution is to do this:

```scala
graphic.moveBy(600 * time delta in seconds, 0)
```

That is, we say that we want a velocity of 600 pixels per second, but multiply that 600 by the fraction of a second since the last frame update. At 60 FPS, `600 * 0.01666 = 9.996` i.e near as makes no odds the 10 pixel movement we wanted, while at a dip to 55 FPS we get `600 * 0.01818 = 10.908`, meaning that you move a little further to make up for lost time.

## It isn't a game, if you can't play with it.

Time to turn our animation into something you can fiddle with, if not exactly "play".

Please note that you can see the [real diff here](https://github.com/PurpleKingdomGames/hello-indigo/commit/ca6f16c09c0d1be29da960dc26a9b7b5e8198bab).

### Remembering things

So far, we've just been drawing things, and we haven't needed to remember anything in order to decide what to draw or where it should go on the screen, and that's been fine.

As soon as you need to start remembering things, you need to use a `Model` or a `ViewModel`.

The idea of the `Model` is that it should be about storing the _abstract version of your game_ meaning that it has no concept of pixels or screen dimensions of or anything like that. The `Model` should normally be decoupled from the view and all view logic (other than the view reading the model). Normally a save game would be generated from the model only.

Sometimes though, you need to remember things in screen space, concrete details about positions and animation states, and in those cases you use a `ViewModel`. Conversely, a `ViewModel` should not hold any data you wouldn't mind losing, i.e. presentation data only, no game data.

**One limitation of the Sandbox is that it has no `ViewModel`, so we're going to have to immediately break our rule a bit.**

### Adding interaction

What we're going to do is make it so that the screen starts empty (apart from our graphic in the corner), and when you click the screen, a yellow dot is put into orbit at the distance you clicked.

To do that we're going to need a simple model, so let us define some case classes to hold our data.

Add this to the bottom of your file:

```scala
case class Model(center: Point, dots: List[Dot]) {
  def addDot(dot: Dot): Model =
    this.copy(dots = dot :: dots)

  def update(timeDelta: Seconds): Model =
    this.copy(dots = dots.map(_.update(timeDelta)))
}
object Model {
  def initial(center: Point): Model = Model(center, Nil)
}
case class Dot(orbitDistance: Int, angle: Radians) {
  def update(timeDelta: Seconds): Dot =
    this.copy(angle = angle + Radians.fromSeconds(timeDelta))
}
```

Notes:

1. We've got an `initial` model definition - got to start somewhere!
2. For convenience we've got an `addDot` method on the model
3. We've also got an simple update function that cascades through our model objects propagating the time delta we talked about earlier.

Angles are measured in Radians, if you're not used to Radians then the `Radian` class has a `fromDegrees` function ...but you're a game developer now! Learn about radians!

For Maths magic, you can't do better than [Freya Holmér's twitter feed](https://twitter.com/FreyaHolmer), [here](https://twitter.com/FreyaHolmer/status/1202648662049996801) and [especially here](https://twitter.com/FreyaHolmer/status/1173752820954214400?s=20) is how Radians work for example.

I digress: Let's set up our model.

First you need to tell Indigo what class you're using for your Model like so:

```scala
object HelloIndigo extends IndigoSandbox[Unit, Unit] {
```

becomes:

```scala
object HelloIndigo extends IndigoSandbox[Unit, Model] {
```

Then we need to give Indigo the empty or first version of our model.

Replace:

```scala
def initialModel(startupData: Unit): Unit =
  ()
```

with:

```scala
def initialModel(startupData: Unit): Model =
  Model.initial(
    config.viewport.giveDimensions(magnification).center
  )
```

And then we need to update it, replace:

```scala
def updateModel(
    context: FrameContext,
    model: Unit
): GlobalEvent => Outcome[Unit] =
  _ => Outcome(())
```

with

```scala
def updateModel(
    context: FrameContext,
    model: Model
): GlobalEvent => Outcome[Model] = {
  case MouseEvent.Click(x, y) =>
    val adjustedPosition = Point(x, y) - model.center

    Outcome(
      model.addDot(
        Dot(
          Point.distanceBetween(model.center, Point(x, y)).toInt,
          Radians(
            Math.atan2(
              adjustedPosition.x.toDouble,
              adjustedPosition.y.toDouble
            )
          )
        )
      )
    )

  case FrameTick =>
    Outcome(model.update(context.delta))

  case _ =>
    Outcome(model)
}
```

The model update function is just a function that has been partially applied with the context of this frame, and then a big pattern match on the event types.

>`GlobalEvent` is a trait used to tag things as events. The largest source of errors / surprises in Indigo - in my experience so far - is from the fact that we can't exhaustively check these events at the moment. There are some ideas about how to improve that in a future release.

In this case, we're interested in two events. A `MouseEvent.Click(x, y)` so that we can add a new dot, and a `FrameTick`. FrameTick is a bit special because it always happens last.. and it always happens!

When a mouse click is noticed, we call our `addDot` method with a new Dot, providing the orbital distance and the angle from the center of the screen two the point where we clicked the mouse.

Notice that everything is wrapped in an `Outcome`. An `Outcome[A]` is a Monad that holds a new state `A` and can also capture any events that are the ...outcome... of processing part of a frame. `Outcome`s can be composed together in lots of useful ways.

Finally we need to draw something, replace:

```scala
    SceneUpdateFragment(
      Graphic(Rectangle(0, 0, 32, 32), 1, Material.Textured(assetName)),
      Graphic(Rectangle(0, 0, 32, 32), 1, Material.Textured(assetName))
        .withCrop(Rectangle(16, 16, 16, 16))
        .withRef(8, 8)
        .moveTo(config.viewport.giveDimensions(magnification).center)
    )
```

with:

```scala
SceneUpdateFragment(
  Graphic(Rectangle(0, 0, 32, 32), 1, Material.Textured(assetName))
).addGameLayerNodes(
  drawDots(model.center, model.dots)
)

def drawDots(
    center: Point,
    dots: List[Dot]
): List[Graphic] =
  dots.map { dot =>
    val position = Point(
      (Math.sin(dot.angle.value) * dot.orbitDistance + center.x).toInt,
      (Math.cos(dot.angle.value) * dot.orbitDistance + center.y).toInt
    )

    Graphic(Rectangle(0, 0, 32, 32), 1, Material.Textured(assetName))
      .withCrop(Rectangle(16, 16, 16, 16))
      .withRef(8, 8)
      .moveTo(position)
  }
```

Run it, and hopefully clicking on the screen will add yellow dots!

If it doesn't work, remember you can always [compare with the repo](https://github.com/PurpleKingdomGames/hello-indigo).
