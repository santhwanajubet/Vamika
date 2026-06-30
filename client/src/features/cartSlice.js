import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart as clearCartApi } from '../api/cartApi';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const res = await getCart();
    return res.data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addItem = createAsyncThunk('cart/addItem', async (data, { rejectWithValue }) => {
  try {
    const res = await addToCart(data);
    return res.data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateItem = createAsyncThunk('cart/updateItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const res = await updateCartItem(itemId, { quantity });
    return res.data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeItem = createAsyncThunk('cart/removeItem', async (itemId, { rejectWithValue }) => {
  try {
    const res = await removeCartItem(itemId);
    return res.data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearUserCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await clearCartApi();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    addGuestItem: (state, action) => {
      const idx = state.items.findIndex((i) => i.variantSku === action.payload.variantSku);
      if (idx >= 0) state.items[idx].quantity += action.payload.quantity;
      else state.items.push(action.payload);
    },
    removeGuestItem: (state, action) => {
      state.items = state.items.filter((i) => i.variantSku !== action.payload);
    },
    clearGuestCart: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (s, a) => { s.items = a.payload.items || []; })
      .addCase(addItem.fulfilled, (s, a) => { s.items = a.payload.items || []; })
      .addCase(updateItem.fulfilled, (s, a) => { s.items = a.payload.items || []; })
      .addCase(removeItem.fulfilled, (s, a) => { s.items = a.payload.items || []; })
      .addCase(clearUserCart.fulfilled, (s) => { s.items = []; });
  },
});

export const { addGuestItem, removeGuestItem, clearGuestCart } = cartSlice.actions;
export default cartSlice.reducer;
