import React from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";

type LeftPanelProps = {
  listening: boolean;
  supported: boolean;
  startListening: () => void;
  stopListening: () => void;
  correct: number;
  wrong: number;
  elapsed: string;
  onReset: () => void;
  onExit: () => void;

  mode?: "free" | "timed" | "levels" | "timeattack" | "custom";
  difficulty?: number;
  onIncreaseLevel?: () => void;
  onDecreaseLevel?: () => void;

  phase?: "ready" | "running" | "finished";
  onStartGame?: () => void;
  autoStartLabel?: string;
};

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
  mode = "timed",
  difficulty = 1,
  onIncreaseLevel,
  onDecreaseLevel,
  phase = "running",
  onStartGame,
  autoStartLabel,
}: LeftPanelProps) {
  const remainingSeconds =
    mode === "timeattack" ? parseInt(elapsed.replace(/\D/g, "")) || 0 : null;
  const timeColor =
    mode === "timeattack" && remainingSeconds !== null && remainingSeconds <= 10
      ? "red"
      : "#000";

  const showDifficultyControls = mode === "free" || mode === "timeattack";

  const difficultyLabels = [
    { id: 1, name: "Muy fácil", color: "#A7F3D0" },
    { id: 2, name: "Fácil", color: "#BFDBFE" },
    { id: 3, name: "Media", color: "#FDE68A" },
    { id: 4, name: "Difícil", color: "#FDBA74" },
    { id: 5, name: "Experto", color: "#FCA5A5" },
  ];
  const current = difficultyLabels.find((d) => d.id === difficulty) ?? difficultyLabels[0];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginRight: 10,
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      {/* 🎙️ Micrófono */}
      <View>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>🎙️ Micrófono</Text>
        <TouchableOpacity
          onPress={() => (listening ? stopListening() : startListening())}
          disabled={!supported || phase === "finished"}
          style={{
            backgroundColor: listening ? "#ef4444" : "#22c55e",
            paddingVertical: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
            {listening ? "🔇 Apagar micro" : "🎤 Encender micro"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📊 Estadísticas */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 20 }}>✅ Aciertos: {correct}</Text>
        <Text style={{ fontSize: 20, marginTop: 6 }}>❌ Errores: {wrong}</Text>
        <Text
          style={{
            fontSize: 20,
            marginTop: 6,
            color: timeColor,
            fontWeight: "700",
          }}
        >
          ⏱️ Tiempo: {elapsed}
        </Text>
      </View>

      {/* ⚙️ Dificultad */}
      {showDifficultyControls && (
        <View
          style={{
            marginTop: 24,
            padding: 12,
            backgroundColor: "#f9fafb",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 6 }}>⚙️ Dificultad</Text>
          <Text style={{ fontSize: 16, color: current.color, fontWeight: "600" }}>
            {current.name}
          </Text>
          <Text style={{ fontSize: 14, color: "#666" }}>Nivel {difficulty} de 5</Text>

          {/* Botones compactos */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              gap: 12,
            }}
          >
            <TouchableOpacity
              onPress={onDecreaseLevel}
              disabled={difficulty <= 1}
              style={{
                backgroundColor: "#e5e7eb",
                borderRadius: 50,
                paddingHorizontal: 14,
                paddingVertical: 8,
                opacity: difficulty <= 1 ? 0.5 : 1,
              }}
            >
              <Text style={{ fontSize: 20 }}>➖</Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: current.color,
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: "700" }}>{difficulty}</Text>
            </View>

            <TouchableOpacity
              onPress={onIncreaseLevel}
              disabled={difficulty >= 5}
              style={{
                backgroundColor: "#e5e7eb",
                borderRadius: 50,
                paddingHorizontal: 14,
                paddingVertical: 8,
                opacity: difficulty >= 5 ? 0.5 : 1,
              }}
            >
              <Text style={{ fontSize: 20 }}>➕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 🔁 Acciones */}
      <View>
        {phase === "ready" && onStartGame && (
          <>
            <TouchableOpacity
              onPress={onStartGame}
              style={{
                backgroundColor: "#3b82f6",
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
                {autoStartLabel ?? "▶ Iniciar juego"}
              </Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          onPress={onReset}
          style={{
            backgroundColor: "#fbbf24",
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 16 }}>🔁 Reiniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onExit}
          style={{
            backgroundColor: "#9ca3af",
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 16, color: "#fff" }}>
            🏠 Volver al menú
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
