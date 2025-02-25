"use server";

import Palette from "../models/Palette";
import dbConnect from "../lib/database";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Generates a palette and redirects to the new URL
export async function generateColors(
  lockedColors: { [index: number]: string } = {},
) {
  const getRandomColor = () =>
    `${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;

  const colors = Array.from(
    { length: 5 },
    (_, index) => lockedColors[index] || getRandomColor(),
  );

  const colorString = colors.join("-");
  return redirect(`/${colorString}`);
}

export async function savePalette(colors: string[]) {
  try {
    await dbConnect();

    const session = await getSession();

    if (!session?.userId) {
      return { error: "you need to be logged in to save a palette" };
    }

    // Check if the palette already exists for the user, regardless of order
    const existingPalette = await Palette.findOne({
      userId: session.userId,
      colors: { $all: colors }, // Check if the colors array contains all the same colors
    });

    if (existingPalette) {
      return { error: "Palette already saved!" };
    }

    await Palette.create({
      userId: session.userId,
      colors,
    });

    return { message: "Palette saved successfully!" }; // Return a success message
  } catch (error) {
    console.error("Error saving palette:", error);
    return { error: "Failed to save palette" }; // Return an error message
  }
}

export async function removePalette(colors: string[], path?: string) {
  try {
    await dbConnect();

    const session = await getSession();

    if (!session?.userId) {
      return { error: "you need to be logged in to remove a palette" };
    }

    // Find and remove the palette
    const result = await Palette.findOneAndDelete({
      userId: session.userId,
      colors: { $all: colors },
    });

    if (!result) {
      return { error: "Palette not found" };
    }

    if (path) {
      revalidatePath(path);
    }

    return { message: "Palette removed successfully!" };
  } catch (error) {
    console.error("Error removing palette:", error);
    return { error: "Failed to remove palette" };
  }
}

export async function checkSavedPalette(
  colors: string[],
): Promise<{ isSaved: boolean }> {
  try {
    await dbConnect();

    const session = await getSession();

    if (!session?.userId) {
      return { isSaved: false }; // Fix this return to match the type
    }

    const existingPalette = await Palette.findOne({
      userId: session.userId,
      colors: { $all: colors },
    });

    return { isSaved: !!existingPalette };
  } catch (error) {
    console.error("Error checking saved palette:", error);
    return { isSaved: false };
  }
}

export async function getUserPalettes() {
  try {
    await dbConnect();

    const session = await getSession();

    if (!session?.userId) {
      return { error: "You need to be logged in to view saved palettes" };
    }

    const palettes = await Palette.find({ userId: session.userId });

    // Serialize the data before returning
    const serializedPalettes = palettes.map((palette) => ({
      colors: palette.colors,
    }));

    return { data: serializedPalettes };
  } catch (error) {
    console.error("Error fetching user palettes:", error);
    return { error: "Failed to fetch user palettes" };
  }
}
