import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const secret = request.headers.get("x-revalidate-secret");
        const expectedSecret = process.env.REVALIDATE_SECRET;

        if (!expectedSecret) {
            return NextResponse.json({ error: "REVALIDATE_SECRET is not configured" }, { status: 500 });
        }

        const origin = request.headers.get("origin") || "";
        const isLocalDev = process.env.NODE_ENV !== "production" && origin.includes("localhost");

        if (!isLocalDev && secret !== expectedSecret) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { paths } = await request.json();

        if (!paths || !Array.isArray(paths)) {
            return NextResponse.json({ error: "Invalid paths" }, { status: 400 });
        }

        for (const path of paths) {
            revalidatePath(path);
        }

        return NextResponse.json({ revalidated: true, paths }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
    }
}
