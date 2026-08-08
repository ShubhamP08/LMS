import './App.css'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from './Components/ProtectedRoute';
import AboutUs from './Pages/AboutUs';
import AdminDashboard from './Pages/AdminDashboard';
import ChangePassword from './Pages/ChangePassword';
import Checkout from './Pages/Checkout';
import CheckoutFail from './Pages/CheckoutFail';
import CheckoutSuccess from './Pages/CheckoutSuccess';
import ContactPage from './Pages/ContactPage';
import CourseDescription from './Pages/CourseDescription';
import CoursesPage from './Pages/CoursesPage';
import CreateCourse from './Pages/CreateCourse';
import EditCourse from './Pages/EditCourse';
import ForgotPassword from './Pages/ForgotPassword';
import HomePage from './Pages/HomePage';
import Login from './Pages/Login';
import NotFound from './Pages/NotFound';
import Profile from './Pages/Profile';
import ResetPassword from './Pages/ResetPassword';
import Signup from './Pages/Signup';
import { getUserData } from './Redux/Slices/AuthSlice';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDescription />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route
          path="/user/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute>
              <CheckoutSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/fail"
          element={
            <ProtectedRoute>
              <CheckoutFail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/course/create"
          element={
            <ProtectedRoute adminOnly>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <EditCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App
