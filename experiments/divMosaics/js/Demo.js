function Demo(config) {
    var el = document.createElement('div');
    var listener = new window.keypress.Listener();

    var size = function() {
        // display width and display height - ensure these are a multiple of config.resolution for best display
        var dw = 1020, // Servo default width is 1024
            dh = 740; // Servo default height is 740
            window.resizeTo(dw, dh);

        var size = {width: document.body.clientWidth, height: document.body.clientHeight};
        window.addEventListener('resize', function() {
            size.width = document.body.clientWidth;
            size.height = document.body.clientHeight;
        });

        return size;
    }();

    var bars = []; // Array to store all bars
    var barFactory = new BarFactory(); // Provides unused, free, bar elements on demand and handles their reuse
    barFactory.populate(3000); // Create 1000 bars, ready to be used
    var barWidth  = config.resolution,
        barHeight = config.resolution;

    initImageSelector(config.images);

    // Display a choice of images to mosaic-ify, given a list of urls
    function initImageSelector(imageURLs) {

        // Create an add an ImageSelector component for the URLs
        var imgSelector = new ImageSelector(imageURLs);
        el.appendChild(imgSelector.el);

        // imgSelector.toggle();
        
        // Pressing space toggles the image selector
       /* listener.simple_combo('space', () => {
            imgSelector.toggle();
        });
        */
        // Selecting an image causes the image selector to be hidden and a mosaic of that image to be displayed
        imgSelector.addEventListener('imageSelected', (evt) => {
            displayMosaic(evt.detail.image);
        });
        // Cycle through images, mosaicing each one
        // AUTO CYCLING DISABLED DUE TO SERVO ISSUE
       /* var images = imgSelector.images;
        var currIndex = 0;
        var displayTime = 5000; // Time spent on each image before changing
        var displayNextImage = () => {
            displayMosaic(ima`ges[currIndex]);
            currIndex += 1;
            currIndex %= images.length;
        };
        displayNextImage();

        setInterval(displayNextImage, displayTime);*/

    }

    function displayMosaic(image) {
        // Experimental: Use canvas colour picking to get colour colour grid representing image
        var icp = new ImageColorPicker(image);
        var grid = icp.getColorGrid({height: Math.round(size.height / barHeight)});
         // Clear the previously displayed bars and paint the new grid when ready
        resetBars(() => {
            paint(grid);
        });
    }

    function paint(grid) {
        // Caclulate offset required for mosaic to be displayed in centre of screen
        var gridWidth = grid[0].length,
            gridHeight = grid.length;

        var offsetX = Math.max((size.width - (gridWidth * barWidth)) / 2, 0);
        var offsetY = Math.max((size.height - (gridHeight * barHeight)) / 2, 0);
        var cw = size.width,
            ch = size.height;

        _.times(gridHeight, (y) => {
            _.times(gridWidth, (x) => {
                var color = grid[y][x];

                // If the color is white or completely transparent, then don't bother
                if ((color.r === 255 && color.g === 255 && color.b === 255) || color.a === 0) {
                    // console.log('Skipping...');
                    return;
                }  

                // Request and add a bar object from the bar factory
                var b = barFactory.bar(_.random(0, cw), ch, barWidth, barHeight, 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')' );
                addBar(b);

                var dx = offsetX + (x * barWidth),
                    dy = offsetY + (y * barHeight);

                b.tweenPos(dx, dy, 1000)
                .start(); 
            });
        });
    }

    function addBar(bar) { // Adds bar to dom and bars list
        if (!bar.inDOM) {
            bar.inDOM = true;
            el.appendChild(bar.el); // Add the bar if needed
        }

        bar.el.style.visibility = 'visible';
        bars.push(bar);
    }

    function removeBar(bar) {
        bar.el.style.visibility = 'hidden';
        bar.el.style.background = 'none';
        bar.free(); // Mark the bar as available
        if (bar.inDOM) {
            bar.inDOM = false;
            el.removeChild(bar.el);
        }
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

        var cw = document.body.clientWidth,
            ch = document.body.clientHeight;
    
        bars.forEach((bar) => {
            // Fade out each bar
            var animTime = _.random(300, 1000),
                delay = 200;
            bar.tweenPos(_.random(0, cw), ch, animTime)
                .onComplete(() => {
                    // When fadeout is complete, remove the bar
                    removeBar(bar);
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

    this.animate = function(t) {
        TWEEN.update(t);
    };

    this.dom = el;
}
