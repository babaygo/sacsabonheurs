import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins"
import { nextCookies } from "better-auth/next-js";
import { getBaseUrl } from "../utils/getBaseUrl";

export const authClient = createAuthClient({
    baseURL: `${getBaseUrl()}`,
    fetchOptions: { credentials: "include" },
     plugins: [
        adminClient(),
        nextCookies()
    ]
});