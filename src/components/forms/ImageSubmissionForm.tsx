import { formSchema } from "@/schema/multistepformschema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
import { z } from "zod";
import SubmitButton from "../ui/SubmitButton";
import { FileInput } from "../ui/FileInput";
import { generateImageAction } from "@/actions/generateImage";
import { toast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/user/userContext";
import { useMultistepFormContext } from "@/context/steps/multistepsContext";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type Props = {};

export default function ImageSubmissionForm({}: Props) {
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { phoneNumber, userId } = useUserContext();
  const {
    step,
    goNext,
    goBack,
    goTo,
    currentStepIndex,
    GoToImageGeneratePage,
  } = useMultistepFormContext();

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
  const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const generatePreviewURL = (file: File) => {
    if (!VALID_FILE_TYPES.includes(file.type)) {
      // TODO - Return toast error
      return {
        valid: false,
        error: "Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      // TODO - Return toast error
      return {
        valid: false,
        error: "File size exceeds the maximum limit of 10MB.",
      };
    }

    const previewURL = URL.createObjectURL(file);

    return { valid: true, previewURL };
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const { valid, previewURL } = generatePreviewURL(file);
      if (valid && previewURL) {
        setPreviewURL(previewURL);
        imgForm.setValue("image", file);
        setError(null);
      } else {
        setPreviewURL(null);
        // TODO - show error
      }
    }
  };

  const imgForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phoneNumber: phoneNumber,
      id: userId,
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await generateImageAction(values);
    switch (res.type) {
      case "validation":
      case "serverError":
      case "imageExceed":
      case "generateError":
        toast({
          variant: "destructive",
          description: res.message.title,
        });
      case "success":
        goNext();
        toast({
          description: res.message.title,
        });
        break;

      default:
        break;
    }
  };

  return (
    <div className=" px-4 min-h-[100svh] w-full flex flex-col justify-start items-center relative">
      <div className="relative top-0 mb-4 w-full left-0 flex justify-center items-start min-h-[120px]">
        <img
          src="maliban_yellow.png"
          alt=""
          className="w-[300px] -mt-4 absolute top-0"
        />
        <img
          src="nice_header.png"
          alt=""
          className="w-[160px] -mt-1 absolute top-0"
        />
      </div>
      <Form {...imgForm}>
        <form
          onSubmit={imgForm.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <p className="text-sm italic text-yellow-400 font-semibold text-center max-w-[300px]">
            ඔයා කොච්චර nice ද කියලා දැනගන්න ඔයාගෙ photo එක පහලින් upload කරන්න
          </p>
          <FormField
            control={imgForm.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileInput
                    id="image"
                    accept=".jpg,.jpeg,.png,.webp"
                    {...field}
                    onChange={handleImageChange} // Hook to handle the change
                    isLoading={imgForm.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
          <FormField
            control={imgForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    className="bg-transparent w-full   text-base text-white text-centers px-2 outline-none py-2 border-malibanYellow border-2 rounded-3xl"
                    placeholder="NAME"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Gender Select */}
          <FormField
            control={imgForm.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || ""}
                  >
                    <SelectTrigger className="text-white border-2 text-base rounded-3xl border-malibanYellow focus:ring-0">
                      <SelectValue
                        placeholder="Select Gender"
                        className="text-white focus:ring-0  py-2"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={imgForm.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md ">
                <FormControl>
                  <Checkbox
                    className="border-white"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel
                    htmlFor="ads"
                    className="uppercase text-white text-xs flex gap-2 cursor-pointer"
                  >
                    I have read the
                    <Sheet>
                      <SheetTrigger asChild>
                        <p className="text-white text-xs  underline">
                          terms & conditions
                        </p>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Terms & Conditions</SheetTitle>
                          <SheetDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                          </SheetDescription>
                        </SheetHeader>
                      </SheetContent>
                    </Sheet>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          {imgForm.getValues("acceptTerms") ? (
            <SubmitButton
              className="rounded-3xl"
              isLoading={imgForm.formState.isSubmitting}
              text="Generate"
              disabled={false}
            />
          ) : (
            <SubmitButton
              className="rounded-3xl"
              isLoading={imgForm.formState.isSubmitting}
              text="Generate"
              disabled={true}
            />
          )}
        </form>
        <Button onClick={goNext}>See generated Images</Button>
      </Form>
    </div>
  );
}
