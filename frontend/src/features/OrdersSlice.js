import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";

const initialState = {
  list: [],
  status: null,
};

export const ordersFetch = createAsyncThunk("orders/ordersFetch", async () => {
  try {
    const response = await axios.get(`${url}orders`, setHeaders());
    return response.data;
  } catch (err) {
    console.log(err);
  }
});

export const ordersEdit = createAsyncThunk(
  "ordersEdit",
  async (values, { getState }) => {
    const state = getState();
    let currentOrder = state.orders.list.filter(
      (order) => order._id === values._id
    );
    const newOrder = {
      ...currentOrder[0],
      delivery_status: values.delivery_status,
    };
    try {
      const response = await axios.put(`
      ${url}/orders/${values.id}`,
        newOrder,
        setHeaders()
      );
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);

const OrdersSlice = createSlice({
  name: "orders",
  initialState,
  reduers: {},
  extraReducers: {
    [ordersFetch.peding]: (state, action) => {
      state.status = "pending";
    },
    [ordersFetch.fulfilled]: (state, action) => {
      state.list = action.payload;
      state.status = "success";
    },
    [ordersFetch.rejected]: (state, action) => {
      state.status = "rejected";
    },
    [ordersEdit.peding]: (state, action) => {
      state.status = "pending";
    },
    [ordersEdit.fulfilled]: (state, action) => {
      const updatedOrders = state.list.map((order) =>
        order._id === action.payload._id ? action.payload : order
      );
      state.list = updatedOrders;
      state.status = "success";
    },
    [ordersEdit.rejected]: (state, action) => {
      state.status = "rejected";
    }
  }
});

export default OrdersSlice.reducer;