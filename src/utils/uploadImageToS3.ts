import AWS from "aws-sdk";
import env from "dotenv";

env.config();

export const uploadImageToS3 = async ({
  image_base64,
  file_name,
}): Promise<string> | null => {
  const accessKeyId: string = process.env.AWS_IAM_ACCESS_KEY_ID;
  const secretAccessKey: string = process.env.AWS_IAM_SECRET_ACCESS_KEY;
  let bucketName: string = process.env.BUCKET_NAME;
  bucketName += process.env.NODE_ENV === "development" ? "dev" : "production";

  const s3: AWS.S3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
  });

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
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err);
      return null;
    });

  if (!S3Response) return null;

  const { Location: image_url } = S3Response;
  return image_url;
};
