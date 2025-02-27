import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "../../lib/session";
import { getUser } from "@/actions/users.actions";
import { getUserPalettes } from "@/actions/colors.actions";
import ColorGrid from "@/components/color-grid";
import UpdateProfile from "@/components/update-profile";
import Link from "next/link";

export default async function ProfilePage() {
  // Get session cookie
  const session = (await cookies()).get("session")?.value || "";

  // Decrypt session cookie
  const payload = await decrypt(session);

  // Redirect to sign in page if user is not signed in
  if (!payload?.userId) {
    redirect("/signin");
  }

  // Get user and palettes
  const user = await getUser();
  const palettes = await getUserPalettes();

  return (
    <>
      <h1 className="pt-10 text-center font-heading text-4xl font-bold text-orange xl:py-20 xl:text-5xl">
        Palette
      </h1>
      <div className="mx-auto flex w-10/12 flex-col gap-4 lg:grid lg:grid-cols-2">
        <div className="flex flex-col gap-4 lg:pt-10">
          {user && <UpdateProfile user={user} />}

          <Link
            href="/fbfdfb-343434-2f3061-ff8c42-fc7753"
            className="mx-auto mt-10 w-8/12 rounded-md bg-orange p-2 px-2 py-3 text-center font-body font-medium text-white shadow-md"
          >
            generate Palettes
          </Link>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-center md:mx-auto md:w-8/12">
          <p className="text-lg font-semibold">Saved Palettes!</p>
          <div className="py-6">
            {palettes.data ? (
              <ColorGrid palettes={palettes.data} />
            ) : (
              <p className="text-center text-gray-500">
                {palettes.error || "No saved palettes yet"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
