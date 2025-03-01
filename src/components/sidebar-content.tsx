"use client";
import { getUserPalettes } from "@/actions/colors.actions";
import { getUser } from "@/actions/users.actions";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SidebarContent() {
  const [palettes, setPalettes] = useState<{ colors: string[] }[]>([]); // State to store user palettes (array of objects containing color strings)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // State to check if user is authenticated

  // Fetch user palettes and check if user is authenticated on component mount
  useEffect(() => {
    const checkAuthAndFetchPalettes = async () => {
      const user = await getUser(); // Get user

      // If user is not signed in, set isAuthenticated to false and return
      if (!user) {
        setIsAuthenticated(false);
        return;
      }

      // If user is signed in, set isAuthenticated to true and fetch user palettes
      setIsAuthenticated(true);
      const result = await getUserPalettes(); // Get user palettes
      // If there is an error fetching palettes, return
      if (result?.error) {
        console.error("Error fetching palettes:", result.error);
        return;
      }

      // Set palettes state with the result data
      setPalettes(result?.data || []);
    };

    checkAuthAndFetchPalettes();
  }, []);

  // If user is null (loading), show loading message
  if (isAuthenticated === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // If user is not authenticated, show sign in message
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

  // If user is authenticated, show user palettes. If no palettes, show no palettes message
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4 p-6 pt-6 text-center">
        <p className="text-gray-600">
          You can manage your palettes in your profile
        </p>
        <Link
          href="/profile"
          className="rounded-md border border-foreground bg-background px-4 py-2 text-sm text-foreground shadow-md"
        >
          Profile
        </Link>
        <hr className="w-full" />
      </div>
      <div className="hide-scrollbar mx-auto my-6 h-[80svh] w-10/12 overflow-y-scroll">
        {palettes.length > 0 ? (
          palettes.map((palette, index) => (
            <div
              key={index}
              className="mb-4 flex h-12 flex-1 overflow-hidden rounded-md shadow-md"
            >
              <Link
                href={`/${palette.colors.join("-")}`}
                className="flex w-full"
              >
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
    </>
  );
}
