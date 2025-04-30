import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

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
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const session = await getServerSession(NEXT_AUTH);
    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.subject || !data.chapter || !data.question || !data.options || !data.correctAnswer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await prisma.question.findUnique({
      where: { id },
      include: {
        subject: true,
        chapter: true,
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    let imageToUpdate = existing.image;

    // Handle image updates
    if (data.image === "") {
      // Remove image
      if (existing.image) {
        const publicId = getCloudinaryPublicId(existing.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      imageToUpdate = null;
    } else if (data.image && data.image !== existing.image) {
      // Replace image
      if (existing.image) {
        const publicId = getCloudinaryPublicId(existing.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      imageToUpdate = data.image;
    }

    // Find or create chapter
    let chapter = await prisma.chapter.findFirst({
      where: { name: data.chapter, subjectId: existing.subjectId }
    });

    if (!chapter) {
      chapter = await prisma.chapter.create({
        data: {
          name: data.chapter,
          subjectId: existing.subjectId
        }
      });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        solution: data.solution,
        difficulty: data.difficulty,
        image: imageToUpdate,
        chapterId: chapter.id
      },
      include: {
        chapter: {
          select: {
            name: true
          }
        },
        subject: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
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
    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Fetch the question with related data
    const existing = await prisma.question.findUnique({ 
      where: { id },
      include: {
        testQuestions: true,
        testResponses: true
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // 2. Delete image from Cloudinary if it exists
    if (existing.image) {
      const publicId = getCloudinaryPublicId(existing.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 3. Delete related test questions and responses first
    if (existing.testQuestions.length > 0) {
      await prisma.testQuestion.deleteMany({
        where: { questionId: id }
      });
    }

    if (existing.testResponses.length > 0) {
      await prisma.testResponse.deleteMany({
        where: { questionId: id }
      });
    }

    // 4. Delete the question
    const deletedQuestion = await prisma.question.delete({ where: { id } });

    return NextResponse.json({ 
      message: "Deleted successfully",
      question: deletedQuestion
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}