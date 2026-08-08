import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { createAccount } from "../Redux/Slices/AuthSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");
  const [signupData, setSignupData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmpass: "",
    profileImage: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSignupData({ ...signupData, profileImage: file });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (
      !signupData.fullname ||
      !signupData.email ||
      !signupData.password ||
      !signupData.confirmpass
    ) {
      return;
    }
    if (signupData.password !== signupData.confirmpass) {
      return;
    }

    const formData = new FormData();
    formData.append("fullname", signupData.fullname);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("confirmpass", signupData.confirmpass);
    if (signupData.profileImage) {
      formData.append("profileImage", signupData.profileImage);
    }

    const res = await dispatch(createAccount(formData));
    if (res?.payload?.success) {
      navigate("/");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center py-10 w-full">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-3 rounded-lg p-8 text-white w-96 shadow-lg bg-gradient-to-r from-blue-900 to-purple-900"
        >
          <h1 className="text-center text-2xl font-bold">Sign Up</h1>

          <label htmlFor="profileImage" className="flex flex-col items-center cursor-pointer">
            <div className="avatar placeholder mb-2">
              <div className="bg-neutral text-neutral-content w-20 rounded-full">
                {previewImage ? (
                  <img src={previewImage} alt="preview" className="rounded-full" />
                ) : (
                  <span className="text-2xl">+</span>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-300">Upload profile picture</span>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            className="input input-bordered w-full text-black"
            value={signupData.fullname}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="input input-bordered w-full text-black"
            value={signupData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="input input-bordered w-full text-black"
            value={signupData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="confirmpass">Confirm Password</label>
          <input
            type="password"
            id="confirmpass"
            name="confirmpass"
            className="input input-bordered w-full text-black"
            value={signupData.confirmpass}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary mt-2">
            Sign Up
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-300 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signup;
