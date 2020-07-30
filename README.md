# druaga-like-dungeon-generator

> Dungeon map generator based on [The Tower of Druaga](https://en.wikipedia.org/wiki/The_Tower_of_Druaga)

## Demo

[Demo page](https://masatomakino.github.io/druaga-like-dungeon-generator/)

The controller at the bottom of the demo page enables you to change the following parameters.

- Random seed
- Floor size (width and height)

As you change the parameters, a reproducible floor map will be generated.

## Goal

The goal of this repository is to study the procedure for generating a floor map of [The Tower of Druaga](https://en.wikipedia.org/wiki/The_Tower_of_Druaga).

This code is not a strict emulation of the Tower of Druaga.

## Requirements of floor map

The floor map of the Tower of Druaga has been generated based on the following requirements.

- Floor, pillar, and wall map data is not in ROM.
- You can always step on all floors without using mattocks (wall-destroying item). There are no enclosed spaces.
- There are no large rooms. Every floor becomes a passage.

On the actual ROM, the program generates a floor map from 8-bit integers. The number of floor is the seed value of the pseudo-random number generator.

Only on the 60th (last) floor, the seed value is 255. If you give the same floor size and seed value, the same map will always be generated.

The reason why the Tower of Druaga doesn't allow for large rooms is because at the time, the floor space limited by the capabilities of the hardware.
If floor generator didn't create a long pathway, users could traverse the floor in a very short amount of time.

## Pseudo-random number generator

The floor generation algorithm requires a Pseudo-random number generator with seed.
In this case, the floor generator uses the [Xorshift algorithm](https://crocro.com/write/js_sample/?act=vw_itm&itm=xorshift).

## Floor generator

### Basic steps

The floor map of the Tower of Druaga consists of 4 elements.

1. outer walls : ■️
1. tile : □
1. pillars : ●
1. wall : |

```
 ■ ■ ■ ■ ■ ■ ■
 ■ □ | □ □ □ ■
 ■ □ ● □ ● ─ ■
 ■ □ □ □ □ □ ■
 ■ ■ ■ ■ ■ ■ ■
```

Outer walls enclose the floor.
Tile allows characters to come and go.
Pillars stand evenly spaced, and the walls extend from here.

The Tower of Druaga's algorithm generates a floor map by following these steps.

1. Pick up the pillars in order from top left to bottom right.
2. Extend the wall in a random direction from a pillar where the wall has not yet been generated.
3. Move to the pillar at the destination of the wall.
4. Repeat step 2 and 3. Choose from three directions to extend the wall without going backwards. The floor generator make routes with walls.
5. When route reach the outer wall, or the pillars where the wall already extends, it' s done.

By repeating this procedure, the walls extend from the pillars to generate the floor.

Walls always start with a pillar and end with an outer wall. So, the route does not divide the floor.

### Resolving enclosed spaces

If you follow the steps to build a wall, you will have an enclosed space.

1. The wall stretches and hits the route.
1. The route surrounds the head of the wall.

#### The wall stretches and hits the route.

The floor generator creates a closed space when the walls collide with each other during generation.
Imagine the shape of the number 6.

```
 ● ← ●
 ↓
 ● ← ●
 ↓   ↑
 ● → ●
```

In the event of a collision, the floor generator cancels the last move and redraws the direction.

#### The route surrounds the head of the wall.

If there are walls on all four sides of a pillar, redrawing the direction does not solve the problem.

```
 ● ← ● ← ●
 ↓
 ●   ● ← ●
 ↓       ↑
 ● → ● → ●
```

In this case, the generator will cancel the entire route and start over.

## About source code

- Clone or download the source from Github.
- `npm install`
- `npm run publish`
- Files output to `docs` folder, the local http server will start.

## Reference

[古くて新しい自動迷路生成アルゴリズム](https://yaneurao.hatenadiary.com/entries/2013/01/25)
