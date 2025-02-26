"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  // Check if the path contains hex colors (for the generate colors page)
  const isColorPath = /^\/[0-9a-f-]+$/i.test(pathname || "");

  // If we're on a color path, don't render the header
  if (isColorPath) return null;

  return (
    <header className="border-b border-foreground bg-background p-3">
      <h1 className="text-3xl font-bold text-orange">
        <Link href="/" className="font-heading">
          Palette
        </Link>
      </h1>
    </header>
  );
}
