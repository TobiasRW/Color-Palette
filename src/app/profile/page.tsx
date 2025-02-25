import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "../../lib/session";
import { getUser } from "@/actions/users.actions";
import { signOut } from "@/actions/auth.actions";
import { getUserPalettes } from "@/actions/colors.actions";
import Form from "next/form";
import Link from "next/link";
import ColorGrid from "@/components/color-grid";

export default async function ProfilePage() {
  const session = (await cookies()).get("session")?.value || "";
  const payload = await decrypt(session);

  if (!payload?.userId) {
    redirect("/signin");
  }

  const user = await getUser();
  const palettes = await getUserPalettes();

  return (
    <div className="pt-20">
      <h1 className="font-heading font-bold text-4xl text-orange text-center">
        Palette
      </h1>
      <div className="text-center text-xl pb-20">
        <p className="">{user?.email}</p>
      </div>
      <Link
        href="/"
        className="bg-orange text-white font-body font-medium p-2 rounded-md shadow-md w-10/12 mx-auto flex items-center justify-center"
      >
        Go to home page
      </Link>
      <Form
        action={signOut}
        className="w-10/12 mx-auto flex flex-col gap-4 pt-10"
      >
        <button
          type="submit"
          className="bg-orange text-white font-body font-medium p-2 rounded-md shadow-md"
        >
          Sign out
        </button>
      </Form>

      <div className="pt-20 text-center flex flex-col gap-4">
        <p className="text-lg font-medium">Your Saved Palettes!</p>
        {palettes.data ? (
          <ColorGrid palettes={palettes.data} />
        ) : (
          <p className="text-center text-gray-500">
            {palettes.error || "No saved palettes yet"}
          </p>
        )}
      </div>
    </div>
  );
}
