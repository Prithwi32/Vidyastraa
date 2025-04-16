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
          access_type: "offline",
          response_type: "code" // Explicitly set response type
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 6 * 60 * 60 // Refresh session every 6 hours
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: false, // Must be false for WebView access
        sameSite: "none", // Changed to none for cross-domain
        path: "/",
        secure: true,
        domain: process.env.NODE_ENV === "production" 
          ? ".vidyastraa-jeeneet.vercel.app" 
          : undefined
      },
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.accessToken as string;
      session.isWebView = token.isWebView as boolean;
      return session;
    },

  async redirect({ url, baseUrl }) {
  const appRedirectScheme = process.env.APP_REDIRECT_SCHEME || 'myapp';

  if (url.startsWith('android-app://') || 
      url.startsWith(`${appRedirectScheme}://`)) {
    return `${baseUrl}/api/auth/mobile-callback`;
  }
  return url.startsWith(baseUrl) ? url : baseUrl;
 }


    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.upsert({
            where: { email: profile?.email },
            update: { googleId: profile?.sub },
            create: {
              email: profile?.email as string,
              name: profile?.name || profile?.email?.split('@')[0],
              googleId: profile?.sub,
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
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify" // Add verification page
  }
};
