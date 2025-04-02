"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/admin/FileUpload";
import { toast } from "react-toastify";

const DIFFICULTY_LEVELS = ["BEGINNER", "MODERATE", "ADVANCED"];
const COURSE_CATEGORIES = ["JEE", "NEET", "CRASH_COURSES", "OTHER"];

export default function CourseForm() {
  const [courseData, setCourseData] = useState({
    title: "",
    subtitle: "",
    thumbnail: "",
    detailedDescription: "",
    keyTopics: [],
    difficultyLevel: "",
    duration: "",
    price: "",
    category: "",
  });

  const handleInputChange = (e: any) => {
    let value = e.target.value;
    if (e.target.name === "keyTopics" || e.target.name === "features") {
      value = value.split(",").map((item: string) => item.trim());
    }
    setCourseData({ ...courseData, [e.target.name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const price = parseFloat(courseData.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    const dataToSend = {
      ...courseData,
      price: price,
      keyTopics: courseData.keyTopics.filter(Boolean),
    };

    console.log("Data to send:", dataToSend);

    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Course added successfully!");
      } else {
        toast.error("Failed to add course.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-emerald-200/20 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Course Title" onChange={handleInputChange} required />
        <Input name="subtitle" placeholder="Subtitle" onChange={handleInputChange} />
        <FileUpload name="thumbnail" label="Upload Thumbnail" onUpload={(url) => setCourseData({ ...courseData, thumbnail: url })} />
        <Textarea name="detailedDescription" placeholder="Detailed Description" onChange={handleInputChange} required />
        <Input name="keyTopics" placeholder="Key Topics (comma separated)" onChange={handleInputChange} />
        <Select onValueChange={(value) => setCourseData({ ...courseData, difficultyLevel: value })} required >
          <SelectTrigger><SelectValue placeholder="Select Difficulty Level" /></SelectTrigger>
          <SelectContent>
            {DIFFICULTY_LEVELS.map((level) => (
              <SelectItem key={level} value={level}> {level} </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input name="duration" placeholder="Course Duration (e.g., 10 weeks)" onChange={handleInputChange} />
        <Input name="price" type="number" placeholder="Course Price" onChange={handleInputChange} required />
        <Select onValueChange={(value) => setCourseData({ ...courseData, category: value })} required >
          <SelectTrigger><SelectValue placeholder="Select Course Category" /></SelectTrigger>
          <SelectContent>
            {COURSE_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}> {category} </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full"> Add Course </Button>
      </form>
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  subtitle: z.string().optional(),
  thumbnail: z.string().url().optional(),
  detailedDescription: z.string().min(10, "Detailed description is too short"),
  keyTopics: z.array(z.string()).min(1, "At least one key topic is required"),
  difficultyLevel: z.enum(["BEGINNER", "MODERATE", "ADVANCED"]),
  duration: z.string().min(3, "Duration must be specified"),
  price: z.number().positive("Price must be a positive number"),
  category: z.enum(["JEE", "NEET", "CRASH_COURSES", "OTHER"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedBody = courseSchema.parse(body);

    const newCourse = await prisma.course.create({
      data: {
        title: parsedBody.title,
        subtitle: parsedBody.subtitle || null,
        thumbnail: parsedBody.thumbnail || null,
        detailedDescription: parsedBody.detailedDescription,
        keyTopics: parsedBody.keyTopics,
        difficultyLevel: parsedBody.difficultyLevel,
        duration: parsedBody.duration,
        price: parsedBody.price,
        category: parsedBody.category,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation Issues:", error.issues);
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Unable to create course. Please check your input." },
      { status: 400 }
    );
  }
}