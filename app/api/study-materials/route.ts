import { NEXT_AUTH } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    console.log("Received payload:", body);

    // Validate required fields
    if (!body.title || !body.type || !body.url) {
      return NextResponse.json(
        { error: "Title, type and URL are required" },
        { status: 400 }
      );
    }

    let subjectId = body.subjectId;
    if (!subjectId && body.subject) {
      const subject = await prisma.subject.findFirst({
        where: { name: body.subject },
      });
      if (!subject) {
        return NextResponse.json(
          { error: "Subject not found" },
          { status: 404 }
        );
      }
      subjectId = subject.id;
    }

    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject ID or name is required" },
        { status: 400 }
      );
    }

    // Create the material
    const newMaterial = await prisma.studyMaterial.create({
      data: {
        title: body.title,
        description: body.description || "",
        subjectId: subjectId,
        type: body.type,
        url: body.url,
      },
      include: { subject: true },
    });

    return NextResponse.json(newMaterial);
  } catch (error) {
    console.error("[POST /api/study-materials]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const materials = await prisma.studyMaterial.findMany({
      orderBy: { uploadedAt: "desc" },
      include: {
        subject: true,
      },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error("[GET /api/materials]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
