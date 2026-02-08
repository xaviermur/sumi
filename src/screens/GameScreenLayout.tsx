import React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import SummaryPanel from "../components/SummaryPanel";
import type { ScoreRecord } from "../core/logic/recordsStorage";
import type { Operation } from "../core/types/operation";
import type { HelpSectionId } from "./HelpScreen";
import { MicState } from "@/core/types/audio";
import { GameMode } from "@/core/types/game";
import { useI18n } from "@/i18n/I18nProvider";

// Tipo del resultado de una operación en la partida
interface GameResult extends Operation {
  given: number;
  success: boolean;
  points: number;
  timeTaken?: number;
}

interface GameScreenLayoutProps {
  // Datos base
  mode: GameMode;
  phase: "ready" | "running" | "finished";
  operation: Operation;
  feedback: string | null;
  feedbackId: number;
  micState: MicState;
  listening: boolean;
  correct: number;
  wrong: number;
  elapsed: string;
  totalScore: number;
  results: GameResult[];

  // Records / resumen
  topRecords?: ScoreRecord[];
  isTop5?: boolean;

  // Callbacks
  onStartGame: () => void;
  onReset: () => void;
  onExit: () => void;
  onFinishGame?: () => void;
  startListening: () => void;
  stopListening: () => void;

  // Opcionales
  difficulty?: number;
  onIncreaseLevel?: () => void;
  onDecreaseLevel?: () => void;
  titleSummary?: string;
  durationSeconds?: number;

  onOpenHelp: (section?: HelpSectionId) => void;
}

export default function GameScreenLayout(props: GameScreenLayoutProps) {
  const {
    mode,
    phase,
    operation,
    feedback,
    feedbackId,
    micState,
    listening,
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
    onFinishGame,
    startListening,
    stopListening,
    difficulty,
    onIncreaseLevel,
    onDecreaseLevel,
    titleSummary = "⏹️ Fin de la ronda",
    durationSeconds,
    onOpenHelp,
  } = props;
  const { strings } = useI18n();

  const wrongAnswers = results.filter((r) => !r.success);
  const { width } = useWindowDimensions();

  // 👉 Si el ancho es pequeño (iPhone / iPad mini vertical):
  const useVerticalLayout = width < 820;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: useVerticalLayout ? "column" : "row",
        padding: 20,
        gap: 10,
      }}
    >
      {/* PANEL IZQUIERDO */}
      <View
        style={{
          width: useVerticalLayout ? "100%" : 260,
          flexShrink: 0,
        }}
      >
        <LeftPanel
          listening={listening}
          startListening={startListening}
          stopListening={stopListening}
          correct={correct}
          wrong={wrong}
          elapsed={elapsed}
          onReset={onReset}
          onExit={onExit}
          onFinishGame={onFinishGame}
          mode={mode}
          difficulty={difficulty}
          phase={phase}
          totalScore={totalScore}
          onStartGame={onStartGame}
          autoStartLabel={strings.game.startLabel}
          onIncreaseLevel={onIncreaseLevel}
          onDecreaseLevel={onDecreaseLevel}
          onOpenHelp={() => onOpenHelp("howToAnswer")}
        />
      </View>

      {/* PANEL DERECHO */}
      <View style={{ flex: 1 }}>
        {phase === "running" && (
          <RightPanel
            operation={operation}
            micState={micState}
            feedback={feedback}
            feedbackId={feedbackId}
            lastResult={results[results.length - 1] ?? null}
          />
        )}

        {phase === "finished" && (
          <ScrollView
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 20,
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
                  {strings.game.wrongOpsTitle}
                </Text>
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
                      ({strings.game.correctLabel}: {r.result}) —{" "}
                      {r.points > 0 ? `+${r.points}` : `${r.points}`}{" "}
                      {strings.game.points}
                    </Text>
                  </Text>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
