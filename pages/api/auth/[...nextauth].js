import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials;

        try {
          const res = await axios(`${process.env.STRAPI_URL}auth/local`, {
            method: "POST",
            data: {
              identifier: username,
              password: password,
            },
            headers: {
              "Content-Type": "application/json",
            },
          });
          const user = res.data;
          if (user) {
            return res;
          } else {
            return null;
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.SECRET,
};
export default NextAuth(authOptions);
