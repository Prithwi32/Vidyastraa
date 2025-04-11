import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(NEXT_AUTH);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      enrolledCourses: {
        include: {
          course: {
            include: {
              tests: {
                select: { id: true }
              }
            }
          }
        }
      },
      results: true // Include all test results
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Calculate course progress based on test completion
  const courseProgress = user.enrolledCourses.map((ec) => {
    const totalTests = ec.course.tests.length;
    const completedTests = user.results.filter(r => 
      ec.course.tests.some(t => t.id === r.testId)
    ).length;
    
    return {
      id: ec.courseId,
      name: ec.course.title,
      progress: totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0,
      totalTests,
      completedTests
    };
  });

  // Count distinct completed tests (unique testIds in results)
  const completedTestsCount = new Set(user.results.map(r => r.testId)).size;

  return NextResponse.json({
    name: user.name,
    email: user.email,
    image: session.user.image || null,
    joinedDate: user.createdAt,
    enrolledCoursesCount: user.enrolledCourses.length,
    completedTestsCount,
    courseProgress,
    overallProgress: courseProgress.length > 0
      ? Math.round(courseProgress.reduce((sum, cp) => sum + cp.progress, 0) / courseProgress.length)
      : 0
  });
}