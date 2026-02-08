import React from "react";
import { View, Text, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { useI18n } from "@/i18n/I18nProvider";

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
  topRecords?: ScoreRecord[];
  isTop5?: boolean;
}

export default function SummaryPanel({
  title,
  correct,
  wrong,
  durationSeconds,
  totalScore,
  topRecords,
  isTop5,
  onRetry,
  onExit,
}: SummaryPanelProps) {
  const { strings, t } = useI18n();
  const resolvedTitle = title ?? strings.summary.title;
  const total = correct + wrong;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const { height, width } = useWindowDimensions();
  const isSmall = height < 700;

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
      }}
    >
      {/* CABECERA */}
      <View style={{ alignItems: "center", marginBottom: 12 }}>
        <Text style={{ fontSize: isSmall ? 24 : 30, fontWeight: "800", color: "#333" }}>
          {resolvedTitle}
        </Text>

        {typeof durationSeconds === "number" && (
          <Text style={{ fontSize: 16, color: "#777", marginTop: 4 }}>
            {t(strings.summary.duration, { n: formatSec(durationSeconds) })}
          </Text>
        )}
      </View>

      {/* RESULTADOS */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: isSmall ? 26 : 36, fontWeight: "700", color: "#4caf50" }}>
            ✅ {correct}
          </Text>
          <Text style={{ color: "#666" }}>{strings.summary.correct}</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: isSmall ? 26 : 36, fontWeight: "700", color: "#f44336" }}>
            ❌ {wrong}
          </Text>
          <Text style={{ color: "#666" }}>{strings.summary.wrong}</Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: isSmall ? 22 : 30, fontWeight: "700", color: "#2196f3" }}>
            🎯 {accuracy}%
          </Text>
          <Text style={{ color: "#666" }}>{strings.summary.accuracy}</Text>
        </View>
      </View>

      {/* PUNTUACIÓN */}
      {typeof totalScore === "number" && (
        <View style={{ alignItems: "center", marginTop: 12 }}>
          <Text
            style={{
              fontSize: isSmall ? 24 : 28,
              fontWeight: "800",
              color: "#ff9800",
            }}
          >
            ⭐ {totalScore.toLocaleString()} {strings.game.points}
          </Text>

          {isTop5 && (
            <Text
              style={{
                marginTop: 6,
                color: "#ff9800",
                fontWeight: "600",
                fontSize: isSmall ? 16 : 18,
              }}
            >
              {strings.summary.newRecord}
            </Text>
          )}
        </View>
      )}

      {/* TOP 5 */}
      {topRecords && topRecords.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: isSmall ? 18 : 20, fontWeight: "700", marginBottom: 10 }}>
            {strings.summary.topScores}
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
                {/* Icono */}
                <Text
                  style={{
                    fontSize: isSmall ? 16 : 18,
                    color,
                    fontWeight: index < 3 ? "700" : "400",
                    width: 28,
                    textAlign: "center",
                  }}
                >
                  {label}
                </Text>

                {/* Score */}
                <Text
                  style={{
                    fontSize: isSmall ? 16 : 18,
                    fontWeight: "500",
                    color: "#222",
                  }}
                >
                  {record.score} {strings.game.points}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* BOTONES */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 28,
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
          <Text style={{ color: "#fff", fontSize: isSmall ? 16 : 18 }}>
            {strings.summary.retry}
          </Text>
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
          <Text style={{ color: "#fff", fontSize: isSmall ? 16 : 18 }}>
            {strings.summary.exit}
          </Text>
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
