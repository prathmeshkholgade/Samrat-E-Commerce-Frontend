import React, { useEffect } from 'react';
import { X, Printer, Download, CreditCard, ShoppingBag } from 'lucide-react';
import type { SellerOrder } from '../../../../../shared/types';

interface InvoiceTemplateProps {
  isOpen: boolean;
  order: SellerOrder | null;
  onClose: () => void;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ isOpen, order, onClose }) => {
  useEffect(() => {
    // Automatically trigger print on mount if desired, or let user trigger via button
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNum = `INV-2026-${order.id.split('-').pop()}`;
  const taxAmount = order.amount * 0.18;
  const baseAmount = order.amount / 1.18;

  return (
    <div className="fixed inset-0 z-55 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      
      {/* Dynamic print-media css injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Hide all page content except this modal container */
          body > div:not(#printable-invoice-wrapper) {
            display: none !important;
          }
          #printable-invoice-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-box {
            border: none !important;
            padding: 20px !important;
          }
        }
      `}} />

      <div 
        id="printable-invoice-wrapper"
        className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in scale-in duration-200 text-left flex flex-col justify-between"
      >
        
        {/* Buttons Action bar (Hidden on print) */}
        <div className="no-print px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Invoice Statement Preview</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="py-2 px-4 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-150 flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] transition-all"
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 border border-slate-200 hover:border-slate-350 text-slate-650 hover:text-slate-800 text-xs font-bold rounded-xl cursor-pointer bg-white transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Invoice Card Area */}
        <div className="invoice-box p-8 space-y-8 text-xs text-slate-650 leading-normal font-sans">
          
          {/* Top Invoice Header */}
          <div className="flex items-start justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-650 to-indigo-650 flex items-center justify-center text-white shadow-md font-black text-base">
                  S
                </div>
                <span className="text-base font-black text-slate-900 tracking-tight">
                  SAMRAT ENTERPRISES
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed max-w-xs">
                Premium multi-vendor merchant marketplace.<br />
                Support line: billing@samrat.com
              </p>
            </div>
            
            <div className="text-right space-y-1">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Tax Invoice</h2>
              <p className="font-extrabold text-slate-800">Invoice: {invoiceNum}</p>
              <p className="text-[10px] text-slate-400 font-bold">Date: {order.date}</p>
              <p className="text-[10px] text-slate-400 font-bold">Order ID: {order.id}</p>
            </div>
          </div>

          {/* Billing addresses */}
          <div className="grid grid-cols-2 gap-6 border-b border-slate-100 pb-6">
            <div>
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block mb-1.5">Billed To (Customer)</span>
              <p className="text-slate-850 font-black text-sm">{order.shippingAddress.fullName}</p>
              <p className="mt-1 font-semibold">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p className="font-semibold">{order.shippingAddress.addressLine2}</p>}
              <p className="font-semibold">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p className="font-semibold">Contact: {order.customerPhone}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block mb-1.5">Supplier Store (Seller)</span>
              <p className="text-slate-850 font-black text-sm">Samrat Enterprises LLC</p>
              <p className="mt-1 font-semibold">Warehouse Block A, industrial Hub</p>
              <p className="font-semibold">Tech City Phase 2</p>
              <p className="font-semibold">Karnataka, India - 560100</p>
              <p className="font-semibold">GSTIN: 29AABCS1421Q1Z3</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block">Itemized Statement</span>
            <table className="w-full text-xs text-left border-collapse border border-slate-100 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black text-slate-400 uppercase select-none">
                  <th className="py-2.5 px-4">Item Details</th>
                  <th className="py-2.5 px-4 text-right">Unit Price</th>
                  <th className="py-2.5 px-4 text-center">Qty</th>
                  <th className="py-2.5 px-4 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                {order.products.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-800 font-extrabold">{item.name}</p>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && ' | '}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-center font-extrabold">{item.quantity}</td>
                    <td className="py-3.5 px-4 text-right text-slate-900 font-black">${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            
            {/* Payment Details info */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2 font-semibold">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block mb-1">Transaction specifics</span>
              <p className="flex items-center gap-1.5">
                <CreditCard size={13} className="text-slate-400" />
                <span>Payment Mode: {order.paymentMethod}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShoppingBag size={13} className="text-slate-400" />
                <span>Payment Status: <span className="font-extrabold">{order.paymentStatus}</span></span>
              </p>
              <div className="h-px bg-slate-200/50 my-1" />
              <p className="text-[10px] text-slate-400 leading-normal font-medium">
                Thank you for buying from Samrat. This is a computer generated invoice and requires no physical signature.
              </p>
            </div>

            {/* Calculations summaries */}
            <div className="space-y-2 font-bold text-slate-550 text-right pr-2">
              <div className="flex justify-between max-w-xs ml-auto">
                <span className="text-slate-400">Taxable Value</span>
                <span className="text-slate-800">${baseAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between max-w-xs ml-auto">
                <span className="text-slate-400">Integrated GST (18%)</span>
                <span className="text-slate-800">${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between max-w-xs ml-auto">
                <span className="text-slate-400">Shipping Charges</span>
                <span className="text-emerald-700 font-extrabold">FREE</span>
              </div>
              
              <div className="h-px bg-slate-200 max-w-xs ml-auto my-1.5" />
              
              <div className="flex justify-between max-w-xs ml-auto text-sm text-slate-900 font-black">
                <span>Total Amount (Net)</span>
                <span className="text-indigo-650 text-base font-black">${order.amount.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default InvoiceTemplate;
