import { describe, expect, it } from "vitest";

import { SECTIONS, planMedley } from "@/lib/christmas-music";

// A trilha é sintetizada no navegador a partir de melodias em domínio público.
// Estas checagens protegem o arranjo: se alguém mexer nas notas ou nos acordes,
// a harmonia pode deixar de cobrir a melodia ou alguma nota sai da faixa útil.
describe("Trilha instrumental de Natal", () => {
  it("toca os três clássicos em domínio público, nesta ordem", () => {
    expect(SECTIONS.map((section) => section.title)).toEqual([
      "Jingle Bells",
      "Noite Feliz",
      "Hino da Alegria",
    ]);
  });

  it("cobre a melodia inteira com harmonia, em cada música", () => {
    for (const section of SECTIONS) {
      const melodyBeats = section.melody.reduce((sum, [, beats]) => sum + beats, 0);
      const chordBeats = section.chords.reduce((sum, [, , beats]) => sum + beats, 0);
      expect(chordBeats, `${section.title} ficou sem acordes no fim`).toBe(melodyBeats);
    }
  });

  it("mantém todas as notas dentro da faixa de uma caixinha de música", () => {
    const bells = planMedley().events.filter((event) => event.voice === "bell");
    expect(bells.length).toBeGreaterThan(100);
    for (const event of bells) {
      expect(event.freq).toBeGreaterThan(100);
      expect(event.freq).toBeLessThan(1600);
    }
  });

  it("encadeia os eventos no tempo e fecha o ciclo entre 1 e 3 minutos", () => {
    const { events, length } = planMedley();
    let previous = -1;
    for (const event of events) {
      expect(event.t).toBeGreaterThanOrEqual(previous);
      previous = event.t;
    }
    expect(length).toBeGreaterThan(60);
    expect(length).toBeLessThan(200);
  });

  // A página toca sozinha, sem botão: uma música alegre só, em ciclo.
  it("deixa escolher uma única música, que se repete sozinha", () => {
    const single = planMedley(["Jingle Bells"]);
    expect(single.marks.map((mark) => mark.title)).toEqual(["Jingle Bells"]);
    expect(single.length).toBeGreaterThan(20);
    expect(single.length).toBeLessThan(60);
  });
});
