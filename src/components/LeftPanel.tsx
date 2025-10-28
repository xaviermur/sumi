import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface LeftPanelProps {
  listening: boolean;
  supported: boolean;
  startListening: () => void;
  stopListening: () => void;
  correct: number;
  wrong: number;
  elapsed: string;
  onReset: () => void;
  onExit: () => void;
  mode: "free" | "timeattack" | "custom";
  difficulty?: number;
  phase: "ready" | "running" | "finished";
  onStartGame: () => void;
  autoStartLabel?: string;
  onIncreaseLevel?: () => void;
  onDecreaseLevel?: () => void;
  totalScore?: number; // 🆕 marcador de puntuación
}

export default function LeftPanel({
  listening,
  supported,
  startListening,
  stopListening,
  correct,
  wrong,
  elapsed,
  onReset,
  onExit,
  mode,
  difficulty,
  phase,
  onStartGame,
  autoStartLabel = "▶ Iniciar",
  onIncreaseLevel,
  onDecreaseLevel,
  totalScore = 0,
}: LeftPanelProps) {
  const isRunning = phase === "running";
  const isFinished = phase === "finished";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 20,
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
    >
      {/* 🔹 Encabezado */}
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700", color: "#333" }}>
          {mode === "free"
            ? "🆓 Modo libre"
            : mode === "timeattack"
            ? "⏱️ Contrarreloj"
            : "⚙️ Modo personalizado"}
        </Text>
        {difficulty && (
          <Text style={{ fontSize: 18, color: "#777", marginTop: 4 }}>
            Dificultad: {difficulty}
          </Text>
        )}
      </View>

      {/* 🕒 Timer */}
      <View
        style={{
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
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
          {isRunning ? "Tiempo restante" : "Listo para comenzar"}
        </Text>
      </View>

      {/* 📊 Marcadores */}
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
          <Text style={{ fontSize: 16, color: "#555" }}>Correctas</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 40, color: "#f44336", fontWeight: "700" }}>
            ❌ {wrong}
          </Text>
          <Text style={{ fontSize: 16, color: "#555" }}>Erróneas</Text>
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
          ⭐ Puntuación: {totalScore.toLocaleString()} pts
        </Text>
      </View>

      {/* 🎮 Controles */}
      <View style={{ marginTop: 20 }}>
        {phase === "ready" && (
          <TouchableOpacity
            onPress={onStartGame}
            style={{
              backgroundColor: "#2196f3",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
              {autoStartLabel}
            </Text>
          </TouchableOpacity>
        )}

        {isRunning && (
          <TouchableOpacity
            onPress={stopListening}
            style={{
              backgroundColor: listening ? "#f44336" : "#4caf50",
              paddingVertical: 12,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>
              {listening ? "🎙️ Detener micro" : "🎧 Reanudar micro"}
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
            <Text style={{ color: "#fff", fontSize: 18 }}>🔁 Reiniciar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onExit}
          style={{
            backgroundColor: "#9e9e9e",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>🏠 Salir</Text>
        </TouchableOpacity>
      </View>

      {/* 🔼/🔽 Controles de dificultad (modo libre) */}
      {mode === "free" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={onDecreaseLevel}
            disabled={!onDecreaseLevel}
            style={{
              backgroundColor: "#e0e0e0",
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>⬇️ Nivel -</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onIncreaseLevel}
            disabled={!onIncreaseLevel}
            style={{
              backgroundColor: "#e0e0e0",
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18 }}>⬆️ Nivel +</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
