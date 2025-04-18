import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

const questionSchema = z.object({
  question: z.string().min(5, "Question is too short"),
  options: z.array(z.string()).length(4, "Exactly 4 options required"),
  correctAnswer: z.string(),
  solution: z.string().min(5, "Solution must be at least 5 characters long"),
  difficulty: z.enum(["BEGINNER", "MODERATE", "ADVANCED"]),
  subject: z.enum(["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]),
  image: z.string().url().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const parsedBody = questionSchema.parse(body);

    const newQuestion = await prisma.question.create({
      data: {
        ...parsedBody,
        image: parsedBody.image || null,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("❌ Error adding question:", error);
    return NextResponse.json(
      { error: "Invalid request. Check the inputs." },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");

  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return new NextResponse("Unauthorized", { status: 401 });

    const questions = await prisma.question.findMany({
      where: subject ? { subject } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
