package com.example.demo.repository;

import com.example.demo.model.User;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Repository for managing User data persistence.
 * Uses in-memory storage for demonstration purposes.
 */
public class UserRepository {
    private final Map<Long, User> database = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    /**
     * Save a user to the database.
     * If the user has an ID, it updates; otherwise creates a new user.
     */
    public User save(User user) {
        if (user.getId() == null) {
            user.setId(idGenerator.getAndIncrement());
        }
        database.put(user.getId(), user);
        return user;
    }

    /**
     * Find a user by their ID.
     */
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(database.get(id));
    }

    /**
     * Find a user by their username.
     */
    public Optional<User> findByUsername(String username) {
        return database.values().stream()
                .filter(user -> user.getUsername().equals(username))
                .findFirst();
    }

    /**
     * Find all active users.
     */
    public List<User> findAllActive() {
        return database.values().stream()
                .filter(User::isActive)
                .toList();
    }

    /**
     * Delete a user by ID.
     */
    public boolean deleteById(Long id) {
        return database.remove(id) != null;
    }

    /**
     * Get count of all users.
     */
    public long count() {
        return database.size();
    }
}
