#[servo-experiments](https://mozdevs.github.io/servo-experiments)
#####A collection of experiments for Servo.  [Get Servo Nightly](https://servo-builds.s3.amazonaws.com/index.html).

These demos aim to show off Servo's rendering capabilities.

<img src="screens/indexScreenshot.png" />

## Running Servo
* The easiest way to run Servo is to get [Servo nightly](http://download.servo.org).
* Alternately, clone source from the [Servo repos.](https://github.com/servo/servo) and follow instructions there.

If running from source we recommend using <br />
`./mach run -r -w [URL]` <br />
The `-r` specifies to use the version compiled for release and the `-w` enables WebRender.
<br /><br />
To see FPS and other stats, run using <br />
`./mach run -w -r -- -Z wr-stats [URL]`


##Contribute
All contributions welcome.<br />
Add a demo by branching and then submitting a PR.  Demos live in the `experiments` directory and are described in `experiments.json`.
