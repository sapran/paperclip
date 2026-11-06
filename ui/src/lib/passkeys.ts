import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";

export const passkeyAuthClient = createAuthClient({
  baseURL: typeof window === "undefined" ? undefined : window.location.origin,
  basePath: "/api/auth",
  plugins: [passkeyClient()],
});

export function passkeyAvailabilityMessage(): string | null {
  if (typeof window === "undefined") return null;
  if (!window.isSecureContext) {
    return "Passkeys require HTTPS, except on localhost. Open Paperclip from its secure canonical address.";
  }
  if (!("PublicKeyCredential" in window)) {
    return "This browser does not support passkeys. Use a current browser or sign in with your password.";
  }
  return null;
}

export function passkeyErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "The passkey request was cancelled or timed out. Try again when you are ready.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "The passkey request could not be completed. Check this site address and try again.";
}
