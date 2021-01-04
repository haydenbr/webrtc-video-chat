import { SignalingMessageType } from "./signaling-message-type.enum";
import { User } from './user.interface'

interface Message {
	type: SignalingMessageType,
	senderId: string
	recipientId: string
}

export interface SignalingServerConnectedMessage extends Message {
	type: SignalingMessageType.SignalServerConnected,
	userId: string,
	senderId: never
}

export interface JoinMessage extends Message {
	type: SignalingMessageType.Join,
	recipientId: never
}

export interface UserListMessage extends Message {
	type: SignalingMessageType.UserList,
	users: User[]
}

export interface OfferMessage extends Message {
	type: SignalingMessageType.Offer,
	sdp: RTCSessionDescriptionInit
}

export interface AnswerMessage extends Message {
	type: SignalingMessageType.Answer,
	sdp: RTCSessionDescriptionInit
}

export interface IceCandidateMessage extends Message {
	type: SignalingMessageType.IceCandidate
	candidate: RTCIceCandidate
}

export type SignalingMessage = SignalingServerConnectedMessage | JoinMessage | UserListMessage | OfferMessage | AnswerMessage | IceCandidateMessage