import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";

export default function MenuScreen({
  onStartGame,
}: {
  onStartGame: (options?: any) => void;
}) {
  const [selectedMode, setSelectedMode] = useState<
    "free" | "timed" | "levels" | "custom" | null
  >(null);
  const [difficulty, setDifficulty] = useState<number>(1); // 1–5
  const [duration, setDuration] = useState<number>(60);

  const handleStart = () => {
    onStartGame({
      mode: selectedMode,
      difficulty,
      duration,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "700", marginBottom: 30 }}>
        🧮 SUMi
      </Text>

      {/* 🎮 Modo de juego */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          width: "90%",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 3,
          marginBottom: 25,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>
          🎮 Modo de juego
        </Text>
        {[
          { key: "free", label: "Modo libre (tiempo personalizado)" },
          { key: "timed", label: "Contrarreloj (1 minuto)" },
          { key: "levels", label: "Por niveles (progresivo)" },
          { key: "custom", label: "Personalizado (configura tu modo)" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setSelectedMode(opt.key as any)}
            style={{
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
              backgroundColor: selectedMode === opt.key ? "#4caf50" : "#eee",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: selectedMode === opt.key ? "#fff" : "#333",
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ⚙️ Dificultad (solo si NO es modo custom) */}
      {selectedMode !== "custom" && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "90%",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 3,
            marginBottom: 25,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>
            ⚙️ Dificultad
          </Text>
          {[
            { key: 1, label: "Muy fácil" },
            { key: 2, label: "Fácil" },
            { key: 3, label: "Media" },
            { key: 4, label: "Difícil" },
            { key: 5, label: "Experto" },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setDifficulty(opt.key)}
              style={{
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor:
                  difficulty === opt.key ? "#2196f3" : "#eee",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: difficulty === opt.key ? "#fff" : "#333",
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ⏱️ Duración (solo en modo libre) */}
      {selectedMode === "free" && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "90%",
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 3,
            marginBottom: 25,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>
            ⏱️ Duración
          </Text>
          {[60, 120, 180, 300].map((sec) => (
            <TouchableOpacity
              key={sec}
              onPress={() => setDuration(sec)}
              style={{
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: duration === sec ? "#ff9800" : "#eee",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: duration === sec ? "#fff" : "#333",
                }}
              >
                {sec / 60} minuto{sec > 60 ? "s" : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 🚀 Botón Comenzar */}
      <Button title="🚀 Comenzar" onPress={handleStart} disabled={!selectedMode} />
    </View>
  );
}
