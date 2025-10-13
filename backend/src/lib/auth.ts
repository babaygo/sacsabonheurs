import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '../lib/prisma'
import { admin } from "better-auth/plugins"
import { sendPasswordChangedEmail, sendResetPasswordEmail } from './email';

export const auth = betterAuth({
    baseURL: process.env.URL_BACK,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            sendResetPasswordEmail(user.email, url);
        },
        resetPasswordTokenExpiresIn: 3600,
        onPasswordReset: async ({ user }, request) => {
            await auth.api.revokeUserSessions({
                body: {
                    userId: user.id
                }
            });
            await sendPasswordChangedEmail(user.email);
            console.log(`Password for user ${user.email} has been reset.`);
        },
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
