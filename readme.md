# WebRTC Video Chat

Very *basic* reference implementation of multi-user, WebRTC video chat in the browser.

notes:

- for testing on different devices on the same local network (assuming you're serving everything from a local device), you have to serve client over https, expose web socket over ws not wss, and then in Firefox, set `network.websocket.allowInsecureFromHTTPS` from `about:config`. If you just deploy everything and serve securely with real SSL, you don't have to worry about this crap.

todo:

- deploy, serve securely
- signal server logging
- client logging
