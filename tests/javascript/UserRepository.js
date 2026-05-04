/**
 * Repository for managing User data persistence.
 */
class UserRepository {
  constructor() {
    this.database = new Map();
    this.idCounter = 1;
  }

  /**
   * Save a user to the database.
   * If the user has an ID, it updates; otherwise creates a new user.
   * @param {User} user - The user to save
   * @returns {User} The saved user
   */
  save(user) {
    if (user.id === null) {
      user.id = this.idCounter++;
    }
    this.database.set(user.id, user);
    return user;
  }

  /**
   * Find a user by their ID.
   * @param {number} id - The user ID
   * @returns {User|null} The user or null if not found
   */
  findById(id) {
    return this.database.get(id) || null;
  }

  /**
   * Find a user by their username.
   * @param {string} username - The username to search for
   * @returns {User|null} The user or null if not found
   */
  findByUsername(username) {
    for (const user of this.database.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  /**
   * Find all active users.
   * @returns {User[]} Array of active users
   */
  findAllActive() {
    return Array.from(this.database.values()).filter(user => user.active);
  }

  /**
   * Delete a user by ID.
   * @param {number} id - The user ID to delete
   * @returns {boolean} True if deleted, false otherwise
   */
  deleteById(id) {
    return this.database.delete(id);
  }

  /**
   * Get count of all users.
   * @returns {number} Total number of users
   */
  count() {
    return this.database.size;
  }
}

module.exports = UserRepository;
