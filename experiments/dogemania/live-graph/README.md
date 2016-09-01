# live-graph
Lightweight canvas graph for plotting real-time data.

##Installation
Clone repos.<br />
Insert into `<head>`:
```html
<link rel="stylesheet" type="text/css" href="live-graph/css/livegraph.css" />
<script type="text/javascript" src="live-graph/js/livegraph.js"></script>
```

##Basic Usage
```javascript
 window.addEventListener('load', () => {
            var el = document.getElementById('liveGraph');
            var graph = new LiveGraph(el, {
                maxY: 50
            });

            var x = 0,
                y = 0;
                
            requestAnimationFrame(plot);
            function plot(t) {
                requestAnimationFrame(plot);
                graph.timePlot(y);
                x += 1;
                y = Math.abs(Math.sin(x / 20)) * 50;
            };
});
```

##Full usage example
```javascript
 window.addEventListener('load', () => {
            var el = document.getElementById('liveGraph');
            var graph = new LiveGraph(el, {
                maxY: 50, // This means that a value  of '50' will be plotted on the top edge of the graph display.
                width: 550,
                height: 400,
                label: 'Distance',
                units: 'metres',
                theme: {
                  fg: '#07FAFF',        
                  bg: '#232323'
                }
            });

            var x = 0,
                y = 0;
                
            requestAnimationFrame(plot);
            function plot(t) {
                requestAnimationFrame(plot);
                graph.timePlot(y);
                x += 1;
                y = 50 * Math.abs(Math.sin(x / 50));
            };
});
```
The above code gives:<br />
<img src="demo/demo.gif" />

##LiveGraph
```javascript
new LiveGraph(el, options);
```
where
* `el` is the DOM element to place the graph into.
* `options` is an object:
  * `options.maxY` - **required**, the max y value that will be used - this determines the scale of the graph.
  * `options.width` - optional, the width in px of the graph.
  * `options.height` - optional, the height in px of the graph.
  * `options.label` - optional, name for the values which the graph is plotting.
  *  `options.units` - optional, the units in which the graph is plotting.
  *  `theme` - optional, an object:
    * `theme.fg` - **required** a string reprsenting the foreground colour of the graph e.g. `#FF0000`.
    * `theme.bg` - **required** a string representing the background colour of the graph e.g. `rgba(16, 16, 16, 0.6)`.
