import NextAuth, { SessionStrategy } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const AUTH_PROVIDERS = [
  Credentials({
    name: "Local Credentials",
    credentials: {
      username: {
        label: "Mocked Local Admin",
        type: "text",
        value: "admin",
      },
    },
    authorize: () => {
      return {
        id: "1",
        name: "Admin Admin",
        email: "admin@google.com",
      };
    },
  }),
];

export const authOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 3600,
  },
  providers: AUTH_PROVIDERS,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true;
    },
  },
};

export default NextAuth(authOptions);
