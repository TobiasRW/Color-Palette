"use client";
import Generator from "@/components/generator";
import { useParams } from "next/navigation";
import { LockSimple, LockSimpleOpen } from "@phosphor-icons/react";
import { useLockStore } from "@/store/store"; // Import Zustand store

// Function to determine text color based on background color
const determineTextColor = (color: string) => {
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness >= 128 ? "#343434" : "#f9f9f9";
};

export default function ColorsPage() {
  const paramColors = useParams();

  // Get colors from URL and split them
  const colors =
    (paramColors?.colors as string[] | undefined)?.[0]?.split("-") ?? [];

  // Get lockedColors and toggleLock function from zustand store
  const { lockedColors, toggleLock } = useLockStore();

  return (
    <div className="grid h-[94svh] grid-cols-1 lg:grid-cols-5">
      <Generator colors={colors} lockedColors={lockedColors} />
      {colors.map((color, index) => (
        <div
          key={color}
          className="z-10 h-full font-semibold text-white"
          style={{
            backgroundColor: `#${color}`,
            color: determineTextColor(color),
          }}
        >
          <div className="mx-auto grid h-full w-10/12 grid-cols-3 items-center justify-center">
            <div className=""></div>
            <p className="justify-self-center">{color.toUpperCase()}</p>
            <button
              onClick={() => toggleLock(index, color)}
              className="justify-self-end"
            >
              {lockedColors[index] ? (
                <LockSimple
                  weight="fill"
                  className="h-5 w-5"
                  style={{
                    color: determineTextColor(color),
                  }}
                />
              ) : (
                <LockSimpleOpen
                  weight="fill"
                  className="h-5 w-5 opacity-50"
                  style={{
                    color: determineTextColor(color),
                  }}
                />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
