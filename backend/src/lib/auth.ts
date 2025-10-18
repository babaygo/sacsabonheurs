import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '../lib/prisma'
import { admin } from "better-auth/plugins"
import { sendEmail, sendPasswordChangedEmail, sendResetPasswordEmail } from './email';

export const auth = betterAuth({
    baseURL: process.env.URL_BACK,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
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
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            await sendEmail({
                from: "no-reply@tondomaine.fr",
                to: user.email,
                subject: "Vérifiez votre adresse email",
                html: `
                    <p>Bonjour ${user.name || ""},</p>
                    <p>Merci de créer un compte. Cliquez sur le bouton ci-dessous pour vérifier votre adresse email :</p>
                    <p><a href="${url}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Vérifier mon email</a></p>
                    <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.</p>
                    `,
            });
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
