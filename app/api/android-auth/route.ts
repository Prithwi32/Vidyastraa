import { OAuth2Client } from 'google-auth-library';
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize the OAuth2Client
const client = new OAuth2Client(process.env.GOOGLE_ID);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_ID as string,
        process.env.ANDROID_CLIENT_ID as string,
      ],
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email.toLowerCase(),
          name: payload.name || payload.email.split("@")[0],
          googleId: payload.sub,
        },
      });
    }

    // Create session
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      throw new Error("Token generation failed");
    }

    // Set cookies
    res.setHeader("Set-Cookie", [
      `next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure`,
      `auth-state=authenticated; Path=/; Max-Age=${24 * 60 * 60}`,
    ]);

    return res.status(200).json({
      success: true,
      redirectUrl: "/student/dashboard",
    });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      error: "Authentication failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
