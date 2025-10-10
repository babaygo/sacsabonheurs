import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins"
import { getBaseUrl } from "./getBaseUrl";

export const authClient = createAuthClient({
    baseURL: `${getBaseUrl()}/api/auth`,
    fetchOptions: { credentials: "include" },
     plugins: [
        adminClient()
    ]
});