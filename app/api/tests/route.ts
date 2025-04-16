import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

const testSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  category: z.enum(["JEE", "NEET", "CRASH_COURSES", "OTHER"]),
  subjects: z
    .array(z.enum(["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]))
    .min(1),
  questionIds: z.array(z.string()).min(1),
});

// POST: Create a new test
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const parsedBody = testSchema.parse(body);

    const newTest = await prisma.test.create({
      data: {
        title: parsedBody.title,
        category: parsedBody.category,
        subjects: parsedBody.subjects,
        questions: { connect: parsedBody.questionIds.map((id) => ({ id })) },
      },
    });

    return NextResponse.json(newTest, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create test. Check inputs." },
      { status: 400 }
    );
  }
}
