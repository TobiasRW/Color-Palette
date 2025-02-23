"use client";

import { useActionState } from "react";
import { signUp } from "../actions/auth.actions";
import Form from "next/form";

const initialState = {
  message: "",
};

export default function SignUpPage() {
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
          Sign Up
        </button>
      </Form>
    </>
  );
}
