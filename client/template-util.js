export function insertVideoTemplate(config = {
	label: '',
	mediaStream: undefined,
	parent: undefined,
	muted: false
}) {
	let newVideoTemplate = getNewVideoTemplate()
	let newVideo = newVideoTemplate.querySelector('video')
	newVideo.srcObject = config.mediaStream;
	
	if (config.muted) {
		newVideo.muted = true
	}

	let videoLabel = newVideoTemplate.querySelector('.video-label')
	if (config.label) {
		videoLabel.textContent = config.label
	} else {
		newVideoTemplate.removeChild(videoLabel)
	}

	config.parent.appendChild(newVideoTemplate);

	return newVideoTemplate
}

export function getCallSettingsForm() {
	return document.querySelector('#call-settings');
}

export function getUserNameInput() {
	return getCallSettingsForm().elements['user-name'].value
}

export function getSignalingServerUrl() {
	return getCallSettingsForm().elements['signaling-server'].value
}

export function getLocalVideoContainer() {
	return document.body.querySelector('#local-video-container')
}

export function getNewVideoTemplate() {
	const videoTemplate = document.querySelector('#video-template');
	return videoTemplate.content.cloneNode(true)
}

export function hideElement(element) {
	element.style.setProperty('display', 'none')
}