import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const enrolledCourses = await prisma.enrolledCourse.findMany({
      where: { userId },
      include: { course: true },
    });

    return NextResponse.json(enrolledCourses);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching enrolled courses" }, { status: 500 });
  }
}
