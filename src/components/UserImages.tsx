"use client";

import { fetchImagesAction } from "@/actions/fetchImagesAction";
import { useUserContext } from "@/context/user/userContext";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { useMultistepFormContext } from "@/context/steps/multistepsContext";
import { LoaderCircle } from "lucide-react";

type Props = {};

export default function UserImages({}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useUserContext();
  const [images, setImages] = useState<any>([]);
  const [largeImage, setLargeImage] = useState<string | null>(null);
  const [leftChanes, setLeftChanes] = useState(0);

  const { step, goNext, goBack, goTo, currentStepIndex } =
    useMultistepFormContext();

  const handleShare = async (imgUrl: string) => {
    const imageUrl = imgUrl; // Replace with your image URL

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          url: imageUrl, // URL to share
        });
      } catch (error) {}
    } else {
      alert("Sharing is not supported on this device or browser.");
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

          <Button
            onClick={() => {
              handleShare(largeImage);
            }}
            className="bg-malibanYellow hover:bg-yellow-400 text-malibanBlue uppercase font-black tracking-widest italic"
          >
            Share
          </Button>
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
