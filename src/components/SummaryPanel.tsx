import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

interface ScoreRecord {
  score: number;
  correct: number;
  wrong: number;
  date: string;
}

interface SummaryPanelProps {
  title?: string;
  correct: number;
  wrong: number;
  durationSeconds?: number;
  totalScore?: number;
  onRetry: () => void;
  onExit: () => void;
  topRecords?: ScoreRecord[]; // 🆕 top 5
  isTop5?: boolean;           // 🆕 si el jugador entró al ranking
}

export default function SummaryPanel({
  title = "Resumen",
  correct,
  wrong,
  durationSeconds,
  totalScore,
  topRecords,
  isTop5,
  onRetry,
  onExit,
}: SummaryPanelProps) {
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const medalIcons = ["🥇", "🥈", "🥉"];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        justifyContent: "space-between",
      }}
    >
      {/* 🧾 CABECERA */}
      <View style={{ alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 30, fontWeight: "800", color: "#333" }}>
          {title}
        </Text>

        {typeof durationSeconds === "number" && (
          <Text style={{ fontSize: 18, color: "#777", marginTop: 4 }}>
            ⏱️ Duración: {formatSec(durationSeconds)}
          </Text>
        )}
      </View>

      {/* 📊 RESULTADOS */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 36, fontWeight: "700", color: "#4caf50" }}>
            ✅ {correct}
          </Text>
          <Text style={{ color: "#666" }}>Correctas</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 36, fontWeight: "700", color: "#f44336" }}>
            ❌ {wrong}
          </Text>
          <Text style={{ color: "#666" }}>Erróneas</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 30, fontWeight: "700", color: "#2196f3" }}>
            🎯 {accuracy}%
          </Text>
          <Text style={{ color: "#666" }}>Precisión</Text>
        </View>
      </View>

      {/* ⭐ PUNTUACIÓN TOTAL */}
      {typeof totalScore === "number" && (
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#ff9800",
            }}
          >
            ⭐ {totalScore.toLocaleString()} pts
          </Text>

          {isTop5 && (
            <Text
              style={{
                marginTop: 6,
                color: "#ff9800",
                fontWeight: "600",
                fontSize: 18,
              }}
            >
              🏆 ¡Nuevo récord en el Top 5!
            </Text>
          )}
        </View>
      )}

      {/* 🏆 CLASIFICACIÓN TOP5 */}
      {topRecords && topRecords.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>
            🏆 Mejores puntuaciones
          </Text>

          {topRecords.map((record, index) => {
            const medalIcons = ["🥇", "🥈", "🥉"];
            const colors = ["#FFD700", "#C0C0C0", "#CD7F32"];
            const label = medalIcons[index] ?? `#${index + 1}`;
            const color = colors[index] ?? "#666";

            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 3,
                }}
              >
                {/* Icono y número pegados */}
                <Text
                  style={{
                    fontSize: 18,
                    color,
                    fontWeight: index < 3 ? "700" : "400",
                    marginRight: 8, // pequeño margen solo
                    width: 28, // mismo ancho visual
                    textAlign: "center",
                  }}
                >
                  {label}
                </Text>

                {/* Puntuación */}
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: "#222",
                  }}
                >
                  {record.score} pts
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* 🔘 BOTONES */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 25,
        }}
      >
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: "#4caf50",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>🔁 Reintentar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onExit}
          style={{
            backgroundColor: "#f44336",
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18 }}>🏠 Salir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatSec(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
