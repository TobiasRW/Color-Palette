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
    <div className="mx-auto flex w-10/12 flex-col gap-4 pt-10">
      <h1 className="text-center font-heading text-4xl font-bold text-orange">
        Palette
      </h1>
      {user && <UpdateProfile user={user} />}

      <Link
        href="/fbfdfb-343434-2f3061-ff8c42-fc7753"
        className="mx-auto mt-10 w-8/12 rounded-md bg-orange p-2 px-2 py-3 text-center font-body font-medium text-white shadow-md"
      >
        generate Palettes
      </Link>

      <div className="flex flex-col gap-4 pt-6 text-center">
        <p className="text-lg font-medium">Your Saved Palettes!</p>
        <div className="hide-scrollbar h-64 overflow-y-scroll rounded-md border border-foreground py-6">
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
  );
}
