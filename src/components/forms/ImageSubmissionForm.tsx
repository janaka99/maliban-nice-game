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
  const VALID_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

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
        toast({
          description: "Something Went Wrong",
        });
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
          className="space-y-6 flex-grow flex flex-col  justify-center items-center"
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
                    className="bg-transparent w-full min-w-[270px]  text-base text-white text-centers px-2 outline-none py-2 border-malibanYellow border-2 rounded-3xl"
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
                    <SelectTrigger className="text-white border-2 text-base rounded-3xl min-w-[270px] border-malibanYellow focus:ring-0">
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
                        </SheetHeader>
                        <div className="text-xs flex flex-col gap-2 text-start overflow-y-scroll h-full scroll-auto pb-14">
                          <h1>
                            Terms and Conditions for Maliban Nice Meter Campaign
                          </h1>
                          <p>
                            <strong>Effective Date:</strong> 22nd November 2024
                          </p>
                          <p>
                            Welcome to the Maliban Nice Meter Campaign. By
                            accessing or using the AI-powered face-swapping tool
                            on malibannice.com (“Website”), you agree to these
                            Terms and Conditions (“Terms”).
                          </p>

                          <h2>1. Eligibility</h2>
                          <p>
                            1.1. You must be at least 18 years old to use the
                            tool. If you are under 18, parental or guardian
                            consent is required.
                          </p>
                          <p>
                            1.2. By using the Website and the tool, you confirm
                            that:
                          </p>
                          <ul>
                            <li>
                              You have the right to use and upload the image
                              provided.
                            </li>
                            <li>
                              The image belongs to you and does not belong to
                              any third party unless you have their explicit,
                              provable consent to upload it.
                            </li>
                          </ul>

                          <h2>2. Use of the Face-Swapping Tool</h2>
                          <p>
                            2.1. The tool is for personal and non-commercial use
                            only.
                          </p>
                          <p>
                            2.2. You may not use the tool to create content that
                            is defamatory, obscene, harmful, illegal, or
                            violates any third-party rights.
                          </p>
                          <p>2.3. Responsibility for Uploaded Content:</p>
                          <ul>
                            <li>
                              Users are solely responsible for the images they
                              upload.
                            </li>
                            <li>
                              Maliban does not authorize or condone the
                              uploading of images of others without their
                              explicit, provable consent.
                            </li>
                            <li>
                              If you upload an image without someone’s consent
                              and it results in a legal matter, Maliban is not
                              liable. The sole liability rests with you, the
                              user.
                            </li>
                          </ul>
                          <p>
                            2.4. Maliban provides this platform solely for
                            engagement purposes and creative execution. We are
                            not liable for how users choose to use or share the
                            content generated using the tool.
                          </p>

                          <h2>3. Data Privacy</h2>
                          <p>3.1. Uploaded Images:</p>
                          <ul>
                            <li>
                              Uploaded images are processed temporarily and used
                              only to generate your personalized campaign
                              visual.
                            </li>
                            <li>
                              Images are not stored or retained on Maliban’s
                              servers after the visual is generated.
                            </li>
                          </ul>

                          <h2>4. Limitations of Liability</h2>
                          <ul>
                            <li>
                              4.1. Maliban is not responsible for any misuse of
                              the content generated by users on the platform.
                            </li>
                            <li>
                              4.2. Maliban disclaims any liability for
                              user-generated content that is unlawful,
                              unauthorized, or violates third-party rights.
                            </li>
                          </ul>

                          <h2>5. Contact Information</h2>
                          <p>
                            If you have any questions or concerns about these
                            Terms, please contact us via email at{" "}
                            <a href="mailto:cic@malibangroup.lk">
                              cic@malibangroup.lk
                            </a>
                            .
                          </p>

                          <h2>6. Changes to Terms and Conditions</h2>
                          <p>
                            Maliban reserves the right to modify these Terms at
                            any time. Updated Terms will be made available on
                            the Website, and continued use of the tool
                            constitutes acceptance of the revised Terms.
                          </p>

                          <p>
                            By using the Maliban Nice Meter Campaign and its
                            face-swapping tool, you agree to comply with these
                            Terms and take full responsibility for the content
                            you generate and share.
                          </p>
                        </div>
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
          <button
            type="button"
            className="text-xs mb-[-15px] text-white font-bold border-y-secondary-foreground"
            onClick={goNext}
          >
            See generated Images
          </button>
        </form>
      </Form>
    </div>
  );
}
