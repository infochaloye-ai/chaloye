import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Search, Filter, Compass } from 'lucide-react';
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
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans pt-20">
      {/* Header Banner */}
      <div className="relative py-24 border-b border-gray-200 bg-slate-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter brightness-90"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Compass className="w-4 h-4" />
            <span>Curated Wilderness Expeditions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
            Explore All <span className="text-emerald-400">Adventures</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Handpicked treks across high alpine passes, remote valleys, and iconic mountain ranges.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Modern Filter Card */}
        <div className="bg-white p-6 mb-12 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg uppercase tracking-wider">
              <Filter className="h-5 w-5 text-emerald-600" />
              <span>Filter Expeditions</span>
            </div>

            {(searchTerm || selectedLocation || selectedDifficulty || selectedDuration) && (
              <button
                onClick={resetFilters}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold uppercase tracking-wider underline underline-offset-4"
              >
                Reset Filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by peak or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 focus:outline-none focus:border-emerald-600 text-slate-900 placeholder-gray-500 text-sm font-medium transition-all"
              />
            </div>
            
            {/* Location Select */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-300 focus:outline-none focus:border-emerald-600 text-slate-900 text-sm font-medium transition-all"
            >
              <option value="">All Regions</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            {/* Difficulty Select */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-300 focus:outline-none focus:border-emerald-600 text-slate-900 text-sm font-medium transition-all"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>

            {/* Duration Select */}
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 border border-gray-300 focus:outline-none focus:border-emerald-600 text-slate-900 text-sm font-medium transition-all"
            >
              <option value="">All Durations</option>
              {durations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-200">
            <Compass className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No expeditions found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search keywords.</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="group relative bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Badge */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Difficulty Tag */}
                  <span className="absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-slate-900 text-white">
                    {trip.difficulty}
                  </span>

                  {/* Location Tag */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white/95 px-3 py-1 border border-gray-200 shadow-sm">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{trip.location}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                      {trip.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {trip.description}
                    </p>
                  </div>

                  <div>
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 font-semibold">
                        <Clock className="w-4 h-4 text-emerald-600" />
                        <span>{trip.duration}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">Starting from</span>
                        <span className="text-2xl font-black text-slate-900">${trip.price}</span>
                      </div>
                    </div>

                    <Link
                      href={`/trips/${trip.id}`}
                      className="mt-6 w-full py-3.5 bg-gray-900 hover:bg-emerald-600 text-white font-bold uppercase tracking-wider text-xs transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <span>View Expedition</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTrips;