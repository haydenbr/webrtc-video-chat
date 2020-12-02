export function getDefaultStunServer() {
	return `stun:${location.hostname}:3478`
}

export function getDefaultTurnServer() {
	return `turn:${location.hostname}:3478`
}
