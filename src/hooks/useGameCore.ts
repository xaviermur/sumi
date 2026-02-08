// src/hooks/useGameCore.ts
import { useEffect, useRef, useState } from "react";
import { generateOperation } from "../core/logic/generateOperation";
import { calculateScore } from "../core/logic/calculateScore";
import { useWhisperRecognition } from "./useWhisperRecognition";

import type { Operation, OperationType } from "../core/types/operation";
import type { GameLanguage } from "../core/types/game";
import type { MicState } from "@/core/types/audio";
import { parseNumberMultilang } from "../utils/parseNumberMultilang";

// --------------------------------------------------
// Tipos
// --------------------------------------------------

export interface ResultEntry extends Operation {
  given: number;
  success: boolean;
  points: number;
  timeTaken: number;
}

export interface GameSummary {
  correct: number;
  wrong: number;
  totalScore: number;
  results: ResultEntry[];
}

export interface UseGameCoreOptions {
  difficulty?: number;
  duration?: number;
  operationTypes?: OperationType[];
  language?: GameLanguage;
  onFinish?: (summary: GameSummary) => void;
}

export interface UseGameCoreReturn {
  operation: Operation;
  feedback: string | null;
  feedbackId: number;
  correct: number;
  wrong: number;
  totalScore: number;
  results: ResultEntry[];
  phase: "ready" | "running" | "finished";
  timeLeft: number;
  micState: MicState;
  listening: boolean;
  startGame: () => void;
  startListening: () => void;   // sigue existiendo por compatibilidad UI
  stopListening: () => void;
  finishGame: () => void;
  resetGame: () => void;
}

// --------------------------------------------------
// Hook principal
// --------------------------------------------------

export function useGameCore({
  difficulty = 1,
  duration,
  operationTypes,
  language = "es",
  onFinish,
}: UseGameCoreOptions): UseGameCoreReturn {

  const [operation, setOperation] = useState<Operation>(
    generateOperation({ difficulty, type: operationTypes })
  );

  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState(duration ?? 0);

  const timerRef = useRef<number | null>(null);
  const opStartRef = useRef(Date.now());
  const statsRef = useRef<GameSummary>({
    correct: 0,
    wrong: 0,
    totalScore: 0,
    results: [],
  });

  const opLockRef = useRef(false);      // evita dobles respuestas
  const opCooldownRef = useRef(false);  // evita ruido después de nueva operación

  // --------------------------------------------------
  // Whisper
  // --------------------------------------------------
  const {
    startListening,
    stopListening,
    micState,
    listening,
  } = useWhisperRecognition(handleStableSpeech, language);

  // --------------------------------------------------
  // CUANDO LLEGA TEXTO FINAL (Whisper)
  // --------------------------------------------------
  function handleStableSpeech(text: string) {
    if (phase !== "running") return;
    if (opCooldownRef.current) return;
    if (opLockRef.current) return;

    const number = parseNumberMultilang(text, language);
    if (number == null || Number.isNaN(number)) return;

    opLockRef.current = true;
    stopListening(); // paramos Whisper antes de procesar

    processAnswer(number);
  }

  // --------------------------------------------------
  // Procesar respuesta
  // --------------------------------------------------
  function processAnswer(num: number) {
    const expected = operation.result;
    const ok = num === expected;

    setFeedback(ok ? "✅ ¡Correcto!" : `❌ Incorrecto (${expected})`);
    setFeedbackId(id => id + 1);

    if (ok) setCorrect(n => n + 1);
    else setWrong(n => n + 1);

    const timeTaken = (Date.now() - opStartRef.current) / 1000;

    const points = calculateScore({
      isCorrect: ok,
      level: difficulty,
      timeTaken,
      opType: operation.opType,
      overflowCount: operation.overflowCount ?? 0,
    });

    const entry: ResultEntry = {
      ...operation,
      given: num,
      success: ok,
      points,
      timeTaken,
    };

    setResults(prev => [...prev, entry]);
    setTotalScore(prev => prev + points);

    nextOperation();
  }

  // --------------------------------------------------
  // Nueva operación
  // --------------------------------------------------
  function nextOperation() {
    opLockRef.current = false;
    opCooldownRef.current = true;

    setOperation(generateOperation({ difficulty, type: operationTypes }));

    setTimeout(() => {
      opCooldownRef.current = false;
    }, 250);
  }

  // --------------------------------------------------
  // Iniciar juego
  // --------------------------------------------------
  function startGame() {
    setPhase("running");
    setFeedback(null);
    opStartRef.current = Date.now();
    startListening();
  }

  // --------------------------------------------------
  // Finalizar juego (manual o por tiempo)
  // --------------------------------------------------
  function finishGame() {
    if (phase !== "running") return;
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    stopListening();
    setPhase("finished");
    const snapshot = statsRef.current;
    onFinish?.({
      correct: snapshot.correct,
      wrong: snapshot.wrong,
      totalScore: snapshot.totalScore,
      results: snapshot.results,
    });
  }

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  function resetGame() {
    stopListening();
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }

    setPhase("ready");
    setOperation(generateOperation({ difficulty, type: operationTypes }));
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setResults([]);
    setTotalScore(0);
    setTimeLeft(duration ?? 0);
  }

  // --------------------------------------------------
  // Temporizador (si aplica)
  // --------------------------------------------------
  useEffect(() => {
    if (phase !== "running" || !duration) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - opStartRef.current) / 1000);
      const rem = duration - elapsed;

      setTimeLeft(Math.max(0, rem));

      if (rem <= 0) {
        finishGame();
      }
    }, 1000) as unknown as number;

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [phase]);

  // Reiniciar cronómetro cada vez que cambia la operación
  useEffect(() => {
    if (phase === "running") {
      opStartRef.current = Date.now();
    }
  }, [operation]);

  // Arrancar Whisper AUTOMÁTICAMENTE cuando la operación se pinta en pantalla
  useEffect(() => {
    if (phase !== "running") return;
    startListening();
  }, [operation]);

  useEffect(() => {
    statsRef.current = { correct, wrong, totalScore, results };
  }, [correct, wrong, totalScore, results]);

  return {
    operation,
    feedback,
    feedbackId,
    correct,
    wrong,
    totalScore,
    results,
    phase,
    timeLeft,
    micState,
    listening,
    startGame,
    startListening,
    stopListening,
    finishGame,
    resetGame,
  };
}
