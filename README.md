### Simple Ray Casting Renderer written in Typescript

It's slow and computed in the CPU.

Supports:
- coloured 3d objects.
- multiple lights (with configurable intensity).

Here's a [demo](https://vitormanfredini.github.io/raycastingjs/).


TODO:
- ascii mode: calculate exact sizes for font-size and line-height, according to resolution's aspect ratio
- move config to main class and pass it to the engine on every frame update
- make a raycastingjs-renderer-pixels and raycastingjs-renderer-ascii instead of functions inside the main class
- implement sphere
- refactor everything to typescript