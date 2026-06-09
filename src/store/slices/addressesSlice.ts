import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Address {
  id: string;
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressesState {
  items: Address[];
}

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Prathamesh Samrat',
    mobile: '9876543210',
    addressLine1: '402, Samrat Towers, MG Road',
    addressLine2: 'Near Central Plaza Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Amit Samrat',
    mobile: '9812345678',
    addressLine1: 'Plot No. 12, Koramangala Layout',
    addressLine2: 'Opposite Wipro Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560034',
    isDefault: false,
  },
];

const initialState: AddressesState = {
  items: mockAddresses,
};

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<Omit<Address, 'id' | 'isDefault'>>) {
      const id = 'addr-' + Math.random().toString(36).substr(2, 9);
      // If it's the first address, make it default, otherwise check default status
      const isFirst = state.items.length === 0;
      
      const newAddress: Address = {
        ...action.payload,
        id,
        isDefault: isFirst,
      };
      
      state.items.push(newAddress);
    },
    editAddress(state, action: PayloadAction<Address>) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteAddress(state, action: PayloadAction<string>) {
      const id = action.payload;
      const targetAddress = state.items.find(item => item.id === id);
      state.items = state.items.filter(item => item.id !== id);
      
      // If we deleted the default address and there are other addresses, make the first one default
      if (targetAddress?.isDefault && state.items.length > 0) {
        state.items[0].isDefault = true;
      }
    },
    setDefaultAddress(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.items.forEach(item => {
        item.isDefault = item.id === id;
      });
    },
  },
});

export const { addAddress, editAddress, deleteAddress, setDefaultAddress } = addressesSlice.actions;
export default addressesSlice.reducer;
