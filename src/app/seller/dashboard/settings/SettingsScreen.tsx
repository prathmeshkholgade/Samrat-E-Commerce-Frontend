import React, { useState, useEffect } from 'react';
import { Settings, Store, Mail, Share2, Shield, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { updateSettings } from '../../../../store/slices/sellerSettingsSlice';
import { addNotification } from '../../../../store/slices/sellerNotificationsSlice';
import type { SellerSettingsState } from '../../../../store/slices/sellerSettingsSlice';

// Subforms
import StoreInfoForm from '../../../../features/seller/components/settings/StoreInfoForm';
import ContactAddressForm from '../../../../features/seller/components/settings/ContactAddressForm';
import SocialLinksForm from '../../../../features/seller/components/settings/SocialLinksForm';
import BusinessSettingsForm from '../../../../features/seller/components/settings/BusinessSettingsForm';

export const SettingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const settingsState = useAppSelector((state) => state.sellerSettings);

  // Local state copy
  const [localSettings, setLocalSettings] = useState<SellerSettingsState>(settingsState);
  const [activeTab, setActiveTab] = useState<'info' | 'contact' | 'social' | 'business'>('info');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync if settingsState changes externally
  useEffect(() => {
    setLocalSettings(settingsState);
  }, [settingsState]);

  // Form field change handler
  const handleFieldChange = (field: string, value: any) => {
    setLocalSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error when field is modified
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Form field changes check
  const isDirty = JSON.stringify(localSettings) !== JSON.stringify(settingsState);

  // Custom validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!localSettings.storeName.trim()) {
      newErrors.storeName = 'Store Name is required';
    }
    if (!localSettings.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(localSettings.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!localSettings.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!localSettings.address.trim()) {
      newErrors.address = 'Business Address is required';
    }
    if (!localSettings.gst.trim()) {
      newErrors.gst = 'GSTIN is required';
    } else if (localSettings.gst.trim().length !== 15) {
      newErrors.gst = 'GSTIN must be exactly 15 alphanumeric characters';
    }
    if (!localSettings.pan.trim()) {
      newErrors.pan = 'PAN number is required';
    } else if (localSettings.pan.trim().length !== 10) {
      newErrors.pan = 'PAN must be exactly 10 alphanumeric characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setToast({ type: 'error', message: 'Validation failed. Please resolve errors across all tabs.' });
      return;
    }

    setIsSaving(true);
    // Simulate API transactional save with 800ms delay
    setTimeout(() => {
      dispatch(updateSettings(localSettings));
      dispatch(
        addNotification({
          id: `settings-${Date.now()}`,
          type: 'Payout Update', // Map to payout update categories for account notifications
          title: 'Account Settings Updated',
          message: `Your store profile settings for "${localSettings.storeName}" have been updated.`,
        })
      );
      setIsSaving(false);
      setToast({ type: 'success', message: 'Store settings saved successfully!' });
    }, 800);
  };

  // Auto-dismiss toast notification
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const tabs = [
    { id: 'info', label: 'Store Profile', icon: Store },
    { id: 'contact', label: 'Contact & Address', icon: Mail },
    { id: 'social', label: 'Social Links', icon: Share2 },
    { id: 'business', label: 'Business Settings', icon: Shield },
  ] as const;

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Alert overlay */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-sm">
          <div className={`p-4 rounded-2xl border shadow-lg flex items-start gap-3.5 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-150 text-emerald-800'
              : 'bg-rose-50 border-rose-150 text-rose-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={18} />
            ) : (
              <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
            )}
            <div>
              <p className="text-xs font-black capitalize leading-none mb-1">
                {toast.type === 'success' ? 'Saved' : 'Error'}
              </p>
              <p className="text-[11px] font-semibold opacity-90 leading-tight">
                {toast.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header banner */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <Settings className="text-indigo-650" size={24} />
            <span>Store Settings</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Configure your brand identity, business registry, tax defaults, and customer help details.
          </p>
        </div>

        {/* Global Save Changes Action button */}
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
            isSaving
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : isDirty
              ? 'bg-indigo-650 text-white hover:bg-indigo-750 active:scale-[0.98] shadow-xs cursor-pointer border border-transparent'
              : 'bg-slate-50 text-slate-350 cursor-not-allowed border border-slate-150'
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin text-slate-400" size={15} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Tabs (Sidebar style on lg screen, row style on md screen) */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 p-1 bg-slate-50 lg:bg-transparent rounded-2xl lg:p-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const hasTabErrors = 
              (tab.id === 'info' && errors.storeName) ||
              (tab.id === 'contact' && (errors.email || errors.phone || errors.address)) ||
              (tab.id === 'business' && (errors.gst || errors.pan));

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap lg:w-full text-left relative ${
                  isActive
                    ? 'bg-indigo-650 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-50 border border-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{tab.label}</span>
                {hasTabErrors && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Form Component Viewport */}
        <div className="lg:col-span-3 bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs min-h-[350px] relative">
          
          {/* Section Description */}
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">
              {activeTab === 'info' && 'Your public storefront information shown to customers in search and item detailed screens.'}
              {activeTab === 'contact' && 'Support contacts for customer requests and shipping origin business addresses.'}
              {activeTab === 'social' && 'Social platform handles displayed on your storefront catalog to build merchant reputation.'}
              {activeTab === 'business' && 'Tax configuration rates and merchant registrations required by marketplace policy.'}
            </p>
          </div>

          {/* Form Switcher */}
          <div>
            {activeTab === 'info' && (
              <StoreInfoForm
                storeName={localSettings.storeName}
                description={localSettings.description}
                logoUrl={localSettings.logoUrl}
                bannerUrl={localSettings.bannerUrl}
                onFieldChange={handleFieldChange}
                errors={errors}
              />
            )}

            {activeTab === 'contact' && (
              <ContactAddressForm
                email={localSettings.email}
                phone={localSettings.phone}
                address={localSettings.address}
                onFieldChange={handleFieldChange}
                errors={errors}
              />
            )}

            {activeTab === 'social' && (
              <SocialLinksForm
                website={localSettings.website}
                facebook={localSettings.facebook}
                instagram={localSettings.instagram}
                onFieldChange={handleFieldChange}
              />
            )}

            {activeTab === 'business' && (
              <BusinessSettingsForm
                gst={localSettings.gst}
                pan={localSettings.pan}
                taxConfig={localSettings.taxConfig}
                onFieldChange={handleFieldChange}
                errors={errors}
              />
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsScreen;
