
function ImageColorPicker(img) {

	var c = document.createElement('canvas'),
		ctx = c.getContext('2d');
	function getColorGrid(width, height) {
		c.width = width;
		c.height = height;
		ctx.drawImage(img, 0, 0, width, height);

		var data = ctx.getImageData(0, 0, width, height).data,
			xPos = 0,
			grid = [],
			row = [];
		for (var i = 0; i < data.length; i += 4) {
			var r = data[i].toString(16),
				g = data[i + 1].toString(16),
				b = data[i + 2].toString(16);

			row.push('#' + r + g + b);
			if (xPos % width === 0) {
				row = [];
				grid.push(row);
				xPos  = 0;
			}
			xPos += 1;

		}
		console.log(grid);
		return grid;
	}

	this.getColorGrid = getColorGrid;
}