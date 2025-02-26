"use server";

import { createSession, deleteSession } from "../lib/session";
import { redirect } from "next/navigation";
import dbConnect from "../lib/database";
import User from "../models/User";
import { z } from "zod";
import bcrypt from "bcryptjs";

//___________________SCHEMAS_____________________

// Define a schema for validating sign-up form data using Zod
const SignUpSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()), // Convert email to lowercase for consistency
  name: z.string().nonempty("Name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot be more than 64 characters"),
  confirmPassword: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot be more than 64 characters"),
});

// Define a schema for validating sign-in form data using Zod
const SignInSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()), // Convert email to lowercase for consistency
  password: z.string().nonempty("Password is required"),
});

//___________________ACTIONS_____________________

// Define the signUp action - prevState comes from the useActionState hook
export async function signUp(prevState: any, formData: FormData) {
  // Validate form data against the SignUpSchema
  const data = SignUpSchema.safeParse({
    email: formData.get("email")?.toString(),
    name: formData.get("name")?.toString(),
    password: formData.get("password")?.toString(),
    confirmPassword: formData.get("confirmPassword")?.toString(),
  });

  // If validation fails, return the first error message
  if (!data.success) {
    const firstError = data.error.errors[0].message;
    return { message: firstError };
  }

  // Extract validated email and password from the parsed data
  const { email, name, password, confirmPassword } = data.data;

  try {
    // Connect to database
    await dbConnect();

    // Basic input validation: ensure email and password are provided
    if (!email || !name || !password || !confirmPassword) {
      return { message: "please fill out all required fields" };
    }

    if (password !== confirmPassword) {
      return { message: "Passwords do not match" };
    }

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { message: "User already exists" };
    }

    // Create a new user in the database
    await User.create({
      email,
      name,
      password, // Password will be hashed by the pre-save hook in the User model
    });
  } catch (error) {
    console.error("Signup error:", error);
    return {
      message: "An unsuspected error occurred. Please try again later.",
    };
  }
  // Redirect the user to the sign-in after successful sign-up.
  redirect("/signin");
}

//___________________________________________________________________

// Define the signIn action - prevState comes from the useActionState hook
export async function signIn(prevState: any, formData: FormData) {
  // Validate form data against the SignInSchema
  const data = SignInSchema.safeParse({
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

    // Find a user with the given email - specify that the password field should be included in the query
    const user = await User.findOne({ email }).select("+password");

    // If no user is found, return an error message
    if (!user) {
      return { message: "User not found" };
    }

    // Verify the provided password against the stored hash
    const isValidPassword = await bcrypt.compare(password, user.password);

    // If the password is invalid, return an error message
    if (!isValidPassword) {
      return { message: "Invalid password" };
    }

    // Create a session for the authenticated user
    await createSession(user._id.toString());
  } catch (error) {
    console.error("Signin error:", error);
    return {
      message: "An unsuspected error occurred. Please try again later.",
    };
  }

  // Redirect the user to the profile page after successful sign-in
  redirect("/");
}

//___________________________________________________________________

// Define the signOut action
export async function signOut() {
  // Delete the current session to sign the user out
  await deleteSession();
  // Redirect the user to the home page after signing out
  redirect("/");
}
