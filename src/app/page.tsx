"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to the Palette Generator 🎨
      </h1>
      <p className="text-lg mb-8">
        Click below to explore a color palette or generate your own.
      </p>
      <Link
        href="/fbfdfb-343434-2f3061-ff8c42-fc7753"
        className="bg-orange text-white px-6 py-3 rounded-md shadow-md text-lg"
      >
        View Palette
      </Link>
    </main>
  );
}
