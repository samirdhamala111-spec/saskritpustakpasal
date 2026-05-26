import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Send, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg text-white shadow-md">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Stationery<span className="text-white font-black">Hub</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              StationeryHub is the ultimate destination for premium notebooks, luxury writing pens, markers, files, school packs, and high-fidelity art supplies. Crafted to inspire creativity and elevate productivity.
            </p>
            <span className="text-[10px] text-slate-500">© 2026 StationeryHub Ltd. All Rights Reserved.</span>
          </div>

          {/* Categories Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product Categories</h4>
            <div className="flex flex-col gap-2 text-xs">
              <Link to="/products?category=Notebooks" className="hover:text-purple-400 transition-colors">Premium Notebooks</Link>
              <Link to="/products?category=Pens" className="hover:text-purple-400 transition-colors">Gel & Fountain Pens</Link>
              <Link to="/products?category=Markers" className="hover:text-purple-400 transition-colors">Lettering Markers</Link>
              <Link to="/products?category=Art Supplies" className="hover:text-purple-400 transition-colors">watercolor & Paint Sets</Link>
              <Link to="/products?category=School Bags" className="hover:text-purple-400 transition-colors">Ergonomic School Bags</Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company Information</h4>
            <div className="flex flex-col gap-2 text-xs">
              <Link to="/about" className="hover:text-purple-400 transition-colors">About Our Story</Link>
              <Link to="/contact" className="hover:text-purple-400 transition-colors">Contact Support</Link>
              <span className="hover:text-purple-400 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-purple-400 cursor-pointer transition-colors">Privacy Guarantee</span>
              <span className="hover:text-purple-400 cursor-pointer transition-colors">Shipping & Refund Policy</span>
            </div>
          </div>

          {/* Newsletter / Contact Info */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay Inspired</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to unlock early-access deals, promotional codes, and custom design tips.
            </p>

            <form onSubmit={handleSubscribe} className="flex items-center relative mt-2">
              <input
                type="email"
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-3 pr-10 py-2 rounded-lg text-xs bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="absolute right-2.5 p-1 rounded-md bg-gradient-to-tr from-blue-500 to-purple-600 text-white hover:opacity-95"
                aria-label="Subscribe"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>

            {subscribed && (
              <span className="text-[10px] text-emerald-400 animate-pulse-subtle">
                Thanks! Check your inbox for your 15% discount code!
              </span>
            )}

            <div className="flex flex-col gap-1.5 mt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span>support@stationeryhub.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                <span>+977 1-4400000</span>
              </div>
            </div>
          </div>

        </div>

        <hr className="border-slate-800 my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <span>StationeryHub E-Commerce Store</span>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
            <span>using the MERN Stack. Ready for production.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
