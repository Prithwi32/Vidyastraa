import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NEXT_AUTH } from "@/lib/auth"

const prisma = new PrismaClient()

// Define schemas for different question types
const baseQuestionSchema = z
  .object({
    type: z.enum(["MCQ", "MULTI_SELECT", "ASSERTION_REASON", "FILL_IN_BLANK", "MATCHING"]),
    questionText: z.string().min(5),
    questionImage: z.string().url().optional().nullable(),
    solutionText: z.string().min(5).optional().nullable(),
    solutionImage: z.string().url().optional().nullable(),
    difficulty: z.enum(["BEGINNER", "MODERATE", "ADVANCED"]),
    subject: z.enum(["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]),
    chapter: z.string().min(1),
  })
  .refine(
    (data) => {
      // Ensure at least one of solutionText or solutionImage is provided
      return data.solutionText || data.solutionImage
    },
    {
      message: "Either solution text or solution image must be provided",
      path: ["solutionText"],
    },
  )

const optionSchema = z
  .object({
    id: z.string().optional(),
    optionText: z.string().optional().nullable(),
    optionImage: z.string().url().optional().nullable(),
    isCorrect: z.boolean(),
  })
  .refine(
    (data) => {
      // Ensure at least one of optionText or optionImage is provided
      return data.optionText || data.optionImage
    },
    {
      message: "Either option text or option image must be provided",
      path: ["optionText"],
    },
  )

const matchingPairSchema = z.object({
  id: z.string().optional(),
  leftText: z.string().min(1),
  leftImage: z.string().url().optional().nullable(),
  rightText: z.string().min(1),
  rightImage: z.string().url().optional().nullable(),
  order: z.number().int().min(0),
})

// Combined schema with conditional validation based on question type
const questionSchema = z.intersection(
  baseQuestionSchema,
  z.union([
    // MCQ, MULTI_SELECT, ASSERTION_REASON
    z.object({
      type: z.enum(["MCQ", "MULTI_SELECT", "ASSERTION_REASON"]),
      options: z.array(optionSchema).min(2),
      negativeMarking: z.number().optional().nullable(),
      partialMarking: z.boolean().optional().nullable(),
    }),
    // FILL_IN_BLANK
    z.object({
      type: z.literal("FILL_IN_BLANK"),
      correctAnswer: z.string().min(1),
    }),
    // MATCHING
    z.object({
      type: z.literal("MATCHING"),
      matchingPairs: z.array(matchingPairSchema).min(2),
      options: z.array(optionSchema).min(2),
    }),
  ]),
)

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(NEXT_AUTH)

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const parsedBody = questionSchema.parse(body)

    // Find or create the subject
    let subject = await prisma.subject.findUnique({
      where: { name: parsedBody.subject },
    })

    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: parsedBody.subject },
      })
    }

    // Find or create the chapter (unique by name within subject)
    let chapter = await prisma.chapter.findFirst({
      where: {
        name: parsedBody.chapter,
        subjectId: subject.id,
      },
    })

    if (!chapter) {
      chapter = await prisma.chapter.create({
        data: {
          name: parsedBody.chapter,
          subjectId: subject.id,
        },
      })
    }

    // Prepare base question data
    const questionData = {
      type: parsedBody.type,
      questionText: parsedBody.questionText,
      questionImage: parsedBody.questionImage,
      solutionText: parsedBody.solutionText,
      solutionImage: parsedBody.solutionImage,
      difficulty: parsedBody.difficulty,
      subjectId: subject.id,
      chapterId: chapter.id,
    }

    // Create the question first
    const newQuestion = await prisma.question.create({
      data: questionData,
    })

    // Now handle type-specific data
    if (parsedBody.type === "MCQ" || parsedBody.type === "MULTI_SELECT" || parsedBody.type === "ASSERTION_REASON") {
      // Create options
      await Promise.all(
        parsedBody.options.map((option) =>
          prisma.questionOption.create({
            data: {
              questionId: newQuestion.id,
              optionText: option.optionText,
              optionImage: option.optionImage,
              isCorrect: option.isCorrect,
            },
          }),
        ),
      )
    } else if (parsedBody.type === "MATCHING") {
      // Create matching pairs
      await Promise.all(
        parsedBody.matchingPairs.map((pair) =>
          prisma.matchingPair.create({
            data: {
              questionId: newQuestion.id,
              leftText: pair.leftText,
              leftImage: pair.leftImage,
              rightText: pair.rightText,
              rightImage: pair.rightImage,
              order: pair.order,
            },
          }),
        ),
      )

      // Create options
      await Promise.all(
        parsedBody.options.map((option) =>
          prisma.questionOption.create({
            data: {
              questionId: newQuestion.id,
              optionText: option.optionText,
              optionImage: option.optionImage,
              isCorrect: option.isCorrect,
            },
          }),
        ),
      )
    } else if (parsedBody.type === "FILL_IN_BLANK") {
      // For FILL_IN_BLANK, store the correct answer in an option
      await prisma.questionOption.create({
        data: {
          questionId: newQuestion.id,
          optionText: parsedBody.correctAnswer,
          isCorrect: true,
        },
      })
    }

    // Fetch the complete question with all relations
    const completeQuestion = await prisma.question.findUnique({
      where: { id: newQuestion.id },
      include: {
        subject: true,
        chapter: true,
        options: true,
        matchingPairs: true,
      },
    })

    return NextResponse.json({ question: completeQuestion }, { status: 201 })
  } catch (error: any) {
    console.error("❌ Error adding question:", error)
    return NextResponse.json({ error: "Invalid request. Check the inputs. " + error.message }, { status: 400 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subject = searchParams.get("subject")
  const chapterId = searchParams.get("chapterId")

  try {
    const session = await getServerSession(NEXT_AUTH)

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get filtered questions
    const questions = await prisma.question.findMany({
      where: {
        ...(subject ? { subject: { name: subject } } : {}),
        ...(chapterId ? { chapterId: chapterId } : {}),
      },
      include: {
        subject: true,
        chapter: true,
        options: true,
         matchingPairs: {
      orderBy: {
        order: "asc", // Ensure matching pairs are returned in order
      },
    },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ questions }, { status: 200 })
  } catch (error) {
    console.error("❌ Error fetching questions:", error)
    return NextResponse.json({ error: "Error fetching questions." }, { status: 500 })
  }
}
