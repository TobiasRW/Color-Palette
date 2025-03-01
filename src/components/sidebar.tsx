"use client";
import { motion } from "motion/react";
import SidebarContent from "./sidebar-content";
import { useEffect, useState } from "react";
import { getUserPalettes } from "@/actions/colors.actions";

// Define props for Sidebar component
type SidebarProps = {
  isOpen: boolean;
  userPalettes: {
    data?: { colors: string[] }[];
    error?: string;
  };
};

// Define variants for sidebar animation
const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: "spring", bounce: 0, duration: 0.4 },
  },
  closed: {
    x: "100%",
    transition: { type: "spring", bounce: 0, duration: 0.4 },
  },
};

export default function Sidebar({ isOpen, userPalettes }: SidebarProps) {
  // State to store user palettes
  const [palettes, setPalettes] = useState(userPalettes);

  // Fetch user palettes when opening the sidebar
  useEffect(() => {
    if (isOpen) {
      const fetchPalettes = async () => {
        const updatedPalettes = await getUserPalettes(); // Fetch user palettes to update the sidebar
        setPalettes(updatedPalettes); // Update the state with the new fetched palettes
      };

      fetchPalettes();
    }
  }, [isOpen]);

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="fixed right-0 top-0 z-20 h-screen w-80 border-l border-foreground bg-background shadow-lg lg:w-96"
    >
      <h2 className="border-b border-foreground py-4 text-center font-body text-xl font-semibold">
        Saved Palettes
      </h2>
      <SidebarContent userPalettes={palettes} />
    </motion.div>
  );
}
