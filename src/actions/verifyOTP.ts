"use server";
import { prisma } from "@/lib/prisma/index";

import { otpSchema } from "@/schema/multistepformschema";

import * as z from "zod";

const otpSchema2 = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const verifyOTP = async (values: z.infer<typeof otpSchema>) => {
  try {
    const validatedValues = otpSchema.safeParse(values);
    if (!validatedValues.success) {
      return {
        type: "inputError",
        message: {
          title: "Invalid OTP",
        },
      };
    }
    const { phoneNumber, id, otp } = validatedValues.data;
    if (!phoneNumber || !id) {
      return {
        type: "serverError",
        message: {
          title: "Server Error",
        },
      };
    }
    // check if phone number is verified
    const userExists = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
        id: id,
      },
    });

    if (!userExists) {
      return {
        type: "serverError",
        message: {
          title: "Server Error",
        },
      };
    }

    // check if user already verified
    if (userExists.phoneNumberVerified) {
      return {
        type: "success",
        message: {
          title: "User already verified",
        },
      };
    } else {
      if (userExists.otp == otp && userExists.otpExpire) {
        // chekc if otp has been expired
        const currentTime = new Date();
        const otpExpireTime = new Date(userExists.otpExpire);
        const expiryDuration = 10 * 60 * 1000;

        const timeDifference = otpExpireTime.getTime() - currentTime.getTime();

        if (timeDifference < expiryDuration && timeDifference > 0) {
          try {
            const res = await prisma.user.update({
              where: {
                id: id,
              },
              data: {
                phoneNumberVerified: new Date(),
              },
            });
            return {
              type: "otpSuccess",
              message: {
                title: "OTP has been Verified",
              },
            };
          } catch (error) {
            return {
              error: true,
              type: "otpError",
              message: {
                title: "OTP Expired or Invalid",
              },
            };
          }
        } else {
          return {
            error: true,
            type: "otpError",
            message: {
              title: "OTP Expired or Invalid",
            },
          };
        }
      } else {
        return {
          error: true,
          type: "otpError",
          message: {
            title: "OTP Expired or Invalid",
          },
        };
      }
    }
  } catch (err) {
    return {
      title: true,
      message: {
        title: "Unexpected Error",
        message: "There was an error creating a new role.",
      },
    };
  }
};
