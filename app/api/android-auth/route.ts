import { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

const client = new OAuth2Client(process.env.GOOGLE_ID);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken" });
  }

  try {
    // Verify token (accepts both web and Android client IDs)
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_ID as string,
        process.env.ANDROID_CLIENT_ID as string,
      ],
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // Mirror your web signIn callback logic
    const { email, name, sub: googleId } = payload;
    const normalizedEmail = email.toLowerCase();

    // Find or create user (identical to web flow)
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email: normalizedEmail }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name || normalizedEmail.split("@")[0],
          googleId,
        },
      });
    }

    // Create session token matching web format
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      maxAge: 24 * 60 * 60, // 1 day (matches web session)
    });

    if (!token) {
      throw new Error("Token generation failed");
    }

    // Set cookies matching web authentication
    res.setHeader("Set-Cookie", [
      `next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      }`,
      `auth-state=authenticated; Path=/; Max-Age=${24 * 60 * 60}`, // 1 day
    ]);

    return res.status(200).json({
      success: true,
      redirectUrl: "/student/dashboard",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Android auth error:", error);
    return res.status(401).json({
      error: "Authentication failed",
      ...(process.env.NODE_ENV !== "production" && {
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    });
  }
}
