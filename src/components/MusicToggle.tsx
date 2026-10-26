import { useCallback, useRef, useState } from "react";
import type { MusicController } from "@/lib/christmas-music";

/**
 * Botão fixo que liga e desliga a trilha instrumental natalina.
 * O sintetizador é carregado só no primeiro clique (precisa de um gesto
 * do visitante e mantém a página leve ao carregar).
 */
export function MusicToggle() {
  const controller = useRef<MusicController | null>(null);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [failed, setFailed] = useState(false);

  const toggle = useCallback(async () => {
    if (controller.current) {
      if (controller.current.isPlaying()) {
        controller.current.stop();
        setPlaying(false);
      } else {
        await controller.current.start();
        setPlaying(true);
      }
      return;
    }

    try {
      const { createChristmasMusic } = await import("@/lib/christmas-music");
      const created = createChristmasMusic({ onTitle: setTitle });
      await created.start();
      controller.current = created;
      setPlaying(true);
    } catch {
      setFailed(true);
    }
  }, []);

  if (failed) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? "Pausar música instrumental de Natal" : "Tocar música instrumental de Natal"}
      title={playing ? "Pausar música" : "Ouvir música instrumental de Natal"}
      className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border px-3.5 py-2.5 text-[13px] font-bold shadow-[0_8px_24px_oklch(0_0_0/0.12)] backdrop-blur transition-colors sm:bottom-6 sm:right-6 sm:text-sm ${
        playing
          ? "border-gold/60 bg-card text-primary ring-2 ring-gold/35"
          : "border-primary/20 bg-card/90 text-primary hover:bg-card"
      }`}
    >
      {playing ? (
        <>
          <span aria-hidden className="flex h-4 items-end gap-[3px]">
            <span className="eq-bar h-4 w-[3px] rounded-full bg-gold" style={{ animationDelay: "0s" }} />
            <span className="eq-bar h-4 w-[3px] rounded-full bg-gold" style={{ animationDelay: "0.18s" }} />
            <span className="eq-bar h-4 w-[3px] rounded-full bg-gold" style={{ animationDelay: "0.36s" }} />
          </span>
          <span className="max-w-[42vw] truncate sm:max-w-none">{title || "Tocando"}</span>
        </>
      ) : (
        <>
          <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-gold sm:h-[18px] sm:w-[18px]">
            <path d="M9 18.5a2.5 2.5 0 1 1-1-4.8V6.2l10-2v9.8a2.5 2.5 0 1 1-1-4.8V6.4l-8 1.6v10.5Z" />
          </svg>
          <span>Música de Natal</span>
        </>
      )}
    </button>
  );
}
