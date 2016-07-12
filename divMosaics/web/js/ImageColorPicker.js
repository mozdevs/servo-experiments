// ImageColorPicker component - gets colour information from a given html image element 
function ImageColorPicker(img) {

    var c = document.createElement('canvas'),
        ctx = c.getContext('2d');

    var ratio = img.width / img.height;
    
    function getColorGrid(config) {
        // Require that one of width and height are specified:
        console.assert(config.width || config.height);

        var width = config.width || (function () {
            var ratio = img.width / img.height;
            return Math.round(config.height * ratio);
        })();

        var height = config.height || (function () {
            var ratio = img.width / img.height;
            return Math.round(config.width / ratio);
        })();
        
        c.width = width;
        c.height = height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        var data = ctx.getImageData(0, 0, width, height).data,
            xPos = 0,
            grid = [];
        for (var i = 0; i < data.length; i += 4) {
            if (xPos % width === 0) {
                row = [];
                grid.push(row);
                xPos  =  0;
            }
            var r = data[i],
                g = data[i + 1],
                b = data[i + 2],
                a = data[i + 3];

            row.push('rgba(' + r + ', ' + g + ', ' + b  + ', ' + a + ' )');

            xPos += 1;
        }
        return grid;
    }

    this.el = c; // expose canvas (useful for debugging)
    this.getColorGrid = getColorGrid;
}