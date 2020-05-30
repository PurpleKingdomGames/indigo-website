# Setup & Configuration

Indigo is compiled using [Scala.js](https://www.scala-js.org/).

```text
Alpha Note: We currently only export against the latest versions of Scala and Scala.js
```

## Indigo Build Tooling

You can use either [SBT](https://www.scala-sbt.org/) or [Mill](http://www.lihaoyi.com/mill/) to build your games, and building is just a matter of doing a completely normal Scala.js build to output the JavaScript you need with either fast or full optimisation.

However for your convenience, to help you bootstrap your game and to serve as a reference implementation, there is an Indigo SBT plugin and and Indigo Mill module that will marshall all the bits you need into an output directory and produce an HTML file that you can use to run your game.

### Note on running your game locally

Most modern browsers do not allow you to run local sites that load in assets and modules just by opening the html file in your browser. So if you use the Indigo build tool to produce a bootstrapped game, the quickest way to run it is to use [http-server](https://www.npmjs.com/package/http-server) as follows (once installed).

1. Navigate to the output directory in your terminal
1. Run `http-server -c-1` - which means "serve this directory as a static site with no caching".
1. Go to [http://127.0.0.1:8080/](http://127.0.0.1:8080/) (or whatever `http-server` says in it output) and marvel at your creation.

## SBT Guide

### plugins.sbt

Add the following to your `project/plugins.sbt` file:

```scala
addSbtPlugin("org.scala-js" % "sbt-scalajs" % "1.0.1")
addSbtPlugin("indigo" % "sbt-indigo" % "0.0.12-SNAPSHOT")
```

### build.sbt

Example minimal `build.sbt` file for the root of your project:

```scala
lazy val mygame =
  (project in file("."))
    .enablePlugins(ScalaJSPlugin, SbtIndigo) // Enable the Scala.js and Indigo plugins
    .settings( // Standard SBT settings
      name := "mygame",
      version := "0.0.1",
      scalaVersion := "2.13.2",
      organization := "org.mygame"
    )
    .settings( // Indigo specific settings
      showCursor := true,
      title := "My Game",
      gameAssetsDirectory := "assets",
      libraryDependencies ++= Seq(
        // Important! :-)
        "indigo" %%% "indigo" % "0.0.12-SNAPSHOT"
        // Needed for Aseprite & Tiled support
        // Alternative: indigo-json-upickle
        "indigo" %%% "indigo-json-circe" % "0.0.12-SNAPSHOT",
      )
    )
```

### Building with SBT

Run the following:

`sbt compile fastOptJS indigoBuildJS`

This will output your game and all the correctly referenced assets into `target/indigo-js/`. Note that the plugin will give you a full path at the end of it's output.

Navigate to the folder, run `http-server -c-1`, and got to [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in your browser of choice.

### Rolling it up into one command

You can also define the following in your `build.sbt` file:

```scala
addCommandAlias("buildGame", ";compile;fastOptJS;indigoBuildJS")
addCommandAlias("buildGameFull", ";clean;update;compile;test;fastOptJS;indigoBuildJS")
addCommandAlias("publishGame", ";compile;fullOptJS;indigoPublishJS")
addCommandAlias("publishGameFull", ";clean;update;compile;test;fullOptJS;indigoPublishJS")
```

Which give you some convenient shortcuts to speed up development.

## Mill Guide

### build.sc

Example minimal `build.sc` file for your game:

```scala
import mill._
import mill.scalalib._
import mill.scalajslib._
import mill.scalajslib.api._

import $ivy.`indigo::mill-indigo:0.0.1-SNAPSHOT`, millindigo._

object mygame extends ScalaJSModule with MillIndigo {
  def scalaVersion   = "2.13.2"
  def scalaJSVersion = "1.0.1"

  val gameAssetsDirectory: os.Path = os.pwd / "assets"
  val showCursor: Boolean          = true
  val title: String                = "My Game"

  def ivyDeps = Agg(
    ivy"indigo::indigo-json-circe::0.0.12-SNAPSHOT",
    ivy"indigo::indigo::0.0.12-SNAPSHOT"
  )

}
```

### Building with Mill

Run the following:

1. `mill mygame.compile`
1. `mill mygame.fastOpt`
1. `mill mygame.indigoBuildJS`

This will output your game and all the correctly referenced assets into `out/mygame/indigoBuildJS/`. Note that the module will give you a full path at the end of it's output.

Navigate to the folder, run `http-server -c-1`, and got to [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in your browser of choice.

### Rolling it up into one command

You can also define the following in your `build.sc` file inside the `mygame` object:

```scala
  def buildGame() = T.command {
    T {
      compile()
      fastOpt()
      indigoBuildJS()() // Note the double parenthesis!
    }
  }
```

Which allows you to run `mill mygame.buildGame` from the command line. You can also use `indigoBuildFullJS()()` to use the `fullOpt` version.
