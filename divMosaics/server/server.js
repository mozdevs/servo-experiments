var express = require('express');
var app = express();

var _ = require('underscore');

var dir = require('node-dir'),
    path = require('path');
var Jimp = require('jimp');

var imgFormats = { // Recognised image extensions
    png: true,
    jpg: true,
    jpeg: true,
    bmp: true
};

// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/images', function (req, res) { // Gives a list of all available image URLs
    dir.readFiles(__dirname + '/images', (err, content, next) => {
        if (err) { 
            return res.status(501).send(err);
        }
        next();
    },
    (err, files) => {
        if (err) {
            return res.status(501).send(err);
        }
        // Send list of all the routes corresponding to images with valid extensions in images directory
        res.send(files
                    .map(_.partial(path.relative, __dirname + '/images')) // Extract filename from full path
                    .filter((p) => path.extname(p.toLowerCase()).substr(1) in imgFormats) // Filter out invalid extensions
                    .map((imgFilename) => 'image/' + imgFilename)); // Transform to corresponding URL
    });
    
});

app.get('/image/:filename', function (req, res) { // Serves single image from image directory, by filename
    var filename = req.params.filename;
    var colorFlag = req.query.c; // Flag specifying whether to give back the image in the form of a 2D array of hex colours

    if (!filename) {
        return res.status(406).send('Filename required.');
    }

    if (colorFlag && !(req.query.width && req.query.height)) { // Error checking for colorFlag case
        return res.status(406).send('Width and height required.');
    }

    var imagePath = __dirname + '/images/' + filename;
    var width = parseInt(req.query.width, 10),
        height = parseInt(req.query.height, 10);

    if (colorFlag) {
        getColorGrid(imagePath, width, height, function (err, grid) {
            if (err) {
                return res.status(501).send(err);
            }
            res.send(grid);
        });
    } else {
        res.sendFile(imagePath);
    }
})


function getColorGrid(imgURL, width, height, onComplete) {
    Jimp.read(imgURL, function (err, image) {
        if (err) {
            return onComplete(err);
        }

        image = image.resize(width, height);
        // image.write('test.jpg');
        
        var grid = [];
        _.times(image.bitmap.height, (y) => {
            var row = [];
            _.times(image.bitmap.width, (x) => {
                var hexColor = image.getPixelColor(x, y).toString(16);
                    if (hexColor.length > 6) {
                        hexColor = hexColor.substr(0, 6);
                    }
                row.push('#' + hexColor);
            });

            grid.push(row);
        })
        onComplete(null, grid);
    });
}

app.listen(3000);