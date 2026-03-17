// ============================================================
// Admin Dashboard Page
// Create polls, manage existing polls, view results
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Toast from '../components/Toast';
import Loader from '../components/Loader';
import {
  HiPlus, HiX, HiChartBar, HiLockClosed, HiTrash,
  HiShieldCheck, HiMail, HiClock, HiUserGroup,
  HiChevronDown, HiChevronUp, HiRefresh
} from 'react-icons/hi';

const AdminDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Create poll form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    options: ['', ''],
    allowedEmails: '',
  });

  // Expanded poll details
  const [expandedPoll, setExpandedPoll] = useState(null);

  // Fetch all polls
  const fetchPolls = async () => {
    try {
      setLoading(true);
      const response = await api.get('/polls');
      if (response.data.success) {
        setPolls(response.data.polls);
      }
    } catch (error) {
      setToast({ message: 'Failed to load polls.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  // ─── Create Poll ───────────────────────────────────────
  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, ''],
    }));
  };

  const removeOption = (idx) => {
    if (formData.options.length <= 2) return;
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx),
    }));
  };

  const updateOption = (idx, value) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === idx ? value : opt)),
    }));
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();

    // Validate
    const title = formData.title.trim();
    const options = formData.options.map((o) => o.trim()).filter(Boolean);
    const allowedEmails = formData.allowedEmails
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!title) {
      setToast({ message: 'Title is required.', type: 'error' });
      return;
    }
    if (options.length < 2) {
      setToast({ message: 'At least 2 options are required.', type: 'error' });
      return;
    }
    if (allowedEmails.length === 0) {
      setToast({ message: 'At least 1 allowed email is required.', type: 'error' });
      return;
    }

    try {
      setCreating(true);
      const response = await api.post('/polls/create', {
        title,
        description: formData.description.trim(),
        options,
        allowedEmails,
      });

      if (response.data.success) {
        setToast({ message: 'Poll created successfully!', type: 'success' });
        setFormData({ title: '', description: '', options: ['', ''], allowedEmails: '' });
        setShowCreateForm(false);
        fetchPolls();
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to create poll.',
        type: 'error',
      });
    } finally {
      setCreating(false);
    }
  };

  // ─── Close Poll ────────────────────────────────────────
  const handleClosePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to close this poll? This cannot be undone.')) return;

    try {
      const response = await api.post('/polls/close', { pollId });
      if (response.data.success) {
        setToast({ message: 'Poll closed successfully.', type: 'success' });
        fetchPolls();
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to close poll.',
        type: 'error',
      });
    }
  };

  // ─── Delete Poll ───────────────────────────────────────
  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to DELETE this poll? This action is permanent.')) return;

    try {
      const response = await api.delete(`/polls/${pollId}`);
      if (response.data.success) {
        setToast({ message: 'Poll deleted successfully.', type: 'success' });
        fetchPolls();
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete poll.',
        type: 'error',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <HiShieldCheck className="w-8 h-8 text-primary-400" />
            Admin Dashboard
          </h1>
          <p className="text-dark-400 mt-1">Manage polls, view results, and control access</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchPolls} className="btn-secondary py-2 px-4 text-sm">
            <HiRefresh className="w-4 h-4 inline mr-1" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-primary py-2 px-4 text-sm"
          >
            {showCreateForm ? (
              <>
                <HiX className="w-4 h-4 inline mr-1" />
                Cancel
              </>
            ) : (
              <>
                <HiPlus className="w-4 h-4 inline mr-1" />
                New Poll
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Create Poll Form ─────────────────────────────── */}
      {showCreateForm && (
        <div className="glass-card p-8 mb-8 animate-scale-in">
          <h2 className="text-xl font-semibold text-white mb-6">Create New Poll</h2>
          <form onSubmit={handleCreatePoll} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Poll Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="e.g., Best programming language 2024"
                maxLength={200}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[80px] resize-y"
                placeholder="Optional description for the poll..."
                maxLength={1000}
                rows={3}
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Options <span className="text-red-400">*</span>
                <span className="text-dark-500 font-normal ml-2">(minimum 2)</span>
              </label>
              <div className="space-y-2">
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-dark-500 w-5 text-right">{idx + 1}.</span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(idx, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Option ${idx + 1}`}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        className="p-2 text-dark-500 hover:text-red-400 transition-colors"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addOption}
                className="mt-2 text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
              >
                <HiPlus className="w-3 h-3" />
                Add option
              </button>
            </div>

            {/* Allowed Emails */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                <HiMail className="w-4 h-4 inline mr-1" />
                Allowed Voter Emails <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.allowedEmails}
                onChange={(e) => setFormData({ ...formData, allowedEmails: e.target.value })}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text');
                  const textarea = e.target;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const currentValue = formData.allowedEmails;
                  const newValue = currentValue.substring(0, start) + pastedText + currentValue.substring(end);
                  setFormData({ ...formData, allowedEmails: newValue });
                }}
                className="input-field min-h-[100px] resize-y"
                placeholder={"Enter email addresses (one per line, or comma-separated)\ne.g.\nalice@example.com\nbob@example.com"}
                rows={4}
              />
              <p className="text-xs text-dark-500 mt-1">
                Only these users will be able to vote in this poll
              </p>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={creating} className="btn-primary flex-1">
                {creating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Create Poll'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Polls List ───────────────────────────────────── */}
      {loading ? (
        <Loader text="Loading polls..." />
      ) : polls.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <HiChartBar className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-300 mb-2">No polls yet</h3>
          <p className="text-dark-500 text-sm">
            Create your first poll to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">
            All Polls ({polls.length})
          </h2>
          {polls.map((poll) => (
            <div
              key={poll._id}
              className="glass-card overflow-hidden transition-all duration-300 animate-fade-in"
            >
              {/* Poll header row */}
              <div
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedPoll(expandedPoll === poll._id ? null : poll._id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-white truncate">
                      {poll.title}
                    </h3>
                    {poll.isClosed ? (
                      <span className="badge-closed text-[10px]">
                        <HiLockClosed className="w-2.5 h-2.5 mr-0.5" />
                        Closed
                      </span>
                    ) : (
                      <span className="badge-active text-[10px]">Active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-dark-500">
                    <span className="flex items-center gap-1">
                      <HiChartBar className="w-3 h-3" />
                      {poll.hasVoted?.length || 0} votes
                    </span>
                    <span className="flex items-center gap-1">
                      <HiUserGroup className="w-3 h-3" />
                      {poll.allowedEmails?.length || 0} allowed
                    </span>
                    <span className="flex items-center gap-1">
                      <HiClock className="w-3 h-3" />
                      {new Date(poll.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Action buttons */}
                  <Link
                    to={`/results/${poll._id}`}
                    className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                    title="View Results"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <HiChartBar className="w-4 h-4" />
                  </Link>
                  {!poll.isClosed && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleClosePoll(poll._id); }}
                      className="p-2 rounded-lg text-dark-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                      title="Close Poll"
                    >
                      <HiLockClosed className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePoll(poll._id); }}
                    className="p-2 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete Poll"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                  {/* Expand chevron */}
                  {expandedPoll === poll._id ? (
                    <HiChevronUp className="w-5 h-5 text-dark-500" />
                  ) : (
                    <HiChevronDown className="w-5 h-5 text-dark-500" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {expandedPoll === poll._id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-slide-down">
                  {poll.description && (
                    <p className="text-sm text-dark-400 mb-4">{poll.description}</p>
                  )}

                  {/* Options */}
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-2">
                      Options
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {poll.options?.map((opt, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-dark-300 border border-white/5"
                        >
                          {opt.text} — <span className="text-primary-300">{opt.voteCount} votes</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Allowed emails */}
                  <div>
                    <h4 className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-2">
                      Allowed Voters ({poll.allowedEmails?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {poll.allowedEmails?.map((email, idx) => (
                        <span
                          key={idx}
                          className={`text-[11px] px-2 py-1 rounded-md border ${
                            poll.hasVoted?.includes(email)
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                              : 'bg-white/5 text-dark-500 border-white/5'
                          }`}
                        >
                          {email}
                          {poll.hasVoted?.includes(email) && ' ✓'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
