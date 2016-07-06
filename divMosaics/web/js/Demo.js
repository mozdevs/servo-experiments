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
    window.resizeTo(dw, dh);
    var barWidth  = resolution,
        barHeight = resolution;

    var barsX = Math.ceil(document.body.clientWidth / barWidth),
        barsY = Math.ceil(document.body.clientHeight / barHeight);

    function paint(rows) {
        bars.forEach(removeBar);
        bars.splice(0, bars.length);
        _.times(barsY, (y) => {
            _.times(barsX, (x) => {
                var color = rows[y][x];
                var dx = x * barWidth,
                    dy = y * barHeight;
                var b = createBar(_.random(document.body.clientWidth), document.body.clientHeight, barWidth, barHeight, color);

                // b.tweenOpacity(0, 0).start(); // Set opacity to 0 (hacky for now)
                setTimeout(() => {
                    b.tweenPos(dx, dy, 1000).start();
                    // b.tweenOpacity(1, 1000).start(); // Set opacity to 0 (hacky for now)

                }, 2000);

            });
        });
    }

    function randomColorGrid(hue) {
         var rows = [];
        _.times(barsY, () => {
            var r = [];

            _.times(barsX, () => {
                r.push(hue ? randomColor({hue: hue}): randomColor());
            });

            rows.push(r);
        });
        return rows;
    }
   
    paint(randomColorGrid('purple'));

    this.animate = function(t) {
        TWEEN.update(t);
    };

    this.dom = el;
}
