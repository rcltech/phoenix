import env from "dotenv";

env.config();

const accessKeyId: string = process.env.AWS_IAM_ACCESS_KEY_ID;
const secretAccessKey: string = process.env.AWS_IAM_SECRET_ACCESS_KEY;
let bucketName: string = process.env.BUCKET_NAME;
bucketName += process.env.NODE_ENV === "development" ? "/dev" : "/production";

export { accessKeyId, secretAccessKey, bucketName };
