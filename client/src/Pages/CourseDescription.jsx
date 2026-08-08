import React from "react";
import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { getAllCourses, getCourseLectures } from "../Redux/Slices/CourseSlice";

function CourseDescription() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const courses = useSelector((state) => state?.course?.courses);
  const lectures = useSelector((state) => state?.course?.lectures);
  const courseDetail = useSelector((state) => state?.course?.courseDetail);
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);
  const subscriptionStatus = useSelector((state) => state?.auth?.data?.subscription?.status);

  const course = courseDetail || courses?.find((c) => c._id === id);
  const canViewLectures = role === "ADMIN" || subscriptionStatus === "active";

  const [selectedLectureIdx, setSelectedLectureIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [watchedLectures, setWatchedLectures] = useState(new Set());
  // Map lecture index -> percent watched (0-100)
  const [videoProgress, setVideoProgress] = useState({});
  const videoRef = React.useRef(null);

  const selectedLecture = lectures?.[selectedLectureIdx];
  const progressPercent =
    lectures?.length > 0
      ? Math.round((watchedLectures.size / lectures.length) * 100)
      : 0;

  useEffect(() => {
    if (!courses || courses.length === 0) {
      dispatch(getAllCourses());
    }
  }, [dispatch, courses]);

  // Load saved progress from localStorage when component mounts
  useEffect(() => {
    if (!isLoggedIn) return;

    const stored = localStorage.getItem(`videoProgress_${id}`);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      setVideoProgress(prev =>
        JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed
      );

      const watched = new Set(
        Object.entries(parsed)
          .filter(([, p]) => p >= 100)
          .map(([idx]) => Number(idx))
      );

      setWatchedLectures(watched);
    } catch (e) {
      console.error(e);
    }
  }, [isLoggedIn, id]);
  // Persist progress to localStorage whenever it changes
  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(`videoProgress_${id}`, JSON.stringify(videoProgress));
    }
  }, [videoProgress, isLoggedIn, id]);

  useEffect(() => {
    if (isLoggedIn && canViewLectures) {
      dispatch(getCourseLectures(id));
    }
  }, [dispatch, id, isLoggedIn, canViewLectures]);

  function handleLectureSelect(idx) {
    setSelectedLectureIdx(idx);
    setWatchedLectures((prev) => new Set([...prev, idx]));
  }

  function handleTimeUpdate(e) {
    const video = e.target;
    if (video.duration) {
      const percent = Math.round((video.currentTime / video.duration) * 100);
      setVideoProgress((prev) => ({ ...prev, [selectedLectureIdx]: percent }));
    }
  }

  function handleVideoEnded() {
    setVideoProgress((prev) => ({ ...prev, [selectedLectureIdx]: 100 }));
    setWatchedLectures((prev) => new Set([...prev, selectedLectureIdx]));
  }

  const tabs = ["overview", "attachment", "notes", "rating"];

  if (!isLoggedIn || !canViewLectures) {
    return (
      <HomeLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-white flex flex-col items-center gap-6 text-center max-w-md">
            {course && (
              <>
                <img
                  src={course?.thumbnail?.secure_url}
                  alt={course?.title}
                  className="w-48 h-32 object-cover rounded-xl shadow-lg"
                />
                <h1 className="text-3xl font-bold">{course?.title}</h1>
                <p className="text-gray-300">{course?.description}</p>
                <span className="badge badge-primary">{course?.category}</span>
                <p className="text-sm text-gray-400">By {course?.createdBy}</p>
                <p className="text-sm text-gray-400">{course?.numberOfLectures || 0} Lectures</p>
              </>
            )}
            {!isLoggedIn ? (
              <p className="text-gray-300">
                Please <Link to="/login" className="text-blue-300 hover:underline">login</Link> to view lectures.
              </p>
            ) : (
              <>
                <p className="text-gray-300">You need an active subscription to view lectures.</p>
                <Link to="/checkout" className="btn btn-primary">Subscribe Now</Link>
              </>
            )}
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <p className="text-sm font-semibold text-white">Course Progress</p>
          <p className="text-xs text-gray-300">
            {watchedLectures.size} of {lectures?.length || 0} lectures completed
          </p>
          {role === "ADMIN" && (
            <Link to={`/course/edit/${id}`} className="text-xs text-blue-400 hover:underline mt-1 inline-block">
              Manage Course →
            </Link>
          )}
        </div>
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#334155" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
              strokeDashoffset="0"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
            {progressPercent}%
          </span>
        </div>
      </div>

      <div className="flex gap-0 rounded-xl overflow-hidden border border-slate-700" style={{height:'calc(100vh - 9rem)'}}>

        <aside className="w-72 min-w-[200px] bg-slate-800 border-r border-slate-700 overflow-y-auto h-full">
          {lectures?.length === 0 && (
            <p className="text-gray-400 text-sm p-4">No lectures added yet.</p>
          )}
          {lectures?.map((lecture, idx) => {
            const isSelected = idx === selectedLectureIdx;
            const isWatched = watchedLectures.has(idx);
            return (
              <button
                key={lecture._id || idx}
                onClick={() => handleLectureSelect(idx)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-slate-700 transition-colors ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-l-4 border-l-indigo-400"
                    : "hover:bg-slate-700/50"
                }`}
              >
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {isWatched ? (
                    <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">
                      ✓
                    </span>
                  ) : isSelected ? (
                    <span className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5 inline-block" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border border-slate-500 flex items-center justify-center text-[10px] text-gray-400">
                      {idx + 1}
                    </span>
                  )}
                </span>
                <div className="flex flex-col min-w-0">
                  <span className={`text-sm font-medium leading-snug truncate ${isSelected ? "text-white" : "text-gray-300"}`}>
                    {lecture.title}
                  </span>
                  {lecture.description && (
                    <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {lecture.description}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </aside>

        <div className="flex-1 flex flex-col bg-slate-900 min-w-0 h-full overflow-y-auto">

          <div className="px-6 pt-4 pb-2">
            <p className="text-sm text-gray-400 font-medium">
              Lecture : <span className="text-white">{selectedLecture?.title || "Select a lecture"}</span>
            </p>
          </div>

          <div className="bg-black w-full h-150 flex-shrink-0">
            {selectedLecture?.video?.secure_url ? (
              <video
                ref={videoRef}
                key={selectedLecture._id || selectedLectureIdx}
                src={selectedLecture.video.secure_url}
                controls
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                No video available for this lecture.
              </div>
            )}
          </div>

          <div className="flex border-b border-slate-700 px-6 mt-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "border-indigo-400 text-white"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">

            {activeTab === "overview" && (
              <div className="flex flex-col gap-3 text-sm text-gray-300">
                <h2 className="text-lg font-semibold text-white">{course?.title}</h2>
                <p>{course?.description}</p>
                <p className="text-gray-400">Category: <span className="text-white">{course?.category}</span></p>
                <p className="text-gray-400">Instructor: <span className="text-white">{course?.createdBy}</span></p>
                <p className="text-gray-400">Total Lectures: <span className="text-white">{lectures?.length || 0}</span></p>
                {selectedLecture?.description && (
                  <div className="mt-3">
                    <p className="text-gray-400 font-medium mb-1">About this lecture:</p>
                    <p className="text-gray-300">{selectedLecture.description}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "attachment" && (
              <div className="text-gray-400 text-sm">
                <p>No attachments available for this lecture.</p>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-400">Your personal notes for this lecture:</p>
                <textarea
                  rows={8}
                  className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-gray-500 p-3 text-sm resize-none focus:outline-none focus:border-indigo-500"
                  placeholder="Write your notes here..."
                />
              </div>
            )}

            {activeTab === "rating" && (
              <div className="flex flex-col gap-5 max-w-lg">
                <h3 className="text-base font-semibold text-white">Rate your mentor</h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-3xl transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || rating) ? (
                        <AiFillStar className="text-yellow-400" />
                      ) : (
                        <AiOutlineStar className="text-gray-500" />
                      )}
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-400">
                    You rated: <span className="text-yellow-400 font-semibold">{rating} / 5</span>
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300 font-medium">
                    Would you like to share any other thoughts? <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    rows={4}
                    value={ratingComment}
                    onChange={(e) => setRatingComment(e.target.value)}
                    className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-gray-500 p-3 text-sm resize-none focus:outline-none focus:border-indigo-500"
                    placeholder="Share your experience..."
                  />
                </div>
                <button className="btn btn-primary w-fit">Submit Rating</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default CourseDescription;
