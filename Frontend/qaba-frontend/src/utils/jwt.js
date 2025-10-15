/**
 * JWT Token Utilities
 * Handles JWT token parsing, expiry checking, and validation
 */

/**
 * Decode a JWT token and return its payload
 * @param {string} token - The JWT token to decode
 * @returns {Object} The decoded payload
 */
export function decodeJWT(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token provided');
  }

  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Get the payload (second part)
    const base64Url = parts[1];

    // Replace URL-safe characters
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode from base64
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    throw new Error('Failed to decode JWT token');
  }
}

/**
 * Get the expiry time of a JWT token
 * @param {string} token - The JWT token
 * @returns {number} The expiry time in milliseconds
 */
export function getTokenExpiryTime(token) {
  try {
    const payload = decodeJWT(token);

    if (!payload.exp) {
      console.warn('Token does not contain exp claim');
      return 0;
    }

    // Convert from seconds to milliseconds
    return payload.exp * 1000;
  } catch (error) {
    console.error('Error getting token expiry time:', error);
    return 0;
  }
}

/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token
 * @returns {boolean} True if token is expired
 */
export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const expiryTime = getTokenExpiryTime(token);
    if (expiryTime === 0) return true;

    return Date.now() >= expiryTime;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true;
  }
}

/**
 * Check if a JWT token is expiring soon
 * @param {string} token - The JWT token
 * @param {number} bufferMinutes - How many minutes before expiry to consider as "expiring soon"
 * @returns {boolean} True if token is expiring within the buffer period
 */
export function isTokenExpiringSoon(token, bufferMinutes = 5) {
  if (!token) return true;

  try {
    const expiryTime = getTokenExpiryTime(token);
    if (expiryTime === 0) return true;

    const bufferMs = bufferMinutes * 60 * 1000;
    return Date.now() >= (expiryTime - bufferMs);
  } catch (error) {
    console.error('Error checking if token is expiring soon:', error);
    return true;
  }
}

/**
 * Get the time until token expires (in milliseconds)
 * @param {string} token - The JWT token
 * @returns {number} Milliseconds until expiry (0 if expired)
 */
export function getTimeUntilExpiry(token) {
  if (!token) return 0;

  try {
    const expiryTime = getTokenExpiryTime(token);
    if (expiryTime === 0) return 0;

    const timeUntilExpiry = expiryTime - Date.now();
    return Math.max(0, timeUntilExpiry);
  } catch (error) {
    console.error('Error getting time until expiry:', error);
    return 0;
  }
}

/**
 * Extract user information from JWT token
 * @param {string} token - The JWT token
 * @returns {Object|null} User information or null if extraction fails
 */
export function getUserFromToken(token) {
  if (!token) return null;

  try {
    const payload = decodeJWT(token);

    return {
      user_id: payload.user_id,
      email: payload.email,
      user_type: payload.user_type,
      exp: payload.exp,
      iat: payload.iat,
      // Add any other fields your JWT contains
    };
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
}

/**
 * Validate JWT token structure and expiry
 * @param {string} token - The JWT token
 * @returns {Object} Validation result with isValid and error message
 */
export function validateToken(token) {
  if (!token) {
    return { isValid: false, error: 'No token provided' };
  }

  if (typeof token !== 'string') {
    return { isValid: false, error: 'Token must be a string' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Invalid JWT format' };
  }

  try {
    const payload = decodeJWT(token);

    if (!payload.exp) {
      return { isValid: false, error: 'Token missing expiry claim' };
    }

    if (isTokenExpired(token)) {
      return { isValid: false, error: 'Token has expired' };
    }

    return { isValid: true, payload };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}

const jwtUtils = {
  decodeJWT,
  getTokenExpiryTime,
  isTokenExpired,
  isTokenExpiringSoon,
  getTimeUntilExpiry,
  getUserFromToken,
  validateToken,
};

export default jwtUtils;
