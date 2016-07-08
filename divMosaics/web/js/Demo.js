function Demo() {
    var el = document.createElement('div');
    var listener = new window.keypress.Listener();

    var bars = [];

    var barFactory = new BarFactory(); // Provides unused, free, bar elements on demand and handles their reuse them
    barFactory.populate(1000); // Create 1000 bars, ready to be used

    function addBar(bar) { // Adds a child to dom and bars list
        el.appendChild(bar.el);
        bars.push(bar);
    }

    function resetBars(onComplete) {
        // Animate out the current bars and remove them
        if (bars.length === 0) { // If there are no bars to remove, do nothing
            return onComplete();
        }
        // Otherwise, fade out each bar

        // Keep track of how many are done
        var nComplete = 0,
            nTotal = bars.length;
        bars.forEach((bar, i) => {
            // Fade out each bar
            bar.tweenPos(_.random(0, document.body.clientWidth), document.body.clientHeight, 1000)
                .onComplete(() => {
                    // When fadeout is complete, remove the bar from the dom
                    el.removeChild(bar.el);

                    bar.free(); // Mark the bar as available for re-use
                    nComplete += 1;
                    // If this was the last bar, empty the bars array, and signal completion
                    if (nComplete === nTotal) {
                        bars.splice(0, bars.length);
                        onComplete();
                    }
                })
                .start();
        });
    }

    var resolution = 40;
    // display width and display height - ensure these are a multiple of resolution for best display
    var dw = 1020, // Servo default width is 1024
        dh = 740; // Servo default height is 740
    window.resizeTo(dw, dh);

    var barWidth  = resolution,
        barHeight = resolution;

    var barsX = Math.ceil(document.body.clientWidth / barWidth),
        barsY = Math.ceil(document.body.clientHeight / barHeight);

    Http.get('http://localhost:3000/images', (imageURLs) => {
        // imageURLs is a list of image routes corresponding to available images to display
        var imgSelector = new ImageSelector(imageURLs.map((url) => 'http://localhost:3000/' + url));
        el.appendChild(imgSelector.el);
        imgSelector.toggle();
        listener.simple_combo('space', () => {
            imgSelector.toggle();
        });
        imgSelector.addEventListener('imageSelected', (evt) => {
            imgSelector.toggle(() => {
                displayMosaic(evt.detail.image);
            });
        });
    });

    function displayMosaic(image) {
        // Experimental: Use canvas colour picking to get colour colour grid representing image
        var icp = new ImageColorPicker(image);
        var grid = icp.getColorGrid(barsX);
        resetBars(() => {
            paint(grid);
        });

        // Using server to get colour grid representing image
        /*
        var imgUrl = 'http://localhost:3000/' + image.src;
        Http.get(imgUrl + '?c=true&width=' + barsX +'&height=' + barsY, (grid) => {
            // Clear current display, if any
            resetBars(() => {
                // Once this is done, display the new mosaic
                paint(grid);
            });
        }, (err) => {
            console.error(err);
        });*/
    }


    // Progress Bar to display loading progress
    var pb = new ProgressBar(0, 0, document.body.clientWidth, 2, 0);
    el.appendChild(pb.el);

    function paint(grid) {
        var waitTime = 1000; // Time before starting animation
        var zi = 1; // zIndex to assign to bar when interacted with

        var calcPaintProgress = (() => { // Function to determine % of cells that have been processed
            var nCells = grid.length * grid[0].length;

            return (x, y) => {
                var nProcessed = (y * grid[0].length) + x;
                return (nProcessed / nCells) * 100;
            };
        })();

        _.times(barsY, (y) => {
            _.times(barsX, (x) => {
                var color = grid[y][x];
                var dx = x * barWidth,
                    dy = y * barHeight;

                var b = barFactory.bar(_.random(document.body.clientWidth), document.body.clientHeight, barWidth, barHeight, color);
                addBar(b);

                b.addEventListener('mouseover', () => {
                    b.el.style.zIndex = zi++; // Ensure the bar is on top, so changes are visible
                    // b.tweenOpacity(0, 500)
                        // .chain(b.tweenOpacity(1, 500))
                        // .start();
                });

                setTimeout(() => { // Start animating the bar into place after a fixed amount of time
                    b.tweenPos(dx, dy, 1000)
                    .start(); 
                }, waitTime);

                // Display progress
                pb.set(calcPaintProgress(x, y));
            });
        });
    }

    function randomColorGrid(hue) {
         var grid = [];
        _.times(barsY, () => {
            var row = [];

            _.times(barsX, () => {
                r.push(hue ? randomColor({hue: hue}): randomColor());
            });

            grid.push(row);
        });
        return grid;
    }
   
    this.animate = function(t) {
        TWEEN.update(t);
    };

    this.dom = el;
}
