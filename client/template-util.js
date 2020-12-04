export function insertVideoTemplate(config = {
	label: '',
	mediaStream: undefined,
	parent: undefined,
	muted: false,
	videoId: ''
}) {
	let newVideoTemplate = getNewVideoTemplate()
	
	if (config.videoId) {
		newVideoTemplate.firstElementChild.setAttribute('id', getVideoId(config.videoId))
	}

	let newVideo = newVideoTemplate.querySelector('video')

	if (config.mediaStream) {
		newVideo.srcObject = config.mediaStream;
	}
	
	if (config.muted) {
		newVideo.muted = true
	}

	let videoLabel = newVideoTemplate.querySelector('.video-label')

	if (config.label) {
		videoLabel.textContent = config.label
	}

	config.parent.appendChild(newVideoTemplate);

	return newVideoTemplate
}

export function setPeerVideoMediaStream(videoId, mediaStream) {
	if (!videoId || !mediaStream) {
		return
	}
	
	let peerVideoTemplate = getPeerVideoTemplate(videoId)
	let videoEl = peerVideoTemplate.querySelector('video')
	videoEl.srcObject = mediaStream
}

export function removePeerVideoTemplate(videoId = '') {
	let videoTemplate = getPeerVideoTemplate(videoId)

	if (videoTemplate) {
		videoTemplate.srcObject = null
		videoTemplate.remove();
	}
}

export function initSettingsForm(config = { onSubmit: () => { } }) {
	let form = getCallSettingsForm()
	let formElements = form.elements

	form.onsubmit = () => {
		config.onSubmit()
		form.onsubmit = undefined
	}

	let localSettingsButton = document.querySelector('#local-settings')
	let prodSettingsButton = document.querySelector('#prod-settings')

	localSettingsButton.onclick = () => {
		formElements['signaling-server'].value = 'ws://localhost:5501'
		formElements['stun-server'].value = ''
		formElements['turn-server'].value = ''
		formElements['turn-user-name'].value = ''
		formElements['turn-password'].value = ''
	}

	prodSettingsButton.onclick = () => {
		formElements['signaling-server'].value = 'wss://webrtc.haydenbraxton.com:444'
		formElements['stun-server'].value = 'stun:webrtc.haydenbraxton.com:3478'
		formElements['turn-server'].value = 'turn:webrtc.haydenbraxton.com:3478'
		formElements['turn-user-name'].value = 'turn'
		formElements['turn-password'].value = 'pion'
	}
}

export function hideCallSettings() {
	hideElement(getCallSettingsContainer())
	document.querySelector('#local-settings').onclick = null
	document.querySelector('#prod-settings').onclick = null
}

export function getCallSettings() {
	let formElements = getCallSettingsForm().elements
	return {
		signalingServer: formElements['signaling-server'].value,
		userName: formElements['user-name'].value,
		stunServer: formElements['stun-server'].value,
		turnServer: formElements['turn-server'].value,
		turnUserName: formElements['turn-user-name'].value,
		turnPassword: formElements['turn-password'].value,
	}
}

export function getLocalVideoContainer() {
	return document.body.querySelector('#local-video-container')
}

export function getPeerVideoContainer() {
	return document.body.querySelector('#peer-video-container')
}

function getNewVideoTemplate() {
	const videoTemplate = document.querySelector('#video-template');
	return videoTemplate.content.cloneNode(true)
}

function getPeerVideoTemplate(videoId = '') {
	return document.querySelector('#' + getVideoId(videoId))
}

function getCallSettingsForm() {
	return document.querySelector('#call-settings form');
}

function getCallSettingsContainer() {
	return document.querySelector('#call-settings');
}

function hideElement(element) {
	element.style.setProperty('display', 'none')
}

function getVideoId(userId) {
	return `user_${userId}`
}
