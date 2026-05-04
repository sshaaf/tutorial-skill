package main

import "sync"

// UserRepository manages User data persistence.
// Uses in-memory storage for demonstration purposes.
type UserRepository struct {
	database  map[int64]*User
	idCounter int64
	mu        sync.RWMutex
}

// NewUserRepository creates a new UserRepository instance.
func NewUserRepository() *UserRepository {
	return &UserRepository{
		database:  make(map[int64]*User),
		idCounter: 1,
	}
}

// Save saves a user to the database.
// If the user has an ID, it updates; otherwise creates a new user.
func (r *UserRepository) Save(user *User) *User {
	r.mu.Lock()
	defer r.mu.Unlock()

	if user.ID == nil {
		id := r.idCounter
		user.ID = &id
		r.idCounter++
	}

	r.database[*user.ID] = user
	return user
}

// FindByID finds a user by their ID.
func (r *UserRepository) FindByID(id int64) *User {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return r.database[id]
}

// FindByUsername finds a user by their username.
func (r *UserRepository) FindByUsername(username string) *User {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, user := range r.database {
		if user.Username == username {
			return user
		}
	}
	return nil
}

// FindAllActive finds all active users.
func (r *UserRepository) FindAllActive() []*User {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var activeUsers []*User
	for _, user := range r.database {
		if user.Active {
			activeUsers = append(activeUsers, user)
		}
	}
	return activeUsers
}

// DeleteByID deletes a user by ID.
func (r *UserRepository) DeleteByID(id int64) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, exists := r.database[id]; exists {
		delete(r.database, id)
		return true
	}
	return false
}

// Count returns the total number of users.
func (r *UserRepository) Count() int {
	r.mu.RLock()
	defer r.mu.RUnlock()

	return len(r.database)
}
