import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        enrolledStudents: true,
      },
    });

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      thumbnail: course.thumbnail,
      difficultyLevel: course.difficultyLevel,
      duration: course.duration,
      price: course.price,
      category: course.category,
      enrolledStudents: course.enrolledStudents.length,
      createdAt: course.createdAt,
    }));

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// Add a new course (Admin only)
const courseSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  subtitle: z.string().optional(),
  thumbnail: z.string().url().optional(),
  detailedDescription: z.string().min(4, "Detailed description is too short"),
  keyTopics: z.array(z.string()).min(1, "At least one key topic is required"),
  difficultyLevel: z.enum(["BEGINNER", "MODERATE", "ADVANCED"]),
  duration: z.string().min(3, "Duration must be specified"),
  price: z.number().positive("Price must be a positive number"),
  category: z.enum(["JEE", "NEET", "CRASH_COURSES", "OTHER"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    body.price = Number(body.price); // Ensure price is a number

    // Validate the request body
    const parsedBody = courseSchema.parse(body);

    // Create the new course in the database
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Error:", error.issues);
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Unable to create course. Please check your input." },
      { status: 400 }
    );
  }
}
