"use server";
import { Config } from "@/config";
import { prisma } from "@/lib/prisma/index";

import { formSchema, PhoneNUmberForm } from "@/schema/multistepformschema";
import axios from "axios";

import * as z from "zod";

export const validatePhoneNumber = async (
  values: z.infer<typeof PhoneNUmberForm>
) => {
  try {
    const validatedValues = PhoneNUmberForm.safeParse(values);
    if (!validatedValues.success) {
      return {
        error: true,
        message: {
          title: "Unexpected Error",
        },
      };
    }
    const { phoneNumber } = validatedValues.data;
    // check if phone number is verified
    const userExists = await prisma.user.findFirst({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (!userExists) {
      const newUser = await createUserWithOtp(phoneNumber);
      if (!newUser || !newUser.success) {
        return {
          error: true,
          message: {
            title: "Unexpected Error",
            message: "There was an registering the phone number.",
          },
        };
      }

      return {
        error: false,
        otp: {
          expire: newUser.user?.otpExpire,
          sent: true,
          firstTime: true,
        },
        user: {
          phoneNumber: newUser.user?.phoneNumber,
          verified: false,
          id: newUser.user?.id,
        },
        firstTime: true,
        isVerified: false,
        message: {
          title: `Successfully sent the OTP`,
        },
      };
    }

    // check if user already verified
    if (!userExists.phoneNumberVerified) {
      console.log("came here 1");
      if (userExists.otpExpire && userExists.otp) {
        console.log("came here 3");
        // navigate to image generate page
        const currentTime = new Date();
        const verificationExpirationTime = new Date(userExists.otpExpire);
        const expiryDuration = 2 * 60 * 1000;
        // Calculate the time difference in milliseconds
        const timeDifference =
          verificationExpirationTime.getTime() - currentTime.getTime();

        if (timeDifference < expiryDuration && timeDifference > 0) {
          console.log("came here 4");

          const timeLeft = Math.floor(timeDifference / 1000);
          const leftMin = Math.floor(timeLeft / 60);
          const leftSec = timeLeft % 60;

          return {
            error: false,
            otp: {
              expire: verificationExpirationTime,
              sent: true,
              firstTime: false,
            },
            user: {
              phoneNumber: userExists.phoneNumber,
              verified: false,
              id: userExists.id,
            },
            isVerified: false,
            message: {
              title: `Please try again after  ${leftSec} seconds`,
            },
          };
        } else {
          console.log("came here 5");
          const res = await updateExtingUserAndSendOTP(
            userExists.id,
            phoneNumber
          );
          console.log("came here 6");
          if (res.success) {
            return {
              error: false,
              otp: {
                expire: res.user?.otpExpire,
                sent: true,
                firstTime: true,
              },
              user: {
                phoneNumber: userExists.phoneNumber,
                verified: false,
                id: userExists.id,
              },
              isVerified: false,
            };
          }
          console.log("came here 7");

          return {
            error: true,
            message: {
              title: "Unexpected Error",
              message: "There was an registering the phone number.",
            },
          };
        }
      } else {
        const res = await updateExtingUserAndSendOTP(
          userExists.id,
          phoneNumber
        );
        console.log("came here 10");
        if (res.success) {
          console.log("came here 12");
          return {
            error: false,
            otp: {
              expire: res.user?.otpExpire,
              sent: true,
              firstTime: true,
            },
            user: {
              phoneNumber: userExists.phoneNumber,
              verified: false,
              id: userExists.id,
            },
            isVerified: false,
          };
        }
        console.log("came here 11");

        return {
          error: true,
          message: {
            title: "Unexpected Error",
            message: "There was an registering the phone number.",
          },
        };
      }
    } else {
      console.log("came here 2");
      return {
        error: false,
        isVerified: true,
        user: {
          phoneNumber: userExists.phoneNumber,
          verified: true,
          id: userExists.id,
        },
      };
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

async function createUserWithOtp(phoneNumber: string) {
  // TODO - generate otp
  const otp = generateOtp();
  const otpExpire = new Date(Date.now() + 2 * 60 * 1000); // 10 minutes from now
  await sendSms({
    to: phoneNumber,
    from: "Maliban Nice",
    body: otp,
  });
  try {
    const newUser = await prisma.user.create({
      data: {
        otp: otp,
        phoneNumber: phoneNumber,
        otpExpire: otpExpire, // Set the OTP expiration time
      },
    });

    return { success: true, user: newUser }; // Return success and user data
  } catch (error) {
    return { success: false, user: null }; // Return failure and error message
  }
}

async function updateExtingUserAndSendOTP(userId: string, phoneNumber: string) {
  // TODO - generate otp
  const otp = generateOtp();
  const otpExpire = new Date(Date.now() + 2 * 60 * 1000); // 10 minutes from now
  await sendSms({
    to: phoneNumber,
    from: "Maliban Nice",
    body: otp,
  });

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        otp: otp,
        otpExpire: otpExpire, // Set the OTP expiration time
      },
    });

    return { success: true, user: updatedUser }; // Return success and user data
  } catch (error) {
    return { success: false, user: null }; // Return failure and error message
  }
}

function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  return otp.toString(); // Convert the number to a string
}

async function sendSms({ to, from, body, statusCallback }: any) {
  try {
    const credentials = Buffer.from(
      `${Config.SMS160_PROJECT_ID}:${Config.SMS160_API_KEY}`
    ).toString("base64");

    // Set headers
    const headers = {
      Authorization: `Basic ${Config.BUFFERSTRING}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    // Prepare request data
    const formData = {
      to: `+94${to}`,
      from: Config.API_PROJECT_NAME,
      body: body,
    };

    // console.log(credentials);
    // console.log(credentials)
    // console.log(credentials)
    // Make API request/
    const response = await axios.post(
      "https://api.sms160.io/v1/messages",
      formData,
      {
        headers,
      }
    );

    // Return API response
    return response.data;
  } catch (error) {
    console.log("ssms erro ", error);
    throw new Error("Failed to send SMS. Please try again.");
  }
}
