// ImageSelector component - displays multiple images for selection.
function ImageSelector(imageURLs) {
    var el = document.createElement('div');

    imageURLs
        .map((url) => {
            var img = new Image();
            img.src = url;
            img.width = 200;
            img.height = 200;
            img.addEventListener('click', () => {
                el.dispatchEvent(new CustomEvent('imageSelected', {detail: {
                    image: img
                }}));
            })
            return img;
        })
        .forEach(el.appendChild.bind(el));      

    this.el = el;
    this.addEventListener = el.addEventListener.bind(el);
}