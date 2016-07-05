function Demo() {
    var el = document.createElement('div');
    var listener = new window.keypress.Listener();

    PIFrame.ROT_ENABLED = true;

    var world = new p2.World({gravity: [0, -200]});
    var stage = new Stage(el, world);

    function addIFrame(x, y, width, height) {
        var boxShape = new p2.Box({width: width, height: height});
        var boxBody = new p2.Body({
            mass: 0.01,
            position: [x, y]
        });
        boxBody.addShape(boxShape);
        var physicsIFrame = new PIFrame(stage, 'https://en.wikipedia.org/wiki/Special:Random', x, y, width, height);
        var domBody = new DOMBody(physicsIFrame, boxBody);
        domBody.hide();
        stage.addDOMBody(domBody);
    }


    listener.simple_combo('space', function(evt) {
        var x =_.random(stage.left, stage.right);
        var y = _.random(stage.top, 0);
        addIFrame(x, y, 400, 400);
    });

    window.addEventListener('click', function (evt) {
        var x = evt.clientX - (stage.width / 2);
        var y = evt.clientY - (stage.height / 2);
        var w = 100;
        var h = 100;
        addIFrame(x, y, w, h);
    });
   
    planeShape = new p2.Plane({height: 200});
    planeBody = new p2.Body({position: [0, stage.bottom]});
    planeBody.addShape(planeShape);
    world.addBody(planeBody);

    this.dom = el;
    this.animate = function(t) {
        // TWEEN.update(t);

        world.step(1/60);

        stage.domBodies().forEach((child) => {
            // child.body.applyForce([_.random(0, 20), 0]);
            child.pos(child.body.position[0], child.body.position[1]);
            child.rot(child.body.angle);
        });
    };
}
