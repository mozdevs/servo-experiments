// Wraps IFrame
function DemoIFrame(url) {
    var dormant = true;
    var iframe = document.createElement('iframe');
    iframe.style.display = 'block';
    iframe.className = 'dormant';
    iframe.src = url;
    iframe.innerText = url;

    this.el = iframe;
    this.x = 0;
    this.y = 0;

    this.toggleDormant = function() {
        dormant = !dormant;
        iframe.className = dormant ? 'dormant' : '';
    };

    this.animate = function(t) {
        applyTranslate(this.el, this.x, this.y);
        // this.el.style.position = 'absolute';
        // this.el.style.left = this.x + 'px';
        // this.el.style.top = this.y + 'px';
    }
}