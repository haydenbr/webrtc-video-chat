# WebRTC Video Chat

Very basic and somewhat buggy reference implementation of multi-user, WebRTC video chat in the browser. This was developed for a meetup. I don't find slides very helpful in general, but if you want them, they are [here](https://slides.com/haydenbraxton/webrtc-video-chat). The last page of the slides has some links to some helpful learning resources, so do check that out.

When running the example, it's best to use https. You'll need this if you want to test connecting from different devices on the same local network, which is more fun. In order to do that, you'll want to create a self-signed cert. You can follow the directions [here](https://letsencrypt.org/docs/certificates-for-localhost/). The ssl config file is expecting `localhost.cert` and `localhost.key` in the root of this directory. Your browser might have trouble connecting to the signaling server when running on https, though. If that's the case, check out this [SO post](https://stackoverflow.com/questions/5312311/secure-websockets-with-self-signed-certificate/23036270#23036270).

If you don't want to use https, just comment out this line from `./client-dev-server.js`: `https: sslConfig`.

To start the signaling server and client server, run `npm start`. You can open the page at `https://localhost:5500/`. (Make sure to include https if you're running https.).

For the turn-server, you need to [install go](https://golang.org/dl/).

```bash
cd ./turn-server
./build.sh
./build/turn-server --public-ip=<your_public_ip>
```

When running locally, you can test by opening the page in different browser tabs. If you use https, you can also test connecting from different browsers on the same local network.

command args:

- `--ssl-cert-path` path to ssl cert (not required when running locally)
- `--ssl-key-path` path to ssl key (not required when running locally)
- run node commands with `--prod` to use proper port numbers
- run turn server with `--public-ip <your_public_ip>` (set to your local ip address when running locally)