"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface EnrolledCourse {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  detailedDescription: string;
  keyTopics: string[];
  difficultyLevel: string;
  duration: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  totalTests: number;
  completedTests: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await fetch("/api/courses/enrolled");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setEnrolledCourses(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            My Enrolled Courses
          </h2>
          <p className="text-muted-foreground">
            Continue learning from where you left off
          </p>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : enrolledCourses.length === 0 ? (
          <p className="text-muted-foreground">
            You haven't enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">
                        {course.progress}% ({course.completedTests}/{course.totalTests} tests)
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Category: {course.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {course.keyTopics.map((topic) => (
                        <Badge key={topic} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href={`/student/dashboard/courses/${course.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button className="dark:text-white">
                    <Link href={`/student/dashboard/tests`}>
                      Continue Course
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push(`/courses`)}
          >
            View All Available Courses
          </Button>
        </div>
      </main>
    </div>
  );
}