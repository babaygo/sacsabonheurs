export function getBaseUrl() {
    if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_API_URL!;
    }

    return process.env.API_URL!;
}
