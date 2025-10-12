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
