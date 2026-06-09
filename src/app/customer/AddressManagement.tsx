import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  Phone,
  AlertCircle,
  X
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  addAddress,
  editAddress,
  deleteAddress,
  setDefaultAddress,
  type Address
} from '../../store/slices/addressesSlice';
import { addNotification } from '../../store/slices/notificationSlice';

export const AddressManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(state => state.addresses.items);

  // Modal form states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

  // Form inputs states
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [pincode, setPincode] = useState('');

  // Form error states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setModalMode('add');
    setCurrentAddress(null);
    setFullName('');
    setMobile('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setCountry('India');
    setPincode('');
    setFormErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setModalMode('edit');
    setCurrentAddress(addr);
    setFullName(addr.fullName);
    setMobile(addr.mobile);
    setAddressLine1(addr.addressLine1);
    setAddressLine2(addr.addressLine2 || '');
    setCity(addr.city);
    setState(addr.state);
    setCountry(addr.country);
    setPincode(addr.pincode);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleFormValidation = (): boolean => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = 'Full Name is required.';
    
    // Mobile validation: 10 digits
    if (!mobile.trim()) {
      errors.mobile = 'Mobile Number is required.';
    } else if (!/^\d{10}$/.test(mobile.trim())) {
      errors.mobile = 'Mobile Number must be exactly 10 digits.';
    }

    if (!addressLine1.trim()) errors.addressLine1 = 'Address Line 1 is required.';
    if (!city.trim()) errors.city = 'City is required.';
    if (!state.trim()) errors.state = 'State is required.';
    if (!country.trim()) errors.country = 'Country is required.';

    // Pincode validation: 6 digits (typical India format) or digits
    if (!pincode.trim()) {
      errors.pincode = 'Pincode is required.';
    } else if (!/^\d{5,8}$/.test(pincode.trim())) {
      errors.pincode = 'Pincode must be between 5 and 8 digits.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleFormValidation()) return;

    if (modalMode === 'add') {
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
      dispatch(
        addNotification({
          id: Math.random().toString(),
          title: 'Address Created',
          message: `Successfully created address details for ${fullName}.`
        })
      );
    } else if (modalMode === 'edit' && currentAddress) {
      dispatch(
        editAddress({
          id: currentAddress.id,
          fullName,
          mobile,
          addressLine1,
          addressLine2: addressLine2 || undefined,
          city,
          state,
          country,
          pincode,
          isDefault: currentAddress.isDefault,
        })
      );
      dispatch(
        addNotification({
          id: Math.random().toString(),
          title: 'Address Updated',
          message: `Successfully updated address details for ${fullName}.`
        })
      );
    }

    setModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the address for ${name}?`)) {
      dispatch(deleteAddress(id));
      dispatch(
        addNotification({
          id: Math.random().toString(),
          title: 'Address Deleted',
          message: 'An address card was deleted from your registry.'
        })
      );
    }
  };

  const handleSetDefault = (id: string, name: string) => {
    dispatch(setDefaultAddress(id));
    dispatch(
      addNotification({
        id: Math.random().toString(),
        title: 'Default Address Updated',
        message: `${name} is now your default shipping address.`
      })
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 text-left">
        <Link to="/home" className="hover:text-indigo-650 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-slate-700">Addresses Manager</span>
      </nav>

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 text-left">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="text-indigo-600" size={24} />
            <span>Addresses Registry</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage your home, business, and billing shipping addresses.</p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add New Address</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
            <MapPin size={28} />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 text-base">No addresses saved</h4>
            <p className="text-xs text-slate-400 font-semibold mt-1">Save your shipping addresses to speed up checkout checkouts.</p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-indigo-650 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Add First Address
          </button>
        </div>
      ) : (
        /* Address Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white border rounded-3xl p-5 shadow-3xs space-y-4 text-left flex flex-col justify-between transition-all relative ${
                addr.isDefault
                  ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-xs'
                  : 'border-slate-150 hover:border-slate-300'
              }`}
            >
              
              {/* Default Badge Indicator */}
              {addr.isDefault && (
                <span className="absolute top-4 right-4 text-[9px] font-black text-indigo-700 bg-indigo-50 border border-indigo-100/50 rounded-md px-2 py-0.5 uppercase tracking-wider">
                  Default Address
                </span>
              )}

              {/* Card Details */}
              <div className="space-y-2.5">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-850 flex items-center gap-1">
                    <span>{addr.fullName}</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-450 flex items-center gap-1">
                    <Phone size={12} />
                    <span>+91 {addr.mobile}</span>
                  </p>
                </div>

                <div className="text-xs font-semibold text-slate-550 leading-relaxed">
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>{addr.city}, {addr.state} - <span className="font-bold text-slate-800">{addr.pincode}</span></p>
                  <p>{addr.country}</p>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                
                {/* Default setter trigger */}
                {!addr.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(addr.id, addr.fullName)}
                    className="text-[10px] font-black text-indigo-650 hover:text-indigo-850 cursor-pointer flex items-center gap-1"
                  >
                    <span>Set As Default</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5">
                    <Check size={12} />
                    <span>Default Delivery</span>
                  </span>
                )}

                {/* Edit & delete buttons */}
                <div className="flex items-center gap-3 text-slate-400">
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="hover:text-indigo-600 cursor-pointer transition-colors p-1"
                    title="Edit address"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id, addr.fullName)}
                    className="hover:text-rose-600 cursor-pointer transition-colors p-1"
                    title="Delete address"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal form overlay for adding / editing */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <div
            onClick={() => setModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Modal Container */}
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 relative z-10 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-left">
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={16} className="text-indigo-600" />
                <span>{modalMode === 'add' ? 'Add New Address' : 'Edit Address Details'}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left max-h-[70vh] overflow-y-auto">
              
              {/* Row 1: Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Receiver Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Prathamesh Samrat"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                    formErrors.fullName ? 'border-rose-350 focus:ring-rose-50' : 'border-slate-200 focus:border-indigo-300'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle size={10} />
                    <span>{formErrors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Row 2: Mobile Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Mobile Number *</label>
                <div className="flex gap-2">
                  <span className="bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold px-3 py-2 rounded-xl flex items-center justify-center">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`flex-grow bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                      formErrors.mobile ? 'border-rose-350 focus:ring-rose-50' : 'border-slate-200 focus:border-indigo-300'
                    }`}
                  />
                </div>
                {formErrors.mobile && (
                  <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle size={10} />
                    <span>{formErrors.mobile}</span>
                  </p>
                )}
              </div>

              {/* Row 3: Address Line 1 */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Address Line 1 (Flat, House No, Building) *</label>
                <input
                  type="text"
                  placeholder="e.g. 402, Samrat Towers, MG Road"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                    formErrors.addressLine1 ? 'border-rose-350 focus:ring-rose-50' : 'border-slate-200 focus:border-indigo-300'
                  }`}
                />
                {formErrors.addressLine1 && (
                  <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                    <AlertCircle size={10} />
                    <span>{formErrors.addressLine1}</span>
                  </p>
                )}
              </div>

              {/* Row 4: Address Line 2 */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Address Line 2 (Area, Street, Landmark)</label>
                <input
                  type="text"
                  placeholder="e.g. Near Central Park (optional)"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Row 5: City & State */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">City *</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                      formErrors.city ? 'border-rose-350 focus:ring-rose-50' : 'border-slate-200 focus:border-indigo-300'
                    }`}
                  />
                  {formErrors.city && (
                    <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle size={10} />
                      <span>{formErrors.city}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">State *</label>
                  <input
                    type="text"
                    placeholder="e.g. Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                      formErrors.state ? 'border-rose-350 focus:ring-rose-50' : 'border-slate-200 focus:border-indigo-300'
                    }`}
                  />
                  {formErrors.state && (
                    <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle size={10} />
                      <span>{formErrors.state}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Row 6: Country & Pincode */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Country *</label>
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                      formErrors.country ? 'border-rose-350 focus:ring-rose-50' : 'border-slate-200 focus:border-indigo-300'
                    }`}
                  />
                  {formErrors.country && (
                    <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle size={10} />
                      <span>{formErrors.country}</span>
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Pincode *</label>
                  <input
                    type="text"
                    placeholder="6-digit PIN"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold outline-hidden placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 ${
                      formErrors.pincode ? 'border-rose-350 focus:ring-rose-50' : 'border-slate-200 focus:border-indigo-300'
                    }`}
                  />
                  {formErrors.pincode && (
                    <p className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle size={10} />
                      <span>{formErrors.pincode}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-3 bg-white border border-slate-250 hover:border-slate-350 text-slate-650 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 cursor-pointer"
                >
                  Save Address
                </button>
              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default AddressManagement;
