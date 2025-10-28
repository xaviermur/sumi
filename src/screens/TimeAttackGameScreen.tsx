import React, { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { generateOperation } from "../core/logic/generateOperation";
import { calculateScore } from "../core/logic/calculateScore";
import {
  getModeKey,
  saveRecord,
  ScoreRecord,
} from "../core/logic/recordsStorage";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import SummaryPanel from "../components/SummaryPanel";

const ROUND_SECONDS = 60;

export default function TimeAttackGameScreen({
  onExit,
  difficulty = 1,
}: {
  onExit: () => void;
  difficulty?: number;
}) {
  // 🎯 Estado general
  const [operation, setOperation] = useState(generateOperation({ difficulty }));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [phase, setPhase] = useState<"ready" | "running" | "finished">("ready");
  const [results, setResults] = useState<any[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  // 🏆 Records
  const [topRecords, setTopRecords] = useState<ScoreRecord[]>([]);
  const [isTop5, setIsTop5] = useState(false);

  // 🔁 Refs
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameStartRef = useRef<number | null>(null);
  const opStartRef = useRef<number | null>(null);
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

      const operationData = {
        ...operationRef.current,
        given: spokenNumber,
        success,
        points,
        timeTaken,
      };

      setResults((prev) => [...prev, operationData]);
      setTotalScore((prev) => prev + points);

      // 🔁 Nueva operación
      setOperation(generateOperation({ difficulty }));
      opStartRef.current = Date.now();
    });

  // 🚀 Iniciar juego
  const handleStartGame = () => {
    gameStartRef.current = Date.now();
    opStartRef.current = Date.now();
    setPhase("running");
    setTimeLeft(ROUND_SECONDS);
    if (!listening) startListening();
  };

  // 🔁 Reiniciar ronda
  const handleReset = () => {
    stopListening();
    if (timerRef.current) clearInterval(timerRef.current);
    gameStartRef.current = null;
    opStartRef.current = null;
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setResults([]);
    setTotalScore(0);
    setTopRecords([]);
    setIsTop5(false);
    setTimeLeft(ROUND_SECONDS);
    setOperation(generateOperation({ difficulty }));
    setPhase("ready");
  };

  // ⏱️ Cronómetro global
  useEffect(() => {
    if (phase !== "running") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (!gameStartRef.current) return;

      const elapsedSec = Math.floor((Date.now() - gameStartRef.current) / 1000);
      const remaining = Math.max(ROUND_SECONDS - elapsedSec, 0);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timerRef.current!);
        stopListening();
        setPhase("finished");
        setFeedback("⏱️ ¡Tiempo terminado!");
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, stopListening]);

  // 🏆 Guardar récord al finalizar
  useEffect(() => {
    if (phase !== "finished") return;

    const modeKey = getModeKey("timeattack", difficulty);
    const record = { score: totalScore, correct, wrong };

    saveRecord(modeKey, record).then(({ top, isTop5 }) => {
      setTopRecords(top);
      setIsTop5(isTop5);
    });
  }, [phase]);

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
        elapsed={`${timeLeft}s`}
        onReset={handleReset}
        onExit={onExit}
        mode="timeattack"
        difficulty={difficulty}
        phase={phase}
        totalScore={totalScore}
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
            title="⏱️ ¡Tiempo terminado!"
            correct={correct}
            wrong={wrong}
            durationSeconds={ROUND_SECONDS}
            totalScore={totalScore}
            topRecords={topRecords}
            isTop5={isTop5}
            onRetry={handleReset}
            onExit={onExit}
          />

          {/* 🧾 Listado de errores */}
          {wrongAnswers.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text
                style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}
              >
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
                      (correcto: {r.result}) —{" "}
                      {r.points > 0 ? `+${r.points}` : `${r.points}`} pts
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
