import { User } from "./user.interface";

export interface PeerContext {
	peer: User,
	peerConnection: RTCPeerConnection
}