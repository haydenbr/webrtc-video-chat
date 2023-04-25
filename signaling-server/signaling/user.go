package signaling

import (
	"sync"

	"github.com/google/uuid"
	"github.com/samber/lo"
)

type User struct {
	Id       string
	UserName string
	Acked    bool
}

var userMap = make(map[string]*User)
var userList = make([]*User, 0)
var userLock = sync.RWMutex{}

func CreateNewUser() *User {
	newUser := User{Id: uuid.NewString()}

	persistUser(&newUser)

	return &newUser
}

func persistUser(user *User) {
	userLock.Lock()
	defer userLock.Unlock()

	userMap[user.Id] = user
	userList = append(userList, user)
}

func AckUser(userId string, userName string) {
	userLock.Lock()
	defer userLock.Unlock()

	if user, ok := userMap[userId]; ok {
		user.Acked = true
		user.UserName = userName
	}
}

func GetAckedUsers() []*User {
	userLock.RLock()
	defer userLock.RUnlock()

	return lo.Filter(userList, func(user *User, _ int) bool {
		return user.Acked
	})
}

func RemoveUser(userId string) {
	userLock.Lock()
	defer userLock.Unlock()

	user := userMap[userId]
	delete(userMap, userId)
	userList = lo.Without(userList, user)
}
