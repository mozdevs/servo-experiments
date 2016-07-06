var express = require('express');
var app = express();

var _ = require('underscore');

var Jimp = require('jimp');

// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/c/:url', function (req, res) {
    if (!(req.query.width && req.query.height)) {
        return res.status(406).send('Width and height required.');
    }
    var imgURL = 'images/' + req.params.url;
    var width = parseInt(req.query.width, 10),
        height = parseInt(req.query.height, 10);
    
    Jimp.read(imgURL, function (err, image) {
        if (err) {
            return res.status(404).send(err);
        }
        image = image.resize(width, height);
        // image.write('test.jpg');
        
        var grid = [];
        _.times(image.bitmap.height, (y) => {
            var row = [];
            _.times(image.bitmap.width, (x) => {
                var hexColor = image.getPixelColor(x, y).toString(16);
                row.push('#' + hexColor);
            });

            grid.push(row);
        })
        res.status(200).send(grid);
    })
})

app.listen(3000);