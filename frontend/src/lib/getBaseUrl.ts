export function getBaseUrl() {
    // Si on est côté navigateur → on utilise NEXT_PUBLIC_API_URL
    if (typeof window !== "undefined") {
        return process.env.NEXT_PUBLIC_API_URL!;
    }

    // Sinon (build, SSR, SSG, server components) → on utilise API_URL
    return process.env.API_URL!;
}
