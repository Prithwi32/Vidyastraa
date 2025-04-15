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
      authorization: {
        params: {
          // Add Android client ID for mobile app authentication
          audience: process.env.ANDROID_CLIENT_ID || "",
          // Force account selection for better mobile UX
          prompt: "select_account",
          // Request offline access for refresh tokens
          access_type: "offline",
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
      }
      // Store the access token for mobile clients if needed
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token?.id) {
        session.user.id = token.id;
      }
      // Expose access token to client if needed for mobile
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
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
      // Handle mobile app deep linking
      if (url.startsWith("/student/dashboard")) {
        return `${baseUrl}${url}`;
      }
      // Allow callback URLs from same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  // Enable debug logs in development for troubleshooting
  debug: process.env.NODE_ENV === "development",
};