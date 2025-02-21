import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreUserRepository } from "@/core/repositories/User/FirestoreUserRepository";
import { logError } from "@/core/utils/logger";
import { PasswordService } from "@/core/services/PasswordService";

const repository = new FirestoreUserRepository();

export const authOptions = {
  session: { strategy: "jwt" as SessionStrategy },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await repository.getUserByEmail(credentials.email);
          if (!user) return null;

          const isValidPassword = await PasswordService.checkPassword(
            credentials.password,
            user.password,
          );
          if (!isValidPassword) return null;

          return { id: user.id, email: user.email, name: user.name };
        } catch (error) {
          logError("Unable to authorize user", error, "next-auth (authorize)");
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
