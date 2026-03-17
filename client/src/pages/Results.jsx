// ============================================================
// Results Page
// Displays poll results with bar charts
// Admin sees voter emails, users see counts only
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { HiArrowLeft, HiChartBar, HiUserGroup, HiLockClosed, HiCheckCircle, HiExclamation } from 'react-icons/hi';

const Results = () => {
  const { pollId } = useParams();
  const { isAdmin } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/polls/results/${pollId}`);
        if (response.data.success) {
          setResults(response.data.results);
          setIsAdminView(response.data.isAdmin);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [pollId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Loader text="Loading results..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="glass-card p-8 text-center animate-fade-in">
          <HiExclamation className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-dark-400 mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // Calculate max vote count for bar scaling
  const maxVotes = Math.max(...(results?.options?.map((o) => o.voteCount) || [1]), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Poll header */}
      <div className="glass-card p-8 mb-6 animate-fade-in">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-white">{results?.title}</h1>
          {results?.isClosed ? (
            <span className="badge-closed flex-shrink-0">
              <HiLockClosed className="w-3 h-3 mr-1" />
              Closed
            </span>
          ) : (
            <span className="badge-active flex-shrink-0">Active</span>
          )}
        </div>
        {results?.description && (
          <p className="text-dark-400 mb-4">{results.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-dark-500">
          <span className="flex items-center gap-1">
            <HiChartBar className="w-4 h-4" />
            {results?.totalVotes || 0} total votes
          </span>
          {isAdminView && results?.totalAllowed && (
            <span className="flex items-center gap-1">
              <HiUserGroup className="w-4 h-4" />
              {results.totalAllowed} allowed voters
            </span>
          )}
          <span className="text-dark-600">
            Created {new Date(results?.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Results chart */}
      <div className="glass-card p-8 mb-6 animate-slide-up">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <HiChartBar className="w-5 h-5 text-primary-400" />
          Vote Distribution
        </h2>

        <div className="space-y-5">
          {results?.options?.map((option, idx) => {
            const percentage = results.totalVotes > 0
              ? Math.round((option.voteCount / results.totalVotes) * 100)
              : 0;
            const barWidth = results.totalVotes > 0
              ? (option.voteCount / maxVotes) * 100
              : 0;

            // Color palette for bars
            const colors = [
              'from-primary-500 to-primary-600',
              'from-emerald-500 to-emerald-600',
              'from-amber-500 to-amber-600',
              'from-rose-500 to-rose-600',
              'from-cyan-500 to-cyan-600',
              'from-purple-500 to-purple-600',
              'from-orange-500 to-orange-600',
              'from-teal-500 to-teal-600',
            ];
            const color = colors[idx % colors.length];

            return (
              <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{option.text}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-dark-400">
                      {option.voteCount} vote{option.voteCount !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-semibold text-primary-300 bg-primary-500/10 px-2 py-0.5 rounded-full">
                      {percentage}%
                    </span>
                  </div>
                </div>
                {/* Bar */}
                <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin-only: Voter emails (who voted, but NOT what they chose) */}
      {isAdminView && results?.voterEmails && (
        <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HiUserGroup className="w-5 h-5 text-amber-400" />
            Voter Emails
            <span className="text-xs font-normal text-dark-500">(admin only)</span>
          </h2>
          <p className="text-xs text-dark-500 mb-4">
            These emails have voted. Their specific choices are kept anonymous.
          </p>
          {results.voterEmails.length === 0 ? (
            <p className="text-dark-500 text-sm">No votes yet.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.voterEmails.map((email, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5"
                >
                  <HiCheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-dark-300">{email}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pending voters */}
          {results.allowedEmails && (
            <div className="mt-6 pt-4 border-t border-white/5">
              <h3 className="text-sm font-medium text-dark-400 mb-3">
                Pending Voters ({results.allowedEmails.length - results.voterEmails.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.allowedEmails
                  .filter((e) => !results.voterEmails.includes(e))
                  .map((email, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-dark-500 border border-white/5"
                    >
                      {email}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
