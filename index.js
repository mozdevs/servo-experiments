function Http() {}

Http.get = function(url, cb) {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.addEventListener('load', (evt) => {cb(req.response);});
    req.open('GET', url);
    req.send();
};

function ExperimentPreview() {
    return 
}

window.addEventListener('load', function() {
    var main = document.querySelector('main');

    var ExperimentPreview = ExperimentPreviewModule(document.getElementById('experimentPreviewTemplate'));

    Http.get('experiments.json', function(data) {
        var eps = data.experiments
            .map((info) => new ExperimentPreview(info))

        // Add the preview elements to dom        
        eps.forEach((ep) => main.appendChild(ep.el));

        // Consecutively animate all elements in
        eps
            .map((ep) => ep.animateIn())
            .reduce((anim, nextAnim) => {
                anim.onComplete(() => nextAnim.play());
                return anim;
            }).play();

    });


    requestAnimationFrame(animate);
    function animate(t) {
        requestAnimationFrame(animate);

        TWEEN.update(t);
    }
});