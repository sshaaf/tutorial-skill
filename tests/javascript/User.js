/**
 * User model representing a user account in the system.
 */
class User {
  /**
   * Create a new User instance.
   * @param {string} username - The username
   * @param {string} email - The email address
   */
  constructor(username, email) {
    this.id = null;
    this.username = username;
    this.email = email;
    this.password = null;
    this.active = true;
  }

  /**
   * Convert user to JSON object (excluding password).
   * @returns {Object} User data without password
   */
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      active: this.active
    };
  }

  toString() {
    return `User(id=${this.id}, username='${this.username}', email='${this.email}', active=${this.active})`;
  }
}

module.exports = User;
