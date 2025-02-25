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
      <h1 className="text-center font-heading text-4xl font-bold text-orange">
        Palette
      </h1>
      <div className="pb-20 text-center text-xl">
        <p className="">{user?.email}</p>
      </div>
      <Link
        href="/"
        className="mx-auto flex w-10/12 items-center justify-center rounded-md bg-orange p-2 font-body font-medium text-white shadow-md"
      >
        Go to home page
      </Link>
      <Form
        action={signOut}
        className="mx-auto flex w-10/12 flex-col gap-4 pt-10"
      >
        <button
          type="submit"
          className="rounded-md bg-orange p-2 font-body font-medium text-white shadow-md"
        >
          Sign out
        </button>
      </Form>

      <div className="flex flex-col gap-4 pt-20 text-center">
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
