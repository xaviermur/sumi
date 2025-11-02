// src/screens/GameScreenLayout.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import SummaryPanel from "../components/SummaryPanel";
import type { ScoreRecord } from "../core/logic/recordsStorage";
import type { MicState } from "../hooks/useSpeechRecognition";
import { HelpSectionId } from "./HelpScreen";

interface GameScreenLayoutProps {
  // 🔹 Datos base del juego
  mode: "free" | "timeattack" | "custom";
  phase: "ready" | "running" | "finished";
  operation: any;
  feedback: string | null;
  feedbackId: number;
  micState: MicState;
  listening: boolean;
  supported: boolean;
  correct: number;
  wrong: number;
  elapsed: string; // mostrar el tiempo
  totalScore: number;
  results: any[];
  topRecords?: ScoreRecord[];
  isTop5?: boolean;

  // 🔹 Funciones
  onStartGame: () => void;
  onReset: () => void;
  onExit: () => void;
  startListening: () => void;
  stopListening: () => void;

  // 🔹 Opcionales
  difficulty?: number;
  onIncreaseLevel?: () => void;
  onDecreaseLevel?: () => void;
  titleSummary?: string;
  durationSeconds?: number;

  onOpenHelp: (section?: HelpSectionId) => void;
}

export default function GameScreenLayout({
  mode,
  phase,
  operation,
  feedback,
  feedbackId,
  micState,
  listening,
  supported,
  correct,
  wrong,
  elapsed,
  totalScore,
  results,
  topRecords,
  isTop5,
  onStartGame,
  onReset,
  onExit,
  startListening,
  stopListening,
  difficulty,
  onIncreaseLevel,
  onDecreaseLevel,
  titleSummary = "⏹️ Fin de la ronda",
  durationSeconds,
  onOpenHelp,
}: GameScreenLayoutProps) {
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
      {/* 🧩 PANEL IZQUIERDO */}
      <LeftPanel
        listening={listening}
        supported={supported}
        startListening={startListening}
        stopListening={stopListening}
        correct={correct}
        wrong={wrong}
        elapsed={elapsed}
        onReset={onReset}
        onExit={onExit}
        mode={mode}
        difficulty={difficulty}
        phase={phase}
        totalScore={totalScore}
        onStartGame={onStartGame}
        autoStartLabel="▶ Iniciar (activa micro)"
        onIncreaseLevel={onIncreaseLevel}
        onDecreaseLevel={onDecreaseLevel}
        onOpenHelp={() => onOpenHelp("howToAnswer")}
      />

      {/* 🧮 PANEL DERECHO */}
      {phase === "running" && (
        <RightPanel
          operation={operation}
          micState={micState}
          feedback={feedback}
          feedbackId={feedbackId}
          lastResult={results[results.length - 1]}
        />
      )}

      {/* 🧾 PANEL FINAL */}
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
            title={titleSummary}
            correct={correct}
            wrong={wrong}
            durationSeconds={durationSeconds}
            totalScore={totalScore}
            topRecords={topRecords}
            isTop5={isTop5}
            onRetry={onReset}
            onExit={onExit}
          />

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
