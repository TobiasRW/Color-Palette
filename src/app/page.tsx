"use client";
import React, { useEffect, useState } from "react";
import { generateColors } from "@/actions/colors.actions";
import Header from "@/components/header";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const [colors, setColors] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const colorsFromParams = searchParams.get("colors");
    if (colorsFromParams) {
      setColors(colorsFromParams.split(","));
    } else {
      handleGenerateColors();
    }
  }, []);

  const handleGenerateColors = async () => {
    const generatedColors = await generateColors();
    setColors(generatedColors);
    router.replace(`/?colors=${generatedColors.join("-")}`);
  };

  return (
    <>
      <Header onGenerate={handleGenerateColors} />
      <div className=" grid grid-cols-1 lg:grid-cols-5 h-[94svh]">
        {colors.map((color, index) => (
          <div
            key={index}
            className=" flex items-center justify-center text-white font-semibold h-full"
            style={{ backgroundColor: `#${color}` }}
          >
            {color.toUpperCase()}
          </div>
        ))}
      </div>
    </>
  );
}
