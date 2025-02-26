"use client";
import { Separator } from "@/components/ui/separator";
import Sidebar from "./sidebar";
import {
  Heart,
  List,
  ArrowBendUpLeft,
  ArrowBendUpRight,
} from "@phosphor-icons/react";
import {
  generateColors,
  savePalette,
  checkSavedPalette,
  removePalette,
} from "@/actions/colors.actions";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useLockStore } from "@/store/store"; // Zustand store

// Define props for Generator component
type GeneratorProps = {
  colors: string[];
  lockedColors: { [index: number]: string };
};

// Define message type for success and error messages
type MessageType = {
  message?: string;
  error?: string;
};

// Define variants for message animation
const messageVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hidden: { opacity: 0, y: 10, transition: { duration: 0.5 } },
};

export default function Generator({ colors }: GeneratorProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls sidebar visibility
  const [message, setMessage] = useState<MessageType | null>(null); // State for success and error messages
  const [isSavedPalette, setIsSavedPalette] = useState<boolean>(false); // State to check if palette is saved
  const { lockedColors } = useLockStore(); // Zustand persisted state

  // Get router
  const router = useRouter();

  // Check if palette is saved on component mount or when colors change
  useEffect(() => {
    const checkSaved = async () => {
      const result = await checkSavedPalette(colors);
      setIsSavedPalette(result.isSaved); // Set isSavedPalette state based on the result (true/false) from the server action
    };

    checkSaved();
  }, [colors]);

  // Function to handle toggling palette save status
  const handleToggleSavePalette = async () => {
    // Save or remove palette based on current save status
    const result = isSavedPalette
      ? await removePalette(colors) // Remove palette if already saved
      : await savePalette(colors); // Save palette if not saved

    // Set message based on the action result
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

  // Function to generate new colors
  const handleGenerate = () => {
    generateColors(lockedColors);
  };

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} />
      <section className="fixed bottom-0 z-30 h-[6svh] w-full border-t border-foreground bg-background py-2">
        <div className="mx-auto flex w-11/12 items-center justify-between">
          <h1 className="text-2xl font-bold text-orange">
            <Link href="/" className="font-heading">
              Palette
            </Link>
          </h1>
          <div className="flex h-5 items-center space-x-4">
            <div className="flex gap-2">
              <button
                className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowBendUpLeft className="h-4 w-4 text-foreground" />
              </button>
              <button
                className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => router.forward()}
                aria-label="Go forward"
              >
                <ArrowBendUpRight className="h-4 w-4 text-foreground" />
              </button>
            </div>
            <Separator orientation="vertical" />
            <button
              onClick={handleGenerate}
              className="rounded-md bg-orange p-2 font-body text-xs text-white shadow-md"
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
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <List className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </section>
      <AnimatePresence>
        {message && (
          <motion.div
            key="message"
            className="fixed bottom-16 z-50 flex w-full justify-center"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <p
              className={`rounded-md px-4 py-4 text-white shadow-lg ${
                message.error ? "bg-red-500" : "bg-green-500"
              }`}
            >
              {message.error || message.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
