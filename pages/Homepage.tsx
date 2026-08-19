import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Shield, Award, MapPin, Clock, Compass, ChevronRight, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { trips } from '../data/trips';

const Homepage = () => {
  const popularTrips = trips.slice(0, 6);
  
  const stats = [
    { value: '12K+', label: 'Happy Trekkers', icon: Users },
    { value: '99.8%', label: 'Safety Record', icon: Shield },
    { value: '45+', label: 'Exotic Peaks', icon: Compass },
    { value: '15+', label: 'Years Experience', icon: Award },
  ];

  const features = [
    {
      icon: Users,
      title: 'Veteran Expedition Guides',
      description: 'Certified alpine professionals with decade+ high-altitude mastery.',
      badge: 'Certified'
    },
    {
      icon: Shield,
      title: 'Precision Safety Protocols',
      description: 'Satellite communication, real-time weather telemetry & medical kits.',
      badge: '24/7 Monitoring'
    },
    {
      icon: Award,
      title: 'Curated Eco Journeys',
      description: 'Zero-trace leave policy and handpicked boutique wilderness camps.',
      badge: 'Eco-Friendly'
    },
    {
      icon: TrendingUp,
      title: 'Transparent Pricing',
      description: 'No hidden permits or sudden charges. All-inclusive luxury treks.',
      badge: 'Guaranteed'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Alpine Photographer',
      rating: 5,
      comment: 'The Everest Base Camp trek redefined what I thought was possible. The guides made high altitude feel safe and magical.',
      trip: 'Everest Base Camp',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Mike Chen',
      role: 'Tech Executive',
      rating: 5,
      comment: 'Meticulous planning, luxury mountain lodges, and unmatched views of the Annapurna circuit. Unforgettable!',
      trip: 'Annapurna Circuit',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Emily Davis',
      role: 'Wilderness Enthusiast',
      rating: 5,
      comment: 'Mont Blanc with LetmeTrek was flawless. Top tier equipment, expert local insight, and breathtaking alpine passes.',
      trip: 'Mont Blanc Circuit',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  return (
    <div className="bg-[#f5f5f7] text-zinc-900 min-h-screen font-sans selection:bg-zinc-900 selection:text-white">
      {/* Hero Section - Video background preserved */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90 grayscale-20 contrast-110"
          src="https://videos.pexels.com/video-files/3577871/3577871-hd_1920_1080_25fps.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/75 z-10" />

        {/* Hero Content - Swiss Editorial Grid Style */}
        <div className="relative z-20 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 text-xs font-black uppercase tracking-widest mb-8 border border-white">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>SWISS ALPINE EXPEDITION SYSTEM</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white mb-8 leading-[0.95] uppercase">
            UNAMED <br />
            <span className="text-emerald-400 underline decoration-zinc-500 underline-offset-8">
              SUMMITS
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 font-medium leading-relaxed uppercase tracking-wider">
            Precision-guided mountain expeditions. Safety first, zero compromise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-0 border border-white/30 max-w-xl mx-auto">
            <Link
              href="/trips"
              className="w-full sm:w-1/2 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group border-r border-white/20"
            >
              <span>Explore Expeditions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-1/2 py-5 bg-white text-zinc-900 hover:bg-zinc-200 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <span>Our Manifesto</span>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Line Grid */}
      <section className="relative z-30 -mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white border border-zinc-300 shadow-sm">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 border-r border-b md:border-b-0 border-zinc-200 last:border-r-0 flex flex-col justify-between">
              <div className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tighter mb-2">{stat.value}</div>
              <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Expeditions Line Grid */}
      <section className="py-24 bg-[#f5f5f7] swiss-border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-zinc-300 pb-8">
            <div>
              <div className="text-emerald-700 text-xs font-black tracking-widest uppercase mb-2">
                CURATED EXPEDITIONS
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tighter uppercase">
                FEATURED <span className="text-emerald-700">ROUTES</span>
              </h2>
            </div>
            
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-zinc-900 hover:text-emerald-700 font-black transition-colors text-xs uppercase tracking-widest border-b-2 border-zinc-900 pb-1"
            >
              <span>View All Routes (50+)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTrips.map((trip) => (
              <div
                key={trip.id}
                className="swiss-card flex flex-col justify-between group"
              >
                {/* Image & Badge */}
                <div className="relative h-64 overflow-hidden border-b border-zinc-200 bg-zinc-100">
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <span className="absolute top-0 right-0 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white">
                    {trip.difficulty}
                  </span>

                  <div className="absolute bottom-0 left-0 bg-white border-t border-r border-zinc-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-900">
                    {trip.location}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-zinc-900 uppercase tracking-tight mb-3 group-hover:text-emerald-700 transition-colors">
                      {trip.name}
                    </h3>
                    <p className="text-zinc-600 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">
                      {trip.description}
                    </p>
                  </div>

                  <div>
                    <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
                      <div className="text-xs text-zinc-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{trip.duration}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[9px] uppercase font-black text-zinc-400 block tracking-widest">Rate</span>
                        <span className="text-2xl font-black text-zinc-900">${trip.price}</span>
                      </div>
                    </div>

                    <Link
                      href={`/trips/${trip.id}`}
                      className="mt-6 w-full py-4 bg-zinc-900 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2"
                    >
                      <span>Explore Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Swiss Alpine Principles Grid */}
      <section className="py-24 bg-white swiss-border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="text-emerald-700 text-xs font-black tracking-widest uppercase mb-2">
              THE SWISS STANDARD
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tighter uppercase mb-4">
              EXPEDITION <span className="text-emerald-700">MANIFESTO</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-zinc-300">
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-8 border-r border-b md:border-b-0 border-zinc-300 last:border-r-0 flex flex-col justify-between bg-white hover:bg-zinc-50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-3 bg-zinc-900 text-white">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-100 text-zinc-800 border border-zinc-300">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tight mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 text-xs font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Testimonials */}
      <section className="py-24 bg-[#f5f5f7] swiss-border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-emerald-700 text-xs font-black tracking-widest uppercase mb-2">
              SUMMIT VERIFIED
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tighter uppercase">
              FIELD <span className="text-emerald-700">REPORTS</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="swiss-card p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-6 text-amber-500">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-zinc-800 text-sm font-medium italic mb-8 leading-relaxed">
                    "{t.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-zinc-200">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 object-cover border border-zinc-900"
                  />
                  <div>
                    <h4 className="font-black text-zinc-900 text-sm uppercase tracking-wider">{t.name}</h4>
                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-widest">{t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter uppercase">
            READY TO CLAIM YOUR <span className="text-emerald-400">SUMMIT?</span>
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg max-w-xl mx-auto mb-10 uppercase tracking-wider font-medium">
            Book your next life-defining alpine route today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-0 max-w-md mx-auto border border-zinc-700">
            <Link
              href="/trips"
              className="w-full sm:w-1/2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all border-r border-zinc-700"
            >
              Book Expedition
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-1/2 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black text-xs uppercase tracking-widest transition-all"
            >
              Consult Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;