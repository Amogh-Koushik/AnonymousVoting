// ============================================================
// Vote Page
// Allows users to cast their vote on a specific poll
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { HiArrowLeft, HiCheckCircle, HiLockClosed, HiExclamation } from 'react-icons/hi';

const Vote = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  // Fetch poll details
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/polls/results/${pollId}`);
        if (response.data.success) {
          const pollData = response.data.results;
          setPoll(pollData);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load poll.');
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [pollId]);

  // Submit vote
  const handleVote = async () => {
    if (!selectedOption) {
      setToast({ message: 'Please select an option.', type: 'error' });
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post('/polls/vote', {
        pollId,
        selectedOption,
      });

      if (response.data.success) {
        setSubmitted(true);
        setToast({ message: 'Vote submitted successfully!', type: 'success' });
        // Redirect to results after a brief delay
        setTimeout(() => {
          navigate(`/results/${pollId}`);
        }, 2000);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit vote.';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Loader text="Loading poll..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="glass-card p-8 text-center animate-fade-in">
          <HiExclamation className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-dark-400 mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Success state after voting
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="glass-card p-12 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <HiCheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Vote Submitted!</h2>
          <p className="text-dark-400 mb-6">Your vote has been recorded anonymously.</p>
          <p className="text-dark-500 text-sm">Redirecting to results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Poll info */}
      <div className="glass-card p-8 mb-6 animate-fade-in">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{poll?.title}</h1>
            {poll?.description && (
              <p className="text-dark-400">{poll.description}</p>
            )}
          </div>
          {poll?.isClosed && (
            <span className="badge-closed flex-shrink-0">
              <HiLockClosed className="w-3 h-3 mr-1" />
              Closed
            </span>
          )}
        </div>
      </div>

      {/* Voting disabled for closed polls */}
      {poll?.isClosed ? (
        <div className="glass-card p-8 text-center animate-slide-up">
          <HiLockClosed className="w-12 h-12 text-dark-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-300 mb-2">
            This poll is closed
          </h3>
          <p className="text-dark-500 text-sm mb-6">
            Voting is no longer available for this poll.
          </p>
          <Link to={`/results/${pollId}`} className="btn-primary">
            View Results
          </Link>
        </div>
      ) : (
        /* Vote options */
        <div className="space-y-3 mb-8 animate-slide-up">
          <h3 className="text-sm font-medium text-dark-400 uppercase tracking-wider mb-4">
            Select your choice
          </h3>
          {poll?.options?.map((option, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(option.text)}
              className={`w-full text-left p-5 rounded-xl border transition-all duration-300 group
                ${selectedOption === option.text
                  ? 'bg-primary-500/15 border-primary-500/40 shadow-lg shadow-primary-500/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
            >
              <div className="flex items-center gap-4">
                {/* Custom radio */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${selectedOption === option.text
                      ? 'border-primary-400 bg-primary-500'
                      : 'border-dark-500 group-hover:border-dark-400'
                    }`}
                >
                  {selectedOption === option.text && (
                    <div className="w-2 h-2 rounded-full bg-white animate-scale-in" />
                  )}
                </div>
                <span
                  className={`font-medium transition-colors
                    ${selectedOption === option.text ? 'text-white' : 'text-dark-300 group-hover:text-white'}`}
                >
                  {option.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Submit button */}
      {!poll?.isClosed && (
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={handleVote}
            disabled={!selectedOption || submitting}
            className="btn-primary w-full py-4 text-base"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Submitting...
              </span>
            ) : (
              'Submit Vote'
            )}
          </button>
          <p className="text-center text-dark-500 text-xs mt-3">
            🔒 Your vote is anonymous and cannot be changed
          </p>
        </div>
      )}
    </div>
  );
};

export default Vote;
