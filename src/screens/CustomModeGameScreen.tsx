// src/screens/CustomModeGameScreen.tsx
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { generateOperation } from "../core/logic/generateOperation";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import SummaryPanel from "../components/SummaryPanel";

export default function CustomModeGameScreen({
  onExit,
  duration,
  customOptions,
}: {
  onExit: () => void;
  duration?: number;
  customOptions: any;
}) {
  const [operation, setOperation] = useState(generateOperation(customOptions));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [elapsed, setElapsed] = useState(duration ? formatSec(duration) : "0:00");
  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");

  // 👉 añade esto
  const [lastResult, setLastResult] = useState<any>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const operationRef = useRef(operation);

  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

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
      setFeedbackId((id) => id + 1);
      setCorrect((c) => c + (success ? 1 : 0));
      setWrong((w) => w + (success ? 0 : 1));

      // 👉 guardamos el último intento para RightPanel
      const opData = { ...operationRef.current, given: spokenNumber, success };
      setLastResult(opData);

      setOperation(generateOperation(customOptions));
    });

  const handleStartGame = () => {
    startTimeRef.current = Date.now();
    setPhase("running");
    if (!listening) startListening();
  };

  useEffect(() => {
    if (phase !== "running") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedSec = Math.floor((Date.now() - startTimeRef.current) / 1000);

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
  }, [phase, duration, stopListening]);

  const handleReset = () => {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = null;
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setElapsed(duration ? formatSec(duration) : "0:00");
    setOperation(generateOperation(customOptions));
    setLastResult(null); // 👉 resetea también
    setPhase("ready");
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
        mode="custom"
        phase={phase}
        onStartGame={handleStartGame}
        autoStartLabel="▶ Iniciar (activa micro)"
      />

      {phase === "running" && (
        <RightPanel
          operation={operation}
          micState={micState}
          feedback={feedback}
          feedbackId={feedbackId}
          lastResult={lastResult}   // 👈 ahora sí, cumple RightPanelProps
        />
      )}

      {phase === "finished" && (
        <SummaryPanel
          title="⏹️ Fin del modo personalizado"
          correct={correct}
          wrong={wrong}
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
