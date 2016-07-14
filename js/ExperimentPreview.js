var ExperimentPreviewModule = (function(template) {
        var count = 0; // Number of templates so far - used to calculate margin
        return function(expInfo) {
            var cw = document.body.clientWidth,
                ch = document.body.clientHeight;
            var el = template.cloneNode(true);
            el.setAttribute('id', '');
            el.querySelector('.experiment-text').textContent = expInfo.name + ' - ' + expInfo.desc;
            el.addEventListener('click', () => {
                    window.location.href = expInfo.href;
            });

            var margins = {
                marginLeft: cw
            };

            el.style.marginLeft = margins.marginLeft + 'px';
            var fx = {
                opacity: 0
            };
           
            var animateIn = function() {

                var newCount = count++;

                var inAnim = new TWEEN.Tween(margins)
                    .to({marginLeft: (newCount * 50)}, 600)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .onUpdate(() => {
                        el.style.marginLeft = margins.marginLeft + 'px';
                    })

                var opacityAnim = new TWEEN.Tween(fx)
                    .to({opacity: 1}, 1200)
                    .easing(TWEEN.Easing.Sinusoidal.InOut)
                    .onUpdate(() => {
                        el.style.opacity = fx.opacity;
                    })

              var fullTween = { // Object representing the full tween
                    play: () => {
                        inAnim.start();
                        opacityAnim.start();
                    },
                    onComplete: ((cb) => {
                        var completedTweens = 0,
                            numTweens = 1;
                        var oc = () => {
                            if (++completedTweens === numTweens) {
                                cb();
                            }
                        };
                        inAnim.onComplete(oc);
                        opacityAnim.onComplete(oc);

                    })
                }

                return fullTween;
            };

            return {
                el: el,
                animateIn: animateIn
            };
        };
});