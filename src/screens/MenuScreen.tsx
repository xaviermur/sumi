import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { OperationType } from "@/core/types/operation";
import { GameLanguage, GameMode } from "@/core/types/game";

export interface StartGameOptions {
  mode: GameMode;
  difficulty: number;
  operationTypes: OperationType[];
  language: GameLanguage;
}

export interface MenuScreenProps {
  onStartGame: (opts: StartGameOptions) => void;
  onShowRecords: () => void;
  onOpenHelp: () => void;
}

type OperationChoice = "sum" | "sub" | "sum_sub";

const difficultyLabels = ["Muy fácil", "Fácil", "Media", "Difícil", "Experto"];

export default function MenuScreen({
  onStartGame,
  onShowRecords,
  onOpenHelp,
}: MenuScreenProps) {
  const [operationChoice, setOperationChoice] = useState<OperationChoice | null>(
    null
  );
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [language, setLanguage] = useState<GameLanguage>("es");

  const operationTypes = useMemo<OperationType[]>(() => {
    if (operationChoice === "sum") return ["sum"];
    if (operationChoice === "sub") return ["sub"];
    if (operationChoice === "sum_sub") return ["sum", "sub"];
    return ["sum", "sub"];
  }, [operationChoice]);

  const canStart = Boolean(operationChoice && selectedMode);

  const handleStart = () => {
    if (!operationChoice || !selectedMode) return;
    onStartGame({
      mode: selectedMode,
      difficulty,
      operationTypes,
      language,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        alignItems: "center",
        backgroundColor: "#f2f2f2",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "700", marginBottom: 30 }}>
        🧮 CEREBRiN
      </Text>

      {/* Botón ayuda */}
      <View
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          zIndex: 20,
        }}
      >
        <TouchableOpacity onPress={onOpenHelp}>
          <Ionicons name="help-circle-outline" size={36} color="#2196f3" />
        </TouchableOpacity>
      </View>

      {/* 1) Tipo de operaciones */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          width: "90%",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 12 }}>
          1. Tipo de operaciones
        </Text>

        {[
          { key: "sum", label: "SUMAS" },
          { key: "sub", label: "RESTAS" },
          { key: "sum_sub", label: "SUMAS Y RESTAS" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setOperationChoice(opt.key as OperationChoice)}
            style={{
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
              backgroundColor:
                operationChoice === opt.key ? "#4caf50" : "#eee",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: operationChoice === opt.key ? "#fff" : "#333",
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 2) Modo de juego */}
      {operationChoice && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "90%",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 12 }}>
            2. Modo de juego
          </Text>

          {[
            { key: "free", label: "LIBRE (sin tiempo)" },
            { key: "timeattack", label: "SUPERVIVENCIA (100 s)" },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => setSelectedMode(opt.key as GameMode)}
              style={{
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor:
                  selectedMode === opt.key ? "#2196f3" : "#eee",
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
      )}

      {/* 3) Dificultad */}
      {operationChoice && selectedMode && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "90%",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 12 }}>
            3. Nivel
          </Text>

          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setDifficulty(n)}
              style={{
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: difficulty === n ? "#ff9800" : "#eee",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: difficulty === n ? "#fff" : "#333",
                }}
              >
                {difficultyLabels[n - 1]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Idioma */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          width: "90%",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 12 }}>
          Idioma
        </Text>

        {[
          { key: "es", label: "Español" },
          { key: "ca", label: "Català" },
          { key: "en", label: "English" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setLanguage(opt.key as GameLanguage)}
            style={{
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
              backgroundColor: language === opt.key ? "#8bc34a" : "#eee",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: language === opt.key ? "#fff" : "#333",
              }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón comenzar */}
      <TouchableOpacity
        onPress={handleStart}
        disabled={!canStart}
        style={{
          backgroundColor: canStart ? "#4caf50" : "#aaa",
          paddingVertical: 14,
          paddingHorizontal: 40,
          borderRadius: 10,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          🚀 Comenzar
        </Text>
      </TouchableOpacity>

      {/* Ver récords */}
      <TouchableOpacity
        onPress={onShowRecords}
        style={{
          backgroundColor: "#ff9800",
          paddingVertical: 12,
          paddingHorizontal: 40,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>
          🏆 Ver récords
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
