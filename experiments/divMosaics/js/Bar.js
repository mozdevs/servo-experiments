function Bar(x, y, w, h, color) {
    var div = document.createElement('div');
    div.className = 'bar';
    div.style.backgroundColor = color || '#c10a15';
    var size = {w: w, h: h};
    var pos = {x: x, y: y};
    var opacity = {opacity: 1};
    var transform = {z: 0};

    var curTween;
    var animTime = 100;

    updatePos();
    updateSize();
    
    function setPos(x, y) {
        pos.x = x;
        pos.y = y;
        updatePos();
    }

    function setSize(w, h) {
        size.w = w;
        size.h = h;
        updateSize();
    }
    
    function updateSize() {
        div.style.width = size.w + 'px';
        div.style.height = size.h + 'px';
    }

    function updatePos() {
        div.style.left = pos.x + 'px';
        div.style.top = pos.y + 'px';
    }

    function setColor(color) {
        div.style.backgroundColor = color;
    }

    function tweenSize(newW, newH, animTime) {
        return new TWEEN.Tween(size).to({w: newW, h: newH}, animTime)
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .onUpdate(updateSize);
    }    

    function tweenOpacity(newOpacity, animTime) {
        return new TWEEN.Tween(opacity).to({opacity: newOpacity}, animTime)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function() {
            div.style.opacity = opacity.opacity;
        });
    }    

    function tweenPos(newX, newY, animTime) {
        var start = setTimeout.bind(window, () => {
                        setPos(newX, newY);
                    }, 10);
        var onComplete = (cb) => {
            setTimeout(cb, 1000);
            return obj;
        };
        var obj = {start: start, onComplete: onComplete};       
        return obj;
    }

    function tweenZ(newZ, animTime) {
        return new TWEEN.Tween(transform)
            .to({z: newZ}, animTime)
            .easing(TWEEN.Easing.Sinusoidal.InOut)
            .onUpdate(function() {
                div.style.transform = 'perspective(500px) translateZ(' + transform.z + 'px)';
            });
    } 

    function qTween(tween) {
        if (curTween) {
            curTween.chain(tween);
            curTween = tween;
        } else {
            curTween = tween;
            curTween.start();
        }
    }
  
    this.el = div;

    this.animate = function(t) {
    };

    this.setPos = setPos;
    this.setSize = setSize;
    this.setColor = setColor;
    this.tweenPos = tweenPos;
    this.tweenSize = tweenSize;
    this.tweenOpacity = tweenOpacity;
    this.qTween = qTween;
    this.tweenZ = tweenZ;
    this.free = (() => {});
    this.addEventListener = div.addEventListener.bind(div);
}