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
    <div className="pt-20">
      <h1 className="font-heading font-bold text-4xl text-orange text-center">
        Palette
      </h1>
      <div className="flex flex-col gap-4 pt-10">
        <h2 className="text-center text-foreground text-xl font-body font-medium">
          Sign in
        </h2>
        <hr className="border-none h-[1px] bg-foreground w-10/12 mx-auto" />
      </div>
      <Form
        action={signInAction}
        className="w-10/12 mx-auto flex flex-col gap-4 pt-10"
      >
        <label className="flex flex-col gap-1">
          Email
          <input
            type="email"
            name="email"
            className="border border-foreground rounded-md bg-white p-2 shadow-md"
            placeholder="Email..."
          />
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input
            type="password"
            name="password"
            className="border border-foreground rounded-md bg-white p-2 shadow-md"
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
          } text-white p-2 rounded-md`}
        >
          {pending ? "Signing In..." : "Sign In"}
        </button>
      </Form>
      <p className="text-center pt-4">
        Dont have an account? Sign up{" "}
        <Link href="/signup" className="underline font-medium">
          here
        </Link>
      </p>
    </div>
  );
}
