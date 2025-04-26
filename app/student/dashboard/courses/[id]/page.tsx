"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TestResult {
  totalMarks: number;
  percentage: any;
  id: string;
  score: number;
  submittedAt: string;
}

interface Test {
  id: string;
  title: string;
  category: string;
  description?: string;
  duration: number;
  subjects: string[];
  createdAt: string;
  results: TestResult[];
}

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  thumbnail: string;
  detailedDescription: string;
  keyTopics: string[];
  difficultyLevel: string;
  duration: string;
  price: number;
  category: string;
  tests: Test[];
}

export default function CourseDetails() {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStartTestDialog, setShowStartTestDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/api/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatScore = (score: number, totalMarks: number) => {
    // Calculate percentage and round it to 1 decimal place
    const percentageScore = ((score / totalMarks) * 100).toFixed(1);
    return `${percentageScore}%`;
  };

  const handleStartTestClick = (test: Test) => {
    setSelectedTest(test);
    setShowStartTestDialog(true);
  };

  const confirmStartTest = () => {
    setShowStartTestDialog(false);
    if (selectedTest) {
      router.push(`/student/dashboard/tests/${selectedTest.id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-500">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-500">Course not found.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/student/dashboard/courses")}
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Course Header */}
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          src={course.thumbnail || "/placeholder.svg"}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            {course.subtitle && (
              <p className="text-lg text-muted-foreground">{course.subtitle}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild className="dark:text-white">
              <Link href={`/student/dashboard/materials`}>
                Continue Learning
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{course.category}</Badge>
          <Badge variant="secondary">{course.difficultyLevel}</Badge>
          <Badge variant="secondary">{course.duration}</Badge>
        </div>
      </div>

      {/* Course Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Course</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{course.detailedDescription}</p>
        </CardContent>
      </Card>

      {/* Key Topics */}
      <Card>
        <CardHeader>
          <CardTitle>📌 Key Topics</CardTitle>
          <CardDescription>What you'll learn in this course</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {course.keyTopics?.map((topic, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Tests Section */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Course Tests</CardTitle>
          <CardDescription>
            Assess your knowledge with these tests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.tests?.length > 0 ? (
            course.tests.map((test) => {
              const hasTakenTest = test.results.length > 0;
              const latestResult = hasTakenTest ? test.results[0] : null;

              return (
                <div
                  key={test.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">{test.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {test.description || "Test your knowledge"}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{test.duration} mins</Badge>
                        <Badge variant="outline">
                          {test.category.replace("_", " ")}
                        </Badge>
                        {test.subjects.map((subject) => (
                          <Badge key={subject} variant="outline">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                      {hasTakenTest && latestResult && (
                        <div className="mt-2">
                          <Badge variant="secondary" className="mr-2">
                            Score:{" "}
                            {formatScore(
                              latestResult.score,
                              latestResult.totalMarks
                            )}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Taken on: {formatDate(latestResult.submittedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {hasTakenTest ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/student/dashboard/tests/${test.id}/result/${latestResult?.id}`
                            )
                          }
                        >
                          View Results
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleStartTestClick(test)}
                        >
                          Start Test
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No tests available for this course yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Start Test Confirmation Dialog */}
      <Dialog open={showStartTestDialog} onOpenChange={setShowStartTestDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start Test</DialogTitle>
            <DialogDescription>
              You are about to start {selectedTest?.title}. Make sure you have
              enough time to complete the test.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-sm font-medium">
                  {selectedTest?.duration} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Category:</span>
                <span className="text-sm font-medium">
                  {selectedTest?.category.replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subjects:</span>
                <span className="text-sm font-medium">
                  {selectedTest?.subjects.join(", ")}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStartTestDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmStartTest}>Start Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => router.push("/student/dashboard/courses")}
        >
          Back to Courses
        </Button>
      </div>
    </div>
  );
}
