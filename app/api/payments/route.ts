import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  try {
    const payments = await prisma.payment.findMany({
      where: {
        OR: [
          { user: { name: { contains: query, mode: "insensitive" } } },
          { course: { title: { contains: query, mode: "insensitive" } } },
          { status: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        user: true,
        course: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPayments = payments.map((payment) => ({
      id: payment.id,
      userId: payment.userId,
      userName: payment.user.name,
      courseId: payment.courseId,
      courseName: payment.course.title,
      paymentId: payment.paymentId,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
    }));

    return NextResponse.json({ payments: formattedPayments });
  } catch (error) {
    return new NextResponse("Failed to fetch payments", { status: 500 });
  }
}
