import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreUserRepository } from "@/core/repositories/FirestoreUserRepository";
import { logError } from "@/core/utils/logger";

const repository = new FirestoreUserRepository();

export const authOptions = {
  session: { strategy: "jwt" as SessionStrategy },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        try {
          // 1. Check for missing credentials
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // 2. Check if the user exists
          let user = await repository.getUserByEmail(credentials.email);

          if (!user) {
            return null;
          }

          // 3. Validate user password
          const isValidPassword = await user.checkPassword(credentials.password);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (e) {
          logError("Unable to authorize user", e, "next-auth (authorize)");

          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
