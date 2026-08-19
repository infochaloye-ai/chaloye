import React from 'react';
import Link from 'next/link';
import { Mountain, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-gray-400 border-t border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600 text-white font-black text-xs">
                CO
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Chal<span className="text-emerald-400">Oye</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              The premier high-altitude adventure company. Certified guides, luxury base camps, and uncompromised safety across the world's highest peaks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Navigation</h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link href="/trips" className="hover:text-emerald-400 transition-colors">All Expeditions</Link></li>
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Guide</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Basecamp Contact</h3>
            <div className="space-y-3 text-sm font-semibold">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>expeditions@chaloye.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>+1 (555) 890-TREK</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Boulder, CO & Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Follow The Trail</h3>
            <div className="flex space-x-3 mb-6">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-2.5 bg-gray-900 border border-gray-800 hover:border-emerald-500 hover:text-emerald-400 transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Certified by IFMGA / UIAGM International Mountain Guides Association.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
          <p>© {new Date().getFullYear()} Chal Oye Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Expedition</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Safety Telemetry</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;