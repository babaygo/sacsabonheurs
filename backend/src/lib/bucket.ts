import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
    },
});

export async function uploadToR2(file: Express.Multer.File): Promise<string> {
    const key = `${file.originalname}`;
    try {
        await s3.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));
    } catch (error: any) {
        console.error("Upload échoué :", error);

    }

    return `${process.env.DOMAIN_MEDIAS}/${key}`;
}

export async function deleteImagesFromR2(urls: string[]): Promise<void> {
    if (!Array.isArray(urls)) return;

    for (const url of urls) {
        const key = url.replace(`${process.env.DOMAIN_MEDIAS}/`, "");

        try {
            await s3.send(
                new DeleteObjectCommand({
                    Bucket: process.env.R2_BUCKET!,
                    Key: key,
                })
            );
        } catch (err) {
            console.warn(`Échec suppression image : ${key}`, err);
        }
    }
}

export function cfImageUrl(
    url: string,
    params = "width=auto,quality=auto,format=auto"
) {
    try {
        const u = new URL(url);

        if (u.pathname.startsWith("/cdn-cgi/image/")) {
            const path = u.pathname.replace(/^\/cdn-cgi\/image\/[^/]+/, "");
            return `${u.origin}/cdn-cgi/image/${params}${path}`;
        }

        return `${u.origin}/cdn-cgi/image/${params}${u.pathname}`;
    } catch {
        return url;
    }
}
