function Http() {}

Http.get = function(url, cb) {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.addEventListener('load', function(evt) {
        cb(req.response);
    });
    req.open('GET', url);
    req.send();
};


window.addEventListener('load', function() {
    Http.get('experiments.json', function(data) {
        addExperiments(document.querySelector('#featured-experiments .experiment-previews'), data.featured, true);
        addExperiments(document.querySelector('#other-experiments .experiment-previews'), data.experiments);
        addExperiments(document.querySelector('#technical-tests .experiment-previews'), data.tests);
    });

    var tagWrap = function(tagName, el) {
        var tagEl = document.createElement(tagName);
        tagEl.appendChild(el);
        return tagEl;
    };

    var hrefWrap = function (el, href) {
        var a = tagWrap('a', el);
        a.href = href;
        return a;
    };

    var pWrap = tagWrap.bind(null, 'p');

    function addExperiments(ul, experiments, showDesc) {
        var lis = experiments
        .map(function (info) {
            var article = document.createElement('article');
            article.classList.add('experiment-preview');

            var h2 = document.createElement('h2');
            h2.textContent = info.name;
            article.appendChild(hrefWrap(h2, info.href));

            var screen = document.createElement('img');
            screen.src = info.href + 'thumb.png';
            screen.width = 256;
            screen.height = 256;
            article.appendChild(hrefWrap(screen, info.href));

            if (showDesc) {
                var desc = document.createElement('div');
                desc.classList.add('experiment-desc');
                    if (info.desc.indexOf('<p>') === -1) { // No p tag detected, insert one.
                        desc.appendChild(pWrap(document.createTextNode(info.desc)));
                    } else {
                        // Otherwise just use HTML provided.
                        desc.innerHTML = info.desc;
                    }
                article.appendChild(hrefWrap(desc, info.href));
            }

            return article;
        });

    /*    lis.forEach(function (li, i) {
            setTimeout(function () {
                li.style.opacity = '1';
            }, 150 + ((i + 2) * 150));
        });*/

        // Add the preview elements to dom        
        lis.forEach(function (li) { ul.appendChild(li); } );
    }

    requestAnimationFrame(animate);
    function animate(t) {
        requestAnimationFrame(animate);

        TWEEN.update(t);
    }
});