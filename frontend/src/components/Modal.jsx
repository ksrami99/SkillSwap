import React from 'react';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
} 