#[servo-experiments](https://mozdevs.github.io/servo-experiments)
#####A collection of experiments for Servo.  [Get Servo Nightly](https://servo-builds.s3.amazonaws.com/index.html).

These demos aim to show off Servo's rendering capabilities.

## Running Servo
* The easiest way to run Servo is to get [Servo nightly](http://download.servo.org).
* Alternately, clone source from the [Servo repos.](https://github.com/servo/servo) and follow instructions there.

If running from source we recommend using <br />
`./mach run -r -w [URL]` <br />
The `-r` specifies to use the version compiled for release and the `-w` enables WebRender.
<br />
<br />
Optionally, you can also include the `-i` flag to enable [incremental layout](https://github.com/servo/servo/wiki/Layout-Overview#user-content-incremental-layout), which is an experimental new layout algorithm in development.

##Contribute
File bugs and discuss demo ideas using the issue tracker. <br />
Add your own demo by branching and then submitting a PR.  Demos are registered on the main page through `experiments.json`.
