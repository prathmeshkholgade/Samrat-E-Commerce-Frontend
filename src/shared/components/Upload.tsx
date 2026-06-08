import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, Check } from 'lucide-react';

interface UploadProps {
  label: string;
  helperText?: string;
  accept?: string; // e.g. "image/*,application/pdf"
  maxSizeMB?: number;
  value?: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export const Upload: React.FC<UploadProps> = ({
  label,
  helperText = 'PNG, JPG or PDF up to 5MB',
  accept = 'image/*,application/pdf',
  maxSizeMB = 5,
  value,
  onChange,
  error,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setLocalError(null);
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File size must be less than ${maxSizeMB}MB.`);
      return;
    }

    // Check file type
    const acceptTypes = accept.split(',').map((t) => t.trim());
    const fileType = file.type;
    const fileName = file.name;
    const isAccepted = acceptTypes.some((type) => {
      if (type.endsWith('/*')) {
        return fileType.startsWith(type.replace('/*', ''));
      }
      if (type.startsWith('.')) {
        return fileName.endsWith(type);
      }
      return fileType === type;
    });

    if (!isAccepted) {
      setLocalError(`Invalid file format. Please upload files in these formats: ${accept}`);
      return;
    }

    // Simulate uploading progress
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          onChange(file);
          setTimeout(() => setProgress(null), 600); // clear progress bar after completion
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setLocalError(null);
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayError = error || localError;

  return (
    <div className="w-full text-left space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`
          relative w-full rounded-2xl border-2 border-dashed p-6 transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center text-center
          ${isDragActive ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:bg-slate-50/30'}
          ${displayError ? 'border-rose-300 bg-rose-50/10' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {progress !== null ? (
          // Uploading State
          <div className="w-full max-w-xs space-y-3 py-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Uploading document...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : value ? (
          // Uploaded State with Preview
          <div className="flex items-center gap-4 w-full p-2 bg-slate-50 rounded-xl border border-slate-100 relative group animate-in zoom-in-95 duration-200">
            {value.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(value)}
                alt="File preview"
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <FileText size={20} />
              </div>
            )}
            
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-800 truncate pr-6">
                {value.name}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                {(value.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="
                absolute right-2 p-1.5 rounded-lg bg-white shadow-xs border border-slate-100 text-slate-400 
                hover:text-rose-600 hover:border-rose-100 transition-all cursor-pointer
              "
            >
              <X size={14} />
            </button>
            
            <div className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs border-2 border-white">
              <Check size={10} strokeWidth={3} />
            </div>
          </div>
        ) : (
          // Idle State
          <div className="space-y-2.5">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
              <UploadCloud size={22} className="text-slate-400" />
            </div>
            
            <div>
              <p className="text-sm font-semibold text-slate-700">
                <span className="text-indigo-600 font-semibold hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{helperText}</p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p className="text-xs font-medium text-rose-600 mt-1 animate-in fade-in-50 duration-200">
          {displayError}
        </p>
      )}
    </div>
  );
};

export default Upload;
