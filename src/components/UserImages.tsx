"use client";

import { fetchImagesAction } from "@/actions/fetchImagesAction";
import { useUserContext } from "@/context/user/userContext";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useMultistepFormContext } from "@/context/steps/multistepsContext";
import { LoaderCircle } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { isMobile } from "react-device-detect";
type Props = {};

export default function UserImages({}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useUserContext();
  const [images, setImages] = useState<any>([]);
  const [largeImage, setLargeImage] = useState<string | null>(null);
  const [leftChanes, setLeftChanes] = useState(0);
  const [imageType, setImageType] = useState(null);

  const { step, goNext, goBack, goTo, currentStepIndex } =
    useMultistepFormContext();

  // const [isMobile, setIsMobile] = useState(false);

  const isMobileDevice = () => {
    if (typeof window === "undefined") return false;

    // Check for userAgent (supports older browsers as well)
    const userAgent = navigator.userAgent || "";
    return /iPhone|iPad|iPod|Android/i.test(userAgent);
  };

  // useEffect(() => {
  //   setIsMobile(isMobileDevice());
  // }, []);

  const shareInstagram = (imageUrl: string) => {
    const encodedImageUrl = encodeURIComponent(imageUrl);
    // Instagram app deep link for Stories (on mobile)
    const instagramAppUrl = "instagram://";

    // Instagram web URL to create a story (fallback for desktop)
    const instagramWebUrl = `https://www.instagram.com/create/story/?url=${encodedImageUrl}`;

    if (isMobile) {
      // Use deep link for mobile devices
      window.location.href = instagramAppUrl;

      setTimeout(() => {
        // If Instagram app doesn't open, fall back to the web
        if (document.hasFocus()) {
          window.location.href = instagramWebUrl;
        }
      }, 2000);
    } else {
      // Open Instagram in the browser for non-mobile devices
      window.open(instagramWebUrl, "_blank");
    }
  };

  const shareFacebook = (imageUrl: string) => {
    const encodedImageUrl = encodeURIComponent(imageUrl);

    // Facebook Story deep link (for mobile)
    const facebookAppUrl = `fb://story?source=${encodedImageUrl}`;

    // Facebook web URL (for sharing a link to the image on Facebook Stories, fallback for desktop)
    const facebookWebUrl = `https://www.facebook.com/stories/create/?url=${encodedImageUrl}`;

    if (isMobile) {
      // Use deep link for mobile devices (opens Facebook app)
      window.location.href = facebookAppUrl;

      setTimeout(() => {
        // If Facebook app doesn't open, fall back to the web
        if (document.hasFocus()) {
          window.location.href = facebookWebUrl;
        }
      }, 2000);
    } else {
      // Open Facebook in the browser for non-mobile devices
      window.open(facebookWebUrl, "_blank");
    }
  };

  const handleDownload = async (imgUrl: string) => {
    try {
      // Replace with your Cloudinary image URL
      const imageUrl = imgUrl;

      // Fetch the image and convert it to a Blob
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the image.");
      }
      const blob = await response.blob();

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "maliban_nice.jpg"; // Replace with your desired file name
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.log("Image download failed");
    }
  };

  const fetchImages = async () => {
    if (!userId) {
      return null;
    }
    const images = await fetchImagesAction(userId);
    if (images && images.length > 0) {
      console.log(images);
      setImages(images);
      setLargeImage(images[images.length - 1].url);
      setLeftChanes(getLeftChances(images.length));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  function getLeftChances(imagesLength: number, totalChances = 3) {
    const leftChances = totalChances - imagesLength;
    return leftChances > 0 ? leftChances : 0; // Ensures no negative chances
  }

  useEffect(() => {
    fetchImages();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin text-white" />
      </div>
    );
  }
  if (!images || images.length <= 0) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <button
          onClick={() => {
            goBack();
          }}
          className="text-sm text-white font-semibold"
        >
          Generate Image
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100svh] flex gap-4 flex-col justify-center items-center py-20">
      {largeImage && (
        <>
          <div className="relative">
            <img
              src={largeImage}
              alt=""
              className="max-w-[280px] w-full aspect-[9/16] object-cover rounded-xl large-image-shadow "
            />
          </div>

          {/* <Button
            onClick={() => {
              handleShare(largeImage);
            }}
            className="bg-malibanYellow hover:bg-yellow-400 text-malibanBlue uppercase font-black tracking-widest italic"
          >
            Download
          </Button> */}
          <Button
            onClick={() => handleDownload(largeImage)}
            className="bg-yellow-400 hover:bg-yellow-400 text-malibanBlue uppercase font-black tracking-widest italic  "
          >
            Download
          </Button>
          <div className="flex flex-col">
            <div className="">
              <p className="text-base pb-1 text-center text-white font-semibold">
                Share to
              </p>
            </div>

            <div className="flex justify-center items-center gap-5">
              {/* {isMobile ? ( */}
              <>
                <button
                  onClick={() => {
                    shareFacebook(largeImage);
                  }}
                  className="border-2 border-white rounded-full w-10 aspect-square flex justify-center items-center "
                >
                  <FaFacebookF size={25} className="text-white" />
                </button>
                <button
                  onClick={() => {
                    shareInstagram(largeImage);
                  }}
                  className="border-2 border-white  rounded-full w-10 aspect-square flex justify-center items-center "
                >
                  <FaInstagram size={25} className="text-white" />
                </button>
              </>
              {/* ) : (
                <>
                  <a
                    href="https://www.facebook.com/"
                    className="border-2 border-white rounded-full w-10 aspect-square flex justify-center items-center "
                  >
                    <FaFacebookF size={25} className="text-white" />
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    className="border-2 border-white  rounded-full w-10 aspect-square flex justify-center items-center "
                  >
                    <FaInstagram size={25} className="text-white" />
                  </a>
                </>
              )} */}
            </div>
          </div>
        </>
      )}
      <button
        onClick={() => {
          if (leftChanes >= 3) {
            toast({
              description: "You can only generate 3 images",
            });
          } else {
            goBack();
          }
        }}
        className="text-sm text-white font-semibold"
      >
        RETRY {`(${leftChanes})`}
      </button>
      <div className="flex  max-w-[280px] w-full justify-around  ">
        {images.map((img: any, i: any) => (
          <img
            key={i}
            src={img.url}
            onClick={() => {
              setLargeImage(img.url);
            }}
            alt=""
            className=" w-20  aspect-square object-cover rounded-lg border-2 shadow-md border-white cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}

// const handleShare = async (imgUrl: string) => {
//   const imageUrl = imgUrl; // Replace with your image URL

//   const response = await fetch(imageUrl);

//   if (!response.ok) {
//     throw new Error("Failed to fetch image");
//   }

//   // Convert response into an ArrayBuffer
//   const arrayBuffer = await response.arrayBuffer();

//   // Convert ArrayBuffer into a Buffer
//   const buffer = Buffer.from(arrayBuffer);

//   // Create Blob from Buffer
//   const blob = new Blob([buffer], { type: "image/jpeg" });

//   // Create a temporary URL for the Blob
//   const imageUrl2 = URL.createObjectURL(blob);
//   // / Use the Web Share API for sharing (mobile support)
//   // try {
//   //   await navigator.share({
//   //     title: "Check out this image!",
//   //     text: "I found this amazing image!",
//   //     url: imageUrl2, // Share the temporary image URL
//   //   });
//   //   console.log("Image shared successfully!");
//   // } catch (err) {
//   //   console.error("Error sharing image:", err);
//   // }

//   //////////////////////

//   // // Check if Web Share API is supported
//   // if (navigator.share) {
//   //   try {
//   //     await navigator.share({
//   //       url: imageUrl, // URL to share
//   //     });
//   //   } catch (error) {}
//   // } else {
//   //   alert("Sharing is not supported on this device or browser.");
//   // }
// };
