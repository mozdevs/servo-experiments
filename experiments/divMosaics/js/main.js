window.addEventListener('load', init);

function init() {
	var stats = new ServoStats();
	document.body.appendChild(stats.dom);

	var demo = new Demo({
    	resolution: 18, // Resolution is the width and height of each mosaic tile - the smaller this value, the more demanding the operation
    	images: ['images/banksy1.jpg', 'images/banksy2.jpg', // List of images that can be selected to be mosaic-ified
             'images/bars.jpg', 
             'images/servo.png',
             'images/firefox.png',
             'images/chrome.jpg',
             'images/sunset.jpg',
             'images/sunset3.jpeg'
             ]
	});

	var demoContainer = document.getElementById('demo');
	demoContainer.appendChild(demo.dom);

	requestAnimationFrame(animate);

	function animate(t) {

		requestAnimationFrame(animate);

		stats.start();
	
		stats.end();
		stats.update();
	}
};
