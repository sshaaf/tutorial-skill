package main

import (
	"crypto/sha256"
	"encoding/base64"
)

// PasswordEncoder handles password encoding and validation.
// Uses SHA-256 hashing for demonstration (use bcrypt in production).
type PasswordEncoder struct{}

// NewPasswordEncoder creates a new PasswordEncoder instance.
func NewPasswordEncoder() *PasswordEncoder {
	return &PasswordEncoder{}
}

// Encode encodes a plain text password.
func (e *PasswordEncoder) Encode(plainPassword string) string {
	hash := sha256.Sum256([]byte(plainPassword))
	return base64.StdEncoding.EncodeToString(hash[:])
}

// Matches checks if a plain password matches an encoded password.
func (e *PasswordEncoder) Matches(plainPassword, encodedPassword string) bool {
	encoded := e.Encode(plainPassword)
	return encoded == encodedPassword
}
