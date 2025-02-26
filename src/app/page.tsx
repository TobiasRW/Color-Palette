import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/actions/users.actions";

export default async function Home() {
  const user = await getUser();
  return (
    <div className="mx-auto flex w-10/12 flex-col gap-4 pt-6 text-center">
      <Image
        src="/phone-mockup.webp"
        alt="Palette"
        width={300}
        height={300}
        className="mx-auto w-3/4"
      />
      <p className="mb-4 text-3xl font-bold">
        Create stunning color palettes with{" "}
        <span className="font-heading text-orange">Palette</span>
      </p>
      <Link
        href="/fbfdfb-343434-2f3061-ff8c42-fc7753"
        className="rounded-md bg-orange p-2 px-2 py-3 font-body font-medium text-white shadow-md"
      >
        Explore Generator
      </Link>
      {user ? (
        <Link
          href="/profile"
          className="rounded-md border border-foreground bg-background px-2 py-3 font-body font-medium text-foreground shadow-md"
        >
          See Profile
        </Link>
      ) : (
        <div className="flex flex-col gap-4">
          <Link
            href="/signin"
            className="rounded-md border border-foreground bg-background px-2 py-3 font-body font-medium text-foreground shadow-md"
          >
            Sign in
          </Link>
          <p>
            Dont have an account? Create one{" "}
            <Link href="/signup" className="underline">
              here
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
