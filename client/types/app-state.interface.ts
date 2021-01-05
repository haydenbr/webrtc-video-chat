import { Peer } from './peer.interface'
import { User } from './user.interface'

export interface AppState {
	localMediaStream: MediaStream | undefined,
	peers: Record<string, Peer>
	currentUser: User
	isNewUser: boolean,
}