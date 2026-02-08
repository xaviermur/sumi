import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { OperationType } from "@/core/types/operation";
import { GameMode } from "@/core/types/game";
import { LANGUAGES } from "@/i18n/strings";
import { useI18n } from "@/i18n/I18nProvider";
import FlagIcon from "@/components/FlagIcon";

export interface StartGameOptions {
  mode: GameMode;
  difficulty: number;
  operationTypes: OperationType[];
}

export interface MenuScreenProps {
  onStartGame: (opts: StartGameOptions) => void;
  onShowRecords: () => void;
  onOpenHelp: () => void;
}

type OperationChoice = "sum" | "sub" | "sum_sub";

export default function MenuScreen({
  onStartGame,
  onShowRecords,
  onOpenHelp,
}: MenuScreenProps) {
  const { lang, setLang, strings } = useI18n();
  const [operationChoice, setOperationChoice] = useState<OperationChoice | null>(
    null
  );
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [showLang, setShowLang] = useState(false);

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
      <View
        style={{
          width: "100%",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "700" }}>
          {strings.appTitle}
        </Text>
      </View>

      {/* Botón ayuda + idioma */}
      <View
        style={{
          position: "absolute",
          top: 40,
          right: 20,
          zIndex: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onOpenHelp}>
          <Ionicons name="help-circle-outline" size={36} color="#2196f3" />
        </TouchableOpacity>

        <View style={{ marginLeft: 8 }}>
          <TouchableOpacity
            onPress={() => setShowLang((prev) => !prev)}
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
          >
            <FlagIcon lang={lang} size={20} />
          </TouchableOpacity>

          {showLang && (
            <View
              style={{
                position: "absolute",
                top: 46,
                right: 0,
                backgroundColor: "#fff",
                borderRadius: 10,
                paddingVertical: 6,
                paddingHorizontal: 10,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 6,
                zIndex: 30,
              }}
            >
              {LANGUAGES.filter((l) => l !== lang).map((l) => (
                <TouchableOpacity
                  key={l}
                  onPress={() => {
                    setLang(l);
                    setShowLang(false);
                  }}
                  style={{
                    paddingVertical: 6,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ marginRight: 8 }}>
                    <FlagIcon lang={l} size={16} />
                  </View>
                  <Text style={{ fontSize: 16 }}>{strings.languageName[l]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
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
          {strings.menu.stepOperations}
        </Text>

        {[
          { key: "sum", label: strings.menu.operations.sum },
          { key: "sub", label: strings.menu.operations.sub },
          { key: "sum_sub", label: strings.menu.operations.sumSub },
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
          {strings.menu.stepMode}
        </Text>

        {[
          { key: "free", label: strings.menu.modes.free },
          { key: "timeattack", label: strings.menu.modes.timeattack },
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
          {strings.menu.stepLevel}
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
                {strings.menu.difficulty[n - 1]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
          🚀 {strings.menu.start}
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
          🏆 {strings.menu.records}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
