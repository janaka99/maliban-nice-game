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
import { otpSchema, PhoneNUmberForm } from "@/schema/multistepformschema";
import { z } from "zod";
import { useMultistepFormContext } from "@/context/steps/multistepsContext";
import SubmitButton from "../ui/SubmitButton";
import { validatePhoneNumber } from "@/actions/SendOTP";
import { toast } from "@/hooks/use-toast";
import { Toast } from "@radix-ui/react-toast";
import CountDown from "../CountDown";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/user/userContext";

type Props = {
  setCurrentStep: React.Dispatch<React.SetStateAction<"phone" | "otp">>;
};

export default function PhoneNumberForm({ setCurrentStep }: Props) {
  const [phoneErrorMessage, setPhoneErrorMessage] = useState<null | string>(
    null
  );
  const [showCountDown, setShowCountDown] = useState(false);
  const [expireTIme, setExpireTIme] = useState<null | Date | undefined>(null);
  const [firstTIme, setFirstTIme] = useState(true);
  const {
    step,
    goNext,
    goBack,
    goTo,
    currentStepIndex,
    GoToImageGeneratePage,
  } = useMultistepFormContext();

  const { phoneNumber, userId, setPhoneNumber, setUserId } = useUserContext();

  const form = useForm<z.infer<typeof PhoneNUmberForm>>({
    resolver: zodResolver(PhoneNUmberForm),
    defaultValues: {
      phoneNumber: "",
    },
  });

  async function onPhoneSubmit(values: z.infer<typeof PhoneNUmberForm>) {
    const res = await validatePhoneNumber(values);
    if (!res) {
      toast({
        variant: "destructive",
        description: "Something Went Wrong",
      });
      return;
    }

    if (res.error) {
      toast({
        variant: "destructive",
        description: res.message
          ? res.message.title
            ? res.message.title
            : "Something Went Wrong"
          : "Something Went Wrong",
      });
    }
    if (!res.user) {
      toast({
        variant: "destructive",
        description: res.message
          ? res.message.title
            ? res.message.title
            : "Something Went Wrong"
          : "Something Went Wrong",
      });
      return;
    }
    if (!res.user.phoneNumber || !res.user.id) {
      toast({
        variant: "destructive",
        description: "Something Went Wrong",
      });
      return;
    }
    setPhoneNumber(res.user.phoneNumber);
    setUserId(res.user.id);
    if (res.isVerified) {
      GoToImageGeneratePage();
    } else if (res.otp && res.otp.firstTime) {
      setCurrentStep("otp");
    } else if (res.otp && !res.otp.firstTime && res.otp.expire) {
      setShowCountDown(true);
      setExpireTIme(res.otp.expire);
      setFirstTIme(false);
      toast({
        title: res.message?.title,
      });
    } else {
      toast({
        variant: "destructive",
        description: "Something Went Wrong",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onPhoneSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-base font-semibold">
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  className="border-white text-base font-semibold focus:outline-none focus-visible:ring-white text-white min-w-[200px]"
                  placeholder="000000000"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-white font-bold">
                Enter without ' 0 '
              </FormDescription>
              <FormMessage />
              {showCountDown && expireTIme && (
                <CountDown
                  expireTime={expireTIme}
                  setCurrentStep={setCurrentStep}
                />
              )}
            </FormItem>
          )}
        />

        <SubmitButton isLoading={form.formState.isSubmitting} text="Verify" />
      </form>
      {!setFirstTIme && (
        <Button
          onClick={() => {
            setCurrentStep("otp");
          }}
          className=""
        >
          Add OTP
        </Button>
      )}
    </Form>
  );
}
