import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: 'customer' | 'seller';
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
}

// Safely try to read user data from localStorage
const getSavedUser = (): UserData | null => {
  try {
    const data = localStorage.getItem('samrat_user_data');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

const savedUser = getSavedUser();

const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('samrat_user_data', JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('samrat_user_data');
      localStorage.removeItem('samrat_auth_token');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export type { UserData };
