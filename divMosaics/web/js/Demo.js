function Demo(config) {
    var el = document.createElement('div');
    var listener = new window.keypress.Listener();

    // display width and display height - ensure these are a multiple of config.resolution for best display
    var dw = 1020, // Servo default width is 1024
        dh = 740; // Servo default height is 740
    
    window.resizeTo(dw, dh);
    
    var bars = []; // Array to store all 
    var barFactory = new BarFactory(); // Provides unused, free, bar elements on demand and handles their reuse
    barFactory.populate(1000); // Create 1000 bars, ready to be used

    var barWidth  = config.resolution,
        barHeight = config.resolution;

    var barsX = Math.ceil(document.body.clientWidth / barWidth), // Number of bars (tiles) across x axis
        barsY = Math.ceil(document.body.clientHeight / barHeight); // Number of bars (tiles) across y axis

    initImageSelector(config.images);

    // Display a choice of images to mosaic-ify, given a list of urls
    function initImageSelector(imageURLs) {

        // Create an add an ImageSelector component for the URLs
        var imgSelector = new ImageSelector(imageURLs);
        el.appendChild(imgSelector.el);

        imgSelector.toggle();
        
        // Pressing space toggles the image selector
        listener.simple_combo('space', () => {
            imgSelector.toggle();
        });

        // Selecting an image causes the image selector to be hidden and a mosaic of that image to be displayed
        imgSelector.addEventListener('imageSelected', (evt) => {
            imgSelector.toggle(() => {
                displayMosaic(evt.detail.image);
            });
        });
    }

    function displayMosaic(image) {
        // Experimental: Use canvas colour picking to get colour colour grid representing image
        var icp = new ImageColorPicker(image);
        var grid = icp.getColorGrid({height: barsY});
         // Clear the previously displayed bars and paint the new grid when ready
        resetBars(() => {
            paint(grid);
        });
    }

    function paint(grid) {
        var waitTime = 1000; // Time before starting animation

        // Caclulate offset required for mosaic to be displayed in centre of screen
        var offsetX = Math.max((document.body.clientWidth - (grid[0].length * barWidth)) / 2, 0);
        var offsetY = Math.max((document.body.clientHeight - (grid.length * barHeight)) / 2, 0);

        _.times(barsY, (y) => {
            _.times(barsX, (x) => {
                var color = grid[y][x];

                var dx = offsetX + (x * barWidth),
                    dy = offsetY + (y * barHeight);

                // Request and add a bar object from the bar factory
                var b = barFactory.bar(_.random(document.body.clientWidth), document.body.clientHeight, barWidth, barHeight, color);
                addBar(b);

                setTimeout(() => { // Start animating the bar into place after a fixed amount of time
                    b.tweenPos(dx, dy, 1000)
                    .start(); 
                }, waitTime);

            });
        });
    }

    function addBar(bar) { // Adds a to dom and bars list
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

        bars.forEach((bar) => {
            // Fade out each bar
            bar.tweenPos(_.random(0, document.body.clientWidth), document.body.clientHeight, 1000)
                .onComplete(() => {
                    // When fadeout is complete, remove the bar from the dom
                    el.removeChild(bar.el);
                    bar.el.style.background = 'none';

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

    this.animate = function(t) {
        TWEEN.update(t);
    };

    this.dom = el;
}
