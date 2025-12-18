import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    // GitHub OAuth - set GITHUB_ID and GITHUB_SECRET in .env
    process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? GithubProvider({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET,
        })
      : null,
  ].filter(Boolean) as any,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
};

export default authOptions;
