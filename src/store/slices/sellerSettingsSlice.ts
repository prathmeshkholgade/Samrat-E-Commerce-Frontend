import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SellerSettingsState {
  storeName: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  facebook: string;
  instagram: string;
  gst: string;
  pan: string;
  taxConfig: number; // e.g. 18 for 18% GST
}

const initialState: SellerSettingsState = {
  storeName: 'Samrat Enterprises',
  description: 'Premium distributor of high-quality consumer electronics, home furniture, and organic grocery items.',
  logoUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150&auto=format&fit=crop',
  bannerUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop',
  email: 'partners@samratenterprises.com',
  phone: '+91 98765 43210',
  address: 'Plot No. 42, Industrial Area, Sector 5, Gandhinagar, Gujarat, India - 382006',
  website: 'https://www.samratenterprises.com',
  facebook: 'https://www.facebook.com/samratenterprises',
  instagram: 'https://www.instagram.com/samratenterprises',
  gst: '24AAACS1234A1Z5',
  pan: 'AAACS1234A',
  taxConfig: 18,
};

const sellerSettingsSlice = createSlice({
  name: 'sellerSettings',
  initialState,
  reducers: {
    updateSettings(state, action: PayloadAction<Partial<SellerSettingsState>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateSettings } = sellerSettingsSlice.actions;
export default sellerSettingsSlice.reducer;
