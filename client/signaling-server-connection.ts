import { SignalingMessage, SignalingMessageType } from "./types";

let signalingServer: WebSocket

type MessageHandlers = Record<SignalingMessageType, (message: SignalingMessage) => any>

export function connectToSignalingServer(serverUrl: string, messageHandlers: MessageHandlers) {
	return new Promise<void>((resolve) => {
		signalingServer = new WebSocket(serverUrl, "json");

		signalingServer.onopen = () => {
			resolve()
			signalingServer.onopen = null
		}

		signalingServer.onmessage = (event) => {
			let message = JSON.parse(event.data) as SignalingMessage;
			let messageHandler = messageHandlers[message.type]
	
			if (messageHandler) {
				messageHandler(message)
			}
		};
	})
}

export function sendSignalMessage(message: SignalingMessage) {
	signalingServer.send(JSON.stringify(message))
}