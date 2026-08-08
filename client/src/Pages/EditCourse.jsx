import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import {
  addCourseLecture,
  deleteCourse,
  getAllCourses,
  getCourseLectures,
  updateCourseDetails,
} from "../Redux/Slices/CourseSlice";

function EditCourse() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const courses = useSelector((state) => state?.course?.courses);
  const lectures = useSelector((state) => state?.course?.lectures);
  const course = courses?.find((c) => c._id === id);

  const [updateData, setUpdateData] = useState(null);
  const formValues = updateData ?? {
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category || "",
  };

  const [lectureData, setLectureData] = useState({
    title: "",
    description: "",
    lecture: null,
  });

  useEffect(() => {
    if (!courses || courses.length === 0) {
      dispatch(getAllCourses());
    }
    dispatch(getCourseLectures(id));
  }, [dispatch, id, courses]);

  function handleUpdateChange(e) {
    const { name, value } = e.target;
    setUpdateData({ ...formValues, [name]: value });
  }

  async function onUpdateSubmit(e) {
    e.preventDefault();
    await dispatch(updateCourseDetails({ id, data: formValues }));
    dispatch(getAllCourses());
  }

  function handleLectureChange(e) {
    const { name, value } = e.target;
    setLectureData({ ...lectureData, [name]: value });
  }

  function handleLectureFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLectureData({ ...lectureData, lecture: file });
  }

  async function onLectureSubmit(e) {
    e.preventDefault();
    if (!lectureData.title || !lectureData.description) return;

    const formData = new FormData();
    formData.append("title", lectureData.title);
    formData.append("description", lectureData.description);
    if (lectureData.lecture) {
      formData.append("lecture", lectureData.lecture);
    }

    const res = await dispatch(addCourseLecture({ id, formData }));
    if (res?.payload?.success) {
      setLectureData({ title: "", description: "", lecture: null });
    }
  }

  async function onDeleteCourse() {
    await dispatch(deleteCourse(id));
    dispatch(getAllCourses());
  }

  return (
    <HomeLayout>
      <div className="text-white max-w-2xl mx-auto flex flex-col gap-10">
        <h1 className="text-3xl font-bold">Manage Course</h1>

        <form
          onSubmit={onUpdateSubmit}
          className="flex flex-col gap-3 rounded-lg p-6 bg-base-200"
        >
          <h2 className="text-xl font-semibold">Course Details</h2>

          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="input input-bordered w-full text-black"
            value={formValues.title}
            onChange={handleUpdateChange}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            className="textarea textarea-bordered w-full text-black"
            value={formValues.description}
            onChange={handleUpdateChange}
          />

          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            className="input input-bordered w-full text-black"
            value={formValues.category}
            onChange={handleUpdateChange}
          />

          <div className="flex justify-between mt-2">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button type="button" onClick={onDeleteCourse} className="btn btn-error">
              Delete Course
            </button>
          </div>
        </form>

        <form
          onSubmit={onLectureSubmit}
          className="flex flex-col gap-3 rounded-lg p-6 bg-base-200"
        >
          <h2 className="text-xl font-semibold">Add Lecture</h2>

          <label htmlFor="lectureTitle">Lecture Title</label>
          <input
            type="text"
            id="lectureTitle"
            name="title"
            className="input input-bordered w-full text-black"
            value={lectureData.title}
            onChange={handleLectureChange}
            required
          />

          <label htmlFor="lectureDescription">Lecture Description</label>
          <textarea
            id="lectureDescription"
            name="description"
            rows="3"
            className="textarea textarea-bordered w-full text-black"
            value={lectureData.description}
            onChange={handleLectureChange}
            required
          />

          <label htmlFor="lecture">Lecture Video</label>
          <input
            type="file"
            id="lecture"
            accept=".mp4,.m0v"
            className="file-input file-input-bordered w-full text-black"
            onChange={handleLectureFile}
          />

          <button type="submit" className="btn btn-primary mt-2">
            Add Lecture
          </button>
        </form>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Existing Lectures ({lectures?.length || 0})</h2>
          {lectures?.map((lecture, idx) => (
            <div key={lecture._id || idx} className="bg-base-200 rounded p-3">
              <p className="font-medium">{idx + 1}. {lecture?.title}</p>
              <p className="text-sm text-gray-300">{lecture?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default EditCourse;
