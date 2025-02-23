"use server";

import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import dbConnect from "../lib/database";
import User from "../models/User";
import { z } from "zod";

const SignUpSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot be more than 64 characters"),
});

export async function signUp(prevState: any, formData: FormData) {
  // Validate form data

  const data = SignUpSchema.safeParse({
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  });

  if (!data.success) {
    const firstError = data.error.errors[0].message;
    return { message: firstError };
  }
  const { email, password } = data.data;

  try {
    // Connect to database
    await dbConnect();

    if (!email || !password) {
      return { message: "please fill out all required fields" };
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: "User already exists" };
    }

    // Create new user
    const user = await User.create({
      email,
      password, // Password will be hashed by the pre-save hook
    });

    // Create session
    await createSession(user._id.toString());
  } catch (error) {
    console.error("Signup error:", error);
    return { message: "An error occurred" };
  }
  // Redirect to dashboard
  redirect("/");
}
