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

type Ornament = { x: number; y: number; size: number; color: string; title: string; msg: string };

const GOLD = "var(--gold)";
const BERRY = "var(--berry)";
const SNOW = "var(--snow)";
const BLUE = "var(--primary)";

const ORNAMENTS: Ornament[] = [
  { x: 50, y: 17, size: 1.1, color: GOLD, title: "Esperança", msg: "Que a luz do Natal acenda esperança em cada coração." },
  { x: 44, y: 25, size: 0.9, color: BERRY, title: "Amor", msg: "O amor é o presente mais bonito que podemos oferecer." },
  { x: 57, y: 28, size: 1.0, color: BLUE, title: "Paz", msg: "Que a paz deste Natal permaneça com você o ano inteiro." },
  { x: 38, y: 34, size: 0.85, color: SNOW, title: "Fé", msg: "A fé ilumina os caminhos mesmo nas noites mais escuras." },
  { x: 50, y: 36, size: 1.15, color: BERRY, title: "Gratidão", msg: "Agradecer é reconhecer as bênçãos que nos cercam." },
  { x: 62, y: 37, size: 0.9, color: GOLD, title: "Solidariedade", msg: "Um pequeno gesto pode transformar o Natal de alguém." },
  { x: 31, y: 43, size: 1.0, color: BLUE, title: "União", msg: "Juntos, fazemos o Natal ficar ainda mais iluminado." },
  { x: 43, y: 45, size: 0.85, color: GOLD, title: "Carinho", msg: "Cuidar de quem precisa é a essência do Natal." },
  { x: 56, y: 46, size: 1.1, color: SNOW, title: "Alegria", msg: "Que a alegria desta data se multiplique em sorrisos." },
  { x: 68, y: 47, size: 0.9, color: BERRY, title: "Generosidade", msg: "Dar de coração é o maior presente que existe." },
  { x: 25, y: 53, size: 0.95, color: BERRY, title: "Compaixão", msg: "Enxergar o outro com carinho muda o mundo ao redor." },
  { x: 37, y: 54, size: 1.1, color: BLUE, title: "Luz", msg: "Cada gesto de bondade é uma luz que se acende." },
  { x: 50, y: 55, size: 0.9, color: GOLD, title: "Renovação", msg: "O Natal renova forças para recomeçar com o coração aberto." },
  { x: 62, y: 56, size: 1.0, color: SNOW, title: "Partilha", msg: "Dividir o que temos multiplica o que somos." },
  { x: 73, y: 57, size: 0.85, color: BLUE, title: "Ternura", msg: "Nos pequenos cuidados moram os grandes afetos." },
  { x: 20, y: 63, size: 0.9, color: GOLD, title: "Bondade", msg: "A bondade não faz barulho, mas ilumina tudo." },
  { x: 32, y: 64, size: 1.05, color: SNOW, title: "Família", msg: "Que nenhum coração passe este Natal se sentindo sozinho." },
  { x: 44, y: 65, size: 0.9, color: BERRY, title: "Acolhimento", msg: "Acolher é abrir as portas do coração para quem precisa." },
  { x: 57, y: 66, size: 1.1, color: BLUE, title: "Sonho", msg: "Todo sonho compartilhado ganha força para se realizar." },
  { x: 69, y: 67, size: 0.95, color: GOLD, title: "Respeito", msg: "Cuidar de quem viveu tanto é honrar a própria história." },
  { x: 79, y: 68, size: 0.85, color: BERRY, title: "Presença", msg: "Estar presente é o abraço que não precisa de palavras." },
  { x: 16, y: 74, size: 0.95, color: BLUE, title: "Gentileza", msg: "Uma gentileza por dia deixa o ano inteiro mais leve." },
  { x: 28, y: 75, size: 1.1, color: BERRY, title: "Coragem", msg: "Há coragem silenciosa em cada vida que inspira a nossa." },
  { x: 40, y: 76, size: 0.9, color: SNOW, title: "Memória", msg: "Cada história de vida merece ser ouvida e celebrada." },
  { x: 53, y: 77, size: 1.05, color: GOLD, title: "Comunidade", msg: "Quando uma comunidade se une, ninguém fica para trás." },
  { x: 65, y: 78, size: 0.9, color: BLUE, title: "Cuidado", msg: "Cuidar é a forma mais bonita de dizer: você importa." },
  { x: 76, y: 79, size: 1.0, color: SNOW, title: "Sorriso", msg: "Um sorriso sincero é o enfeite mais bonito do Natal." },
  { x: 22, y: 83, size: 0.9, color: GOLD, title: "Dignidade", msg: "Todo gesto de apoio devolve dignidade e esperança." },
  { x: 35, y: 84, size: 1.0, color: BLUE, title: "Harmonia", msg: "Que a harmonia deste Natal ecoe durante todo o ano." },
  { x: 48, y: 85, size: 0.85, color: BERRY, title: "Futuro", msg: "Plantar amor hoje é colher um amanhã mais humano." },
  { x: 61, y: 86, size: 1.05, color: GOLD, title: "Bênção", msg: "Que cada doação volte em bênçãos para quem doou." },
  { x: 73, y: 85, size: 0.9, color: BERRY, title: "Coração", msg: "Neste Natal, deixe o coração escolher o caminho do bem." },
];

