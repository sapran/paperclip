// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { passkeyAvailabilityMessage, passkeyErrorMessage } from "./passkeys";

describe("passkey browser guidance", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("fails closed outside a secure context", () => {
    vi.stubGlobal("isSecureContext", false);
    expect(passkeyAvailabilityMessage()).toContain("require HTTPS");
  });

  it("explains unsupported browsers", () => {
    vi.stubGlobal("isSecureContext", true);
    const original = window.PublicKeyCredential;
    Reflect.deleteProperty(window, "PublicKeyCredential");
    expect(passkeyAvailabilityMessage()).toContain("does not support passkeys");
    if (original) Object.defineProperty(window, "PublicKeyCredential", { configurable: true, value: original });
  });

  it("turns a cancelled browser prompt into useful guidance", () => {
    expect(passkeyErrorMessage(new DOMException("cancelled", "NotAllowedError"))).toContain("cancelled or timed out");
  });
});
