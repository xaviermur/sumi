import React, { useEffect } from "react";
import { useGameCore } from "../hooks/useGameCore";
import GameScreenLayout from "./GameScreenLayout";
import { HelpSectionId } from "./HelpScreen";

interface CustomModeGameScreenProps {
  onExit: () => void;
  duration?: number;
  customOptions: any;
  onOpenHelp: (section?: HelpSectionId) => void;
}

export default function CustomModeGameScreen({
  onExit,
  duration,
  customOptions,
  onOpenHelp,
}: CustomModeGameScreenProps) {
  const {
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
    micState,
    startGame,
    resetGame,
    startListening,
    stopListening,
  } = useGameCore({
    mode: "custom",
    customOptions,
    duration,
  });

  // 🎤 Auto–activar voz cuando phase === "running"
  useEffect(() => {
    if (phase === "running") {
      startListening();
    } else {
      stopListening();
    }
  }, [phase, startListening, stopListening]);

  return (
    <GameScreenLayout
      mode="custom"
      phase={phase}
      operation={operation}
      feedback={feedback}
      feedbackId={feedbackId}
      micState={micState}
      listening={listening}
      correct={correct}
      wrong={wrong}
      elapsed={`${timeLeft}s`}
      totalScore={totalScore}
      results={results}
      onStartGame={startGame}
      onReset={resetGame}
      onExit={onExit}
      startListening={startListening}
      stopListening={stopListening}
      titleSummary="⏹️ Fin del modo personalizado"
      durationSeconds={duration}
      onOpenHelp={onOpenHelp}
    />
  );
}
