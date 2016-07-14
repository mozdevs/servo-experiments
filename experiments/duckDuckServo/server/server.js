var express = require('express');
var app = express();

var store = require('./store');

var imgStore = store('imgs');
var qStore = store('qs');

var ddg = require('ddg');

var qs = { // Used to prevent duplicate queries
    books: {},
    films: {},
    games: {},
    other: {}
};

// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/at/:q', function (req, res) {
    var query = req.params.q;
    ddg.Image(query, function(err, data) {
        res.json({query: query, data: data});
    });
});

app.get('/q/:q', function (req, res) {
    var query = req.params.q;
    if (qs.other[query]) {
        return res.json(qs.other[query]);
    }
    ddg.query(query, function (err, data) {
        if (err || data.RelatedTopics.length === 0) { 
            return res.status(400).end();
        }

        var qObj = {query: query, data: data}
        qStore.add(qObj);
        qs.other[query] = qObj;
        res.json(qObj);
    })
});

function putFn(category) { // Given books, films or games, returns the handling function to store it
    return function (req, res) {
        var qObj = qs[category];

        var title = req.params.title;

        if (qObj[title]) {
            res.json(qObj[title]);
        } else {
            ddg.query(title + ' ' + removeTrailingS(category), function (err, data) {
                if (err || data.Image == '') {
                    return res.status(404).end();
                }
                qObj[title] = {title: title, data: data};
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
    res.json(imgStore.get());
});

app.get('/qs', function (req, res) {
    var allQueries = qStore.get();
    if (allQueries.length === 0) {
        res.status(400).end();
        return;
    }

    res.json(qStore.get());
});

app.get('/clean', function (req, res) { // Dev route for removing all items in the store with empty urls
    imgStore.filter((img) => img.url !== '');
    res.send('Cleaned');
});

app.get('/clear', function (req, res) {
    imgStore.clear();
    qStore.clear();
    res.send('Cleared');
});

app.get('/reduce', function (req, res) {
    qStore.splice(0, qStore.size() / 2);
    res.send('Removed half of stored queries');
});

app.listen(3000);
