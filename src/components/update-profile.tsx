"use client";
import Form from "next/form";
import { useActionState, useState, useEffect } from "react";
import { updateUser } from "@/actions/users.actions";
import { signOut } from "@/actions/auth.actions";
import { Pencil, X, Check, CircleNotch, SignOut } from "@phosphor-icons/react";

// Define props for UpdateProfile component
type UpdateProfileProps = {
  user: {
    email: string;
    name: string;
  };
};

// Define the state type for handling success/error messages
type UpdateUserState = {
  message?: string;
  error?: string;
};

// Initial state when the component loads (no message or error yet)
const initialState: UpdateUserState = { message: "" };

export default function UpdateProfile({ user }: UpdateProfileProps) {
  // Use the useActionState hook to manage the state and execute the signUp action.
  // The hook returns the current state (message string), the updateProfile action function and a boolean indicating if the action is pending.
  const [state, updateProfileAction, pending] = useActionState<
    UpdateUserState,
    FormData
  >(updateUser, initialState);

  // State to manage update mode
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset udpate mode after successful update
  useEffect(() => {
    if (state?.message) {
      setIsUpdating(false);
    }
  }, [state?.message]);

  return (
    <div className="flex flex-col gap-4 md:mx-auto md:w-8/12">
      {/* Form */}
      <Form action={updateProfileAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            name="email"
            className="rounded-md border border-foreground bg-white p-2 shadow-md focus:outline-none"
            placeholder={user.email}
            defaultValue={isUpdating ? "" : user.email}
            disabled={!isUpdating}
          />
        </label>
        <label className="flex flex-col gap-1">
          Name
          <input
            type="text"
            name="name"
            className="rounded-md border border-foreground bg-white p-2 shadow-md focus:outline-none"
            placeholder={user.name}
            defaultValue={isUpdating ? "" : user.name}
            disabled={!isUpdating}
          />
        </label>
        {/* Show password fields only when in update mode */}
        {isUpdating && (
          <label className="flex flex-col gap-1">
            Password
            <input
              type="password"
              name="password"
              className="rounded-md border border-foreground bg-white p-2 shadow-md focus:outline-none"
              placeholder="Password..."
              disabled={!isUpdating}
            />
          </label>
        )}
        {isUpdating && (
          <label className="flex flex-col gap-1">
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              className="rounded-md border border-foreground bg-white p-2 shadow-md focus:outline-none"
              placeholder="Confirm Password..."
              disabled={!isUpdating}
            />
          </label>
        )}
        {/* Buttons */}
        <div className="flex w-full items-center justify-between gap-4 place-self-end">
          {/* Button to sign out */}
          <button
            onClick={signOut}
            type="button"
            className="place-self-start rounded-full bg-red-500 p-2 text-white"
          >
            <SignOut className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            {!isUpdating && <p className="font-medium">Edit Profile</p>}
            {/* Button to set update mode */}
            <button
              onClick={() => setIsUpdating(!isUpdating)}
              type="button"
              className={`rounded-full p-2 text-white ${
                isUpdating ? "bg-gray-500" : "bg-orange"
              }`}
            >
              {isUpdating ? (
                <X className="h-5 w-5" />
              ) : (
                <Pencil className="h-5 w-5" weight="fill" />
              )}
            </button>
            {/* Button to submit the form - Show only if in update mode */}
            {isUpdating && (
              <button
                type="submit"
                disabled={pending}
                className={` ${
                  pending ? "bg-orange/50" : "bg-orange"
                } place-self-end rounded-full p-2 text-white`}
              >
                {pending ? (
                  <CircleNotch className="animate-spin" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </Form>
      {/* Show error or success messages */}
      {state?.error && (
        <p aria-live="polite" className="text-red-500">
          {state?.error}
        </p>
      )}
      {state?.message && (
        <p aria-live="polite" className="text-green-500">
          {state?.message}
        </p>
      )}
    </div>
  );
}
