import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { generateOperation } from "../core/logic/generateOperation";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { calculateScore } from "../core/logic/calculateScore";
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
  const [lastResult, setLastResult] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  // 🔁 Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameStartRef = useRef<number | null>(null); // global
  const opStartRef = useRef<number | null>(null);   // operación
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

      // ⏱️ tiempo individual de operación
      const timeTaken = opStartRef.current
        ? (Date.now() - opStartRef.current) / 1000
        : 0;

      // 💯 puntuación
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

      setLastResult(opData);
      setResults((prev) => [...prev, opData]);
      setTotalScore((prev) => prev + points);

      // 🔁 siguiente operación
      setOperation(generateOperation(customOptions));
      opStartRef.current = Date.now(); // solo resetea la operación
    });

  // 🚀 iniciar partida
  const handleStartGame = () => {
    gameStartRef.current = Date.now();
    opStartRef.current = Date.now();
    setPhase("running");
    if (!listening) startListening();
  };

  // ⏱️ cronómetro global
  useEffect(() => {
    if (phase !== "running") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (!gameStartRef.current) return;
      const elapsedSec = Math.floor((Date.now() - gameStartRef.current) / 1000);

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

  // 🔁 reiniciar ronda
  const handleReset = () => {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);
    gameStartRef.current = null;
    opStartRef.current = null;
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setElapsed(duration ? formatSec(duration) : "0:00");
    setOperation(generateOperation(customOptions));
    setLastResult(null);
    setResults([]);
    setTotalScore(0);
    setPhase("ready");
  };

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
        mode="custom"
        phase={phase}
        onStartGame={handleStartGame}
        autoStartLabel="▶ Iniciar (activa micro)"
        totalScore={totalScore}
      />

      {/* PANEL DERECHO */}
      {phase === "running" && (
        <RightPanel
          operation={operation}
          micState={micState}
          feedback={feedback}
          feedbackId={feedbackId}
          lastResult={lastResult}
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
            title="⏹️ Fin del modo personalizado"
            correct={correct}
            wrong={wrong}
            totalScore={totalScore}
            durationSeconds={typeof duration === "number" ? duration : undefined}
            onRetry={handleReset}
            onExit={onExit}
          />

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
                      (correcto: {r.result}) — {r.points > 0 ? `+${r.points}` : `${r.points}`} pts
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

function formatSec(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
