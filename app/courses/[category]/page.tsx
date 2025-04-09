"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Course = {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  difficultyLevel: string;
  duration: string;
  price: number;
  category: string;
  enrolledStudents: number;
  createdAt: string;
};

const allowedCategories = {
  jee: "JEE",
  neet: "NEET",
  foundation: "OTHER",
  crash: "CRASH_COURSES",
};

export default async function CourseCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const mappedCategory = allowedCategories[params.category.toLowerCase()];
  if (!mappedCategory) return notFound();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/filter?category=${mappedCategory}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-4 text-red-500">Failed to load courses</div>;
  }

  const data = await res.json();

  return (
<div className="container py-10">
  {/* Heading + Button Row */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
    <h1 className="text-3xl font-bold capitalize text-purple-800">
      {params.category} Courses
    </h1>

    <Link href="/courses">
      <Button
        variant="outline"
        className="group border-purple-600 text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-950"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2"
        >
          View All Courses
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.div>
      </Button>
    </Link>
  </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.courses.length === 0 ? (
          <p className="text-center col-span-full text-muted-foreground">
            No courses found for this category.
          </p>
        ) : (
          data.courses.map((course: Course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <img
                src={course.thumbnail || "/default-thumbnail.jpg"}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-400">
                  {course.title}
                </h2>
                {course.subtitle && (
                  <p className="text-sm text-muted-foreground">
                    {course.subtitle}
                  </p>
                )}
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Duration:</strong> {course.duration}
                  </p>
                  <p>
                    <strong>Price:</strong>{" "}
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ₹{course.price}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Enrolled: {course.enrolledStudents}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
