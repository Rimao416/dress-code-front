import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

// import { Role } from "@prisma/client";
import authConfig from "./auth.config";
import { getAccountByUserId } from "./app/data/account";
import { getUserById } from "./app/data/user";
import prisma from "./lib/prisma";
// import { Role } from "@/prisma/app/generated/prisma/client";
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      console.log("J'aime bien ici");
      console.log("Voici le compte", account);
      /* Vérifie si l'utilisateur a vérifié son email avant de l'autoriser à se connecter. Cette logique s'applique uniquement aux connexions via "credentials" (identifiants, comme email/mot de passe). */
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id as string);
      if (!existingUser?.emailVerified) return false;

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      /**Personnalise les données de la session utilisateur. Ajoute leSs champs id et role à session.user, en se basant sur les informations du jeton JWT. */

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
