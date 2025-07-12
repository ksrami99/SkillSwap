import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';

export default function FeedbackPage() {
  const { userId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchFeedbacks = async () => {
    try {
      const { data } = await axios.get(`/feedback/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setFeedbacks(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [userId]);

  const submitFeedback = async () => {
    try {
      await axios.post(`/feedback/${userId}`, { rating, comment }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setRating(5);
      setComment('');
      fetchFeedbacks();
    } catch (err) {
      alert('Submit failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Feedback & Ratings</h1>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Submit Feedback</h2>
        <div className="flex gap-2 items-center">
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r} ⭐</option>
            ))}
          </select>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comment"
            className="border p-2 w-64"
          />
          <button
            onClick={submitFeedback}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Submit
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Past Feedback</h2>
        {feedbacks.map((fb) => (
          <div key={fb._id} className="border rounded p-3 mt-2">
            <p><strong>Rating:</strong> {fb.rating} ⭐</p>
            <p><strong>Comment:</strong> {fb.comment || 'No comment'}</p>
            <p className="text-sm text-gray-500">{new Date(fb.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {feedbacks.length === 0 && <p className="text-gray-500">No feedback yet.</p>}
      </div>
    </div>
  );
}
