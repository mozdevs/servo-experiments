function NotificationService(notificationTimeout) {
    var el = document.createElement('div');
    el.className = 'notificationBar';

    var textContainer = document.createElement('div');
    textContainer.className = 'notificationInner';
    el.appendChild(textContainer);

    var timeout = notificationTimeout; // Time before a notification disappears
    var transitionTime = 250; // Time for sliding transition to complete
    var waitTime = 250; // Minimum time inbetween notifications

    var p = Promise.resolve();

    function displayMsg(msg) {
        return new Promise((resolve, reject) => {
            el.style.height='30px';
            textContainer.textContent = msg;
            setTimeout(() => {
                setTimeout(() => {
                    textContainer.textContent = '';
                    el.style.height = '0';
                    setTimeout(resolve, transitionTime + waitTime);
                }, timeout);
            }, transitionTime);
        });
    }

    function emit(msg) {
        p.then(() => {
            p = displayMsg(msg);
            return p;
        });
    }

    this.el = el;
    this.emit = emit;
}