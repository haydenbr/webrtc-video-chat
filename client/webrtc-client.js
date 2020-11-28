'use strict';

import { messageTypes } from './message-types.js'
import {
	getSignalingServerUrl,
	getCallSettingsForm,
	getUserNameInput,
	hideElement,
	insertVideoTemplate,
	getLocalVideoContainer
} from './template-util.js'
import { connectToSignalingServer, sendSignalMessage as _sendSignalMessage } from './signaling-server-connection.js'

let state = {
	localMediaStream: undefined,
	peers: {},
	currentUser: {
		userName: '',
		userId: ''
	},
	isNewUser: true,
	signalingServer: undefined
}

init()

function init() {
	let settingsForm = getCallSettingsForm()
	settingsForm.onsubmit = () => {
		joinCall()
		settingsForm.onsubmit = undefined
	}
}

async function joinCall() {
	debugger
	await connectToSignalingServer(getSignalingServerUrl(), messageHandlers)
	state.currentUser.userName = getUserNameInput()

	hideElement(getCallSettingsForm())

	await initLocalVideo(`${state.currentUser.userName} (Me)`)
	sendJoinMessage()
}

function sendJoinMessage() {
	sendSignalMessage({
		type: messageTypes.join,
		userName: state.currentUser.userName
	})
}

function sendSignalMessage(message) {
	_sendSignalMessage({
		senderId: state.currentUser.userId,
		...message
	})
}

async function initLocalVideo(label) {
	state.localMediaStream = await navigator.mediaDevices
		.getUserMedia({
			audio: true,
			video: {
				facingMode: { ideal: ['user', 'environment'] },
				height: { ideal: 250 }
			}
		})
	
	insertVideoTemplate({
		label: label,
		mediaStream: state.localMediaStream,
		muted: true,
		parent: getLocalVideoContainer()
	})
}

const messageHandlers = {
	[messageTypes.connected]: handleSignalingServerConnected,
	[messageTypes.userList]: handleUserListUpdate
}

function handleSignalingServerConnected(message) {
	state.currentUser.userId = message.userId
}

function handleUserListUpdate(message) {
	message.users.forEach(u => {
		if (u.userId !== state.currentUser.userId && !state.peers[u.userId]) {
			peers[u.userId] = u
			// add video template?
		}
	})

	if (state.isNewUser) {
		state.isNewUser = false
		// call everyone else
	} else {
		// anything to do here?
	}
}


