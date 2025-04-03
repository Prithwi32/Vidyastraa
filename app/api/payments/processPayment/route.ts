import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, courseId, paymentId, amount, status } = await req.json();

    if (!userId || !courseId || !paymentId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User does not exist" }, { status: 404 });
    }

    // Store the Payment Record
    const payment = await prisma.payment.create({
      data: {
        userId,
        courseId,
        paymentId,
        amount: Number(amount), // Ensure number type
        status,
      },
    });

    // Enroll user if payment successful
    if (status === "SUCCESS") {
      await prisma.enrolledCourse.create({
        data: {
          userId,
          courseId,
          progress: 0.0,
        },
      });
    }

    return NextResponse.json({ message: "Payment processed successfully", payment }, { status: 201 });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
