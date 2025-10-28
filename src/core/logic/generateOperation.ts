import { GenerateOperationOptions, OperationType } from "../types/operation";
import { difficultyMap } from "../config/difficultyMap";
import { getLevelConfig } from "./levels"; // <-- función que devuelve un LevelConfig por id

export function generateOperation(
  options: GenerateOperationOptions & { difficulty?: number } = {}
) {
  const { difficulty, ...rest } = options;

  // Si se pasa una dificultad, elegimos un LevelConfig aleatorio de esa dificultad
  let levelConfig: GenerateOperationOptions | null = null;
  let selectedLevelConfigId: number | null = null;

  if (difficulty) {
    const availableLevels = difficultyMap[difficulty];
    selectedLevelConfigId =
      availableLevels[Math.floor(Math.random() * availableLevels.length)];
    
    // 💡 usamos solo la parte de opciones
    levelConfig = getLevelConfig(selectedLevelConfigId).options;
  }

  // Combinamos los valores: LevelConfig tiene prioridad, luego options, luego defaults
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

  // Seleccionamos aleatoriamente uno de los tipos permitidos
  const opType: OperationType = type[Math.floor(Math.random() * type.length)];

  const generateNumber = (range: [number, number], multipleOf: number | null) => {
    const [min, max] = range;
    let n = Math.floor(Math.random() * (max - min + 1)) + min;

    if (multipleOf) {
      n -= n % multipleOf;
      if (n < min) n += multipleOf;
      if (n > max) n -= multipleOf;
    }

    return n;
  };

  let num1, num2, result;

  for (let i = 0; i < 1000; i++) {
    num1 = generateNumber(range1, multipleOf1);
    num2 = generateNumber(range2, multipleOf2);

    if (opType === "sub" && num2 > num1) continue;

    switch (opType) {
      case "sum":
        result = num1 + num2;
        break;
      case "sub":
        result = num1 - num2;
        break;
      case "mul":
        result = num1 * num2;
        break;
      case "div":
        if (num2 === 0 || num1 % num2 !== 0) continue;
        result = num1 / num2;
        break;
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

    if (overflowCount >= overflowDigits[0] && overflowCount <= overflowDigits[1]) {
      return {
        num1,
        num2,
        result,
        opType,
        overflowCount,
        levelConfigId: selectedLevelConfigId,
        difficulty: difficulty ?? null,
      };
    }
  }

  console.error("generateOperation: No se pudo generar una operación válida con los parámetros dados", {
    type,
    range1,
    range2,
    overflowDigits,
    resultRange,
  });
  throw new Error("No se pudo generar una operación válida con los parámetros dados");
}
