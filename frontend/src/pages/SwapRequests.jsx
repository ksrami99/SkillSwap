import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function SwapRequests() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(''); // store request id being acted on

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, [page]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/swaps', {
        params: { page },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      // Show received requests from API response
      let reqs = data.data.received || [];
      setRequests(reqs);
      setTotalPages(data.data.totalPages || 1);
    } catch (err) {
      setRequests([]);
      setError('Failed to load swap requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    setError('');
    try {
      await axios.put(`/swaps/${id}`, { status: action }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchRequests();
    } catch (err) {
      setError('Action failed. Please try again.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Swap Requests</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const otherUser = req.requester?._id === req.me ? req.recipient : req.requester;
            return (
              <div
                key={req._id}
                className="border p-4 rounded bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
                    {otherUser?.name ? otherUser.name[0].toUpperCase() : 'U'}
                  </span>
                  <div>
                    <div className="font-semibold text-lg">{otherUser?.name || 'Unknown'}</div>
                    <div className="text-xs text-gray-600">{otherUser?.location || ''}</div>
                    <div className="text-xs">
                      <span className="font-medium">Offer:</span> {req.offeredSkill}
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">Want:</span> {req.requestedSkill}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-2 md:mt-0 md:items-end">
                  <div className="text-sm">
                    <span className="font-medium">Status:</span>{' '}
                    <span className={
                      req.status === 'pending' ? 'text-yellow-600' :
                      req.status === 'accepted' ? 'text-green-600' :
                      'text-red-600'
                    }>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(req._id, 'accepted')}
                        className="bg-green-500 text-white px-3 py-1 rounded flex items-center justify-center"
                        disabled={actionLoading === req._id + 'accepted'}
                      >
                        {actionLoading === req._id + 'accepted' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1"></span>}
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(req._id, 'rejected')}
                        className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center"
                        disabled={actionLoading === req._id + 'rejected'}
                      >
                        {actionLoading === req._id + 'rejected' && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-1"></span>}
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
    </div>
  );
}
