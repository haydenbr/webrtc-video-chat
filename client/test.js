run()

async function run() {
	let peerConnection = new RTCPeerConnection()

	peerConnection.onicecandidate = (event) => console.log(event)
	peerConnection.oniceconnectionstatechange = (event) => console.log(event)
	peerConnection.onsignalingstatechange = (event) => console.log(event)
	peerConnection.onnegotiationneeded = (event) => console.log(event)
	peerConnection.ontrack = (event) => console.log(event)
	
	let mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
	
	mediaStream
		.getTracks()
		.forEach(track => peerConnection.addTransceiver(track, { streams: [mediaStream] }))
}
