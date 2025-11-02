import React, { useState } from "react";
import { useGameCore, type GameSummary } from "../hooks/useGameCore";
import { getModeKey, saveRecord, ScoreRecord } from "../core/logic/recordsStorage";
import GameScreenLayout from "./GameScreenLayout";

interface FreeModeGameScreenProps {
  onExit: () => void;
  difficulty?: number;
  duration?: number; // segundos
}

export default function FreeModeGameScreen({
  onExit,
  difficulty = 1,
  duration = 60,
}: FreeModeGameScreenProps) {
  const [topRecords, setTopRecords] = useState<ScoreRecord[]>([]);
  const [isTop5, setIsTop5] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState(difficulty);

  // 🎮 Lógica del juego
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
    supported,
    micState,
    startGame,
    resetGame,
    startListening,
    stopListening,
  } = useGameCore({
    mode: "free",
    difficulty: currentDifficulty,
    duration,
    onFinish: handleFinish,
  });

  // 🏆 Guardar récord al terminar
  function handleFinish({ correct, wrong, totalScore }: GameSummary) {
    const modeKey = getModeKey("free", currentDifficulty, duration);
    const record = { score: totalScore, correct, wrong };

    saveRecord(modeKey, record).then(({ top, isTop5 }) => {
      setTopRecords(top);
      setIsTop5(isTop5);
    });
  }

  // 🔼 / 🔽 Cambiar dificultad
  const increaseLevel = () => {
    setCurrentDifficulty((prev) => Math.min(prev + 1, 5));
  };

  const decreaseLevel = () => {
    setCurrentDifficulty((prev) => Math.max(prev - 1, 1));
  };

  return (
    <GameScreenLayout
      mode="free"
      phase={phase}
      operation={operation}
      feedback={feedback}
      feedbackId={feedbackId}
      micState={micState}
      listening={listening}
      supported={supported}
      correct={correct}
      wrong={wrong}
      elapsed={`${timeLeft}s`}
      totalScore={totalScore}
      results={results}
      topRecords={topRecords}
      isTop5={isTop5}
      onStartGame={startGame}
      onReset={resetGame}
      onExit={onExit}
      startListening={startListening}
      stopListening={stopListening}
      difficulty={currentDifficulty}
      onIncreaseLevel={increaseLevel}
      onDecreaseLevel={decreaseLevel}
      titleSummary="⏹️ Fin de la ronda"
      durationSeconds={duration}
    />
  );
}
