// FreeModeGameScreen.tsx
import React, { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { generateOperation } from "../core/logic/generateOperation";
import { LEVELS } from "../core/logic/levels";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import SummaryPanel from "../components/SummaryPanel";

export default function FreeModeGameScreen({
  onExit,
  duration,
}: {
  onExit: () => void;
  duration?: number; // si lo pasas, contamos hacia abajo; si no, hacia arriba
}) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [operation, setOperation] = useState(
    generateOperation(LEVELS[levelIndex].options)
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(duration ? formatSec(duration) : "0:00");
  const [lastResult, setLastResult] = useState<any>(null);

  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const operationRef = useRef(operation);

  useEffect(() => { operationRef.current = operation; }, [operation]);

  const { listening, supported, micState, startListening, stopListening } =
    useSpeechRecognition((text) => {
      const cleaned = text.replace(/^resultado\s*/, "").trim();
      const spokenNumber = parseSpanishNumber(cleaned);
      const result = Number(operationRef.current.result);

      if (!Number.isFinite(spokenNumber)) {
        setFeedback(`🤔 No entendí el número (“${cleaned}”).`);
        return;
      }

      const success = spokenNumber === result;
      setFeedback(success ? "✅ ¡Correcto!" : "❌ Incorrecto");
      setCorrect((c) => c + (success ? 1 : 0));
      setWrong((w) => w + (success ? 0 : 1));
      setLastResult({ ...operationRef.current, given: spokenNumber, success });
      setOperation(generateOperation(LEVELS[levelIndex].options));
    });

  // ⏱️ Cronómetro: SOLO corre en phase === "running"
  useEffect(() => {
    if (phase !== "running") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (!startTime) setStartTime(new Date());

    timerRef.current = setInterval(() => {
      if (!startTime) return;

      const elapsedSec = Math.floor((Date.now() - startTime.getTime()) / 1000);

      if (duration) {
        const remaining = Math.max(duration - elapsedSec, 0);
        setElapsed(formatSec(remaining));
        if (remaining === 0) {
          clearInterval(timerRef.current!);
          stopListening();
          setPhase("finished");
          setFeedback("⏱️ ¡Tiempo terminado!");
        }
      } else {
        setElapsed(formatSec(elapsedSec));
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, startTime, duration, stopListening]);

  const handleReset = () => {
    stopListening();
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setStartTime(null);
    setElapsed(duration ? formatSec(duration) : "0:00");
    setOperation(generateOperation(LEVELS[levelIndex].options));
    setLastResult(null);
    setPhase("ready");
  };

  // cambiar nivel en pre-partida o en marcha
  const increaseLevel = () => {
    setLevelIndex((prev) => {
      const next = Math.min(prev + 1, LEVELS.length - 1);
      setOperation(generateOperation(LEVELS[next].options));
      return next;
    });
  };
  const decreaseLevel = () => {
    setLevelIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      setOperation(generateOperation(LEVELS[next].options));
      return next;
    });
  };

  // ▶ Iniciar juego: pasar a running y arrancar micro automáticamente
  const handleStartGame = () => {
    setPhase("running");
    setStartTime(new Date());
    if (!listening) startListening();
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: "#f2f2f2", padding: 20 }}>
      <LeftPanel
        listening={listening}
        supported={supported}
        startListening={startListening}
        stopListening={stopListening}
        correct={correct}
        wrong={wrong}
        elapsed={elapsed}
        onReset={handleReset}
        onExit={onExit}
        mode="free"
        level={LEVELS[levelIndex]}
        onIncreaseLevel={increaseLevel}
        onDecreaseLevel={decreaseLevel}
        phase={phase}
        onStartGame={handleStartGame}
        autoStartLabel="▶ Iniciar (activa micro)"
      />

      {/* ready -> nada */}
      {phase === "running" && (
        <RightPanel
          operation={operation}
          micState={micState}
          feedback={feedback}
          lastResult={lastResult}
        />
      )}

      {phase === "finished" && (
        <SummaryPanel
          title="⏹️ Fin de la ronda"
          correct={correct}
          wrong={wrong}
          // si duration está definido, mostramos esa duración total
          durationSeconds={typeof duration === "number" ? duration : undefined}
          onRetry={handleReset}
          onExit={onExit}
        />
      )}
    </View>
  );
}

function formatSec(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
