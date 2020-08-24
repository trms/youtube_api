#You Tube Player Proxy#

This app is designed to be loaded by Carousel Players to play youtube videos using the YouTube iFrame API.

##Player Use##
Load the index.html with the following query params
fullUrl={string} the share url from youtube entered into the bulletin
captionsEnabled={boolean}

###Status Feedback###
The app send events back to the player containing a status object for events like playing, paused, ended, error, etc
It will use the folowing mechanisms
BrightSign: BSMessagePort.PostBSMessage
Apple: webkit.messageHandlers.videoEvent.postMessage
Web: window.postMessage

The app will respond to window.postMessage events containing a string of "pause" or "play" to facilitate looping of the video.

##Development##
The project is built using webpack and uses the jest testing framework.

`npm install` install dependancies
`npm run-script test` run the test suite once
`npm run-script test-watch` run the test suite in an live reload state
`npm run-script serve` opens a dev server in the browser
`npm run-script build` build the project in production mode