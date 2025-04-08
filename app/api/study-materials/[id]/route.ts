import { prisma } from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase/server";
import { Subject } from "@prisma/client";

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const material = await prisma.studyMaterial.findUnique({ where: { id } });
    if (!material) return new Response("Material not found", { status: 404 });

    // Get file path from public URL
    const filePath = decodeURIComponent(
      material.url.split("/storage/v1/object/public/study-materials/")[1]
    );

    // Delete from Supabase Storage
    const { error: storageError } = await supabaseServer
      .storage
      .from("study-materials")
      .remove([filePath]);

    if (storageError) {
      console.error("Supabase delete error:", storageError);
      return new Response("Failed to delete file from Supabase", { status: 500 });
    }

    // Delete from DB
    await prisma.studyMaterial.delete({ where: { id } });

    return new Response("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subject = formData.get("subject") as string;
    const file = formData.get("file") as File | null;

    const existing = await prisma.studyMaterial.findUnique({ where: { id } });
    if (!existing) return new Response("Material not found", { status: 404 });

    let url = existing.url;

    // If a new file is uploaded, delete the old one and upload the new one
    if (file) {
      const oldPath = decodeURIComponent(
        url.split("/storage/v1/object/public/study-materials/")[1]
      );

      // Delete old file
      await supabaseServer.storage.from("study-materials").remove([oldPath]);

      const newPath = `materials/${Date.now()}-${file.name}`;
      const { data, error } = await supabaseServer
        .storage
        .from("study-materials")
        .upload(newPath, file);

      if (error) {
        console.error("File upload error:", error);
        return new Response("Failed to upload file", { status: 500 });
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/study-materials/${newPath}`;
      url = publicUrl;
    }

    // Update DB
    const updated = await prisma.studyMaterial.update({
      where: { id },
      data: {
        title,
        description,
        subject: subject as Subject,
        url,
      },
    });

    return Response.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return new Response("Failed to update material", { status: 500 });
  }
}
