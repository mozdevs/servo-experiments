function Demo(config) {
    var el = document.createElement('div');
    var size = getWindowSize();

    var tiles = []; // Array to store all tiles
    var tileFactory = new TileFactory(); // Provides unused tiles and handles their reuse
    var tileWidth  = config.resolution,
        tileHeight = config.resolution;

    createImageSelector(config.images);

    // Display a choice of images to mosaic-ify, given a list of urls
    function createImageSelector(imageURLs) {
        // Create image selector panel
        var selector = document.createElement('div');
        selector.classList.add('image-selector');

        var imgs = imageURLs.map((url) => {
            var container = document.createElement('div');
            container.classList.add('image-container');
            var img = new Image();
            img.src = url;
            img.addEventListener('click', () => {
                displayMosaic(img);
            });
            container.appendChild(img);
            return container;
        });

        imgs.forEach(selector.appendChild.bind(selector));
        el.appendChild(selector);
    }

    function displayMosaic(img) {
        var grid = getColorGrid(img, {height: Math.round(size.height / tileHeight)});
         // Clear the previously displayed tiles and paint the new grid when ready
        resetTiles(() => {
            paint(grid);
        });
    }

    function paint(grid) {
        // Caclulate offset required for mosaic to be displayed in centre of screen
        var gridWidth = grid[0].length,
            gridHeight = grid.length;

        var offsetX = Math.max((size.width - (gridWidth * tileWidth)) / 2, 0);
        var offsetY = Math.max((size.height - (gridHeight * tileHeight)) / 2, 0);
    
        grid.forEach((row, y) => {

            row.forEach((color, x) => {
                var colorStr = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';

                // Request and add a tile object from the tile factory

                var startYOffset = Math.sin(((y * gridWidth) + x) / 200)* 200;
                var startXOffset = Math.abs(startYOffset);
                var [startX, startY] = _.sample([[-20 - startXOffset, (size.height / 2) + startYOffset], [size.width + 20 + startXOffset, (size.height / 2) + startYOffset]]);            

                var t = tileFactory.tile(startX, startY, tileWidth, tileHeight, colorStr);
                addTile(t);

                var targetX = offsetX + (x * tileWidth),
                    targetY = offsetY + (y * tileHeight);

                t.animateToPosition(targetX, targetY);
            });

        });
    }

    function addTile(tile) { // Adds tile to dom and tiles list
        tile.show();
        tiles.push(tile);
        if (!tile.inDOM) {
            tile.inDOM = true;
            el.appendChild(tile.el);
        }
    }

    function removeTile(tile) {
        tile.hide();
        tileFactory.markAsAvailable(tile);
        if (tile.inDOM) {
            tile.inDOM = false;
            el.removeChild(tile.el);
        }
    }

    function resetTiles(onComplete) {
        // Animate out the current tiles and remove them
        if (tiles.length === 0) { // If there are no tiles to remove, do nothing
            return onComplete();
        }

        var animTime = 1000,
            delayTime = 1000; // 'rest time' between animating out all tiles and displaying the next image 

        var cw = document.body.clientWidth,
            ch = document.body.clientHeight;
    
        var waitTime = -1;
        tiles.forEach((tile, i) => {
            waitTime = Math.max(waitTime, animTime);

            // Move the tile into a random corner.
            var targetYOffset = Math.sin(i / 200)* 200;
            var targetXOffset = Math.abs(targetYOffset);
            var [targetX, targetY] = _.sample([[-20 - targetXOffset, (size.height / 2) + targetYOffset], [size.width + 20 + targetXOffset, (size.height / 2) + targetYOffset]]);            
           
            tile.animateToPosition(targetX, targetY, () => {
                removeTile(tile);
            });
        });

        setTimeout(() => {
            // Empty tiles array
            tiles.splice(0, tiles.length);
            onComplete();
        }, animTime + delayTime);
    }

    this.dom = el;
}

function getWindowSize() {
    var size = {width: document.body.clientWidth, height: document.body.clientHeight};
    window.addEventListener('resize', function() {
        size.width = document.body.clientWidth;
        size.height = document.body.clientHeight;
    });

    return size;
}

function MosaicTile(x, y, w, h, color) {
    var div = document.createElement('div');
    div.className = 'mosaic-tile';
    var size = {w: w, h: h};
    var pos = {x: x, y: y};
    var animTime = 1000; // as defined in .mosaic-tile CSS

    setPos(pos.x, pos.y);
    setSize(size.w, size.h);
    setColor(color);

    function setPos(x, y) {
        pos.x = x;
        pos.y = y;
        div.style.left = pos.x + 'px';
        div.style.top = pos.y + 'px';
    }

    function setSize(w, h) {
        size.w = w;
        size.h = h;
        div.style.width = size.w + 'px';
        div.style.height = size.h + 'px';
    }

    function setColor(color) {
        div.style.backgroundColor = color;
    }

    function animateToPosition(newX, newY, onComplete) {
        setTimeout(() => { 
            setPos(newX, newY);
            setTimeout(onComplete, animTime);
        }, 10);
    }

    function hide() {
        div.style.visibility = 'hidden';
        div.style.background = 'none';
    }

    function show() {
        div.style.visibility = 'visible';
    }

    this.setPos = setPos;
    this.animateToPosition = animateToPosition;
    
    this.setSize = setSize;
    
    this.setColor = setColor;

    this.hide = hide;
    this.show = show;

    this.el = div;
}

// Provides 'available' tiles, reusing ones where possible
function TileFactory() {
    var free = []; // List of tiles which are free to be re used
    var tileCount = 0;

    function tile(x, y, w, h, color) {
        var tile;
        if (free.length > 0) { // Re-use a tile, removing it from free list
            tile = free.shift();
            tile.setPos(x, y);
            tile.setSize(w, h);
            tile.setColor(color);
        } else {
            // Create new bar
            tile = new MosaicTile(x, y, w, h, color);
        }
        return tile;
    }

    // Populate with n readily-availabe tile
    function populate(n) {
        for (var i = 0; i < n; i++) {
            free.push(new Tile(0, 0, 0, 0, 'red'));
        }

        return this;
    }

    this.tile = tile;
    this.markAsAvailable = function(tile) {
        free.push(tile);
    }
    this.populate = populate;
}

// Given a HTML img element, return a grid of colors representing the image.
function getColorGrid(img, config) {

    var c = document.createElement('canvas'),
        ctx = c.getContext('2d');

    var ratio = img.width / img.height;
   
    console.assert(config.width || config.height);

    var width = config.width || (function () {
        var ratio = img.width / img.height;
        return Math.round(config.height * ratio);
    })();

    var height = config.height || (function () {
        var ratio = img.width / img.height;
        return Math.round(config.width / ratio);
    })();


    c.width = width;
    c.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    var data = ctx.getImageData(0, 0, width, height).data,
        xPos = 0,
        grid = [],
        row;

    for (var i = 0; i < data.length; i += 4) {
        if (xPos % width === 0) {
            row = [];
            grid.push(row);
            xPos  =  0;
        }

        row.push({r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3]});
        xPos += 1;
    }

    return grid;
}
