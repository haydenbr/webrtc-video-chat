import {
	getStunServerInput,
	getTurnPasswordInput,
	getTurnServerInput,
	getTurnUserNameInput
} from './template-util.js'

export function getDefaultStunServer() {
	return `stun:${location.hostname}:3478`
}

export function getDefaultTurnServer() {
	return `turn:${location.hostname}:3478`
}

export function getIceServers() {
	return [
		{
			urls: getStunServerInput()
		},
		{
			urls: getTurnServerInput(),
			credentialType: "password",
			username: getTurnUserNameInput(),
			credential: getTurnPasswordInput()
		}
	]
}
