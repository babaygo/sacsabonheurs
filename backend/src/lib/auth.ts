import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from '../lib/prisma'
import { admin } from "better-auth/plugins"
import { sendEmail, sendPasswordChangedEmail, sendResetPasswordEmail } from './email';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            sendResetPasswordEmail(user.email, url);
        },
        resetPasswordTokenExpiresIn: 900,
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
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 900,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                await sendEmail({
                    from: `"Sacs à Bonheurs" <${process.env.MAIL_BOUTIQUE}>`,
                    to: user.email,
                    subject: "Vérifiez votre adresse email",
                    html: `
                    <p>Bonjour ${user.name || ""},</p>
                    <p>Bienvenue chez Sacs à Bonheur. Cliquez sur le bouton ci-dessous pour vérifier votre adresse email :</p>
                    <p><a href="${url}" style="background:#6b2e1c;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Vérifier mon email</a></p><br \>
                    <p>Ce mail expirera dans 15 minutes !</p>
                    <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement ce message.</p>
                    `,
                });
            } catch (error: any) {
                console.log("Erreur sur l'envoi du mail de vérification d'email", error)
            }
        },
    },
    trustedOrigins: [process.env.URL_FRONT!],
    advanced: {
        cookies: {
            session_token: {
                attributes: {
                    secure: true,
                    sameSite: 'None',
                    domain: process.env.COOKIE_DOMAIN || undefined,
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
