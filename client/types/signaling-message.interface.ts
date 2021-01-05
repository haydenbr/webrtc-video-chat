import { SignalingMessageType } from "./signaling-message-type.enum";
import { User } from './user.interface'

export interface BaseSignalingMessage {
	type: SignalingMessageType,
	senderId: string
	recipientId: string
}

export interface SignalingServerConnectedMessage extends BaseSignalingMessage {
	type: SignalingMessageType.SignalServerConnected,
	userId: string,
	senderId: never
}

export interface JoinMessage extends BaseSignalingMessage {
	type: SignalingMessageType.Join,
	recipientId: never
}

export interface UserListMessage extends BaseSignalingMessage {
	type: SignalingMessageType.UserList,
	users: User[]
}

export interface OfferMessage extends BaseSignalingMessage {
	type: SignalingMessageType.Offer,
	sdp: RTCSessionDescriptionInit | undefined
}

export interface AnswerMessage extends BaseSignalingMessage {
	type: SignalingMessageType.Answer,
	sdp: RTCSessionDescriptionInit | undefined
}

export interface IceCandidateMessage extends BaseSignalingMessage {
	type: SignalingMessageType.IceCandidate
	candidate: RTCIceCandidate
}

export type SignalingMessage = SignalingServerConnectedMessage | JoinMessage | UserListMessage | OfferMessage | AnswerMessage | IceCandidateMessage