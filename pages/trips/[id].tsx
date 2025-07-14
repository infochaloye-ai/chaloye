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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-green-200 mb-4">
            <Link href="/trips" className="hover:text-white transition-colors">All Trips</Link>
            <span className="mx-2">/</span>
            <span>{trip.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{trip.name}</h1>
          <div className="flex items-center space-x-6 text-green-100">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{trip.location}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{trip.duration}</span>
            </div>
            <div className="flex items-center">
              <Mountain className="h-5 w-5 mr-2" />
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
            <div className="mb-8">
              <div className="mb-4">
                <img
                  src={images[selectedImage]}
                  alt={trip.name}
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${trip.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Trip Overview */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Trip Overview</h2>
              <p className="text-gray-600 mb-6">{trip.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{trip.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <span className="font-semibold">{trip.difficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Group Size:</span>
                      <span className="font-semibold">{trip.groupSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Altitude:</span>
                      <span className="font-semibold">{trip.altitude}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Best Time:</span>
                      <span className="font-semibold">{trip.bestTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
              <div className="space-y-6">
                {trip.itinerary.map((day, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{day.title}</h3>
                      <p className="text-gray-600">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
                <ul className="space-y-3">
                  {trip.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Not Included</h2>
                <ul className="space-y-3">
                  {trip.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <X className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">${trip.price}</div>
                <div className="text-gray-600">per person</div>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/book/${trip.id}`}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Now</span>
                </Link>
                
                <Link
                  href="/contact"
                  className="w-full border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Based on 150+ reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;