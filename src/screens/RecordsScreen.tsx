import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScoreRecord } from "../core/logic/recordsStorage";
import { GameMode } from "@/core/types/game";
import { useI18n } from "@/i18n/I18nProvider";

interface GroupedRecords {
  key: string;
  mode: GameMode;
  difficulty: number;
  duration?: number;
  records: ScoreRecord[];
}

export default function RecordsScreen({ onBack }: { onBack: () => void }) {
  const { strings, t } = useI18n();
  const [groups, setGroups] = useState<GroupedRecords[]>([]);

  useEffect(() => {
    loadAllRecords();
  }, []);

  async function loadAllRecords() {
    const raw = await AsyncStorage.getItem("cerebrin_records_v1");
    if (!raw) return;
    const data = JSON.parse(raw);

    const parsed: GroupedRecords[] = Object.entries(data)
      .map(([key, records]: any) => {
        const freeMatchWithTime = key.match(/^free_d(\d+)_t(\d+)$/);
        const freeMatch = key.match(/^free_d(\d+)$/);
        const timeMatch = key.match(/^timeattack_d(\d+)$/);

        if (freeMatchWithTime) {
          return {
            key,
            mode: "free",
            difficulty: parseInt(freeMatchWithTime[1]),
            duration: parseInt(freeMatchWithTime[2]),
            records,
          };
        } else if (freeMatch) {
          return {
            key,
            mode: "free",
            difficulty: parseInt(freeMatch[1]),
            records,
          };
        } else if (timeMatch) {
          return {
            key,
            mode: "timeattack",
            difficulty: parseInt(timeMatch[1]),
            records,
          };
        }
        return null;
      })
      .filter(Boolean) as GroupedRecords[];

    parsed.sort((a, b) => {
      if (a.mode !== b.mode) return a.mode.localeCompare(b.mode);
      if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
      return (a.duration ?? 0) - (b.duration ?? 0);
    });

    setGroups(parsed);
  }

  const medalIcons = ["🥇", "🥈", "🥉"];
  const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f4", padding: 20 }}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "800",
          textAlign: "center",
          marginBottom: 20,
          color: "#333",
        }}
      >
        {strings.records.title}
      </Text>

      {groups.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 18, color: "#777" }}>
          {strings.records.empty}
        </Text>
      ) : (
        <ScrollView>
          {groups.map((g, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 15,
                marginBottom: 15,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
              }}
            >
              {/* Encabezado */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "700", color: "#333" }}>
                  {g.mode === "free" ? strings.records.free : strings.records.timeattack}
                </Text>
                <Text style={{ color: "#777", fontSize: 16 }}>
                  {t(strings.records.difficulty, { n: g.difficulty })}
                  {g.mode === "free"
                    ? g.duration
                      ? ` · ${g.duration}s`
                      : ` · ${strings.records.noTime}`
                    : ""}
                </Text>
              </View>

              {/* 🥇 Tabla de puntuaciones */}
              {g.records.map((r, idx) => {
                const isMedal = idx < 3;
                const label = isMedal ? medalIcons[idx] : `#${idx + 1}`;
                const color = isMedal ? medalColors[idx] : "#666";

                return (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 6,
                      borderBottomWidth: idx === g.records.length - 1 ? 0 : 1,
                      borderColor: "#eee",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        width: 50,
                        textAlign: "center",
                        color,
                        fontWeight: isMedal ? "700" : "400",
                      }}
                    >
                      {label}
                    </Text>

                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "500",
                        color: "#222",
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      {r.score} {strings.game.points}
                    </Text>

                    <Text
                      style={{
                        color: "#555",
                        fontSize: 15,
                        textAlign: "right",
                        width: 90,
                      }}
                    >
                      ✅ {r.correct} ❌ {r.wrong}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Botón volver */}
      <TouchableOpacity
        onPress={onBack}
        style={{
          marginTop: 20,
          alignSelf: "center",
          backgroundColor: "#2196f3",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          {strings.records.back}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
