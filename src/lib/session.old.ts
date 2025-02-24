import "server-only";
import { cookies } from "next/headers";

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

// Define the JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

// Define session duration in days
const SESSION_DURATION_DAYS = 7;

// ______________________HELPER FUNCTIONS______________________

// Helper function to convert text string into Uint8Array/binary
const textToBinary = (text: string) => {
  const encoder = new TextEncoder();
  return encoder.encode(text);
};

// Helper function to convert binary/Uint8Array into text string
const binaryToText = (binary: Uint8Array) => {
  const decoder = new TextDecoder();
  return decoder.decode(binary);
};

// Helper function to convert binary/Uint8Array into base64 string
const binaryToBase64 = (binary: Uint8Array) => {
  return btoa(String.fromCharCode(...binary));
};

// Helper function to convert base64 string into binary/Uint8Array
const base64ToBinary = (base64: string) => {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

// ______________________SESSION FUNCTIONS______________________

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

// Encrypt session data using Web Crypto API
export async function encrypt(userId: string) {
  // Create the session data object
  const sessionData = {
    userId: userId,
    exp: Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000, // Set the expiration time
    iat: Date.now(), // Set the time the token was issued
  };

  // Convert the session data to binary so it can be signed
  const dataBinary = textToBinary(JSON.stringify(sessionData));

  // Create a key for encryption
  const key = await crypto.subtle.importKey(
    "raw",
    textToBinary(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Create a signature to verify the data hasn't been tampered with
  const signature = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, dataBinary)
  );

  return JSON.stringify({
    data: binaryToBase64(dataBinary),
    signature: binaryToBase64(signature),
  });
}

// Decrypt and verify session data
export async function decrypt(session?: string) {
  try {
    // If no session exists, return null
    if (!session) return null;

    // Extract the data and signature
    const { data, signature } = JSON.parse(session);

    // Convert the safe strings back to binary
    const dataBinary = base64ToBinary(data);
    const signatureBinary = base64ToBinary(signature);

    // Create the same type of key for verification
    const key = await crypto.subtle.importKey(
      "raw",
      textToBinary(JWT_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Check if the signature is valid
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBinary,
      dataBinary
    );

    // If signature isn't valid, return null
    if (!isValid) return null;

    // Convert the data back to an object
    const sessionData = JSON.parse(binaryToText(dataBinary));

    // Check if the session has expired
    if (sessionData.exp < Date.now()) return null;

    // Everything is valid, return the session data
    return sessionData;
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
