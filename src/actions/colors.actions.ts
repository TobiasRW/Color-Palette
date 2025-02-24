"use server";

import Palette from "../models/Palette";
import dbConnect from "../lib/database";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

// Generates a palette and redirects to the new URL
export async function generateColors() {
  const getRandomColor = () =>
    `${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;

  const colors = Array.from({ length: 5 }, getRandomColor);
  const colorString = colors.join("-");
  return redirect(`/${colorString}`);
}

export async function savePalette(colors: string[]) {}
