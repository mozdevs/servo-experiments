function Demo() {
    var el = document.createElement('div');
    var listener = new window.keypress.Listener();

    var cb = new ControlBar();
    el.appendChild(cb.el);

    function fetchImages() {
        Http.get('http://localhost:3000/imgs', function (imgs) {
            if (!imgs) { return; }
            _.pluck(imgs, 'data')
                .map((data) => {
                    var div = document.createElement('div');
                    div.className = 'floatingImg';
                    div.style.backgroundImage = 'url(' + data.Image + ')';
                    div.appendChild(document.createTextNode(data.AbstractText));
                    var img = new Image();
                    img.src = data.Image;
                    div.style.width = img.width + 'px';
                    div.style.height = img.height + 'px';
                    console.log(img.width, img.height);
                    // div.appendChild(img);
                    return div;
                })
                .forEach((img) => {
                    el.appendChild(img);

                    // Now tween
                  /*  img.addEventListener('mouseover', (evt) => {
                        var scale = {sx: 1, sy: 1};
                        var r = 4;
                        var enlargeTween = new TWEEN.Tween(scale)
                        .to({sx: r, sy: r}, 300)
                        .easing(TWEEN.Easing.Sinusoidal.In)
                        .onUpdate(() => {
                            img.style.transform = 'scale(' + scale.sx + ',' +  scale.sy + ')';
                        })
                        .start();

                        img.addEventListener('mouseout', (evt) => {
                            enlargeTween.stop();
                            new TWEEN.Tween(scale)
                            .to({sx: 1, sy: 1}, 300)
                            .easing(TWEEN.Easing.Sinusoidal.Out)
                            .onUpdate(() => {
                                img.style.transform = 'scale(' + scale.sx + ',' +  scale.sy + ')';
                            })
                            .start();
                        });
                    });*/



                    img.style.position = 'absolute';
                    var randDest = {
                        tx: _.random(0, 10),
                        ty: _.random(0, 10)
                    };
                    var transform = {tx: 0, ty: 0};
                    new TWEEN.Tween(transform)
                        .to(randDest, 800)
                        .easing(TWEEN.Easing.Sinusoidal.InOut)
                        .onUpdate(() => {
                            // img.style.transform = 'translate(' + transform.tx + 'px,' +  transform.ty + 'px)';
                            img.style.left = transform.tx + 'vw';
                            img.style.top = transform.ty + 'vh';
                        })
                        .start();
                })
        });
    }


    var currentCardSet = [];
    function processQuery(query) {
        Http.get('http://localhost:3000/q/' + query, handleQueryResponse);
    }

    function handleQueryResponse(res) {
            var queryStr = res.query;
            res = res.data;

            var allCards = []; 
            // Partition related topics into cards and further topics
            var [cards, topics] = _.partition(res.RelatedTopics, (item) => 'Text' in item);
            allCards = allCards.concat(cards);

            // Extract cards from topics
            _.pluck(topics, 'Topics').forEach((cards) => {
                allCards = allCards.concat(cards);
            });

            // Filter out the cards without images
            allCards = allCards.filter((card) => card.Icon.URL);

            var cardTemplate = document.getElementById('cardTemplate');

            var cardPas = allCards
                .map((card) => {
                    var cardDiv = cardTemplate.cloneNode(true);
                    cardDiv.id = '';

                    // Heading
                    var heading = cardDiv.querySelector('h2');
                    heading.textContent = queryStr;
                    // Img
                    var img = cardDiv.querySelector('img');
                    img.src = card.Icon.URL;
                    // img.className = 'hidden'; 

                    if (!card.Icon.URL) {
                        img.className = 'hidden'; 
                    }

                    // Text
                    var p = cardDiv.querySelector('.card-text');
                    // p.innerHTML = card.Text;

                    // IFrame
                    var iframe = document.createElement('iframe');
                    iframe.src = card.FirstURL;
                    p.appendChild(iframe);


                    // Actions
                    var actions = cardDiv.querySelector('.card-actions > a');
                    actions.textContent = 'Read More';
                    actions.setAttribute('href', card.FirstURL);

                    return new PerspectiveAnimatable(cardDiv);
                });
           
            cardPas.forEach((cardPa) => {
                    el.appendChild(cardPa.el);
                    cardPa.toggle();
            });

            currentCardSet = cardPas;

    }

    Http.get('http://localhost:3000/qs', function (res) {
        // Res is a list of all historical query results
        res.forEach(handleQueryResponse);
    });

    cb.addEventListener('query', function (evt) {
        var query = evt.detail.query;
        processQuery(query);
    });


    listener.simple_combo('shift space', () => {cb.toggle();});

    this.dom = el;
    this.animate = function(t) {
        TWEEN.update(t);
    }
}
