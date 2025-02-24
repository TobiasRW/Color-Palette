"use client";

import { useActionState } from "react";
import { signIn } from "../actions/auth.actions";
import Form from "next/form";

// Define the initial state for the component - this is the shape used by the useActionState hook
const initialState = {
  message: "",
};

export default function Page() {
  // Use the useActionState hook to manage the state and execute the signUp action.
  // The hook returns the current state (message string), the signUp action function and a boolean indicating if the action is pending.
  const [state, signInAction, pending] = useActionState(signIn, initialState);
  return (
    <>
      <h1>Sign In</h1>
      <Form action={signInAction}>
        <label>
          Email
          <input type="email" name="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
          <p aria-live="polite">{state?.message}</p>
        </label>
        <button type="submit" disabled={pending}>
          {pending ? "Signing In..." : "Sign In"}
        </button>
      </Form>
    </>
  );
}
