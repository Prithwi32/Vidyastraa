"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  DollarSign,
  Info,
  ListChecks,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileUpload from "@/components/admin/FileUpload";

const DIFFICULTY_LEVELS = ["BEGINNER", "MODERATE", "ADVANCED"];
const COURSE_CATEGORIES = ["JEE", "NEET", "CRASH_COURSES", "OTHER"];

export default function EditCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingCourse, setFetchingCourse] = useState(true);
  const [courseData, setCourseData] = useState({
    title: "",
    subtitle: "",
    thumbnail: "",
    detailedDescription: "",
    keyTopics: [] as string[],
    difficultyLevel: "",
    duration: "",
    price: "",
    category: "",
  });
  const [newTopic, setNewTopic] = useState("");
  const params = useParams();

  const handleUpdateCourse = async () => {
    const courseId = params?.id;
    if (!courseId) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        toast.error("Failed to update course");
        return;
      }

      toast.success("Course updated successfully");

      // Wait 1.5 seconds before redirecting
      setTimeout(() => {
        router.push("/admin/dashboard/courses");
      }, 1500);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("An error occurred while updating the course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`);
        if (response.ok) {
          const course = await response.json();
          setCourseData({
            title: course.title,
            subtitle: course.subtitle || "",
            thumbnail: course.thumbnail || "",
            detailedDescription: course.detailedDescription,
            keyTopics: course.keyTopics || [],
            difficultyLevel: course.difficultyLevel,
            duration: course.duration,
            price: course.price.toString(),
            category: course.category,
          });
        } else {
          toast.error("Failed to fetch course details");
          router.push("/admin/dashboard/courses");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("An error occurred while fetching course details");
        router.push("/admin/dashboard/courses");
      } finally {
        setFetchingCourse(false);
      }
    };

    fetchCourse();
  }, [params.id, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleAddTopic = () => {
    if (
      newTopic.trim() !== "" &&
      !courseData.keyTopics.includes(newTopic.trim())
    ) {
      setCourseData({
        ...courseData,
        keyTopics: [...courseData.keyTopics, newTopic.trim()],
      });
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setCourseData({
      ...courseData,
      keyTopics: courseData.keyTopics.filter((t) => t !== topic),
    });
  };

  if (fetchingCourse) {
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

  return (
    <div className="space-y-6">
      <ToastContainer />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
        <p className="text-muted-foreground">
          Update the details of your course
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Edit the core details of your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter course title"
                value={courseData.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                placeholder="Enter a brief subtitle"
                value={courseData.subtitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                name="detailedDescription"
                placeholder="Enter a detailed description of the course"
                className="min-h-[120px]"
                value={courseData.detailedDescription}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <FileUpload
                name="thumbnail"
                label="Thumbnail Image"
                initialImage={courseData.thumbnail}
                onUpload={(url) =>
                  setCourseData({ ...courseData, thumbnail: url })
                }
              />
              <p className="text-xs text-muted-foreground">
                Recommended size: 1280x720px. Max file size: 2MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Course Details */}
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Configure the specifics of your course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={courseData.category}
                onValueChange={(value) =>
                  setCourseData({ ...courseData, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {COURSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select
                value={courseData.difficultyLevel}
                onValueChange={(value) =>
                  setCourseData({ ...courseData, difficultyLevel: value })
                }
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0) + level.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                name="duration"
                placeholder="e.g., 3 months, 12 weeks"
                value={courseData.duration}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  className="pl-9"
                  value={courseData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Topics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Key Topics</CardTitle>
            <CardDescription>
              Edit the main topics covered in this course
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ListChecks className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Add a key topic"
                  className="pl-9"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                />
              </div>
              <Button
                variant="outline"
                onClick={handleAddTopic}
                disabled={newTopic.trim() === ""}
                type="button"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {courseData.keyTopics.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {courseData.keyTopics.map((topic, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="pl-2 pr-1 py-1.5"
                  >
                    {topic}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => handleRemoveTopic(topic)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <div className="rounded-full bg-slate-100 p-3">
                  <Info className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="mt-2 text-sm font-medium">No topics added</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add key topics that will be covered in this course
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/dashboard/courses")}
              type="button"
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleUpdateCourse}
              disabled={loading}
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Course
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
