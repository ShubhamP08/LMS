import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { forgotPassword } from "../Redux/Slices/AuthSlice";

function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email) return;
    const res = await dispatch(forgotPassword(email));
    if (res?.payload?.success) {
      setSent(true);
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-4 rounded-lg p-8 text-white w-96 shadow-lg bg-gradient-to-r from-blue-900 to-purple-900"
        >
          <h1 className="text-center text-2xl font-bold">Forgot Password</h1>
          <p className="text-sm text-gray-300 text-center">
            Enter your registered email and we&apos;ll send you a reset link.
          </p>

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input input-bordered w-full text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary mt-2">
            Send Reset Link
          </button>

          {sent && (
            <p className="text-center text-sm text-green-400">
              If that email is registered, we've sent you a reset link.
            </p>
          )}

          <p className="text-center text-sm">
            Remembered your password?{" "}
            <Link to="/login" className="text-blue-300 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ForgotPassword;
