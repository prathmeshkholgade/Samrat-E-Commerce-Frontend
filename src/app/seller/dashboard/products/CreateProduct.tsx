import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { setStep, resetWizard } from '../../../../store/slices/productCreateSlice';
import { useAddSellerProductMutation } from '../../../../store/services/sellerApi';

// Steps components
import Step1BasicInfo from './components/steps/Step1BasicInfo';
import Step2MediaUpload from './components/steps/Step2MediaUpload';
import Step3Pricing from './components/steps/Step3Pricing';
import Step4Inventory from './components/steps/Step4Inventory';
import Step5Variants from './components/steps/Step5Variants';
import Step6Shipping from './components/steps/Step6Shipping';
import Step7SEO from './components/steps/Step7SEO';

export const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentStep, formData } = useAppSelector((state) => state.productCreate);
  const [addProduct, { isLoading }] = useAddSellerProductMutation();

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const stepTitles = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Media' },
    { num: 3, title: 'Pricing' },
    { num: 4, title: 'Inventory' },
    { num: 5, title: 'Variants' },
    { num: 6, title: 'Shipping' },
    { num: 7, title: 'SEO' },
  ];

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) errors.name = 'Product name is required';
      if (!formData.category.trim()) errors.category = 'Category is required';
    }

    if (step === 2) {
      if (formData.images.length === 0) {
        errors.images = 'Please upload at least one product image';
      }
    }

    if (step === 3) {
      const priceVal = parseFloat(formData.sellingPrice);
      const mrpVal = parseFloat(formData.mrp);
      
      if (formData.mrp === '' || isNaN(mrpVal) || mrpVal <= 0) {
        errors.mrp = 'MRP must be a positive number';
      }
      if (formData.sellingPrice === '' || isNaN(priceVal) || priceVal <= 0) {
        errors.sellingPrice = 'Selling price must be a positive number';
      } else if (!isNaN(mrpVal) && priceVal > mrpVal) {
        errors.sellingPrice = 'Selling price cannot exceed the Maximum Retail Price (MRP)';
      }
    }

    if (step === 4) {
      if (!formData.sku.trim()) errors.sku = 'SKU code is required';
      
      const stockVal = parseInt(formData.stock, 10);
      if (formData.stock === '' || isNaN(stockVal) || stockVal < 0) {
        errors.stock = 'Stock must be a positive integer';
      }
      
      const thresholdVal = parseInt(formData.lowStockThreshold, 10);
      if (formData.lowStockThreshold === '' || isNaN(thresholdVal) || thresholdVal < 0) {
        errors.lowStockThreshold = 'Low stock threshold must be a positive integer';
      }
    }

    if (step === 6) {
      const w = parseFloat(formData.weight);
      const l = parseFloat(formData.length);
      const wd = parseFloat(formData.width);
      const h = parseFloat(formData.height);

      if (formData.weight === '' || isNaN(w) || w <= 0) errors.weight = 'Weight must be greater than 0';
      if (formData.length === '' || isNaN(l) || l <= 0) errors.length = 'Length must be greater than 0';
      if (formData.width === '' || isNaN(wd) || wd <= 0) errors.width = 'Width must be greater than 0';
      if (formData.height === '' || isNaN(h) || h <= 0) errors.height = 'Height must be greater than 0';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      dispatch(setStep(currentStep + 1));
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      dispatch(setStep(currentStep - 1));
    }
  };

  const handlePublish = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const coverImage = formData.images.find((img) => img.isThumbnail)?.url || formData.images[0]?.url || '';
      
      // Map variants configurations
      const finalVariants = formData.variants.length > 0 ? formData.variants : [];
      
      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        category: formData.category,
        price: parseFloat(formData.sellingPrice),
        stock: parseInt(formData.stock, 10),
        status: 'Published' as const, // default newly created items to Published
        image: coverImage,
        description: formData.fullDescription.trim(),
        shortDescription: formData.shortDescription.trim(),
        subcategory: formData.subcategory.trim(),
        brand: formData.brand.trim(),
        images: formData.images,
        mrp: parseFloat(formData.mrp),
        discount: parseFloat(formData.discount) || 0,
        tax: parseFloat(formData.tax) || 18,
        lowStockThreshold: parseInt(formData.lowStockThreshold, 10) || 5,
        variants: finalVariants,
        variantConfig: formData.variantConfig,
        shipping: {
          weight: parseFloat(formData.weight),
          length: parseFloat(formData.length),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height),
        },
        seo: {
          title: formData.seoTitle.trim() || formData.name.trim(),
          description: formData.seoDescription.trim() || formData.shortDescription.trim(),
        },
      };

      await addProduct(payload).unwrap();
      dispatch(resetWizard());
      navigate('/seller/products');
    } catch (err) {
      console.error('Failed to create product via wizard:', err);
      alert('Error creating product. Please verify all wizard steps.');
    }
  };

  // Render Step component
  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo errors={validationErrors} />;
      case 2:
        return <Step2MediaUpload errors={validationErrors} />;
      case 3:
        return <Step3Pricing errors={validationErrors} />;
      case 4:
        return <Step4Inventory errors={validationErrors} />;
      case 5:
        return <Step5Variants errors={validationErrors} />;
      case 6:
        return <Step6Shipping errors={validationErrors} />;
      case 7:
        return <Step7SEO errors={validationErrors} />;
      default:
        return <Step1BasicInfo errors={validationErrors} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      
      {/* Back to Products header link */}
      <button
        onClick={() => {
          dispatch(resetWizard());
          navigate('/seller/products');
        }}
        className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-indigo-650 cursor-pointer transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Catalog Registry</span>
      </button>

      {/* Progress Stepper Bar Header */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0">
          {stepTitles.map((step) => {
            const isCompleted = step.num < currentStep;
            const isActive = step.num === currentStep;
            
            return (
              <React.Fragment key={step.num}>
                <div 
                  onClick={() => {
                    // Allow clicking back to already completed steps
                    if (step.num < currentStep) {
                      dispatch(setStep(step.num));
                    }
                  }}
                  className={`flex items-center gap-2.5 transition-all select-none ${
                    step.num < currentStep ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  {/* Circle Step Number */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all border ${
                    isCompleted 
                      ? 'bg-indigo-50 border-indigo-150 text-indigo-600' 
                      : isActive 
                        ? 'bg-indigo-650 border-indigo-650 text-white shadow-md shadow-indigo-150' 
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? <Check size={14} /> : step.num}
                  </div>
                  
                  {/* Title */}
                  <span className={`text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors ${
                    isActive ? 'text-indigo-650' : 'text-slate-400'
                  }`}>
                    {step.title}
                  </span>
                </div>

                {/* Separator Line */}
                {step.num < 7 && (
                  <div className={`flex-1 h-px min-w-[20px] transition-colors ${
                    isCompleted ? 'bg-indigo-500/30' : 'bg-slate-150'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Dynamic Step Content Component */}
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-250">
        {renderStepComponent()}
      </div>

      {/* Step Errors Alert */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-rose-50 border border-rose-150/40 p-4 rounded-2xl flex gap-3 text-xs font-extrabold text-rose-800 leading-normal animate-in shake duration-200">
          <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-black">Please resolve input errors before proceeding:</p>
            <ul className="list-disc pl-4 font-semibold text-rose-750">
              {Object.values(validationErrors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        {/* Back */}
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="py-3 px-6 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-650 hover:text-slate-800 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back Step</span>
        </button>

        {/* Next or Publish */}
        {currentStep < 7 ? (
          <button
            onClick={handleNext}
            className="py-3 px-6 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-150 flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <span>Next Step</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-150 flex items-center gap-1.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check size={14} />
            )}
            <span>Publish Catalog Product</span>
          </button>
        )}
      </div>

    </div>
  );
};

export default CreateProduct;
