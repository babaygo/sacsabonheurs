import { authClient } from "./authClient";

export async function useLogin({ email, password }: { email: string; password: string }) {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw error;
}
