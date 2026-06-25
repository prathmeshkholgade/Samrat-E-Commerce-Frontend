import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  addCategory, 
  updateCategory, 
  deleteCategory, 
  type AdminCategory 
} from '../../store/slices/adminSlice';
import { 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  X, 
  Layers, 
  FileText,
  Check
} from 'lucide-react';

const PRESET_IMAGES = [
  { name: 'Electronics', url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150' },
  { name: 'Mobile', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150' },
  { name: 'Laptops', url: 'https://images.unsplash.com/photo-1496181130204-7552cc14bac4?w=150' },
  { name: 'Grocery', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150' },
  { name: 'Oils & Grains', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150' },
  { name: 'Furniture', url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150' },
  { name: 'Fashion', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150' }
];

export const AdminCategoriesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.admin);

  // Layout tabs: 'tree' | 'list'
  const [activeTab, setActiveTab] = useState<'tree' | 'list'>('tree');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tree expanded state
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'cat-1': true,
    'cat-2': true,
    'cat-3': true
  });

  // Modal forms states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<AdminCategory['status']>('Active');
  const [formParentId, setFormParentId] = useState<string>('');
  
  // Form error
  const [formError, setFormError] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);

  // Toggle tree node expand/collapse
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Open Form for Create
  const handleOpenCreate = (parentId?: string) => {
    setEditingCategory(null);
    setFormName('');
    setFormImage(PRESET_IMAGES[0].url);
    setFormDescription('');
    setFormStatus('Active');
    setFormParentId(parentId || '');
    setFormError('');
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (category: AdminCategory) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormImage(category.image);
    setFormDescription(category.description);
    setFormStatus(category.status);
    setFormParentId(category.parentId || '');
    setFormError('');
    setIsFormOpen(true);
  };

  // Save Form handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Category name is required.');
      return;
    }

    // Prevent circular hierarchy (a category cannot be its own parent)
    if (editingCategory && formParentId === editingCategory.id) {
      setFormError('A category cannot be its own parent.');
      return;
    }

    const payload = {
      name: formName.trim(),
      image: formImage || 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=150',
      description: formDescription.trim(),
      status: formStatus,
      parentId: formParentId || undefined
    };

    if (editingCategory) {
      dispatch(updateCategory({
        ...editingCategory,
        ...payload
      }));
    } else {
      dispatch(addCategory(payload));
    }
    
    setIsFormOpen(false);
  };

  // Confirm delete handler
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      dispatch(deleteCategory(deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  // Build tree nodes hierarchy
  const rootCategories = categories.filter(c => !c.parentId);
  const getSubcategories = (parentId: string) => categories.filter(c => c.parentId === parentId);

  // Filter categories for the flat list view
  const filteredCategories = categories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <FolderOpen className="text-indigo-650" size={24} />
            <span>Category Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Organize catalog listing hierarchies, build parent-subcategory mappings, and control shelf visibility.
          </p>
        </div>

        <button 
          onClick={() => handleOpenCreate()}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-650 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-colors shadow-xs self-start sm:self-center cursor-pointer"
        >
          <Plus size={14} />
          <span>Add Primary Category</span>
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-6">
        
        {/* Navigation Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tree')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'tree'
                  ? 'bg-indigo-650 text-white shadow-3xs'
                  : 'bg-slate-50 text-slate-500 hover:text-slate-800'
              }`}
            >
              Tree View UI
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-indigo-650 text-white shadow-3xs'
                  : 'bg-slate-50 text-slate-500 hover:text-slate-800'
              }`}
            >
              Flat Listing Table
            </button>
          </div>

          {activeTab === 'list' && (
            <div className="flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3 py-2 max-w-xs w-full">
              <Search size={14} className="text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Tree View UI */}
        {activeTab === 'tree' && (
          <div className="space-y-4 max-w-3xl">
            {rootCategories.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                No categories configured. Click 'Add Primary Category' above.
              </div>
            ) : (
              rootCategories.map((root) => {
                const subs = getSubcategories(root.id);
                const hasSubs = subs.length > 0;
                const isExpanded = !!expandedNodes[root.id];

                return (
                  <div key={root.id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-4xs">
                    {/* Parent row */}
                    <div className="bg-slate-50/50 px-5 py-4 flex items-center justify-between gap-4 border-b border-slate-100/50">
                      <div className="flex items-center gap-3">
                        {hasSubs ? (
                          <button 
                            onClick={() => toggleNode(root.id)}
                            className="p-1 hover:bg-slate-200/50 rounded-md text-slate-500 cursor-pointer"
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        ) : (
                          <div className="w-6" />
                        )}

                        <img 
                          src={root.image} 
                          alt={root.name} 
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-800 text-sm">{root.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                              root.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {root.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-455 font-semibold block max-w-md truncate">
                            {root.description || 'No description provided.'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-650 bg-indigo-50 px-2.5 py-1 rounded-md">
                          {root.productsCount} products
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenCreate(root.id)}
                            className="p-1.5 border border-slate-200 hover:border-indigo-650 hover:text-indigo-650 text-slate-450 bg-white rounded-lg cursor-pointer transition-colors"
                            title="Add Subcategory"
                          >
                            <Plus size={13} />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(root)}
                            className="p-1.5 border border-slate-200 hover:border-blue-600 hover:text-blue-650 text-slate-450 bg-white rounded-lg cursor-pointer transition-colors"
                            title="Edit Category"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(root)}
                            className="p-1.5 border border-slate-200 hover:border-rose-600 hover:text-rose-650 text-slate-450 bg-white rounded-lg cursor-pointer transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Subcategories (Collapsible) */}
                    {hasSubs && isExpanded && (
                      <div className="divide-y divide-slate-100 bg-white pl-10">
                        {subs.map((sub) => (
                          <div key={sub.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={sub.image} 
                                alt={sub.name} 
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-700 text-xs">{sub.name}</span>
                                  <span className={`px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider ${
                                    sub.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {sub.status}
                                  </span>
                                </div>
                                <span className="text-[9px] text-slate-455 block max-w-sm truncate mt-0.5">
                                  {sub.description}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-[9px] font-bold text-slate-550">
                                {sub.productsCount} products
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleOpenEdit(sub)}
                                  className="p-1 hover:bg-slate-100 hover:text-blue-650 text-slate-400 rounded-md cursor-pointer transition-colors"
                                  title="Edit Subcategory"
                                >
                                  <Edit size={12} />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget(sub)}
                                  className="p-1 hover:bg-slate-100 hover:text-rose-655 text-slate-400 rounded-md cursor-pointer transition-colors"
                                  title="Delete Subcategory"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Flat Listing Table */}
        {activeTab === 'list' && (
          <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
            <table className="w-full text-slate-650 border-collapse">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 select-none">
                <tr>
                  <th className="px-5 py-3 text-left">Category Image</th>
                  <th className="px-5 py-3 text-left">Category Name</th>
                  <th className="px-5 py-3 text-left">Parent Category</th>
                  <th className="px-5 py-3 text-center">Products Count</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-slate-400 font-semibold">
                      No categories found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((c) => {
                    const parent = categories.find(p => p.id === c.parentId);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/20">
                        <td className="px-5 py-3 text-left">
                          <img 
                            src={c.image} 
                            alt={c.name} 
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                          />
                        </td>
                        <td className="px-5 py-3 text-left">
                          <p className="font-extrabold text-slate-805 leading-snug">{c.name}</p>
                          <span className="text-[10px] text-slate-400 font-semibold block max-w-xs truncate mt-0.5">
                            {c.description}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-left font-semibold text-slate-550">
                          {parent ? (
                            <span className="inline-flex items-center gap-1 text-indigo-650 bg-indigo-50/50 px-2 py-0.5 rounded-md text-[10px]">
                              <Layers size={10} />
                              {parent.name}
                            </span>
                          ) : (
                            <span className="text-slate-350 italic">Primary (Root)</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center font-mono font-bold text-slate-700">
                          {c.productsCount}
                        </td>
                        <td className="px-5 py-3 text-left">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                            c.status === 'Active' ? 'bg-emerald-50 text-emerald-705' : 'bg-slate-105 text-slate-500'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(c)}
                              className="p-1.5 border border-slate-105 hover:bg-slate-50 text-slate-450 hover:text-indigo-650 rounded-lg cursor-pointer transition-colors"
                              title="Edit"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(c)}
                              className="p-1.5 border border-slate-105 hover:bg-slate-50 text-slate-450 hover:text-rose-650 rounded-lg cursor-pointer transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Drawer/Modal Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-100 text-xs text-slate-650">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">Fill in configuration details below.</p>
              </div>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-650 rounded-xl font-bold">
                  {formError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smartphones, Gardening"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
                />
              </div>

              {/* Parent Category */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Parent Category</label>
                <select
                  value={formParentId}
                  onChange={(e) => setFormParentId(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650"
                >
                  <option value="">None (Primary Root Category)</option>
                  {/* Select root categories or others, filter out self to avoid cycles */}
                  {categories
                    .filter(c => !c.parentId && (!editingCategory || c.id !== editingCategory.id))
                    .map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))
                  }
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Description</label>
                <textarea
                  placeholder="Enter details about this category..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 focus:ring-1 focus:ring-indigo-650 resize-none"
                />
              </div>

              {/* Image Picker */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">Category Image URL</label>
                <input
                  type="text"
                  placeholder="Paste custom Unsplash image URL..."
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2.5 font-bold text-slate-700 outline-hidden focus:border-indigo-650 mb-3"
                />

                <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">Or choose a preset:</span>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => setFormImage(img.url)}
                      className={`relative rounded-lg overflow-hidden h-12 border cursor-pointer ${
                        formImage === img.url ? 'border-indigo-650 ring-2 ring-indigo-500/20' : 'border-slate-200'
                      }`}
                      title={img.name}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      {formImage === img.url && (
                        <div className="absolute inset-0 bg-indigo-650/40 flex items-center justify-center text-white">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                      className="text-indigo-650 focus:ring-indigo-650"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="status"
                      checked={formStatus === 'Inactive'}
                      onChange={() => setFormStatus('Inactive')}
                      className="text-indigo-650 focus:ring-indigo-650"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 text-white rounded-xl font-black hover:bg-indigo-705 cursor-pointer shadow-xs transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Target Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-3xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl overflow-hidden flex flex-col border border-slate-100 text-xs text-slate-650">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
                <Trash2 size={22} />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-805 uppercase tracking-wider">Delete Category?</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed font-semibold">
                  Are you sure you want to delete <strong className="text-slate-705">"{deleteTarget.name}"</strong>? 
                  {categories.some(c => c.parentId === deleteTarget.id) && (
                    <span className="text-rose-505 block mt-2 font-black uppercase tracking-wider text-[9px]">
                      ⚠️ Warning: Deleting this category will recursively delete all its nested subcategories.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  No, Keep it
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-750 text-white rounded-xl font-black cursor-pointer shadow-xs transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
