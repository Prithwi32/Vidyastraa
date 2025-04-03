import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updatedData } = body;

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}
