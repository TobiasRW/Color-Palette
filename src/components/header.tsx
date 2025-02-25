"use client";
import { Separator } from "@/components/ui/separator";
import { Heart, List } from "@phosphor-icons/react/dist/ssr";
import {
  generateColors,
  savePalette,
  checkSavedPalette,
  removePalette,
} from "@/actions/colors.actions";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type HeaderProps = {
  colors: string[];
};

type MessageType = {
  message?: string;
  error?: string;
};

const messageVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hidden: { opacity: 0, y: 10, transition: { duration: 0.5 } },
};

export default function Header({ colors }: HeaderProps) {
  const [message, setMessage] = useState<MessageType | null>(null);
  const [isSavedPalette, setIsSavedPalette] = useState<boolean>(false);

  // Check if palette is saved on component mount or when colors change
  useEffect(() => {
    const checkSaved = async () => {
      const result = await checkSavedPalette(colors);
      setIsSavedPalette(result.isSaved);
    };

    checkSaved();
  }, [colors]);

  // Function to handle toggling palette save status
  const handleToggleSavePalette = async () => {
    const result = isSavedPalette
      ? await removePalette(colors)
      : await savePalette(colors);

    setMessage(result);

    // Update heart state based on the action result
    if (result.message === "Palette saved successfully!") {
      setIsSavedPalette(true);
    } else if (result.message === "Palette removed successfully!") {
      setIsSavedPalette(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <header className="bg-background py-2 h-[6svh] border-t border-foreground fixed bottom-0 w-full">
      <div className="w-11/12 mx-auto flex items-center justify-between">
        <h1 className="font-heading font-bold text-2xl text-orange">
          <Link href="/">Palette</Link>
        </h1>
        <div className="flex h-5 items-center space-x-4">
          <button
            onClick={generateColors}
            className="bg-orange text-white font-body text-xs p-2 rounded-md shadow-md"
          >
            Generate
          </button>
          <Separator orientation="vertical" />
          <Heart
            weight={isSavedPalette ? "fill" : "regular"}
            className={`h-5 w-5 cursor-pointer ${
              isSavedPalette ? "text-red-500" : "text-foreground"
            }`}
            onClick={handleToggleSavePalette}
          />
          <Separator orientation="vertical" />
          <div>
            <List className="h-5 w-5 text-foreground" />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {message && (
          <motion.div
            key="message"
            className="fixed bottom-16 w-full flex justify-center z-50"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <p
              className={`shadow-lg text-white px-4 py-4 rounded-md ${
                message.error ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {message.error || message.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
