window.addEventListener('load', () => {

    let config = getConfig();
        
    let container = document.getElementById('container');

    let tiles = createTiles(container, config.w, config.h, config.tileSize);

    let images = ['havana.jpeg', 'earth.jpeg', 'london.jpeg']
                .map((fn) => 'images/' + fn)
                .map((src) => {
                    let img = new Image();
                    img.src = src;
                    return img;
                });

    let imageTime = 2200; // the delay inbetween image changes.

    let {stop} = cycleArray(images, imageTime, displayImageOnTiles.bind(null, tiles));

    function cycleArray(arr, time, f) {
        /* 
            Cycles through arr, applying function f on each elem in turn,
            with a delay of 'time' between each elem.

            Returns object with stop function which ends the cycling.
        */

        let index = 0;

        let next = () => {
            f(arr[index]);
            index = (index + 1) % arr.length;
        };

        // Process thhe first elem immediately.
        next();

        // Then cycle through them on a delay.
        let interval = setInterval(next, time);

        return {
            stop: clearInterval.bind(window, interval)
        };
    }

    tiles.iterate((tile) => {
        let className = 'skew';
        tile.el.addEventListener('mouseover', () => {
            // TODO: INVESTIGATE - NEXT LINE CAUSES ERROR IN SERVO.
            // tile.el.classList.toggle(className);
        });
        tile.el.addEventListener('mouseout', () => {
            // TODO: INVESTIGATE - NEXT LINE CAUSES ERROR IN SERVO.
            // tile.el.classList.remove(className);
        });
    });

    function coordToTile(x, y) {
        let tileX = Math.floor(x / config.tileSize),
            tileY = Math.floor(y / config.tileSize);
        return tiles.grid[tileY][tileX]; 
    }

    function displayImageOnTiles(tiles, img) {
        let display = () => {
            let icp = new ImageColorPicker(img);

            // Calculate good dimensions based on tiles available, whilst maintaining aspect ratio.
            let ratio = img.naturalWidth / img.naturalHeight;
            let dimensions = img.naturalWidth >= img.naturalHeight ? 
                            {width:  tiles.w, height: Math.floor(tiles.w / ratio)} 
                            : {width: Math.floor(tiles.h * ratio), height: tiles.h};
           
            let colorGrid = icp.getColorGrid(dimensions);

            tiles.iterate((tile, x, y) => {
                let colorStr;
                if (colorGrid[y] && colorGrid[y][x]) { // If colour grid specifies a colour then use that.
                    let {r, g, b, a} = colorGrid[y][x];
                    colorStr = `rgba(${r}, ${g}, ${b}, ${a})`;
                } else {
                    // Otherwise use black colour
                    colorStr = 'black';
                }

                // Delay the colour change based on the row number
                setTimeout(
                    (function(t, colorStr) {
                        return () => {
                            t.setColor(colorStr);
                        };
                    })(tile, colorStr),
                   (y * 20) + (x * 10));
            });
        };
        if (img.naturalWidth) { // If image loaded then display it immediately.
            display();
        } else { // Otherwise, wait for it to load and then display it.
            img.addEventListener('load', display);
        }
    }

    function createTiles(container, totalWidth, totalHeight, tileSize) {
        let tiles = [];

        for (let y = 0; y < totalHeight; y += tileSize) {
            let row = [];
            for (let x = 0; x < totalWidth; x += tileSize) {
                let tile = new Tile(x, y);
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
            
            this.setPosition = (x, y) => {
                el.style.left = x + 'px';
                el.style.top = y + 'px';
            };

            this.setColor = (color) => {
                setTimeout(function() {
                    el.style.backgroundColor = color;
                }, 200);
            }

            this.setPosition(x, y);
            this.el = el;
        }

        return {
            grid: tiles, // Give access to underlying array.
            iterate: (cb) => { // A function for iteration through all the tiles.
                let yMax = tiles.length,
                    xMax = tiles[0].length;
                for (let y = 0; y < yMax; y++) {
                    for (let x = 0; x < xMax; x++) {
                        cb(tiles[y][x], x, y); // Pass the callback the tile and the position.
                    }
                }
            },
            w: tiles[0].length,
            h: tiles.length
        };  

    }

    function getConfig(windowSize) {
        let width = window.innerWidth,
            height = window.innerHeight;

        let tileSize = calcTileSize(width, height);

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
