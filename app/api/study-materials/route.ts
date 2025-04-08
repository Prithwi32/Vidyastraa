import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const newMaterial = await prisma.studyMaterial.create({
      data: {
        title: body.title,
        description: body.description || "",
        subject: body.subject,
        type: body.type,
        url: body.url,
      },
    })

    return NextResponse.json(newMaterial)
  } catch (error) {
    console.error("[POST /api/study-materials]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
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