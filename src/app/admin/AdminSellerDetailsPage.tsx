import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateSellerStatus } from '../../store/slices/adminSlice';
import { 
  ArrowLeft, 
  Building2, 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  Ban, 
  Check, 
  X,
  ShieldCheck,
  Unlock,
  Download
} from 'lucide-react';
import type { SellerRegistration } from '../../store/slices/adminSlice';

export const AdminSellerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sellers } = useAppSelector((state) => state.admin);

  const seller = sellers.find((s) => s.id === id);

  if (!seller) {
    return (
      <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center shadow-3xs">
        <AlertTriangle className="text-rose-500 mx-auto mb-3" size={32} />
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Merchant Dossier Not Found</h4>
        <p className="text-xs text-slate-450 mt-1">No seller exists with ID: {id}</p>
        <button
          onClick={() => navigate('/admin/sellers')}
          className="mt-5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} />
          <span>Back to List</span>
        </button>
      </div>
    );
  }

  const handleStatusUpdate = (status: SellerRegistration['status']) => {
    dispatch(updateSellerStatus({ id: seller.id, status }));
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Dossier Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/sellers')}
            className="p-2.5 rounded-xl border border-slate-200/50 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Back to Sellers List"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={seller.logoUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150'}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">
                  {seller.storeName}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                  seller.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : seller.status === 'Pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                    : seller.status === 'Blocked'
                    ? 'bg-rose-50 text-rose-700 border border-rose-100'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {seller.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                Seller ID: {seller.id} • Registered on {seller.date}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Workflow Decisions Actions Box */}
        <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex items-center gap-3 shrink-0">
          <div className="text-left">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Decision Actions</span>
            <p className="text-[10px] font-bold text-slate-600 mt-0.5">Moderate this merchant registration</p>
          </div>
          
          <div className="flex items-center gap-1.5">
            {seller.status === 'Pending' && (
              <>
                <button
                  onClick={() => handleStatusUpdate('Approved')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 text-xs transition-colors flex items-center gap-1.5 shadow-3xs cursor-pointer"
                >
                  <Check size={13} />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate('Rejected')}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-black hover:bg-rose-700 text-xs transition-colors flex items-center gap-1.5 shadow-3xs cursor-pointer"
                >
                  <X size={13} />
                  <span>Reject</span>
                </button>
              </>
            )}

            {seller.status === 'Approved' && (
              <button
                onClick={() => handleStatusUpdate('Blocked')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Ban size={13} />
                <span>Block Store</span>
              </button>
            )}

            {seller.status === 'Blocked' && (
              <button
                onClick={() => handleStatusUpdate('Approved')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Unlock size={13} />
                <span>Unblock Store</span>
              </button>
            )}

            {seller.status === 'Rejected' && (
              <button
                onClick={() => handleStatusUpdate('Pending')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-black text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Revert to Pending</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compliance dossier layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Business, Bank details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Business Info */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-left">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
              <Building2 className="text-indigo-650" size={18} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Business Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Legal Business Name</span>
                <p className="font-extrabold text-slate-800 mt-1">{seller.storeName}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Business Type</span>
                <p className="font-extrabold text-slate-805 mt-1">{seller.businessType}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Store Owner / Applicant</span>
                <p className="font-semibold text-slate-700 mt-1">{seller.name}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Email Contact</span>
                <p className="font-semibold text-slate-700 font-mono mt-1">{seller.email}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Contact Phone</span>
                <p className="font-semibold text-slate-700 mt-1">{seller.phone}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Preferred Catalog Category</span>
                <p className="font-semibold text-indigo-600 mt-1 uppercase tracking-wider">{seller.category}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Corporate / Origin Address</span>
                <p className="font-semibold text-slate-600 mt-1 leading-normal">{seller.businessAddress}</p>
              </div>
            </div>
          </div>

          {/* Bank Accounts details */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-left">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
              <CreditCard className="text-indigo-650" size={18} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Registered Bank Settlement Account</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-405 tracking-wider block font-sans">Bank Name</span>
                <p className="font-bold text-slate-800 mt-1">{seller.bankDetails.bankName}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-405 tracking-wider block font-sans">IFSC Code</span>
                <p className="font-bold text-indigo-600 mt-1">{seller.bankDetails.ifscCode}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-405 tracking-wider block font-sans">Account Number</span>
                <p className="font-bold text-slate-800 mt-1">{seller.bankDetails.accountNumber}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-405 tracking-wider block font-sans">Settlement Branch</span>
                <p className="font-bold text-slate-800 mt-1 font-sans">{seller.bankDetails.branch}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Tax Details, Uploaded Documents */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Tax Information */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs text-left">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <ShieldCheck className="text-indigo-655" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Statutory Tax Registrations</h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-sans">GSTIN (Goods & Services Tax)</span>
                <p className="font-bold text-slate-800 mt-1">{seller.gstin}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-sans">PAN (Permanent Account Number)</span>
                <p className="font-bold text-slate-800 mt-1">{seller.panNumber}</p>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs text-left">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <FileText className="text-indigo-655" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Uploaded Documents</h3>
            </div>

            <div className="space-y-3.5 text-xs">
              
              {/* GST Certificate */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/70 border border-slate-150/40 rounded-xl">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-800">GST Registration Form</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">GST_Certificate.pdf</span>
                </div>
                <a
                  href={seller.documents.gstCertificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-650 hover:bg-slate-50 transition-all cursor-pointer shadow-3xs"
                  title="Download File"
                >
                  <Download size={14} />
                </a>
              </div>

              {/* PAN Card */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/70 border border-slate-150/40 rounded-xl">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-800">Permanent Account Card</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">PAN_Card.pdf</span>
                </div>
                <a
                  href={seller.documents.panCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-650 hover:bg-slate-50 transition-all cursor-pointer shadow-3xs"
                  title="Download File"
                >
                  <Download size={14} />
                </a>
              </div>

              {/* Business License */}
              <div className="flex items-center justify-between gap-3 p-3 bg-slate-50/70 border border-slate-150/40 rounded-xl">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-slate-800">Corporate Incorporation License</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Trade_License.pdf</span>
                </div>
                <a
                  href={seller.documents.businessLicense}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-indigo-650 hover:bg-slate-50 transition-all cursor-pointer shadow-3xs"
                  title="Download File"
                >
                  <Download size={14} />
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminSellerDetailsPage;
