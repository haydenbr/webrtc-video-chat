export function getUserMedia() {
	return navigator.mediaDevices
		.getUserMedia({
			audio: true,
			video: {
				facingMode: { ideal: ['user', 'environment'] },
				height: { ideal: 250 }
			}
		})
}