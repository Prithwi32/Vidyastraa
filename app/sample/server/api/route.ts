import { NEXT_AUTH } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(NEXT_AUTH);

  if (session != null && session.user != null)
    return NextResponse.json({
      message: "user is authenticated",
      user: session.user,
    });
  else return NextResponse.json({ message: "user is not authenticated" });
}
