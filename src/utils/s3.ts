import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import axios from "axios";
// Configure the AWS SDK with your credentials and desired region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION_S3,
});

const s3 = new AWS.S3();

const uploadImageToS3 = (params): Promise<any | Error> => {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.log("Error uploading image:", err);
        reject(err);
      } else {
        console.log("Image uploaded successfully:", data.Location);
        resolve(data);
      }
    });
  });
};

export const uploadImage = async (imageLink) => {
  if (!imageLink) return "";
  const response = await axios.get(imageLink, { responseType: "arraybuffer" });
  console.log(response);
  const fileContent = response.data;
  const fileName = nanoid();
  const fileExtension = imageLink.split(".")[imageLink.split(".").length - 1];
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${process.env.AWS_BUCKET_FOLDER}/${fileName}${fileExtension}`,
    Body: fileContent,
  };
  try {
    const uploadResponse = await uploadImageToS3(params);
    console.log("Upload response:", uploadResponse);
    return uploadResponse.Location;
    // Handle the upload response or perform any additional actions
  } catch (error) {
    console.log("Upload error:", error);
    return error;
  }
};
