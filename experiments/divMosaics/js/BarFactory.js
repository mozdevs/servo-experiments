// Provides 'available' Bar elements on demand, creating new ones where nescessary
function BarFactory() {
	var free = []; // List of bars which are free to be re used
	var bCount = 0;

	function bar(x, y, w, h, color) {
		var bar;
		if (free.length > 0) {
			bar = free.shift();
			bar.setPos(x, y);
			bar.setSize(w, h);
			bar.setColor(color);
		} else {
			// Create new bar
			bar = new Bar(x, y, w, h, color);
		}
		bar.free = bar.free || function() { // To be called when bar can be re-used
			free.push(bar);
		};
		return bar;
	}

	// Populate the bar factory with n readily-availabe bars
	function populate(n) {
		_.times(n, () => {
			free.push(new Bar(0, 0, 0, 0, 'red'));
		});

		return this;
	}

	this.bar = bar;
	this.populate = populate;
}