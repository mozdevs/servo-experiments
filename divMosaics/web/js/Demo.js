function Demo() {
    var el = document.createElement('div');
    var bars = [];

    function createBar(x, y, w, h, color) {
        var b = new Bar(x, y, w, h, color);
        el.appendChild(b.el);
        bars.push(b);
        return b;
    }

    function removeBar(bar) {
        el.removeChild(bar.el);
    }

    var resolution = 20;
    // display width and display height - ensure these are a multiple of resolution for best display
    var dw = 1020, // Servo default width is 1024
        dh = 740; // Servo default height is 740
    // window.resizeTo(dw, dh);
    var barWidth  = resolution,
        barHeight = resolution;

    var barsX = Math.ceil(document.body.clientWidth / barWidth),
        barsY = Math.ceil(document.body.clientHeight / barHeight);

    Http.get('http://localhost:3000/images', (imageURLs) => {
        // imageURLs is a list of image routes corresponding to available images to display
        var imgSelector = new ImageSelector(imageURLs.map((url) => 'http://localhost:3000/' + url));
        el.appendChild(imgSelector.el);
        imgSelector.addEventListener('imageSelected', (evt) => {
            displayMosaic(evt.detail.image.src);
        });
    });

    function displayMosaic(imgUrl) {
        // To get image in the form of colour grid data, need to add a 'c' get param onto the imgURL
        Http.get(imgUrl + '?c=true&width=' + barsX +'&height=' + barsY, paint, (err) => {
            console.error(err);
        });
    }

    // Progress Bar to display loading progress
    var pb = new ProgressBar(0, 0, document.body.clientWidth, 2, 0);
    el.appendChild(pb.el);

    function paint(grid) {
        var waitTime = 1000; // Time before starting animation
        bars.forEach(removeBar);
        bars = [];
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

                var b = createBar(_.random(document.body.clientWidth), document.body.clientHeight, barWidth, barHeight, color);
                
                b.addEventListener('mouseover', () => {
                    b.el.style.zIndex = zi++; // Ensure the bar is on top, so changes are visible
                    b.tweenOpacity(0, 500)
                        .chain(b.tweenOpacity(1, 500))
                        .start();
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
