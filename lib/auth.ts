// import GoogleProvider from "next-auth/providers/google";
// import { prisma } from "./prisma";

// export const NEXT_AUTH = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID || "",
//       clientSecret: process.env.GOOGLE_SECRET || "",
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
//   session:{
//     maxAge: 1 * 24 * 60 * 60,
//   },
//   callbacks: {
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
import { prisma } from "./prisma";

export const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      // Remove Android-specific authorization params
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // For mobile apps, redirect back to the app's main URL
      if (url.startsWith("android-app://")) {
        return `${baseUrl}/student/dashboard`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },

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

    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google") {
        try {
          const { email, name, sub: googleId } = profile;

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

    async redirect({ url, baseUrl }: any) {
      // Handle both web and mobile redirects
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};
