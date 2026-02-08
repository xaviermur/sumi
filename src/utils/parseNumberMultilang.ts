import { parseSpanishNumber } from "./parseSpanishNumber";
import type { GameLanguage } from "@/core/types/game";

const KEYWORDS: Record<GameLanguage, string[]> = {
  es: ["resultado"],
  ca: ["resultat"],
  en: ["result"],
};

export function parseNumberMultilang(text: string, lang: GameLanguage): number | null {
  if (!text || typeof text !== "string") return null;

  if (lang === "es") {
    const n = parseSpanishNumber(text);
    return Number.isFinite(n) ? n : null;
  }

  const normalized = normalize(text);
  const target = extractAfterKeyword(normalized, KEYWORDS[lang]) ?? normalized;
  const numeric = extractLastNumber(target);
  if (numeric != null) return numeric;

  if (lang === "ca") return parseCatalan(target);
  if (lang === "en") return parseEnglish(target);
  return null;
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-–—]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLastNumber(text: string): number | null {
  const matches = text.match(/\d+/g);
  if (!matches || matches.length === 0) return null;
  return Number(matches[matches.length - 1]);
}

function extractAfterKeyword(text: string, keywords: string[]): string | null {
  let idx = -1;
  let key = "";
  for (const k of keywords) {
    const i = text.lastIndexOf(k);
    if (i > idx) {
      idx = i;
      key = k;
    }
  }
  if (idx === -1) return null;
  return text.slice(idx + key.length).trim();
}

function parseCatalan(text: string): number | null {
  const tokens = tokenize(text, ["i"]);
  const units: Record<string, number> = {
    zero: 0,
    un: 1,
    una: 1,
    u: 1,
    dos: 2,
    tres: 3,
    quatre: 4,
    cinc: 5,
    sis: 6,
    set: 7,
    vuit: 8,
    nou: 9,
  };
  const teens: Record<string, number> = {
    deu: 10,
    onze: 11,
    dotze: 12,
    tretze: 13,
    catorze: 14,
    quinze: 15,
    setze: 16,
    disset: 17,
    divuit: 18,
    dinou: 19,
  };
  const tens: Record<string, number> = {
    vint: 20,
    trenta: 30,
    quaranta: 40,
    cinquanta: 50,
    seixanta: 60,
    setanta: 70,
    vuitanta: 80,
    noranta: 90,
  };

  return parseWithHundreds(tokens, units, teens, tens, ["cent", "cents"]);
}

function parseEnglish(text: string): number | null {
  const tokens = tokenize(text, ["and"]);
  const units: Record<string, number> = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  const teens: Record<string, number> = {
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
  };
  const tens: Record<string, number> = {
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  };

  return parseWithHundreds(tokens, units, teens, tens, ["hundred"]);
}

function tokenize(text: string, ignore: string[]) {
  return text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => !ignore.includes(t));
}

function parseWithHundreds(
  tokens: string[],
  units: Record<string, number>,
  teens: Record<string, number>,
  tens: Record<string, number>,
  hundredTokens: string[]
): number | null {
  if (tokens.length > 1 && tokens.every((t) => t in units)) {
    return units[tokens[tokens.length - 1]];
  }

  let current = 0;
  let seen = false;

  for (const token of tokens) {
    if (token in units) {
      current += units[token];
      seen = true;
      continue;
    }
    if (token in teens) {
      current += teens[token];
      seen = true;
      continue;
    }
    if (token in tens) {
      current += tens[token];
      seen = true;
      continue;
    }
    if (hundredTokens.includes(token)) {
      if (current === 0) current = 1;
      current *= 100;
      seen = true;
      continue;
    }
  }

  if (!seen) return null;
  return current;
}
