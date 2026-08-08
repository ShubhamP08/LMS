import { Link } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";

function CheckoutFail() {
  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-white text-center">
        <h1 className="text-3xl font-bold text-red-400">Payment Failed</h1>
        <p className="text-gray-300">Something went wrong while processing your payment.</p>
        <Link to="/checkout" className="btn btn-primary">
          Try Again
        </Link>
      </div>
    </HomeLayout>
  );
}

export default CheckoutFail;
