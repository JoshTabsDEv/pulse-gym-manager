import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";

export const googleAuthEnabled =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

const baseProviders = [
  CredentialsProvider({
    name: "Admin",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials) return null;

      if (
        credentials.username === ADMIN_USERNAME &&
        credentials.password === ADMIN_PASSWORD
      ) {
        const adminUser: User = {
          id: "admin",
          name: "Gym Admin",
          email: "admin@gym.local",
          role: "admin",
        };

        return adminUser;
      }

      return null;
    },
  }),
];

const providers = googleAuthEnabled
  ? [
      ...baseProviders,
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ]
  : baseProviders;

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.role) {
        token.role = user.role;
      }

      if (account?.provider === "google") {
        token.role = "user";
      }

      token.role ??= "user";
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "admin" | "user" | undefined) ?? "user";
      }
      return session;
    },
  },
};

