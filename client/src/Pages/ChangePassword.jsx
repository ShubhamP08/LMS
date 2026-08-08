import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { changePassword } from "../Redux/Slices/AuthSlice";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) return;
    if (formData.newPassword !== formData.confirmNewPassword) return;

    const res = await dispatch(changePassword(formData));
    if (res?.payload?.success) {
      navigate("/user/profile");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center min-h-[80vh] w-full">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-4 rounded-lg p-8 text-white w-96 shadow-lg bg-gradient-to-r from-blue-900 to-purple-900"
        >
          <h1 className="text-center text-2xl font-bold">Change Password</h1>

          <label htmlFor="oldPassword">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            className="input input-bordered w-full text-black"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />

          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="input input-bordered w-full text-black"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            className="input input-bordered w-full text-black"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary mt-2">
            Change Password
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ChangePassword;
