// ProgressBar, built on top of Bar
function ProgressBar(x, y, maxWidth, height, val) {
    var color = '#4272F7',
        animTime = 500;
        
    var b = new Bar(x, y, 0, height, color);
    var el = b.el;
    set(val);

    function updateDisplay() {
        var newWidth = (val / 100 ) * maxWidth;
        b.tweenSize(Math.round(newWidth), height, 500)
            .start();
    }
    
    function set(newVal) {
        val = Math.min(100, newVal);
        updateDisplay();
    }
    this.el = el;

    this.hide = function() {
        b.tweenOpacity(0, animTime)
            .start();
    };

    this.show = function() {
        b.tweenOpacity(1, animTime)
            .start();
    };

    this.set = set;

}