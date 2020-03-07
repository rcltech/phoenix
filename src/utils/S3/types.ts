interface S3UploadResponse {
  isSuccessful: boolean;
  image_url: string;
}

interface S3DeleteResponse {
  isSuccessful: boolean;
}

export { S3UploadResponse, S3DeleteResponse };
