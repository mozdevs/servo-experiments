// Wraps IFrame
function DemoIFrame(url) {
    var dormant = true;
    var iframe = document.createElement('iframe');
    iframe.style.display = 'block';
    iframe.className = 'dormant';
    iframe.src = url;
    iframe.innerText = url;

    var animTime = 400;
    var size = {w: 0, h: 0};
    var pos = {x: 0, y: 0};
    this.el = iframe;

    function tweenSize(newWidth, newHeight, animTime) {
        return new TWEEN.Tween(size).to({w: newWidth, h: newHeight}, animTime)
        .easing(TWEEN.Easing.Exponential.InOut)
        .onUpdate(function() {
            iframe.style.width = size.w + 'vw';
            iframe.style.height = size.h + 'vh';
        })
    }
    this.toggleDormant = function() {
        dormant = !dormant;
        iframe.className = dormant ? 'dormant' : '';
    };

    this.collapse = function() {
        return tweenSize(0, 0, animTime);
    };

    this.expand = function() {
        return tweenSize(100, 100, animTime);
    };

    this.animate = function(t) {
    };
}