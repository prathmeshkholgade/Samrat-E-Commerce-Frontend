import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface WizardImage {
  id: string;
  url: string;
  isThumbnail: boolean;
}

export interface WizardVariant {
  id: string;
  name: string; // e.g. "S / Red / Cotton"
  sku: string;
  price: number;
  stock: number;
}

export interface WizardVariantConfig {
  sizes: string[];
  colors: string[];
  materials: string[];
}

export interface ProductWizardState {
  currentStep: number;
  formData: {
    // Step 1: Basic
    name: string;
    shortDescription: string;
    fullDescription: string;
    category: string;
    subcategory: string;
    brand: string;
    
    // Step 2: Media
    images: WizardImage[];
    
    // Step 3: Pricing
    sellingPrice: string;
    mrp: string;
    discount: string;
    tax: string;
    
    // Step 4: Inventory
    sku: string;
    stock: string;
    lowStockThreshold: string;
    
    // Step 5: Variants
    variants: WizardVariant[];
    variantConfig: WizardVariantConfig;
    
    // Step 6: Shipping
    weight: string;
    length: string;
    width: string;
    height: string;
    
    // Step 7: SEO
    seoTitle: string;
    seoDescription: string;
  };
}

const initialState: ProductWizardState = {
  currentStep: 1,
  formData: {
    name: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Electronics',
    subcategory: '',
    brand: '',
    images: [],
    sellingPrice: '',
    mrp: '',
    discount: '',
    tax: '18', // Default tax rate (%)
    sku: '',
    stock: '',
    lowStockThreshold: '5',
    variants: [],
    variantConfig: {
      sizes: [],
      colors: [],
      materials: [],
    },
    weight: '',
    length: '',
    width: '',
    height: '',
    seoTitle: '',
    seoDescription: '',
  },
};

const productCreateSlice = createSlice({
  name: 'productCreate',
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      if (action.payload >= 1 && action.payload <= 7) {
        state.currentStep = action.payload;
      }
    },
    updateStepData(state, action: PayloadAction<Partial<ProductWizardState['formData']>>) {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    resetWizard(state) {
      state.currentStep = 1;
      state.formData = initialState.formData;
    },
  },
});

export const { setStep, updateStepData, resetWizard } = productCreateSlice.actions;
export default productCreateSlice.reducer;
