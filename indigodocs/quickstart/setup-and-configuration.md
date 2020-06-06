---
id: setup-and-configuration
title: Setup & Configuration
---

## Building Indigo Games

Indigo games are completely normal [Scala.js](https://www.scala-js.org/) projects.

>Please not that we currently only publish against specific versions of Scala (2.13.2) and Scala.js (1.0.1).

You can use either [Mill](http://www.lihaoyi.com/mill/) or [SBT](https://www.scala-sbt.org/) to build your games, and for your convenience both Mill and SBT have associated plugins, `mill-indigo` and `sbt-indigo` respectively.

The plugins help you bootstrap your game during development, they marshall your assets and serve as a reference implementation for _one_ way to embed your game into a web page.

Example output from a Mill indigo build of the [Snake example game](https://github.com/PurpleKingdomGames/indigo/tree/master/demos/snake), the SBT version is nearly identical:

```bash
> mill snake.buildGame
[46/48] snake.indigoBuildJS
dirPath: /Users/(...)/indigo/demos/snake/out/snake/indigoBuildJS/dest
Copying assets...
/Users/(...)/indigo/demos/snake/out/snake/indigoBuildJS/dest/index.html
[48/48] snake.buildGame
```

The second to last line is an absolute path to where your game is.

### Running your game locally

Most modern browsers do not allow you to run local sites that load in assets and modules just by opening the html file in your browser. So if you use the Indigo build tool to produce a bootstrapped game, the quickest way to run it is to use [http-server](https://www.npmjs.com/package/http-server) as follows:

1. Install with `npm install -g http-server`.
1. Navigate to the output directory shown after running the indigo plugin.
1. Run `http-server -c-1` - which means "serve this directory as a static site with no caching".
1. Go to [http://127.0.0.1:8080/](http://127.0.0.1:8080/) (or whatever `http-server` says in it output) and marvel at your creation..

## Scala.js "Fast" vs "Full" Optimisation

The examples below show you how to publish with both "fast" and "full" optimisation of your Scala.js project.

The difference is speed and size. As the name implies, the "fast" version compiles _very significantly_ faster than the "full" version, but even small projects will result in ~5Mb of JavaScript, where the "full" version will be in the region of ~500kb. The "full" version may also be more performant at run time, for more information please refer to the official [Scala.js performance page](https://www.scala-js.org/doc/internals/performance.html).

Note that during development the fast version is perfectly acceptable. Your browser will chew through 5-10Mb of JavaScript with no problem at all, the performance difference is generally not noticable, and the compilation time reduction is definitely worth it.

## Mill Guide

### build.sc

Example minimal `build.sc` file for your game:

```scala
import mill._
import mill.scalalib._
import mill.scalajslib._
import mill.scalajslib.api._

import $ivy.`indigo::mill-indigo:0.1.0`, millindigo._

object mygame extends ScalaJSModule with MillIndigo {
  def scalaVersion   = "2.13.2"
  def scalaJSVersion = "1.0.1"

  val gameAssetsDirectory: os.Path = os.pwd / "assets"
  val showCursor: Boolean          = true
  val title: String                = "My Game"

  def ivyDeps = Agg(
    ivy"indigo::indigo-json-circe::0.1.0",
    ivy"indigo::indigo::0.1.0"
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

  def publishGame() = T.command {
    T {
      compile()
      fullOpt()
      indigoBuildFullJS()() // Note the double parenthesis!
    }
  }
```

Which allows you to run `mill mygame.buildGame` and `mill mygame.publishGame` from the command line.

## SBT Guide

### plugins.sbt

Add the following to your `project/plugins.sbt` file:

```scala
addSbtPlugin("org.scala-js" % "sbt-scalajs" % "1.0.1")
addSbtPlugin("indigo" % "sbt-indigo" % "0.1.0")
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
        "indigo" %%% "indigo" % "0.1.0"
        "indigo" %%% "indigo-json-circe" % "0.1.0",
      )
    )
```

### Building with SBT

Run the following:

`sbt compile fastOptJS indigoBuildJS`

This will output your game and all the correctly referenced assets into `target/indigo-js/`. Note that the plugin will give you a full path at the end of it's output.

Navigate to the folder, run `http-server -c-1`, and go to [http://127.0.0.1:8080/](http://127.0.0.1:8080/) in your browser of choice.

### Rolling it up into one command

You can also define the following in your `build.sbt` file:

```scala
addCommandAlias("buildGame", ";compile;fastOptJS;indigoBuildJS")
addCommandAlias("publishGame", ";compile;fullOptJS;indigoPublishJS")
```

Which give you some convenient shortcuts to speed up development.
