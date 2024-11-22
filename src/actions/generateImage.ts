"use server";
import { Config } from "@/config";
import { prisma } from "@/lib/prisma/index";
import path from "path";
import fs from "fs";
import { uploadImage } from "@/lib/cloudinary";
import { formSchema } from "@/schema/multistepformschema";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import axios from "axios";

const API_KEY = Config.IMAGE_GEN_API;

// Face Swap API URLs
const CREATE_JOB_URL =
  "https://developer.remaker.ai/api/remaker/v1/face-swap/create-job";
const FETCH_JOB_URL = (jobId: string) =>
  `https://developer.remaker.ai/api/remaker/v1/face-swap/${jobId}`;

export const generateImageAction = async (
  values: z.infer<typeof formSchema>
) => {
  try {
    const validatedValues = formSchema.safeParse(values);
    if (!validatedValues.success) {
      return {
        type: "validation",
        message: {
          title: "Validation Error",
        },
      };
    }
    const {
      image,
      name,
      gender,
      phoneNumber,
      id: userId,
    } = validatedValues.data;
    // check if phone numer exists
    console.log("reached 1 ");

    if (!phoneNumber || !userId) {
      return {
        type: "serverError",
        message: {
          title: "server Error",
        },
      };
    }

    const isNumberExists = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
        id: userId,
      },
      include: {
        _count: {
          select: {
            generatedImages: true,
          },
        },
      },
    });
    if (!isNumberExists) {
      return {
        type: "serverError",
        message: {
          title: "server Error",
        },
      };
    }
    if (isNumberExists._count.generatedImages >= 3) {
      return {
        type: "imageExceed",
        message: {
          title: "Maximum Generation Exceeded",
        },
      };
    }

    const arrayBuffer = await image.arrayBuffer();

    // Convert ArrayBuffer to Blob

    // console.log(blob, targetBlob);
    // return;
    // Create FormData to pass binary images

    const formData = new FormData();
    // const menImages = [
    //   path.join(process.cwd(), "public", "men1.jpeg"),
    //   path.join(process.cwd(), "public", "men2.jpeg"),
    //   path.join(process.cwd(), "public", "men3.jpeg"),
    //   path.join(process.cwd(), "public", "men4.jpeg"),
    // ];

    // const womenImages = [
    //   path.join(process.cwd(), "public", "women1.jpeg"),
    //   path.join(process.cwd(), "public", "women2.jpeg"),
    //   path.join(process.cwd(), "public", "women3.jpeg"),
    //   path.join(process.cwd(), "public", "women4.jpeg"),
    // ];

    const menImages = ["/men1.jpeg", "/men2.jpeg", "/men3.jpeg", "/men4.jpeg"];

    const womenImages = [
      "/women1.jpeg",
      "/women2.jpeg",
      "/women3.jpeg",
      "/women4.jpeg",
    ];

    let content = null;
    if (gender === "male") {
      content = menImages[Math.floor(Math.random() * menImages.length)];
    } else if (gender === "female") {
      content = womenImages[Math.floor(Math.random() * womenImages.length)];
    } else {
      return {
        type: "serverError",
        message: {
          title: "server Error",
        },
      };
    }

    // Read the file content as a buffer
    const fileBuffer = fs.readFileSync(content);

    const targetBlob = new Blob([fileBuffer], { type: "image/jpeg" });
    const blob = new Blob([arrayBuffer], { type: image.type });
    console.log(targetBlob, blob);
    formData.append("target_image", targetBlob, "target_image.jpg");
    formData.append("swap_image", blob, "swap_image.jpg");

    // Call the Face Swap API to create a jobv
    const createJobResponse = await axios.post(CREATE_JOB_URL, formData, {
      headers: {
        accept: "application/json",
        Authorization: API_KEY,
      },
    });
    console.log(createJobResponse.data);
    if (createJobResponse.data.code !== 100000) {
      return {
        type: "generateError",
        message: {
          title: "Server Error",
        },
      };
    }
    const jobId = createJobResponse.data.result.job_id;

    const pollJobStatus = async (
      jobId: string,
      interval = 2000
    ): Promise<string> => {
      while (true) {
        const fetchJobResponse = await axios.get(FETCH_JOB_URL(jobId), {
          headers: {
            accept: "application/json",
            Authorization: API_KEY,
          },
        });

        const jobCode = fetchJobResponse.data.code;
        console.log("Job Code ", fetchJobResponse.data);
        if (jobCode === 300102) {
          // Job is still loading, wait and retry
          await new Promise((resolve) => setTimeout(resolve, interval));
          continue;
        } else if (jobCode === 100000) {
          // Job completed successfully, return the output image URL
          return fetchJobResponse.data.result.output_image_url[0];
        } else {
          throw new Error(
            `Image generation job failed or returned unexpected status. Code: ${jobCode}`
          );
        }
      }
    };

    const outputImageUrl = await pollJobStatus(jobId);
    const response = await axios.get(outputImageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(response.data);
    const result = await uploadImage(imageBuffer);
    if (result && result.secure_url && result.public_id) {
      const generatedImage = await prisma.generatedImage.create({
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          userId: userId,
        },
      });

      return {
        type: "success",
        message: {
          title: "Image generation success",
        },
      };
    }
    return {
      type: "generateError",
      message: {
        title: "Image generation error",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      type: "generateError",
      message: {
        title: "Image generation error",
      },
    };
  }
};
