package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/samber/lo"
)

var host = flag.String("host", "0.0.0.0", "http host")
var port = flag.String("port", "8080", "http port")
var upgrader = websocket.Upgrader{} // use default options

type User struct {
	id          string
	userName    string
	displayName string
	acked       bool
}

type SignalingMessageType int

const (
	ServerAck SignalingMessageType = iota
	ClientAck
	UserList
	AddUser
	UpdateUser
	DeleteUser
)

type SignalingMessage struct {
	MessageType SignalingMessageType
	Payload     interface{}
}

type ServerAckPayload struct {
	userId string
}

type UserListPayload struct {
	users []User
}

func (user *User) MarshalJSON() ([]byte, error) {
	return json.Marshal(*user)
}

var userMap = make(map[string]*User)
var userList = make([]*User, 0)
var userLock = sync.RWMutex{}

func persistUser(user *User) {
	userMap[user.id] = user
	userList = append(userList, user)
}

func handleConnection(c *websocket.Conn) {
	newUser := User{id: uuid.NewString()}
	writeErr := c.WriteJSON(newUser)

	if writeErr != nil {
		log.Println("write message error:", writeErr)
	}

	sendServerAck(c, newUser.id)
	userLock.Lock()
	sendUserList(c)
	persistUser(&newUser)
	userLock.Unlock()
}

func sendServerAck(c *websocket.Conn, userId string) {
	wsWriteErr := c.WriteJSON(SignalingMessage{
		MessageType: ServerAck,
		Payload: ServerAckPayload{
			userId: userId,
		},
	})

	if wsWriteErr != nil {
		fmt.Println("error sending server ack message:", wsWriteErr)
	}
}

func sendUserList(c *websocket.Conn) {
	ackedUserList := lo.Filter(userList, func(user *User, index int) bool {
		return user.acked
	})
	c.WriteJSON(ackedUserList)
}

func sendNewUserNotification(c *websocket.Conn) {

}

func handleClientAck() {

}

func signal(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	defer c.Close()

	handleConnection(c)

	for {
		messageType, message, readErr := c.ReadMessage()

		if readErr != nil {
			log.Println("read:", readErr)
			break
		}

		if messageType == websocket.CloseMessage {
			// do cleanup, remove user
		}

		if messageType == websocket.TextMessage {
			messageJson := new(SignalingMessage)
			jsonErr := json.Unmarshal(message, &messageJson)

			if jsonErr != nil {
				log.Println("json parse error:", jsonErr)
			}

			wsWriteErr := c.WriteMessage(websocket.TextMessage, message)

			if wsWriteErr != nil {
				log.Println("write:", wsWriteErr)
				break
			}
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
