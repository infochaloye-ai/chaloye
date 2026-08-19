import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  MapPin, 
  Clock, 
  Users, 
  Mountain, 
  Calendar,
  Check,
  X,
  Star,
  ArrowRight
} from 'lucide-react';
import { trips } from '../../data/trips';

const TripDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const trip = trips.find(t => t.id === parseInt(id as string || '0'));
  const [selectedImage, setSelectedImage] = useState(0);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trip Not Found</h1>
          <p className="text-gray-600 mb-8">The trip you're looking for doesn't exist.</p>
          <Link href="/trips" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Back to All Trips
          </Link>
        </div>
      </div>
    );
  }

  const images = [
    trip.image,
    'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1',
    'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1'
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans pt-20">
      {/* Header Banner */}
      <div className="relative py-20 border-b border-gray-200 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 gap-2">
            <Link href="/trips" className="hover:underline">All Expeditions</Link>
            <span>/</span>
            <span className="text-gray-300">{trip.name}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">{trip.name}</h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-white">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>{trip.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>{trip.duration}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2">
              <Mountain className="h-4 w-4 text-emerald-400" />
              <span>{trip.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-12">
              <div className="mb-4 relative border border-gray-200 h-96 sm:h-[450px] bg-gray-100">
                <img
                  src={images[selectedImage]}
                  alt={trip.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative border h-20 transition-all ${
                      selectedImage === index ? 'border-emerald-600 border-2' : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${trip.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Overview */}
            <div className="bg-white p-8 mb-12 border border-gray-200">
              <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wider">Expedition Overview</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-8">{trip.description}</p>
              
              <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-widest mb-4">Vital Telemetry</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Max Elevation</span>
                  <span className="text-lg font-black text-slate-900">{trip.altitude}</span>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Group Size</span>
                  <span className="text-lg font-black text-slate-900">{trip.groupSize}</span>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Best Season</span>
                  <span className="text-lg font-black text-slate-900">{trip.bestTime}</span>
                </div>
              </div>
            </div>

            {/* Inclusions / Exclusions */}
            <div className="bg-white p-8 mb-12 border border-gray-200">
              <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wider">Inclusions & Logistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4" /> What's Included
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    {trip.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <X className="w-4 h-4" /> Exclusions
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    {trip.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 border border-gray-300 sticky top-28 shadow-lg">
              <div className="flex items-baseline justify-between mb-6 pb-6 border-b border-gray-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">All-Inclusive Expedition</span>
                  <span className="text-4xl font-black text-slate-900">${trip.price}</span>
                </div>
                <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 uppercase tracking-wider">
                  Guaranteed Slots
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                  <span>Duration</span>
                  <span className="font-bold text-slate-900">{trip.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                  <span>Difficulty</span>
                  <span className="font-bold text-emerald-700">{trip.difficulty}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
                  <span>Permits & Telemetry</span>
                  <span className="font-bold text-slate-900">Included</span>
                </div>
              </div>

              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 mb-4">
                <span>Book This Expedition</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/contact"
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-slate-900 font-bold text-xs uppercase tracking-wider border border-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <span>Inquire With Guide</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;