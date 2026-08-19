import React from 'react';
import { Mountain, Users, Award, Shield, Heart, Globe, Sparkles, Compass } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '12,500+', label: 'Happy Trekkers' },
    { number: '15+', label: 'Years Experience' },
    { number: '60+', label: 'Alpine Routes' },
    { number: '100%', label: 'Safety Record' }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Lead Guide',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      description: 'With over 15 years of mountaineering experience, Sarah has led expeditions across 5 continents.'
    },
    {
      name: 'Michael Chen',
      role: 'Senior Mountain Guide',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      description: 'Certified mountain guide with expertise in high-altitude trekking and wilderness first aid.'
    },
    {
      name: 'Emma Wilson',
      role: 'Adventure Coordinator',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
      description: 'Passionate about sustainable tourism and creating unforgettable adventure experiences.'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Uncompromised Safety',
      description: 'Your safety is our relentless focus. Satellite tracking, oxygen, and emergency telemetry on every trip.'
    },
    {
      icon: Heart,
      title: 'Passion for Adventure',
      description: 'We live and breathe high-altitude wilderness, sharing secret spots and cultural immersion.'
    },
    {
      icon: Globe,
      title: 'Eco & Sustainable',
      description: 'Zero-trace leave policy and direct economic support to local Sherpa communities.'
    },
    {
      icon: Users,
      title: 'Master Expedition Leaders',
      description: 'Our lead guides possess certified UIAGM/IFMGA credentials and decades of summit success.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans pt-20">
      {/* Header Hero */}
      <div className="relative py-24 bg-slate-900 text-white border-b border-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter brightness-90"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Pioneering Alpine Expeditions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
            About <span className="text-emerald-400">Chal Oye</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-2xl max-w-3xl mx-auto leading-relaxed">
            Crafting premium, safe, and life-defining wilderness adventures since 2011.
          </p>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white border border-gray-200 shadow-xl">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center border-r border-gray-100 last:border-r-0">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">{s.number}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-3">Core Principles</div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            What Drives Our <span className="text-emerald-600">Mission</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, idx) => (
            <div key={idx} className="bg-white p-8 border border-gray-200 hover:border-emerald-600 hover:shadow-lg transition-all duration-300">
              <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit mb-6">
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{v.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-gray-50 border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-emerald-700 text-xs font-bold tracking-widest uppercase mb-3">Leadership</div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Meet Our Expedition <span className="text-emerald-600">Leaders</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((t, idx) => (
              <div key={idx} className="bg-white border border-gray-200 hover:border-emerald-600 hover:shadow-lg transition-all">
                <div className="h-72 overflow-hidden relative bg-gray-100">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{t.name}</h3>
                  <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4">{t.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-12 uppercase tracking-wider">Global Certifications & Affiliations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              'UIAGM / IFMGA Certified Guides',
              'Wilderness Medical Society Partner',
              'Leave No Trace Platinum Member',
              'High-Altitude Rescue Alliance'
            ].map((cert, index) => (
              <div key={index} className="p-6 bg-gray-50 border border-gray-200 flex flex-col items-center">
                <div className="p-3 bg-emerald-100 text-emerald-700 mb-3">
                  <Award className="h-6 w-6" />
                </div>
                <p className="text-slate-900 text-sm font-bold">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;