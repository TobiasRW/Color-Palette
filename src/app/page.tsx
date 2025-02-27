import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/actions/users.actions";

export default async function Home() {
  // Get user
  const user = await getUser();
  return (
    <div className="mx-auto flex w-10/12 flex-col gap-4 pt-6 text-center md:gap-8 lg:grid lg:w-11/12 lg:grid-cols-[1fr,1.5fr] lg:gap-8 lg:pt-32 xl:grid-cols-[1fr,1.3fr] xl:pt-40">
      <Image
        src="/phone-mockup.webp"
        alt="Palette Device Mockup"
        width={500}
        height={500}
        className="mx-auto w-3/4 drop-shadow-lg md:w-2/4 lg:hidden"
      />
      <Image
        src="/pc-mockup.webp"
        alt="Palette Device Mockup"
        width={1000}
        height={1000}
        className="mx-auto hidden drop-shadow-lg lg:order-last lg:block lg:w-3/4 xl:place-self-end"
      />
      <div className="flex w-full flex-col gap-4 xl:ml-8 xl:pt-10">
        <p className="mb-4 text-3xl font-bold md:mx-auto md:w-10/12 lg:mx-0 lg:w-full lg:text-start xl:pb-4 xl:text-5xl">
          Create stunning color palettes with{" "}
          <span className="font-heading text-orange">Palette</span>
        </p>
        <Link
          href="/fbfdfb-343434-2f3061-ff8c42-fc7753"
          className="mx-auto w-8/12 rounded-md bg-orange p-2 px-2 py-3 font-body font-medium text-white shadow-md md:w-2/4 lg:mx-0"
        >
          Explore Generator
        </Link>
        {user ? (
          <Link
            href="/profile"
            className="mx-auto w-8/12 rounded-md border border-foreground bg-background px-2 py-3 font-body font-medium text-foreground shadow-md md:w-2/4 lg:mx-0"
          >
            See Profile
          </Link>
        ) : (
          <div className="flex flex-col gap-4">
            <Link
              href="/signin"
              className="mx-auto w-8/12 rounded-md border border-foreground bg-background px-2 py-3 font-body font-medium text-foreground shadow-md md:w-2/4 lg:mx-0"
            >
              Sign in
            </Link>
            <p className="md:w-2/4 lg:mx-0">
              Dont have an account? Create one{" "}
              <Link href="/signup" className="underline">
                here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
