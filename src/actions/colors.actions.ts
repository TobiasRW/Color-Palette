"use server";

import Palette from "../models/Palette";
import dbConnect from "../lib/database";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Generates a palette and redirects to the new URL (been moved to the client side)
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

// function to save a palette to the database for the current user
export async function savePalette(colors: string[]) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the current session
    const session = await getSession();

    // If a user is not logged in, return an error message
    if (!session?.userId) {
      return { error: "you need to be logged in to save a palette" };
    }

    // Check if the palette already exists for the user, regardless of order
    const existingPalette = await Palette.findOne({
      userId: session.userId,
      colors: { $all: colors }, // Check if the colors array contains all the same colors
    });

    // If the palette already exists, return an error message
    if (existingPalette) {
      return { error: "Palette already saved!" };
    }

    // Create a new palette document in the database
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

// function to remove a palette from the database for the current user
export async function removePalette(colors: string[], path?: string) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the current session
    const session = await getSession();

    // If a user is not logged in, return an error message
    if (!session?.userId) {
      return { error: "you need to be logged in to remove a palette" };
    }

    // Find and remove the palette
    const result = await Palette.findOneAndDelete({
      userId: session.userId,
      colors: { $all: colors },
    });

    // If the palette was not found, return an error message
    if (!result) {
      return { error: "Palette not found" };
    }

    // Revalidate the cache for the current path
    if (path) {
      revalidatePath(path);
    }

    // Return a success message
    return { message: "Palette removed successfully!" };
  } catch (error) {
    console.error("Error removing palette:", error);
    return { error: "Failed to remove palette" };
  }
}

// function to check if a palette is saved for the current user (for the heart icon)
export async function checkSavedPalette(
  colors: string[],
): Promise<{ isSaved: boolean }> {
  try {
    // Connect to the database
    await dbConnect();

    // Get the current session
    const session = await getSession();

    // If a user is not logged in, return false
    if (!session?.userId) {
      return { isSaved: false };
    }

    // Check if a palette exists for the current user with the same colors
    const existingPalette = await Palette.findOne({
      userId: session.userId,
      colors: { $all: colors },
    });

    // Return true if a palette exists, false otherwise
    return { isSaved: !!existingPalette };
  } catch (error) {
    console.error("Error checking saved palette:", error);
    return { isSaved: false };
  }
}

// function to get all palettes saved by the current user
export async function getUserPalettes() {
  try {
    // Connect to the database
    await dbConnect();

    // Get the current session
    const session = await getSession();

    // If a user is not logged in, return an error message
    if (!session?.userId) {
      return { error: "You need to be logged in to view saved palettes" };
    }

    // Find all palettes for the current
    const palettes = await Palette.find({ userId: session.userId });

    // Serialize the data before returning
    const serializedPalettes = palettes.map((palette) => ({
      colors: palette.colors,
    }));

    // Return the serialized palettes
    return { data: serializedPalettes };
  } catch (error) {
    console.error("Error fetching user palettes:", error);
    return { error: "Failed to fetch user palettes" };
  }
}
