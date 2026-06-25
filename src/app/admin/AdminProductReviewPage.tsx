import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  updateProductStatus, 
  updateProductNotes 
} from '../../store/slices/adminSlice';
import { 
  ArrowLeft, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  FileText,
  AlertTriangle,
  Check, 
  X, 
  Ban, 
  Unlock,
  ClipboardList
} from 'lucide-react';
import type { ProductApproval } from '../../store/slices/adminSlice';

export const AdminProductReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.admin);

  const product = products.find((p) => p.id === id);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [localNotes, setLocalNotes] = useState('');

  // Sync notes local copy when product loads
  useEffect(() => {
    if (product) {
      setLocalNotes(product.adminNotes);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center shadow-3xs text-xs">
        <AlertTriangle className="text-rose-505 mx-auto mb-3" size={32} />
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Product Not Found</h4>
        <p className="text-[11px] text-slate-450 mt-1">No catalog item exists with ID: {id}</p>
        <button
          onClick={() => navigate('/admin/products')}
          className="mt-5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} />
          <span>Back to List</span>
        </button>
      </div>
    );
  }

  const handleStatusUpdate = (status: ProductApproval['status']) => {
    dispatch(updateProductStatus({ id: product.id, status }));
  };

  const handleNotesChange = (val: string) => {
    setLocalNotes(val);
    // Persist changes to Redux state on every keystroke
    dispatch(updateProductNotes({ id: product.id, notes: val }));
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Review Header Banner */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2.5 rounded-xl border border-slate-200/50 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Back to Catalog List"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100/50 overflow-hidden flex items-center justify-center shrink-0 text-indigo-650">
              <ShoppingBag size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none truncate max-w-[300px]">
                  {product.name}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                  product.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : product.status === 'Pending Review'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                    : product.status === 'Blocked'
                    ? 'bg-rose-50 text-rose-700 border border-rose-100'
                    : 'bg-slate-100 text-slate-605 border border-slate-205'
                }`}>
                  {product.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                SKU: {product.id} • Submitted on {product.date}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Workflow Decisions Actions Box */}
        <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex items-center gap-3 shrink-0">
          <div className="text-left">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block">Decision Actions</span>
            <p className="text-[10px] font-bold text-slate-650 mt-0.5">Moderate this catalog item</p>
          </div>
          
          <div className="flex items-center gap-1.5 font-bold">
            {product.status === 'Pending Review' && (
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

            {product.status === 'Approved' && (
              <button
                onClick={() => handleStatusUpdate('Blocked')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-205 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Ban size={13} />
                <span>Block Item</span>
              </button>
            )}

            {product.status === 'Blocked' && (
              <button
                onClick={() => handleStatusUpdate('Approved')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-205 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Unlock size={13} />
                <span>Publish Item</span>
              </button>
            )}

            {product.status === 'Rejected' && (
              <button
                onClick={() => handleStatusUpdate('Pending Review')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Revert to Review</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Images, Info, Pricing */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Images Gallery */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Thumbnails */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 order-2 md:order-1 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-14 h-14 rounded-xl border-2 overflow-hidden bg-slate-50 transition-all ${
                    activeImageIdx === idx ? 'border-indigo-650 shadow-xs' : 'border-slate-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Active view */}
            <div className="md:col-span-3 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/50 aspect-4/3 flex items-center justify-center order-1 md:order-2">
              <img
                src={product.images[activeImageIdx] || product.productImage}
                alt="Active Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          {/* Product description & info */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-left text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
              <ClipboardList className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-805 tracking-wider">Product Information</h3>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Product Name</span>
                  <p className="font-extrabold text-slate-850 mt-1 leading-snug">{product.name}</p>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Department Category</span>
                  <p className="font-semibold text-indigo-650 mt-1 uppercase tracking-wider">{product.category}</p>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Product Description</span>
                <p className="font-semibold text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Pricing parameters */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-left text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-5">
              <DollarSign className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Pricing & Taxation Details</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono font-bold text-slate-800">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-sans">MRP (Max Retail Price)</span>
                <p className="text-sm mt-1 text-slate-450 line-through">${product.pricing.mrp.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-sans">Selling Price</span>
                <p className="text-sm mt-1 text-slate-900">${product.pricing.sellingPrice.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-sans">Discount rate</span>
                <p className="text-sm mt-1 text-emerald-650">-{product.pricing.discountRate}% Off</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block font-sans">GST Rate Assignment</span>
                <p className="text-sm mt-1 text-indigo-650">{product.pricing.taxRate}% Tax Rate</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Seller Info card, Notes */}
        <div className="lg:col-span-1 space-y-6 text-xs text-left">
          
          {/* Seller profile card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <Store className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Merchant Vendor</h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Store Registered Name</span>
                <Link 
                  to={`/admin/sellers/${product.sellerId}`}
                  className="font-extrabold text-indigo-650 hover:underline mt-1 block hover:text-indigo-750"
                >
                  {product.sellerName}
                </Link>
              </div>
              
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Merchant Reference ID</span>
                <p className="font-semibold text-slate-500 font-mono mt-1">{product.sellerId}</p>
              </div>
            </div>
          </div>

          {/* Admin compliance Notes */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <FileText className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Admin Audit Notes</h3>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-bold text-slate-400 block leading-normal">
                Notes written here are saved automatically to the merchant registration audit history.
              </span>
              <textarea
                value={localNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Write catalog feedback, brand registry verifications or rejection details..."
                rows={6}
                className="w-full mt-2 bg-white border border-slate-205 rounded-xl p-3 text-xs font-semibold text-slate-800 outline-hidden focus:border-indigo-500 placeholder:text-slate-400"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminProductReviewPage;
