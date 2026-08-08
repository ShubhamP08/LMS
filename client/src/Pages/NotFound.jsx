import { Link } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";

function NotFound() {
  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 text-white text-center">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="text-gray-300">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </HomeLayout>
  );
}

export default NotFound;
