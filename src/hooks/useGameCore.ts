// src/hooks/useGameCore.ts
import { useEffect, useRef, useState } from "react";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { generateOperation } from "../core/logic/generateOperation";
import { calculateScore } from "../core/logic/calculateScore";
import { MicState, useSpeechRecognition } from "./useSpeechRecognition";

import type { Operation, OperationType, GenerateOperationOptions } from "../core/types/operation";

// --------------------------------------------------
// Tipos propios del hook
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
  mode: "free" | "timeattack" | "custom";
  difficulty?: number;
  duration?: number;
  customOptions?: GenerateOperationOptions;
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
  startListening: () => void;
  stopListening: () => void;
  resetGame: () => void;
}

// --------------------------------------------------
// Hook principal
// --------------------------------------------------

export function useGameCore({
  mode,
  difficulty = 1,
  duration,
  customOptions,
  onFinish,
}: UseGameCoreOptions): UseGameCoreReturn {
  const [operation, setOperation] = useState<Operation>(
    generateOperation(customOptions ?? { difficulty })
  );

  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");
  const [correct, setCorrect] = useState<number>(0);
  const [wrong, setWrong] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(duration ?? 0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opStartRef = useRef<number>(Date.now());

  const opLockRef = useRef<boolean>(false); // evita respuestas repetidas
  const opCooldownRef = useRef<boolean>(false); // ignora ruido tras nueva operación

  // 🎤 reconocimiento
  const { startListening, stopListening, listening, micState } =
    useSpeechRecognition(handleStableSpeech);

  // --------------------------------------------------
  // Llega texto final estable
  // --------------------------------------------------
  function handleStableSpeech(text: string) {
    console.log("💬 Respuesta recibida:", text);

    if (phase !== "running") return;
    if (opCooldownRef.current) return;
    if (opLockRef.current) return;

    const number = Number(text);
    if (!Number.isFinite(number)) return;

    opLockRef.current = true;

    // 🛑 DETENER AQUÍ el reconocimiento
    setTimeout(() => stopListening(), 0);
    processAnswer(number);
  }


  // --------------------------------------------------
  // Procesar respuesta
  // --------------------------------------------------
  function processAnswer(num: number) {
    console.log("🎮 processAnswer num =", num, "esperado =", operation.result);
    const expected = operation.result;
    const ok = num === expected;

    setFeedback(ok ? "✅ ¡Correcto!" : `❌ Incorrecto (${expected})`);
    setFeedbackId((id) => id + 1);

    if (ok) setCorrect((n) => n + 1);
    else setWrong((n) => n + 1);

    const timeTaken = (Date.now() - opStartRef.current) / 1000;

    const points = calculateScore({
      isCorrect: ok,
      level: (customOptions?.levelConfigId ?? difficulty) ?? 1,
      timeTaken,
      opType: operation.opType,
      overflowCount: (customOptions?.overflowDigits?.[0] ?? 0),
    });

    const entry: ResultEntry = {
      ...operation,
      given: num,
      success: ok,
      points,
      timeTaken,
    };

    setResults((prev) => [...prev, entry]);
    setTotalScore((p) => p + points);

    nextOperation();
  }

  // --------------------------------------------------
  // Siguiente operación
  // --------------------------------------------------
  function nextOperation() {
    console.log("🎮 nextOperation");

    opLockRef.current = false;
    opCooldownRef.current = true;

    // solo generamos operación nueva
    setOperation(generateOperation(customOptions ?? { difficulty }));

    // cooldown para ignorar ruido anterior
    setTimeout(() => {
      opCooldownRef.current = false;
    }, 250); // 250ms es suficiente
  }


  // --------------------------------------------------
  // Start game
  // --------------------------------------------------
  function startGame() {
    setPhase("running");
    setFeedback(null);
    opStartRef.current = Date.now();
    startListening();
  }

  // --------------------------------------------------
  // Reset
  // --------------------------------------------------
  function resetGame() {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);

    setPhase("ready");
    setOperation(generateOperation(customOptions ?? { difficulty }));
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setResults([]);
    setTotalScore(0);
    setTimeLeft(duration ?? 0);
  }

  // --------------------------------------------------
  // Temporizador
  // --------------------------------------------------
  useEffect(() => {
    if (phase !== "running" || !duration) return;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - opStartRef.current) / 1000);
      const rem = duration - elapsed;

      setTimeLeft(rem);

      if (rem <= 0) {
        clearInterval(timerRef.current!);
        stopListening();
        setPhase("finished");
        onFinish?.({ correct, wrong, totalScore, results });
      }
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") return;

    opStartRef.current = Date.now();
  }, [operation]);

  // Cuando React ya ha pintado la nueva operación → ahora sí arrancamos micro
  useEffect(() => {
    if (phase !== "running") return;

    console.log("🎮 Nueva operación pintada → startListening()");
    startListening();
  }, [operation]);

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
    resetGame,
  };
}
