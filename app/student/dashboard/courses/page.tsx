"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function CoursesPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("/api/courses/enrolled")
      .then((res) => setEnrolledCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <div className="container py-6">
      <h3 className="text-2xl font-semibold text-purple-800">📚 Enrolled Courses</h3>
      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500 mt-4">No courses enrolled.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {enrolledCourses.map(({ id, title, thumbnail, difficultyLevel }) => (
            <Link key={id} href={`/student/dashboard/courses/${id}`} className="block">
              <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
                <img
                  src={thumbnail || "/placeholder.png"}
                  alt={title}
                  className="w-full h-36 object-cover rounded"
                />
                <h4 className="font-semibold mt-2">{title}</h4>
                <p className="text-sm text-gray-600">{difficultyLevel}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
