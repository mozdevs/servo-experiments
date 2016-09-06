#DIVMosaics

This experiments converts images into mosaics and then animates their construction.  The mosaics fill the available space on the page and use as many mosaic tiles as needed to do this.

Each mosaic tile is created from the `MosaicTile` constructor function in `js/Tile.js` and is represented in the DOM as a small absolutely positioned DIV with a background colour.

<img src="demo.gif" />

##Entry Point - `js/main.js`
This file creates the `Demo` object, passing some general configuration parameters.
These are:

1. **resolution** - the width and height of each mosaic tile in px.  The smaller this number, the more mosaic tiles as the mosaics are created to fill the available space using as many tiles as possible.  Making this number smaller will make the demo more demanding of the browser.
2. **images** - the selection of image URLs which can be 'mosaicified'.

##Mosaic code - `js/demo.js`
This file first creates the image selector panel which allows the user to select an image to be mosaicified.  The `createImageSelector` function does this and takes a list of imageURLs as an argument.
When an image in the panel is clicked, the `displayMosaic` function is called.
<br /><br />
The `displayMosaic` function takes a HTML img element and then animates the construction of a mosaic representing this image.

First of all, it uses the `getColorGrid` function to  turn the supplied image into a 2D array of pixel colour information.
This grid is used to create and position the mosaic tiles.

Then, the `resetDisplay` function is called. This function animates out all currently visible mosaic tiles and uses a callback to notify when this is complete.


When the existing tiles have been animated out, the `paintDisplay` function is called, with the colour grid passed as an argument.

##Creation of mosaic tiles - `js/tile.js`
A mosaic tile is just a small, absolutely positioned DIV element in the DOM with a background colour.
Some basic styles for this are defined in the CSS `.tile` rule in  `css/style.css`.  The DIVs have transitions on their `top` and `left`
CSS properties which allows thier movement to be animated by altering these with JavaScript.  Mosaic tiles are created using the `MosaicTile` constructor function, found in `js/Tile.js`.

As generating a mosaic typically involves creating a lot of tiles, to avoid unnescessarily creating new tiles between
different mosaic constructions, there is a simple `TileFactory` object which manages a pool of `MosaicTile`s and re-uses them where possible.   Subsequently, all `MosaicTile` objects are 'created' through the `TileFactory` as opposed to directly.

The `TileFactory` object works by storing a list of mosaic tiles which are currently 'free'.
It exposes a `tile` method which requests a tile with given configuration.
If there is a tile available in the free tile pool, the `tile` method will pick this and then configure it as requested.
Otherwise, a new tile is created.

When tiles are no longer in use, i.e. after `resetDisplay()` has finished animating them offscreen, the `TileFactory`'s `markAsAvailable` method
is called in order to signal that a given tile can be re-used in the future.


