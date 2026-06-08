import React, { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // API Integration Hook: POST /api/newsletter/subscribe
      setSubscribed(true);
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-16 pb-8 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-550 to-violet-550 flex items-center justify-center text-white font-black text-xl">
                S
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                Samrat
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Samrat is a next-generation multi-vendor marketplace connecting thousands of independent, trusted merchants with millions of customers nationwide. Discover verified products at the best rates.
            </p>
            {/* Contact Details */}
            <div className="space-y-3.5 pt-2 text-sm text-slate-600 dark:text-slate-350">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>123 Samrat Towers, Tech Sector 4, Bangalore, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>+91 80 1234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>support@samratplatform.com</span>
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">Shop</h3>
            <ul className="space-y-3.5 text-sm">
              <li><a href="#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Electronics</a></li>
              <li><a href="#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Fashion Apparel</a></li>
              <li><a href="#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home & Kitchen</a></li>
              <li><a href="#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Grocery Goods</a></li>
              <li><a href="#categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sports Accessories</a></li>
            </ul>
          </div>

          {/* Sell Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5">For Sellers</h3>
            <ul className="space-y-3.5 text-sm">
              <li><a href="#become-seller" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Become a Seller</a></li>
              <li><a href="#become-seller" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Seller Dashboard</a></li>
              <li><a href="#become-seller" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Success Stories</a></li>
              <li><a href="#become-seller" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Merchant Policy</a></li>
              <li><a href="#become-seller" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Shipping Calculator</a></li>
            </ul>
          </div>

          {/* Newsletter / Legal Links */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Join Newsletter</h3>
            {subscribed ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-450 font-medium">
                Thank you! You have successfully subscribed to our weekly newsletter alerts.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-405 leading-normal mb-1">
                  Get updates on weekly deals, new vendors, and platform features.
                </p>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-white text-slate-905 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm border border-slate-200 focus:outline-none focus:border-indigo-500 pr-10 dark:bg-slate-800 dark:text-white dark:border-slate-700"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-2 top-1.5 p-1 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer dark:text-indigo-400 dark:hover:text-white"
                  >
                    <Mail size={18} />
                  </button>
                </div>
              </form>
            )}
            
            {/* Social Buttons */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Connect With Us</h4>
              <div className="flex gap-3">
                <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center transition-colors text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-indigo-500 dark:text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center transition-colors text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-indigo-500 dark:text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center transition-colors text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-indigo-500 dark:text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-white border border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center transition-colors text-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-indigo-500 dark:text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Legal Frame */}
        <div className="border-t border-slate-200 pt-8 mt-12 flex flex-col md:flex-row items-center justify-between text-xs text-slate-550 dark:border-slate-800">
          <p>© {currentYear} Samrat Multi-Vendor Platform. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:underline hover:text-slate-700 dark:hover:text-slate-400">Terms of Use</a>
            <a href="#" className="hover:underline hover:text-slate-700 dark:hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:underline hover:text-slate-700 dark:hover:text-slate-400">Refund Policy</a>
            <a href="#" className="hover:underline hover:text-slate-700 dark:hover:text-slate-400">Merchant Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
