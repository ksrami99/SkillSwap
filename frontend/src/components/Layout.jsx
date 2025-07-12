import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-blue-700">Skill Swap Platform</Link>
          <Link to="/" className={`hover:underline ${location.pathname === '/' ? 'font-semibold' : ''}`}>Home</Link>
          <Link to="/requests" className={`hover:underline ${location.pathname.startsWith('/requests') ? 'font-semibold' : ''}`}>Swap request</Link>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button onClick={() => navigate('/profile')} className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </span>
              </button>
              <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
              <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
} 