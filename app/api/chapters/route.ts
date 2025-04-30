import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subject = searchParams.get("subject");

  try {
    const session = await getServerSession(NEXT_AUTH);

    if (!session || session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapters = await prisma.chapter.findMany({
      where: subject ? { subject: { name: subject } } : {},
      include: {
        questions: {
          include: {
            subject: true,
          },
        },
        subject: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ chapters });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}