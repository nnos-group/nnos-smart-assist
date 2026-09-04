import { describe, it, expect, beforeEach } from "vitest";
import { initSecurityProtection } from "@/lib/securityProtection";

describe("Security Protection (Anti-DevTools & Anti-Inspection)", () => {
  beforeEach(() => {
    initSecurityProtection();
  });

  it("blocks F12 keydown event", () => {
    const event = new KeyboardEvent("keydown", {
      key: "F12",
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("blocks Ctrl + Shift + I (Inspect shortcut)", () => {
    const event = new KeyboardEvent("keydown", {
      key: "I",
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("blocks Ctrl + Shift + J (Console shortcut)", () => {
    const event = new KeyboardEvent("keydown", {
      key: "J",
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("blocks Ctrl + Shift + C (Element selector shortcut)", () => {
    const event = new KeyboardEvent("keydown", {
      key: "C",
      ctrlKey: true,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("blocks Ctrl + U (View Source shortcut)", () => {
    const event = new KeyboardEvent("keydown", {
      key: "U",
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("blocks right-click context menu (Inspecionar elemento)", () => {
    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not block normal user inputs like Enter or alphanumeric keys", () => {
    const event = new KeyboardEvent("keydown", {
      key: "a",
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
});
