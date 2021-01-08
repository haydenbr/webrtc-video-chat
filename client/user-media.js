export function getUserMedia() {
	// TODO: IMPLEMENT
	return navigator.mediaDevices
		.getUserMedia({
			audio: true,
			video: {
				facingMode: { ideal: ['user', 'environment'] },
				height: { ideal: 250 }
			}
		})
}