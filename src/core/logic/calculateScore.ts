import { OperationType } from "../types/operation";

function idealTimeForOperation({
  type,
  hasCarry,
  level,
}: {
  type: OperationType;
  hasCarry?: boolean;
  level: number;
}) {
  let base = 5;

  switch (type) {
    case "sum":
      base = hasCarry ? 8 : 4;
      break;
    case "sub":
      base = hasCarry ? 10 : 6;
      break;
    case "mul":
      base = level < 6 ? 5 : 8;
      break;
    case "div":
      base = level < 6 ? 7 : 10;
      break;
  }

  const adjustment = 1 + Math.floor((level - 1) / 3) * 0.1;
  return Math.round(base * adjustment * 10) / 10;
}

export function calculateScore({
  isCorrect,
  level,
  timeTaken,
  opType,
  overflowCount,
}: {
  isCorrect: boolean;
  level: number;
  timeTaken: number;
  opType: OperationType;
  overflowCount: number;
}) {
  const levelMultipliers = [
    1.0, 1.1, 1.2, 1.3, 1.4, 1.6, 1.8, 2.0, 2.3, 2.6, 3.0, 3.5, 4.0,
  ];

  const basePoints = 100;
  const multiplier = levelMultipliers[level - 1] ?? 1.0;
  const ideal = idealTimeForOperation({
    type: opType,
    hasCarry: overflowCount > 0,
    level,
  });
  const speedFactor = Math.max(0.3, 1 - timeTaken / ideal);

  if (isCorrect) {
    return Math.round(basePoints * multiplier * speedFactor);
  } else {
    const penalty = Math.round(40 * multiplier);
    return -penalty;
  }
}
