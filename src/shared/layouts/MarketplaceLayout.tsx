import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Bell,
  User,
  Search,
  ChevronDown,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Settings as SettingsIcon,
  ShoppingBag as OrderIcon,
  LogOut,
  Sparkles,
  Info,
  ShieldCheck,
  HelpCircle,
  Mail
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { logout } from '../../store/slices/authSlice';
import { markAsRead, markAllAsRead, clearAllNotifications } from '../../store/slices/notificationSlice';

export const MarketplaceLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux States
  const cart = useAppSelector(state => state.cart);
  const wishlist = useAppSelector(state => state.wishlist);
  const notifications = useAppSelector(state => state.notifications);
  const auth = useAppSelector(state => state.auth);

  // Component UI States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const categories = [
    'All Categories',
    'Electronics',
    'Fashion',
    'Grocery',
    'Home & Kitchen',
    'Beauty & Skincare',
    'Sports & Fitness',
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch query to search (or store in Redux / query params)
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
  };

  const unreadNotificationsCount = notifications.items.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      
      {/* 1. Sticky Premium Navbar */}
      <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/home" className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 font-black text-xl">
                  S
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  SAMRAT
                </span>
              </Link>
            </div>

            {/* Categories & Search Bar (Desktop) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-200/50 hover:border-slate-350/50 rounded-xl px-3.5 py-2 transition-all gap-2">
              {/* Categories Dropdown inside Search */}
              <div className="relative flex-shrink-0 border-r border-slate-200 pr-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  <span>{selectedCategory}</span>
                  <ChevronDown size={14} className={`transform transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryDropdownOpen && (
                  <div className="absolute top-8 left-0 mt-2 w-52 rounded-xl bg-white border border-slate-100 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-650 hover:bg-indigo-50 hover:text-indigo-650 transition-colors"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <input
                type="text"
                placeholder="Search premium products, verified local sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-transparent text-sm text-slate-700 outline-hidden placeholder:text-slate-400"
              />
              <button type="submit" className="text-slate-400 hover:text-indigo-650 cursor-pointer">
                <Search size={18} />
              </button>
            </form>

            {/* Actions Panel (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              
              {/* Wishlist */}
              <Link
                to="/home" // Toggle page/state as wishlist filter if desired
                className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-600 hover:text-indigo-600 relative transition-all"
                title="Wishlist"
              >
                <Heart size={20} />
                {wishlist.items.length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center border-2 border-white animate-pulse">
                    {wishlist.items.length}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-600 hover:text-indigo-600 relative transition-all cursor-pointer"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center border-2 border-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Panel */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-slate-100 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Notifications</span>
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    </div>
                    
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.items.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 font-semibold">
                          No notifications found.
                        </div>
                      ) : (
                        notifications.items.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => dispatch(markAsRead(n.id))}
                            className={`p-4 text-left cursor-pointer transition-colors hover:bg-slate-50 ${
                              !n.read ? 'bg-indigo-50/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                {n.title}
                              </h4>
                              <span className="text-[9px] font-bold text-slate-400">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.items.length > 0 && (
                      <div className="px-4 py-2 border-t border-slate-100 text-center">
                        <button
                          onClick={() => dispatch(clearAllNotifications())}
                          className="text-[10px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart Toggle */}
              <button
                onClick={() => navigate('/home/cart')}
                className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 text-slate-650 hover:text-indigo-650 relative transition-all cursor-pointer"
                title="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {cart.totalQuantity > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center border-2 border-white animate-bounce">
                    {cart.totalQuantity}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 cursor-pointer transition-all pr-2"
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-sm uppercase">
                    {auth.user?.fullName.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-none">
                      {auth.user?.fullName || 'Customer User'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {auth.user?.role || 'Customer'}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-slate-100 shadow-2xl py-2 z-50 divide-y divide-slate-50 animate-in fade-in slide-in-from-top-3">
                    <div className="px-4 py-3 text-left">
                      <p className="text-xs text-slate-400 font-semibold">Logged in as</p>
                      <p className="text-xs font-bold text-slate-850 truncate mt-0.5">{auth.user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <div className="py-1">
                      <button
                        onClick={() => { setIsProfileOpen(false); alert('My Profile Panel'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-600 transition-colors"
                      >
                        <User size={15} className="text-slate-400" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => { setIsProfileOpen(false); navigate('/home/orders'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-650 transition-colors"
                      >
                        <OrderIcon size={15} className="text-slate-400" />
                        <span>Orders</span>
                      </button>
                      <button
                        onClick={() => { setIsProfileOpen(false); alert('Wishlist Filter'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-600 transition-colors"
                      >
                        <Heart size={15} className="text-slate-400" />
                        <span>Wishlist</span>
                      </button>
                      <button
                        onClick={() => { setIsProfileOpen(false); navigate('/home/addresses'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-650 transition-colors"
                      >
                        <MapPin size={15} className="text-slate-400" />
                        <span>Addresses</span>
                      </button>
                      <button
                        onClick={() => { setIsProfileOpen(false); alert('Account Settings'); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-600 transition-colors"
                      >
                        <SettingsIcon size={15} className="text-slate-400" />
                        <span>Settings</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={15} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Action Toggle */}
            <div className="flex md:hidden items-center gap-2">
              
              {/* Cart Quick Toggle */}
              <button
                onClick={() => navigate('/home/cart')}
                className="p-2 text-slate-650 hover:text-indigo-650 relative cursor-pointer"
              >
                <ShoppingBag size={22} />
                {cart.totalQuantity > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-indigo-650 text-white font-black text-[8px] flex items-center justify-center">
                    {cart.totalQuantity}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-650 hover:text-indigo-600 cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-xl animate-in slide-in-from-top-4 duration-300">
            <div className="px-4 py-4 space-y-4">
              
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow bg-transparent text-sm text-slate-700 outline-hidden"
                />
                <button type="submit" className="text-slate-400">
                  <Search size={16} />
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-1 py-2 divide-y divide-slate-50">
                <div className="py-2 px-1 text-xs font-bold text-slate-450 tracking-wider">
                  MARKETPLACE MENU
                </div>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); alert('My Profile'); }}
                  className="w-full text-left py-3.5 px-2 text-sm font-semibold text-slate-700 flex items-center gap-2.5"
                >
                  <User size={18} className="text-slate-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); navigate('/home/orders'); }}
                  className="w-full text-left py-3.5 px-2 text-sm font-semibold text-slate-700 flex items-center gap-2.5"
                >
                  <OrderIcon size={18} className="text-slate-400" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); alert('Wishlist'); }}
                  className="w-full text-left py-3.5 px-2 text-sm font-semibold text-slate-700 flex items-center gap-2.5"
                >
                  <Heart size={18} className="text-slate-400" />
                  <span>Wishlist</span>
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); alert('Account Settings'); }}
                  className="w-full text-left py-3.5 px-2 text-sm font-semibold text-slate-700 flex items-center gap-2.5"
                >
                  <SettingsIcon size={18} className="text-slate-400" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-3.5 px-2 text-sm font-bold text-rose-600 flex items-center gap-2.5"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </header>

      {/* 2. Interactive Sliding Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Overlay */}
          <div
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Slider Panel */}
          <div className="w-full max-w-md bg-white h-full relative shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-indigo-600" size={20} />
                <h3 className="font-extrabold text-slate-900 text-base">Your Cart</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/50 text-[10px] font-bold text-indigo-650">
                  {cart.totalQuantity} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-5 divide-y divide-slate-150/40">
              {cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-350">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Cart is empty</h4>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Explore our marketplace catalog and add items.</p>
                  </div>
                </div>
              ) : (
                cart.items.map((item) => {
                const itemKey = `${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`;
                return (
                  <div key={itemKey} className="py-4 flex gap-4 first:pt-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                      <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1 leading-snug">
                          {item.product.title}
                        </h4>
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {item.selectedColor && (
                              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                                Color: <span className="w-2 h-2 rounded-full border border-slate-300" style={{ backgroundColor: item.selectedColor }} />
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">
                          Seller: {item.product.vendorName}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg p-0.5">
                          <button
                            onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1, color: item.selectedColor, size: item.selectedSize }))}
                            className="p-1 text-slate-500 hover:text-indigo-650 cursor-pointer"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                          <button
                            onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1, color: item.selectedColor, size: item.selectedSize }))}
                            className="p-1 text-slate-500 hover:text-indigo-650 cursor-pointer"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-extrabold text-slate-800">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => dispatch(removeFromCart({ productId: item.product.id, color: item.selectedColor, size: item.selectedSize }))}
                            className="text-slate-455 hover:text-rose-500 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
              )}
            </div>

            {/* Checkout Pricing Bar */}
            {cart.items.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Subtotal</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Shipping Charges</span>
                    <span className="text-emerald-600 font-bold">FREE</span>
                  </div>
                  <div className="h-px bg-slate-200 my-1" />
                  <div className="flex justify-between text-sm font-extrabold text-slate-850">
                    <span>Total Amount</span>
                    <span>${cart.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/home/cart');
                    }}
                    className="w-1/2 py-3.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-650 text-xs font-bold rounded-xl cursor-pointer text-center"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/home/cart');
                    }}
                    className="w-1/2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <span>Checkout</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 3. Primary Page Outlet Wrapper */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>

      {/* 4. Brand Marketplace Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            
            {/* Column 1: Brand Info */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
                  S
                </div>
                <span className="text-base font-black text-white tracking-tight">
                  SAMRAT ENTERPRISES
                </span>
              </div>
              <p className="text-slate-400 font-semibold leading-relaxed max-w-sm">
                A premium, multi-vendor marketplace platform hosting certified local vendors and delivering high-quality goods across the nation.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.01 3.796.056 1.03.047 1.77.213 2.402.46.653.254 1.21.593 1.766 1.15.558.556.896 1.113 1.15 1.766.247.632.413 1.373.46 2.402.046 1.01.056 1.364.056 3.796 0 2.43-.01 2.784-.056 3.796-.047 1.03-.213 1.77-.46 2.402-.254.653-.593 1.21-1.15 1.766-.556.558-1.113.896-1.766 1.15-.632.247-1.373.413-2.402.46-1.01.046-1.364.056-3.796.056-2.43 0-2.784-.01-3.796-.056-1.03-.047-1.77-.213-2.402-.46-.653-.254-1.21-.593-1.766-1.15-.558-.556-.896-1.113-1.15-1.766-.247-.632-.413-1.373-.46-2.402-.046-1.01-.056-1.364-.056-3.796 0-2.43.01-2.784.056-3.796.047-1.03.213-1.77.46-2.402.254-.653.593-1.21 1.15-1.766.556-.558 1.113-.896 1.766-1.15.632-.247 1.373-.413 2.402-.46 1.01-.046-1.364-.056 3.796-.056zM12 5.802a6.197 6.197 0 100 12.396 6.197 6.197 0 000-12.396zm0 2.196a4 4 0 110 8 4 4 0 010-8zm6.406-1.184a1.414 1.414 0 100 2.828 1.414 1.414 0 000-2.828z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 18.412" /></svg>
                </a>
              </div>
            </div>

            {/* Column 2: About Us */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white tracking-widest uppercase">About Us</h4>
              <ul className="space-y-2 font-semibold">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Info size={12} /><span>Our Story</span></a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Sparkles size={12} /><span>Careers</span></a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Mail size={12} /><span>Contact Us</span></a></li>
              </ul>
            </div>

            {/* Column 3: Policy */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white tracking-widest uppercase">Privacy & Terms</h4>
              <ul className="space-y-2 font-semibold">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><ShieldCheck size={12} /><span>Privacy Policy</span></a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Info size={12} /><span>Terms of Service</span></a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><ShieldCheck size={12} /><span>Intellectual Property</span></a></li>
              </ul>
            </div>

            {/* Column 4: Help Center */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white tracking-widest uppercase">Support</h4>
              <ul className="space-y-2 font-semibold">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><HelpCircle size={12} /><span>Help Center</span></a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><Info size={12} /><span>Refund Policies</span></a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1.5"><HelpCircle size={12} /><span>FAQ</span></a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 font-semibold">
            <p>© {new Date().getFullYear()} Samrat Enterprises. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-400">Sitemap</a>
              <a href="#" className="hover:text-slate-400">Merchant Portal</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default MarketplaceLayout;
