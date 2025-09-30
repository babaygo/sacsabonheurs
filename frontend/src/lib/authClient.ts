import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
    fetchOptions: { credentials: "include" },
});