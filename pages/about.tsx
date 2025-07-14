import React from 'react';
import { Mountain, Users, Award, Shield, Heart, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '500+', label: 'Happy Adventurers' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Destinations' },
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
      title: 'Safety First',
      description: 'Your safety is our top priority. We follow strict safety protocols and maintain the highest standards.'
    },
    {
      icon: Heart,
      title: 'Passion for Adventure',
      description: 'We live and breathe adventure, sharing our passion for the mountains with every traveler.'
    },
    {
      icon: Globe,
      title: 'Sustainable Tourism',
      description: 'We are committed to responsible travel that respects local communities and environments.'
    },
    {
      icon: Users,
      title: 'Expert Guides',
      description: 'Our experienced guides are certified professionals with deep knowledge of local terrain.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative text-white" style={{ minHeight: '380px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-start justify-center min-h-[380px]">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Letmetrek</h1>
          <p className="text-xl text-green-100 max-w-3xl">
            We are passionate adventurers dedicated to creating unforgettable trekking experiences 
            while prioritizing safety, sustainability, and authentic connections with nature.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2008 by passionate mountaineer Sarah Johnson, Letmetrek began as a dream 
                  to share the transformative power of mountain adventures with fellow explorers. What 
                  started as weekend trips with friends has grown into a trusted adventure company.
                </p>
                <p>
                  Over the years, we've led thousands of adventurers to some of the world's most 
                  spectacular destinations. From the towering peaks of the Himalayas to the rugged 
                  trails of Patagonia, each journey is carefully crafted to provide not just adventure, 
                  but meaningful experiences that last a lifetime.
                </p>
                <p>
                  Our commitment to safety, sustainability, and authentic experiences has earned us 
                  the trust of adventurers worldwide. We believe that the mountains teach us about 
                  ourselves and our connection to nature, and we're honored to be part of that journey.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1"
                alt="Mountain adventure"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide every adventure we create</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <value.icon className="h-8 w-8 text-green-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The experienced guides who make your adventures possible</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Mountain className="h-16 w-16 text-green-200" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              To inspire and guide adventurers in discovering the world's most spectacular mountain 
              destinations while fostering a deep respect for nature, promoting sustainable tourism, 
              and creating transformative experiences that connect people with the natural world and 
              themselves.
            </p>
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Certifications & Affiliations</h2>
            <p className="text-xl text-gray-600">Our commitment to professional standards and safety</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'International Mountain Guiding Association',
              'American Alpine Club',
              'Leave No Trace Certified',
              'Wilderness First Aid Certified'
            ].map((cert, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600 mx-auto" />
                </div>
                <p className="text-gray-600 text-sm">{cert}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;