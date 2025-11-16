import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type MenuMode = "free" | "timeattack" | "custom";

export interface CustomOptions {
  type: ("sum" | "sub")[];
  range1: [number, number];
  range2: [number, number];
  overflowDigits: [number, number];
  resultRange: [number, number];
}

export interface StartGameOptions {
  mode: MenuMode | null;
  difficulty?: number;
  duration: number;
  customOptions?: CustomOptions;
}

export interface MenuScreenProps {
  onStartGame: (opts: StartGameOptions) => void;
  onShowRecords: () => void;
  onOpenHelp: () => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function MenuScreen({
  onStartGame,
  onShowRecords,
  onOpenHelp,
}: MenuScreenProps) {
  const [selectedMode, setSelectedMode] = useState<MenuMode | null>(null);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [duration, setDuration] = useState<number>(60);

  const [sumEnabled, setSumEnabled] = useState(true);
  const [subEnabled, setSubEnabled] = useState(false);
  const [carryEnabled, setCarryEnabled] = useState(false);

  const [selectedOperatorType, setSelectedOperatorType] = useState<
    "small" | "medium" | "large" | "xlarge" | "unlimited"
  >("small");

  // ----------------------------------
  // CONFIG RANGOS
  // ----------------------------------

  const operatorRanges: Record<
    "small" | "medium" | "large" | "xlarge" | "unlimited",
    [number, number]
  > = {
    small: [1, 9],
    medium: [10, 20],
    large: [20, 50],
    xlarge: [50, 100],
    unlimited: [100, 1000],
  };

  const overflowMinByType: Record<
    "small" | "medium" | "large" | "xlarge" | "unlimited",
    number
  > = {
    small: 1,
    medium: 2,
    large: 2,
    xlarge: 2,
    unlimited: 3,
  };

  // ----------------------------------
  // 🚀 handleStart
  // ----------------------------------

  const handleStart = () => {
    if (selectedMode === "custom") {
      const types: ("sum" | "sub")[] = [];
      if (sumEnabled) types.push("sum");
      if (subEnabled) types.push("sub");

      const baseRange = operatorRanges[selectedOperatorType];
      const overflowMin = overflowMinByType[selectedOperatorType];

      const customOptions: CustomOptions = {
        type: types.length ? types : ["sum"],
        range1: baseRange,
        range2: baseRange,
        overflowDigits: carryEnabled
          ? [overflowMin, overflowMin]
          : [0, 0],
        resultRange: [baseRange[0], baseRange[1] * 2],
      };

      onStartGame({
        mode: "custom",
        duration,
        customOptions,
      });

      return;
    }

    onStartGame({
      mode: selectedMode,
      difficulty,
      duration,
    });
  };

  // ----------------------------------
  // UI
  // ----------------------------------

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        alignItems: "center",
        backgroundColor: "#f2f2f2",
      }}
    >
      {/* Título */}
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

      {/* Selección de modo */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          width: "90%",
          marginBottom: 25,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>
          🎮 Modo de juego
        </Text>

        {[
          { key: "free", label: "Modo libre (1 o 2 minutos)" },
          { key: "timeattack", label: "Contrarreloj (1 minuto fijo)" },
          { key: "custom", label: "Personalizado (elige tus reglas)" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setSelectedMode(opt.key as MenuMode)}
            style={{
              padding: 10,
              borderRadius: 8,
              marginBottom: 8,
              backgroundColor:
                selectedMode === opt.key ? "#4caf50" : "#eee",
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

      {/* Dificultad */}
      {selectedMode !== "custom" && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "90%",
            marginBottom: 25,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>
            ⚙️ Dificultad
          </Text>

          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setDifficulty(n)}
              style={{
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: difficulty === n ? "#2196f3" : "#eee",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: difficulty === n ? "#fff" : "#333",
                }}
              >
                {["Muy fácil", "Fácil", "Media", "Difícil", "Experto"][n - 1]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Duración */}
      {(selectedMode === "free" || selectedMode === "custom") && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "90%",
            marginBottom: 25,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>
            ⏱️ Duración
          </Text>

          {[60, 120].map((sec) => (
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

      {/* Config custom */}
      {selectedMode === "custom" && (
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            width: "90%",
            marginBottom: 25,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 15 }}>
            ⚙️ Configuración personalizada
          </Text>

          {/* Sumas / Restas */}
          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
          >
            <Switch value={sumEnabled} onValueChange={setSumEnabled} />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Sumas</Text>
          </View>

          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
          >
            <Switch value={subEnabled} onValueChange={setSubEnabled} />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Restas</Text>
          </View>

          {/* Llevadas */}
          <View
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
          >
            <Switch value={carryEnabled} onValueChange={setCarryEnabled} />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Incluir llevadas</Text>
          </View>

          {/* Tipos de operador */}
          <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 10 }}>
            Tipo de operadores
          </Text>

          {(
            [
              ["small", "Unidades (1–9)"],
              ["medium", "Medianos (10–20)"],
              ["large", "Mayores (20–50)"],
              ["xlarge", "Más grandes (50–100)"],
              ["unlimited", "Sin límite (100–1000)"],
            ] as const
          ).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setSelectedOperatorType(key)}
              style={{
                padding: 10,
                borderRadius: 8,
                marginBottom: 6,
                backgroundColor:
                  selectedOperatorType === key ? "#3b82f6" : "#eee",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: selectedOperatorType === key ? "#fff" : "#333",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Botón comenzar */}
      <TouchableOpacity
        onPress={handleStart}
        disabled={!selectedMode}
        style={{
          backgroundColor: selectedMode ? "#4caf50" : "#aaa",
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
