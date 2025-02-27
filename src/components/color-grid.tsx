"use client";
import { removePalette } from "@/actions/colors.actions";
import { X } from "@phosphor-icons/react";
import Link from "next/link";

// Define props for ColorGrid component
type ColorGridProps = {
  palettes: { colors: string[] }[];
};

export default function ColorGrid({ palettes }: ColorGridProps) {
  return (
    <div className="mx-auto grid w-10/12 grid-cols-1 gap-4 lg:w-full lg:gap-x-8">
      {palettes.map((palette, index) => (
        <div key={index} className="flex items-center gap-2">
          <Link
            href={`/${palette.colors.join("-")}`}
            className="flex h-12 flex-1 overflow-hidden rounded-md shadow-md"
          >
            {palette.colors.map((color, colorIndex) => (
              <div
                key={colorIndex}
                className="h-full w-full"
                style={{ backgroundColor: `#${color}` }}
              />
            ))}
          </Link>
          <button
            onClick={() => removePalette(palette.colors, "/profile")}
            className="flex-shrink-0"
          >
            <X className="rounded-full bg-red-600 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}
