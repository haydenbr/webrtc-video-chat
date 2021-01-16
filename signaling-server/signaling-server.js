import WebSocket from 'ws'
import * as uuid from 'uuid';
import { createServer as createHttpServer } from 'http'
import { createServer as createHttpsServer } from 'https'
import queue from 'queue'
import { messageTypes } from '../shared/message-types.js'
import { sslConfig } from '../ssl-config.js'

const isProd = !!process.argv.includes('--prod')
let httpServer = isProd
	? createHttpsServer(sslConfig)
	: createHttpServer()

const webSocketServer = new WebSocket.Server({ server: httpServer });

const users = {}
const joinRequestQueue = queue({ concurrency: 1, autostart: true })

webSocketServer.on('connection', (connection) => {
	let user = {
		connection,
		userId: uuid.v4()
	}

	users[user.userId] = user

	sendToUser(user, { type: messageTypes.signalServerConnected, userId: user.userId })

	connection.onmessage = (event) => {
		let message = JSON.parse(event.data)
		handleMessage(message)
	}

	connection.onclose = () => {
		delete users[user.userId]
		sendUpdatedUserList()
	}
});

function handleMessage(message) {
	if (message.type === messageTypes.join) {
		joinRequestQueue.push(() => handleJoin(message))
	} else if (message.senderId && message.recipientId) {
		let recipient = users[message.recipientId]
		sendToUser(recipient, message)
	}
}

function handleJoin(message) {
	let user = users[message.senderId]

	users[message.senderId] = {
		...user,
		userName: message.userName
	}

	return sendUpdatedUserList()
}

function sendUpdatedUserList() {
	return sendToAllUsers({
		type: messageTypes.userList,
		users: getUserList()
	})
}

function getUserList() {
	return Object.values(users).map(user => ({
		userName: user.userName,
		userId: user.userId
	}))
}

function sendToUser(user, message) {
	return new Promise((resolve, reject) =>
		user.connection.send(
			JSON.stringify(message),
			(error) => error ? reject(error) : resolve()
		)
	)
}

function sendToAllUsers(message) {
	return Promise.all(
		Object
			.values(users)
			.map(user =>
				sendToUser(user, message)
					.catch(error => console.log(error))
			)
	)
}

httpServer.listen({
	host: '0.0.0.0',
	port: isProd ? 444 : 5501
})