
(function(src, ads) {
    if (window._nastify) { return;}
    window._nastify = true;

    var DEFAULT_AD_WIDTH = 500,
        DEFAULT_AD_HEIGHT = 60;

    var MIN_LOAD_DELAY = 300,
        MAX_LOAD_DELAY = 2500;

    function random(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    function randomSrc() {
        var index = random(0, ads.length - 1);
        return ads[index];
    }

    window.addEventListener('load', function() {
        Array.from(document.scripts)
            .filter((script) => script.src === src)
            .forEach((script) => {
                var width = script.getAttribute('data-ad-width') || DEFAULT_AD_WIDTH,
                    height = script.getAttribute('data-ad-height') || DEFAULT_AD_HEIGHT;

                var ad = document.createElement('iframe');
                ad.width = width;
                ad.height = height;

                ad.style.border = '1px solid black';
                ad.style.display = 'none';

                ad.src = randomSrc();
                script.parentNode.replaceChild(ad, script);

                setTimeout(() => {
                    ad.style.display = 'initial';
                }, random(MIN_LOAD_DELAY, MAX_LOAD_DELAY));
             });
    });
})('http://mozdevs.github.io/servo-experiments/js/nastyProvider.js' , ['dogeSpin.html']);

