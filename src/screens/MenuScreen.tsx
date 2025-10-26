import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";

export default function MenuScreen({ onStartGame }: { onStartGame: (options?: any) => void }) {
  const [selectedMode, setSelectedMode] = useState<"free" | "timed" | "levels" | null>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [duration, setDuration] = useState<number>(60); // segundos

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
      <Text style={{ fontSize: 32, fontWeight: "700", marginBottom: 30 }}>🧮 SUMi</Text>

      {/* SECCIÓN: Modo de juego */}
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
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>🎮 Modo de juego</Text>
        {[
          { key: "free", label: "Modo libre (tiempo personalizado)" },
          { key: "timed", label: "Contrarreloj (1 minuto)" },
          { key: "levels", label: "Por niveles (progresivo)" },
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

      {/* SECCIÓN: Dificultad */}
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
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>⚙️ Dificultad</Text>
        {[
          { key: "easy", label: "Fácil" },
          { key: "medium", label: "Media" },
          { key: "hard", label: "Difícil" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setDifficulty(opt.key as any)}
            style={{
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
              backgroundColor: difficulty === opt.key ? "#2196f3" : "#eee",
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

      {/* SECCIÓN: Duración (solo si es modo libre) */}
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
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>⏱️ Duración</Text>
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

      {/* BOTÓN: Empezar */}
      <Button
        title="🚀 Comenzar"
        onPress={handleStart}
        disabled={!selectedMode}
      />
    </View>
  );
}
