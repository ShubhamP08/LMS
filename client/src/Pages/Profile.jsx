import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { getUserData, updateProfile } from "../Redux/Slices/AuthSlice";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.data);

  const [fullname, setFullname] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const displayName = fullname ?? user?.name ?? "";

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setPreviewImage(reader.result);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    if (displayName) formData.append("fullname", displayName);
    if (profileImage) formData.append("profileImage", profileImage);

    const res = await dispatch(updateProfile(formData));
    if (res?.payload?.success) {
      dispatch(getUserData());
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center py-10 w-full">
        <div className="flex flex-col gap-4 rounded-lg p-8 text-white w-96 shadow-lg bg-gradient-to-r from-blue-900 to-purple-900">
          <h1 className="text-center text-2xl font-bold">My Profile</h1>

          <div className="flex flex-col items-center gap-2">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-2">
                <img
                  src={previewImage || user?.avatar?.secure_url}
                  alt="avatar"
                />
              </div>
            </div>
            <label htmlFor="profileImage" className="btn btn-sm btn-outline btn-primary">
              Change Photo
              <input
                type="file"
                id="profileImage"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleImage}
              />
            </label>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              className="input input-bordered w-full text-black"
              value={displayName}
              onChange={(e) => setFullname(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              disabled
              className="input input-bordered w-full text-black opacity-70"
              value={user?.email || ""}
            />

            <label>Role</label>
            <input
              type="text"
              disabled
              className="input input-bordered w-full text-black opacity-70"
              value={user?.role || ""}
            />

            <label>Subscription Status</label>
            <input
              type="text"
              disabled
              className="input input-bordered w-full text-black opacity-70"
              value={user?.subscription?.status || "Not subscribed"}
            />

            <button type="submit" className="btn btn-primary mt-2">
              Save Changes
            </button>
          </form>

          <div className="flex justify-between text-sm mt-2">
            <Link to="/change-password" className="text-blue-300 hover:underline">
              Change Password
            </Link>
            {user?.role !== "ADMIN" && (
              <Link to="/checkout" className="text-blue-300 hover:underline">
                Manage Subscription
              </Link>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Profile;
