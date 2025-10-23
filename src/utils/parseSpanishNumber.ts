const UNIDADES: Record<string, number> = {
  cero: 0, uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, sinco: 5,
  seis: 6, siete: 7, ocho: 8, nueve: 9,
};

const DIEZ_A_DIECINUEVE: Record<string, number> = {
  diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15,
  dieciseis: 16, dieciséis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19,
};

const DECENAS: Record<string, number> = {
  veinte: 20, treinta: 30, cuarenta: 40, cincuenta: 50, sesenta: 60,
  setenta: 70, ochenta: 80, noventa: 90,
};

const CENTENAS: Record<string, number> = {
  cien: 100, ciento: 100, doscientos: 200, trescientos: 300,
  cuatrocientos: 400, quinientos: 500, seiscientos: 600,
  setecientos: 700, ochocientos: 800, novecientos: 900,
};

// Limpieza básica
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^\w\s]/g, "") // quita signos
    .replace(/\s+y\s+/g, " ") // quita 'y' intermedios
    .trim();
}

export function parseSpanishNumber(text: string): number {
  const normalized = normalize(text);

  // Si contiene dígitos, los usamos directamente
  const numericMatch = normalized.match(/\d+/);
  if (numericMatch) {
    return Number(numericMatch[0]);
  }

  const words = normalized.split(/\s+/);
  let total = 0;
  let current = 0;

  for (const word of words) {
    if (UNIDADES[word] !== undefined) {
      current += UNIDADES[word];
    } else if (DIEZ_A_DIECINUEVE[word] !== undefined) {
      current += DIEZ_A_DIECINUEVE[word];
    } else if (DECENAS[word] !== undefined) {
      current += DECENAS[word];
    } else if (CENTENAS[word] !== undefined) {
      current += CENTENAS[word];
    }
  }

  total += current;

  // Si no reconocimos nada, devolvemos NaN (no null)
  return total > 0 ? total : NaN;
}
