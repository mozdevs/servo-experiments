function appender(parent) { // Creates function that appends to given element
		return function(newChild) {
			parent.appendChild(newChild);
		};
}

function applyTranslate(elem, x, y) {
		var transform = 'translateX(' + x + 'px) translateY(' + y + 'px)';
		elem.style.transform = transform;
}