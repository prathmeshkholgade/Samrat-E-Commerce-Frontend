import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, AlertCircle } from 'lucide-react';
import type { SellerReview } from '../../../../../shared/types';

interface ReplyReviewModalProps {
  isOpen: boolean;
  review: SellerReview | null;
  onClose: () => void;
  onSave: (message: string) => Promise<void>;
}

export const ReplyReviewModal: React.FC<ReplyReviewModalProps> = ({
  isOpen,
  review,
  onClose,
  onSave,
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (review) {
      setMessage(review.reply?.message || '');
      setError('');
    }
  }, [review, isOpen]);

  if (!isOpen || !review) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please enter a response reply before saving.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave(message.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200 text-left">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-none">
              {review.reply ? "Edit Seller Reply" : "Reply to Customer Review"}
            </h3>
            <p className="text-[10px] text-slate-450 font-bold mt-1.5 uppercase font-mono">
              Review Ref: {review.id}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Review Context Card */}
          <div className="bg-slate-50 border border-slate-150/50 p-4 rounded-2xl space-y-2.5 text-xs text-slate-655">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-800">{review.customerName}</span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={`${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-slate-500 italic">"{review.comment}"</p>
            <p className="text-[9px] text-slate-400 font-bold font-mono uppercase">Product: {review.productName}</p>
          </div>

          {/* Response Textarea */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 block">Your Seller Response Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your reply to the customer here... (e.g. Thank you for your feedback! We will resolve this...)"
              className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-800 leading-relaxed"
            />
          </div>

          {/* Errors banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold">
              <AlertCircle size={14} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-550 rounded-xl text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={13} />
              <span>{isSubmitting ? 'Saving Reply...' : 'Publish Response'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ReplyReviewModal;
