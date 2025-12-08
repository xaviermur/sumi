const normalizers: Record<string, (text: string) => number | null> = {
  es: (t) => parseSpanish(t),
  ca: (t) => parseCatalan(t),
  en: (t) => parseEnglish(t),
  fr: (t) => parseFrench(t),
};

export function parseNumberMultilang(text: string, lang: string): number | null {
  const clean = text.toLowerCase().trim();
  const parser = normalizers[lang];
  if (!parser) return null;
  return parser(clean);
}

// Ejemplo básico
function parseSpanish(t: string): number | null {
  const map: Record<string, number> = {
    "uno": 1, "dos": 2, "tres": 3, "cuatro": 4, "cinco": 5,
    "seis": 6, "siete": 7, "ocho": 8, "nueve": 9, "diez": 10
  };
  return map[t] ?? null;
}

function parseCatalan(t: string): number | null {
  const map: Record<string, number> = {
    "u": 1, "dos": 2, "tres": 3, "quatre": 4, "cinc": 5,
    "sis": 6, "set": 7, "vuit": 8, "nou": 9, "deu": 10
  };
  return map[t] ?? null;
}

function parseEnglish(t: string): number | null {
  const map: Record<string, number> = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10
  };
  return map[t] ?? null;
}

function parseFrench(t: string): number | null {
  const map: Record<string, number> = {
    "un": 1, "deux": 2, "trois": 3, "quatre": 4, "cinq": 5,
    "six": 6, "sept": 7, "huit": 8, "neuf": 9, "dix": 10
  };
  return map[t] ?? null;
}
