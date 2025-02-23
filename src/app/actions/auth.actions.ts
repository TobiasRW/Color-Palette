"use server";

import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import dbConnect from "../lib/database";
import User from "../models/User";
import { z } from "zod";

// Define a schema for validating sign-up form data using Zod
const SignUpSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()), // Convert email to lowercase for consistency
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot be more than 64 characters"),
});

// Define the signUp action - prevState comes from the useActionState hook
export async function signUp(prevState: any, formData: FormData) {
  // Validate form data against the SignUpSchema
  const data = SignUpSchema.safeParse({
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  });

  // If validation fails, return the first error message
  if (!data.success) {
    const firstError = data.error.errors[0].message;
    return { message: firstError };
  }

  // Extract validated email and password from the parsed data
  const { email, password } = data.data;

  try {
    // Connect to database
    await dbConnect();

    // Basic input validation: ensure email and password are provided
    if (!email || !password) {
      return { message: "please fill out all required fields" };
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: "User already exists" };
    }

    // Create a new user in the database
    const user = await User.create({
      email,
      password, // Password will be hashed by the pre-save hook in the User model
    });

    // Create a session for the newly registered user
    await createSession(user._id.toString());
  } catch (error) {
    // Log any errors that occur during the sign-up process
    console.error("Signup error:", error);
    return {
      message: "An unsuspected error occurred. Please try again later.",
    };
  }
  // Redirect the user to the home page after successful sign-up.
  redirect("/");
}
