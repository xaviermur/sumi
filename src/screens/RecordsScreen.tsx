import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getModeKey, getRecords, ScoreRecord } from "../core/logic/recordsStorage";

interface GroupedRecords {
  key: string;
  mode: "free" | "timeattack";
  difficulty: number;
  duration?: number;
  records: ScoreRecord[];
}

export default function RecordsScreen({ onBack }: { onBack: () => void }) {
  const [groups, setGroups] = useState<GroupedRecords[]>([]);

  useEffect(() => {
    loadAllRecords();
  }, []);

  async function loadAllRecords() {
    const raw = await AsyncStorage.getItem("sumi_records_v1");
    if (!raw) return;
    const data = JSON.parse(raw);

    const parsed: GroupedRecords[] = Object.entries(data).map(([key, records]: any) => {
      const freeMatch = key.match(/^free_d(\d+)_t(\d+)/);
      const timeMatch = key.match(/^timeattack_d(\d+)/);

      if (freeMatch) {
        return {
          key,
          mode: "free",
          difficulty: parseInt(freeMatch[1]),
          duration: parseInt(freeMatch[2]),
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
    }).filter(Boolean) as GroupedRecords[];

    // Ordenamos por modo y dificultad
    parsed.sort((a, b) => {
      if (a.mode !== b.mode) return a.mode.localeCompare(b.mode);
      if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
      return (a.duration ?? 0) - (b.duration ?? 0);
    });

    setGroups(parsed);
  }

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
        🏆 Clasificaciones
      </Text>

      {groups.length === 0 ? (
        <Text style={{ textAlign: "center", fontSize: 18, color: "#777" }}>
          Aún no hay récords guardados.
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
                  {g.mode === "free" ? "🆓 Modo libre" : "⏱️ Contrarreloj"}
                </Text>
                <Text style={{ color: "#777", fontSize: 16 }}>
                  Dificultad {g.difficulty}
                  {g.mode === "free" ? ` · ${g.duration}s` : ""}
                </Text>
              </View>

              {/* Top 5 */}
              {g.records.map((r, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 6,
                    borderBottomWidth: idx === g.records.length - 1 ? 0 : 1,
                    borderColor: "#eee",
                  }}
                >
                  <Text style={{ fontSize: 18, color: "#333" }}>
                    {idx + 1}. {r.score.toLocaleString()} pts
                  </Text>
                  <Text style={{ color: "#666", fontSize: 16 }}>
                    ✅ {r.correct} ❌ {r.wrong}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

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
          ⬅️ Volver
        </Text>
      </TouchableOpacity>
    </View>
  );
}
