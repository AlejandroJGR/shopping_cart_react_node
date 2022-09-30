import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { url, setHeaders } from "./api";

const initialState = {
  items: [],
  status: null,
  error: null,
  createStatus: null,
  editStatus: null,
  deleteStaus: null,
};

export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async (id = null, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}products`);
      return response?.data;
    } catch (error) {
      return rejectWithValue("an error has ocurred")
    };
  },
);
export const productsCreate = createAsyncThunk(
  "products/productsCreate",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}products`, values, setHeaders()
      );
      return response?.data;
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data)
    };
  },
);
export const productsEdit = createAsyncThunk(
  "products/productsEdit",
  async (values) => {
    try {
      const response = await axios.put(
        `${url}products/${values.product._id}`, values, setHeaders()
      );
      return response?.data;
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data)
    };
  },
);
export const productsDelete = createAsyncThunk(
  "products/productsDelete",
  async (id) => {
    try {
      const response = await axios.delete(
        `${url}products/${id}`, setHeaders()
      );
      return response?.data;
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data)
    };
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: {
    [productsFetch.pending]: (state, action) => {
      state.status = "pending";
    },
    [productsFetch.fulfilled]: (state, action) => {
      state.items = action.payload;
      state.status = "success";
    },
    [productsFetch.rejected]: (state, action) => {
      state.error = action.payload;
      state.status = "rejected";
    },
    [productsCreate.pending]: (state, action) => {
      state.createStatus = "pending";
    },
    [productsCreate.fulfilled]: (state, action) => {
      state.items.push(action.payload);
      state.createStatus = "success";
      toast.success("Product Created!");
    },
    [productsCreate.rejected]: (state, action) => {
      state.error = action.payload;
      state.createStatus = "rejected";
    },
    [productsEdit.pending]: (state, action) => {
      state.editStatus = "pending";
    },
    [productsEdit.fulfilled]: (state, action) => {
      const updatedProducts = state.items.map((product) =>
        product._id === action.payload._id ? action.payload : product
      )
      state.items = updatedProducts;
      state.editStatus = "success";
      toast.info("Product Edited!");
    },
    [productsEdit.rejected]: (state, action) => {
      state.error = action.payload;
      state.editStatus = "rejected";
    },
    [productsDelete.pending]: (state, action) => {
      state.deleteStatus = "pending";
    },
    [productsDelete.fulfilled]: (state, action) => {
      const newList = state.items.filter((item) => item._id !== action.payload._id);
      state.items = newList;
      state.deleteStatus = "success";
      toast.success("Product Deleted!");
    },
    [productsDelete.rejected]: (state, action) => {
      state.error = action.payload;
      state.deleteStatus = "rejected";
    },
  },
});

export default productsSlice.reducer;