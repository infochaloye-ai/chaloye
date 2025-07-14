import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calendar, Users, CreditCard, ArrowLeft, Check } from 'lucide-react';
import { trips } from '../data/trips';
import { getCurrentUser } from './AuthPanel';

const BookingForm = () => {
  const router = useRouter();
  useEffect(() => {
    if (!getCurrentUser()) {
      router.replace('/login');
    }
  }, []);
  const { id } = router.query;
  const trip = trips.find(t => t.id === parseInt(id as string || '0'));
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    startDate: '',
    participants: 1,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    dietaryRequirements: '',
    medicalConditions: '',
    experience: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolder: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Handle final submission
      console.log('Booking submitted:', formData);
      alert('Booking confirmed! You will receive a confirmation email shortly.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Trip Not Found</h1>
          <Link href="/trips" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Back to All Trips
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = trip.price * formData.participants;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/trips/${trip.id}`} className="flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trip Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book Your Adventure</h1>
          <p className="text-gray-600 mt-2">{trip.name} - {trip.location}</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { number: 1, title: 'Trip Details', icon: Calendar },
              { number: 2, title: 'Personal Info', icon: Users },
              { number: 3, title: 'Payment', icon: CreditCard }
            ].map((stepItem, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= stepItem.number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepItem.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <stepItem.icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= stepItem.number ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {stepItem.title}
                </span>
                {index < 2 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step > stepItem.number ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Dates</h2>
                  
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Participants *
                    </label>
                    <select
                      id="participants"
                      name="participants"
                      value={formData.participants}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Trekking Experience Level *
                    </label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Name *
                      </label>
                      <input
                        type="text"
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Phone *
                      </label>
                      <input
                        type="tel"
                        id="emergencyPhone"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dietaryRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                      Dietary Requirements
                    </label>
                    <textarea
                      id="dietaryRequirements"
                      name="dietaryRequirements"
                      value={formData.dietaryRequirements}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Any food allergies, vegetarian preferences, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700 mb-2">
                      Medical Conditions
                    </label>
                    <textarea
                      id="medicalConditions"
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Any medical conditions we should be aware of"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                  
                  <div>
                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> This is a demo booking form. No real payment will be processed.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors ml-auto"
                >
                  {step === 3 ? 'Complete Booking' : 'Next Step'}
                </button>
              </div>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trip</span>
                  <span className="font-semibold">{trip.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">{trip.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{trip.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-semibold">{formData.participants}</span>
                </div>
                {formData.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-semibold">{formData.startDate}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per person</span>
                    <span className="font-semibold">${trip.price}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;