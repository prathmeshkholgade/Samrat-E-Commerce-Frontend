import React from 'react';
import { Star, AlertTriangle, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import type { SellerProduct } from '../../../../../shared/types';
import ProductStatusBadge from './ProductStatusBadge';
import ProductActionsDropdown from './ProductActionsDropdown';

interface ProductTableProps {
  products: SellerProduct[];
  totalCount: number;
  selectedIds: string[];
  currentPage: number;
  itemsPerPage: number;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onPageChange: (page: number) => void;
  onViewProduct: (product: SellerProduct) => void;
  onEditProduct: (product: SellerProduct) => void;
  onDeleteProduct: (id: string) => void;
  onDuplicateProduct: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  totalCount,
  selectedIds,
  currentPage,
  itemsPerPage,
  onToggleSelect,
  onSelectAll,
  onPageChange,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  onDuplicateProduct,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // Determine if all items on the current page are selected
  const currentPageIds = products.map((p) => p.id);
  const isAllSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      // Deselect all items of current page
      onSelectAll(selectedIds.filter((id) => !currentPageIds.includes(id)));
    } else {
      // Select all items of current page
      const newSelections = [...selectedIds];
      currentPageIds.forEach((id) => {
        if (!newSelections.includes(id)) {
          newSelections.push(id);
        }
      });
      onSelectAll(newSelections);
    }
  };

  const getStockDisplay = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="text-rose-600 font-extrabold flex items-center gap-1">
          <AlertTriangle size={11} />
          <span>Out of Stock</span>
        </span>
      );
    } else if (stock < 10) {
      return (
        <span className="text-amber-600 font-extrabold flex items-center gap-1">
          <span>Low ({stock} left)</span>
        </span>
      );
    } else {
      return <span className="text-emerald-700 font-extrabold">{stock} units</span>;
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          className={`${
            i <= floor ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-200'
          }`}
        />
      );
    }
    return (
      <div className="flex items-center gap-0.5">
        {stars}
        <span className="text-[10px] text-slate-450 ml-1 font-extrabold">({rating})</span>
      </div>
    );
  };

  // Pagination bounds
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full space-y-6">
      
      {/* Table grid wrapper */}
      <div className="overflow-x-auto min-h-[250px]">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-3xs">
              <Eye size={24} className="stroke-slate-350" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Products Found</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Try refining your search queries or adding new items.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-2 w-8">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllToggle}
                    className="w-3.5 h-3.5 rounded-sm border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                </th>
                <th className="py-3 px-2">Product Info</th>
                <th className="py-3 px-2">SKU</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2 text-right">Price</th>
                <th className="py-3 px-2 text-center">Stock</th>
                <th className="py-3 px-2">Rating</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-right">Sales</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-650">
              {products.map((product) => {
                const isChecked = selectedIds.includes(product.id);
                return (
                  <tr key={product.id} className={`hover:bg-slate-50/40 transition-colors ${isChecked ? 'bg-indigo-50/10' : ''}`}>
                    
                    {/* Checkbox */}
                    <td className="py-3.5 px-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelect(product.id)}
                        className="w-3.5 h-3.5 rounded-sm border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                    </td>
                    
                    {/* Thumbnail + Name */}
                    <td className="py-3.5 px-2 flex items-center gap-3 min-w-[200px]">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-100">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <span className="text-slate-900 font-extrabold truncate max-w-[220px]" title={product.name}>
                        {product.name}
                      </span>
                    </td>
                    
                    {/* SKU */}
                    <td className="py-3.5 px-2 font-mono text-slate-800 text-[11px] select-all uppercase">
                      {product.sku}
                    </td>
                    
                    {/* Category */}
                    <td className="py-3.5 px-2 text-slate-500 text-[11px]">
                      {product.category}
                    </td>
                    
                    {/* Price */}
                    <td className="py-3.5 px-2 text-right text-slate-900 font-black">
                      ${product.price.toFixed(2)}
                    </td>
                    
                    {/* Stock */}
                    <td className="py-3.5 px-2 text-center text-[11px]">
                      {getStockDisplay(product.stock)}
                    </td>
                    
                    {/* Rating */}
                    <td className="py-3.5 px-2">
                      {renderStars(product.rating)}
                    </td>
                    
                    {/* Status badge */}
                    <td className="py-3.5 px-2 text-center">
                      <ProductStatusBadge status={product.status} />
                    </td>
                    
                    {/* Sales */}
                    <td className="py-3.5 px-2 text-right font-black text-slate-800">
                      {product.sales}
                    </td>
                    
                    {/* Actions */}
                    <td className="py-3.5 px-2 text-right">
                      <ProductActionsDropdown
                        onView={() => onViewProduct(product)}
                        onEdit={() => onEditProduct(product)}
                        onDelete={() => onDeleteProduct(product.id)}
                        onDuplicate={() => onDuplicateProduct(product.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination component */}
      {products.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <span className="text-xs font-bold text-slate-450">
            Showing <span className="text-slate-800 font-black">{startItem}</span> to{' '}
            <span className="text-slate-800 font-black">{endItem}</span> of{' '}
            <span className="text-slate-800 font-black">{totalCount}</span> products
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-850 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
              title="Previous Page"
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
              title="Next Page"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
