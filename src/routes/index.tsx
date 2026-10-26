import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Árvore de Natal Solidária 2026 — Recanto Luiz Bertoli" },
      { name: "description", content: "Toque nos enfeites da árvore e contribua com a campanha de Natal em prol do Recanto Luiz Bertoli." },
      { property: "og:title", content: "Árvore de Natal Solidária 2026" },
      { property: "og:description", content: "Uma campanha de Natal em prol do Recanto Luiz Bertoli. Toque nos enfeites e espalhe amor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// Dados oficiais: substituir quando disponíveis.
const PIX_KEY = "[CHAVE PIX OFICIAL — A DEFINIR]";
const PIX_QR_IMAGE: string | null = null; // ex.: "/images/qrcode-pix.png"

const ORNAMENTS = [
  { x: 50, y: 22, color: "var(--gold)", title: "Esperança", msg: "Que a luz do Natal acenda esperança em cada coração." },
  { x: 40, y: 38, color: "var(--berry)", title: "Amor", msg: "O amor é o presente mais bonito que podemos oferecer." },
  { x: 62, y: 42, color: "var(--snow)", title: "Paz", msg: "Que a paz deste Natal permaneça com você o ano inteiro." },
  { x: 33, y: 58, color: "var(--gold)", title: "Gratidão", msg: "Agradecer é reconhecer as bênçãos que nos cercam." },
  { x: 55, y: 60, color: "var(--berry)", title: "Solidariedade", msg: "Um pequeno gesto pode transformar o Natal de alguém." },
  { x: 70, y: 70, color: "var(--snow)", title: "União", msg: "Juntos, fazemos o Natal ficar ainda mais iluminado." },
  { x: 26, y: 76, color: "var(--berry)", title: "Carinho", msg: "Cuidar de quem precisa é a essência do Natal." },
  { x: 47, y: 80, color: "var(--gold)", title: "Alegria", msg: "Que a alegria desta data se multiplique em sorrisos." },
];

const LIGHTS = Array.from({ length: 22 }, (_, i) => {
  const y = 20 + (i / 22) * 62;
  const half = ((y - 12) / 76) * 34;
  return { y, x: 50 + Math.sin(i * 1.9) * half * 0.85, d: (i % 5) * 0.4 };
});

function Index() {
  const [open, setOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [flakes, setFlakes] = useState<{ l: number; d: number; s: number; delay: number }[]>([]);

  useEffect(() => {
    setFlakes(Array.from({ length: 30 }, () => ({ l: Math.random() * 100, d: 8 + Math.random() * 10, s: 2 + Math.random() * 4, delay: -Math.random() * 15 })));
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const copy = async () => {
    try { await navigator.clipboard.writeText(PIX_KEY); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  const o = open !== null ? ORNAMENTS[open] : null;

  return (
    <main className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0">
        {flakes.map((f, i) => (
          <span key={i} className="snowflake absolute -top-4 rounded-full bg-snow/70"
            style={{ left: `${f.l}%`, width: f.s, height: f.s, animationDuration: `${f.d}s`, animationDelay: `${f.delay}s` }} />
        ))}
      </div>

      <header className="relative px-6 pt-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Campanha de Natal</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-6xl">Árvore de Natal Solidária <span className="text-gold">2026</span></h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-foreground/80">Toque em um enfeite para receber uma mensagem e ajudar o Recanto Luiz Bertoli.</p>
      </header>

      <section className="relative mx-auto w-full max-w-[520px] px-4">
        <div className="relative aspect-[3/4] w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <polygon points="50,10 66,36 34,36" fill="var(--pine)" />
            <polygon points="50,24 76,58 24,58" fill="var(--pine)" />
            <polygon points="50,42 86,86 14,86" fill="var(--pine)" />
            <polygon points="50,10 50,86 14,86 34,58 24,58 34,36" fill="var(--pine-dark)" opacity=".45" />
            <rect x="45" y="86" width="10" height="8" fill="oklch(0.4 0.06 50)" />
          </svg>
          <svg viewBox="0 0 24 24" className="twinkle absolute left-1/2 top-[3%] h-[10%] -translate-x-1/2 fill-gold drop-shadow-[0_0_12px_var(--gold)]" aria-hidden>
            <path d="M12 2l2.9 6.9L22 9.6l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.6L2 9.6l7.1-.7z" />
          </svg>
          {LIGHTS.map((l, i) => (
            <span key={i} aria-hidden className="twinkle absolute h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]"
              style={{ left: `${l.x}%`, top: `${l.y}%`, animationDelay: `${l.d}s` }} />
          ))}
          {ORNAMENTS.map((orn, i) => (
            <button key={i} onClick={() => setOpen(i)} aria-label={`Abrir enfeite: ${orn.title}`}
              className="sway absolute -translate-x-1/2 rounded-full p-1 transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              style={{ left: `${orn.x}%`, top: `${orn.y}%`, animationDelay: `${i * 0.3}s` }}>
              <span className="mx-auto block h-1.5 w-2 rounded-sm bg-gold" />
              <span className="block h-9 w-9 rounded-full shadow-[inset_-4px_-4px_8px_oklch(0_0_0/0.3),0_0_14px_oklch(1_0_0/0.25)] sm:h-11 sm:w-11"
                style={{ background: `radial-gradient(circle at 35% 30%, oklch(1 0 0 / .8), ${orn.color} 40%)` }} />
            </button>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-2xl px-6 pb-16 text-center">
        <h2 className="font-display text-3xl text-gold">Sobre a campanha</h2>
        <p className="mt-3 text-foreground/85">A Árvore de Natal Solidária convida você a transformar o espírito natalino em gesto. Cada enfeite guarda uma mensagem — e um convite para contribuir espontaneamente com o Recanto Luiz Bertoli.</p>
        <div className="mt-6 rounded-2xl border border-gold/30 bg-secondary/60 p-5 text-sm text-foreground/80">
          <p className="font-semibold text-foreground">Recanto Luiz Bertoli</p>
          <p className="mt-1 italic">[Texto institucional oficial a ser inserido pela organização.]</p>
        </div>
        <p className="mt-6 text-xs text-foreground/60">A doação é feita diretamente pelo aplicativo do seu banco, via Pix. Este site não coleta dados pessoais.</p>
      </section>

      {o && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-3 backdrop-blur-sm animate-in fade-in sm:items-center"
          onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-labelledby="orn-title">
          <div onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-card p-6 text-center text-card-foreground shadow-2xl animate-in slide-in-from-bottom-6">
            <p className="text-xs uppercase tracking-[0.25em] text-primary">Enfeite de Natal</p>
            <h3 id="orn-title" className="mt-1 font-display text-3xl font-semibold">{o.title}</h3>
            <p className="mt-3 font-display text-xl italic leading-snug">“{o.msg}”</p>
            <p className="mt-4 text-sm text-muted-foreground">Se desejar, contribua com o Recanto Luiz Bertoli pelo Pix:</p>
            <div className="mx-auto mt-3 flex aspect-square w-44 items-center justify-center rounded-xl border-2 border-dashed bg-muted text-xs text-muted-foreground">
              {PIX_QR_IMAGE ? <img src={PIX_QR_IMAGE} alt="QR Code Pix oficial" className="h-full w-full rounded-xl object-contain" /> : "QR Code Pix oficial (a inserir)"}
            </div>
            <p className="mt-3 break-all rounded-lg bg-muted px-3 py-2 text-sm font-mono">{PIX_KEY}</p>
            <button onClick={copy} className="mt-3 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90">
              {copied ? "Chave copiada!" : "Copiar chave Pix"}
            </button>
            <button onClick={() => setOpen(null)} className="mt-2 w-full rounded-full border py-3 font-semibold text-card-foreground hover:bg-muted">
              Voltar à árvore
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
