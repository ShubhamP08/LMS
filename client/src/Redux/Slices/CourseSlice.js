import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  courses: [],
  lectures: [],
  courseDetail: null,
};

export const getAllCourses = createAsyncThunk("/course/all", async () => {
  try {
    const response = await axiosInstance.get("/course");
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch courses");
    throw error;
  }
});

export const getCourseLectures = createAsyncThunk("/course/lectures", async (id) => {
  try {
    const response = await axiosInstance.get(`/course/${id}`);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch course details");
    throw error;
  }
});

export const createNewCourse = createAsyncThunk("/course/create", async (formData) => {
  const res = axiosInstance.post("/course", formData);
  toast.promise(res, {
    loading: "Creating course...",
    success: (data) => data?.data?.message || "Course created successfully",
    error: (err) => err?.response?.data?.message || "Failed to create course",
  });
  const response = await res;
  return response.data;
});

export const updateCourseDetails = createAsyncThunk("/course/update", async ({ id, data }) => {
  const res = axiosInstance.put(`/course/${id}`, data);
  toast.promise(res, {
    loading: "Updating course...",
    success: (data) => data?.data?.message || "Course updated successfully",
    error: (err) => err?.response?.data?.message || "Failed to update course",
  });
  const response = await res;
  return response.data;
});

export const addCourseLecture = createAsyncThunk("/course/addlecture", async ({ id, formData }) => {
  const res = axiosInstance.post(`/course/${id}`, formData);
  toast.promise(res, {
    loading: "Adding lecture...",
    success: (data) => data?.data?.message || "Lecture added successfully",
    error: (err) => err?.response?.data?.message || "Failed to add lecture",
  });
  const response = await res;
  return response.data;
});

export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
  const res = axiosInstance.delete(`/course/${id}`);
  toast.promise(res, {
    loading: "Deleting course...",
    success: (data) => data?.data?.message || "Course deleted successfully",
    error: (err) => err?.response?.data?.message || "Failed to delete course",
  });
  const response = await res;
  return response.data;
});

const CourseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCourses.fulfilled, (state, action) => {
        state.courses = action?.payload?.courses || [];
      })
      .addCase(getCourseLectures.fulfilled, (state, action) => {
        state.lectures = action?.payload?.lectures || [];
        state.courseDetail = action?.payload?.course || null;
      })
      .addCase(addCourseLecture.fulfilled, (state, action) => {
        state.lectures = action?.payload?.lectures || [];
      });
  },
});

export default CourseSlice.reducer;
