function Http() {}

Http.get = function(url, cb) {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.addEventListener('load', (evt) => {cb(req.response);});
    req.open('GET', url);
    req.send();
};


window.addEventListener('load', function() {
    var main = document.querySelector('main .experiments-list');

    var ExperimentPreview = experimentPreviewModule(document.getElementById('experimentPreviewTemplate'));
    Http.get('experiments.json', function(data) {
        var eps = data.experiments
            .map((info) => {
                var li = document.createElement('li');
                li.textContent = info.name;
                li.addEventListener('click', function() {
                    window.location.href = info.href; 
                })
                return li;
                // new ExperimentPreview(info);
            });

        eps.forEach((li, i) => {
                setTimeout(() => {
                li.style.transform = 'translateX(' + (i * 2) + '%)'; // Cause the element to be animated in
                }, (i + 1) * 150);
            });

        // Add the preview elements to dom        
        eps.forEach((ep) => main.appendChild(ep));

        // Consecutively animate all elements in
        /*eps
            .map((ep) => ep.animateIn())
            .reduce((anim, nextAnim) => {
                anim.onComplete(() => nextAnim.play());
                return anim;
            }).play();*/

    });


    requestAnimationFrame(animate);
    function animate(t) {
        requestAnimationFrame(animate);

        TWEEN.update(t);
    }
});