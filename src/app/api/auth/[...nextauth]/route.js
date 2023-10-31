import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { LOGIN_ERR_KEY } from "@/utils/index";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials) {
        await connect();
        try {
          const user = await User.findOne({email: credentials.email.toLowerCase()});
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) return user;
            else throw new Error(JSON.stringify({[LOGIN_ERR_KEY]: "incorrect password" }));
          } else {
            throw new Error(JSON.stringify({[LOGIN_ERR_KEY]: "user does not exist" }));
          }
        } catch (err) {
          console.log(`Login Error: `, err);
          throw err;
        }
      },
    }),
  ],
  pages: {
    error: "/dashboard/login",
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token}) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST }