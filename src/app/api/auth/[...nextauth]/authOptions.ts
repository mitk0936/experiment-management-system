import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { logError } from "@/core/utils/logger";
import { PasswordService } from "@/core/services/PasswordService";
import { UserRepository } from "@/core/repositories/User/UserRepository";

export const authOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await UserRepository.getUserByEmail(credentials.email);
          if (!user) {
            return null;
          }

          const isValidPassword = await PasswordService.checkPassword(
            credentials.password,
            user.password,
          );
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          logError("Unable to authorize user", error, "next-auth (authorize)");
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // @ts-expect-error Ignored due to an issue with built-in next-auth types
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // @ts-expect-error Ignored due to an issue with built-in next-auth types
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
