// src/screens/TimeAttackGameScreen.tsx
import React, { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { generateOperation } from "../core/logic/generateOperation";
import { LEVELS } from "../core/logic/levels";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import SummaryPanel from "../components/SummaryPanel";

const ROUND_SECONDS = 60;

export default function TimeAttackGameScreen({ onExit }: { onExit: () => void }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const levelIndexRef = useRef(levelIndex);
  useEffect(() => {
    levelIndexRef.current = levelIndex;
  }, [levelIndex]);

  const [operation, setOperation] = useState(
    generateOperation(LEVELS[levelIndex].options)
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [lastResult, setLastResult] = useState<any>(null);
  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      setFeedbackId((id) => id + 1); // 👈 esto fuerza animación cada vez      
      setCorrect((c) => c + (success ? 1 : 0));
      setWrong((w) => w + (success ? 0 : 1));

      setLastResult({
        ...operationRef.current,
        given: spokenNumber,
        success,
      });

      // ✅ usar el nivel actual desde la referencia
      setOperation(generateOperation(LEVELS[levelIndexRef.current].options));
    });

  // ⏱️ cuenta regresiva SOLO en running
  useEffect(() => {
    if (phase !== "running") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          stopListening();
          setPhase("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, stopListening]);

  const handleReset = () => {
    stopListening();
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setTimeLeft(ROUND_SECONDS);
    setOperation(generateOperation(LEVELS[levelIndexRef.current].options));
    setLastResult(null);
    setPhase("ready");
  };

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

  const handleStartGame = () => {
    setPhase("running");
    if (!listening) startListening(); // auto-encender micro al iniciar
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        padding: 20,
      }}
    >
      <LeftPanel
        listening={listening}
        supported={supported}
        startListening={startListening}
        stopListening={stopListening}
        correct={correct}
        wrong={wrong}
        elapsed={`${timeLeft}s`} // en ready mostramos "60s"
        onReset={handleReset}
        onExit={onExit}
        mode="timeattack"
        level={LEVELS[levelIndex]}
        onIncreaseLevel={increaseLevel}
        onDecreaseLevel={decreaseLevel}
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
          lastResult={lastResult}
        />
      )}

      {phase === "finished" && (
        <SummaryPanel
          title="⏱️ ¡Tiempo terminado!"
          correct={correct}
          wrong={wrong}
          durationSeconds={ROUND_SECONDS}
          onRetry={handleReset}
          onExit={onExit}
        />
      )}
    </View>
  );
}
