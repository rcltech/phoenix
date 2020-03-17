import { S3 } from "aws-sdk";
import { accessKeyId, secretAccessKey } from "./config";
import { S3UploadInput, S3UploadResponse } from "./types";

const s3: S3 = new S3({
  accessKeyId,
  secretAccessKey,
});

const uploadToS3 = async ({
  image_base64,
  file_name,
  bucket_name,
}: S3UploadInput): Promise<S3UploadResponse> => {
  const params = {
    Bucket: bucket_name,
    Key: `${file_name}.jpeg`,
    Body: Buffer.from(
      image_base64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    ),
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    ACL: "public-read",
  };

  const uploadImage = s3.upload(params).promise();
  const S3UploadResponse: S3UploadResponse = await uploadImage
    .then(data => ({ isSuccessful: true, image_url: data.Location }))
    .catch(err => {
      console.log(err);
      return { isSuccessful: false, image_url: "" };
    });

  return S3UploadResponse;
};

export { uploadToS3 };
