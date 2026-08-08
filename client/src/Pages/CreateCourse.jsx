import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { createNewCourse } from "../Redux/Slices/CourseSlice";

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.data);

  const [previewImage, setPreviewImage] = useState("");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    createdBy: user?.name || "",
    thumbnail: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCourseData({ ...courseData, thumbnail: file });
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setPreviewImage(reader.result);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const { title, description, category, createdBy } = courseData;
    if (!title || !description || !category || !createdBy) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("createdBy", createdBy);
    if (courseData.thumbnail) {
      formData.append("thumbnail", courseData.thumbnail);
    }

    const res = await dispatch(createNewCourse(formData));
    if (res?.payload?.success) {
      navigate("/courses");
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center py-10 w-full">
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center gap-3 rounded-lg p-8 text-white w-full max-w-md shadow-lg bg-gradient-to-r from-blue-900 to-purple-900"
        >
          <h1 className="text-center text-2xl font-bold">Create Course</h1>

          <label htmlFor="thumbnail" className="flex flex-col items-center cursor-pointer">
            <div className="w-full h-40 bg-neutral rounded-lg flex items-center justify-center overflow-hidden mb-1">
              {previewImage ? (
                <img src={previewImage} alt="preview" className="object-cover w-full h-full" />
              ) : (
                <span className="text-sm text-gray-300">Upload Thumbnail</span>
              )}
            </div>
            <input
              type="file"
              id="thumbnail"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleImage}
            />
          </label>

          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="input input-bordered w-full text-black"
            value={courseData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="textarea textarea-bordered w-full text-black"
            value={courseData.description}
            onChange={handleChange}
            required
          />

          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            className="input input-bordered w-full text-black"
            value={courseData.category}
            onChange={handleChange}
            required
          />

          <label htmlFor="createdBy">Created By</label>
          <input
            type="text"
            id="createdBy"
            name="createdBy"
            className="input input-bordered w-full text-black"
            value={courseData.createdBy}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary mt-2">
            Create Course
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default CreateCourse;
