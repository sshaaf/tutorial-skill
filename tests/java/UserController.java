package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import java.util.List;
import java.util.Optional;

/**
 * REST API controller for user endpoints.
 * Handles HTTP requests and delegates to UserService.
 */
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * POST /api/users/register
     * Register a new user.
     */
    public Response registerUser(RegisterRequest request) {
        try {
            User user = userService.registerUser(
                request.username(),
                request.email(),
                request.password()
            );
            return Response.success(new UserResponse(user));
        } catch (IllegalArgumentException e) {
            return Response.error(400, e.getMessage());
        }
    }

    /**
     * POST /api/users/login
     * Authenticate a user.
     */
    public Response login(LoginRequest request) {
        Optional<User> userOpt = userService.authenticate(
            request.username(),
            request.password()
        );

        if (userOpt.isPresent()) {
            return Response.success(new UserResponse(userOpt.get()));
        } else {
            return Response.error(401, "Invalid credentials");
        }
    }

    /**
     * GET /api/users/{id}
     * Get user by ID.
     */
    public Response getUser(Long id) {
        Optional<User> userOpt = userService.getUserById(id);

        if (userOpt.isPresent()) {
            return Response.success(new UserResponse(userOpt.get()));
        } else {
            return Response.error(404, "User not found");
        }
    }

    /**
     * GET /api/users
     * Get all active users.
     */
    public Response getAllUsers() {
        List<User> users = userService.getAllActiveUsers();
        List<UserResponse> responses = users.stream()
                .map(UserResponse::new)
                .toList();
        return Response.success(responses);
    }

    /**
     * DELETE /api/users/{id}
     * Deactivate a user.
     */
    public Response deactivateUser(Long id) {
        boolean success = userService.deactivateUser(id);
        if (success) {
            return Response.success("User deactivated");
        } else {
            return Response.error(404, "User not found");
        }
    }

    // Request/Response DTOs
    public record RegisterRequest(String username, String email, String password) {}
    public record LoginRequest(String username, String password) {}

    public record UserResponse(Long id, String username, String email, boolean active) {
        public UserResponse(User user) {
            this(user.getId(), user.getUsername(), user.getEmail(), user.isActive());
        }
    }

    public record Response<T>(int status, String message, T data) {
        public static <T> Response<T> success(T data) {
            return new Response<>(200, "Success", data);
        }

        public static Response<Void> error(int status, String message) {
            return new Response<>(status, message, null);
        }
    }
}
