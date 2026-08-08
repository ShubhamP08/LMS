import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayments: {},
};

export const getRazorpayKey = createAsyncThunk("/payment/razorpaykey", async () => {
  try {
    const response = await axiosInstance.get("/payment/razorpaykey");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch payment key");
    throw error;
  }
});

export const buySubscription = createAsyncThunk("/payment/subscribe", async () => {
  const res = axiosInstance.post("/payment/subscribe");
  toast.promise(res, {
    loading: "Initiating subscription...",
    success: (data) => data?.data?.message || "Subscription initiated",
    error: (err) => err?.response?.data?.message || "Failed to initiate subscription",
  });
  const response = await res;
  return response.data;
});

export const verifyPayment = createAsyncThunk("/payment/verify", async (data) => {
  const res = axiosInstance.post("/payment/verify", data);
  toast.promise(res, {
    loading: "Verifying payment...",
    success: (data) => data?.data?.message || "Payment verified successfully",
    error: (err) => err?.response?.data?.message || "Payment verification failed",
  });
  const response = await res;
  return response.data;
});

export const cancelSubscription = createAsyncThunk("/payment/cancel", async () => {
  const res = axiosInstance.get("/payment/cancel-subscription");
  toast.promise(res, {
    loading: "Cancelling subscription...",
    success: (data) => data?.data?.message || "Subscription cancelled successfully",
    error: (err) => err?.response?.data?.message || "Failed to cancel subscription",
  });
  const response = await res;
  return response.data;
});

export const getPaymentRecords = createAsyncThunk("/payment/records", async (count = 100) => {
  try {
    const response = await axiosInstance.get(`/payment/all?count=${count}`);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch payment records");
    throw error;
  }
});

const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorpayKey.fulfilled, (state, action) => {
        state.key = action?.payload?.key;
      })
      .addCase(buySubscription.fulfilled, (state, action) => {
        state.subscription_id = action?.payload?.subscriptionId;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.isPaymentVerified = true;
      })
      .addCase(verifyPayment.rejected, (state) => {
        state.isPaymentVerified = false;
      })
      .addCase(getPaymentRecords.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.subscriptions || {};
      });
  },
});

export default PaymentSlice.reducer;
