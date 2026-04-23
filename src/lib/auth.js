import { getServerSession } from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const providers = [];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions = {
  providers,
  secret: process.env.NEXTAUTH_SECRET || "dev-nextauth-secret",
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/api/auth/signin",
  },
};

export async function getAppServerSession(req, res) {
  return getServerSession(req, res, authOptions);
}

export async function requireApiSession(req, res) {
  const session = await getAppServerSession(req, res);

  if (!session) {
    res.status(401).json({ message: "Unauthorized. Please sign in first." });
    return null;
  }

  return session;
}
