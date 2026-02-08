import React, { useState, useEffect } from "react";
import { useGameCore, type GameSummary } from "../hooks/useGameCore";
import { getModeKey, saveRecord, ScoreRecord } from "../core/logic/recordsStorage";
import GameScreenLayout from "./GameScreenLayout";
import { HelpSectionId } from "./HelpScreen";
import type { OperationType } from "@/core/types/operation";
import type { GameLanguage } from "@/core/types/game";

interface FreeModeGameScreenProps {
  onExit: () => void;
  difficulty?: number;
  operationTypes: OperationType[];
  language: GameLanguage;
  onOpenHelp: (section?: HelpSectionId) => void;
}

export default function FreeModeGameScreen({
  onExit,
  difficulty = 1,
  operationTypes,
  language,
  onOpenHelp,
}: FreeModeGameScreenProps) {
  const [topRecords, setTopRecords] = useState<ScoreRecord[]>([]);
  const [isTop5, setIsTop5] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);

  const {
    operation,
    feedback,
    feedbackId,
    correct,
    wrong,
    totalScore,
    results,
    phase,
    listening,
    micState,
    startGame,
    resetGame,
    startListening,
    stopListening,
    finishGame,
  } = useGameCore({
    difficulty: currentDifficulty,
    operationTypes,
    language,
    onFinish: handleFinish,
  });

  function handleFinish({ correct, wrong, totalScore }: GameSummary) {
    const modeKey = getModeKey("free", currentDifficulty);
    const record = { score: totalScore, correct, wrong };

    saveRecord(modeKey, record).then(({ top, isTop5 }) => {
      setTopRecords(top);
      setIsTop5(isTop5);
    });
  }

  const increaseLevel = () => {
    setCurrentDifficulty((prev) => Math.min(prev + 1, 5));
  };

  const decreaseLevel = () => {
    setCurrentDifficulty((prev) => Math.max(prev - 1, 1));
  };

  // 🎤 Auto-activar / desactivar el micrófono según la fase
  useEffect(() => {
    if (phase === "running") {
      startListening();
    } else {
      stopListening();
    }
  }, [phase, startListening, stopListening]);

  return (
    <GameScreenLayout
      mode="free"
      phase={phase}
      operation={operation}
      feedback={feedback}
      feedbackId={feedbackId}
      micState={micState}
      listening={listening}
      correct={correct}
      wrong={wrong}
      elapsed="∞"
      totalScore={totalScore}
      results={results}
      topRecords={topRecords}
      isTop5={isTop5}
      onStartGame={startGame}
      onReset={resetGame}
      onExit={onExit}
      onFinishGame={finishGame}
      startListening={startListening}
      stopListening={stopListening}
      difficulty={currentDifficulty}
      onIncreaseLevel={increaseLevel}
      onDecreaseLevel={decreaseLevel}
      titleSummary="⏹️ Fin de la sesión"
      onOpenHelp={onOpenHelp}
    />
  );
}
