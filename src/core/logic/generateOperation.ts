import { GenerateOperationOptions, OperationType } from "../types/operation";
import { difficultyMap } from "../config/difficultyMap";
import { getLevelConfig } from "./levels";

export function generateOperation(
  options: GenerateOperationOptions & { difficulty?: number } = {}
) {
  const { difficulty, ...rest } = options;

  let levelConfig: GenerateOperationOptions | null = null;
  let selectedLevelConfigId: number | null = null;

  if (difficulty) {
    const availableLevels = difficultyMap[difficulty];
    selectedLevelConfigId =
      availableLevels[Math.floor(Math.random() * availableLevels.length)];
    levelConfig = getLevelConfig(selectedLevelConfigId).options;
  }

  const {
    type = ["sum", "sub"],
    range1 = [1, 20],
    range2 = [1, 20],
    overflowDigits = [0, 1],
    multipleOf1 = null,
    multipleOf2 = null,
    resultRange = [1, 20],
  } = {
    ...rest,
    ...(levelConfig || {}),
  };

  const opType: OperationType = type[Math.floor(Math.random() * type.length)];
  const numDigits = (n: number) => Math.abs(n).toString().length;

  const generateNumber = (range: [number, number], multipleOf: number | null) => {
    const [min, max] = range;
    let n = Math.floor(Math.random() * (max - min + 1)) + min;

    if (multipleOf && multipleOf <= (max - min)) {
      n -= n % multipleOf;
      if (n < min) n += multipleOf;
      if (n > max) n -= multipleOf;
    }
    return n;
  };

  let candidate = null;

  for (let i = 0; i < 1000; i++) {
    const num1 = generateNumber(range1, multipleOf1);
    const num2 = generateNumber(range2, multipleOf2);

    if (opType === "sub" && num2 > num1) continue;
    if (opType === "div" && (num2 === 0 || num1 % num2 !== 0)) continue;

    let result: number;
    switch (opType) {
      case "sum": result = num1 + num2; break;
      case "sub": result = num1 - num2; break;
      case "mul": result = num1 * num2; break;
      case "div": result = num1 / num2; break;
    }

    if (result < resultRange[0] || result > resultRange[1]) continue;

    const a = num1.toString().padStart(Math.max(num1.toString().length, num2.toString().length), "0");
    const b = num2.toString().padStart(a.length, "0");
    let overflowCount = 0;

    if (opType === "sum" || opType === "sub") {
      for (let j = 0; j < a.length; j++) {
        const da = +a[a.length - 1 - j];
        const db = +b[b.length - 1 - j];
        if (opType === "sum" && da + db >= 10) overflowCount++;
        if (opType === "sub" && da < db) overflowCount++;
      }
    }

    // Validación de overflow flexible
    const [minOvf, maxOvf] = overflowDigits;
    const maxOverflowPossible =
      opType === "sum" ? Math.max(numDigits(num1), numDigits(num2)) : Math.max(0, numDigits(num2) - 1);

    if (overflowCount >= Math.min(minOvf, maxOverflowPossible) &&
        overflowCount <= Math.min(maxOvf, maxOverflowPossible)) {
      candidate = { num1, num2, result, opType, overflowCount };
      break;
    }
  }

  if (!candidate) {
    // 🔄 fallback: relajar condiciones para no romper el flujo del juego
    console.warn("⚠️ generateOperation: no válida, usando fallback relajado", {
      type,
      range1,
      range2,
      overflowDigits,
      resultRange,
    });

    const num1 = generateNumber(range1, multipleOf1);
    const num2 = generateNumber(range2, multipleOf2);
    const result =
      opType === "sub" ? Math.abs(num1 - num2)
      : opType === "sum" ? num1 + num2
      : opType === "mul" ? num1 * num2
      : num2 === 0 ? 0 : Math.floor(num1 / num2);

    return {
      num1,
      num2,
      result,
      opType,
      overflowCount: 0,
      levelConfigId: selectedLevelConfigId,
      difficulty: difficulty ?? null,
      fallback: true,
    };
  }

  return {
    ...candidate,
    levelConfigId: selectedLevelConfigId,
    difficulty: difficulty ?? null,
  };
}
