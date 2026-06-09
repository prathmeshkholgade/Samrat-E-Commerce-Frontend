import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ChevronRight,
  Tag,
  X,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateQuantity, removeFromCart, applyCoupon, removeCoupon } from '../../store/slices/cartSlice';

export const ShoppingCart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux cart state
  const cart = useAppSelector(state => state.cart);

  // Local coupon input state (errors and success messages)
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Quantities offset updates
  const handleQuantityChange = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity, color, size }));
    }
  };

  const handleRemoveItem = (productId: string, color?: string, size?: string) => {
    dispatch(removeFromCart({ productId, color, size }));
  };

  // Coupon application logic connecting to Redux Cart Slice
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const formattedCode = couponCode.trim().toUpperCase();

    if (!formattedCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (formattedCode === 'WELCOME10') {
      dispatch(applyCoupon({ code: 'WELCOME10', rate: 0.1 })); // 10% off
      setCouponSuccess('Promo code applied successfully: 10% off your subtotal.');
      setCouponCode('');
    } else if (formattedCode === 'SAMRAT20') {
      dispatch(applyCoupon({ code: 'SAMRAT20', rate: 0.2 })); // 20% off
      setCouponSuccess('Promo code applied successfully: 20% off your subtotal.');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME10 or SAMRAT20.');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponSuccess(null);
    setCouponError(null);
  };

  // Summary calculations using Redux appliedCoupon
  const subtotal = cart.totalAmount;
  const discountRate = cart.appliedCoupon?.rate || 0;
  const discount = subtotal * discountRate;
  const subtotalAfterDiscount = subtotal - discount;

  // Tax: 10% of final subtotal
  const tax = subtotalAfterDiscount * 0.10;

  // Shipping: free if subtotal is over $100 after discount, otherwise flat $15.00
  const isFreeShipping = subtotalAfterDiscount >= 100 || subtotalAfterDiscount === 0;
  const shipping = isFreeShipping ? 0 : 15.05;

  const total = subtotalAfterDiscount + tax + shipping;

  // Navigate to Multi-Step Checkout page
  const handleProceedToCheckout = () => {
    navigate('/home/checkout');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 text-left">
        <Link to="/home" className="hover:text-indigo-655 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-slate-700">Shopping Cart</span>
      </nav>

      {/* Header title */}
      <div className="text-left border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShoppingBag className="text-indigo-600" size={24} />
          <span>Shopping Cart</span>
        </h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Review your selections and apply promo discounts prior to checking out.</p>
      </div>

      {cart.items.length === 0 ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-5 max-w-2xl mx-auto my-8 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-350">
            <ShoppingBag size={36} />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-slate-800 text-base">Your shopping cart is empty</h3>
            <p className="text-xs text-slate-400 font-semibold max-w-sm">You haven't added any products to your cart yet. Explore our verified sellers' premium collection.</p>
          </div>
          <Link
            to="/home/products"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <ArrowLeft size={14} />
            <span>Discover Products</span>
          </Link>
        </div>
      ) : (
        /* Cart Contents: 2 Column Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Side: Items list & Coupon area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* List Table */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-2xs overflow-hidden">
              <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                <div className="col-span-6">Product details</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total Price</div>
              </div>

              <div className="divide-y divide-slate-150/50">
                {cart.items.map((item) => {
                  const itemKey = `${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`;
                  return (
                    <div key={itemKey} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      {/* Product Column */}
                      <div className="col-span-12 md:col-span-6 flex gap-4 text-left">
                        {/* Image */}
                        <Link
                          to={`/home/products/${item.product.id}`}
                          className="w-20 h-20 bg-slate-50 rounded-xl border border-slate-100/60 overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer hover:opacity-95"
                        >
                          <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                        </Link>
                        {/* Title & tags */}
                        <div className="flex flex-col justify-center space-y-1">
                          <Link
                            to={`/home/products/${item.product.id}`}
                            className="text-xs font-black text-slate-850 hover:text-indigo-650 transition-colors line-clamp-2 leading-snug cursor-pointer"
                          >
                            {item.product.title}
                          </Link>
                          
                          {/* Selected Options */}
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {item.selectedColor && (
                                <span className="text-[9px] font-bold text-slate-550 bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5 flex items-center gap-1">
                                  Color: <span className="w-2 h-2 rounded-full border border-slate-300" style={{ backgroundColor: item.selectedColor }} />
                                </span>
                              )}
                              {item.selectedSize && (
                                <span className="text-[9px] font-bold text-slate-555 bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                            </div>
                          )}

                          <span className="text-[10px] text-slate-400 font-bold uppercase block mt-1">
                            Merchant: {item.product.vendorName}
                          </span>
                        </div>
                      </div>

                      {/* Unit Price Column */}
                      <div className="col-span-4 md:col-span-2 text-left md:text-center flex md:block items-center justify-between border-b md:border-b-0 border-slate-100 pb-2 md:pb-0">
                        <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase">Unit Price</span>
                        <span className="text-xs font-extrabold text-slate-800">${item.product.price.toFixed(2)}</span>
                      </div>

                      {/* Quantity Controller Column */}
                      <div className="col-span-4 md:col-span-2 flex justify-between md:justify-center items-center border-b md:border-b-0 border-slate-100 pb-2 md:pb-0">
                        <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase">Qty</span>
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-slate-500 hover:text-indigo-655 disabled:opacity-40 cursor-pointer"
                          >
                            <Minus size={11} />
                          </button>
                          <span className="text-xs font-bold text-slate-800 px-1">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                            className="p-1 text-slate-500 hover:text-indigo-655 cursor-pointer"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      </div>

                      {/* Total Price Column */}
                      <div className="col-span-4 md:col-span-2 text-right flex md:block items-center justify-between">
                        <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase">Total Price</span>
                        <div className="flex items-center justify-end gap-3.5">
                          <span className="text-xs font-black text-slate-905">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-50"
                            title="Remove product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coupons & Promo codes panel */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-slate-800 text-left">
                <Tag size={16} className="text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-wider">Coupons & Promo Codes</h3>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold text-left">Enjoy special promotions. Enter coupon code like WELCOME10 (10% off) or SAMRAT20 (20% off) to redeem discounts.</p>
              
              <form onSubmit={handleApplyCoupon} className="flex gap-3 max-w-md">
                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={cart.appliedCoupon !== null}
                  className="flex-grow bg-slate-50 border border-slate-200 focus:border-indigo-300 rounded-xl px-4 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={cart.appliedCoupon !== null}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-955 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Apply Code
                </button>
              </form>

              {/* Status response messages */}
              {couponError && (
                <div className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5 text-left bg-rose-50 border border-rose-100 rounded-xl p-3 animate-in fade-in">
                  <AlertCircle size={14} />
                  <span>{couponError}</span>
                </div>
              )}

              {couponSuccess && (
                <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 text-left bg-emerald-50 border border-emerald-100 rounded-xl p-3 animate-in fade-in">
                  <CheckCircle2 size={14} />
                  <span>{couponSuccess}</span>
                </div>
              )}

              {cart.appliedCoupon && (
                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 w-fit gap-6 text-xs font-black text-indigo-700 animate-in slide-in-from-top-1">
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} />
                    <span>Coupon: {cart.appliedCoupon.code} ({(cart.appliedCoupon.rate * 100)}% discount applied)</span>
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-indigo-100 rounded-full transition-colors cursor-pointer text-indigo-500"
                    title="Remove coupon"
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>

            {/* Back button */}
            <div className="text-left">
              <Link
                to="/home/products"
                className="inline-flex items-center gap-2 text-xs font-black text-indigo-650 hover:text-indigo-800 transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Continue Shopping</span>
              </Link>
            </div>

          </div>

          {/* Right Side: Order summary checklist card */}
          <div className="lg:col-span-4 h-fit sticky top-24">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs space-y-6">
              
              <div className="border-b border-slate-100 pb-3 text-left">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Order Summary</h3>
              </div>

              {/* Summary Items Table */}
              <div className="space-y-4 text-xs font-semibold text-slate-500">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="font-bold text-slate-850">${subtotal.toFixed(2)}</span>
                </div>

                {cart.appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      <span>Discount ({cart.appliedCoupon.code})</span>
                    </span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span>Estimated Tax (10%)</span>
                    <span title="Calculated as 10% of subtotal after coupon reductions.">
                      <Info size={12} className="text-slate-350 cursor-help" />
                    </span>
                  </span>
                  <span className="font-bold text-slate-850">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-extrabold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-850">${shipping.toFixed(2)}</span>
                  )}
                </div>

                {shipping > 0 && (
                  <div className="text-[10px] text-slate-400 leading-normal text-left bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    Add <span className="font-bold text-indigo-650">${(100 - subtotalAfterDiscount).toFixed(2)}</span> more of items to unlock free shipping!
                  </div>
                )}

                <div className="h-px bg-slate-100 my-2" />

                <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                  <span>Estimated Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Primary CTA Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center justify-center hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Proceed To Checkout</span>
                </button>
                <Link
                  to="/home/products"
                  className="w-full h-12 bg-slate-55 hover:bg-slate-100 border border-slate-200 text-slate-650 text-xs font-bold rounded-xl flex items-center justify-center transition-all"
                >
                  <span>Continue Shopping</span>
                </Link>
              </div>

              {/* Secure checkout assurances */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-400">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>Escrow secure guarantee: 30 days refund warranty</span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ShoppingCart;
