window.addEventListener('load', function () {

    var config = getConfig();
        
    var container = document.getElementById('container');

    var tiles = createTiles(container, config.w, config.h, config.tileSize);

    var images = ['havana.jpeg', 'earth.jpeg', 'london.jpeg']
                .map(function (fn){ return 'images/' + fn; })
                .map(function (src) {
                    var img = new Image();
                    img.src = src;
                    return img;
                });

    var imageTime = 2200; // the delay inbetween image changes.

    var arrayCyler = cycleArray(images, imageTime, displayImageOnTiles.bind(null, tiles));
    var stop = arrayCyler.stop;

    function cycleArray(arr, time, f) {
        /* 
            Cycles through arr, applying function f on each elem in turn,
            with a delay of 'time' between each elem.

            Returns object with stop function which ends the cycling.
        */

        var index = 0;

        var next = function() {
            f(arr[index]);
            index = (index + 1) % arr.length;
        };

        // Process thhe first elem immediately.
        next();

        // Then cycle through them on a delay.
        var interval = setInterval(next, time);

        return {
            stop: clearInterval.bind(window, interval)
        };
    }

    function displayImageOnTiles(tiles, img) {
        var display = function () {
            var icp = new ImageColorPicker(img);

            // Calculate good dimensions based on tiles available, whilst maintaining aspect ratio.
            var ratio = img.naturalWidth / img.naturalHeight;
            var dimensions = img.naturalWidth >= img.naturalHeight ? 
                            {width:  tiles.w, height: Math.floor(tiles.w / ratio)} 
                            : {width: Math.floor(tiles.h * ratio), height: tiles.h};
           
            var colorGrid = icp.getColorGrid(dimensions);

            tiles.iterate(function (tile, x, y) {
                var colorStr;
                if (colorGrid[y] && colorGrid[y][x]) { // If colour grid specifies a colour then use that.
                    var color = colorGrid[y][x];
                    colorStr = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
                } else {
                    // Otherwise use black colour.
                    colorStr = 'black';
                }

                // Delay the colour change based on the row number.
                setTimeout(
                    (function(t, colorStr) {
                        return function() {
                            t.setColor(colorStr);
                        };
                    })(tile, colorStr),
                   (y * 20) + (x * 10)); // This function of y and x determines the effect when transitioning between different images.
            });
        };
        if (img.naturalWidth) { // If image loaded then display it immediately.
            display();
        } else { // Otherwise, wait for it to load and then display it.
            img.addEventListener('load', display);
        }
    }

    function createTiles(container, totalWidth, totalHeight, tileSize) {
        var tiles = [];

        for (var y = 0; y < totalHeight; y += tileSize) {
            var row = [];
            for (var x = 0; x < totalWidth; x += tileSize) {
                var tile = new Tile(x, y);
                container.appendChild(tile.el);
                row.push(tile);
            }

            tiles.push(row);
        }

        function Tile(x, y) {
            var el = document.createElement('div');
            el.classList.add('tile');
            el.style.width = tileSize + 'px';
            el.style.height = tileSize + 'px';
            
            this.setPosition = function (x, y) {
                el.style.left = x + 'px';
                el.style.top = y + 'px';
            };

            this.setColor = function (color) {
                setTimeout(function() {
                    el.style.backgroundColor = color;
                }, 200);
            }

            this.setPosition(x, y);
            this.el = el;
        }

        return {
            grid: tiles, // Give access to underlying array.
            iterate: function(cb) { // A function for iteration through all the tiles.
                var yMax = tiles.length,
                    xMax = tiles[0].length;
                for (var y = 0; y < yMax; y++) {
                    for (var x = 0; x < xMax; x++) {
                        cb(tiles[y][x], x, y); // Pass the callback the tile and the position.
                    }
                }
            },
            w: tiles[0].length,
            h: tiles.length
        };  

    }

    function getConfig(windowSize) {
        var width = window.innerWidth,
            height = window.innerHeight;

        var tileSize = calcTileSize(width, height);

        return {
            tileSize: tileSize,
            w: width,
            h: height
        };
    }

    function calcTileSize(windowWidth, windowHeight) {
        return 16; // A multiple of 64.
    }

});
