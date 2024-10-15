import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { CartReducerInitialState } from "../../types/reducer-types";
import { CartItem, ShippingInfo } from "../../types/types";
import { RootState } from "../store";
const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  coupon: '',
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
};


export const updateCartBackend = createAsyncThunk<
any,             // Return type (void in this case)
void,             // Argument type (void because we're not passing anything to the thunk)
{ state: RootState } // ThunkAPI config, specifying the RootState
>(
  'cart/updateBackend',
  async (_, { getState }) => {

    const {cartReducer,userReducer} = getState() as RootState;
    const userId = userReducer.user?._id
    const {data} = await axios.put(`${import.meta.env.VITE_SERVER}/api/v1/user/updateUserCart/${userId}`,cartReducer)
    console.log(data)

  }
);

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    saveToCart : (state,action : PayloadAction<any>) => {
      state.loading = true;
      console.log(action.payload)
      state.cartItems = action.payload.cartItems
      state.discount = action.payload.discount
      state.shippingCharges = action.payload.shippingCharges
      state.subtotal = action.payload.subtotal
      state.total = action.payload.total
      state.tax = action.payload.tax
      state.loading = false
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;

      const index = state.cartItems.findIndex(
        (i) => i.productId === action.payload.productId
      );

      if (index !== -1) state.cartItems[index] = action.payload;
      else state.cartItems.push(action.payload);
      state.loading = false;
    },

    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        (i) => i.productId !== action.payload
      );
      state.loading = false;
    },

    calculatePrice: (state) => {
      const subtotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subtotal = subtotal;
      state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
      state.tax = Math.round(state.subtotal * 0.18);
      state.total =
        state.subtotal + state.tax + state.shippingCharges - state.discount;
    },

    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },

    saveCoupon: (state, action: PayloadAction<string>) => {
      state.coupon = action.payload;
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    resetCart: () => initialState,

  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCartBackend.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartBackend.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateCartBackend.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  discountApplied,
  saveShippingInfo,
  resetCart,
  saveCoupon,
  saveToCart
} = cartReducer.actions;

export default cartReducer.reducer