# servo-experiments
#####A collection of experiments for Servo.  [Get Servo Nightly](https://servo-builds.s3.amazonaws.com/index.html).

---
## DuckDuckServo
1. Animated user interface for searching the web using DuckDuckGo.
2. Shift-Space toggles the search bar.
3. Clicking on a search result gives more info, presented an IFrame.
4. To perform queries, the front end contacts a simple node server which interfaces with the DuckDuckGo API.
5. Historical queries are cached and retrieved on page load.

####Installation:
`npm install` in server directory.

####To run:
Run `node server.js` in server directory. <br /> 
Navigate to web/index.html in Servo. 

<img alt="DuckDuckServo search bar" width="250" src="https://github.com/mozdevs/servo-experiments/blob/master/screens/duckDuckServo/searchBar.png?raw=true" />
<img alt="DuckDuckServo search results" width="250" src="https://github.com/mozdevs/servo-experiments/blob/master/screens/duckDuckServo/searchResults.png?raw=true" />
<img alt="DuckDuckServo results expand" width="250" src="https://github.com/mozdevs/servo-experiments/blob/master/screens/duckDuckServo/resultsExpand.png?raw=true" />

---
## Physics IFrames Sandbox
1. Physics simulations using wikipedia IFrames as the 'entities'.
2. Pressing space spawns a big IFrame at random position.
3. Clicking the mouse spawns a small IFrame at mouse position.
4. Press 'r' to make it rain IFrames.

####To run:
Navigate to index.html in Servo. 

<img alt="Physics IFrames Pileup" width="500" src="https://github.com/mozdevs/servo-experiments/blob/master/screens/physics/pileup.png?raw=true" />

---
## DIV Waves
1. Animated wave effect using HTML div elements and [tween.js](https://github.com/tweenjs/tween.js/).

####To run:
Navigate to index.html. 

<img alt="DIV Waves" width="500" src="https://github.com/mozdevs/servo-experiments/blob/master/screens/divWaves/waves.png?raw=true" />

---
## DIV Mosaics
1. Animated image mosaic effect using HTML div elements and [tween.js](https://github.com/tweenjs/tween.js/).
2. Client requests and downloads colour information of a selected image from the server and animates the construction of a low-res mosaic rendition.

####Installation:
`npm install` in server directory.

####To run:

Run `node server.js` in server directory. <br /> 
Navigate to web/index.html.

####Example
Original source image: <br />
<img alt="DIV Mosaics" width="300" src="https://github.com/mozdevs/servo-experiments/blob/master/screens/divMosaics/banksyOriginal.jpg?raw=true" />

DIV Mosaic construction and final result in browser: <br />
<img alt="DIV Mosaics" width="250" src="https://github.com/mozdevs/servo-experiments/blob/master/screens/divMosaics/banksyConstruction.png?raw=true" />
<img alt="DIV Mosaics" width="250" src="https://github.com/mozdevs/servo-experiments/blob/master/screens/divMosaics/banksyMosaic.png?raw=true" />
