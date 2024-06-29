import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";

const bucketName = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_KEY;
const secretAccessKey = process.env.S3_SECRET;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const getS3FilesList = async (): Promise<String[]> => {
  const commandFile = new ListObjectsV2Command({
    Bucket: `${bucketName}`,
    Prefix: "spec/",
  });

  try {
    const result = await s3.send(commandFile);

    return (result.Contents || [])
      .filter((el) => el.Key && el.Key.endsWith(".pdf"))
      .map((el) => el.Key!.slice(5));
  } catch (e) {
    console.error("Error fetching files list:", e);
  }
};

export const uploadToS3 = async (
  file: UploadedFile
): Promise<PutObjectCommandOutput> => {
  const commandFile = new PutObjectCommand({
    Bucket: bucketName,
    Key: `spec/${file.name}`,
    Body: Buffer.from(file.data),
    ContentType: file.mimetype,
  });

  try {
    return await s3.send(commandFile);
  } catch (e) {
    console.error("Error uploading file:", e);
  }
};

export const downloadFromS3 = async (
  file: string
): Promise<GetObjectCommandOutput> => {
  const commandFile = new GetObjectCommand({
    Bucket: bucketName,
    Key: `spec/${file}`,
  });

  try {
    return await s3.send(commandFile);
  } catch (e) {
    console.error("Error downloading file:", e);
    throw e;
  }
};
