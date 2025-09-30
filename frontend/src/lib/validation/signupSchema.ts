import { z } from "zod";

export const signupSchema = z.object({
    email: z.email({ message: "Email invalide" }),
    password: z.string().min(8, { message: "Mot de passe trop court" }),
    firstname: z.string().min(1, { message: "Prénom requis" }),
    lastname: z.string().min(1, { message: "Nom requis" }),
});