// ============================================================
// Authentication Routes
// Handles user login via Firebase token verification
// ============================================================

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

/**
 * POST /api/auth/login
 * Verify Firebase token and create/find user in database.
 * Automatically assigns admin role if email matches ADMIN_EMAIL env var.
 */
router.post('/login', verifyToken, async (req, res) => {
  try {
    const email = req.user.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not found in token.',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Determine role — check if this email is the admin
      const adminEmails = process.env.ADMIN_EMAIL
        ? process.env.ADMIN_EMAIL.split(',').map((e) => e.trim().toLowerCase())
        : [];

      const role = adminEmails.includes(email) ? 'admin' : 'user';

      // Create new user
      user = await User.create({ email, role });
      console.log(`New user created: ${email} (${role})`);
    }

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info (requires valid token).
 */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const email = req.user.email?.toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
});

module.exports = router;
