import { authClient } from "./authClient";
import { useAuthStore } from "./authStore";

export async function useSignup({ name, email, password }: { name: string; email: string; password: string }) {
    const setUser = useAuthStore.getState().setUser;
    const { data, error } = await authClient.signUp.email({ name, email, password });
    if (error) throw error;
    setUser(data.user);
}