"use client";

import { useActionState } from "react";
import { signIn } from "@/actions/auth.actions";
import Form from "next/form";
import Link from "next/link";

// Define the initial state for the component - this is the shape used by the useActionState hook
const initialState = {
  message: "",
};

export default function Page() {
  // Use the useActionState hook to manage the state and execute the signUp action.
  // The hook returns the current state (message string), the signUp action function and a boolean indicating if the action is pending.
  const [state, signInAction, pending] = useActionState(signIn, initialState);
  return (
    <div className="mx-auto max-w-[500px] pt-20">
      <h1 className="text-center font-heading text-4xl font-bold text-orange">
        Palette
      </h1>
      <div className="flex flex-col gap-4 pt-10">
        <h2 className="text-center font-body text-xl font-medium text-foreground">
          Sign in
        </h2>
        <hr className="mx-auto h-[1px] w-10/12 border-none bg-foreground" />
      </div>
      <Form
        action={signInAction}
        className="mx-auto flex w-10/12 flex-col gap-4 pt-10"
      >
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            name="email"
            className="rounded-md border border-foreground bg-white p-2 shadow-md focus:outline-none"
            placeholder="Email..."
          />
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input
            type="password"
            name="password"
            className="rounded-md border border-foreground bg-white p-2 shadow-md focus:outline-none"
            placeholder="Password..."
          />
          <p aria-live="polite">{state?.message}</p>
        </label>
        <p aria-live="polite" className="text-red-500">
          {state?.message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className={` ${
            pending ? "bg-orange/50" : "bg-orange"
          } rounded-md p-2 text-white`}
        >
          {pending ? "Signing In..." : "Sign In"}
        </button>
      </Form>
      <p className="pt-4 text-center">
        Dont have an account? Sign up{" "}
        <Link href="/signup" className="font-medium underline">
          here
        </Link>
      </p>
    </div>
  );
}
