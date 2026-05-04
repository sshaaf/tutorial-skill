const crypto = require('crypto');

/**
 * Utility for encoding and validating passwords.
 * Uses SHA-256 hashing for demonstration (use bcrypt in production).
 */
class PasswordEncoder {
  /**
   * Encode a plain text password.
   * @param {string} plainPassword - The password to encode
   * @returns {string} The encoded password
   */
  encode(plainPassword) {
    const hash = crypto.createHash('sha256');
    hash.update(plainPassword);
    return hash.digest('base64');
  }

  /**
   * Check if a plain password matches an encoded password.
   * @param {string} plainPassword - The plain text password
   * @param {string} encodedPassword - The encoded password
   * @returns {boolean} True if passwords match
   */
  matches(plainPassword, encodedPassword) {
    const encoded = this.encode(plainPassword);
    return encoded === encodedPassword;
  }
}

module.exports = PasswordEncoder;
