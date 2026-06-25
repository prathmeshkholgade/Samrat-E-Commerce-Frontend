import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Eye, Pencil, Trash2, Copy } from 'lucide-react';

interface ProductActionsDropdownProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export const ProductActionsDropdown: React.FC<ProductActionsDropdownProps> = ({
  onView,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
        title="Actions"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 rounded-xl bg-white border border-slate-100 shadow-xl py-1 z-55 text-left animate-in fade-in slide-in-from-top-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onView();
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Eye size={14} className="text-slate-400" />
            <span>View Details</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onEdit();
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Pencil size={14} className="text-slate-400" />
            <span>Edit Details</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDuplicate();
            }}
            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Copy size={14} className="text-slate-400" />
            <span>Duplicate</span>
          </button>
          
          <div className="h-px bg-slate-100 my-1" />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onDelete();
            }}
            className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductActionsDropdown;
