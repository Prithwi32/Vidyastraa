import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const courseId = url.searchParams.get("id");

  if (!courseId) {
    return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
  }

  try {
    await prisma.course.delete({ where: { id: courseId } });
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting course" }, { status: 500 });
  }
}
