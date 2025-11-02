import { z } from "zod";

export const loginSchema = z.object({
    email: z.email({ message: "Email invalide" }),
    password: z.string()
});