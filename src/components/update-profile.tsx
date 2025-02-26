"use client";
import Form from "next/form";
import { useActionState, useState, useEffect } from "react";
import { updateUser } from "@/actions/users.actions";
import { signOut } from "@/actions/auth.actions";
import { Pencil, X, Check, CircleNotch, SignOut } from "@phosphor-icons/react";

type UpdateProfileProps = {
  user: {
    email: string;
    name: string;
  };
};
// Define the initial state for the component - this is the shape used by the useActionState hook
const initialState = {
  message: "",
};

export default function UpdateProfile({ user }: UpdateProfileProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [state, updateProfileAction, pending] = useActionState(
    updateUser,
    initialState,
  );

  // Reset udpate after successful update
  useEffect(() => {
    if (state?.message) {
      setIsUpdating(false);
    }
  }, [state?.message]);

  return (
    <div className="flex flex-col gap-4">
      {/* Form */}
      <Form action={updateProfileAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            name="email"
            className="rounded-md border border-foreground bg-white p-2 shadow-md"
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
            className="rounded-md border border-foreground bg-white p-2 shadow-md"
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
              className="rounded-md border border-foreground bg-white p-2 shadow-md"
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
              className="rounded-md border border-foreground bg-white p-2 shadow-md"
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
