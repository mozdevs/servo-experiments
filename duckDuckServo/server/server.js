var express = require('express');
var app = express();

var imgStore = require('./store')('imgs');

var ddg = require('ddg');

var qs = { // Used to prevent duplicate queries
    books: {},
    films: {},
    games: {}
};

app.get('/at/:q', function (req, res) {
    var query = req.params.q;
    ddg.Image(query, function(err, data) {
        res.json(data);
    });
});

function putFn(category) { // Given books, films or games, returns the handling function to store it
    return function (req, res) {
        var qObj = qs[category];

        var title = req.params.title;
        if (qObj[title]) {
            res.json(qObj[title]);
        } else {
            ddg.Image(query + removeTrailingS(cateogry), function (err, data) {
                if (err || data == '') {
                    res.status(404).end();
                }
                qObj[title] = {url: data};
                imgStore.add(qObj[title]);
                res.status(201).end();
            });
        }
    };
}

function removeTrailingS(str) {
    return str.substr(0, str.length - 1);
}

app.put('/book/:title', putFn('books'));

app.put('/film/:title', putFn('films'));

app.put('/game/:title', putFn('games'));

app.get('/imgs', function (req, res) {
    res.send(imgStore.get());
});

app.listen(3000);
