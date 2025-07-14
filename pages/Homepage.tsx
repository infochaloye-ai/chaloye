import React from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Users, Shield, Award, MapPin, Clock, DollarSign } from 'lucide-react';
import { trips } from '../data/trips';

const Homepage = () => {
  const popularTrips = trips.slice(0, 6);
  
  const features = [
    {
      icon: Users,
      title: 'Experienced Guides',
      description: 'Professional guides with years of mountain experience'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Comprehensive safety protocols and emergency procedures'
    },
    {
      icon: Award,
      title: 'Certified Tours',
      description: 'All our tours are certified and meet international standards'
    },
    {
      icon: DollarSign,
      title: 'Affordable Prices',
      description: 'Best value for money with no hidden costs'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing experience! The guides were knowledgeable and the views were breathtaking.',
      trip: 'Everest Base Camp'
    },
    {
      name: 'Mike Chen',
      rating: 5,
      comment: 'Well organized trip with great attention to safety. Highly recommend!',
      trip: 'Annapurna Circuit'
    },
    {
      name: 'Emily Davis',
      rating: 5,
      comment: 'The team made this adventure unforgettable. Perfect for beginners too!',
      trip: 'Mont Blanc Circuit'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://videos.pexels.com/video-files/3577871/3577871-hd_1920_1080_25fps.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        {/* Content */}
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Explore the <span className="text-green-300">Himalayas</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Discover breathtaking trails and unforgettable adventures with expert guides
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/trips"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore Trips</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Trips Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Adventures</h2>
            <p className="text-xl text-gray-600">Discover our most loved trekking experiences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularTrips.map((trip) => (
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
                  <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
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
          
          <div className="text-center mt-12">
            <Link
              href="/trips"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>View All Trips</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Letmetrek?</h2>
            <p className="text-xl text-gray-600">We're committed to providing you with the best trekking experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <feature.icon className="h-8 w-8 text-green-600 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Adventurers Say</h2>
            <p className="text-xl text-gray-600">Real experiences from real people</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.trip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Adventure Gallery</h2>
            <p className="text-xl text-gray-600">Moments captured from our incredible journeys</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1',
              'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1',
              'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1',
              'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1',
              'https://images.pexels.com/photos/1252814/pexels-photo-1252814.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1',
              'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1',
              'https://images.pexels.com/photos/1647962/pexels-photo-1647962.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1',
              'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&dpr=1'
            ].map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;