import { configureStore } from "@reduxjs/toolkit";

import AuthSlice from "./Slices/AuthSlice";
import CourseSlice from "./Slices/CourseSlice";
import PaymentSlice from "./Slices/PaymentSlice";

const store = configureStore({
  reducer: {
    auth: AuthSlice,
    course: CourseSlice,
    payment: PaymentSlice,
  },
  devTools: true,
});

export default store;
