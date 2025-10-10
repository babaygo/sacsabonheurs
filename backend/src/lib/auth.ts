import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '../lib/prisma'
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [process.env.URL_FRONT!],
    advanced: {
        cookies: {
            session_token: {
                attributes: {
                    secure: true,
                    sameSite: 'None'
                }
            }
        }
    },
    plugins: [
        admin({
            defaultRole: "user",
            adminRoles: ["admin"],
        }),
    ],
});
