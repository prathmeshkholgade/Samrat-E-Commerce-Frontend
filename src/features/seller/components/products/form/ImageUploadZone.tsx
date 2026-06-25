import React, { useState } from 'react';
import { UploadCloud, Trash2, ArrowLeft, ArrowRight, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import type { WizardImage } from '../../../../../store/slices/productCreateSlice';

interface ImageUploadZoneProps {
  images: WizardImage[];
  onChange: (images: WizardImage[]) => void;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({ images, onChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (files: FileList) => {
    const remainingSlots = 6 - images.length;
    if (remainingSlots <= 0) {
      alert('You can upload a maximum of 6 images.');
      return;
    }

    const filesArray = Array.from(files).slice(0, remainingSlots);
    const newImagesPromise = filesArray.map((file) => {
      return new Promise<WizardImage>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: e.target?.result as string,
            isThumbnail: false,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromise).then((newImages) => {
      // If there's no thumbnail currently, make the first uploaded image the thumbnail
      const hasThumbnail = images.some((img) => img.isThumbnail);
      let updatedImages = [...images, ...newImages];
      if (!hasThumbnail && updatedImages.length > 0) {
        updatedImages[0] = { ...updatedImages[0], isThumbnail: true };
      }
      onChange(updatedImages);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemove = (id: string) => {
    const removedImg = images.find((img) => img.id === id);
    let updated = images.filter((img) => img.id !== id);
    
    // If deleted image was the thumbnail, reassign thumbnail to first image
    if (removedImg?.isThumbnail && updated.length > 0) {
      updated[0] = { ...updated[0], isThumbnail: true };
    }
    onChange(updated);
  };

  const handleSetThumbnail = (id: string) => {
    const updated = images.map((img) => ({
      ...img,
      isThumbnail: img.id === id,
    }));
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Upload Zone container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('wizard-file-input')?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50/20' 
            : 'border-slate-200 hover:border-slate-350 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          id="wizard-file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
        <div className="w-12 h-12 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-450 shadow-3xs mb-4">
          <UploadCloud size={24} className="text-indigo-650" />
        </div>
        <div>
          <p className="text-xs font-black text-slate-800">
            Drag and drop product images here, or <span className="text-indigo-600 hover:underline">browse files</span>
          </p>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">
            Supports PNG, JPG, JPEG. Max 6 files. (Recommended resolution: 800x800 px)
          </p>
        </div>
        <div className="mt-3.5 px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase">
          {images.length} / 6 slots filled
        </div>
      </div>

      {/* Uploaded Images List grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Uploaded Media Registry</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                className={`group relative bg-white border rounded-2xl overflow-hidden shadow-3xs hover:shadow-xs transition-all flex flex-col justify-between ${
                  img.isThumbnail ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-100'
                }`}
              >
                {/* Preview Thumbnail */}
                <div className="aspect-square w-full relative bg-slate-50 border-b border-slate-50">
                  <img src={img.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Thumbnail Badge indicator overlay */}
                  {img.isThumbnail && (
                    <div className="absolute top-1.5 left-1.5 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm" title="Primary Thumbnail">
                      <CheckCircle2 size={12} className="fill-indigo-600" />
                    </div>
                  )}

                  {/* Actions overlay panel */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRemove(img.id)}
                      className="p-1.5 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg shadow-sm transition-all cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-2 bg-slate-50/50 flex flex-col gap-1.5">
                  {/* Thumbnail Radio toggle */}
                  <button
                    type="button"
                    onClick={() => handleSetThumbnail(img.id)}
                    className={`w-full py-1 text-[8px] font-black rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                      img.isThumbnail
                        ? 'bg-indigo-650 text-white border-indigo-650'
                        : 'bg-white text-slate-500 hover:text-slate-800 border-slate-200'
                    }`}
                  >
                    <ImageIcon size={9} />
                    <span>{img.isThumbnail ? 'Thumbnail' : 'Set Cover'}</span>
                  </button>

                  {/* Reorder Buttons */}
                  <div className="flex items-center justify-between gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'left')}
                      className="flex-1 py-0.5 border border-slate-200 bg-white rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer flex items-center justify-center"
                      title="Move Left"
                    >
                      <ArrowLeft size={10} />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => handleMove(index, 'right')}
                      className="flex-1 py-0.5 border border-slate-200 bg-white rounded-md text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer flex items-center justify-center"
                      title="Move Right"
                    >
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ImageUploadZone;
