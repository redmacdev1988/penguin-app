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
          console.log('credentials', credentials);
          const user = await User.findOne({email: credentials.email});
          if (user) {
            console.log('User found in DB', user);
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
      console.log('-- got to jwt --', user);
      if (user) {
        console.log('user role', user.role);
        token.role = user.role;
      }
      return token;
    },
    session({ session, token}) {
      console.log('-- session --', session);
      console.log('token', token);
      if (token && session.user) {
        console.log('token role: ', token.role);
        session.user.role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST }