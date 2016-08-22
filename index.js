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
        addExperiments(document.querySelector('#featured-experiments .experiment-previews'), data.featured);
        addExperiments(document.querySelector('#other-experiments .experiment-previews'), data.experiments);
        addExperiments(document.querySelector('#technical-tests .experiment-previews'), data.tests);
    });

    var hrefWrap = (el, href) => {
        var a = document.createElement('a');
        a.href = href;
        a.appendChild(el);
        return a;
    }

    function addExperiments(ul, experiments) {
        var lis = experiments
            .map((info) => {
                var article = document.createElement('article');
                article.classList.add('experiment-preview');
                var h3 = document.createElement('h3');
                h3.textContent = info.name;

                var screen = document.createElement('img');
                screen.src = info.href + 'thumb.png';
                screen.width = 256;
                screen.height = 256;
                article.appendChild(hrefWrap(h3, info.href));
                article.appendChild(hrefWrap(screen, info.href));
                return article;
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