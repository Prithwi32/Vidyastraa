import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

const prisma = new PrismaClient();

const questionSchema = z.object({
  question: z.string().min(5),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.string().min(1),
  solution: z.string().min(5),
  difficulty: z.enum(["BEGINNER", "MODERATE", "ADVANCED"]),
  subject: z.enum(["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]),
  chapter: z.string().min(1),
  image: z.string().url().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parsedBody = questionSchema.parse(body);

    // Find or create the subject
    let subject = await prisma.subject.findUnique({
      where: { name: parsedBody.subject },
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: parsedBody.subject },
      });
    }

    // Find or create the chapter (unique by name within subject)
    let chapter = await prisma.chapter.findFirst({
      where: {
        name: parsedBody.chapter,
        subjectId: subject.id,
      },
    });

    if (!chapter) {
      chapter = await prisma.chapter.create({
        data: {
          name: parsedBody.chapter,
          subjectId: subject.id,
        },
      });
    }

    // Create the question
    const newQuestion = await prisma.question.create({
      data: {
        question: parsedBody.question,
        options: parsedBody.options,
        correctAnswer: parsedBody.correctAnswer,
        solution: parsedBody.solution,
        difficulty: parsedBody.difficulty,
        subjectId: subject.id,
        chapterId: chapter.id,
        image: parsedBody.image || null,
      },
      include: {
        subject: true,
        chapter: true,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error adding question:", error);
    return NextResponse.json(
      { error: "Invalid request. Check the inputs. " + error.message },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");
  const chapter = searchParams.get("chapterId");

  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get filtered questions
    const questions = await prisma.question.findMany({
      where: {
        ...(subject ? { subject: { name: subject } } : {}),
        ...(chapter ? { chapterId: chapterId }  : {}),
      },
      include: {
        subject: true,
        chapter: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ questions }, { status: 200 });;
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    return NextResponse.json(
      { error: "Error fetching questions." },
      { status: 500 }
    );
  }
}