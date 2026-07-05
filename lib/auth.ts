import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.jwt) return null;

          // The login response doesn't include the role, so fetch it separately
          let role = "Authenticated";
          try {
            const meRes = await fetch(
              `${STRAPI_URL}/api/users/me?populate=role`,
              { headers: { Authorization: `Bearer ${data.jwt}` } }
            );
            if (meRes.ok) {
              const me = await meRes.json();
              role = me.role?.name ?? role;
            }
          } catch {
            // keep default role if the lookup fails
          }

          return {
            id: String(data.user.id),
            name: data.user.username,
            email: data.user.email,
            role,
            strapiToken: data.jwt,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // `user` is only defined on the initial sign-in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.strapiToken = user.strapiToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      session.strapiToken = token.strapiToken as string;
      return session;
    },
  },
};
