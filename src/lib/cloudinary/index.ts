import { Config } from "@/config";
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadResponseCallback,
} from "cloudinary";

cloudinary.config({
  cloud_name: Config.CLOUDINARY_CLOUD_NAME,
  api_key: Config.CLOUDINARY_API_KEY,
  api_secret: Config.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImage = async (file: Buffer) => {
  if (!file) {
    return null;
  }
  try {
    // const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(file);
    const res = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "maliban_nice_game_image",
            },
            function (err, result) {
              if (err) {
                reject(err);
              }
              resolve(result);
            }
          )
          .end(buffer);
      }
    );
    if (res) {
      return res;
    }
    return null;
  } catch (error) {
    return null;
  }
};
