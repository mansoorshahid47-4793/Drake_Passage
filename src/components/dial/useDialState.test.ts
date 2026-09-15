import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useDialState, relativeOffset } from "@/components/dial/useDialState";

describe("relativeOffset", () => {
  it("returns the shortest signed distance around the ring", () => {
    expect(relativeOffset(0, 0, 6)).toBe(0);
    expect(relativeOffset(1, 0, 6)).toBe(1);
    expect(relativeOffset(5, 0, 6)).toBe(-1);
    expect(relativeOffset(3, 0, 6)).toBe(3);
    expect(relativeOffset(4, 0, 6)).toBe(-2);
  });
});

describe("useDialState", () => {
  it("wraps in both directions and jumps with goTo", () => {
    const { result } = renderHook(() => useDialState(6));
    expect(result.current.index).toBe(0);
    act(() => result.current.prev());
    expect(result.current.index).toBe(5);
    act(() => result.current.next());
    act(() => result.current.next());
    expect(result.current.index).toBe(1);
    act(() => result.current.goTo(4));
    expect(result.current.index).toBe(4);
  });
});
