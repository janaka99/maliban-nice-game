"use server";
import { prisma } from "./../lib/prisma/index";

export async function fetchImagesAction(userID: string) {
  try {
    if (!userID) {
      return null;
    }

    const images = await prisma.generatedImage.findMany({
      where: {
        userId: userID,
      },
    });

    return images;
  } catch (error) {
    return null;
  }
}
