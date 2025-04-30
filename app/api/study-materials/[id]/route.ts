import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";
import { Subject } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return new NextResponse("Unauthorized", { status: 401 });

    const material = await prisma.studyMaterial.findUnique({
      where: { id },
      include: { subject: true },
    });
    if (!material) return new Response("Material not found", { status: 404 });

    // Get file path from public URL
    const filePath = decodeURIComponent(
      material.url.split("/storage/v1/object/public/study-materials/")[1]
    );

    // Delete from Supabase Storage
    const { error: storageError } = await supabaseServer.storage
      .from("study-materials")
      .remove([filePath]);

    if (storageError) {
      console.error("Supabase delete error:", storageError);
      return new Response("Failed to delete file from Supabase", {
        status: 500,
      });
    }

    // Delete from DB
    await prisma.studyMaterial.delete({ where: { id } });

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Deleted successfully",
        deletedMaterial: {
          id: material.id,
          title: material.title,
          subject: material.subject?.name || "Unknown",
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const session = await getServerSession(NEXT_AUTH);
    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await req.formData();
    console.log("Received form data:", Object.fromEntries(formData.entries()));

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subjectId = formData.get("subjectId") as string;
    const file = formData.get("file") as File | null;

    if (!title || !subjectId) {
      return new NextResponse("Title and subject ID are required", { status: 400 });
    }

    const existing = await prisma.studyMaterial.findUnique({ where: { id } });
    if (!existing) return new Response("Material not found", { status: 404 });

    const subjectExists = await prisma.subject.findUnique({
      where: { id: subjectId },
    });
    if (!subjectExists) {
      return new NextResponse("Subject not found", { status: 404 });
    }

    let url = existing.url;

    if (file) {
      // Delete old file
      const oldPath = decodeURIComponent(
        url.split("/storage/v1/object/public/study-materials/")[1]
      );
      await supabaseServer.storage.from("study-materials").remove([oldPath]);

      // Upload new file
      const newPath = `materials/${Date.now()}-${file.name}`;
      const { error } = await supabaseServer.storage
        .from("study-materials")
        .upload(newPath, file);

      if (error) {
        console.error("File upload error:", error);
        return new Response("Failed to upload file", { status: 500 });
      }

      url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/study-materials/${newPath}`;
    }

    const updated = await prisma.studyMaterial.update({
      where: { id },
      data: {
        title,
        description,
        subjectId,
        url,
      },
      include: {
        subject: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Material updated successfully",
      updatedMaterial: updated,
    });
  } catch (error) {
    console.error("PATCH error:", error);
    return new Response("Failed to update material", { status: 500 });
  }
}
