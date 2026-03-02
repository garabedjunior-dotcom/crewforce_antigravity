import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
    region: 'us-east-1', // MinIO requires a region, even if fake, 'us-east-1' is standard
    endpoint: process.env.S3_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true, // Necessary for MinIO
});

export const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'crewforce-logs';

export async function uploadImageToMinio(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: mimeType,
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        // Return the precise public URL
        return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${filename}`;
    } catch (error) {
        console.error("Failed to upload image to MinIO:", error);
        throw error;
    }
}
