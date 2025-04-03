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

    const tests = await prisma.test.findMany({
      where: { course: { enrolledStudents: { some: { userId } } } },
      include: { course: true },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json({ error: "Error fetching tests" }, { status: 500 });
  }
}
