import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  role: localStorage.getItem("role") || "",
  data: JSON.parse(localStorage.getItem("data")) || {},
};

export const createAccount = createAsyncThunk("/auth/register", async (formData) => {
  const res = axiosInstance.post("/user/register", formData);
  toast.promise(res, {
    loading: "Creating your account...",
    success: (data) => data?.data?.message || "Account created successfully",
    error: (err) => err?.response?.data?.message || "Failed to create account",
  });
  const response = await res;
  return response.data;
});

export const login = createAsyncThunk("/auth/login", async (formData) => {
  const res = axiosInstance.post("/user/login", formData);
  toast.promise(res, {
    loading: "Logging in...",
    success: (data) => data?.data?.message || "Logged in successfully",
    error: (err) => err?.response?.data?.message || "Failed to log in",
  });
  const response = await res;
  return response.data;
});

export const logout = createAsyncThunk("/auth/logout", async () => {
  const res = axiosInstance.post("/user/logout");
  toast.promise(res, {
    loading: "Logging out...",
    success: (data) => data?.data?.message || "Logged out successfully",
    error: (err) => err?.response?.data?.message || "Failed to log out",
  });
  const response = await res;
  return response.data;
});

export const getUserData = createAsyncThunk("/auth/getdetails", async () => {
  const response = await axiosInstance.get("/user/getdetails");
  return response.data;
});

export const updateProfile = createAsyncThunk("/auth/update", async (formData) => {
  const res = axiosInstance.put("/user/update", formData);
  toast.promise(res, {
    loading: "Updating profile...",
    success: (data) => data?.data?.message || "Profile updated successfully",
    error: (err) => err?.response?.data?.message || "Failed to update profile",
  });
  const response = await res;
  return response.data;
});

export const changePassword = createAsyncThunk("/auth/change-password", async (formData) => {
  const res = axiosInstance.post("/user/change-password", formData);
  toast.promise(res, {
    loading: "Changing password...",
    success: (data) => data?.data?.message || "Password changed successfully",
    error: (err) => err?.response?.data?.message || "Failed to change password",
  });
  const response = await res;
  return response.data;
});

export const forgotPassword = createAsyncThunk("/auth/reset", async (email) => {
  const res = axiosInstance.post("/user/reset", { email });
  toast.promise(res, {
    loading: "Sending reset link...",
    success: (data) => data?.data?.message || "Reset link sent to your email",
    error: (err) => err?.response?.data?.message || "Failed to send reset link",
  });
  const response = await res;
  return response.data;
});

export const resetPassword = createAsyncThunk("/auth/reset/token", async (data) => {
  const { token, ...rest } = data;
  const res = axiosInstance.post(`/user/reset/${token}`, rest);
  toast.promise(res, {
    loading: "Resetting password...",
    success: (data) => data?.data?.message || "Password reset successfully",
    error: (err) => err?.response?.data?.message || "Failed to reset password",
  });
  const response = await res;
  return response.data;
});

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        state.isLoggedIn = true;
        state.data = user || {};
        state.role = user?.role || "";
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("data", JSON.stringify(user || {}));
        localStorage.setItem("role", user?.role || "");
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        state.isLoggedIn = true;
        state.data = user || {};
        state.role = user?.role || "";
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("data", JSON.stringify(user || {}));
        localStorage.setItem("role", user?.role || "");
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
        localStorage.clear();
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        if (user) {
          state.isLoggedIn = true;
          state.data = user;
          state.role = user?.role || "";
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("data", JSON.stringify(user));
          localStorage.setItem("role", user?.role || "");
        }
      })
      .addCase(getUserData.rejected, (state) => {
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
        localStorage.clear();
      });
  },
});

export default AuthSlice.reducer;
