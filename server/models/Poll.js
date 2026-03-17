// ============================================================
// Poll Model
// Stores voting polls with options, allowed voters, and results
// ============================================================

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Poll title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    // Poll options with vote count tracking
    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        voteCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    // List of email addresses allowed to vote
    allowedEmails: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    // Tracks which emails have already voted (prevents double-voting)
    hasVoted: [
      {
        type: String,
        lowercase: true,
      },
    ],
    // Stores individual votes (visible only to admin)
    // Note: userEmail is stored for admin audit, but is never
    // publicly linked to the selectedOption in user-facing results
    votes: [
      {
        userEmail: {
          type: String,
          required: true,
          lowercase: true,
        },
        selectedOption: {
          type: String,
          required: true,
        },
      },
    ],
    // Whether the poll is closed for voting
    isClosed: {
      type: Boolean,
      default: false,
    },
    // Admin who created this poll
    createdBy: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Poll', pollSchema);
