// src/hooks/useGameCore.ts
import { useEffect, useRef, useState } from "react";
import { generateOperation } from "../core/logic/generateOperation";
import { calculateScore } from "../core/logic/calculateScore";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { useSpeechRecognition } from "./useSpeechRecognition";

export interface GameSummary {
  correct: number;
  wrong: number;
  totalScore: number;
  results: any[];
}

type Phase = "ready" | "running" | "finished";

interface UseGameCoreOptions {
  mode: "free" | "timeattack" | "custom";
  difficulty?: number;
  duration?: number; // segundos
  customOptions?: any;
  onFinish?: (summary: GameSummary) => void;
}

/**
 * Hook central del sistema de juego.
 * Contiene toda la lógica común a los modos Free, TimeAttack y Custom.
 */
export function useGameCore({
  mode,
  difficulty = 1,
  duration,
  customOptions,
  onFinish,
}: UseGameCoreOptions) {
  // 🎯 Estado general
  const [operation, setOperation] = useState(
    generateOperation(customOptions ?? { difficulty })
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(duration ?? 0);

  // 🔁 Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameStartRef = useRef<number | null>(null);
  const opStartRef = useRef<number | null>(null);
  const operationRef = useRef(operation);

  // 🎙️ Speech recognition
  const { listening, supported, micState, startListening, stopListening } =
    useSpeechRecognition(onSpeechResult);

  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

  // 🎤 Procesar resultado hablado
  function onSpeechResult(text: string) {
    const cleaned = text.replace(/^resultado\s*/, "").trim();
    const spokenNumber = parseSpanishNumber(cleaned);
    const result = Number(operationRef.current.result);

    if (!Number.isFinite(spokenNumber)) {
      setFeedback(`🤔 No entendí el número (“${cleaned}”).`);
      return;
    }

    const success = spokenNumber === result;
    setFeedback(success ? "✅ ¡Correcto!" : "❌ Incorrecto");
    setFeedbackId((id) => id + 1);
    setCorrect((c) => c + (success ? 1 : 0));
    setWrong((w) => w + (success ? 0 : 1));

    const timeTaken = opStartRef.current
      ? (Date.now() - opStartRef.current) / 1000
      : 0;

    const points = calculateScore({
      isCorrect: success,
      level: operationRef.current.levelConfigId ?? 1,
      timeTaken,
      opType: operationRef.current.opType,
      overflowCount: operationRef.current.overflowCount ?? 0,
    });

    const opData = {
      ...operationRef.current,
      given: spokenNumber,
      success,
      points,
      timeTaken,
    };

    setResults((prev) => [...prev, opData]);
    setTotalScore((p) => p + points);
    setOperation(generateOperation(customOptions ?? { difficulty }));
    opStartRef.current = Date.now();
  }

  // 🚀 Iniciar juego
  function startGame() {
    gameStartRef.current = Date.now();
    opStartRef.current = Date.now();
    setPhase("running");
    setFeedback(null);
    if (!listening) startListening();
  }

  // 🔁 Reiniciar
  function resetGame() {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);
    setCorrect(0);
    setWrong(0);
    setTotalScore(0);
    setResults([]);
    setFeedback(null);
    setPhase("ready");
    setTimeLeft(duration ?? 0);
    setOperation(generateOperation(customOptions ?? { difficulty }));
  }

  // ⏱️ Temporizador
  useEffect(() => {
    if (phase !== "running" || !duration) return;
    timerRef.current = setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - (gameStartRef.current ?? 0)) / 1000);
      const remaining = Math.max(duration - elapsedSec, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        stopListening();
        setPhase("finished");
        setFeedback("⏱️ ¡Tiempo terminado!");
        onFinish?.({ correct, wrong, totalScore, results });
      }
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, duration]);

  // ⌨️ Atajo: ESC para terminar (solo web)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTimeLeft(0);
        setPhase("finished");
        stopListening();
        onFinish?.({ correct, wrong, totalScore, results });
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
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
    listening,
    supported,
    micState,
    startGame,
    resetGame,
    startListening,
    stopListening,
  };
}
