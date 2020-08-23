---
id: ui-components
title: UI Components
---

UI components are the kinds of elements your expect to see in any web input form, or game options menu.

At the time of writing, Indigo does not provide a large suite of UI Components out of the box although we hope to expand, [see issue for progress](https://github.com/PurpleKingdomGames/indigo/issues/41). This is simply because basic UI components are not terribly complicated to build on top of Indigo by aspiring game devs, and so have been pushed down the priority list in favor of more fundamental / specialized pieces of functionality. The ones it does provide (buttons and input fields) follow a very specific pattern.

The idea is that while the values UI components temporarily represent are interesting and should be stored in the model (e.g. the players name for their character), the UI Components themselves are not interesting and should be somewhat ephemeral. Therefore, UI Components live only the in the view model and view.

## The Pattern

The pattern UI components current follow is:

1. Assets - you need to provide information about what Indigo should use to draw your components.
2. View Model entry - UI components hold a small amount of state, and it is designed to be stored in the view model
3. Presentation

### Assets

You 

## Buttons

asd

## Input Fields
