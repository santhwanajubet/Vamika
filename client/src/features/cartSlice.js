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

export const addItem = createAsyncThunk('cart/addItem', async (data, { getState, dispatch, rejectWithValue }) => {
  const prevItems = getState().cart.items;
  const existing = prevItems.find((i) => i.variantSku === data.variantSku);
  if (existing) {
    dispatch({ type: 'cart/optimisticUpdate', payload: prevItems.map((i) => i.variantSku === data.variantSku ? { ...i, quantity: i.quantity + (data.quantity || 1) } : i) });
  } else {
    dispatch({ type: 'cart/optimisticUpdate', payload: [...prevItems, { variantSku: data.variantSku, quantity: data.quantity || 1, price: data.price || 0, name: data.name || '', image: data.image || '', product: { _id: data.productId, name: data.name, images: [data.image] } }] });
  }
  try {
    const res = await addToCart(data);
    return res.data.data.cart;
  } catch (err) {
    dispatch({ type: 'cart/optimisticUpdate', payload: prevItems });
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
  initialState: { items: loadGuestCart(), loading: false, error: null, pendingItem: null },
  reducers: {
    optimisticUpdate: (state, action) => {
      state.items = action.payload;
    },
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
      .addCase(fetchCart.fulfilled, (s, a) => { s.items = a.payload.items || []; s.loading = false; })
      .addCase(fetchCart.pending, (s) => { s.loading = true; })
      .addCase(addItem.fulfilled, (s, a) => { s.items = a.payload.items || []; s.loading = false; })
      .addCase(addItem.pending, (s) => { s.loading = true; })
      .addCase(updateItem.pending, (s, a) => { s.pendingItem = a.meta.arg.itemId; })
      .addCase(updateItem.fulfilled, (s, a) => { s.items = a.payload.items || []; s.pendingItem = null; })
      .addCase(updateItem.rejected, (s) => { s.pendingItem = null; })
      .addCase(removeItem.pending, (s, a) => { s.pendingItem = a.meta.arg; })
      .addCase(removeItem.fulfilled, (s, a) => { s.items = a.payload.items || []; s.pendingItem = null; })
      .addCase(removeItem.rejected, (s) => { s.pendingItem = null; })
      .addCase(clearUserCart.fulfilled, (s) => { s.items = []; })
      .addCase(mergeGuestCart.fulfilled, (s, a) => {
        s.items = a.payload?.items || [];
        localStorage.removeItem(GUEST_CART_KEY);
      });
  },
});

export const { addGuestItem, updateGuestItem, removeGuestItem, clearGuestCart } = cartSlice.actions;
export default cartSlice.reducer;
