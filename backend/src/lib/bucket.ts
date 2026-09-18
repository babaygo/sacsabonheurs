import { S3Client, PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { createHash } from "crypto";

export const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
    },
});

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

export function versionedKey(originalname: string, buffer: Buffer, folder?: string): string {
    const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 8);
    const dot = originalname.lastIndexOf(".");
    const base = dot > 0 ? originalname.slice(0, dot) : originalname;
    const ext = dot > 0 ? originalname.slice(dot) : "";
    const name = `${base}-${hash}${ext}`;
    return folder ? `${folder}/${name}` : name;
}

export async function uploadToR2(file: Express.Multer.File, folder?: string): Promise<string> {
    const key = versionedKey(file.originalname, file.buffer, folder);
    try {
        await s3.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: IMMUTABLE_CACHE,
        }));
    } catch (error: any) {
        console.error("Upload échoué :", error);
        throw error;
    }

    return `${process.env.DOMAIN_MEDIAS}/${key}`;
}

export async function deleteImagesFromR2(urls: string[]): Promise<void> {
    if (!Array.isArray(urls) || urls.length === 0) return;

    const keysToDelete = urls.map(url => {
        try {
            const u = new URL(url);
            let key = u.pathname;

            if (key.startsWith("/cdn-cgi/image/")) {
                key = key.replace(/^\/cdn-cgi\/image\/[^/]+\//, "/");
            }

            return { Key: key.startsWith("/") ? key.substring(1) : key };
        } catch {
            return { Key: url.replace(`${process.env.DOMAIN_MEDIAS}/`, "") };
        }
    });

    try {
        await s3.send(
            new DeleteObjectsCommand({
                Bucket: process.env.R2_BUCKET!,
                Delete: {
                    Objects: keysToDelete,
                    Quiet: true,
                },
            })
        );
    } catch (err) {
        console.error(`Échec suppression groupée R2 :`, err);
    }
}

export function cfImageUrl(
    url: string,
    params = "width=auto,quality=auto,format=auto"
) {
    try {
        const u = new URL(url);
        let path = u.pathname;

        if (path.startsWith("/cdn-cgi/image/")) {
            path = path.replace(/^\/cdn-cgi\/image\/[^/]+/, "");
        }

        return `${u.origin}/cdn-cgi/image/${params}${path}`;
    } catch {
        return url;
    }
}
