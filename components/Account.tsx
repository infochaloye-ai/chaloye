import React, { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Edit3,
  Save,
  X,
  LogOut,
  Trash2,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';

const Account = () => {
  const { user, bookings, logout, updateProfile, cancelBooking, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);

    const success = await updateProfile(editData);
    if (success) {
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } else {
      setUpdateError('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setUpdateError('');
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your account</h1>
          <Link href="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-gray-600">Manage your profile and bookings</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {updateSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
                  Profile updated successfully!
                </div>
              )}

              {updateError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                  {updateError}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{user.email}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Member since</p>
                      <p className="font-semibold">{new Date(user.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
                  <Link
                    href="/trips"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Explore Trips
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {booking.tripName}
                          </h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{booking.tripLocation}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(booking.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-sm">Start Date</p>
                            <p className="font-semibold">{new Date(booking.startDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-sm">Participants</p>
                            <p className="font-semibold">{booking.participants} {booking.participants === 1 ? 'person' : 'people'}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <div>
                            <p className="text-sm">Total Price</p>
                            <p className="font-semibold">${booking.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Booked on {new Date(booking.bookingDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex space-x-3">
                          <Link
                            href={`/trips/${booking.tripId}`}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            View Trip
                          </Link>
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account; 