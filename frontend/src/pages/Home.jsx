import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { Search, Filter, MapPin, Clock, Star, MessageSquare, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestUser, setRequestUser] = useState(null);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [message, setMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, activeSwaps: 0 });

  useEffect(() => {
    fetchUsers();
    fetchStats();
    // eslint-disable-next-line
  }, [search, availability, page]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/users', {
        params: { skill: search, availability, page },
      });
      setUsers(data.data.users || data.data); // support both array and paginated
      setTotalPages(data.data.totalPages || 1);
    } catch (err) {
      setUsers([]);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/stats',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setStats(data.data || { totalUsers: 0, activeSwaps: 0 });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleRequest = (user) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRequestUser(user);
    setOfferedSkill('');
    setWantedSkill('');
    setMessage('');
    setShowRequestModal(true);
  };

  const submitSwapRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setError('');
    try {
      await axios.post(`/swaps/${requestUser._id}`, {
        offeredSkill,
        requestedSkill: wantedSkill,
        message,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setShowRequestModal(false);
      toast.success('Swap request sent successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Request failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setRequestLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Find Your Perfect Skill Swap
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 mb-6"
        >
          Connect with people who want to learn what you know and teach you what they know
        </motion.p>
        
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mb-8"
        >
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={20} />
            <span className="font-semibold">{stats.totalUsers} Users</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MessageSquare size={20} />
            <span className="font-semibold">{stats.activeSwaps} Active Swaps</span>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by skill..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value)}
                className="input-field pl-10 appearance-none"
              >
                <option value="">All Availability</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <User size={16} />
            Only public profiles are visible
          </div>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
        >
          {error}
        </motion.div>
      )}

      {/* Users List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {users.map((user) => (
            <motion.div
              key={user._id}
              variants={itemVariants}
              className="card p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <button
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold focus:outline-none hover:scale-105 transition-transform"
                    onClick={() => handleProfileClick(user)}
                    aria-label="View profile"
                  >
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </button>
                  <div className="flex-1">
                    <button
                      className="font-semibold text-xl hover:text-blue-600 focus:outline-none transition-colors"
                      onClick={() => handleProfileClick(user)}
                      aria-label="View profile"
                    >
                      {user.name}
                    </button>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <MapPin size={16} />
                      <span>{user.location || 'No location'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Clock size={16} />
                      <span>{user.availability || 'N/A'}</span>
                    </div>
                    
                    {/* Skills Offered */}
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-700">Offers:</span>
                      <div className="mt-1">
                        {user.skillsOffered?.length > 0 ? (
                          user.skillsOffered.map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Skills Wanted */}
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-700">Wants:</span>
                      <div className="mt-1">
                        {user.skillsWanted?.length > 0 ? (
                          user.skillsWanted.map((skill, index) => (
                            <span key={index} className="skill-tag-wanted">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <button
                    onClick={() => handleRequest(user)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Request Swap
                  </button>
                  <button
                    onClick={() => navigate(`/feedback/${user._id}`)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Star size={16} />
                    View Feedback
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {!users.length && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <Users size={64} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No users found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                page === i + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      <Modal open={showProfileModal} onClose={() => setShowProfileModal(false)}>
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {selectedUser.name ? selectedUser.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="font-bold text-2xl">{selectedUser.name}</div>
                <div className="text-gray-600 flex items-center gap-2">
                  <MapPin size={16} />
                  {selectedUser.location || 'No location'}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Skills Offered:</span>
                <div className="mt-1">
                  {selectedUser.skillsOffered?.length > 0 ? (
                    selectedUser.skillsOffered.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Skills Wanted:</span>
                <div className="mt-1">
                  {selectedUser.skillsWanted?.length > 0 ? (
                    selectedUser.skillsWanted.map((skill, index) => (
                      <span key={index} className="skill-tag-wanted">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="font-medium text-gray-700">Availability:</span>
                <span>{selectedUser.availability || 'N/A'}</span>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">Profile:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  selectedUser.isPublic 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedUser.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Request Modal */}
      <Modal open={showRequestModal} onClose={() => setShowRequestModal(false)}>
        {requestUser && (
          <form onSubmit={submitSwapRequest} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-2">Request Swap with {requestUser.name}</h2>
              <p className="text-gray-600">Propose a skill exchange</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Choose one of your offered skills</label>
              <input
                type="text"
                value={offeredSkill}
                onChange={e => setOfferedSkill(e.target.value)}
                required
                className="input-field"
                placeholder="e.g. Guitar, Spanish, Photography"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Choose one of their wanted skills</label>
              <input
                type="text"
                value={wantedSkill}
                onChange={e => setWantedSkill(e.target.value)}
                required
                className="input-field"
                placeholder="e.g. French, Piano, Cooking"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Message (optional)</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="input-field"
                placeholder="Introduce yourself and explain your proposal..."
                rows={3}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
              disabled={requestLoading}
            >
              {requestLoading && <div className="spinner mr-2"></div>}
              {requestLoading ? 'Sending Request...' : 'Send Request'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}