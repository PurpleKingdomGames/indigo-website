# Time & Temporal Values

### Bonus: Time Varying Values

`TimeVaryingValue` are stateful little constructs that you need to call the update function on yourself every frame tick.

However, they're very useful! An easy example:

You have a little lumber jack, he walks over to a tree and is now going to cut to down. Work is effort over time, so you have a `TimeVaryingValue` like this in your model:

```scala
val woodChoppingProcess: TimeVaryingValue =
  TimeVaryingValue(0, gameTime.running) // No progress, starting now.

final case class LumberJack(chopWood: TimeVaryingValue, working: Boolean) {
  def update(gameTime): LumberJack =
    if(working) {
      this.copy(
        chopWood = chopWood.increaseTo(
          100,             // upper limit
          10,              // units per second
          gameTime.running // current time
        )
      )
    } else this
}
val lumberJack = LumberJack(woodChoppingProcess, true)
```

And then when you update the lumberJack during your frame update `lumberJack.update(gameTime)`.

You can then render a progress bar as a percentage in the view by simply asking the `TimeVaryingValue` for its current `value`.
