export function insertVideoTemplate(config = {
	label: '',
	mediaStream: undefined,
	parent: undefined,
	muted: false,
	videoId: ''
}) {
	let newVideoTemplate = getNewVideoTemplate()
	
	if (config.videoId) {
		newVideoTemplate.firstElementChild.setAttribute('id', config.videoId)
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
	removeElement(getPeerVideoTemplate(videoId))
}

function getPeerVideoTemplate(videoId = '') {
	return document.querySelector('#' + videoId)
}

export function getCallSettingsForm() {
	return document.querySelector('#call-settings');
}

export function getUserNameInput() {
	return getCallSettingsForm().elements['user-name'].value
}

export function setSignlaingServerUrl(url) {
	getCallSettingsForm().elements['signaling-server'].value = url
}

export function getSignalingServerUrl() {
	return getCallSettingsForm().elements['signaling-server'].value
}

export function getLocalVideoContainer() {
	return document.body.querySelector('#local-video-container')
}

export function getPeerVideoContainer() {
	return document.body.querySelector('#peer-video-container')
}

export function getNewVideoTemplate() {
	const videoTemplate = document.querySelector('#video-template');
	return videoTemplate.content.cloneNode(true)
}

export function hideElement(element) {
	element.style.setProperty('display', 'none')
}

function removeElement(element) {
	document.body.removeChild(element)
}