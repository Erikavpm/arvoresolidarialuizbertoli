import { useEffect } from "react";
import type { MusicController } from "@/lib/christmas-music";

/**
 * Toca a trilha de Natal sozinha, sem nenhum botão na página.
 *
 * Os navegadores só deixam um som começar depois que o visitante faz algo
 * (um toque, um clique, uma tecla, uma rolagem). Então tentamos na hora e,
 * se estiver bloqueado, tentamos de novo a cada gesto até o som sair.
 * Quando a pessoa sai da aba, a trilha some; volta quando ela retorna.
 *
 * O sintetizador é carregado só aqui dentro, então nada toca no servidor.
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
  useEffect(() => {
    let controller: MusicController | null = null;
    let running = false;
    let heard = false;
    let disposed = false;

    function onGesture() {
      void start();
    }

    async function start() {
      if (disposed || running) return;
      const audio = controller ?? (await load());
      if (audio === null) return;
      controller = audio;
      try {
        await audio.start();
      } catch {
        return;
      }
      running = audio.isRunning();
      if (running) {
        heard = true;
        for (const name of GESTURES) window.removeEventListener(name, onGesture);
      }
    }

    function onVisibility() {
      if (document.hidden) {
        if (running) {
          controller?.stop();
          running = false;
        }
      } else if (heard) {
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
      disposed = true;
      for (const name of GESTURES) window.removeEventListener(name, onGesture);
      document.removeEventListener("visibilitychange", onVisibility);
      controller?.stop();
    };
  }, []);

  return null;
}
