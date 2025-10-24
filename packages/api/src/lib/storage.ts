import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true, // Required for MinIO
});

const BUCKET = process.env.S3_BUCKET || 'merkadagency';
const PUBLIC_URL = process.env.S3_PUBLIC_URL || 'http://localhost:9000/merkadagency';

export interface UploadUrlResult {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Generate a presigned URL for uploading files
 */
export async function generateUploadUrl(
  fileName: string,
  contentType: string,
  folder: string = 'assets'
): Promise<UploadUrlResult> {
  const key = `${folder}/${uuidv4()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `${PUBLIC_URL}/${key}`;

  return { uploadUrl, publicUrl, key };
}

/**
 * Generate a presigned URL for downloading files
 */
export async function generateDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

/**
 * Get public URL for a key
 */
export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}
