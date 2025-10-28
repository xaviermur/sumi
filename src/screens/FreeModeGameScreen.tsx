// src/screens/FreeModeGameScreen.tsx
import React, { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { generateOperation } from "../core/logic/generateOperation";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import SummaryPanel from "../components/SummaryPanel";

export default function FreeModeGameScreen({
  onExit,
  duration,
  difficulty,
}: {
  onExit: () => void;
  duration?: number;
  difficulty?: number; // 1–5
}) {
  // 🎯 Estado general
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty ?? 1);
  const [operation, setOperation] = useState(
    generateOperation({ difficulty: currentDifficulty })
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [elapsed, setElapsed] = useState(duration ? formatSec(duration) : "0:00");
  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");

  // 🧮 Resultados de la partida
  const [results, setResults] = useState<any[]>([]); // guardamos TODAS las operaciones

  // 🔁 Refs para tiempo y operación
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const operationRef = useRef(operation);

  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

  // 🎙️ Reconocimiento de voz
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

      const operationData = {
        ...operationRef.current,
        given: spokenNumber,
        success,
      };

      setResults((prev) => [...prev, operationData]); // ✅ guardamos TODAS las operaciones

      // 🔁 Nueva operación con misma dificultad
      setOperation(generateOperation({ difficulty: currentDifficulty }));
    });

  // ⬆️ / ⬇️ Dificultad
  const increaseLevel = () => {
    setCurrentDifficulty((prev) => {
      const next = Math.min(prev + 1, 5);
      setOperation(generateOperation({ difficulty: next }));
      return next;
    });
  };

  const decreaseLevel = () => {
    setCurrentDifficulty((prev) => {
      const next = Math.max(prev - 1, 1);
      setOperation(generateOperation({ difficulty: next }));
      return next;
    });
  };

  // 🔁 Reiniciar ronda
  const handleReset = () => {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = null;
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setElapsed(duration ? formatSec(duration) : "0:00");
    setOperation(generateOperation({ difficulty: currentDifficulty }));
    setResults([]); // 🧹 vaciamos resultados
    setPhase("ready");
  };

  // 🚀 Iniciar juego
  const handleStartGame = () => {
    startTimeRef.current = Date.now();
    setPhase("running");
    if (!listening) startListening();
  };

  // ⏱️ Cronómetro
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

  // 📄 Listado de errores (solo al final)
  const wrongAnswers = results.filter((r) => !r.success);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        padding: 20,
      }}
    >
      {/* PANEL IZQUIERDO */}
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
        difficulty={currentDifficulty}
        onIncreaseLevel={increaseLevel}
        onDecreaseLevel={decreaseLevel}
        phase={phase}
        onStartGame={handleStartGame}
        autoStartLabel="▶ Iniciar (activa micro)"
      />

      {/* PANEL DERECHO */}
      {phase === "running" && (
        <RightPanel
          operation={operation}
          micState={micState}
          feedback={feedback}
          feedbackId={feedbackId}
          lastResult={results[results.length - 1]}
        />
      )}

      {/* PANEL FINAL */}
      {phase === "finished" && (
        <View
          style={{
            flex: 2,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            marginLeft: 10,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <SummaryPanel
            title="⏹️ Fin de la ronda"
            correct={correct}
            wrong={wrong}
            durationSeconds={typeof duration === "number" ? duration : undefined}
            onRetry={handleReset}
            onExit={onExit}
          />

          {/* 🧾 Listado de errores */}
          {wrongAnswers.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
                ❌ Operaciones falladas
              </Text>
              <ScrollView
                style={{
                  maxHeight: 250,
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 8,
                  padding: 10,
                  backgroundColor: "#fafafa",
                }}
              >
                {wrongAnswers.map((r, i) => (
                  <Text key={i} style={{ fontSize: 18, marginBottom: 6 }}>
                    {r.num1}{" "}
                    {r.opType === "sum"
                      ? "+"
                      : r.opType === "sub"
                      ? "-"
                      : r.opType === "mul"
                      ? "×"
                      : "÷"}{" "}
                    {r.num2} = {r.given}{" "}
                    <Text style={{ color: "red" }}>
                      (correcto: {r.result})
                    </Text>
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

// 🔢 Formato del cronómetro
function formatSec(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
