import React, { useState } from "react";
import { useGameCore, type GameSummary } from "../hooks/useGameCore";
import { getModeKey, saveRecord, ScoreRecord } from "../core/logic/recordsStorage";
import GameScreenLayout from "./GameScreenLayout";

const ROUND_SECONDS = 60;

interface TimeAttackGameScreenProps {
  onExit: () => void;
  difficulty?: number;
}

export default function TimeAttackGameScreen({
  onExit,
  difficulty = 1,
}: TimeAttackGameScreenProps) {
  const [topRecords, setTopRecords] = useState<ScoreRecord[]>([]);
  const [isTop5, setIsTop5] = useState(false);

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
    mode: "timeattack",
    difficulty,
    duration: ROUND_SECONDS,
    onFinish: handleFinish,
  });

  function handleFinish({ correct, wrong, totalScore }: GameSummary) {
    const modeKey = getModeKey("timeattack", difficulty);
    const record = { score: totalScore, correct, wrong };
    saveRecord(modeKey, record).then(({ top, isTop5 }) => {
      setTopRecords(top);
      setIsTop5(isTop5);
    });
  }

  return (
    <GameScreenLayout
      mode="timeattack"
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
      difficulty={difficulty}
      titleSummary="⏱️ ¡Tiempo terminado!"
      durationSeconds={ROUND_SECONDS}
    />
  );
}
