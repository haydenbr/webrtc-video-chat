import { User } from './user.interface'

export interface Peer extends User {
	peerConnection?: RTCPeerConnection
}