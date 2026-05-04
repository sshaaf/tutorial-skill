package main

import "fmt"

// User represents a user account in the system.
// This is the core entity that holds user account information.
type User struct {
	ID       *int64 `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"-"` // Never serialize password
	Active   bool   `json:"active"`
}

// NewUser creates a new User instance with default values.
func NewUser(username, email string) *User {
	return &User{
		Username: username,
		Email:    email,
		Active:   true,
	}
}

// String returns a string representation of the user.
func (u *User) String() string {
	id := "nil"
	if u.ID != nil {
		id = fmt.Sprintf("%d", *u.ID)
	}
	return fmt.Sprintf("User{id=%s, username='%s', email='%s', active=%t}",
		id, u.Username, u.Email, u.Active)
}

// ToMap converts the user to a map (excluding password).
func (u *User) ToMap() map[string]interface{} {
	return map[string]interface{}{
		"id":       u.ID,
		"username": u.Username,
		"email":    u.Email,
		"active":   u.Active,
	}
}
