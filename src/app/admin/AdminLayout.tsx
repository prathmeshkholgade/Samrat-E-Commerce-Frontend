import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/slices/authSlice';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const auth = useAppSelector(state => state.auth);
  const { pendingSellers, pendingProducts } = useAppSelector(state => state.admin);

  // Layout UI states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Sellers', path: '/admin/sellers', icon: <ShieldCheck size={18} /> },
    { label: 'Products', path: '/admin/products', icon: <ShoppingBag size={18} /> },
    { label: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={18} /> },
    { label: 'Customers', path: '/admin/customers', icon: <Users size={18} /> },
    { label: 'Categories', path: '/admin/categories', icon: <FolderOpen size={18} /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={18} /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const currentPath = location.pathname;
  const unreadCount = (pendingSellers > 0 ? 1 : 0) + (pendingProducts > 0 ? 1 : 0);

  return (
    <div className="min-h-screen flex bg-slate-55/40 text-slate-800 font-sans">
      
      {/* ======================================================== */}
      {/* 1. DESKTOP SIDEBAR PANEL                                  */}
      {/* ======================================================== */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-slate-150/60 transition-all duration-300 sticky top-0 h-screen z-30 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo Brand */}
        <div className="h-20 border-b border-slate-100 px-6 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-650 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-100 font-black text-lg">
              A
            </div>
            {!isSidebarCollapsed && (
              <span className="text-base font-black text-slate-900 tracking-tight">
                SAMRAT <span className="text-indigo-650 font-black">ADMIN</span>
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-grow py-6 px-3.5 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-3 text-xs font-black rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-50/70 border border-indigo-100/30 text-indigo-755' 
                    : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-905 hover:bg-slate-50'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <div className={`transition-colors ${isActive ? 'text-indigo-655' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && (
                  <span className="truncate leading-none">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-100 space-y-1.5">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full hidden md:flex items-center justify-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-[10px] font-black transition-all cursor-pointer border border-slate-200/40"
          >
            {isSidebarCollapsed ? '▶' : '◀ Collapse'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
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
          <div 
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs" 
          />
          <aside className="relative flex flex-col w-64 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-300 z-10 text-left">
            <div className="h-20 border-b border-slate-100 px-6 flex items-center justify-between">
              <Link to="/admin/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white font-black text-sm">
                  A
                </div>
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  SAMRAT ADMIN
                </span>
              </Link>
              <button 
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-850"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-grow py-5 px-3.5 space-y-1.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3.5 px-3.5 py-3 text-xs font-black rounded-xl transition-all ${
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

            <div className="p-3.5 border-t border-slate-100">
              <button
                onClick={() => { setIsMobileOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3.5 px-3.5 py-3 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MAIN WORKSPACE CONTENT WINDOW                          */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        
        {/* Top Header navbar */}
        <header className="h-20 bg-white border-b border-slate-150/40 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative z-20">
          
          <div className="flex items-center gap-4 flex-grow max-w-lg">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-2 md:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-50 border rounded-xl cursor-pointer"
            >
              <Menu size={20} />
            </button>

            <form onSubmit={(e) => e.preventDefault()} className="hidden sm:flex flex-grow items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3.5 py-2 transition-all gap-2.5">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search sellers, audit catalogs, revenue charts, user ledgers..."
                className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            
            {/* System Status Label */}
            <span className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-full text-[9px] font-black text-indigo-700 uppercase tracking-wider select-none">
              <ShieldCheck size={11} />
              <span>Platform Manager</span>
            </span>

            {/* Alert Center notifications bell */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-500 hover:text-indigo-650 transition-all cursor-pointer relative"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-black flex items-center justify-center border border-white px-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white border border-slate-100 shadow-2xl py-3 z-50 text-left animate-in fade-in slide-in-from-top-3">
                  <div className="px-4 pb-2.5 border-b border-slate-100">
                    <span className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Manager Alerts</span>
                  </div>
                  <div className="py-1 max-h-[220px] overflow-y-auto divide-y divide-slate-50 text-xs text-slate-650">
                    {unreadCount === 0 ? (
                      <div className="px-4 py-8 text-center font-bold text-slate-400">
                        No pending administrative alerts.
                      </div>
                    ) : (
                      <>
                        {pendingSellers > 0 && (
                          <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                            <p className="font-extrabold text-slate-800">Pending Seller Approvals</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">There are {pendingSellers} merchants waiting validation onboarding.</p>
                          </div>
                        )}
                        {pendingProducts > 0 && (
                          <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                            <p className="font-extrabold text-slate-800">Pending Catalog Audits</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">There are {pendingProducts} products awaiting approval moderation.</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200" />

            {/* Profile configuration */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all pr-2"
              >
                <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-650 font-black text-xs uppercase shadow-3xs">
                  {auth.user?.fullName.charAt(0) || 'A'}
                </div>
                <span className="hidden sm:inline text-xs font-black text-slate-850">
                  {auth.user?.fullName || 'Platform Administrator'}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-white border border-slate-100 shadow-2xl py-1.5 z-50 divide-y divide-slate-50 text-left animate-in fade-in slide-in-from-top-3">
                  <div className="px-4 py-2.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Admin Access</span>
                    <span className="text-xs font-black text-slate-805 truncate block mt-0.5">Manager Portal</span>
                  </div>
                  <div className="py-1 text-xs text-slate-700 font-semibold">
                    <button 
                      onClick={() => { setIsProfileOpen(false); navigate('/admin/dashboard'); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-indigo-650 transition-colors"
                    >
                      Console Overview
                    </button>
                    <button 
                      onClick={() => { setIsProfileOpen(false); navigate('/admin/settings'); }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-indigo-650 transition-colors"
                    >
                      Platform Settings
                    </button>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { setIsProfileOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-rose-650 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
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

        {/* Outer scrolling content wrap */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
