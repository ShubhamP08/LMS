import { Link } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";

function CheckoutSuccess() {
  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-white text-center">
        <h1 className="text-3xl font-bold text-green-400">Payment Successful!</h1>
        <p className="text-gray-300">You now have access to all premium courses.</p>
        <Link to="/courses" className="btn btn-primary">
          Explore Courses
        </Link>
      </div>
    </HomeLayout>
  );
}

export default CheckoutSuccess;
