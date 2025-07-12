import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    skillsOffered: [],
    skillsWanted: [],
    availability: '',
    location: '',
    isPublic: true,
    name: '',
    profilePhoto: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [originalForm, setOriginalForm] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileInputRef = useRef();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || '',
        location: user.location || '',
        isPublic: user.isPublic,
        name: user.name || '',
        profilePhoto: user.profilePhoto || '',
      });
      setPhotoPreview(user.profilePhoto || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'skillsOffered' || name === 'skillsWanted') {
      setForm({ ...form, [name]: value.split(',').map((s) => s.trim()) });
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    // Optionally, upload to server here and set form.profilePhoto to the URL
    // For now, just preview
  };

  const handleEdit = () => {
    setOriginalForm(form);
    setEditMode(true);
  };

  const handleDiscard = () => {
    setForm(originalForm);
    setPhotoPreview(originalForm.profilePhoto || '');
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await axios.put('/users/me', form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setEditMode(false);
      alert('Profile updated!');
    } catch (err) {
      setError('Update failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <div className="flex gap-6 items-center mb-4">
        <div className="relative">
          <span className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              form.name ? form.name[0].toUpperCase() : 'U'
            )}
          </span>
          {editMode && (
            <>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded"
              >
                Change
              </button>
            </>
          )}
        </div>
        <div>
          <div className="text-xl font-semibold mb-1">
            {editMode ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-1 rounded w-48"
              />
            ) : (
              form.name
            )}
          </div>
          <div className="text-gray-600">
            {editMode ? (
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="border p-1 rounded w-48"
                placeholder="Location"
              />
            ) : (
              form.location || 'No location'
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="font-medium mb-1">Skills Offered</div>
          {editMode ? (
            <input
              name="skillsOffered"
              value={form.skillsOffered.join(', ')}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="e.g. Guitar, Cooking"
            />
          ) : (
            <div className="text-gray-700">{form.skillsOffered.join(', ') || 'None'}</div>
          )}
        </div>
        <div>
          <div className="font-medium mb-1">Skills Wanted</div>
          {editMode ? (
            <input
              name="skillsWanted"
              value={form.skillsWanted.join(', ')}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="e.g. French, Coding"
            />
          ) : (
            <div className="text-gray-700">{form.skillsWanted.join(', ') || 'None'}</div>
          )}
        </div>
        <div>
          <div className="font-medium mb-1">Availability</div>
          {editMode ? (
            <input
              name="availability"
              value={form.availability}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              placeholder="e.g. weekends"
            />
          ) : (
            <div className="text-gray-700">{form.availability || 'N/A'}</div>
          )}
        </div>
        <div>
          <div className="font-medium mb-1">Profile</div>
          {editMode ? (
            <select
              name="isPublic"
              value={form.isPublic ? 'public' : 'private'}
              onChange={e => setForm({ ...form, isPublic: e.target.value === 'public' })}
              className="border p-2 w-full rounded"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          ) : (
            <div className="text-gray-700">{form.isPublic ? 'Public' : 'Private'}</div>
          )}
        </div>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex gap-4 mt-6">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center"
              disabled={saving}
            >
              {saving && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2"></span>}
              Save
            </button>
            <button
              onClick={handleDiscard}
              className="bg-gray-400 text-white px-4 py-2 rounded"
              disabled={saving}
            >
              Discard
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
