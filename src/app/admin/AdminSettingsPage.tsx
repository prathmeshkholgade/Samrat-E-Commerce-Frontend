import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateAdminSettings, type AdminSettings } from '../../store/slices/adminSlice';
import { 
  Settings, 
  Store, 
  Percent, 
  ShoppingBag, 
  User, 
  Lock, 
  Check, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.admin);

  // Active section tab: 'marketplace' | 'commissions' | 'security'
  const [activeSection, setActiveSection] = useState<'marketplace' | 'commissions' | 'security'>('marketplace');

  // Local form states
  const [platformName, setPlatformName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  
  const [commissionRate, setCommissionRate] = useState<number>(8);
  const [returnWindow, setReturnWindow] = useState<number>(7);
  const [cancellationRules, setCancellationRules] = useState('');

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Save workflow states
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Sync form states with Redux on load
  useEffect(() => {
    if (settings) {
      setPlatformName(settings.marketplace.platformName);
      setSupportEmail(settings.marketplace.supportEmail);
      setSupportPhone(settings.marketplace.supportPhone);
      setCommissionRate(settings.commission.defaultCommissionRate);
      setReturnWindow(settings.order.returnWindowDays);
      setCancellationRules(settings.order.cancellationRules);
      setProfileName(settings.profile.name);
      setProfileEmail(settings.profile.email);
    }
  }, [settings]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Dirty State Checker
  const checkIsDirty = () => {
    if (!settings) return false;
    
    const hasPasswordInput = oldPassword || newPassword || confirmPassword;
    if (hasPasswordInput) return true; // Password changes make form dirty

    return (
      platformName !== settings.marketplace.platformName ||
      supportEmail !== settings.marketplace.supportEmail ||
      supportPhone !== settings.marketplace.supportPhone ||
      commissionRate !== settings.commission.defaultCommissionRate ||
      returnWindow !== settings.order.returnWindowDays ||
      cancellationRules !== settings.order.cancellationRules ||
      profileName !== settings.profile.name ||
      profileEmail !== settings.profile.email
    );
  };

  const isDirty = checkIsDirty();

  // Save changes handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form validation
    if (!platformName.trim()) {
      setFormError('Platform name is required.');
      return;
    }
    if (!supportEmail.trim() || !supportEmail.includes('@')) {
      setFormError('Please enter a valid support email address.');
      return;
    }
    if (!supportPhone.trim()) {
      setFormError('Support contact phone is required.');
      return;
    }
    if (commissionRate < 0 || commissionRate > 100) {
      setFormError('Default commission must be a percentage between 0 and 100.');
      return;
    }
    if (returnWindow < 0 || returnWindow > 90) {
      setFormError('Order return window must be between 0 and 90 days.');
      return;
    }
    if (!profileName.trim()) {
      setFormError('Admin profile name is required.');
      return;
    }
    if (!profileEmail.trim() || !profileEmail.includes('@')) {
      setFormError('Admin profile email must be valid.');
      return;
    }

    // Password change validations if filled
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword) {
        setFormError('Please enter your current password to authorize credentials updates.');
        return;
      }
      if (!newPassword || newPassword.length < 6) {
        setFormError('New password must contain at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setFormError('Confirm password does not match new password.');
        return;
      }
    }

    // Trigger simulated API delay
    setIsSaving(true);
    setTimeout(() => {
      const updatedSettings: AdminSettings = {
        marketplace: {
          platformName: platformName.trim(),
          supportEmail: supportEmail.trim(),
          supportPhone: supportPhone.trim(),
        },
        commission: {
          defaultCommissionRate: Number(commissionRate),
        },
        order: {
          returnWindowDays: Number(returnWindow),
          cancellationRules: cancellationRules.trim(),
        },
        profile: {
          name: profileName.trim(),
          email: profileEmail.trim(),
        }
      };

      dispatch(updateAdminSettings(updatedSettings));
      
      // Reset password states
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setIsSaving(false);
      setToastMessage('System configurations successfully saved.');
    }, 800);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <Settings className="text-indigo-650" size={24} />
            <span>Platform Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Configure platform branding details, commission percentages, cancellations policy guidelines, and credentials security.
          </p>
        </div>
      </div>

      {/* Main layout: Sidebar Tabs + Forms Panel */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar tabs navigation */}
        <div className="w-full lg:w-64 bg-white border border-slate-100 p-4 rounded-3xl shadow-3xs space-y-1.5 shrink-0 text-xs">
          <button
            onClick={() => setActiveSection('marketplace')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold cursor-pointer transition-colors ${
              activeSection === 'marketplace'
                ? 'bg-indigo-50 text-indigo-700 font-black'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Store size={15} />
            <span>Marketplace Settings</span>
          </button>
          
          <button
            onClick={() => setActiveSection('commissions')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold cursor-pointer transition-colors ${
              activeSection === 'commissions'
                ? 'bg-indigo-50 text-indigo-700 font-black'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Percent size={15} />
            <span>Commissions & Orders</span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold cursor-pointer transition-colors ${
              activeSection === 'security'
                ? 'bg-indigo-50 text-indigo-700 font-black'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <User size={15} />
            <span>Security & Profile</span>
          </button>
        </div>

        {/* Forms content card */}
        <form onSubmit={handleSave} className="flex-1 w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs space-y-6 text-xs text-slate-650">
          
          {/* Error Callouts */}
          {formError && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-650 rounded-2xl font-bold flex items-center gap-2.5">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section: Marketplace Branding Settings */}
          {activeSection === 'marketplace' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Branding & Support Parameters</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Define platform name title and general customer support details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Platform Branding Name</label>
                  <input
                    type="text"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Support Email Address</label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Support Contact Hotline</label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Commissions & Orders Settings */}
          {activeSection === 'commissions' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Financial & Order Rules</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Control base merchant rates, checkout cancellation clauses, and return windows.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                    <Percent size={11} className="text-indigo-650" />
                    <span>Default Seller Commission (%)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                    <ShoppingBag size={11} className="text-indigo-650" />
                    <span>Return Window Days Limit</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={90}
                    value={returnWindow}
                    onChange={(e) => setReturnWindow(Number(e.target.value))}
                    className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Standard Cancellation Policy Guidelines</label>
                  <textarea
                    rows={4}
                    value={cancellationRules}
                    onChange={(e) => setCancellationRules(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Admin Profile Security Settings */}
          {activeSection === 'security' && (
            <div className="space-y-5">
              {/* Profile Details */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Admin Profile Credentials</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Alter administrative identity properties and email addresses.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Account Administrator Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Administrator Email</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650"
                    />
                  </div>
                </div>
              </div>

              {/* Password Changes */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Lock size={13} className="text-indigo-650" />
                    <span>Change Login Password</span>
                  </h4>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Only complete below fields if you want to alter password keys.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Current Authorization Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">New Secure Password</label>
                    <input
                      type="password"
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Confirm New Secure Password</label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
            <span className="text-[10px] text-slate-450 font-bold">
              {isDirty ? (
                <span className="text-amber-600 font-extrabold flex items-center gap-1">
                  ⚠️ Unsaved edits detected. Click 'Save Configurations' below.
                </span>
              ) : (
                <span className="text-slate-400 flex items-center gap-1">
                  <Check size={12} className="text-emerald-500" />
                  Configurations synced with server datastore.
                </span>
              )}
            </span>

            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className={`flex items-center gap-1.5 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-xs transition-all cursor-pointer ${
                isDirty && !isSaving
                  ? 'bg-indigo-650 text-white hover:bg-indigo-700'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Persisting Changes...</span>
                </>
              ) : (
                <>
                  <Check size={13} />
                  <span>Save Configurations</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Floating Success Toast Alert Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-805 text-white px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-3 animate-slide-in text-xs font-black tracking-wide">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center font-bold">
            <Check size={12} strokeWidth={3} />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
