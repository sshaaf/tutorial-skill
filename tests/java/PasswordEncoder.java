package com.example.demo.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Utility for encoding and validating passwords.
 * Uses SHA-256 hashing for demonstration (use BCrypt in production).
 */
public class PasswordEncoder {

    /**
     * Encode a plain text password.
     */
    public String encode(String plainPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(plainPassword.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to encode password", e);
        }
    }

    /**
     * Check if a plain password matches an encoded password.
     */
    public boolean matches(String plainPassword, String encodedPassword) {
        String encoded = encode(plainPassword);
        return encoded.equals(encodedPassword);
    }
}
