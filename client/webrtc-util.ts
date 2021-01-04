import { PeerContext, User } from './types';

export function closePeerConnection(event: Event, peerConnection: RTCPeerConnection) {
	if (!peerConnection) {
		return
	}

	// Disconnect all our event listeners; we don't want stray events
	// to interfere with the hangup while it's ongoing.
	peerConnection.ontrack = null;
	peerConnection.onicecandidate = null;
	peerConnection.oniceconnectionstatechange = null;
	peerConnection.onsignalingstatechange = null;
	peerConnection.onicegatheringstatechange = null;
	peerConnection.onnegotiationneeded = null;

	// Stop all transceivers on the connection
	peerConnection.getTransceivers().forEach(transceiver => {
		transceiver.stop();
	});

	peerConnection.close()
}

type PeerConnectionCallback<EventType = Event> = (event: EventType, peerContext: PeerContext) => void

interface PeerConnectionConfig {
	peer: User,
	localMediaStream: MediaStream | undefined,
	iceServers?: RTCIceServer[],
	onicecandidate: PeerConnectionCallback<RTCPeerConnectionIceEvent>,
	oniceconnectionstatechange: PeerConnectionCallback,
	onsignalingstatechange: PeerConnectionCallback,
	onnegotiationneeded: PeerConnectionCallback,
	ontrack: PeerConnectionCallback<RTCTrackEvent>,
}

export function createPeerConnection(config: PeerConnectionConfig) {
	let peerConnection = new RTCPeerConnection({ iceServers: config.iceServers })

	if (!config.localMediaStream) {
		throw new Error('config.localMediaStream is required')
	}

	config.localMediaStream
		.getTracks()
		.forEach(track => peerConnection.addTransceiver(track, { streams: [config.localMediaStream!] }))
	
	const peerContext = {
		peerConnection,
		peer: config.peer
	}

	peerConnection.onicecandidate = withPeerContext(config.onicecandidate, peerContext);
  peerConnection.oniceconnectionstatechange = withPeerContext(config.oniceconnectionstatechange, peerContext);
	peerConnection.onsignalingstatechange = withPeerContext(config.onsignalingstatechange, peerContext);
	peerConnection.onnegotiationneeded = withPeerContext(config.onnegotiationneeded, peerContext);
	peerConnection.ontrack = withPeerContext(config.ontrack, peerContext);

	return peerConnection
}

function withPeerContext<EventType>(callback: PeerConnectionCallback<EventType>, peerContext: PeerContext) {
	return (event: EventType) => callback(event, peerContext)
}
