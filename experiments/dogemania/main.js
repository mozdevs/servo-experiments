window.onload = function() {
	var imageURL = '../../servo.png';
	var imageWidth = 512;
	var imageHeight = 512;
	var imageCounter = 0;

	var h1 = document.querySelector('h1');
	var container = document.getElementById('container');

	setInterval(addImage, 1000);

	function addImage() {
		var w = window.innerWidth - imageWidth;
		var h = window.innerHeight - imageHeight;
		var img = document.createElement('img');
		img.src = imageURL;

		container.appendChild(img);
		setPosition(img, random(w), random(h));

		setTimeout(function() {
			setPosition(img, random(w), random(h));
		}, 500);

		imageCounter++;

		h1.innerHTML = imageCounter;
	}

	function random(maxValue) {
		return Math.round(Math.random() * maxValue);
	}

	function setPosition(element, x, y) {
		console.log(x, y);
		element.style.left = x + 'px';
		element.style.top = y + 'px';
	}
};
