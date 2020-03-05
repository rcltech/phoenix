import AWS from "aws-sdk";
import { accessKeyId, secretAccessKey, bucketName } from "./config";

const s3: AWS.S3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});

const uploadToS3 = async ({
  image_base64,
  file_name,
}): Promise<string> | null => {
  const params = {
    Bucket: bucketName,
    Key: file_name,
    Body: Buffer.from(
      image_base64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    ),
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
  };

  const uploadImage = s3.upload(params).promise();
  const S3Response = await uploadImage
    .then(data => data)
    .catch(err => {
      console.log(err);
      return null;
    });

  if (!S3Response) return null;

  const { Location: image_url } = S3Response;
  return image_url;
};

const deleteFromS3 = async ({ event_id }): Promise<boolean> => {
  const params = {
    Bucket: bucketName,
    Key: event_id,
  };

  const deleteImage = s3.deleteObject(params).promise();
  const S3Response = await deleteImage
    .then(data => true)
    .catch(err => {
      console.log(err);
      return false;
    });

  return S3Response;
};

export { uploadToS3, deleteFromS3 };
