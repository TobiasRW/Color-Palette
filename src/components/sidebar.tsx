"use client";
import { motion } from "motion/react";
import SidebarContent from "./sidebar-content";

type SidebarProps = {
  isOpen: boolean;
};

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

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className="fixed right-0 top-0 z-20 h-screen w-80 border-l border-foreground bg-background shadow-lg"
    >
      <h2 className="border-b border-foreground py-4 text-center font-body text-xl font-semibold">
        Saved Palettes
      </h2>
      <SidebarContent />
    </motion.div>
  );
}
