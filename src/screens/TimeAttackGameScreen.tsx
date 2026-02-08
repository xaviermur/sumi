import React, { useState, useCallback } from "react";
import { useGameCore, type GameSummary } from "../hooks/useGameCore";
import { getModeKey, saveRecord, ScoreRecord } from "../core/logic/recordsStorage";
import GameScreenLayout from "./GameScreenLayout";
import { HelpSectionId } from "./HelpScreen";
import type { OperationType } from "@/core/types/operation";
import { useI18n } from "@/i18n/I18nProvider";

const ROUND_SECONDS = 100;

interface TimeAttackGameScreenProps {
  onExit: () => void;
  difficulty?: number;
  operationTypes: OperationType[];
  onOpenHelp: (section?: HelpSectionId) => void;
}

export default function TimeAttackGameScreen({
  onExit,
  difficulty = 1,
  operationTypes,
  onOpenHelp,
}: TimeAttackGameScreenProps) {
  const { lang, strings } = useI18n();
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
    language: lang,
    onFinish: handleFinish,
  });

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
      titleSummary={strings.game.summaryTimeTitle}
      durationSeconds={ROUND_SECONDS}
      onOpenHelp={onOpenHelp}
    />
  );
}
