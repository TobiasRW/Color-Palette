"use client";
import Link from "next/link";

// Define props for SidebarContent component
type SidebarContentProps = {
  userPalettes: {
    data?: { colors: string[] }[];
    error?: string;
  };
};

export default function SidebarContent({ userPalettes }: SidebarContentProps) {
  // If user is not signed in, show message to sign in (server action returns { error } if user is not signed in)
  if (userPalettes.error) {
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
      <div className="mb-6 border-b border-foreground pb-6 text-center">
        <p className="mb-4 text-gray-600">
          Go to profile to manage saved palettes
        </p>
        <Link
          href="/profile"
          className="rounded-md border border-foreground bg-background px-4 py-2 text-sm text-foreground shadow-md"
        >
          Profile
        </Link>
      </div>
      {userPalettes.data && userPalettes.data.length > 0 ? (
        userPalettes.data.map((palette, index) => (
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
