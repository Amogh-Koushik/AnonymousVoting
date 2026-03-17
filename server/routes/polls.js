// ============================================================
// Poll Routes
// Handles CRUD operations for polls and voting
// ============================================================

const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const verifyToken = require('../middleware/auth');
const verifyAdmin = require('../middleware/adminAuth');

// ────────────────────────────────────────────────────────────
// POST /api/polls/create — Admin creates a new poll
// ────────────────────────────────────────────────────────────
router.post('/create', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, options, allowedEmails } = req.body;

    // Validation
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Title and at least 2 options are required.',
      });
    }

    if (!allowedEmails || !Array.isArray(allowedEmails) || allowedEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one allowed email is required.',
      });
    }

    // Create poll with formatted options
    const poll = await Poll.create({
      title: title.trim(),
      description: description?.trim() || '',
      options: options.map((opt) => ({
        text: typeof opt === 'string' ? opt.trim() : opt.text?.trim(),
        voteCount: 0,
      })),
      allowedEmails: allowedEmails.map((e) => e.trim().toLowerCase()),
      createdBy: req.user.email.toLowerCase(),
    });

    return res.status(201).json({
      success: true,
      message: 'Poll created successfully.',
      poll,
    });
  } catch (error) {
    console.error('Create poll error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating poll.',
    });
  }
});

// ────────────────────────────────────────────────────────────
// GET /api/polls — Get polls for the authenticated user
// Admin sees all polls; users see only polls they're allowed to vote in
// ────────────────────────────────────────────────────────────
router.get('/', verifyToken, async (req, res) => {
  try {
    const email = req.user.email?.toLowerCase();
    const User = require('../models/User');
    const user = await User.findOne({ email });

    let polls;
    if (user && user.role === 'admin') {
      // Admin sees all polls (without vote details in list view)
      polls = await Poll.find()
        .select('-votes')
        .sort({ createdAt: -1 });
    } else {
      // Regular user sees only polls they're allowed to vote in
      polls = await Poll.find({ allowedEmails: email })
        .select('-votes -allowedEmails')
        .sort({ createdAt: -1 });
    }

    // Add hasUserVoted flag for each poll
    const pollsWithStatus = polls.map((poll) => {
      const pollObj = poll.toObject();
      pollObj.hasUserVoted = poll.hasVoted.includes(email);
      return pollObj;
    });

    return res.status(200).json({
      success: true,
      polls: pollsWithStatus,
    });
  } catch (error) {
    console.error('Get polls error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching polls.',
    });
  }
});

// ────────────────────────────────────────────────────────────
// POST /api/polls/vote — Submit a vote
// ────────────────────────────────────────────────────────────
router.post('/vote', verifyToken, async (req, res) => {
  try {
    const { pollId, selectedOption } = req.body;
    const email = req.user.email?.toLowerCase();

    if (!pollId || !selectedOption) {
      return res.status(400).json({
        success: false,
        message: 'Poll ID and selected option are required.',
      });
    }

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found.',
      });
    }

    // Check if poll is closed
    if (poll.isClosed) {
      return res.status(400).json({
        success: false,
        message: 'This poll is closed. Voting is no longer allowed.',
      });
    }

    // Check if user is allowed to vote
    if (!poll.allowedEmails.includes(email)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to vote in this poll.',
      });
    }

    // Check if user already voted
    if (poll.hasVoted.includes(email)) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted in this poll.',
      });
    }

    // Validate the selected option exists
    const optionIndex = poll.options.findIndex(
      (opt) => opt.text === selectedOption
    );

    if (optionIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid option selected.',
      });
    }

    // Record the vote
    poll.options[optionIndex].voteCount += 1;
    poll.hasVoted.push(email);
    poll.votes.push({ userEmail: email, selectedOption });

    await poll.save();

    return res.status(200).json({
      success: true,
      message: 'Vote submitted successfully.',
    });
  } catch (error) {
    console.error('Vote error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting vote.',
    });
  }
});

// ────────────────────────────────────────────────────────────
// GET /api/polls/results/:pollId — Get poll results
// Admin: sees vote counts + voter emails (but NOT which option they chose)
// User: sees vote counts only
// ────────────────────────────────────────────────────────────
router.get('/results/:pollId', verifyToken, async (req, res) => {
  try {
    const { pollId } = req.params;
    const email = req.user.email?.toLowerCase();

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found.',
      });
    }

    const User = require('../models/User');
    const user = await User.findOne({ email });
    const isAdmin = user && user.role === 'admin';

    // Base results (visible to everyone)
    const results = {
      _id: poll._id,
      title: poll.title,
      description: poll.description,
      options: poll.options.map((opt) => ({
        text: opt.text,
        voteCount: opt.voteCount,
      })),
      totalVotes: poll.hasVoted.length,
      isClosed: poll.isClosed,
      createdAt: poll.createdAt,
    };

    // Admin gets additional data
    if (isAdmin) {
      // Admin can see WHO voted (emails), but NOT which option they chose
      results.voterEmails = poll.hasVoted;
      results.allowedEmails = poll.allowedEmails;
      results.totalAllowed = poll.allowedEmails.length;
    }

    return res.status(200).json({
      success: true,
      results,
      isAdmin,
    });
  } catch (error) {
    console.error('Get results error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching results.',
    });
  }
});

// ────────────────────────────────────────────────────────────
// POST /api/polls/close — Admin closes a poll
// ────────────────────────────────────────────────────────────
router.post('/close', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { pollId } = req.body;

    if (!pollId) {
      return res.status(400).json({
        success: false,
        message: 'Poll ID is required.',
      });
    }

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found.',
      });
    }

    if (poll.isClosed) {
      return res.status(400).json({
        success: false,
        message: 'Poll is already closed.',
      });
    }

    poll.isClosed = true;
    await poll.save();

    return res.status(200).json({
      success: true,
      message: 'Poll closed successfully.',
    });
  } catch (error) {
    console.error('Close poll error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while closing poll.',
    });
  }
});

// ────────────────────────────────────────────────────────────
// DELETE /api/polls/:pollId — Admin deletes a poll
// ────────────────────────────────────────────────────────────
router.delete('/:pollId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findByIdAndDelete(pollId);

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Poll deleted successfully.',
    });
  } catch (error) {
    console.error('Delete poll error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting poll.',
    });
  }
});

module.exports = router;
