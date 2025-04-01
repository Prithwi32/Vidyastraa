import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: "Invalid request data", isOk: false }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_SECRET_ID as string;

    // Generate HMAC SHA256 signature
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // console.log("Generated Signature:", generated_signature);
    // console.log("Received Signature:", razorpay_signature);

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ message: "Payment verification failed", isOk: false }, { status: 400 });
    }

    return NextResponse.json({ message: "Payment verified successfully", isOk: true }, { status: 200 });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ message: "Internal Server Error", isOk: false }, { status: 500 });
  }
}
