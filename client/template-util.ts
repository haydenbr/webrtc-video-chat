interface VideoTemplateConfig {
	label: string,
	mediaStream?: MediaStream,
	parent: HTMLElement,
	muted?: boolean,
	videoId?: string
}

export function insertVideoTemplate(config: VideoTemplateConfig) {
	let newVideoTemplate = getNewVideoTemplate()
	
	if (config.videoId) {
		newVideoTemplate.firstElementChild?.setAttribute('id', getVideoId(config.videoId))
	}

	let newVideo = newVideoTemplate.querySelector('video')!

	if (config.mediaStream) {
		newVideo.srcObject = config.mediaStream;
	}
	
	if (config.muted) {
		newVideo.muted = true
	}

	let videoLabel = newVideoTemplate.querySelector('.video-label')!

	if (config.label) {
		videoLabel.textContent = config.label
	}

	config.parent.appendChild(newVideoTemplate);

	return newVideoTemplate
}

export function setPeerVideoMediaStream(videoId: string, mediaStream: MediaStream): void {
	if (!videoId || !mediaStream) {
		return
	}
	
	let peerVideoTemplate = getPeerVideoTemplate(videoId)
	if (!peerVideoTemplate) {
		throw new Error('could not find peer video template')
	}

	let videoEl = peerVideoTemplate.querySelector('video')!
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
		form.onsubmit = null
	}

	let localSettingsButton = document.querySelector<HTMLButtonElement>('#local-settings')!
	let prodSettingsButton = document.querySelector<HTMLButtonElement>('#prod-settings')!

	localSettingsButton.onclick = () => {
		setFormControlValue(formElements, 'signaling-server', 'ws://localhost:5501')
		setFormControlValue(formElements, 'stun-server', '')
		setFormControlValue(formElements, 'turn-server', '')
		setFormControlValue(formElements, 'turn-user-name', '')
		setFormControlValue(formElements, 'turn-password', '')
	}

	prodSettingsButton.onclick = () => {
		setFormControlValue(formElements, 'signaling-server', 'wss://webrtc.haydenbraxton.com:444')
		setFormControlValue(formElements, 'stun-server', 'stun:webrtc.haydenbraxton.com:3478')
		setFormControlValue(formElements, 'turn-server', 'turn:webrtc.haydenbraxton.com:3478')
		setFormControlValue(formElements, 'turn-user-name','turn')
		setFormControlValue(formElements, 'turn-password', 'pion')
	}
}

export function hideCallSettings() {
	hideElement(getCallSettingsContainer())
	document.querySelector<HTMLButtonElement>('#local-settings')!.onclick = null
	document.querySelector<HTMLButtonElement>('#prod-settings')!.onclick = null
}

export function getCallSettings() {
	let formElements = getCallSettingsForm().elements
	return {
		signalingServer: getFormControlValue(formElements, 'signaling-server'),
		userName: getFormControlValue(formElements, 'user-name'),
		stunServer: getFormControlValue(formElements, 'stun-server'),
		turnServer: getFormControlValue(formElements, 'turn-server'),
		turnUserName: getFormControlValue(formElements, 'turn-user-name'),
		turnPassword: getFormControlValue(formElements, 'turn-password')
	}
}

export function getLocalVideoContainer(): HTMLElement {
	return document.body.querySelector<HTMLElement>('#local-video-container')!
}

export function getPeerVideoContainer(): HTMLElement {
	return document.body.querySelector<HTMLElement>('#peer-video-container')!
}

function getNewVideoTemplate(): HTMLElement {
	const videoTemplate = document.querySelector<HTMLTemplateElement>('#video-template')!;

	return videoTemplate.content.cloneNode(true) as HTMLElement
}

function getPeerVideoTemplate(videoId: string): HTMLVideoElement | null {
	return document.querySelector<HTMLVideoElement>('#' + getVideoId(videoId))
}

function getCallSettingsForm(): HTMLFormElement {
	return document.querySelector<HTMLFormElement>('#call-settings form')!;
}

function getCallSettingsContainer(): HTMLElement {
	return document.querySelector<HTMLElement>('#call-settings')!;
}

function hideElement(element: HTMLElement): void {
	element.style.setProperty('display', 'none')
}

function getVideoId(userId: string): string {
	return `user_${userId}`
}

function getFormControlValue(formElements: HTMLFormControlsCollection, formControlName: string): string {
	return (formElements.namedItem(formControlName) as HTMLInputElement).value
}

function setFormControlValue(
	formElements: HTMLFormControlsCollection,
	formControlName: string,
	formControlValue: string
): string {
	return (formElements.namedItem(formControlName) as HTMLInputElement).value = formControlValue
}