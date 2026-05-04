/**
 * REST API controller for user endpoints.
 * Handles HTTP requests and delegates to UserService.
 */
class UserController {
  /**
   * @param {UserService} userService - The user service
   */
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * POST /api/users/register
   * Register a new user.
   * @param {Object} request - The registration request
   * @param {string} request.username - Username
   * @param {string} request.email - Email
   * @param {string} request.password - Password
   * @returns {Response} HTTP response
   */
  registerUser(request) {
    try {
      const user = this.userService.registerUser(
        request.username,
        request.email,
        request.password
      );
      return Response.success(user.toJSON());
    } catch (error) {
      return Response.error(400, error.message);
    }
  }

  /**
   * POST /api/users/login
   * Authenticate a user.
   * @param {Object} request - The login request
   * @param {string} request.username - Username
   * @param {string} request.password - Password
   * @returns {Response} HTTP response
   */
  login(request) {
    try {
      const user = this.userService.authenticate(
        request.username,
        request.password
      );

      if (user) {
        return Response.success(user.toJSON());
      } else {
        return Response.error(401, "Invalid credentials");
      }
    } catch (error) {
      return Response.error(400, error.message);
    }
  }

  /**
   * GET /api/users/:id
   * Get user by ID.
   * @param {number} id - The user ID
   * @returns {Response} HTTP response
   */
  getUser(id) {
    const user = this.userService.getUserById(id);

    if (user) {
      return Response.success(user.toJSON());
    } else {
      return Response.error(404, "User not found");
    }
  }

  /**
   * GET /api/users
   * Get all active users.
   * @returns {Response} HTTP response
   */
  getAllUsers() {
    const users = this.userService.getAllActiveUsers();
    const userResponses = users.map(user => user.toJSON());
    return Response.success(userResponses);
  }

  /**
   * DELETE /api/users/:id
   * Deactivate a user.
   * @param {number} id - The user ID
   * @returns {Response} HTTP response
   */
  deactivateUser(id) {
    const success = this.userService.deactivateUser(id);

    if (success) {
      return Response.success("User deactivated");
    } else {
      return Response.error(404, "User not found");
    }
  }
}

/**
 * HTTP Response wrapper.
 */
class Response {
  constructor(status, message, data = null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success(data) {
    return new Response(200, "Success", data);
  }

  static error(status, message) {
    return new Response(status, message, null);
  }
}

module.exports = UserController;
