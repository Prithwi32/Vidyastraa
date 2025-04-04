import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Step 1: Authenticate the user
    const session = await getServerSession(NEXT_AUTH);
    // console.log("Session Data:", session);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Fetch user based on user ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        enrolledCourses: {
          include: { course: true },
        },
      },
    });

    if (!user) {
      console.log("User not found in DB:", session.user.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // console.log("User found:", user);

    // Step 3: Extract enrolled courses
    const enrolledCourses = user.enrolledCourses.map((enrollment) => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      subtitle: enrollment.course.subtitle,
      thumbnail: enrollment.course.thumbnail,
      detailedDescription: enrollment.course.detailedDescription,
      keyTopics: enrollment.course.keyTopics,
      difficultyLevel: enrollment.course.difficultyLevel,
      duration: enrollment.course.duration,
      price: enrollment.course.price,
      category: enrollment.course.category,
      createdAt: enrollment.course.createdAt,
      updatedAt: enrollment.course.updatedAt,
    }));

    // console.log("Enrolled Courses for User:", enrolledCourses);

    return NextResponse.json(enrolledCourses, { status: 200 });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return NextResponse.json({ error: "Error fetching enrolled courses" }, { status: 500 });
  }
}
