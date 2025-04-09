import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary/cloudinary";

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
    const data = await request.json();

    const existing = await prisma.question.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    let imageToUpdate = existing.image;

    // If user sends "" (meaning remove image)
    if (data.image === "") {
      // delete old image from cloudinary
      if (existing.image) {
        const publicId = getCloudinaryPublicId(existing.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log("✅ Old image deleted from Cloudinary");
        }
      }
      imageToUpdate = null;
    }

    // If user sends a new image (and it's different from existing)
    else if (data.image && data.image !== existing.image) {
      if (existing.image) {
        const publicId = getCloudinaryPublicId(existing.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
          console.log("✅ Replaced image: old image deleted from Cloudinary");
        }
      }
      imageToUpdate = data.image;
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        ...data,
        image: imageToUpdate,
      },
    });

    return NextResponse.json({
      message: "Updated successfully",
      updatedQuestion,
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
    // 1. Fetch the question
    const existing = await prisma.question.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // 2. Delete image from Cloudinary if it exists
    if (existing.image) {
      const publicId = getCloudinaryPublicId(existing.image);
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("✅ Cloudinary delete result:", result);
      } else {
        console.warn("⚠️ Could not extract publicId from:", existing.image);
      }
    }

    // 3. Delete from DB
    const deletedQuestion = await prisma.question.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted", deletedQuestion });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}



