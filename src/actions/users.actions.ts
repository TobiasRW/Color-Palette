"use server";

import { deleteSession, getSession } from "../lib/session";
import { redirect } from "next/navigation";
import dbConnect from "../lib/database";
import User from "../models/User";

export async function getUser() {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }

  await dbConnect();
  const user = await User.findById(session.userId).select("email");
  return user ? { email: user.email } : null;
}
