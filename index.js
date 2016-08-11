function Http() {}

Http.get = function(url, cb) {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.addEventListener('load', (evt) => {cb(req.response);});
    req.open('GET', url);
    req.send();
};


window.addEventListener('load', function() {

    Http.get('experiments.json', function(data) {
        addExperiments(document.querySelector('#featured-experiments .experiments-list'), data.featured);
        addExperiments(document.querySelector('#other-experiments .experiments-list'), data.experiments);
        addExperiments(document.querySelector('#technical-tests .experiments-list'), data.tests);
    });

    function addExperiments(ul, experiments) {
        var lis = experiments
            .map((info) => {
                var li = document.createElement('li');

                var h3 = document.createElement('h3');
                h3.textContent = info.name;
                li.addEventListener('click', function() {
                    window.location.href = info.href; 
                });

                var screen = document.createElement('img');
                screen.src = info.href + 'thumb.png';
                screen.width = 256;
                screen.height = 256;
                li.appendChild(h3);
                li.appendChild(screen);
                return li;
            });

        lis.forEach((li, i) => {
                setTimeout(() => {
                    li.style.opacity = '1';
                }, 150 + ((i + 2) * 150));
            });

        // Add the preview elements to dom        
        lis.forEach((li) => ul.appendChild(li));


    }


    requestAnimationFrame(animate);
    function animate(t) {
        requestAnimationFrame(animate);

        TWEEN.update(t);
    }
});