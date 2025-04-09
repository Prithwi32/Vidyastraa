import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // Validate the category enum
    const allowedCategories = ["JEE", "NEET", "CRASH_COURSES", "OTHER"];
    const whereClause = allowedCategories.includes(category as string)
      ? { category: category as any }
      : {};

    const courses = await prisma.course.findMany({
      where: whereClause,
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
    console.error("Error filtering courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch filtered courses" },
      { status: 500 }
    );
  }
}
