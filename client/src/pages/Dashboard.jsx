// ============================================================
// User Dashboard Page
// Displays active polls with search/filter functionality
// ============================================================

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PollCard from '../components/PollCard';
import Loader from '../components/Loader';
import Toast from '../components/Toast';
import { HiSearch, HiFilter, HiRefresh, HiInbox } from 'react-icons/hi';

const Dashboard = () => {
  const { dbUser, isAdmin } = useAuth();
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, closed, voted
  const [toast, setToast] = useState(null);

  // Fetch polls
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

  // Filter and search polls
  useEffect(() => {
    let result = [...polls];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (poll) =>
          poll.title.toLowerCase().includes(term) ||
          poll.description?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (filterStatus === 'active') {
      result = result.filter((p) => !p.isClosed && !p.hasUserVoted);
    } else if (filterStatus === 'closed') {
      result = result.filter((p) => p.isClosed);
    } else if (filterStatus === 'voted') {
      result = result.filter((p) => p.hasUserVoted);
    }

    setFilteredPolls(result);
  }, [polls, searchTerm, filterStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, <span className="gradient-text">{dbUser?.email?.split('@')[0]}</span>
        </h1>
        <p className="text-dark-400">
          {isAdmin
            ? 'Admin view — you can see all polls'
            : 'View and participate in polls you\'re invited to'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3 animate-slide-up">
        {/* Search */}
        <div className="relative flex-1">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search polls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 py-2.5 text-sm"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <HiFilter className="text-dark-500 w-4 h-4 hidden sm:block" />
          {['all', 'active', 'closed', 'voted'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize
                ${filterStatus === status
                  ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                  : 'text-dark-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              {status}
            </button>
          ))}

          {/* Refresh button */}
          <button
            onClick={fetchPolls}
            className="p-2 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all ml-1"
            title="Refresh"
          >
            <HiRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Loading polls..." />
      ) : filteredPolls.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <HiInbox className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-300 mb-2">
            {searchTerm || filterStatus !== 'all'
              ? 'No polls match your filters'
              : 'No polls available'}
          </h3>
          <p className="text-dark-500 text-sm">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'You\'ll see polls here when you\'re invited to vote'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPolls.map((poll) => (
            <PollCard key={poll._id} poll={poll} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {/* Stats bar */}
      {!loading && polls.length > 0 && (
        <div className="mt-6 text-center text-xs text-dark-500 animate-fade-in">
          Showing {filteredPolls.length} of {polls.length} polls
        </div>
      )}
    </div>
  );
};

export default Dashboard;
