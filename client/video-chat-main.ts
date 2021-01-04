import {
	getCallSettings,
	insertVideoTemplate,
	getLocalVideoContainer,
	getPeerVideoContainer,
	setPeerVideoMediaStream,
	removePeerVideoTemplate,
	initSettingsForm,
	hideCallSettings,
} from './template-util'
import {
	connectToSignalingServer,
	sendSignalMessage as _sendSignalMessage,
} from './signaling-server-connection'
import { getUserMedia } from './user-media'
import { closePeerConnection, createPeerConnection } from './webrtc-util'
import { getIceServers } from './ice-servers';
import { User, SignalingMessageType, SignalingServerConnectedMessage, UserListMessage, OfferMessage, SignalingMessage, Peer, PeerContext, AnswerMessage, IceCandidateMessage } from './types'

interface AppState {
	localMediaStream: MediaStream | undefined,
	peers: Record<string, Peer>
	currentUser: User
	isNewUser: boolean,
}

let state: AppState = {
	localMediaStream: undefined,
	peers: {},
	currentUser: {
		userName: '',
		userId: ''
	},
	isNewUser: true,
}

document.addEventListener('DOMContentLoaded', () => initSettingsForm({ onSubmit: () => joinCall() }))

async function joinCall(): Promise<void> {
	await connectToSignalingServer(getCallSettings().signalingServer, messageHandlers)
	
	state.currentUser.userName = getCallSettings().userName
	hideCallSettings()

	await initLocalVideo(`${state.currentUser.userName} (Me)`)
	sendJoinMessage()
}

async function initLocalVideo(label: string) {
	// TODO: IMPLEMENT
	state.localMediaStream = await getUserMedia()
	
	insertVideoTemplate({
		label: label,
		mediaStream: state.localMediaStream,
		muted: true,
		parent: getLocalVideoContainer()
	})
}

function sendJoinMessage() {
	sendSignalMessage({
		type: SignalingMessageType.Join,
	})
}

const messageHandlers = {
	[SignalingMessageType.SignalServerConnected]: saveUserId,
	[SignalingMessageType.UserList]: updateUserList,
	[SignalingMessageType.Offer]: respondToOffer,
	[SignalingMessageType.Answer]: saveSdpAnswer,
	[SignalingMessageType.IceCandidate]: addIceCandidate
}

function saveUserId(message: SignalingServerConnectedMessage) {
	state.currentUser.userId = message.userId
}

function updateUserList(message: UserListMessage) {
	message.users.forEach(u => {
		if (u.userId !== state.currentUser.userId && !state.peers[u.userId]) {
			state.peers[u.userId] = u
		}
	})

	if (state.isNewUser) {
		state.isNewUser = false
		callPeers()
	}
}

function callPeers() {
	// TODO: IMPLEMENT
	Object.values(state.peers).forEach(peer => initPeerConnection(peer))
}

function initPeerConnection(peer: Peer) {
	// TODO: IMPLEMENT
	insertVideoTemplate({
		label: peer.userName,
		parent: getPeerVideoContainer(),
		videoId: peer.userId
	})
	let peerConnection = createPeerConnection({
		peer,
		localMediaStream: state.localMediaStream,
		// when our local ICE agent finds a candidate
		onicecandidate: sendIceCandidateToPeer,
		oniceconnectionstatechange: handleICEConnectionStateChangeEvent,
		onsignalingstatechange: handleSignalingStateChangeEvent,
		// this starts the calling process
		// this event is triggered when you add a tranceiver
		onnegotiationneeded: createOffer,
		// we get peer media here
		ontrack: displayPeerMedia,
		iceServers: getIceServers()
	})

	state.peers[peer.userId] = {
		...peer,
		peerConnection
	}

	return peerConnection
}

function sendIceCandidateToPeer(event: RTCPeerConnectionIceEvent, peerContext: PeerContext) {
	// TODO: IMPLEMENT
  if (event.candidate) {
    sendSignalMessage({
      type: SignalingMessageType.IceCandidate,
      recipientId: peerContext.peer.userId,
      candidate: event.candidate
    });
  }
}

function handleICEConnectionStateChangeEvent(event: Event, peerContext: PeerContext) {
	// TODO: IMPLEMENT
	if (['closed', 'failed', 'disconnected'].includes(peerContext.peerConnection.iceConnectionState)) {
		disposePeerConnection(event, peerContext)
	}
}

function handleSignalingStateChangeEvent(event: Event, peerContext: PeerContext) {
	// TODO: IMPLEMENT
	if (peerContext.peerConnection.signalingState === 'closed') {
    disposePeerConnection(event, peerContext)
  }
}

function disposePeerConnection(event: Event, peerContext: PeerContext) {
	removePeerVideoTemplate(peerContext.peer.userId);
	closePeerConnection(event, peerContext.peerConnection);
}

async function createOffer(event: Event, peerContext: PeerContext) {
	// TODO: IMPLEMENT
	let { peerConnection, peer } = peerContext
	const offer = await peerConnection.createOffer();

	// if signaling state is not 'stable', then it means
	// we're already in the process of resolving local/remote SDPs
	// we don't want to create another offer in this case
	if (peerConnection.signalingState !== 'stable') {
		return;
	}

	await peerConnection.setLocalDescription(offer);

	sendSignalMessage({
		recipientId: peer.userId,
		type: SignalingMessageType.Offer,
		sdp: peerConnection.localDescription
	});
}

function displayPeerMedia(event: RTCTrackEvent, peerContext: PeerContext) {
	// TODO: IMPLEMENT
	setPeerVideoMediaStream(peerContext.peer.userId, event.streams[0])
}

async function respondToOffer(message: OfferMessage) {
	// TODO: IMPLEMENT
	let peer = state.peers[message.senderId];
	let peerConnection = peer.peerConnection || initPeerConnection(peer);

  let remoteSdp = new RTCSessionDescription(message.sdp);

  if (peerConnection.signalingState !== 'stable') {
    await Promise.all([
      peerConnection.setLocalDescription({type: 'rollback'}),
      peerConnection.setRemoteDescription(remoteSdp)
    ]);
    return;
  } else {
    await peerConnection.setRemoteDescription(remoteSdp);
  }

  await peerConnection.setLocalDescription(await peerConnection.createAnswer());

  sendSignalMessage({
		recipientId: message.senderId,
    type: SignalingMessageType.Answer,
    sdp: peerConnection.localDescription
  });
}

async function saveSdpAnswer(message: AnswerMessage) {
	// TODO: IMPLEMENT
	let { peerConnection } = state.peers[message.senderId];

	if (!peerConnection) {
		throw new Error('peerConnection undefined');
	}

	let remoteSdp = new RTCSessionDescription(message.sdp);
	
	await peerConnection.setRemoteDescription(remoteSdp);
}

async function addIceCandidate(message: IceCandidateMessage) {
	// TODO: IMPLEMENT
	let { peerConnection } = state.peers[message.senderId];
	if (!peerConnection) {
		throw new Error('peerConnection undefined');
		return;
	}
	
	let candidate = new RTCIceCandidate(message.candidate);

	await peerConnection.addIceCandidate(candidate)
}

function sendSignalMessage(message: { type: SignalingMessageType, recipientId: string }) {
	_sendSignalMessage({
		senderId: state.currentUser.userId,
		...message
	})
}