"use server";

import Palette from "../models/Palette";
import dbConnect from "../lib/database";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function generateColors() {
  const getRandomColor = () =>
    `${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;

  return Array.from({ length: 5 }, getRandomColor);
}

export async function savePalette(colors: string[]) {}
