import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const questionSchema = z.object({
  question: z.string().min(5, "Question is too short"),
  options: z.array(z.string()).length(4, "Exactly 4 options required"),
  correctAnswer: z.string(),
  solution: z.string().min(5, "Solution must be at least 5 characters long"),
  subject: z.enum(["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]),
  image: z.string().url().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");

    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    const questions = await prisma.question.findMany({
      where: { subject },
    });

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
