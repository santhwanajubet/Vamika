import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, getMe, updateProfile } from '../api/authApi';
import { mergeGuestCart } from './cartSlice';

export const login = createAsyncThunk('auth/login', async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await loginUser(data);
    localStorage.setItem('accessToken', res.data.data.accessToken);
    dispatch(mergeGuestCart());
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await registerUser(data);
    localStorage.setItem('accessToken', res.data.data.accessToken);
    dispatch(mergeGuestCart());
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const res = await getMe();
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Not authenticated');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutUser();
  localStorage.removeItem('accessToken');
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await updateProfile(data);
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: true, error: null },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMe.pending, (s) => { s.loading = true; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(fetchMe.rejected, (s) => { s.loading = false; s.user = null; })
      .addCase(logout.fulfilled, (s) => { s.user = null; })
      .addCase(updateUserProfile.fulfilled, (s, a) => { s.user = a.payload; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
