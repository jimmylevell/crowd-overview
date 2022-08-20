import NextAuth, { NextAuthOptions } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";
import jwt_decode from "jwt-decode";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID || '',
      clientSecret: process.env.KEYCLOAK_SECRET || '',
      issuer: process.env.KEYCLOAK_ISSUER,
    })
  ],
  session: {
    strategy: "jwt"
  },
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.roles && session?.user) {
        // @ts-ignore
        session.user.roles = token.roles
      }

      return session
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        const decoded = jwt_decode(account.access_token);
        // @ts-ignore
        token.roles = decoded?.resource_access?.smssender?.roles
      }

      return token;
    }
  },
}

export default NextAuth(authOptions)
