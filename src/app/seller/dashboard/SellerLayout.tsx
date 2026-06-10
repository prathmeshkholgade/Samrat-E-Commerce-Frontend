import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Box,
  Users,
  MessageSquare,
  Tag,
  Wallet,
  BarChart2,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Search,
  Mail,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { logout } from '../../../store/slices/authSlice';

export const SellerLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const auth = useAppSelector(state => state.auth);

  // States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Navigation Links definition
  const menuItems = [
    { label: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Products', path: '/seller/products', icon: <ShoppingBag size={18} /> },
    { label: 'Orders', path: '/seller/orders', icon: <ShoppingBag size={18} /> },
    { label: 'Inventory', path: '/seller/inventory', icon: <Box size={18} /> },
    { label: 'Customers', path: '/seller/customers', icon: <Users size={18} /> },
    { label: 'Reviews', path: '/seller/reviews', icon: <MessageSquare size={18} /> },
    { label: 'Coupons', path: '/seller/coupons', icon: <Tag size={18} /> },
    { label: 'Wallet & Earnings', path: '/seller/wallet', icon: <Wallet size={18} /> },
    { label: 'Analytics', path: '#', icon: <BarChart2 size={18} /> },
    { label: 'Notifications', path: '#', icon: <Bell size={18} /> },
    { label: 'Store Settings', path: '#', icon: <Settings size={18} /> },
    { label: 'Support', path: '#', icon: <HelpCircle size={18} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans">
      
      {/* ======================================================== */}
      {/* 1. DESKTOP SIDEBAR PANEL                                  */}
      {/* ======================================================== */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-slate-150/50 transition-all duration-300 sticky top-0 h-screen z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        
        {/* Brand Header */}
        <div className="h-20 border-b border-slate-100/80 px-6 flex items-center gap-3 justify-between">
          <Link to="/seller/dashboard" className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-650 to-indigo-650 flex items-center justify-center text-white shadow-lg shadow-indigo-100 font-black text-lg">
              S
            </div>
            {!isSidebarCollapsed && (
              <span className="text-base font-black text-slate-900 tracking-tight transition-all duration-300">
                SAMRAT <span className="text-purple-600">SELLER</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow py-5 px-3.5 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={(e) => {
                  if (item.path === '#') {
                    e.preventDefault();
                    alert(`"${item.label}" sub-module page is simulated. Currently only the Dashboard Home is active.`);
                  }
                }}
                className={`flex items-center gap-3.5 px-3.5 py-3 text-xs font-bold rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-50 border border-indigo-100/50 text-indigo-650' 
                    : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className={`transition-colors ${isActive ? 'text-indigo-650' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && (
                  <span className="truncate leading-none">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Collapse toggle & Logout) */}
        <div className="p-3.5 border-t border-slate-100 space-y-1.5">
          
          {/* Collapse sidebar button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full hidden md:flex items-center justify-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs font-bold transition-all cursor-pointer border border-slate-200/40"
          >
            {isSidebarCollapsed ? '▶' : '◀ Collapse Sidebar'}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={18} />
            {!isSidebarCollapsed && <span className="leading-none">Log Out</span>}
          </button>

        </div>

      </aside>

      {/* ======================================================== */}
      {/* 2. MOBILE RESPONSIVE DRAWER OVERLAY                      */}
      {/* ======================================================== */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" 
          />
          {/* Sidebar Panel */}
          <aside className="relative flex flex-col w-64 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 z-10">
            
            {/* Brand Header */}
            <div className="h-20 border-b border-slate-100/80 px-6 flex items-center justify-between">
              <Link to="/seller/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white font-black text-sm">
                  S
                </div>
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  SAMRAT SELLER
                </span>
              </Link>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-grow py-5 px-3.5 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={(e) => {
                      setIsMobileOpen(false);
                      if (item.path === '#') {
                        e.preventDefault();
                        alert(`"${item.label}" sub-module page is simulated.`);
                      }
                    }}
                    className={`flex items-center gap-3.5 px-3.5 py-3 text-xs font-bold rounded-xl transition-all ${
                      isActive 
                        ? 'bg-indigo-50 border border-indigo-100/50 text-indigo-650' 
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Footer Logout */}
            <div className="p-3.5 border-t border-slate-100">
              <button
                onClick={() => { setIsMobileOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>

          </aside>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE WINDOW                                 */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-150/50 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative z-20">
          
          {/* Left search & hamburger */}
          <div className="flex items-center gap-4 flex-grow max-w-lg">
            
            {/* Hamburger (Mobile) */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 md:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-50 border rounded-xl cursor-pointer"
            >
              <Menu size={20} />
            </button>

            {/* Search Input bar */}
            <form onSubmit={(e) => e.preventDefault()} className="hidden sm:flex flex-grow items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/50 hover:border-slate-300/60 rounded-xl px-3.5 py-2 transition-all gap-2.5">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orders, invoices, stock status alerts..."
                className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              />
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            
            {/* Store Status Badge */}
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-wider select-none shadow-3xs">
              <CheckCircle2 size={12} className="fill-emerald-100" />
              <span>Approved & Active</span>
            </span>

            {/* Messages Quick view link */}
            <button 
              onClick={() => alert('Quick Message thread - coming soon.')}
              className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-500 hover:text-indigo-650 transition-all cursor-pointer relative"
              title="Messages"
            >
              <Mail size={18} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white" />
            </button>

            {/* Notification drop */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-500 hover:text-indigo-650 transition-all cursor-pointer relative"
                title="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-600 border border-white" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white border border-slate-100 shadow-2xl py-3 z-50 text-left animate-in fade-in slide-in-from-top-3">
                  <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Alert Center</span>
                    <button 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[9px] font-black text-indigo-600 hover:underline"
                    >
                      Dismiss all
                    </button>
                  </div>
                  <div className="py-1 max-h-[200px] overflow-y-auto divide-y divide-slate-50">
                    <div className="px-4 py-2.5 text-xs font-semibold text-slate-650 hover:bg-slate-50/50">
                      <p className="text-slate-800 font-extrabold leading-normal">Low Stock Alert</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Premium Wireless Headphones (Grey) is running low (3 remaining).</p>
                    </div>
                    <div className="px-4 py-2.5 text-xs font-semibold text-slate-650 hover:bg-slate-50/50">
                      <p className="text-slate-800 font-extrabold leading-normal">New Order Received</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Order ORD-8942A placed by Rohan Sharma ($145.00).</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Profile drop */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all pr-2"
              >
                <div className="w-8.5 h-8.5 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-extrabold text-xs uppercase shadow-3xs">
                  {auth.user?.fullName.charAt(0) || 'S'}
                </div>
                <span className="hidden sm:inline text-xs font-extrabold text-slate-800">
                  {auth.user?.fullName || 'Samrat Seller'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-white border border-slate-100 shadow-2xl py-1.5 z-50 divide-y divide-slate-50 text-left animate-in fade-in slide-in-from-top-3">
                  <div className="px-4 py-2.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Seller Store</span>
                    <span className="text-xs font-black text-slate-805 truncate block mt-0.5">Samrat Enterprises</span>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setIsProfileOpen(false); alert('Seller Business profile details.'); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 transition-colors"
                    >
                      Store Profile
                    </button>
                    <button 
                      onClick={() => { setIsProfileOpen(false); alert('Store settings panel.'); }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 transition-colors"
                    >
                      Account Settings
                    </button>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-650 hover:bg-rose-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={13} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* WORKSPACE AREA CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};

export default SellerLayout;
