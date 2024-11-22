// src/schemas/multiStepFormSchema.ts

import { z } from "zod";

export const PhoneNUmberForm = z.object({
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  id: z.string().min(1, "ID is required").nullable(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .nullable(),
});

const MAX_IMAGE_SIZE_MB = 10;

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  id: z.string().min(1, "ID is required").nullable(),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .nullable(),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  image: z
    .any()
    .refine(
      (file) => file instanceof File,
      "Image is required and must be a valid file"
    )
    .refine(
      (file: File) => file?.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024,
      `Image size must be less than ${MAX_IMAGE_SIZE_MB}MB`
    )
    .refine(
      (file: File) =>
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file?.type
        ),
      "Only JPG, JPEG, PNG, or WEBP formats are allowed"
    ),
  acceptTerms: z
    .boolean()
    .refine(
      (value) => value === true,
      "You must accept the terms and conditions"
    ),
});
