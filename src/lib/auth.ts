import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string().min(6) })
                    .safeParse(credentials)

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data
                    const user = await prisma.user.findUnique({
                        where: { username },
                        include: { role: true },
                    })

                    if (!user) return null
                    if (!user.passwordHash) return null

                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

                    if (passwordsMatch) return user
                }

                return null
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                // @ts-ignore
                token.role = user.role?.name
            }
            return token
        },
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signOut: "/auth/signout",
        signIn: "/login", // Explicitly setting this too since we saw a login folder
    },
})
