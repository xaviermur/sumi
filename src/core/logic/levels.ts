import { GenerateOperationOptions } from "../types/operation";

export interface LevelConfig {
  id: number;
  name: string;
  description: string;
  color: string;
  options: GenerateOperationOptions;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Nivel 1",
    description: "Sumas básicas de un solo dígito sin acarreo.",
    color: "#A7F3D0",
    options: {
      type: ["sum"],
      range1: [0, 9],
      range2: [0, 9],
      overflowDigits: [0, 1],
      resultRange: [1, 10],
    },
  },
  {
    id: 2,
    name: "Nivel 2",
    description: "Restas simples de un solo dígito sin préstamo.",
    color: "#BFDBFE",
    options: {
      type: ["sub"],
      range1: [0, 9],
      range2: [0, 9],
      overflowDigits: [0, 1],
      resultRange: [1, 9],
    },
  },
  {
    id: 3,
    name: "Nivel 3",
    description: "Sumas y restas sencillas con resultados hasta 20.",
    color: "#FDE68A",
    options: {
      type: ["sum", "sub"],
      range1: [0, 9],
      range2: [0, 9],
      overflowDigits: [0, 0],
      resultRange: [1, 20],
    },
  },
  {
    id: 4,
    name: "Nivel 4",
    description: "Operaciones con un acarreo o préstamo sencillo.",
    color: "#FDBA74",
    options: {
      type: ["sum", "sub"],
      range1: [0, 9],
      range2: [0, 9],
      overflowDigits: [0, 1],
      resultRange: [5, 20],
    },
  },
  {
    id: 5,
    name: "Nivel 5",
    description: "Operaciones con números de dos cifras pequeñas.",
    color: "#FCA5A5",
    options: {
      type: ["sum", "sub"],
      range1: [10, 20],
      range2: [0, 20],
      overflowDigits: [0, 1],
      resultRange: [5, 20],
    },
  },
  {
    id: 6,
    name: "Nivel 6",
    description: "Sumas y restas hasta 25, manteniendo baja dificultad.",
    color: "#C7D2FE",
    options: {
      type: ["sum", "sub"],
      range1: [10, 25],
      range2: [0, 25],
      overflowDigits: [0, 1],
      resultRange: [5, 25],
    },
  },
  {
    id: 7,
    name: "Nivel 7",
    description: "Operaciones hasta 50, con múltiplos de 10 en el segundo número.",
    color: "#86EFAC",
    options: {
      type: ["sum", "sub"],
      range1: [10, 50],
      range2: [10, 50],
      overflowDigits: [0, 1],
      resultRange: [5, 30],
      multipleOf2: 10,
    },
  },
  {
    id: 8,
    name: "Nivel 8",
    description: "Operaciones con múltiplos de 5 y resultados hasta 30.",
    color: "#93C5FD",
    options: {
      type: ["sum", "sub"],
      range1: [10, 50],
      range2: [10, 50],
      overflowDigits: [0, 1],
      resultRange: [10, 30],
      multipleOf2: 5,
    },
  },
  {
    id: 9,
    name: "Nivel 9",
    description: "Sumas y restas con múltiplos de 5, rango ampliado hasta 50.",
    color: "#E9D5FF",
    options: {
      type: ["sum", "sub"],
      range1: [10, 50],
      range2: [10, 50],
      overflowDigits: [0, 1],
      resultRange: [10, 50],
      multipleOf2: 5,
    },
  },
  {
    id: 10,
    name: "Nivel 10",
    description: "Operaciones mixtas con resultados moderados (hasta 50).",
    color: "#FCD34D",
    options: {
      type: ["sum", "sub"],
      range1: [10, 75],
      range2: [10, 75],
      overflowDigits: [0, 1],
      resultRange: [10, 50],
    },
  },
  {
    id: 11,
    name: "Nivel 11",
    description: "Operaciones más amplias con dos cifras, resultado hasta 75.",
    color: "#FCA5A5",
    options: {
      type: ["sum", "sub"],
      range1: [10, 99],
      range2: [10, 99],
      overflowDigits: [0, 1],
      resultRange: [10, 75],
    },
  },
  {
    id: 12,
    name: "Nivel 12",
    description: "Sumas y restas de dos cifras con dificultad alta.",
    color: "#A5B4FC",
    options: {
      type: ["sum", "sub"],
      range1: [10, 99],
      range2: [10, 99],
      overflowDigits: [0, 1],
      resultRange: [10, 99],
    },
  },
  {
    id: 13,
    name: "Nivel 13",
    description: "Operaciones de tres cifras: el desafío final.",
    color: "#60A5FA",
    options: {
      type: ["sum", "sub"],
      range1: [10, 999],
      range2: [10, 999],
      overflowDigits: [0, 2],
      resultRange: [50, 999],
    },
  },
];

/**
 * Devuelve la configuración de nivel (LevelConfig) según el id.
 * Si no se encuentra, lanza un error para evitar inconsistencias silenciosas.
 */
export function getLevelConfig(id: number): LevelConfig {
  const level = LEVELS.find((lvl) => lvl.id === id);
  if (!level) throw new Error(`LevelConfig con id=${id} no encontrado`);
  return level;
}
