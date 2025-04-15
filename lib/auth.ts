// import GoogleProvider from "next-auth/providers/google";
// import { prisma } from "./prisma";

// export const NEXT_AUTH = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID || "",
//       clientSecret: process.env.GOOGLE_SECRET || "",
//       authorization: {
//         params: {
//           prompt: "select_account"
//         }
//       }
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     maxAge: 1 * 24 * 60 * 60,
//   },
//   callbacks: {

//     async redirect({ url, baseUrl }) {
//       if (url.startsWith('android-app://')) {
//         return `${baseUrl}/student/dashboard`;
//       }
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },

//     async jwt({ token, user }: any) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },

//     async session({ session, token }: any) {
//       if (token?.id) {
//         session.user.id = token.id;
//       }
//       return session;
//     },

//     async signIn({ user, account }: any) {
//       if (account?.provider === "google") {
//         try {
//           const { email, name, id: googleId } = user;

//           let existingUser = await prisma.user.findFirst({
//             where: {
//               OR: [{ googleId }, { email }],
//             },
//           });

//           if (!existingUser) {
//             existingUser = await prisma.user.create({
//               data: {
//                 email: email as string,
//                 name: name as string,
//                 googleId,
//               },
//             });
//           }

//           user.id = existingUser.id;
//           return true;
//         } catch (error) {
//           console.error("Error in signIn callback:", error);
//           return false;
//         }
//       }
//       return false;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin",
//   },
// };


import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const NEXT_AUTH: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline" // Add for refresh tokens
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  cookies: { // Moved to root level
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: false, // Required for WebView access
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Store only what you need
        token.accessToken = token.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      // Expose only necessary token data
      session.accessToken = token.accessToken;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Enhanced mobile handling
      if (url.startsWith('android-app://') || 
          url.startsWith('com.example.vidyastraa_app://')) {
        return `${baseUrl}/api/auth/sync`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const email = user.email as string;
          const name = user.name as string;
          const googleId = user.id as string;

          const existingUser = await prisma.user.upsert({
            where: { email },
            update: { googleId },
            create: {
              email,
              name: name || email.split('@')[0],
              googleId,
            },
          });
          user.id = existingUser.id;
          return true;
        } catch (error) {
          console.error("SignIn error:", error);
          return false;
        }
      }
      return false;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};