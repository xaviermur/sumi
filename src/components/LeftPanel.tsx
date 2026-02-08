import { GameMode } from "@/core/types/game";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useI18n } from "@/i18n/I18nProvider";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface LeftPanelProps {
  listening: boolean;
  startListening: () => void;
  stopListening: () => void;
  correct: number;
  wrong: number;
  elapsed: string;
  onReset: () => void;
  onExit: () => void;
  onFinishGame?: () => void;
  mode: GameMode;
  difficulty?: number;
  phase: "ready" | "running" | "finished";
  onStartGame: () => void;
  autoStartLabel?: string;
  onIncreaseLevel?: () => void;
  onDecreaseLevel?: () => void;
  totalScore?: number;
  onOpenHelp?: (section?: string) => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function LeftPanel({
  listening,
  startListening,
  stopListening,
  correct,
  wrong,
  elapsed,
  onReset,
  onExit,
  onFinishGame,
  mode,
  difficulty,
  phase,
  onStartGame,
  autoStartLabel,
  onIncreaseLevel,
  onDecreaseLevel,
  totalScore = 0,
  onOpenHelp,
}: LeftPanelProps) {
  const { strings, t } = useI18n();
  const startLabel = autoStartLabel ?? strings.game.startLabel;
  const isRunning = phase === "running";
  const isFinished = phase === "finished";
  const isFreeMode = mode === "free";

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        flexShrink: 1,
      }}
    >
      {/* ⭐ PARTE SUPERIOR */}
      <View>
        {/* 🔹 Título */}
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: "#333" }}>
            {mode === "free"
              ? strings.game.freeTitle
              : mode === "timeattack"
              ? strings.game.timeattackTitle
              : "🛠️"}
          </Text>

          {difficulty !== undefined && (
            <Text style={{ fontSize: 18, color: "#777", marginTop: 4 }}>
              {t(strings.game.difficulty, { n: difficulty })}
            </Text>
          )}
        </View>

        {/* 🕒 Timer */}
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <Text
            style={{
              fontSize: 54,
              fontWeight: "800",
              color: isFinished ? "#999" : "#222",
            }}
          >
            {elapsed}
          </Text>
          <Text style={{ fontSize: 16, color: "#777" }}>
            {isRunning
              ? isFreeMode
                ? strings.game.timeUnlimited
                : strings.game.timeRemaining
              : strings.game.ready}
          </Text>
        </View>

        {/* 📊 Correctas / Erróneas */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 40, color: "#4caf50", fontWeight: "700" }}>
              ✅ {correct}
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {strings.game.correct}
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 40, color: "#f44336", fontWeight: "700" }}>
              ❌ {wrong}
            </Text>
            <Text style={{ fontSize: 16, color: "#555" }}>
              {strings.game.wrong}
            </Text>
          </View>
        </View>

        {/* 💯 Puntuación */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#ff9800",
            }}
          >
            ⭐ {strings.game.score}: {totalScore.toLocaleString()} {strings.game.points}
          </Text>
        </View>
      </View>

      {/* ⭐ BOTONES — SIEMPRE ABAJO */}
      <View style={{ marginTop: 20 }}>
        {phase === "ready" && (
          <TouchableOpacity
            onPress={onStartGame}
            style={{
              backgroundColor: "#2196f3",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
              {startLabel}
            </Text>
          </TouchableOpacity>
        )}

        {isRunning && (
          <TouchableOpacity
            onPress={listening ? stopListening : startListening}
            style={{
              backgroundColor: listening ? "#f44336" : "#4caf50",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>
              {listening ? strings.game.stopMic : strings.game.resumeMic}
            </Text>
          </TouchableOpacity>
        )}

        {isRunning && isFreeMode && onFinishGame && (
          <TouchableOpacity
            onPress={onFinishGame}
            style={{
              backgroundColor: "#8e24aa",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>
              {strings.game.finish}
            </Text>
          </TouchableOpacity>
        )}

        {(isRunning || isFinished) && (
          <TouchableOpacity
            onPress={onReset}
            style={{
              backgroundColor: "#ff9800",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>
              {strings.game.restart}
            </Text>
          </TouchableOpacity>
        )}

        {/* Salir */}
        <TouchableOpacity
          onPress={onExit}
          style={{
            backgroundColor: "#9e9e9e",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>
            {strings.game.exit}
          </Text>
        </TouchableOpacity>

        {/* ❓ Ayuda */}
        {onOpenHelp && (
          <TouchableOpacity
            onPress={() => onOpenHelp("howToAnswer")}
            style={{
              marginTop: 12,
              backgroundColor: "#3b82f6",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>
              {strings.game.howToAnswer}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 🔼/🔽 dificultad */}
      {mode === "free" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 14,
          }}
        >
          <TouchableOpacity
            onPress={onDecreaseLevel}
            style={{
              backgroundColor: "#e0e0e0",
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>{strings.game.levelDown}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onIncreaseLevel}
            style={{
              backgroundColor: "#e0e0e0",
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>{strings.game.levelUp}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