const LIGHTS = Array.from({ length: 40 }, (_, i) => {
  const y = 17 + (i / 40) * 70;
  const half = ((y - 8) / 84) * 38;
  return { y, x: 50 + Math.sin(i * 1.9) * half * 0.88, d: (i % 5) * 0.4 };
});

// Camadas da árvore: galhos curvos com neve no topo
const LAYERS = [
  { top: 10, half: 16, bottom: 36 },
  { top: 22, half: 24, bottom: 54 },
  { top: 36, half: 31, bottom: 70 },
  { top: 52, half: 38, bottom: 88 },
];

function Index() {
  const [open, setOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [flakes, setFlakes] = useState<{ l: number; d: number; s: number; delay: number }[]>([]);

  useEffect(() => {
    setFlakes(Array.from({ length: 60 }, () => ({ l: Math.random() * 100, d: 8 + Math.random() * 10, s: 2 + Math.random() * 4, delay: -Math.random() * 15 })));
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
          <span key={i} className="snowflake absolute -top-4 rounded-full bg-primary/30"
            style={{ left: `${f.l}%`, width: f.s, height: f.s, animationDuration: `${f.d}s`, animationDelay: `${f.delay}s` }} />
        ))}
      </div>

      <header className="relative pt-8 text-center">

        <h1 className="mt-2 px-4 font-display text-7xl leading-[1.1] text-primary sm:text-9xl">Natal Solidário</h1>
        <p className="mt-1 px-4 text-base font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:text-2xl">
          Árvore de Natal Solidária 2026
        </p>
        <div className="mt-5 flex flex-col items-center gap-1 px-4">
          <p className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border-2 border-primary/25 bg-card px-5 py-3.5 text-[17px] font-extrabold text-primary shadow-[0_8px_28px_oklch(0_0_0/0.10)] sm:gap-3 sm:px-12 sm:py-6 sm:text-3xl">
            <span aria-hidden className="h-5 w-5 fill-gold sm:h-8 sm:w-8">
              <svg viewBox="0 0 24 24" className="h-full w-full"><path d="M12 15.4 5.3 8.7l1.4-1.4L12 12.6l5.3-5.3 1.4 1.4z" /></svg>
            </span>
            Toque nas bolinhas da árvore
          </p>
          <svg aria-hidden viewBox="0 0 24 24" className="h-9 w-9 animate-bounce fill-gold sm:h-12 sm:w-12">
            <path d="M12 15.4 5.3 8.7 6.7 7.3 12 12.6l5.3-5.3 1.4 1.4z" />
          </svg>
        </div>
        <p className="mx-auto mt-2 max-w-xl px-6 text-base text-foreground/75 sm:text-lg">
          Cada enfeite guarda uma mensagem de Natal e um convite para ajudar o Recanto Luiz Bertoli.
        </p>
      </header>


      <section className="relative mx-auto w-full max-w-[680px] px-4">
        <div className="relative aspect-[3/4] w-full">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="pineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--pine)" />
                <stop offset="100%" stopColor="var(--pine-dark)" />
              </linearGradient>
            </defs>
            {/* tronco */}
            <rect x="45" y="86" width="10" height="10" rx="1.5" fill="oklch(0.45 0.07 60)" />
            {/* camadas de galhos com curvas suaves */}
            {LAYERS.map((L, i) => (
              <g key={i}>
                <path
                  d={`M 50 ${L.top} Q ${50 + L.half * 0.55} ${L.top + (L.bottom - L.top) * 0.45} ${50 + L.half} ${L.bottom} Q 50 ${L.bottom - 4} ${50 - L.half} ${L.bottom} Q ${50 - L.half * 0.55} ${L.top + (L.bottom - L.top) * 0.45} 50 ${L.top} Z`}
                  fill="url(#pineGrad)"
                />
                {/* neve no topo de cada camada */}
                <path
                  d={`M 50 ${L.top} Q ${50 + L.half * 0.55} ${L.top + (L.bottom - L.top) * 0.45} ${50 + L.half} ${L.bottom} Q ${50 + L.half * 0.55} ${L.bottom - 2} 50 ${L.top + 5} Q ${50 - L.half * 0.55} ${L.bottom - 2} ${50 - L.half} ${L.bottom} Q ${50 - L.half * 0.55} ${L.top + (L.bottom - L.top) * 0.45} 50 ${L.top} Z`}
                  fill="var(--snow)"
                  opacity="0.35"
                />
              </g>
            ))}
            {/* sombra lateral */}
            <path d="M 50 10 L 50 88 L 12 88 Q 30 70 19 70 Q 32 52 26 54 Q 38 36 34 36 Q 44 24 50 10 Z" fill="var(--pine-dark)" opacity=".3" />
            {/* chão de neve */}
            <ellipse cx="50" cy="95" rx="42" ry="4.5" fill="var(--snow)" />
            <ellipse cx="50" cy="94.5" rx="30" ry="3" fill="oklch(0.94 0.02 230)" opacity=".6" />
          </svg>
          <svg viewBox="0 0 24 24" className="twinkle absolute left-1/2 top-[1%] h-[9%] -translate-x-1/2 fill-gold drop-shadow-[0_0_12px_var(--gold)]" aria-hidden>
            <path d="M12 2l2.9 6.9L22 9.6l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.6L2 9.6l7.1-.7z" />
          </svg>
          {LIGHTS.map((l, i) => (
            <span key={i} aria-hidden className="twinkle absolute h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_8px_var(--gold)]"
              style={{ left: `${l.x}%`, top: `${l.y}%`, animationDelay: `${l.d}s` }} />
          ))}
          {ORNAMENTS.map((orn, i) => (
            <button key={i} onClick={() => setOpen(i)} aria-label={`Abrir enfeite: ${orn.title}`}
              className="sway absolute -translate-x-1/2 rounded-full p-1 transition-transform hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              style={{ left: `${orn.x}%`, top: `${orn.y}%`, animationDelay: `${i * 0.25}s` }}>
              <span className="mx-auto block h-1.5 w-2 rounded-sm bg-gold" />
              <span className="block rounded-full shadow-[inset_-4px_-4px_8px_oklch(0_0_0/0.3),0_2px_10px_oklch(0_0_0/0.2)]"
                style={{
                  width: `calc(2.25rem * ${orn.size})`,
                  height: `calc(2.25rem * ${orn.size})`,
                  background: `radial-gradient(circle at 35% 30%, oklch(1 0 0 / .8), ${orn.color} 40%)`,
                }} />
            </button>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-2xl px-6 pb-16 text-center">
        <h2 className="font-display text-5xl text-primary">Sobre a campanha</h2>
        <p className="mt-3 text-foreground/85">A Árvore de Natal Solidária convida você a transformar o espírito natalino em gesto. Cada enfeite guarda uma mensagem — e um convite para contribuir espontaneamente com o Recanto Luiz Bertoli.</p>
        <div className="mt-6 rounded-2xl border border-primary/20 bg-card p-5 text-sm text-foreground/80 shadow-sm">
          <p className="font-semibold text-foreground">Recanto Luiz Bertoli</p>
          <p className="mt-1 italic">[Texto institucional oficial a ser inserido pela organização.]</p>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">A doação é feita diretamente pelo aplicativo do seu banco, via Pix. Este site não coleta dados pessoais.</p>
      </section>

      {o && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-3 backdrop-blur-sm animate-in fade-in sm:items-center"
          onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-labelledby="orn-title">
          <div onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-2xl bg-card p-6 text-center text-card-foreground shadow-2xl animate-in slide-in-from-bottom-6">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Enfeite de Natal</p>
            <h3 id="orn-title" className="mt-1 font-display text-5xl text-primary">{o.title}</h3>
            <p className="mt-3 text-lg italic leading-snug text-foreground/85">“{o.msg}”</p>
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
