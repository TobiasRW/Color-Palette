"use client";
import Generator from "@/components/generator";
import { useParams } from "next/navigation";
import { LockSimple, LockSimpleOpen, Copy } from "@phosphor-icons/react";
import { useLockStore } from "@/store/store"; // Import Zustand store
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Function to determine text color based on background color
const determineTextColor = (color: string) => {
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness >= 128 ? "#343434" : "#f9f9f9";
};

// Define variants for message animation
const messageVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hidden: { opacity: 0, y: 10, transition: { duration: 0.5 } },
};

export default function ColorsPage() {
  const [message, setMessage] = useState("");
  const paramColors = useParams();

  // Get colors from URL and split them
  const colors =
    (paramColors?.colors as string[] | undefined)?.[0]?.split("-") ?? [];

  // Get lockedColors and toggleLock function from zustand store
  const { lockedColors, toggleLock } = useLockStore();

  // Function to copy color to clipboard
  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(`#${color}`);
    setMessage("copied to clipboard!");
    setTimeout(() => setMessage(""), 2000);
  };

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
            <div className="flex flex-col gap-2 justify-self-end">
              <button onClick={() => toggleLock(index, color)} className="">
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
                    className="h-5 w-5"
                    style={{
                      color: determineTextColor(color),
                    }}
                  />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(color)}
                className="justify-self-end"
              >
                <Copy
                  weight="fill"
                  className="h-5 w-5"
                  style={{
                    color: determineTextColor(color),
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      ))}
      <AnimatePresence>
        {message && (
          <motion.div
            className="fixed bottom-16 left-0 right-0 z-50 mx-auto w-8/12 rounded-md bg-green-500 px-4 py-4 text-center text-white shadow-lg"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              margin: "0 auto",
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
