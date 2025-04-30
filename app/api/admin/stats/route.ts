import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(NEXT_AUTH);
    
    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all basic counts
    const [totalCourses, totalStudents, totalTests, totalRevenueResult] = await Promise.all([
      prisma.course.count(),
      prisma.user.count(),
      prisma.test.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
      }),
    ]);

    // Get question statistics grouped by subject
    const questionStats = await prisma.subject.findMany({
      select: {
        name: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    // Get recent enrollments with user and course details
    const recentEnrollments = await prisma.enrolledCourse.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // Format the response
    return NextResponse.json({
      totalCourses,
      totalStudents,
      totalTests,
      totalRevenue: totalRevenueResult._sum.amount || 0,
      questionStats: questionStats.map((subject) => ({
        subject: subject.name,
        _count: {
          _all: subject._count.questions,
        },
      })),
      recentEnrollments,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}