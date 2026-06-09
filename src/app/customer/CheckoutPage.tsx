import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  ChevronRight,
  Plus,
  ArrowLeft,
  ShieldCheck,
  Info,
  AlertCircle,
  Tag,
  Check,
  X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearCart } from '../../store/slices/cartSlice';
import { addAddress } from '../../store/slices/addressesSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import { placeOrder } from '../../store/slices/ordersSlice';

export const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux States
  const cart = useAppSelector(state => state.cart);
  const addresses = useAppSelector(state => state.addresses.items);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/home/cart');
    }
  }, [cart, navigate]);

  // Step state
  const [step, setStep] = useState(1);

  // Step 1: Selected Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  
  useEffect(() => {
    // Set default address as selected initially
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
    }
  }, [addresses]);

  // Step 2: Shipping Method State
  // speed: standard (0 or 15), express (15), sameday (25)
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'sameday'>('standard');

  // Step 3: Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  // Inline Address Modal states
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');
  const [addrFormErrors, setAddrFormErrors] = useState<Record<string, string>>({});

  // Summary calculations
  const subtotal = cart.totalAmount;
  const discount = subtotal * (cart.appliedCoupon?.rate || 0);
  const subtotalAfterDiscount = subtotal - discount;
  const tax = subtotalAfterDiscount * 0.10;

  // Shipping cost recalculations
  let shippingCost = 0;
  if (shippingMethod === 'standard') {
    shippingCost = subtotalAfterDiscount >= 100 ? 0 : 15.00;
  } else if (shippingMethod === 'express') {
    shippingCost = 15.00;
  } else if (shippingMethod === 'sameday') {
    shippingCost = 25.00;
  }

  const total = subtotalAfterDiscount + tax + shippingCost;

  // Navigation handlers
  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedAddressId) {
        alert('Please choose a delivery address.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Validate payment methods
      const errors: Record<string, string> = {};
      
      if (paymentMethod === 'card') {
        if (!cardName.trim()) errors.cardName = 'Cardholder name is required.';
        if (!cardNumber.trim() || !/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
          errors.cardNumber = 'Card number must be exactly 16 digits.';
        }
        if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
          errors.cardExpiry = 'Expiry date must follow MM/YY format.';
        }
        if (!cardCvv.trim() || !/^\d{3}$/.test(cardCvv)) {
          errors.cardCvv = 'CVV must be exactly 3 digits.';
        }
      } else if (paymentMethod === 'upi') {
        if (!upiId.trim() || !upiId.includes('@')) {
          errors.upiId = 'Please enter a valid UPI ID (e.g., user@upi).';
        }
      }

      setPaymentErrors(errors);
      if (Object.keys(errors).length > 0) return;

      setStep(4);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Inline address creation handler
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = 'Name is required.';
    if (!mobile.trim() || !/^\d{10}$/.test(mobile)) {
      errors.mobile = 'Mobile number must be exactly 10 digits.';
    }
    if (!addressLine1.trim()) errors.addressLine1 = 'Address line 1 is required.';
    if (!city.trim()) errors.city = 'City is required.';
    if (!state.trim()) errors.state = 'State is required.';
    if (!pincode.trim() || !/^\d{5,8}$/.test(pincode)) {
      errors.pincode = 'Pincode must be between 5 and 8 digits.';
    }

    setAddrFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    dispatch(
      addAddress({
        fullName,
        mobile,
        addressLine1,
        addressLine2: addressLine2 || undefined,
        city,
        state,
        country,
        pincode,
      })
    );

    // Close and reset
    setAddrModalOpen(false);
    setFullName('');
    setMobile('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPincode('');
  };

  // Confirm and submit order
  const handlePlaceOrder = () => {
    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) {
      alert('Please select a shipping address.');
      return;
    }

    const orderItems = cart.items.map(item => ({
      productId: item.product.id,
      name: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
      vendorName: item.product.vendorName || 'Samrat Enterprises'
    }));

    dispatch(
      placeOrder({
        items: orderItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          mobile: selectedAddress.mobile,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          pincode: selectedAddress.pincode,
        },
        shippingMethod,
        shippingCost,
        paymentMethod,
        subtotal,
        discount,
        tax,
        total,
        status: 'pending'
      })
    );

    dispatch(clearCart());
    dispatch(
      addNotification({
        id: Math.random().toString(),
        title: 'Order Completed!',
        message: `Your checkout for $${total.toFixed(2)} was placed successfully. Package will be dispatched to ${selectedAddress.fullName}.`
      })
    );
    // Redirect to orders route
    alert('Thank you! Your order was successfully placed.');
    navigate('/home/orders');
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 text-left">
        <Link to="/home" className="hover:text-indigo-650 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/home/cart" className="hover:text-indigo-650 transition-colors">Cart</Link>
        <ChevronRight size={12} />
        <span className="text-slate-700">Checkout Checkout</span>
      </nav>

      {/* Header section */}
      <div className="text-left border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Checkout Portal</span>
        </h1>
        <p className="text-xs text-slate-400 font-semibold mt-1">Complete your shipping preferences and payment authorization to place your order.</p>
      </div>

      {/* Progress Stepper Headers */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-3xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold text-slate-400 select-none">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center space-y-2 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold transition-all border ${
              step > 1
                ? 'bg-emerald-600 border-emerald-650 text-white'
                : step === 1
                  ? 'bg-indigo-600 border-indigo-650 text-white ring-4 ring-indigo-50'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {step > 1 ? <Check size={14} /> : '1'}
            </div>
            <span className={step >= 1 ? 'text-slate-800' : ''}>Shipping Address</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center space-y-2 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold transition-all border ${
              step > 2
                ? 'bg-emerald-600 border-emerald-650 text-white'
                : step === 2
                  ? 'bg-indigo-600 border-indigo-650 text-white ring-4 ring-indigo-50'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {step > 2 ? <Check size={14} /> : '2'}
            </div>
            <span className={step >= 2 ? 'text-slate-800' : ''}>Shipping Speed</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center space-y-2 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold transition-all border ${
              step > 3
                ? 'bg-emerald-600 border-emerald-650 text-white'
                : step === 3
                  ? 'bg-indigo-600 border-indigo-655 text-white ring-4 ring-indigo-50'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {step > 3 ? <Check size={14} /> : '3'}
            </div>
            <span className={step >= 3 ? 'text-slate-800' : ''}>Payment Method</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center space-y-2 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold transition-all border ${
              step === 4
                ? 'bg-indigo-600 border-indigo-655 text-white ring-4 ring-indigo-50'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              '4'
            </div>
            <span className={step === 4 ? 'text-slate-800' : ''}>Review Order</span>
          </div>

        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Side: Stepper Details Forms */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs">
            
            {/* Step 1 Content: Select Address */}
            {step === 1 && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-850 flex items-center gap-1.5">
                    <MapPin size={16} className="text-indigo-650" />
                    <span>Select Delivery Address</span>
                  </h3>
                  <button
                    onClick={() => setAddrModalOpen(true)}
                    className="text-xs font-bold text-indigo-650 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Address</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex gap-4 p-4 border rounded-2xl cursor-pointer select-none transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-indigo-600 bg-indigo-50/10 shadow-3xs'
                          : 'border-slate-150 hover:border-slate-350 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkout-address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 focus:ring-indigo-500/10 mt-1 cursor-pointer"
                      />
                      <div className="text-xs font-semibold text-slate-650 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-850">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100/50 rounded px-1.5 py-0.5">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-slate-450">Mobile: +91 {addr.mobile}</p>
                        <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 Content: Shipping Method */}
            {step === 2 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-850 flex items-center gap-1.5">
                    <Truck size={16} className="text-indigo-650" />
                    <span>Choose Shipping Method</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  
                  {/* Standard */}
                  <label
                    className={`flex gap-4 p-4 border rounded-2xl cursor-pointer select-none transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-indigo-600 bg-indigo-50/10'
                        : 'border-slate-150 hover:border-slate-350 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping-speed"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 mt-1 cursor-pointer"
                    />
                    <div className="flex-grow flex justify-between gap-4 text-xs font-semibold">
                      <div className="space-y-0.5 text-slate-650">
                        <span className="font-black text-slate-850">Standard Delivery</span>
                        <p className="text-slate-400">Delivered within 3–5 business days</p>
                      </div>
                      <span className="font-black text-slate-850">
                        {subtotalAfterDiscount >= 100 ? 'FREE' : '$15.00'}
                      </span>
                    </div>
                  </label>

                  {/* Express */}
                  <label
                    className={`flex gap-4 p-4 border rounded-2xl cursor-pointer select-none transition-all ${
                      shippingMethod === 'express'
                        ? 'border-indigo-600 bg-indigo-50/10'
                        : 'border-slate-150 hover:border-slate-350 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping-speed"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 mt-1 cursor-pointer"
                    />
                    <div className="flex-grow flex justify-between gap-4 text-xs font-semibold">
                      <div className="space-y-0.5 text-slate-650">
                        <span className="font-black text-slate-850">Express Delivery</span>
                        <p className="text-slate-400">Delivered within 1–2 business days</p>
                      </div>
                      <span className="font-black text-slate-850">$15.00</span>
                    </div>
                  </label>

                  {/* Same Day */}
                  <label
                    className={`flex gap-4 p-4 border rounded-2xl cursor-pointer select-none transition-all ${
                      shippingMethod === 'sameday'
                        ? 'border-indigo-600 bg-indigo-50/10'
                        : 'border-slate-150 hover:border-slate-350 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping-speed"
                      checked={shippingMethod === 'sameday'}
                      onChange={() => setShippingMethod('sameday')}
                      className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 mt-1 cursor-pointer"
                    />
                    <div className="flex-grow flex justify-between gap-4 text-xs font-semibold">
                      <div className="space-y-0.5 text-slate-650">
                        <span className="font-black text-slate-850">Priority Same-Day Delivery</span>
                        <p className="text-slate-400">Delivered today by 8:00 PM</p>
                      </div>
                      <span className="font-black text-slate-850">$25.00</span>
                    </div>
                  </label>

                </div>
              </div>
            )}

            {/* Step 3 Content: Payment Method */}
            {step === 3 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-850 flex items-center gap-1.5">
                    <CreditCard className="text-indigo-650" size={16} />
                    <span>Choose Payment Method</span>
                  </h3>
                </div>

                <div className="space-y-5">
                  
                  {/* Card Payment Option */}
                  <div className={`border rounded-2xl p-4 space-y-4 ${
                    paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/5' : 'border-slate-150 bg-white'
                  }`}>
                    <label className="flex gap-3 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="payment-option"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 mt-0.5 cursor-pointer"
                      />
                      <div className="text-xs font-black text-slate-850">Credit / Debit Card</div>
                    </label>

                    {paymentMethod === 'card' && (
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100/60 animate-in fade-in duration-200">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase">Cardholder Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. PRATHAMESH SAMRAT"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                              paymentErrors.cardName ? 'border-rose-350' : 'border-slate-205 focus:border-indigo-300'
                            }`}
                          />
                          {paymentErrors.cardName && (
                            <p className="text-[10px] font-bold text-rose-650 flex items-center gap-1">
                              <AlertCircle size={10} />
                              <span>{paymentErrors.cardName}</span>
                            </p>
                          )}
                        </div>

                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase">Card Number *</label>
                          <input
                            type="text"
                            placeholder="16-digit card number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                            className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                              paymentErrors.cardNumber ? 'border-rose-350' : 'border-slate-205 focus:border-indigo-300'
                            }`}
                          />
                          {paymentErrors.cardNumber && (
                            <p className="text-[10px] font-bold text-rose-650 flex items-center gap-1">
                              <AlertCircle size={10} />
                              <span>{paymentErrors.cardNumber}</span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase">Expiry Date *</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length > 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setCardExpiry(value);
                            }}
                            className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                              paymentErrors.cardExpiry ? 'border-rose-350' : 'border-slate-205 focus:border-indigo-300'
                            }`}
                          />
                          {paymentErrors.cardExpiry && (
                            <p className="text-[10px] font-bold text-rose-655 flex items-center gap-1">
                              <AlertCircle size={10} />
                              <span>{paymentErrors.cardExpiry}</span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-500 uppercase">CVV *</label>
                          <input
                            type="password"
                            placeholder="3-digit CVV"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                              paymentErrors.cardCvv ? 'border-rose-350' : 'border-slate-205 focus:border-indigo-300'
                            }`}
                          />
                          {paymentErrors.cardCvv && (
                            <p className="text-[10px] font-bold text-rose-655 flex items-center gap-1">
                              <AlertCircle size={10} />
                              <span>{paymentErrors.cardCvv}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Net Banking / UPI Option */}
                  <div className={`border rounded-2xl p-4 space-y-4 ${
                    paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50/5' : 'border-slate-150 bg-white'
                  }`}>
                    <label className="flex gap-3 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="payment-option"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 mt-0.5 cursor-pointer"
                      />
                      <div className="text-xs font-black text-slate-850">Net Banking / UPI</div>
                    </label>

                    {paymentMethod === 'upi' && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100/60 animate-in fade-in duration-200">
                        <label className="text-[10px] font-black text-slate-500 uppercase">Enter UPI ID *</label>
                        <input
                          type="text"
                          placeholder="e.g. user@okaxis"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                          className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                            paymentErrors.upiId ? 'border-rose-350' : 'border-slate-205 focus:border-indigo-300'
                          }`}
                        />
                        {paymentErrors.upiId ? (
                          <p className="text-[10px] font-bold text-rose-655 flex items-center gap-1">
                            <AlertCircle size={10} />
                            <span>{paymentErrors.upiId}</span>
                          </p>
                        ) : (
                          <p className="text-[9px] text-slate-400 font-bold">UPI ID must contain the @ symbol</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* COD Option */}
                  <div className={`border rounded-2xl p-4 ${
                    paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50/5' : 'border-slate-150 bg-white'
                  }`}>
                    <label className="flex gap-3 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="payment-option"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 mt-0.5 cursor-pointer"
                      />
                      <div className="text-xs font-black text-slate-850">Cash On Delivery (COD)</div>
                    </label>
                  </div>

                </div>
              </div>
            )}

            {/* Step 4 Content: Review Order */}
            {step === 4 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-850 flex items-center gap-1.5">
                    <CheckCircle className="text-indigo-650" size={16} />
                    <span>Review & Confirm Order</span>
                  </h3>
                </div>

                <div className="space-y-5 text-xs font-semibold text-slate-550 divide-y divide-slate-100">
                  
                  {/* Address Summary */}
                  <div className="space-y-2">
                    <h4 className="font-black text-slate-850">Shipping Destination</h4>
                    {selectedAddress && (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
                        <p className="font-extrabold text-slate-800">{selectedAddress.fullName}</p>
                        <p className="text-slate-400 font-bold">Mobile: +91 {selectedAddress.mobile}</p>
                        <p>{selectedAddress.addressLine1}{selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}</p>
                        <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                      </div>
                    )}
                  </div>

                  {/* Shipping summary */}
                  <div className="space-y-2 pt-4">
                    <h4 className="font-black text-slate-850">Shipping Details</h4>
                    <p className="text-slate-650">
                      Method: <span className="font-black capitalize text-slate-850">{shippingMethod} Delivery</span>
                    </p>
                    <p className="text-slate-400 font-bold">
                      {shippingMethod === 'standard' && 'Delivered in 3–5 business days.'}
                      {shippingMethod === 'express' && 'Delivered in 1–2 business days.'}
                      {shippingMethod === 'sameday' && 'Delivered today by 8:00 PM.'}
                    </p>
                  </div>

                  {/* Payment Summary */}
                  <div className="space-y-2 pt-4">
                    <h4 className="font-black text-slate-850">Payment Settings</h4>
                    <p className="text-slate-655 flex items-center gap-1">
                      <span>Method: </span>
                      <span className="font-black capitalize text-slate-850">
                        {paymentMethod === 'card' && 'Credit / Debit Card'}
                        {paymentMethod === 'upi' && 'Net Banking / UPI'}
                        {paymentMethod === 'cod' && 'Cash on Delivery'}
                      </span>
                    </p>
                    {paymentMethod === 'card' && (
                      <p className="text-slate-400 font-bold">Card ending in **** {cardNumber.slice(-4)}</p>
                    )}
                    {paymentMethod === 'upi' && (
                      <p className="text-slate-400 font-bold">UPI Account: {upiId}</p>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* Stepper Buttons Control panel */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-8 gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={step <= 1}
                className="px-5 py-2.5 bg-white border border-slate-250 hover:border-slate-350 text-slate-650 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <ArrowLeft size={13} />
                <span>Back</span>
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-1 cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="px-8 py-3 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 cursor-pointer"
                >
                  Confirm & Place Order
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Sticky Order Summary Card */}
        <div className="lg:col-span-4 h-fit sticky top-24">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs space-y-6">
            
            <div className="border-b border-slate-100 pb-3 text-left">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Order Summary</h3>
            </div>

            {/* Products quick preview checklist */}
            <div className="space-y-4 max-h-48 overflow-y-auto divide-y divide-slate-50 pr-1 text-left">
              {cart.items.map((item) => {
                const itemKey = `${item.product.id}-${item.selectedColor || ''}-${item.selectedSize || ''}`;
                return (
                  <div key={itemKey} className="flex gap-3 py-2.5 first:pt-0">
                    <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0 overflow-hidden">
                      <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow text-[11px] font-semibold text-slate-500 leading-snug">
                      <h4 className="font-bold text-slate-800 line-clamp-1">{item.product.title}</h4>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} • ${(item.product.price * item.quantity).toFixed(2)}</p>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-[9px] text-indigo-500 font-bold mt-0.5">
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                          {item.selectedColor && item.selectedSize && ' | '}
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-4 text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100/60">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-850">${subtotal.toFixed(2)}</span>
              </div>

              {cart.appliedCoupon && (
                <div className="flex justify-between text-emerald-600 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/50">
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    <span>Promo Coupon ({cart.appliedCoupon.code})</span>
                  </span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <span>Estimated Tax (10%)</span>
                  <span title="Calculated as 10% of subtotal after coupon deductions.">
                    <Info size={12} className="text-slate-350 cursor-help" />
                  </span>
                </span>
                <span className="font-bold text-slate-850">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping Fees</span>
                {shippingCost === 0 ? (
                  <span className="font-extrabold text-emerald-600">FREE</span>
                ) : (
                  <span className="font-bold text-slate-850">${shippingCost.toFixed(2)}</span>
                )}
              </div>

              <div className="h-px bg-slate-100 my-2" />

              <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 pt-2">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Samrat Escrow: Escrow-backed payments guaranteed</span>
            </div>

          </div>
        </div>

      </div>

      {/* Inline modal form to add address */}
      {addrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setAddrModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Modal Container */}
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 relative z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-left">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={16} className="text-indigo-600" />
                <span>Add Inline Address</span>
              </h3>
              <button
                onClick={() => setAddrModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAddress} className="p-6 space-y-4 text-left max-h-[60vh] overflow-y-auto">
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">FullName *</label>
                <input
                  type="text"
                  placeholder="e.g. Prathamesh Samrat"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:bg-white ${
                    addrFormErrors.fullName ? 'border-rose-350' : 'border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Mobile Number *</label>
                <input
                  type="text"
                  placeholder="10 digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:bg-white ${
                    addrFormErrors.mobile ? 'border-rose-350' : 'border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Address Line 1 *</label>
                <input
                  type="text"
                  placeholder="Street number, building..."
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:bg-white ${
                    addrFormErrors.addressLine1 ? 'border-rose-350' : 'border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Address Line 2</label>
                <input
                  type="text"
                  placeholder="Landmark, Area (optional)"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:bg-white ${
                      addrFormErrors.city ? 'border-rose-350' : 'border-slate-200'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">State *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:bg-white ${
                      addrFormErrors.state ? 'border-rose-350' : 'border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Country *</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden focus:bg-white ${
                      addrFormErrors.pincode ? 'border-rose-350' : 'border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddrModalOpen(false)}
                  className="w-1/2 py-3 bg-white border border-slate-250 hover:border-slate-350 text-slate-655 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Add Address
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;
