import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { getAllCourses } from "../Redux/Slices/CourseSlice";

function CoursesPage() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state?.course?.courses);
  const role = useSelector((state) => state?.auth?.role);

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  return (
    <HomeLayout>
      <div className="text-white">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Courses</h1>
          {role === "ADMIN" && (
            <Link to="/course/create" className="btn btn-primary">
              + Create Course
            </Link>
          )}
        </div>

        {courses?.length === 0 && (
          <p className="text-gray-300">No courses available right now.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <div key={course._id} className="card bg-base-200 shadow-xl">
              <figure className="h-48">
                <img
                  src={course?.thumbnail?.secure_url}
                  alt={course?.title}
                  className="object-cover w-full h-full"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{course?.title}</h2>
                <p className="text-sm line-clamp-2">{course?.description}</p>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span className="badge badge-primary">{course?.category}</span>
                  <span>{course?.numberOfLectures || 0} Lectures</span>
                </div>
                <p className="text-xs text-gray-400">By {course?.createdBy}</p>
                <div className="card-actions justify-end mt-3">
                  <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default CoursesPage;
