import { useEffect, useCallback, useRef, useState } from "react";
import { VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MusicController } from "@/lib/christmas-music";

/**
 * Trilha de Natal que começa sozinha no primeiro gesto do visitante,
 * com um botão discreto para pausar e retomar.
 *
 * Os navegadores só permitem som depois de um gesto (toque, clique,
 * tecla, rolagem), então tentamos na hora e repetimos a cada gesto
 * até o som sair. Depois que o visitante pausa no botão, novos gestos
 * não religam a música — só o botão mesmo.
 *
 * Quando a pessoa sai da aba, a trilha some; volta quando ela retorna.
 */
const GESTURES: string[] = ["pointerdown", "touchstart", "keydown", "wheel"];

async function load(): Promise<MusicController | null> {
  try {
    const { createChristmasMusic } = await import("@/lib/christmas-music");
    return createChristmasMusic({ titles: ["Jingle Bells"], volume: 0.3 });
  } catch {
    return null;
  }
}

export function AutoMusic() {
  const [running, setRunning] = useState(false);
  const controllerRef = useRef<MusicController | null>(null);
  const loadingRef = useRef<Promise<MusicController | null> | null>(null);
  const startingRef = useRef(false);
  const mountedRef = useRef(false);
  const pausedRef = useRef(false);

  const start = useCallback(async () => {
    if (pausedRef.current || startingRef.current || controllerRef.current?.isRunning()) return;
    startingRef.current = true;
    try {
      loadingRef.current ??= load();
      const audio = controllerRef.current ?? (await loadingRef.current);
      if (audio === null || pausedRef.current || !mountedRef.current || document.hidden) return;
      controllerRef.current = audio;
      await audio.start();
      if (pausedRef.current || !mountedRef.current || document.hidden) {
        audio.stop();
        return;
      }
      setRunning(audio.isRunning());
    } catch {
      return;
    } finally {
      startingRef.current = false;
    }
  }, []);

  const toggle = useCallback(() => {
    const audio = controllerRef.current;
    if (!pausedRef.current && (startingRef.current || audio?.isPlaying())) {
      pausedRef.current = true;
      audio?.stop();
      setRunning(false);
    } else {
      pausedRef.current = false;
      void start();
    }
  }, [start]);

  useEffect(() => {
    mountedRef.current = true;
    function onGesture(event: Event) {
      // The control's own gesture must not restart playback before its click.
      if (event.target instanceof Element && event.target.closest('[data-music-control]')) return;
      void start();
    }

    function onVisibility() {
      const audio = controllerRef.current;
      if (document.hidden) {
        audio?.stop();
        setRunning(false);
      } else if (!pausedRef.current) {
        void start();
      }
    }

    const activation = (
      window.navigator as unknown as { userActivation?: { hasBeenActive?: boolean } }
    ).userActivation;
    if (activation?.hasBeenActive) void start();

    for (const name of GESTURES) window.addEventListener(name, onGesture, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mountedRef.current = false;
      for (const name of GESTURES) window.removeEventListener(name, onGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      controllerRef.current?.stop();
    };
  }, [start]);

  return (
    <Button
      variant="outline"
      data-music-control
      type="button"
      onClick={toggle}
      aria-pressed={running}
      aria-label={running ? "Pausar música de Natal" : "Tocar música de Natal"}
      className="fixed bottom-4 right-4 z-50 flex h-auto items-center gap-2 rounded-full border border-primary/20 bg-card/90 px-4 py-3 text-sm font-semibold text-foreground shadow-lg backdrop-blur transition hover:bg-card focus-visible:outline-2 focus-visible:outline-primary/60"
    >
      {running ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
          <span className="eq-bar h-4 w-[3px] rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
          <span className="eq-bar h-4 w-[3px] rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
          <span className="eq-bar h-4 w-[3px] rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
        </span>
      ) : (
        <VolumeX className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{running ? "Música tocando" : "Música pausada"}</span>
    </Button>
  );
}
