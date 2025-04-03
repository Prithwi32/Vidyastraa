import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: { redirect_uri: "https://edu-platform-six.vercel.app/api/auth/callback/google" }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session:{
    maxAge: 1 * 24 * 60 * 60, 
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id; 
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },

    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          const { email, name, id: googleId } = user;

          let existingUser = await prisma.user.findFirst({
            where: {
              OR: [{ googleId }, { email }],
            },
          });

          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                email: email as string,
                name: name as string,
                googleId,
              },
            });
          }

          user.id = existingUser.id; 

          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return false;
    },
  },
  pages: {
    signIn: "/login",
  },
};
