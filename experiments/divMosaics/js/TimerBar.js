// Bar representing the progress of a timer, built on top of Bar
function TimerBar(x, y, maxWidth, height) {
    var b = new Bar(x, y, 0, height, '#4272F7');
    var animTime = 500;

    function start(cb, time) {
        b.tweenSize(maxWidth, height, time)
            .onComplete(cb)
            .start();
    }

    function hide() {
         b.tweenOpacity(0, animTime)
            .start();
    }

    function show() {
         b.tweenOpacity(1, animTime)
            .start();
    }

    this.el = b.el;
    this.start = start;
    this.hide = hide;
    this.show = show;
}