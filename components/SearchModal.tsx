import React, { useRef, useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import { useTrips } from '../context/AuthContext';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const trips = useTrips();
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(trips);

  useEffect(() => {
    let scrollY = 0;
    if (open) {
      setQuery('');
      setFiltered(trips);
      setTimeout(() => inputRef.current?.focus(), 100);
      scrollY = window.scrollY;
      document.body.classList.add('overflow-hidden');
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const y = document.body.style.top;
      document.body.classList.remove('overflow-hidden');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (y) window.scrollTo(0, parseInt(y || '0') * -1);
    }
    return () => {
      const y = document.body.style.top;
      document.body.classList.remove('overflow-hidden');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (y) window.scrollTo(0, parseInt(y || '0') * -1);
    };
  }, [open, trips]);

  useEffect(() => {
    if (!query) {
      setFiltered(trips);
    } else {
      setFiltered(
        trips.filter(trip =>
          trip.name.toLowerCase().includes(query.toLowerCase()) ||
          trip.location.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, trips]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl mx-auto rounded-2xl shadow-2xl bg-white/80 backdrop-blur-lg border border-white/60 p-0 overflow-hidden animate-modalIn">
        {/* Close Button */}
        <button
          aria-label="Close search"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/70 hover:bg-gray-100 border border-gray-200 rounded-full p-2 shadow-sm transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">Search Trips</h2>
          <p className="text-gray-500 text-sm">Find your next adventure by name or location</p>
        </div>
        {/* Search Input */}
        <div className="px-8 pb-4">
          <div className="relative">
            <input
              ref={inputRef}
              className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-200 bg-white/70 backdrop-blur focus:ring-2 focus:ring-green-200 focus:border-green-400 text-lg transition placeholder-gray-400"
              placeholder="Search trips, destinations..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        {/* Results */}
        <div className="max-h-80 overflow-y-auto px-8 pb-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No trips found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filtered.map(trip => (
                <li key={trip.id} className="flex items-center py-5 gap-4 cursor-pointer hover:bg-green-50 rounded-xl px-2 transition" onClick={() => { window.location.href = `/trips/${trip.id}`; onClose(); }}>
                  <img src={trip.image} alt={trip.name} className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-base line-clamp-1">{trip.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{trip.location} &bull; {trip.duration}</div>
                  </div>
                  <div className="text-green-600 font-bold text-lg">${trip.price}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 