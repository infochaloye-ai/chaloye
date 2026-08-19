import React, { useRef, useEffect, useState } from 'react';
import { X, Search, MapPin, Clock, ArrowRight, Compass } from 'lucide-react';
import { useTrips } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const trips = useTrips();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState(trips);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const quickTags = ['Nepal', 'Himalayas', 'Moderate', 'Challenging', 'Everest'];

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveTag(null);
      setFiltered(trips);
      setTimeout(() => inputRef.current?.focus(), 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, trips, onClose]);

  useEffect(() => {
    let list = trips;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.difficulty.toLowerCase().includes(q)
      );
    }
    if (activeTag) {
      const tag = activeTag.toLowerCase();
      list = list.filter(t =>
        t.name.toLowerCase().includes(tag) ||
        t.location.toLowerCase().includes(tag) ||
        t.difficulty.toLowerCase().includes(tag)
      );
    }
    setFiltered(list);
  }, [query, activeTag, trips]);

  if (!open) return null;

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-white border-b-2 border-zinc-900 shadow-2xl animate-fadeIn text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Inline Top Bar */}
        <div className="flex items-center gap-4 border-b border-zinc-200 pb-4 mb-4">
          <Search className="w-6 h-6 text-emerald-700 shrink-0" />
          <input
            ref={inputRef}
            className="w-full bg-transparent text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-900 placeholder-zinc-400 focus:outline-none"
            placeholder="Search peak, region (e.g. Everest, Nepal)..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setActiveTag(null);
            }}
          />
          <button
            onClick={onClose}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0 transition-all"
          >
            <span>Close</span>
            <X className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Quick Filter Tags */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto text-xs font-black">
          <span className="text-zinc-400 uppercase tracking-widest text-[10px] shrink-0">Tags:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (activeTag === tag) {
                  setActiveTag(null);
                } else {
                  setActiveTag(tag);
                  setQuery('');
                }
              }}
              className={`px-3 py-1 border text-[11px] uppercase tracking-wider transition-all shrink-0 ${
                activeTag === tag
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results Grid */}
        <div className="max-h-[340px] overflow-y-auto pr-2">
          {filtered.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-300">
              <Compass className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
              <p className="text-zinc-900 font-black text-sm uppercase tracking-wider">No routes found</p>
              <p className="text-zinc-500 text-xs font-medium">Try another keyword or filter tag.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(trip => (
                <div
                  key={trip.id}
                  onClick={() => {
                    router.push(`/trips/${trip.id}`);
                    onClose();
                  }}
                  className="group p-3.5 bg-zinc-50 hover:bg-white border border-zinc-200 hover:border-zinc-900 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={trip.image}
                      alt={trip.name}
                      className="w-14 h-14 object-cover border border-zinc-300 group-hover:border-zinc-900 transition-colors"
                    />
                    <div>
                      <h4 className="font-black text-zinc-900 text-sm uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                        {trip.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                        <span>{trip.location}</span>
                        <span>&bull;</span>
                        <span>{trip.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-zinc-900 block">${trip.price}</span>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal; 