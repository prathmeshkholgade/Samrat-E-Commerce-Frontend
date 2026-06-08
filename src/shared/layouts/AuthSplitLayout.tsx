import React from 'react';
import { Shield, Star, Award, TrendingUp } from 'lucide-react';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row">
      {/* Left Column - Marketing & Dashboard Showcase (40-45%) */}
      <div className="hidden lg:flex lg:w-[42%] bg-white border-r border-slate-100 flex-col justify-between p-12 relative overflow-hidden select-none">
        {/* Subtle Decorative Accents */}
        <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-50/50 rounded-full blur-3xl -z-10" />
        
        {/* Top: Brand Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Samrat Enterprises
          </span>
        </div>

        {/* Center: Dynamic E-commerce Mockup & Marketing Info */}
        <div className="my-auto space-y-10 py-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Award size={12} />
              <span>Multi-Vendor B2B & B2C Platform</span>
            </div>
            
            <h1 className="text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Scale Your Retail Business <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                To Millions of Customers
              </span>
            </h1>
            
            <p className="text-sm xl:text-base text-slate-500 max-w-sm leading-relaxed font-medium">
              Access the digital tools, automated supply chain routes, and high-conversion storefront services optimized for maximum growth.
            </p>
          </div>

          {/* Interactive SaaS Dashboard Mockup */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Sales Analytics</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Store Overview</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                +28.4%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Revenue</span>
                <span className="text-base font-extrabold text-slate-800 block mt-1">₹4,89,200</span>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Orders</span>
                <span className="text-base font-extrabold text-slate-800 block mt-1">1,240</span>
              </div>
            </div>

            {/* Performance line simulation */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                <span>Monthly target fulfillment</span>
                <span>84%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>
          </div>

          {/* Social Proof & Trust Badges */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold flex items-center justify-center text-slate-700">A</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 text-[10px] font-bold flex items-center justify-center text-indigo-700">M</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 text-[10px] font-bold flex items-center justify-center text-purple-700">S</div>
              </div>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  Rated 4.9/5 by 12,000+ vendors in India.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Security & Copy */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-t border-slate-100 pt-6">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Shield size={14} className="text-indigo-600" />
            <span>Secure 256-bit SSL connection</span>
          </div>
          <span>© 2026 Samrat Inc.</span>
        </div>
      </div>

      {/* Right Column - Authentication Card panel (55-60%) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-xl py-8">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Samrat Enterprises
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthSplitLayout;
