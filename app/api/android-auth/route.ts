import { NextApiRequest, NextApiResponse } from 'next';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

const client = new OAuth2Client(process.env.GOOGLE_ID);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idToken } = req.body;

  try {
    // Verify Android token (accepts either web or android client ID)
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_ID || "", // Web client ID
        "916349849317-ce89nt281jg877pa0chfun7dmspr90rn.apps.googleusercontent.com" // Android client ID
      ]
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error('Invalid token payload');

    // Find or create user (same logic as your signIn callback)
    const { email, name, sub: googleId } = payload;
    
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email as string,
          name: name as string,
          googleId,
        },
      });
    }

    // Create session manually
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    // Set session cookie
    res.setHeader('Set-Cookie', `next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=Lax`);

    return res.status(200).json({ 
      success: true,
      redirectUrl: '/student/dashboard' 
    });

  } catch (error) {
    console.error('Android auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}