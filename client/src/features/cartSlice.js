import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart as clearCartApi, mergeCart } from '../api/cartApi';

const GUEST_CART_KEY = 'guestCart';

const loadGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

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

export const mergeGuestCart = createAsyncThunk('cart/mergeGuest', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const guestItems = getState().cart.items;
    if (guestItems.length === 0) return null;
    const res = await mergeCart({ guestItems });
    localStorage.removeItem(GUEST_CART_KEY);
    return res.data.data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadGuestCart(), loading: false, error: null },
  reducers: {
    addGuestItem: (state, action) => {
      const idx = state.items.findIndex((i) => i.variantSku === action.payload.variantSku);
      if (idx >= 0) state.items[idx].quantity += action.payload.quantity;
      else state.items.push(action.payload);
      saveGuestCart(state.items);
    },
    updateGuestItem: (state, action) => {
      const { variantSku, quantity } = action.payload;
      const idx = state.items.findIndex((i) => i.variantSku === variantSku);
      if (idx >= 0) {
        if (quantity <= 0) state.items.splice(idx, 1);
        else state.items[idx].quantity = quantity;
      }
      saveGuestCart(state.items);
    },
    removeGuestItem: (state, action) => {
      state.items = state.items.filter((i) => i.variantSku !== action.payload);
      saveGuestCart(state.items);
    },
    clearGuestCart: (state) => {
      state.items = [];
      localStorage.removeItem(GUEST_CART_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (s, a) => { s.items = a.payload.items || []; })
      .addCase(addItem.fulfilled, (s, a) => { s.items = a.payload.items || []; })
      .addCase(updateItem.fulfilled, (s, a) => { s.items = a.payload.items || []; })
      .addCase(removeItem.fulfilled, (s, a) => { s.items = a.payload.items || []; })
      .addCase(clearUserCart.fulfilled, (s) => { s.items = []; })
      .addCase(mergeGuestCart.fulfilled, (s, a) => {
        s.items = a.payload?.items || [];
        localStorage.removeItem(GUEST_CART_KEY);
      });
  },
});

export const { addGuestItem, updateGuestItem, removeGuestItem, clearGuestCart } = cartSlice.actions;
export default cartSlice.reducer;
