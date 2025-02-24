import Link from "next/link";
import { getUser } from "@/actions/users.actions";

export default async function Home() {
  const user = await getUser();
  return (
    <div className="flex flex-col text-center pt-20 gap-4 w-10/12 mx-auto">
      <h1 className="font-heading font-bold text-4xl text-orange text-center">
        Palette
      </h1>
      <p className="text-lg mb-4">
        Welcome to the Palette! Generate color palettes for you next project 🎨
      </p>
      <Link
        href="/fbfdfb-343434-2f3061-ff8c42-fc7753"
        className="bg-orange text-white font-body font-medium p-2 rounded-md shadow-md"
      >
        Generate Palette
      </Link>
      <hr className="border-none h-[1px] bg-foreground my-4" />
      {user ? (
        <Link
          href="/profile"
          className="bg-orange text-white font-body font-medium p-2 rounded-md shadow-md"
        >
          See Profile
        </Link>
      ) : (
        <div className="flex flex-col gap-4">
          <Link
            href="/signin"
            className="bg-orange text-white font-body font-medium p-2 rounded-md shadow-md"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-orange text-white font-body font-medium p-2 rounded-md shadow-md"
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
