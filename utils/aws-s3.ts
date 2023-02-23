import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";

const bucketName = process.env.S3_BUCKET;
const region = process.env.S3_REGION;
const accessKeyId = process.env.S3_KEY;
const secretAccessKey = process.env.S3_SECRET;

const s3: S3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const getS3FilesList = async () => {
  const commandFile = new ListObjectsV2Command({
    Bucket: `${bucketName}`,
  });
  try {
    const result = await s3.send(commandFile);
    return [...result.Contents]
      .filter((el) => el.Key.includes("spec/" && ".pdf"))
      .map((el) => el.Key.slice(5));
  } catch (e) {
    console.error(e);
  }
};

export const uploadToS3 = async (file: UploadedFile) => {
  const commandFile = new PutObjectCommand({
    Bucket: bucketName,
    Key: `spec/${file.name}`,
    Body: file.data.buffer,
    ContentType: file.mimetype,
  });
  try {
    await s3.send(commandFile);
  } catch (e) {
    console.error(e);
  }
};

export const downloadFromS3 = async (file: string) => {
  const commandFile = new GetObjectCommand({
    Bucket: bucketName,
    Key: `spec/${file}`,
  });

  try {
    return await s3.send(commandFile);
  } catch (e) {
    console.error(e);
  }
};
