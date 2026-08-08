import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Footer from "../Components/Footer";
import { logout } from "../Redux/Slices/AuthSlice";
function HomeLayout({ children }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);

  function changeWidth(){
    const drawer = document.getElementById("my-drawer");
    if (drawer) {
      drawer.checked = !drawer.checked;
    }
  }

  async function HandleLogout(e) {
    e.preventDefault();
    const res = await dispatch(logout());
    if (res?.payload?.success) {
      navigate("/");
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <div className="drawer flex-grow flex flex-col">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col flex-grow">
          <header className="p-4 bg-slate-800 flex items-center">
            <label htmlFor="my-drawer" className="btn btn-ghost btn-circle drawer-button">
              <FiMenu size={28} />
            </label>
          </header>
          <main className="flex-grow p-6">
            {children}
          </main>
        </div>
        <div className="drawer-side z-50">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content relative flex flex-col justify-between">
            
            {/* Top Section: Navigation Links */}
            <div>
              <li className="absolute top-4 right-4 z-10">
                <button className="btn btn-ghost btn-circle"> 
                  <AiFillCloseCircle size={24} onClick={changeWidth}/>
                </button>
              </li>
              
              <li className="mt-16 text-lg"><Link to="/">Home</Link></li>
              
              {isLoggedIn && role === "ADMIN" && (
                <li className="text-lg"><Link to="/admin/dashboard">Admin Dashboard</Link></li>
              )}
              <li className="text-lg"><Link to="/courses">All Courses</Link></li>
              <li className="text-lg"><Link to="/about">About Us</Link></li>
              <li className="text-lg"><Link to="/contact">Contact Us</Link></li>
            </div>

            {/* Bottom Section: Auth Buttons perfectly formatted as an li element */}
            {!isLoggedIn && (
              <li className="mt-auto pt-6">
                <div className="flex w-full gap-3 justify-center items-center">
                  <Link 
                    to="/login" 
                    className="btn btn-primary flex-1 text-center font-semibold rounded-md min-h-0 h-10"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="btn btn-outline btn-primary flex-1 text-center font-semibold rounded-md min-h-0 h-10"
                  >
                    Register
                  </Link>
                </div>
              </li>
            )}
            {isLoggedIn && (
              <li className="mt-auto pt-6">
                <div className="flex w-full gap-3 justify-center items-center">
                  <Link 
                    to="/user/profile" 
                    className="btn btn-primary flex-1 text-center font-semibold rounded-md min-h-0 h-10"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/logout" 
                    className="btn btn-outline btn-primary flex-1 text-center font-semibold rounded-md min-h-0 h-10"
                    onClick={HandleLogout}
                  >
                    Logout
                  </Link>
                </div>
              </li>
            )}
            
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomeLayout;