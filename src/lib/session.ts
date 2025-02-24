import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

// Define JWT_SECRET and encode it
const JWT_SECRET = process.env.JWT_SECRET;
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

// Define session duration in days
const SESSION_DURATION_DAYS = 7;

// Create a new session
export async function createSession(userId: string) {
  // Set expiration date for the session cookie (7 days from now)
  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  // Generate a JWT for the session
  const session = await encrypt(userId);

  // store the token in a secure, http-only cookie
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true, // prevents JavaScript access
    secure: process.env.NODE_ENV === "production", // use HTTPS in production
    sameSite: "strict", // Prevents CSRF by not sending cookie with cross-site requests
    path: "/", // Cookie valid for the entire site
    expires: expiresAt, // Cookie expiration date
  });
}

// Delete a session by clearing the session cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

// Encrypts (signs) the session payload (user id) into a JWT
export async function encrypt(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" }) // Specify the algorithm
    .setIssuedAt() // Set the time the token was issued
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`) // Set the expiration time
    .sign(encodedSecret); // Sign the token with the secret
}

// Decrypts (verifies) the session JWT from the cookie
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedSecret, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

// getSession retrieves the session from the cookie
export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session?.value) return null;

  const payload = await decrypt(session.value);
  return payload;
}
