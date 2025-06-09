import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProduct } from "../../types/product";

interface ICartState {
  items: IProduct[];
}

const initialState: ICartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<IProduct>) => {
      state.items.push(action.payload);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    removeMultipleFromCart: (state, action: PayloadAction<number[]>) => {
      state.items = state.items.filter(
        (item) => !action.payload.includes(item.id)
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, removeMultipleFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
