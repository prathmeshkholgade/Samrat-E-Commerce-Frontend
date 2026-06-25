import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateStepData, type WizardImage } from '../../../../../store/slices/productCreateSlice';
import ImageUploadZone from '../form/ImageUploadZone';

interface Step2MediaUploadProps {
  errors: Record<string, string>;
}

export const Step2MediaUpload: React.FC<Step2MediaUploadProps> = ({ errors }) => {
  const dispatch = useAppDispatch();
  const { images } = useAppSelector((state) => state.productCreate.formData);

  const handleImagesChange = (updatedImages: WizardImage[]) => {
    dispatch(updateStepData({ images: updatedImages }));
  };

  return (
    <div className="space-y-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs">
      
      {/* Step Header */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Step 2: Media Assets Upload</h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Upload high quality images to represent your product catalog listing. Maximum 6 items allowed.</p>
      </div>

      <div className="space-y-4">
        <ImageUploadZone images={images} onChange={handleImagesChange} />
        
        {errors.images && (
          <span className="text-[10px] text-rose-600 font-bold block mt-2">
            {errors.images}
          </span>
        )}
      </div>

    </div>
  );
};

export default Step2MediaUpload;
