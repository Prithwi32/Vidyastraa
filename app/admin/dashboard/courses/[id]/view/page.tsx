"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  DollarSign,
  Edit,
  Loader2,
  Tag,
  Trash,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ViewCoursePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setCourse(data);
        } else {
          toast.error("Failed to fetch course details");
          router.push("/admin/dashboard/courses");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("An error occurred while fetching course details");
        router.push("/admin/dashboard/courses");
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) {
      fetchCourse();
    }
  }, [params?.id, router]);

  const handleDeleteCourse = async () => {
    setDeleting(true);

    try {
      const response = await fetch(`/api/courses/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Course deleted successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard/courses");
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to delete course: ${errorData.error || "Unknown error"}`
        );
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("An unexpected error occurred");
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-xl font-semibold">Course not found</h2>
        <p className="text-muted-foreground mb-4">
          The course you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/admin/dashboard/courses")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">{course.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/dashboard/courses")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/dashboard/courses/${params.id}/edit`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this course? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteCourse}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Course"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Course Overview</CardTitle>
              <CardDescription>
                Detailed information about the course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {course.thumbnail && (
                <div className="rounded-md overflow-hidden h-48 md:h-64 w-full">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {course.detailedDescription}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Key Topics</h3>
                {course.keyTopics && course.keyTopics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {course.keyTopics.map((topic: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No key topics specified
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tests */}

          <Card>
            <CardHeader>
              <CardTitle>Course Tests</CardTitle>
              <CardDescription>
                Tests associated with this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              {course.tests && course.tests.length > 0 ? (
                <div className="space-y-4">
                  {course.tests.map((test: any) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{test.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">
                            {test.subjects?.join(", ") || "No subjects"}
                          </Badge>
                          <Badge variant="outline">{test.duration} mins</Badge>
                          <Badge variant="outline">
                            {test.category.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="hover:bg-blue-900"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/tests/${test.id}/view`
                            )
                          }
                        >
                          View
                        </Button>
                        <Button
                          className="hover:bg-blue-900"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/admin/dashboard/tests/${test.id}/edit`
                            )
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No tests have been created for this course yet
                  </p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 dark:text-white"
                    onClick={() =>
                      router.push(
                        `/admin/dashboard/tests/create?courseId=${course.id}`
                      )
                    }
                  >
                    Create Test
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Course Details Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Category</span>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    course.category === "JEE"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : course.category === "NEET"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : course.category === "CRASH_COURSES"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-purple-200 bg-purple-50 text-purple-700"
                  }`}
                >
                  {course.category.replace("_", " ")}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Difficulty</span>
                </div>
                <Badge
                  variant="outline"
                  className={`${
                    course.difficultyLevel === "BEGINNER"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : course.difficultyLevel === "MODERATE"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {course.difficultyLevel.charAt(0) +
                    course.difficultyLevel.slice(1).toLowerCase()}
                </Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Duration</span>
                </div>
                <span className="font-medium">{course.duration}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Price</span>
                </div>
                <span className="font-medium">
                  {formatCurrency(course.price)}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Enrolled Students</span>
                </div>
                <span className="font-medium">
                  {course?.enrolledStudents?.length || 0}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <span>Created On</span>
                </div>
                <span className="text-sm">{formatDate(course.createdAt)}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center text-muted-foreground">
                  <span>Last Updated</span>
                </div>
                <span className="text-sm">{formatDate(course.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 dark:text-white"
                onClick={() =>
                  router.push(
                    `/admin/dashboard/tests/create?courseId=${params.id}`
                  )
                }
              >
                Create Test for Course
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  router.push(`/admin/dashboard/courses/${params.id}/edit`)
                }
              >
                Edit Course
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
