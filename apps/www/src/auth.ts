import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";

import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from "./db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    accountsTable: accounts,
    usersTable: users,
    authenticatorsTable: authenticators,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google,
    Resend({
      from: "onboarding@resend.dev",
      apiKey: process.env.RESEND_API_KEY,
    }),
  ],
  callbacks: {
    redirect: () => "/dash",
  },
  session: {
    strategy: "database",
  },
  pages: {
    newUser: "/onboarding",
    signIn: "/login",
    verifyRequest: "/verify-request",
  },
});
