---
id: prior-art
title: Prior Art
---

Indigo was not built in a vacuum, it's the conflation of lots of different borrowed ideas, mostly from the places listed below. There are lots of good references on each of these subjects, here they are briefly enumerated as areas you can dig into if you're interested.

## Functional Reactive Programming

You can't move in the "Function Programming for Games" space without hearing about Function Reactive Programming (FRP), which is seen as the way to tackle this problem. Indigo is _NOT_ an FRP system, but ideas have been borrorwed.

FRP, and in particular Arrowized FRP which uses reactive combinators for a point free style of programming, is all about modelling time seriously. Events are either discrete or continuous, and are associated one way or another with a sampled point in time, which is fed as input through a series of functions to generate a rendered view.

It's used in interactive applications and other forms of stream processes.

## FRAN

The Functional Reactive ANimation system known as FRAN, came out of Microsoft research with a paper in 1997. FRAN is cited as an inspiration for Elm, and led to the development of FRP. Some of the high-levels ideas from FRAN turn up in the time based animation approach found in Indigo's automata subsystem.

## Synchronous Reactive Programming

SRP is not a functional (as in, FP) approach to reactive programming. The magic of SRP, and it's main influence on Indigo, is one key idea:

> Everything is assumed to happen instantly.

At the beginning of an update / tick / frame, time is sampled. This is the time that every single part of the code about to be executed will receive. No part of the code should be doing it's own system time look up.

This is a massive step forward in being able to reason about, and write test cases for your code, because everything can be calculated from a specific moment in time.

## Elm

Elm has been the inspiration for many modern frontend advances, and Indigo is no exception. Any current resemblance to Elm is coincidental, but early versions of Elm were pivotal in shaping how the problem of building a modern FP based game engine has been considered.

Elm uses a very similar Model -> Update -> View style immutable architecture, and is well worth learning. There is also an active Elm game dev community.

## Yampa

Yampa is a Haskell based FRP system that has been used for game development, and has been at the forefront of much of the development of Arrowized FRP. Some of the papers around Yampa have been both interesting and inspirational in Indigo's development.
