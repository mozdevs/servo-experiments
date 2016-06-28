function Demo() {
	var iframes;
	var el = document.createElement('div');
	
	var urls = [
		'https://en.wikipedia.org/wiki/Mozilla',
		'https://en.wikipedia.org/wiki/Servo_(layout_engine)'
	];

	iframes = urls.map((url) => {
		var iframe = document.createElement('iframe');
		iframe.style.display = 'block';
		iframe.src = url;
		iframe.innerText = url;
		return iframe;
	});

	iframes.forEach(appender(el));

	this.animate = function(t) {
		var t_ = t * 0.0025;
		var radius = 100;
		var num = iframes.length;
		
		var alpha = 0;
		var angIncrease = Math.PI * 2 / num;

		for (var i = 0; i < num; i++) {
			var beta = t_ + alpha;
			var x = Math.round(radius * Math.sin(beta));
			var y = Math.round(radius * Math.cos(beta));
			var iframe = iframes[i];
			var transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
			applyTranslate(iframe, x, y);
			//iframe.style.transform = transform;
			//iframe.style.left = x + 'px';
			//iframe.style.top = y + 'px';
			iframe.width = 100;
			
			alpha += angIncrease;

		}
	};

	this.dom = el;
}
