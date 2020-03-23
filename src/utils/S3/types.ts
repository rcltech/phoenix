type S3UploadInput = {
  image_base64: string;
  file_name: string;
  bucket_name: string;
};

type S3UploadResponse = {
  isSuccessful: boolean;
  image_url: string;
};

type S3DeleteInput = {
  file_name: string;
  bucket_name: string;
};

type S3DeleteResponse = {
  isSuccessful: boolean;
};

export { S3UploadInput, S3UploadResponse, S3DeleteInput, S3DeleteResponse };
