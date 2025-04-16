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

    const newMaterial = await prisma.studyMaterial.create({
      data: {
        title: body.title,
        description: body.description || "",
        subject: body.subject,
        type: body.type,
        url: body.url,
      },
    });

    return NextResponse.json(newMaterial);
  } catch (error) {
    console.error("[POST /api/study-materials]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const materials = await prisma.studyMaterial.findMany({
      orderBy: { uploadedAt: "desc" },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error("[GET /api/materials]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
