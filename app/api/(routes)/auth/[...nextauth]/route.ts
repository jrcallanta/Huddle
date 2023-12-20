import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID ?? "",
            clientSecret: process.env.FACEBOOK_SECRET ?? "",
        }),
    ],
    callbacks: {
        async jwt({ token }) {
            token.userRole = "admin";
            return token;
        },
    },
});

export { handler as GET, handler as POST };
