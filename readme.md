# WebRTC Video Chat

Very *basic* reference implementation of multi-user, WebRTC video chat in the browser.

notes:

- for testing on different devices on the same local network (assuming you're serving everything from a local device), you have to serve client over https, expose web socket over ws not wss, and then in Firefox, set `network.websocket.allowInsecureFromHTTPS` from `about:config`. If you just deploy everything and serve securely with real SSL, you don't have to worry about this crap.

todo:

- research `peerConnection.setLocalDescription({type: 'rollback'})`
- should both peers be sending offer and answer or just one? should both be sending ICE candidates?
- add STUN. haven't gotten it to work with pion yet :(
- inputs for STUN and TURN servers
- deploy, serve securely
- signal server logging
- client logging

questions:

- how does a caller initiate a call?
  - create peer connection
  - add tracks from userMedia to peer connection
  - how do I specify peer for connection?
- when should we add a video element for a peer?
- how do we get A/V for a peer?
  - peer connection `track` event fires when a track is added to the peer connection's RTCRtpReceiver
- recipient peer adds media in handleVideoOfferMsg
