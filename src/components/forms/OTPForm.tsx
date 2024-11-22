"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "@/schema/multistepformschema";
import { z } from "zod";
import { useMultistepFormContext } from "@/context/steps/multistepsContext";
import SubmitButton from "../ui/SubmitButton";
import { useUserContext } from "@/context/user/userContext";
import { verifyOTP } from "@/actions/verifyOTP";
import { toast } from "@/hooks/use-toast";

type Props = {};

export default function OTPForm({}: Props) {
  const [OTPerrorMessage, setOTPErrorMessage] = useState<null | string>(null);

  const { step, goNext, goBack, goTo, currentStepIndex } =
    useMultistepFormContext();

  const { phoneNumber, userId, setPhoneNumber, setUserId } = useUserContext();

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
      phoneNumber: phoneNumber,
      id: userId,
    },
  });

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    const res = await verifyOTP(values);
    switch (res.type) {
      case "inputError":
      case "otpError":
      case "otpError":
      case "serverError":
        toast({
          variant: "destructive",
          description: res.message.title,
        });
        break;
      case "success":
        goNext();
        break;
      case "otpSuccess":
        goNext();
        toast({
          description: res.message.title,
        });
        break;
      default:
        break;
    }
  }

  return (
    <Form {...otpForm}>
      <form
        onSubmit={otpForm.handleSubmit(onOtpSubmit)}
        className="space-y-8 w-[300px]"
      >
        <div className="-mt-10 w-full px-5">
          <img
            src="nice_meter.png"
            alt=""
            className="object-contain w-full max-w-[200px] mx-auto"
          />
        </div>
        <FormField
          control={otpForm.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-base font-semibold">
                Enter OTP
              </FormLabel>
              <FormControl>
                <Input
                  className="border-white text-base font-semibold focus:outline-none focus-visible:ring-white text-white min-w-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          isLoading={otpForm.formState.isSubmitting}
          text="Verify OTP"
        />
      </form>
    </Form>
  );
}
