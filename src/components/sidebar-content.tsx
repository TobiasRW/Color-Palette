"use client";
import { getUserPalettes } from "@/actions/colors.actions";
import { getUser } from "@/actions/users.actions";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SidebarContent() {
  const [palettes, setPalettes] = useState<{ colors: string[] }[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthAndFetchPalettes = async () => {
      const user = await getUser();

      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
      const result = await getUserPalettes();
      if (result?.error) {
        console.error("Error fetching palettes:", result.error);
        return;
      }

      setPalettes(result?.data || []);
    };

    checkAuthAndFetchPalettes();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-gray-600">
          Please sign in to view and save your palettes
        </p>
        <Link
          href="/signin"
          className="rounded-md border border-foreground bg-background px-4 py-2 text-sm text-foreground shadow-md"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="hide-scrollbar mx-auto my-6 h-[80svh] w-10/12 overflow-y-scroll pt-6">
      {palettes.length > 0 ? (
        palettes.map((palette, index) => (
          <div
            key={index}
            className="mb-4 flex h-12 flex-1 overflow-hidden rounded-md shadow-md"
          >
            <Link href={`/${palette.colors.join("-")}`} className="flex w-full">
              {palette.colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="h-full w-full"
                  style={{ backgroundColor: `#${color}` }}
                />
              ))}
            </Link>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No saved palettes yet</p>
      )}
    </div>
  );
}
