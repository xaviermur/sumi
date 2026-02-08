import React, { useState, useCallback, useEffect } from "react";
import { useGameCore, type GameSummary } from "../hooks/useGameCore";
import { getModeKey, saveRecord, ScoreRecord } from "../core/logic/recordsStorage";
import GameScreenLayout from "./GameScreenLayout";
import { HelpSectionId } from "./HelpScreen";
import type { OperationType } from "@/core/types/operation";
import type { GameLanguage } from "@/core/types/game";

const ROUND_SECONDS = 100;

interface TimeAttackGameScreenProps {
  onExit: () => void;
  difficulty?: number;
  operationTypes: OperationType[];
  language: GameLanguage;
  onOpenHelp: (section?: HelpSectionId) => void;
}

export default function TimeAttackGameScreen({
  onExit,
  difficulty = 1,
  operationTypes,
  language,
  onOpenHelp,
}: TimeAttackGameScreenProps) {
  const [topRecords, setTopRecords] = useState<ScoreRecord[]>([]);
  const [isTop5, setIsTop5] = useState(false);

  const handleFinish = useCallback(
    ({ correct, wrong, totalScore }: GameSummary) => {
      const modeKey = getModeKey("timeattack", difficulty);
      const record = { score: totalScore, correct, wrong };
      saveRecord(modeKey, record).then(({ top, isTop5 }) => {
        setTopRecords(top);
        setIsTop5(isTop5);
      });
    },
    [difficulty]
  );

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
    difficulty,
    duration: ROUND_SECONDS,
    operationTypes,
    language,
    onFinish: handleFinish,
  });

  // 🔊 Automatizar inicio/parada de escucha según la fase del juego
  useEffect(() => {
    // Cuando empieza la partida, activar el micrófono
    if (phase === "running") {
      startListening();
    } else {
      // En cualquier otra fase (countdown, summary, etc.) lo paramos
      stopListening();
    }
  }, [phase, listening, startListening, stopListening]);

  return (
    <GameScreenLayout
      mode="timeattack"
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
      onOpenHelp={onOpenHelp}
    />
  );
}
