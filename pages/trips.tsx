import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { trips } from '../data/trips';

const AllTrips = () => {
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');

  const locations = [...new Set(trips.map(trip => trip.location))];
  const difficulties = [...new Set(trips.map(trip => trip.difficulty))];
  const durations = [...new Set(trips.map(trip => trip.duration))];

  const handleFilter = () => {
    let filtered = trips;

    if (searchTerm) {
      filtered = filtered.filter(trip => 
        trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(trip => trip.location === selectedLocation);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(trip => trip.difficulty === selectedDifficulty);
    }

    if (selectedDuration) {
      filtered = filtered.filter(trip => trip.duration === selectedDuration);
    }

    setFilteredTrips(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedDifficulty('');
    setSelectedDuration('');
    setFilteredTrips(trips);
  };

  React.useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedLocation, selectedDifficulty, selectedDuration]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative text-white mt-8 md:mt-16" style={{ minHeight: '380px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center md:items-start md:text-left justify-center min-h-[380px]">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Adventures</h1>
          <p className="text-xl text-green-100">
            Discover all our incredible trekking and hiking experiences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-green-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Trips</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
            
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white text-gray-900"
            >
              <option value="">All Durations</option>
              {durations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
            
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-8">
          <p className="text-gray-600">
            Showing {filteredTrips.length} of {trips.length} trips
          </p>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-600">
                  {trip.difficulty}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{trip.location}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{trip.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{trip.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{trip.duration}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">${trip.price}</div>
                </div>
                <Link
                  href={`/trips/${trip.id}`}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to find more trips.</p>
            <button
              onClick={resetFilters}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTrips;