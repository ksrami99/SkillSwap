import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';

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


  useEffect(() => {
    fetchUsers();
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
      alert('Swap request sent!');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed');
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
        <div className="flex gap-2 items-center">
          <select
            value={availability}
            onChange={e => setAvailability(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Availability</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="evenings">Evenings</option>
          </select>
          <input
            type="text"
            placeholder="Search by skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="text-sm text-gray-500">Only public profiles are visible</div>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <button
                  className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold focus:outline-none"
                  onClick={() => handleProfileClick(user)}
                  aria-label="View profile"
                >
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </button>
                <div>
                  <button
                    className="font-semibold text-lg hover:underline focus:outline-none"
                    onClick={() => handleProfileClick(user)}
                    aria-label="View profile"
                  >
                    {user.name}
                  </button>
                  <div className="text-sm text-gray-600">{user.location || 'No location'}</div>
                  <div className="text-xs mt-1">
                    <span className="font-medium">Offers:</span> {user.skillsOffered?.join(', ') || 'None'}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Wants:</span> {user.skillsWanted?.join(', ') || 'None'}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Availability:</span> {user.availability || 'N/A'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleRequest(user)}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Request
                </button>
                <button
                  onClick={() => navigate(`/feedback/${user._id}`)}
                  className="bg-gray-300 px-4 py-1 rounded"
                >
                  Feedback
                </button>
              </div>
            </div>
          ))}
          {!users.length && <p className="text-gray-500">No users found.</p>}
        </div>
      )}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <Modal open={showProfileModal} onClose={() => setShowProfileModal(false)}>
        {selectedUser && (
          <div className="space-y-2">
            <div className="flex items-center gap-4 mb-2">
              <span className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
                {selectedUser.name ? selectedUser.name[0].toUpperCase() : 'U'}
              </span>
              <div>
                <div className="font-bold text-xl">{selectedUser.name}</div>
                <div className="text-gray-600 text-sm">{selectedUser.location || 'No location'}</div>
              </div>
            </div>
            <div>
              <span className="font-medium">Skills Offered:</span> {selectedUser.skillsOffered?.join(', ') || 'None'}
            </div>
            <div>
              <span className="font-medium">Skills Wanted:</span> {selectedUser.skillsWanted?.join(', ') || 'None'}
            </div>
            <div>
              <span className="font-medium">Availability:</span> {selectedUser.availability || 'N/A'}
            </div>
            <div>
              <span className="font-medium">Profile:</span> {selectedUser.isPublic ? 'Public' : 'Private'}
            </div>
            {/* Feedback and rating could be shown here if available */}
          </div>
        )}
      </Modal>
      <Modal open={showRequestModal} onClose={() => setShowRequestModal(false)}>
        {requestUser && (
          <form onSubmit={submitSwapRequest} className="space-y-4">
            <h2 className="text-lg font-bold mb-2">Request Swap with {requestUser.name}</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Choose one of your offered skills</label>
              <input
                type="text"
                value={offeredSkill}
                onChange={e => setOfferedSkill(e.target.value)}
                required
                className="border p-2 w-full rounded"
                placeholder="e.g. Guitar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Choose one of their wanted skills</label>
              <input
                type="text"
                value={wantedSkill}
                onChange={e => setWantedSkill(e.target.value)}
                required
                className="border p-2 w-full rounded"
                placeholder="e.g. French"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="border p-2 w-full rounded"
                placeholder="Optional message"
              />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded w-full flex items-center justify-center"
              disabled={requestLoading}
            >
              {requestLoading && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></span>}
              {requestLoading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}