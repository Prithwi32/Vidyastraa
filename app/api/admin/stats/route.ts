import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
  try {
    const totalCourses = await prisma.course.count();
    const totalStudents = await prisma.user.count();
    const totalTests = await prisma.test.count();
    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
    });

    const questionStats = await prisma.question.groupBy({
      by: ["subject"],
      _count: { _all: true },
    });

    const recentEnrollments = await prisma.enrolledCourse.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        course: true,
      },
    });

    return NextResponse.json({
      totalCourses,
      totalStudents,
      totalTests,
      totalRevenue: totalRevenue._sum.amount || 0,
      questionStats,
      recentEnrollments,
    });
  } catch (error) {
    console.error("[ADMIN_STATS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
