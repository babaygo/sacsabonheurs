import { authClient } from "./authClient";

export async function useSignup({ name, email, password }: { name: string; email: string; password: string }) {
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) throw error;
}