export function closePeerConnection(event, peerConnection) {
	if (!peerConnection) {
		return
	}

	// Disconnect all our event listeners; we don't want stray events
	// to interfere with the hangup while it's ongoing.
	peerConnection.ontrack = null;
	peerConnection.onnicecandidate = null;
	peerConnection.oniceconnectionstatechange = null;
	peerConnection.onsignalingstatechange = null;
	peerConnection.onicegatheringstatechange = null;
	peerConnection.onnotificationneeded = null;

	// Stop all transceivers on the connection
	peerConnection.getTransceivers().forEach(transceiver => {
		transceiver.stop();
	});

	peerConnection.close()
}

export function createPeerConnection(config = {
	peer: undefined,
	localMediaStream: undefined,
	onicecandidate: (event, peerContext) => {},
	oniceconnectionstatechange: (event, peerContext) => {},
	onsignalingstatechange: (event, peerContext) => {},
	onnegotiationneeded: (event, peerContext) => {},
	ontrack: (event, peerContext) => { },
	iceServers: []
}) {
	// TODO: IMPLEMENT START
	let peerConnection = new RTCPeerConnection({ iceServers: config.iceServers })

	config.localMediaStream
		.getTracks()
		.forEach(track => peerConnection.addTransceiver(track, { streams: [config.localMediaStream] }))
	
	const peerContext = {
		peerConnection,
		peer: config.peer
	}
	// TODO: IMPLEMENT END

	peerConnection.onicecandidate = withPeerContext(config.onicecandidate, peerContext);
  peerConnection.oniceconnectionstatechange = withPeerContext(config.oniceconnectionstatechange, peerContext);
	peerConnection.onsignalingstatechange = withPeerContext(config.onsignalingstatechange, peerContext);
	peerConnection.onnegotiationneeded = withPeerContext(config.onnegotiationneeded, peerContext);
	peerConnection.ontrack = withPeerContext(config.ontrack, peerContext);

	return peerConnection
}

function withPeerContext(callback, peerContext) {
	return (event) => callback(event, peerContext)
}
