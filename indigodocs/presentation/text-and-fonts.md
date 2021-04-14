---
id: text-and-fonts
title: Text & Fonts
---

> This page has not yet been reviewed for compatibility with version 0.7.0. Details may now be incorrect.

Indigo has no concept of fonts or font rendering, and yet it supports text.

We do intend to work on this in the future, time allowing.

## The Text Primitive

You can create a Text node using one of it's constructors and manipulate its properties with fluent API methods like this:

```scala
Text("Hello, world!\nThis is some text!", x, y, depth, fontKey).alignRight
```

Easy enough, and note that you can use newlines ...but if indigo doesn't support fonts, what is the `fontKey` in reference to?

### Allowing fonts without supporting fonts

A very early design decision, when Indigo was ruthlessly focused on the pixel art market, was that we didn't need real font support. Pixel art fonts tend to be blocky and mono-space.

Inspiration came from early versions of Flash where selected font glyphs were rendered into images at specific sizes during the Flash build. We went one step further and decided, in the name of _not_ getting bogged down in the world of font rendering, that you'd have to provide your font glyph images - not unlike an animation sprite sheet - pre-rendered and then tell us where all the characters were.

It's inconvenient and a bit simplistic, but it works ok! And we have a [tool to help you](https://indigoengine.io/tools/), more on that further down.

### Setting up fonts manually

At the beginning of your game definition, you were given a couple of blanks to fill in that looked like this:

```scala
val fonts: Set[FontInfo] =
  Set()

val assets: Set[AssetType] =
  Set()
```

What you need to do, one way or another, is provide an image that represents your font characters, and the `FontInfo` that tells indigo how to render each character.

The image might look like this:

![Font sheet example](/img/font-example.png)

Which you would load in the usual way:

```scala
val imageAsset = AssetName("my font image")

val assets: Set[AssetType] =
  Set(AssetType.Image(imageAsset, AssetPath("assets/my-font.png")))
```

And the associated `FontInfo` definition would be as follows, where the `FontChar` contains the character to match, and an image crop rectangle:

```scala
  val fontKey: FontKey = FontKey("my font")

  val fontInfo: FontInfo =
    FontInfo(fontKey, Material.Textured(imageAsset), 320, 230, FontChar("?", 47, 26, 11, 12))
      .addChar(FontChar("A", 2, 39, 10, 12))
      .addChar(FontChar("B", 14, 39, 9, 12))
      .addChar(FontChar("C", 25, 39, 10, 12))
      .addChar(FontChar("D", 37, 39, 9, 12))
      .addChar(FontChar("E", 49, 39, 9, 12))
      // etc.
```

The eagle eyed among you may have noticed two things:

1. That our `fontKey` has appeared, and it ties the `Text` primitive to a specific `FontInfo` instance.
2. The "character" to match is represented by a `String` rather than a `Char`... this is because of the way JavaScript represents it, an implementation leak if you will.

That all works fine, it's just a very boring job.

### Getting a computer to do it for you

How to avoid doing all the manual labor of painstaking setting up the font info, and getting a font rendered to an image for you in the first place?

Well you still need the asset and the `FontInfo`, but we have a process to make generating it easier.

1. Head over to our [tools site](https://indigoengine.io/tools/) and use the Font Sheet generator to produce an image containing the exact glyphs you want and an associated JSON blob representing the glyph information.
2. Ensure you have added an Indigo JSON dependency to your games build definition, either `indigo-json-circe` or `indigo-json-upickle`.

Then load both assets:

```scala
val imageAsset = AssetName("my font image")
val jsonAsset = AssetName("my font json")

val assets: Set[AssetType] =
  Set(
    AssetType.Image(AssetName(imageAsset), AssetPath("assets/my-font.png")),
    AssetType.Text(AssetName(jsonAsset), AssetPath("assets/my-font.json"))
  )
```

..and then during the `setup` function where you create the `Startup` data, you can do something like the following:

```scala
def makeFontInfo(unknownChar: FontChar, fontChars: List[FontChar]): FontInfo =
  FontInfo(
    fontKey = fontKey,
    fontSpriteSheet = FontSpriteSheet(Material.Textured(imageAsset), Point(320, 230)),
    unknownChar = unknownChar,
    fontChars = fontChars,
    caseSensitive = true
  )

val maybeFontInfo =
  for {
    json        <- assetCollection.findTextDataByName(AssetName(""))
    chars       <- Json.readFontToolJson(json)
    unknownChar <- chars.find(_.character == "☐")
  } yield makeFontInfo(unknownChar, chars)

maybeFontInfo match {
  case Some(fontInfo) =>
    Startup.Success(/*insert start up data here*/).addFonts(fontInfo)

  case None =>
    Startup.Failure(StartupErrors("Failed to load font information"))
}
```
