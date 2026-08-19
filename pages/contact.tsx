import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Sparkles } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans pt-20">
      {/* Header Banner */}
      <div className="relative py-24 bg-slate-900 text-white border-b border-gray-200">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 filter brightness-90"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/840667/pexels-photo-840667.jpeg)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4" />
            <span>24/7 Expedition Concierge</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
            Get in <span className="text-emerald-400">Touch</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Have questions about permits, routes, or custom private expeditions? Our team is ready.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Cards */}
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-wider">Direct Channels</h2>
            
            <div className="space-y-6 mb-12">
              <div className="bg-white p-6 border border-gray-200 hover:border-emerald-600 flex items-start gap-4 transition-all">
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Email Us</h3>
                  <p className="text-gray-600 text-sm">expeditions@chaloye.com</p>
                  <p className="text-gray-600 text-sm">concierge@chaloye.com</p>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200 hover:border-emerald-600 flex items-start gap-4 transition-all">
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Call / WhatsApp</h3>
                  <p className="text-gray-600 text-sm">+1 (555) 890-TREK (8735)</p>
                  <p className="text-gray-600 text-sm">Emergency Radio: Channel 144.800 MHz</p>
                </div>
              </div>

              <div className="bg-white p-6 border border-gray-200 hover:border-emerald-600 flex items-start gap-4 transition-all">
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Basecamp HQ</h3>
                  <p className="text-gray-600 text-sm">124 Alpine Crest Way, Boulder, CO 80302</p>
                  <p className="text-gray-600 text-sm">Kathmandu Operational Hub, Thamel 44600</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 border border-gray-200 shadow-sm relative">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 uppercase tracking-wider">Send an Expedition Inquiry</h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-300 text-emerald-800 text-center py-12">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-emerald-600 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-sm text-gray-700">Our expedition leader will contact you within 4 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-slate-900 placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-600 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-slate-900 placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-600 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 font-medium transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="booking">Expedition Booking</option>
                    <option value="private">Custom Private Trek</option>
                    <option value="gear">Gear & Preparation</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Your Message</label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your trip goals, preferred dates, or group size..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-slate-900 placeholder-gray-400 text-sm focus:outline-none focus:border-emerald-600 font-medium transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 pt-16 border-t border-gray-200">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-wider">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm font-medium">Quick answers regarding bookings, permits & safety</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">How do I reserve an expedition spot?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Choose your expedition, select preferred dates, and complete the instant deposit checkout. Our expedition team will issue your gear checklist and permit confirmation within 24 hours.
              </p>
            </div>
            
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Are alpine permits included?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Yes, all national park entry fees, restricted area conservation permits, and TIMS cards are fully handled by us with zero extra surprise fees.
              </p>
            </div>
            
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">What safety equipment is provided?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We supply high-altitude hyperbaric chambers (PAG bags), pulse oximeters, satellite SOS devices, comprehensive medical kits, and luxury 4-season geodesic tents.
              </p>
            </div>
            
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Can I request a custom private itinerary?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Absolutely. We specialize in tailored private alpine expeditions for individuals, families, photography teams, and corporate groups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;