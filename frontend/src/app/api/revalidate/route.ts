import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const secret = request.headers.get("x-revalidate-secret");
        const expectedSecret = process.env.REVALIDATE_SECRET;

        const origin = request.headers.get("origin");
        const referer = request.headers.get("referer") || "";
        const requestOrigin = request.nextUrl.origin;

        const isSameOrigin =
            (origin && origin === requestOrigin) ||
            (!origin && referer.startsWith(requestOrigin));

        const hasValidSecret = Boolean(expectedSecret) && secret === expectedSecret;

        if (!isSameOrigin && !hasValidSecret) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { paths, tags } = await request.json();

        const hasPaths = Array.isArray(paths);
        const hasTags = Array.isArray(tags);

        if (!hasPaths && !hasTags) {
            return NextResponse.json({ error: "Invalid paths or tags" }, { status: 400 });
        }

        if (hasPaths) {
            for (const path of paths) {
                revalidatePath(path);
            }
        }

        if (hasTags) {
            for (const tag of tags) {
                revalidateTag(tag);
            }
        }

        return NextResponse.json(
            { revalidated: true, paths: paths ?? [], tags: tags ?? [] },
            { status: 200 }
        );
    } catch {
        return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
    }
}
