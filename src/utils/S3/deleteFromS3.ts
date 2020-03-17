import { S3 } from "aws-sdk";
import { accessKeyId, secretAccessKey } from "./config";
import { S3DeleteInput, S3DeleteResponse } from "./types";

const s3: S3 = new S3({
  accessKeyId,
  secretAccessKey,
});

const deleteFromS3 = async ({
  file_name,
  bucket_name,
}: S3DeleteInput): Promise<S3DeleteResponse> => {
  const params = {
    Bucket: bucket_name,
    Key: file_name + ".jpg",
  };

  const deleteImage = s3.deleteObject(params).promise();
  const S3DeleteResponse: S3DeleteResponse = await deleteImage
    .then(data => ({ isSuccessful: true }))
    .catch(err => {
      console.log(err);
      return { isSuccessful: false };
    });

  return S3DeleteResponse;
};

export { deleteFromS3 };
