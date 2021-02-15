Intro
=====

The project demonstrates how to stream your camera and microphone using HTML5, Web RTC and Tornado. The tech is still in development and not very well supported by all browser, however Chrome provides pretty good support of the API.

Web application consists of three pages: home, stream capture and live cast. Capture page uses JavaScript, canvas and Web RTC API to collect audio and video bytes and periodically sends them to streaming server. Cast page allows to re-play received from server data almost in real time.

On back end, Python Tornado HTTP server dispatches messages received from streaming client to consumers as they come. Tornado is very convenient in this case due to it's asynchronous nature and great support of Web Sockets.

Setup
=====

1. Python 3.4+ and Tornado 4.3 should be installed for streaming server.
2. On client side Chrome 47+ is recommended. 
3. Camera and microphone should be enabled in browser's content settings.
4. Chrome allows user media in secure context only. *localhost* is considered secure, but when testing on different machines you should point streaming server by external IP (use public_address in server.config).
5. Firewall does not block network traffic to streaming server.

Implementation Notes
====================

1. Works good in Chrome, Firefox has some issues with audio, not tested with other browsers. There is another way to stream audio which may bring better results for Firefox (oscillator and script processing nodes), but I decided to not venture that far for now.
2. Also works with Chrome for mobile, but performance is poor (maybe because my Nexus 4 is too old).
3. Synchronization is not implemented, meaning stream consumers with frame or samples rate different from streaming machine may have issues playing audio or video. Also audio samples not tied to video frames making slight de-synchronization very likely. For the scope of the project, I choose fixed frame and sample rates at 60 and 44100 correspondingly. 
4. All tests were done in local network over WiFi. In my case, I ended up with about 2MB per second of data sent to streaming server. Most of which are Base64-encoded JPEG images from camera stream thou.
5. I didn't really spend a lot of time optimizing the code, only the essential parts, e.g.: JavaScript queue.
6. For some reasons video freezes when playing cast in browser's tab. However it works fine from a separate browser's window.
7. The server application is not robust, only a few checks here and there.