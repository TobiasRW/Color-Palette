import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "../lib/session";

export default async function ProfilePage() {
  const session = (await cookies()).get("session")?.value || "";
  const payload = await decrypt(session);

  if (!payload?.userId) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome</p>
      {/* Your profile content here */}
    </div>
  );
}
