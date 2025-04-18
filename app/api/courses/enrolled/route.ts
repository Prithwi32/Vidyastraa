import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        enrolledCourses: {
          include: {
            course: {
              include: {
                tests: {
                  include: {
                    _count: {
                      select: { questions: true },
                    },
                  },
                },
              },
            },
          },
        },
        results: {
          select: {
            testId: true,
            score: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const enrolledCourses = user.enrolledCourses.map((enrollment) => {
      const course = enrollment.course;
      const totalTests = course.tests.length;
      const completedTests = user.results.filter((result) =>
        course.tests.some((test) => test.id === result.testId)
      ).length;

      const progress =
        totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;

      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        thumbnail: course.thumbnail,
        detailedDescription: course.detailedDescription,
        keyTopics: course.keyTopics,
        difficultyLevel: course.difficultyLevel,
        duration: course.duration,
        price: course.price,
        category: course.category,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        progress,
        totalTests,
        completedTests,
      };
    });

    return NextResponse.json(enrolledCourses, { status: 200 });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return NextResponse.json(
      { error: "Error fetching enrolled courses" },
      { status: 500 }
    );
  }
}
