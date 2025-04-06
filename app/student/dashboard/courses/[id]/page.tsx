// "use client";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";

// export default function CourseDetails() {
//   const { id } = useParams() as { id?: string };
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     axios.get(`/api/courses/${id}`)
//       .then((res) => setCourse(res.data))
//       .catch((err) => console.error("Error fetching course:", err))
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) return <p className="text-center text-gray-500">Loading...</p>;

//   if (!course) return <p className="text-center text-red-500">Course not found.</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-lg" />
//       <h2 className="text-2xl font-bold mt-4">{course.title}</h2>
//       <p className="text-gray-700 mt-2">{course.detailedDescription}</p>

//       <h3 className="text-lg font-semibold mt-4">📌 Key Topics</h3>
//       <ul className="list-disc pl-6 mt-1">
//         {course.keyTopics?.map((topic, index) => (
//           <li key={index} className="text-gray-600">{topic}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }


"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function CourseDetails() {
  const { id } = useParams() as { id?: string };
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios.get(`/api/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Error fetching course:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;

  if (!course) return <p className="text-center text-red-500">Course not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-lg" />
      <h2 className="text-2xl font-bold mt-4">{course.title}</h2>
      <p className="text-gray-700 mt-2">{course.detailedDescription}</p>

      <h3 className="text-lg font-semibold mt-4">📌 Key Topics</h3>
      <ul className="list-disc pl-6 mt-1">
        {course.keyTopics?.map((topic, index) => (
          <li key={index} className="text-gray-600">{topic}</li>
        ))}
      </ul>
    </div>
  );
}
