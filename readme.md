# WebRTC Video Chat

Very *basic* reference implementation of multi-user, WebRTC video chat in the browser.

todo:

- add video template for peers
- set up peer connections, callbacks, and signal message handlers
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
