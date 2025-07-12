import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Calendar,
  MapPin,
  Clock,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    completedSwaps: 0,
    averageRating: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, requestsRes] = await Promise.all([
        axios.get('/dashboard/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        }),
        axios.get('/dashboard/recent-requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        })
      ]);
      
      setStats(statsRes.data.data || stats);
      setRecentRequests(requestsRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests,
      icon: MessageSquare,
      color: 'blue',
      description: 'All time requests'
    },
    {
      title: 'Pending',
      value: stats.pendingRequests,
      icon: Clock,
      color: 'yellow',
      description: 'Awaiting response'
    },
    {
      title: 'Completed',
      value: stats.completedSwaps,
      icon: Star,
      color: 'green',
      description: 'Successful swaps'
    },
    {
      title: 'Rating',
      value: stats.averageRating.toFixed(1),
      icon: TrendingUp,
      color: 'purple',
      description: 'Average rating'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your skill swaps
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[stat.color]} bg-opacity-10`}>
                  <Icon className={`h-6 w-6 ${colorClasses[stat.color].replace('bg-', 'text-')}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <Edit className="h-5 w-5 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Edit Profile</p>
              <p className="text-sm text-gray-600">Update your skills and info</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/requests')}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View Requests</p>
              <p className="text-sm text-gray-600">Check your swap requests</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <Users className="h-5 w-5 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Find Users</p>
              <p className="text-sm text-gray-600">Discover new connections</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <button
            onClick={() => navigate('/requests')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all
          </button>
        </div>
        
        {recentRequests.length > 0 ? (
          <div className="space-y-4">
            {recentRequests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                    {request.fromUser?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {request.fromUser?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {request.offeredSkill} ↔ {request.requestedSkill}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : request.status === 'accepted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status}
                  </span>
                  <button
                    onClick={() => navigate(`/requests/${request._id}`)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">
              Start by browsing users and making requests
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
} 