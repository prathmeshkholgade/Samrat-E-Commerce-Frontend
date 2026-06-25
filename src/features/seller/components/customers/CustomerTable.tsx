import React from 'react';
import { Eye, Mail, Phone, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SellerCustomer } from '../../../../shared/types';

interface CustomerTableProps {
  customers: SellerCustomer[];
  ordersCountMap: Record<string, number>;
  totalSpendMap: Record<string, number>;
  lastOrderDateMap: Record<string, string>;
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  ordersCountMap,
  totalSpendMap,
  lastOrderDateMap,
  currentPage,
  itemsPerPage,
  totalCount,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full space-y-6">
      
      <div className="overflow-x-auto min-h-[250px]">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Eye size={24} className="stroke-slate-350" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Customers Found</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Try refining search parameters or filters.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Contact Details</th>
                <th className="py-3 px-2 text-right">Orders Count</th>
                <th className="py-3 px-2 text-right">Total Revenue</th>
                <th className="py-3 px-2 text-center">Last Purchase</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-655">
              {customers.map((c) => {
                const ordersCount = ordersCountMap[c.email] || 0;
                const totalSpend = totalSpendMap[c.email] || 0;
                const lastOrderDate = lastOrderDateMap[c.email] || 'No orders yet';

                return (
                  <tr key={c.id} className="hover:bg-slate-55/30 transition-colors">
                    
                    {/* Customer Identity */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-650 font-black text-sm uppercase">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-slate-900 font-extrabold">{c.name}</p>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                            Customer ID: {c.id.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="py-3 px-2 text-slate-500 font-semibold space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={12} className="text-slate-400 shrink-0" />
                        <span>{c.mobile}</span>
                      </div>
                    </td>

                    {/* Orders count */}
                    <td className="py-3 px-2 text-right text-slate-900 font-extrabold text-[12px]">
                      {ordersCount}
                    </td>

                    {/* Total spend */}
                    <td className="py-3 px-2 text-right text-indigo-650 font-black text-[12px]">
                      ${totalSpend.toFixed(2)}
                    </td>

                    {/* Last order date */}
                    <td className="py-3 px-2 text-center text-slate-450 text-[11px]">
                      {lastOrderDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-2 text-right">
                      <Link
                        to={`/seller/customers/${c.id}`}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-3xs"
                      >
                        <Eye size={12} />
                        <span>View Details</span>
                      </Link>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {customers.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <span className="text-xs font-bold text-slate-450">
            Showing <span className="text-slate-800 font-black">{startItem}</span> to{' '}
            <span className="text-slate-800 font-black">{endItem}</span> of{' '}
            <span className="text-slate-800 font-black">{totalCount}</span> registered buyers
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-850 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowLeft size={14} />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => onPageChange(pg)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pg
                    ? 'bg-indigo-650 text-white shadow-md shadow-indigo-150'
                    : 'bg-white hover:bg-slate-50 text-slate-550 border border-slate-200/40 hover:border-slate-200'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-850 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerTable;
