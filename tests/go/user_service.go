package main

import (
	"errors"
	"regexp"
)

// UserService provides business logic for user operations.
// Handles validation, password hashing, and business rules.
type UserService struct {
	userRepository  *UserRepository
	passwordEncoder *PasswordEncoder
}

// NewUserService creates a new UserService instance.
func NewUserService(userRepository *UserRepository, passwordEncoder *PasswordEncoder) *UserService {
	return &UserService{
		userRepository:  userRepository,
		passwordEncoder: passwordEncoder,
	}
}

// RegisterUser registers a new user with validation.
func (s *UserService) RegisterUser(username, email, password string) (*User, error) {
	// Validate username is unique
	if s.userRepository.FindByUsername(username) != nil {
		return nil, errors.New("username already exists: " + username)
	}

	// Validate email format
	if !s.isValidEmail(email) {
		return nil, errors.New("invalid email format: " + email)
	}

	// Create and save user
	user := NewUser(username, email)
	user.Password = s.passwordEncoder.Encode(password)
	return s.userRepository.Save(user), nil
}

// Authenticate authenticates a user with username and password.
func (s *UserService) Authenticate(username, password string) *User {
	user := s.userRepository.FindByUsername(username)

	if user != nil && user.Active && s.passwordEncoder.Matches(password, user.Password) {
		return user
	}
	return nil
}

// GetUserByID gets a user by ID.
func (s *UserService) GetUserByID(id int64) *User {
	return s.userRepository.FindByID(id)
}

// GetAllActiveUsers gets all active users.
func (s *UserService) GetAllActiveUsers() []*User {
	return s.userRepository.FindAllActive()
}

// DeactivateUser deactivates a user account (soft delete).
func (s *UserService) DeactivateUser(id int64) bool {
	user := s.userRepository.FindByID(id)
	if user != nil {
		user.Active = false
		s.userRepository.Save(user)
		return true
	}
	return false
}

// UpdateEmail updates a user's email.
func (s *UserService) UpdateEmail(id int64, newEmail string) (*User, error) {
	user := s.userRepository.FindByID(id)
	if user == nil {
		return nil, errors.New("user not found")
	}

	if !s.isValidEmail(newEmail) {
		return nil, errors.New("invalid email format: " + newEmail)
	}

	user.Email = newEmail
	return s.userRepository.Save(user), nil
}

// isValidEmail validates email format.
func (s *UserService) isValidEmail(email string) bool {
	pattern := `^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$`
	matched, _ := regexp.MatchString(pattern, email)
	return matched
}
