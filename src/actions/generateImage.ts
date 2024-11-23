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

    // const meen = [
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732275284/men1_brkadj.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732275284/men2_wgf9sh.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732275283/men4_ffwteg.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732275283/men3_uwsbvk.jpg",
    // ];

    // const girls = [
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732275283/women2_yxw9b3.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732275283/women1_grpj3i.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732275283/women4_kvpvth.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732275283/women3_u1wbgs.jpg",
    // ];

    const meen = [
      "https://res.cloudinary.com/janaka99/image/upload/v1732369717/Maliban_Nice_Meter-App-Images-100B_tzrpwm.png",
      "https://res.cloudinary.com/janaka99/image/upload/v1732369710/Maliban_Nice_Meter-App-Images-50B_odzcgp.png",
      "https://res.cloudinary.com/janaka99/image/upload/v1732369706/Maliban_Nice_Meter-App-Images-25B_ipfcuw.png",
      "https://res.cloudinary.com/janaka99/image/upload/v1732369703/Maliban_Nice_Meter-App-Images-200B_gmiiju.png",
    ];

    const girls = [
      "https://res.cloudinary.com/janaka99/image/upload/v1732369717/Maliban_Nice_Meter-App-Images-100G_iqldgo.png",
      "https://res.cloudinary.com/janaka99/image/upload/v1732369707/Maliban_Nice_Meter-App-Images-200G_snvro6.png",
      "https://res.cloudinary.com/janaka99/image/upload/v1732369702/Maliban_Nice_Meter-App-Images-50G_br7sp3.png",
      "https://res.cloudinary.com/janaka99/image/upload/v1732369702/Maliban_Nice_Meter-App-Images-25G_yfpwtr.png",
    ];

    // const meen = [
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732373061/WhatsApp_Image_2024-11-23_at_20.10.58_nhvsvt.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732373061/WhatsApp_Image_2024-11-23_at_20.10.59_3_wxxs3p.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732373061/WhatsApp_Image_2024-11-23_at_20.11.00_1_s8r1rx.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732373060/WhatsApp_Image_2024-11-23_at_20.10.59_1_cuthu9.jpg",
    // ];

    // const girls = [
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732373061/WhatsApp_Image_2024-11-23_at_20.10.59_knxiz6.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732373061/WhatsApp_Image_2024-11-23_at_20.11.00_2_lvctz9.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732373061/WhatsApp_Image_2024-11-23_at_20.11.00_xoqkh8.jpg",
    //   "https://res.cloudinary.com/janaka99/image/upload/v1732373060/WhatsApp_Image_2024-11-23_at_20.10.59_2_m5ac7u.jpg",
    // ];

    // const menImages = ["/men1.jpeg", "/men2.jpeg", "/men3.jpeg", "/men4.jpeg"];

    // const womenImages = [
    //   "/women1.jpeg",
    //   "/women2.jpeg",
    //   "/women3.jpeg",
    //   "/women4.jpeg",
    // ];

    let content = null;
    if (gender === "male") {
      content = meen[Math.floor(Math.random() * meen.length)];
    } else if (gender === "female") {
      content = girls[Math.floor(Math.random() * girls.length)];
    } else {
      return {
        type: "serverError",
        message: {
          title: "server Error",
        },
      };
    }
    const response2 = await fetch(content);

    if (!response2.ok) {
      throw new Error("Failed to fetch image");
    }

    // Convert the response into a buffer
    const buffer = await response2.arrayBuffer();

    // Create a Blob from the buffer
    const blob2 = new Blob([buffer], { type: "image/png" });

    // Read the file content as a buffer
    // const fileBuffer = fs.readFileSync(content);

    // const targetBlob = new Blob([blob2], { type: "image/png" });
    // console.log(targetBlob, blob2);
    formData.append("target_image", blob2, "target_image.png");

    const blob = new Blob([arrayBuffer], { type: image.type });
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
      interval = 100
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
