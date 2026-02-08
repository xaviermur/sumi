export function parseSpanishNumber(text: any): number {
  if (!text || typeof text !== "string") {
    return NaN; // nunca rompas la app
  }

  // Normalización segura
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+y\s+/g, " ")
    .trim();

  if (!normalized) return NaN;

  // 1️⃣ Si hay números → usa el ULTIMO
  const numericMatches = normalized.match(/\d+/g);
  if (numericMatches && numericMatches.length > 0) {
    return Number(numericMatches[numericMatches.length - 1]);
  }

  // 2️⃣ Extraer *último bloque* después de "resultado"
  const parts = normalized.split("resultado").map(p => p.trim()).filter(Boolean);
  const target = parts.length > 0 ? parts[parts.length - 1] : normalized;

  if (!target) return NaN;

  const words = target.split(/\s+/);

  // Si son solo unidades repetidas (ej: "cinco cinco"), usar la última
  // Nota: evitamos concatenar respuestas cuando el reconocimiento acumula texto.
  // Se aplica antes de combinar decenas/centenas.
  // (Ej: "cinco cinco" -> 5)
  const UNIDADES: Record<string, number> = {
    cero: 0, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, sinco: 5,
    seis: 6, siete: 7, ocho: 8, nueve: 9,
  };

  const allUnits = words.length > 1 && words.every((w) => UNIDADES[w] !== undefined);
  if (allUnits) {
    return UNIDADES[words[words.length - 1]];
  }

  // Manejar "veinti dos" (separado) como 22
  if (words.length === 2 && words[0] === "veinti" && UNIDADES[words[1]] !== undefined) {
    return 20 + UNIDADES[words[1]];
  }

  // Diccionarios

  const DIEZES: Record<string, number> = {
    diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15,
    dieciseis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19,
  };

  const VEINTES: Record<string, number> = {
    veinte: 20,
    veintiuno: 21, veintiun: 21,
    veintidos: 22, veintitres: 23, veinticuatro: 24, veinticinco: 25,
    veintiseis: 26, veintisiete: 27, veintiocho: 28, veintinueve: 29,
  };

  const DECENAS: Record<string, number> = {
    treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60,
    setenta: 70, ochenta: 80, noventa: 90,
  };

  const CENTENAS: Record<string, number> = {
    cien: 100, ciento: 100, doscientos: 200, trescientos: 300,
    cuatrocientos: 400, quinientos: 500, seiscientos: 600,
    setecientos: 700, ochocientos: 800, novecientos: 900,
  };

  // 3️⃣ Parse palabra por palabra
  let total = 0;
  let matched = false;

  for (const w of words) {
    if (UNIDADES[w] !== undefined) {
      total += UNIDADES[w];
      matched = true;
    } else if (DIEZES[w] !== undefined) {
      total += DIEZES[w];
      matched = true;
    } else if (VEINTES[w] !== undefined) {
      total += VEINTES[w];
      matched = true;
    } else if (DECENAS[w] !== undefined) {
      total += DECENAS[w];
      matched = true;
    } else if (CENTENAS[w] !== undefined) {
      total += CENTENAS[w];
      matched = true;
    }
  }

  if (!matched) return NaN;
  return Number.isFinite(total) ? total : NaN;
}
