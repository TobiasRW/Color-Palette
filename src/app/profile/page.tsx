import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "../../lib/session";
import { getUser } from "@/actions/users.actions";
import { signOut } from "@/actions/auth.actions";
import Form from "next/form";
import Link from "next/link";

export default async function ProfilePage() {
  const session = (await cookies()).get("session")?.value || "";
  const payload = await decrypt(session);

  if (!payload?.userId) {
    redirect("/signin");
  }

  const user = await getUser();

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
    </div>
  );
}
