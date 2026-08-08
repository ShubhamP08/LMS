import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { resetPassword } from "../Redux/Slices/AuthSlice";

function ResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmpass: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!formData.password || !formData.confirmpass) return;
    if (formData.password !== formData.confirmpass) return;

    const res = await dispatch(resetPassword({ token, ...formData }));
    if (res?.payload?.success) {
      navigate("/login");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-4 rounded-lg p-8 text-white w-96 shadow-lg bg-gradient-to-r from-blue-900 to-purple-900"
        >
          <h1 className="text-center text-2xl font-bold">Reset Password</h1>

          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input input-bordered w-full text-black"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmpass">Confirm New Password</label>
          <input
            type="password"
            id="confirmpass"
            name="confirmpass"
            className="input input-bordered w-full text-black"
            value={formData.confirmpass}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary mt-2">
            Reset Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ResetPassword;
