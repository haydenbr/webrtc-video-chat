# WebRTC Video Chat

Very *basic* reference implementation of multi-user, WebRTC video chat in the browser.

notes:

for testing on different devices on the same local network (assuming you're serving everything from a local device), you have to serve client over https, expose web socket over ws not wss, and then in Firefox, set `network.websocket.allowInsecureFromHTTPS` from `about:config`. If you just deploy everything and serve securely with real SSL, you don't have to worry about this crap.

You can also test on a single device: just open multiple browser tabs, although that's not very interesting.

environment variables and command args:

- `SSL_CERT_PATH` path to ssl cert
- `SSL_KEY_PATH` path to ssl key
- run node commands with `--prod` to use proper port numbers
- run turn server with `--public-ip <your_public_ip>`