import { authClient } from "./authClient";
import { useAuthStore } from "./authStore";

export async function useLogin({ email, password }: { email: string; password: string }) {
    const setUser = useAuthStore.getState().setUser;
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw error;
    setUser(data.user);
}