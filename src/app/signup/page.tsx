"use client";

import { useActionState } from "react";
import { signUp } from "../actions/auth.actions";
import Form from "next/form";

// Define the initial state for the component - this is the shape used by the useActionState hook
const initialState = {
  message: "",
};

export default function SignUpPage() {
  // Use the useActionState hook to manage the state and execute the signUp action.
  // The hook returns the current state (message string), the signUp action function and a boolean indicating if the action is pending.
  const [state, signUpAction, pending] = useActionState(signUp, initialState);

  return (
    <>
      <h1>Sign Up</h1>
      <Form action={signUpAction}>
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
          {pending ? "Signing Up..." : "Sign Up"}
        </button>
      </Form>
    </>
  );
}
