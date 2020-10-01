---
id: signals
title: Signals & Signal Functions
---

The goal of Indigo is to make programming games (as a pose to making them...), easier to reason about and easier to test by leveraging the good ideas that come with functional programming. The hope is that that we make building games _fun_ and productive for programmers specifically. The price we pay for that is (currently) flexibility, and also performance.

However, in the grand scheme of things, Indigo is a lightweight. It's impure, greedy, and at the time of writing it isn't _quite_ sure what to do with errors (not for lack of consideration). One engine that has more robust ideas about such things is [Yampa](https://github.com/ivanperez-keera/Yampa) (written in Haskell), and the main construct Yampa uses is the idea of a signal.

Indigo also makes use of Signals, though not to the same extent. The main difference is that Signals in Indigo are stateless and therefore somewhat limited. Nonetheless, Signals in Indigo are still interesting and useful, and provide the backbone of the Automata subsystem.

## `Signal[A]`

At it's core, a signal is a very simple thing. Consider this hypothetical abstract function signature:

```scala
val f: A => B
```

What this function signature says is that when provided some value of type `A`, it _will_ produce some value of type `B`. In concrete terms, if we fix the types to known primitives, the follow example says that when given a `String`, it will return an `Int`:

```scala
val f: String => Int
```

A `Signal[A]` is halfway between the two, and looks like this:

```scala
class Signal[A](val f: Seconds => A)
```

In other words, a `Signal` of `A` is nothing more than a function that when given the time in `Seconds`, _will_ produce some value of `A`.

***So what?!***

### Frame independence

### Testing

## Signal composition

### Signals as Monads

Signals are a type of Functor up to Monad, meaning that all of the usual functions like `map`, `ap`, and `flatMap` are available

### `SignalFunction`s

## Signal constants

Pulse etc.
