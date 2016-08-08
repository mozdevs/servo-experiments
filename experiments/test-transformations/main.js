// skew, rotate X Y Z, translate X Y Z

window.onload = function() {
	var classes = [ 'rotate-x', 'rotate-y', 'rotate-z' ];
	var container = document.getElementById('container');
	var delayInc = 200;

	console.log(classes.length);
	
	for(var i = 0; i < classes.length; i++) {
		var c = classes[i];

		var el = document.createElement('div');
		container.appendChild(el);

		el.classList.add('transitions');

		scheduleToggling(el, c, i * delayInc);
	}

	function scheduleToggling(el, c, delay) {
		console.log('schedule', el, c, delay);
		setTimeout(function() {
			setInterval(function() {
				el.classList.toggle(c);
			});
		}, delay);
	}
};
