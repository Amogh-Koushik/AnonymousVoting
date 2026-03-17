// ============================================================
// Admin Authorization Middleware
// Checks if the authenticated user has admin role
// Must be used AFTER the verifyToken middleware
// ============================================================

const User = require('../models/User');

/**
 * Middleware to check admin privileges.
 * Requires verifyToken middleware to run first (sets req.user).
 */
const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.user.email?.toLowerCase();

    if (!email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Email not found in token.',
      });
    }

    // Look up user in database and check role
    const user = await User.findOne({ email });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    console.error('Admin verification failed:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authorization.',
    });
  }
};

module.exports = verifyAdmin;
