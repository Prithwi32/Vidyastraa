import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const courseUpdateSchema = z.object({
  title: z.string().min(3),
  subtitle: z.string().optional(),
  thumbnail: z.string().url().optional(),
  detailedDescription: z.string().min(4),
  keyTopics: z.array(z.string()),
  difficultyLevel: z.enum(["BEGINNER", "MODERATE", "ADVANCED"]),
  duration: z.string(),
  price: z.number(),
  category: z.enum(["JEE", "NEET", "CRASH_COURSES", "OTHER"]),
});

// GET single course
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        tests: true,
        enrolledStudents: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PATCH course
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    body.price = Number(body.price);

    const validated = courseUpdateSchema.parse(body);

    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(updatedCourse);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE course
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return new NextResponse("Unauthorized", { status: 401 });

    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
