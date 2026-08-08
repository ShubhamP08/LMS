import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { login } from "../Redux/Slices/AuthSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      return;
    }
    const res = await dispatch(login(loginData));
    if (res?.payload?.success) {
      navigate("/");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-4 rounded-lg p-8 text-white w-96 shadow-lg bg-gradient-to-r from-blue-900 to-purple-900"
        >
          <h1 className="text-center text-2xl font-bold">Login</h1>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input input-bordered w-full text-black"
              placeholder="you@example.com"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="input input-bordered w-full text-black"
              placeholder="********"
              value={loginData.password}
              onChange={handleChange}
              required
            />
            <Link to="/forgot-password" className="text-sm text-blue-300 hover:underline self-end">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary mt-2">
            Login
          </button>

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-300 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Login;
