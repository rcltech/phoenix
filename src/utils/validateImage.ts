const getImageSize = (base64: string): number => {
  const decoded = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  return decoded.length;
};

export const isImageValid = (
  imageBase64: string,
  sizeLimit: number
): boolean => {
  const imageSize = getImageSize(imageBase64);
  return imageSize < sizeLimit;
};
