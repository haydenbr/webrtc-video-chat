package signaling

type MessageType int

const (
	ServerAck MessageType = iota
	ClientAck
	UserList
	UserJoin
	UserUpdate
	UserLeave
)

type Message struct {
	MessageType MessageType
	Payload     interface{}
}

type ServerAckPayload struct {
	UserId string
}

type ClientAckPayload struct {
	UserId   string
	UserName string
}

type UserLeavePayload struct {
	UserId string
}

type UserListPayload struct {
	Users []User
}

func newMessage()

func NewServerAckMessage(userId string) *Message {
	return &Message{
		MessageType: ServerAck,
		Payload: ServerAckPayload{
			UserId: userId,
		},
	}
}

func NewUserLeaveMessage(userId string) *Message {
	return &Message{
		MessageType: UserLeave,
		Payload: UserLeavePayload{
			UserId: userId,
		},
	}
}
