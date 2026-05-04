const User = require('./User');

/**
 * Service layer for user business logic.
 * Handles validation, password hashing, and business rules.
 */
class UserService {
  /**
   * @param {UserRepository} userRepository - The user repository
   * @param {PasswordEncoder} passwordEncoder - The password encoder
   */
  constructor(userRepository, passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  /**
   * Register a new user with validation.
   * @param {string} username - The username
   * @param {string} email - The email address
   * @param {string} password - The plain text password
   * @returns {User} The created user
   * @throws {Error} If validation fails
   */
  registerUser(username, email, password) {
    // Validate username is unique
    if (this.userRepository.findByUsername(username)) {
      throw new Error(`Username already exists: ${username}`);
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    // Create and save user
    const user = new User(username, email);
    user.password = this.passwordEncoder.encode(password);
    return this.userRepository.save(user);
  }

  /**
   * Authenticate a user with username and password.
   * @param {string} username - The username
   * @param {string} password - The plain text password
   * @returns {User|null} The authenticated user or null
   */
  authenticate(username, password) {
    const user = this.userRepository.findByUsername(username);

    if (user && user.active && this.passwordEncoder.matches(password, user.password)) {
      return user;
    }
    return null;
  }

  /**
   * Get a user by ID.
   * @param {number} id - The user ID
   * @returns {User|null} The user or null
   */
  getUserById(id) {
    return this.userRepository.findById(id);
  }

  /**
   * Get all active users.
   * @returns {User[]} Array of active users
   */
  getAllActiveUsers() {
    return this.userRepository.findAllActive();
  }

  /**
   * Deactivate a user account (soft delete).
   * @param {number} id - The user ID
   * @returns {boolean} True if deactivated, false otherwise
   */
  deactivateUser(id) {
    const user = this.userRepository.findById(id);
    if (user) {
      user.active = false;
      this.userRepository.save(user);
      return true;
    }
    return false;
  }

  /**
   * Update user email.
   * @param {number} id - The user ID
   * @param {string} newEmail - The new email address
   * @returns {User} The updated user
   * @throws {Error} If user not found or email invalid
   */
  updateEmail(id, newEmail) {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new Error(`User not found: ${id}`);
    }

    if (!this.isValidEmail(newEmail)) {
      throw new Error(`Invalid email format: ${newEmail}`);
    }

    user.email = newEmail;
    return this.userRepository.save(user);
  }

  /**
   * Validate email format.
   * @param {string} email - The email to validate
   * @returns {boolean} True if valid
   * @private
   */
  isValidEmail(email) {
    const pattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    return pattern.test(email);
  }
}

module.exports = UserService;
