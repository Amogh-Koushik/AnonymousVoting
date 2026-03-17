// ============================================================
// PollCard Component
// Displays a poll summary card with status badges and actions
// ============================================================

import { Link } from 'react-router-dom';
import { HiChartBar, HiPencilAlt, HiUserGroup, HiClock, HiCheckCircle, HiLockClosed } from 'react-icons/hi';

const PollCard = ({ poll, isAdmin = false }) => {
  const totalVotes = poll.hasVoted?.length || 0;
  const totalAllowed = poll.allowedEmails?.length || 0;

  return (
    <div className="glass-card-hover p-6 flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2">
          {poll.title}
        </h3>
        <div className="flex-shrink-0">
          {poll.isClosed ? (
            <span className="badge-closed">
              <HiLockClosed className="w-3 h-3 mr-1" />
              Closed
            </span>
          ) : poll.hasUserVoted ? (
            <span className="badge-voted">
              <HiCheckCircle className="w-3 h-3 mr-1" />
              Voted
            </span>
          ) : (
            <span className="badge-active">
              <HiClock className="w-3 h-3 mr-1" />
              Active
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      {poll.description && (
        <p className="text-dark-400 text-sm mb-4 line-clamp-2">
          {poll.description}
        </p>
      )}

      {/* Options preview */}
      <div className="mb-4 flex-grow">
        <p className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-2">
          {poll.options?.length || 0} Options
        </p>
        <div className="flex flex-wrap gap-2">
          {poll.options?.slice(0, 4).map((opt, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-dark-300 border border-white/5"
            >
              {opt.text}
            </span>
          ))}
          {poll.options?.length > 4 && (
            <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-dark-500">
              +{poll.options.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-dark-500 mb-4 pt-3 border-t border-white/5">
        <span className="flex items-center gap-1">
          <HiChartBar className="w-3.5 h-3.5" />
          {totalVotes} votes
        </span>
        {isAdmin && (
          <span className="flex items-center gap-1">
            <HiUserGroup className="w-3.5 h-3.5" />
            {totalAllowed} allowed
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <HiClock className="w-3.5 h-3.5" />
          {new Date(poll.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {!poll.isClosed && !poll.hasUserVoted && !isAdmin && (
          <Link
            to={`/vote/${poll._id}`}
            className="btn-primary text-xs py-2 px-4 flex-1 text-center"
          >
            <HiPencilAlt className="w-3.5 h-3.5 inline mr-1" />
            Vote Now
          </Link>
        )}
        <Link
          to={`/results/${poll._id}`}
          className="btn-secondary text-xs py-2 px-4 flex-1 text-center"
        >
          <HiChartBar className="w-3.5 h-3.5 inline mr-1" />
          Results
        </Link>
      </div>
    </div>
  );
};

export default PollCard;
