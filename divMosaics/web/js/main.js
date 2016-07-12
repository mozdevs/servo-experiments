window.addEventListener('load', init);

function init() {
	var stats = new ServoStats();
	document.body.appendChild(stats.dom);

	var demo = new Demo({
    	resolution: 10, // Resolution is the width and height of each mosaic tile - the smaller this value, the more demanding the operation
    	images: ['images/banksy1.jpg', 'images/banksy2.jpg', // List of images that can be selected to be mosaic-ified
             'images/bars.jpg', 'images/chrome.jpg',
             'images/firefox.png', 'images/red.png',
             'images/servo.jpg', 'images/sunset.jpg',
             'images/sunset2.jpg']
	});

	var demoContainer = document.getElementById('demo');
	demoContainer.appendChild(demo.dom);

	requestAnimationFrame(animate);

	function animate(t) {

		requestAnimationFrame(animate);

		stats.start();
	
		demo.animate(t);
		
		stats.end();
		stats.update();
	}
};
