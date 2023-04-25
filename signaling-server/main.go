package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"

	"github.com/haydenbr/sigserver/signaling"
)

var host = flag.String("host", "0.0.0.0", "http host")
var port = flag.String("port", "8080", "http port")
var upgrader = websocket.Upgrader{} // use default options

func handleConnection(c *websocket.Conn) string {
	newUser := signaling.CreateNewUser()

	sendServerAck(c, newUser)
	sendUserList(c)

	return newUser.Id
}

func sendServerAck(c *websocket.Conn, user *signaling.User) {
	wsWriteErr := c.WriteJSON(signaling.NewServerAckMessage(user.Id))

	if wsWriteErr != nil {
		fmt.Println("error sending server ack message:", wsWriteErr)
	}
}

func sendUserList(c *websocket.Conn) {
	c.WriteJSON(signaling.GetAckedUsers())
}

func sendNewUserNotification() {
	// notify all other users (acked and not acked) that there's a new user
	// we need to do this in a way that doesn't require us to save a pointer to each user's ws connection on the user object
}

func handleClientAck(c *websocket.Conn, clientAck *signaling.ClientAckPayload) {
	signaling.AckUser(clientAck.UserId, clientAck.UserName)
	sendNewUserNotification()
}

func sendUserLeave(c *websocket.Conn, userId string) {
	wsWriteErr := c.WriteJSON(signaling.Message{
		MessageType: signaling.ServerAck,
		Payload: signaling.ServerAckPayload{
			UserId: userId,
		},
	})

	if wsWriteErr != nil {
		fmt.Println("error sending server ack message:", wsWriteErr)
	}
}

func signal(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()

	userId := handleConnection(c)

	for {
		messageType, message, readErr := c.ReadMessage()

		if readErr != nil {
			log.Println("read:", readErr)
			break
		}

		if messageType == websocket.CloseMessage {
			signaling.RemoveUser(userId)
		}

		if messageType == websocket.TextMessage {
			messageJson := new(signaling.Message)
			jsonErr := json.Unmarshal(message, &messageJson)

			if jsonErr != nil {
				log.Println("json parse error:", jsonErr)
			}

			// TODO: handle message, actually
		}

		log.Printf("unhandled message type: %d %v\n", messageType, message)
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)

	http.HandleFunc("/", signal)

	addr := *host + *port
	log.Fatal(http.ListenAndServe(addr, nil))
}
