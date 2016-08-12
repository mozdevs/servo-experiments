(function(src, createReplacementEl) {
    if (window._nastify) { return;}
    window._nastify = true;

    var DEFAULT_AD_WIDTH = 500,
        DEFAULT_AD_HEIGHT = 60;

    var MIN_LOAD_DELAY = 300,
        MAX_LOAD_DELAY = 2500;

    window.addEventListener('load', function() {
        Array.from(document.scripts)
            .filter((script) => {
                return script.getAttribute('src') === src;
            })
            .map((script) => {
                var ad = createReplacementEl(script);
                ad.style.display = 'none';
                script.parentNode.replaceChild(ad, script);

                setTimeout(() => {
                    ad.style.display = 'initial';
                }, random(MIN_LOAD_DELAY, MAX_LOAD_DELAY));
             });
    });
})('https://mozdevs.github.io/servo-experiments/js/nastyProvider.js' , getRandomDivAd);


function getRandomDivAd(script) {
    var el = document.createElement('div');
    el.innerHTML = '<h2>TODO: CREATE NASTY AD HERE, with love, nastyProvider.js</h2>'
    var numDoges = 0;

    for (var i = 0; i < numDoges; i++) {
        var img = new Image();
        img.src = 'doge.png';
        img.width = 64;
        img.height = 64;
        img.style.transform = 'rotate(45deg)';
        img.style.transition = '1s ease-in-out all';
        
        el.appendChild(img);
    }
    return el;   
}

function getRandomIFrameAd(script) {
    var ads = ['https://en.wikipedia.org'];
    var width = script.getAttribute('data-ad-width') || DEFAULT_AD_WIDTH,
        height = script.getAttribute('data-ad-height') || DEFAULT_AD_HEIGHT;

    var ad = document.createElement('iframe');
    ad.width = width;
    ad.height = height;

    ad.style.border = '1px solid black';
    ad.style.display = 'none';

    ad.src = randomSrc();

    function randomSrc() {
        var index = random(0, ads.length - 1);
        return ads[index];
    }

    return ad;
}

function random(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
};
