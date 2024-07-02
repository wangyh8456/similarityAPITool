import { NextAuthOptions } from "next-auth";
import { db } from "@/lib/db";
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GithubProvider from 'next-auth/providers/github'


function getGithubCrendentials() {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error('No clientId for github provider set');
    }
    if (!clientSecret || clientSecret.length === 0) {
        throw new Error('No clientSecret for github provider set');
    }

    return { clientId, clientSecret }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GithubProvider({
            clientId: getGithubCrendentials().clientId,
            clientSecret: getGithubCrendentials().clientSecret
        })
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
            }
            return session;
        },
        async jwt({ token, user }) {
            const dbuser = await db.user.findFirst({
                where: {
                    email: token.email
                }
            });
            if (!dbuser) {
                token.id = user!.id;
                return token;
            }
            return {
                id: dbuser.id,
                email: dbuser.email,
                name: dbuser.name,
                picture: dbuser.image
            }
        },
        redirect() {
            return '/dashboard';
        }
    }
}