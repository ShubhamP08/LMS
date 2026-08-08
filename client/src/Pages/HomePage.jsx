
import { Link } from 'react-router-dom';

import HomePageimg from '../assets/homepageimg.png';
import HomeLayout from '../Layouts/HomeLayout';
function HomePage() {
  return (
    <HomeLayout>
      <div className="text-white flex flex-col md:flex-row items-center justify-center gap-10 mx-16 min-h-[70vh]">
        <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-5xl font-semibold ">
                Find the best
                <span className="text-blue-500 font-bold"> Online Courses</span>
            </h1>
            <p className="text-lg text-gray-300">
                Discover a wide range of online courses to suit your learning needs and career goals.
            </p>
            <div className="space-x-6">
                <Link to="/courses" className="btn btn-primary px-6 text-lg font-semibold transition-all duration-300">
                    Explore Courses
                </Link>
                <Link to="/about" className="btn btn-outline btn-primary px-6 text-lg font-semibold transition-all duration-300">
                    Learn More
                </Link>
            </div>
        </div>
        <div className="w-full md:w-5/7 items-center justify-center">
            <img src={HomePageimg} alt="Online Courses" className="rounded-lg max-w-full h-auto object-contain drop-shadow-2xl" />
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;