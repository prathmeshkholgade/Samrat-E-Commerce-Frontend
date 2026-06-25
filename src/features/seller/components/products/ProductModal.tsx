import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { SellerProduct } from '../../../../shared/types';

interface ProductModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  product: SellerProduct | null;
  categories: string[];
  onClose: () => void;
  onSubmit: (data: Omit<SellerProduct, 'id' | 'rating' | 'sales'> & { id?: string }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  mode,
  product,
  categories,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState<SellerProduct['status']>('Draft');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form / fill form when editing
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && product) {
        setName(product.name);
        setSku(product.sku);
        setCategory(product.category);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setStatus(product.status);
        setImage(product.image);
        setDescription(product.description || '');
      } else {
        setName('');
        setSku('');
        setCategory(categories[0] || 'Electronics');
        setPrice('');
        setStock('');
        setStatus('Draft');
        setImage('');
        setDescription('');
      }
      setErrors({});
    }
  }, [isOpen, mode, product, categories]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!sku.trim()) newErrors.sku = 'SKU is required';
    if (!category) newErrors.category = 'Category is required';
    
    const parsedPrice = parseFloat(price);
    if (price === '' || isNaN(parsedPrice) || parsedPrice < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    const parsedStock = parseInt(stock, 10);
    if (stock === '' || isNaN(parsedStock) || parsedStock < 0) {
      newErrors.stock = 'Stock must be a positive integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Use default Unsplash image if none is supplied
    const finalImage = image.trim() || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';

    onSubmit({
      id: product?.id,
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      status,
      image: finalImage,
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in scale-in duration-200 text-left">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-none">
              {mode === 'add' ? 'Add Product to Store' : 'Edit Product Details'}
            </h3>
            <p className="text-[10px] text-slate-450 font-bold mt-1">
              {mode === 'add' ? 'Publish a new item in your store registry' : `Ref: ${product?.id}`}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body form */}
        <form onSubmit={handleFormSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`bg-slate-50 border ${errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} hover:border-slate-350 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-450`}
                placeholder="e.g. Premium Wireless Earbuds"
              />
              {errors.name && <span className="text-[10px] text-rose-600 font-bold">{errors.name}</span>}
            </div>

            {/* SKU and Category Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SKU */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">SKU *</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className={`bg-slate-50 border ${errors.sku ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} hover:border-slate-350 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-750 font-mono outline-hidden transition-all uppercase placeholder:text-slate-450`}
                  placeholder="e.g. VLX-WNH-001"
                />
                {errors.sku && <span className="text-[10px] text-rose-600 font-bold">{errors.sku}</span>}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-10`}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Price ($) *</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`bg-slate-50 border ${errors.price ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} hover:border-slate-350 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-450`}
                  placeholder="0.00"
                />
                {errors.price && <span className="text-[10px] text-rose-600 font-bold">{errors.price}</span>}
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Stock Qty *</label>
                <input
                  type="text"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={`bg-slate-50 border ${errors.stock ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'} hover:border-slate-350 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-450`}
                  placeholder="0"
                />
                {errors.stock && <span className="text-[10px] text-rose-600 font-bold">{errors.stock}</span>}
              </div>
            </div>

            {/* Image URL and Status Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SellerProduct['status'])}
                  className="bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-10"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Image URL (Optional)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400"
                  placeholder="Leave empty for fallback image"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Product Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-450 resize-none"
                placeholder="Provide details about materials, dimensions, or technical specifications..."
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 border border-slate-200 hover:border-slate-350 text-slate-650 hover:text-slate-800 text-xs font-bold rounded-xl cursor-pointer bg-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-150 flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Check size={14} />
              <span>{mode === 'add' ? 'Publish Product' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProductModal;
