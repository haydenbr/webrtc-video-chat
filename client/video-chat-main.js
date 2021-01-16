'use strict';

import { messageTypes } from '/shared/message-types.js'
import {
	getCallSettings,
	insertVideoTemplate,
	getLocalVideoContainer,
	getPeerVideoContainer,
	setPeerVideoMediaStream,
	removePeerVideoTemplate,
	initSettingsForm,
	hideCallSettings,
} from './template-util.js'
import {
	connectToSignalingServer,
	sendSignalMessage as _sendSignalMessage,
} from './signaling-server-connection.js'
import { getUserMedia } from './user-media.js'
import { closePeerConnection, createPeerConnection } from './webrtc-util.js'
import { getIceServers } from './ice-servers.js';

let state = {
	localMediaStream: undefined,
	peers: {}, // {[userId]: { userName: '', userId: '' }}
	currentUser: {
		userName: '',
		userId: ''
	},
	isNewUser: true,
}

document.addEventListener('DOMContentLoaded', () => initSettingsForm({ onSubmit: () => joinCall() }))

async function joinCall() {
	await connectToSignalingServer(getCallSettings().signalingServer, messageHandlers)
	
	state.currentUser.userName = getCallSettings().userName
	hideCallSettings()

	await initLocalVideo(`${state.currentUser.userName} (Me)`)
	sendJoinMessage()
}

async function initLocalVideo(label) {
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
		type: messageTypes.join,
		userName: state.currentUser.userName
	})
}

const messageHandlers = {
	[messageTypes.signalServerConnected]: saveUserId,
	[messageTypes.userList]: updateUserList,
	[messageTypes.offer]: respondToOffer,
	[messageTypes.answer]: saveSdpAnswer,
	[messageTypes.iceCandidate]: addIceCandidate
}

function saveUserId(message = { userId: '' }) {
	state.currentUser.userId = message.userId
}

function updateUserList(message = { users: [{ userId: '', userName: '' }] }) {
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
	Object.values(state.peers).forEach(peer => initPeerConnection(peer))
}

function initPeerConnection(peer) {
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

function sendIceCandidateToPeer(event, peerContext) {
	// TODO: IMPLEMENT
  if (event.candidate) {
    sendSignalMessage({
      type: messageTypes.iceCandidate,
      recipientId: peerContext.peer.userId,
      candidate: event.candidate
    });
  }
}

function handleICEConnectionStateChangeEvent(event, peerContext) {
	if (['closed', 'failed', 'disconnected'].includes(peerContext.peerConnection.iceConnectionState)) {
		disposePeerConnection(peerContext)
	}
}

function handleSignalingStateChangeEvent(event, peerContext) {
	if (peerContext.peerConnection.signalingState === 'closed') {
    disposePeerConnection(peerContext)
  }
}

function disposePeerConnection(peerContext) {
	removePeerVideoTemplate(peerContext.peer.userId);
	closePeerConnection(peerContext.peerConnection);
}

async function createOffer(event, peerContext) {
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
		type: messageTypes.offer,
		sdp: peerConnection.localDescription
	});
}

function displayPeerMedia(event, peerContext) {
	// TODO: IMPLEMENT
	setPeerVideoMediaStream(peerContext.peer.userId, event.streams[0])
}

async function respondToOffer(message = {
	senderId: '',
	sdp: ''
}) {
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
    type: messageTypes.answer,
    sdp: peerConnection.localDescription
  });
}

async function saveSdpAnswer(message = {
	senderId: '',
	sdp: ''
}) {
	// TODO: IMPLEMENT
	let { peerConnection } = state.peers[message.senderId];
	let remoteSdp = new RTCSessionDescription(message.sdp);
	
	await peerConnection.setRemoteDescription(remoteSdp);
}

async function addIceCandidate(message = {
	senderId: '',
	candidate: ''
}) {
	// TODO: IMPLEMENT
	let { peerConnection } = state.peers[message.senderId];
	let candidate = new RTCIceCandidate(message.candidate);

	await peerConnection.addIceCandidate(candidate)
}

function sendSignalMessage(message = {
	recipientId: '',
	type: ''
}) {
	_sendSignalMessage({
		senderId: state.currentUser.userId,
		...message
	})
}