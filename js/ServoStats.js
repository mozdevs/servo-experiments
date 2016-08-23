function ServoStats() {

	var getNow = makeGetNowFunction();
	var startTime = getNow();
	var lastTime = startTime,
		time = 0;
	var frames = 0,
		totalFrames = 0;
	var ms = 0;
	var fps = 0,
		fpsSum = 0,
		avgFps = 0;

	var el = document.createElement('div');
	el.className = 'servo-stats';
	//el.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000;background:#f00;color:#fff;';
	var avgFpsEl = document.createElement('span');
	var fpsEl = document.createElement('span');
	var msEl = document.createElement('span');
	var ul = document.createElement('ul');
	// ['avg fps', avgFpsEl]
	[['fps', fpsEl], ['ms', msEl]].forEach((pair) => {
		var title = document.createElement('span');
		title.innerHTML = pair[0] + ': ';
		
		var li = document.createElement('li');
		ul.appendChild(li);
		li.appendChild(title);
		li.appendChild(pair[1]);
	});
	el.appendChild(ul);

	this.dom = document.createElement('div') || el; // CURRENTLY DISABLED
	
	this.start = function() {
		startTime = getNow();
	};


	this.end = function() {
		var now = getNow();
		
		frames += 1;
		// totalFrames++;
		ms = now - startTime;

		fps = (frames * 1000) / (now - lastTime);
		// fpsSum += fps;
		frames = 0;

		if (now > time + 1000) {
			// Update average fps every second
			// avgFps = fpsSum / totalFrames;
			time = now;
		}

		lastTime = now;
		return now;
	};

	this.update = function() {
		// avgFpsEl.innerHTML = Math.round(avgFps);
		// fpsEl.innerHTML = Math.round(fps);
		// msEl.innerHTML = Math.round(ms);
	};


	function makeGetNowFunction() {
		var timerObject = performance || Date;
		return function() {
			return timerObject.now();
		}
	}

}
