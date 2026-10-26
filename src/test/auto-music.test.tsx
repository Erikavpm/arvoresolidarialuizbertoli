import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AutoMusic } from "@/components/AutoMusic";

const audio = vi.hoisted(() => {
  let playing = false;
  return {
    start: vi.fn(async () => { playing = true; }),
    stop: vi.fn(() => { playing = false; }),
    isPlaying: () => playing,
    isRunning: () => playing,
  };
});
const create = vi.hoisted(() => vi.fn());
vi.mock("@/lib/christmas-music", () => ({ createChristmasMusic: create }));

beforeEach(() => {
  audio.stop();
  vi.clearAllMocks();
  create.mockReturnValue(audio);
});
afterEach(cleanup);

describe("Music pause control", () => {
  it("creates only one player when initial gestures overlap, and pauses it", async () => {
    render(<AutoMusic />);
    act(() => {
      fireEvent.pointerDown(window);
      fireEvent.touchStart(window);
      fireEvent.keyDown(window);
    });
    await waitFor(() => expect(audio.isRunning()).toBe(true));
    expect(create).toHaveBeenCalledTimes(1);
    expect(audio.start).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button"));
    expect(audio.isRunning()).toBe(false);
  });

  it("stays paused after other gestures and resumes only through the control", async () => {
    render(<AutoMusic />);
    fireEvent.pointerDown(window);
    await waitFor(() => expect(audio.isRunning()).toBe(true));
    fireEvent.click(screen.getByRole("button"));
    fireEvent.pointerDown(window);
    fireEvent.wheel(window);
    expect(audio.isRunning()).toBe(false);
    expect(audio.start).toHaveBeenCalledTimes(1);
    fireEvent.pointerDown(screen.getByRole("button"));
    expect(audio.isRunning()).toBe(false);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(audio.isRunning()).toBe(true));
    expect(audio.start).toHaveBeenCalledTimes(2);
  });

  it("honors pause while playback is still starting", async () => {
    let finish: (() => void) | undefined;
    audio.start.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }));
    render(<AutoMusic />);
    fireEvent.pointerDown(window);
    await waitFor(() => expect(audio.start).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole("button"));
    await act(async () => { finish?.(); });
    expect(audio.stop).toHaveBeenCalled();
    expect(audio.isRunning()).toBe(false);
  });
});