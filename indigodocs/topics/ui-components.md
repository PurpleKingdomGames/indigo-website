---
id: ui-components
title: UI Components
---

> UI Components currently live in the "Indigo Extras" library, since they are built on top of Indigo itself and require no special machinery to work.

UI components are the kinds of elements your expect to see in any web input form, or game options menu.

At the time of writing, Indigo does not provide a large suite of UI Components out of the box although we hope to expand, [see issue for progress](https://github.com/PurpleKingdomGames/indigo/issues/41). This is because _basic_ UI components are not terribly complicated to build on top of Indigo by aspiring game devs, and so have been pushed down the priority list in favor of more fundamental / specialized pieces of functionality.

## The Pattern

The components Indigo does provide (buttons and input fields) follow a very specific pattern. The idea is that while the values UI components temporarily represent are interesting, and should be stored in the model (e.g. the players name for their character), the UI Components themselves are not interesting and should be somewhat ephemeral. In other words, you'd want to save the characters name, but not the state of an input field. Therefore in their current design, UI Components are only supposed to live in the view model and the view.

The pattern UI components currently follow then, is as follows:

1. User provided assets - you need to provide information about what Indigo should use to draw your components.
2. An entry in the View Model - UI components hold a small amount of state, and it is designed to be stored in the view model.
3. Presentation - pulling the assets, state, and relevant events together to draw the component.

The main thing to be aware of is that UI Components are not magic. In an OO game engine, you could expect the add a button and for it to be a self contained entity that at least renders itself without a lot of wiring. In Indigo - like everything in Indigo! - you have to stitch them into the relevant processes, i.e. the button won't mysteriously draw itself if it isn't included in your view logic.

## Available Components

### Buttons

The out-of-the-box button is created out of three graphics that represent the up, over, and down states. Aside from handling the button's state, the main advantage of using the button component is that it's easier to to define interactions. Rather than pattern matching on a click event at the top of your update function, and then deciding whether the click happened inside the button or not, you can just define you button as follows and it will do the rest for you, once it has been wired in:

```scala
Button(
  buttonAssets = buttonAssets,
  bounds = Rectangle(10, 10, 16, 16),
  depth = Depth(2)
).withUpAction {
  List(LaunchTheRocket) // List of user defined events to trigger on click.
}
```

[The full button example is in the indigo-examples repo.](https://github.com/PurpleKingdomGames/indigo-examples/tree/master/examples/button)

### Input Fields

Input fields are text boxes that all users to type values into them. As with button, you need to provide some assets, specifically font information and a graphic to use as the cursor while a user is inputing values. Indigo's input field is quite basic, but input fields are a bit fiddly to implement. Hopefully it will either save someone some time or be useful as a reference to someone who'd like to do make something more sophisticated.

Setting up an input field is as simple as adding something like this to your view model:

```scala
InputField("<Default text>", assets)
  .makeSingleLine
  .moveTo(Point(10, 10))
```

Then updating it in the view model:

```scala
viewModel.myInputField.update(context)
```

...and drawing it:

```scala
viewModel.myInputField.draw(context.gameTime, context.boundaryLocator)
```

[The full input field example is in the indigo-examples repo.](https://github.com/PurpleKingdomGames/indigo-examples/tree/master/examples/inputfield)
