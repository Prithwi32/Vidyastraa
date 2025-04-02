import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId, courseId, paymentId, amount, status } = await req.json();

    if (!userId || !courseId || !paymentId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure amount is a number
    const parsedAmount = Number(amount);

    // 1️⃣ Store the Payment Record
    const payment = await prisma.payment.create({
      data: {
        userId,
        courseId,
        paymentId,
        amount: parsedAmount,
        status,
      },
    });

    // 2️⃣ If Payment is SUCCESS, Enroll User in Course
    if (status === "SUCCESS") {
      await prisma.enrolledCourse.create({
        data: {
          userId,
          courseId,
          progress: 0.0, // User starts at 0% progress
        },
      });
    }

    return NextResponse.json({ message: "Payment processed successfully", payment }, { status: 201 });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}