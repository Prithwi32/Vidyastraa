import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";
import { z } from "zod";

// Define schemas for different question types (same as in the main route file)
const baseQuestionSchema = z.object({
  type: z.enum([
    "MCQ",
    "MULTI_SELECT",
    "ASSERTION_REASON",
    "FILL_IN_BLANK",
    "MATCHING",
  ]),
  questionText: z.string().min(5),
  questionImage: z.string().url().optional().nullable(),
  solutionText: z.string().min(5),
  solutionImage: z.string().url().optional().nullable(),
  difficulty: z.enum(["BEGINNER", "MODERATE", "ADVANCED"]),
  subject: z.enum(["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]),
  chapter: z.string().min(1),
});

const optionSchema = z.object({
  id: z.string().optional(),
  optionText: z.string().min(1).optional().nullable(),
  optionImage: z.string().url().optional().nullable(),
  isCorrect: z.boolean(),
}).refine(
  (data) => data.optionText || data.optionImage,
  "Either optionText or optionImage must be provided"
);

const matchingPairSchema = z.object({
  id: z.string().optional(),
  leftText: z.string().min(1),
  leftImage: z.string().url().optional().nullable(),
  rightText: z.string().min(1),
  rightImage: z.string().url().optional().nullable(),
  order: z.number().int().min(0),
});

// Combined schema with conditional validation based on question type
const questionSchema = z.intersection(
  baseQuestionSchema,
  z.union([
    // MCQ, MULTI_SELECT, ASSERTION_REASON
    z.object({
      type: z.enum(["MCQ", "MULTI_SELECT", "ASSERTION_REASON"]),
      options: z.array(optionSchema).min(2),
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
  ])
);

function getCloudinaryPublicId(url: string): string | null {
  try {
    const parts = url.split("/");
    const uploadsIndex = parts.findIndex((part) => part === "uploads");
    if (uploadsIndex === -1) return null;

    const publicIdParts = parts.slice(uploadsIndex).join("/");
    return publicIdParts.replace(/\.[^/.]+$/, ""); // remove extension
  } catch (err) {
    console.error("❌ Error extracting public_id:", err);
    return null;
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const session = await getServerSession(NEXT_AUTH);
    if (
      !session ||
      session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const parsedData = questionSchema.parse(data);

    // Find the existing question
    const existing = await prisma.question.findUnique({
      where: { id },
      include: {
        subject: true,
        chapter: true,
        options: true,
        matchingPairs: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Prevent changing the subject
    if (parsedData.subject !== existing.subject.name) {
      return NextResponse.json(
        { error: "Subject cannot be changed when editing a question" },
        { status: 400 }
      );
    }

    // Handle image updates for question image
    let questionImageToUpdate = existing.questionImage;
    if (parsedData.questionImage === "") {
      // Remove image
      if (existing.questionImage) {
        const publicId = getCloudinaryPublicId(existing.questionImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      questionImageToUpdate = null;
    } else if (
      parsedData.questionImage &&
      parsedData.questionImage !== existing.questionImage
    ) {
      // Replace image
      if (existing.questionImage) {
        const publicId = getCloudinaryPublicId(existing.questionImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      questionImageToUpdate = parsedData.questionImage;
    }

    // Handle image updates for solution image
    let solutionImageToUpdate = existing.solutionImage;
    if (parsedData.solutionImage === "") {
      // Remove image
      if (existing.solutionImage) {
        const publicId = getCloudinaryPublicId(existing.solutionImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      solutionImageToUpdate = null;
    } else if (
      parsedData.solutionImage &&
      parsedData.solutionImage !== existing.solutionImage
    ) {
      // Replace image
      if (existing.solutionImage) {
        const publicId = getCloudinaryPublicId(existing.solutionImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      solutionImageToUpdate = parsedData.solutionImage;
    }

    // Find or create chapter
    let chapter = await prisma.chapter.findFirst({
      where: {
        name: parsedData.chapter,
        subjectId: existing.subject.id,
      },
    });

    if (!chapter) {
      chapter = await prisma.chapter.create({
        data: {
          name: parsedData.chapter,
          subjectId: existing.subject.id,
        },
      });
    }

    // Prepare base question data for update
    const questionUpdateData = {
      type: parsedData.type,
      questionText: parsedData.questionText,
      questionImage: questionImageToUpdate,
      solutionText: parsedData.solutionText,
      solutionImage: solutionImageToUpdate,
      difficulty: parsedData.difficulty,
      chapter: {
        connect: {
          id: chapter.id,
        },
      },
    };

    // Handle type-specific updates
    if (
      parsedData.type === "MCQ" ||
      parsedData.type === "MULTI_SELECT" ||
      parsedData.type === "ASSERTION_REASON"
    ) {
      // Delete existing options
      await prisma.questionOption.deleteMany({
        where: { questionId: id },
      });

      // Create new options
      await Promise.all(
        parsedData.options.map((option) =>
          prisma.questionOption.create({
            data: {
              questionId: id,
              optionText: option.optionText,
              optionImage: option.optionImage,
              isCorrect: option.isCorrect,
            },
          })
        )
      );
    } else if (parsedData.type === "FILL_IN_BLANK") {
      // Delete any existing options if question type changed
      if (existing.options.length > 0) {
        await prisma.questionOption.deleteMany({
          where: { questionId: id },
        });
      }

      // Delete any existing matching pairs if question type changed
      if (existing.matchingPairs && existing.matchingPairs.length > 0) {
        await prisma.matchingPair.deleteMany({
          where: { questionId: id },
        });
      }

      // Then create the correct answer option
      await prisma.questionOption.create({
        data: {
          questionId: id,
          optionText: parsedData.correctAnswer,
          isCorrect: true,
        },
      });
    } else if (parsedData.type === "MATCHING") {
      // Delete existing matching pairs
      await prisma.matchingPair.deleteMany({
        where: { questionId: id },
      });

      // Create new matching pairs
      await Promise.all(
        parsedData.matchingPairs.map((pair) =>
          prisma.matchingPair.create({
            data: {
              questionId: id,
              leftText: pair.leftText,
              leftImage: pair.leftImage,
              rightText: pair.rightText,
              rightImage: pair.rightImage,
              order: pair.order,
            },
          })
        )
      );

      // Delete any existing options if question type changed
      await prisma.questionOption.deleteMany({
        where: { questionId: id },
      });

      // Create new options
      await Promise.all(
        parsedData.options.map((option) =>
          prisma.questionOption.create({
            data: {
              questionId: id,
              optionText: option.optionText,
              optionImage: option.optionImage,
              isCorrect: option.isCorrect,
            },
          })
        )
      );
    }

    // Update the question
    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: questionUpdateData,
      include: {
        chapter: {
          select: {
            name: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
        options: true,
        matchingPairs: true,
      },
    });

    return NextResponse.json({
      message: "Updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const session = await getServerSession(NEXT_AUTH);
    if (
      !session ||
      session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Fetch the question with related data
    const existing = await prisma.question.findUnique({
      where: { id },
      include: {
        testQuestions: true,
        testResponses: true,
        options: true,
        matchingPairs: true,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // 2. Delete images from Cloudinary if they exist
    if (existing.questionImage) {
      const publicId = getCloudinaryPublicId(existing.questionImage);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    if (existing.solutionImage) {
      const publicId = getCloudinaryPublicId(existing.solutionImage);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete option images if they exist
    for (const option of existing.options) {
      if (option.optionImage) {
        const publicId = getCloudinaryPublicId(option.optionImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // Delete matching pair images if they exist
    for (const pair of existing.matchingPairs || []) {
      if (pair.leftImage) {
        const publicId = getCloudinaryPublicId(pair.leftImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      if (pair.rightImage) {
        const publicId = getCloudinaryPublicId(pair.rightImage);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // 3. Delete related test questions and responses first
    if (existing.testQuestions.length > 0) {
      await prisma.testQuestion.deleteMany({
        where: { questionId: id },
      });
    }

    if (existing.testResponses.length > 0) {
      await prisma.testResponse.deleteMany({
        where: { questionId: id },
      });
    }

    // 4. Delete related options and matching pairs
    await prisma.questionOption.deleteMany({
      where: { questionId: id },
    });

    await prisma.matchingPair.deleteMany({
      where: { questionId: id },
    });

    // 5. Delete the question
    const deletedQuestion = await prisma.question.delete({ where: { id } });

    return NextResponse.json({
      message: "Deleted successfully",
      question: deletedQuestion,
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete: " + (error as Error).message },
      { status: 500 }
    );
  }
}
