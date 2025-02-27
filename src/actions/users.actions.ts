"use server";

import { getSession } from "../lib/session";
import { revalidatePath } from "next/cache";
import dbConnect from "../lib/database";
import User from "../models/User";
import { z } from "zod";

//___________________SCHEMAS_____________________

const updateUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase())
    .optional(),
  name: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot be more than 64 characters")
    .optional(),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password cannot be more than 64 characters")
    .optional(),
});

//___________________TYPES_____________________

type UpdateUserState = {
  message?: string;
  error?: string;
};

//___________________ACTIONS_____________________

// function to get the user profile
export async function getUser() {
  const session = await getSession();
  if (!session?.userId) {
    return null;
  }

  await dbConnect();
  const user = await User.findById(session.userId).select("email name");
  return user ? { email: user.email, name: user.name } : null;
}

// function to update the user profile
export async function updateUser(
  prevState: UpdateUserState, // no more any!
  formData: FormData,
): Promise<UpdateUserState> {
  const session = await getSession();
  if (!session?.userId) return { error: "You must be signed in" };

  // Get form values from FormData. Set to undefined if empty
  const formValues = {
    email: formData.get("email")?.toString() || undefined,
    name: formData.get("name")?.toString() || undefined,
    password: formData.get("password")?.toString() || undefined,
    confirmPassword: formData.get("confirmPassword")?.toString() || undefined,
  };

  // Remove undefined values
  // Object.entries(): Turns an object into an array of [key, value] pairs.
  // filter(): Filters out any entries where the value is undefined. The comma before value is used to ignore the key.
  // Object.fromEntries(): Turns the array of [key, value] pairs back into an object.
  const cleanedValues = Object.fromEntries(
    Object.entries(formValues).filter(([, value]) => value !== undefined),
  );

  // Validate form values using zod schema
  const result = updateUserSchema.safeParse(cleanedValues);

  // If validation fails, return the first error message
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    // Connect to the database
    await dbConnect();

    // Extract password and confirmPassword from the form data. The rest of the data is stored in the rest variable.
    const { password, confirmPassword, ...rest } = result.data;

    // Create an object with the updated data with optional fields
    const updateData: { email?: string; name?: string; password?: string } = {
      ...rest,
    };

    // Check if email exists (only if email is being updated)
    if (updateData.email) {
      const existingUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: session.userId }, // Exclude current user using the $ne (not equal) operator from MongoDB
      });

      if (existingUser) {
        return { error: "Email already exists" };
      }
    }

    // If the user is updating the password, check if the confirmPassword field is empty and if the passwords match
    if (password) {
      if (!confirmPassword) {
        return { error: "Please confirm your password" };
      }
      if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
      }
      updateData.password = password;
    }

    // If there are no changes to update, return an error
    if (Object.keys(updateData).length === 0) {
      return { error: "No changes to update" };
    }

    // Update the user profile using mongoose's findByIdAndUpdate method
    await User.findByIdAndUpdate(session.userId, updateData);

    // Revalidate the profile page to update the user's information on screen
    revalidatePath("/profile");

    // Return a success message
    return { message: "Profile updated successfully" };
  } catch (error) {
    console.error("Update error:", error);
    return { error: "An unexpected error occurred" };
  }
}
