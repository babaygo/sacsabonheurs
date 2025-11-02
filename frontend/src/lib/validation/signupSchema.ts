import { z } from "zod";

export const signupSchema = z.object({
    email: z.email({ message: "Email invalide" }),
    password: z.string()
        .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/, { message: "Le mot de passe doit contenir au moins une majuscule et un chiffre" }),
    firstname: z.string().min(1, { message: "Prénom requis" }),
    lastname: z.string().min(1, { message: "Nom requis" }),
});