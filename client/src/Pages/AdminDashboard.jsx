import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { deleteCourse, getAllCourses } from "../Redux/Slices/CourseSlice";
import { getPaymentRecords } from "../Redux/Slices/PaymentSlice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state?.course?.courses);
  const allPayments = useSelector((state) => state?.payment?.allPayments);

  useEffect(() => {
    dispatch(getAllCourses());
    dispatch(getPaymentRecords());
  }, [dispatch]);

  async function onDelete(id) {
    await dispatch(deleteCourse(id));
    dispatch(getAllCourses());
  }

  return (
    <HomeLayout>
      <div className="text-white flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link to="/course/create" className="btn btn-primary">
            + Create Course
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Courses</h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-white">
                  <th>Title</th>
                  <th>Category</th>
                  <th>Lectures</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses?.map((course) => (
                  <tr key={course._id}>
                    <td>{course?.title}</td>
                    <td>{course?.category}</td>
                    <td>{course?.numberOfLectures || 0}</td>
                    <td>{course?.createdBy}</td>
                    <td className="flex gap-2">
                      <Link to={`/course/edit/${course._id}`} className="btn btn-sm btn-outline btn-primary">
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(course._id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Subscriptions ({allPayments?.count || 0})
          </h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="text-white">
                  <th>Subscription ID</th>
                  <th>Status</th>
                  <th>Plan ID</th>
                </tr>
              </thead>
              <tbody>
                {allPayments?.items?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.status}</td>
                    <td>{item.plan_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default AdminDashboard;
