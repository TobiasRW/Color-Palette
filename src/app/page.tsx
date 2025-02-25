import Link from "next/link";
import { getUser } from "@/actions/users.actions";

export default async function Home() {
  const user = await getUser();
  return (
    <div className="mx-auto flex w-10/12 flex-col gap-4 pt-20 text-center">
      <h1 className="text-center font-heading text-4xl font-bold text-orange">
        Palette
      </h1>
      <p className="mb-4 text-lg">
        Welcome to the Palette! Generate color palettes for you next project 🎨
      </p>
      <Link
        href="/fbfdfb-343434-2f3061-ff8c42-fc7753"
        className="rounded-md bg-orange p-2 font-body font-medium text-white shadow-md"
      >
        Generate Palette
      </Link>
      <hr className="my-4 h-[1px] border-none bg-foreground" />
      {user ? (
        <Link
          href="/profile"
          className="rounded-md bg-orange p-2 font-body font-medium text-white shadow-md"
        >
          See Profile
        </Link>
      ) : (
        <div className="flex flex-col gap-4">
          <Link
            href="/signin"
            className="rounded-md bg-orange p-2 font-body font-medium text-white shadow-md"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-orange p-2 font-body font-medium text-white shadow-md"
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
