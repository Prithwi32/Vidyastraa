"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function CoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    axios.get("/api/courses/enrolled")
      .then((res) => setEnrolledCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <div>
      <h3 className="text-xl font-semibold">📚 Enrolled Courses</h3>
      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500">No courses enrolled.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {enrolledCourses.map(({ course }) => (
            <Link href={`/student/dashboard/courses/${course.id}`} key={course.id} className="block">
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
                <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded" />
                <h4 className="font-semibold mt-2">{course.title}</h4>
                <p className="text-sm text-gray-600">{course.difficultyLevel}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
