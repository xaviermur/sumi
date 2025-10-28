import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, Switch } from "react-native";

export default function MenuScreen({
  onStartGame,
  onShowRecords, // 🆕 nuevo prop
}: {
  onStartGame: (options?: any) => void;
  onShowRecords: () => void; // 🆕 callback
}) {
  const [selectedMode, setSelectedMode] = useState<
    "free" | "timed" | "levels" | "custom" | null
  >(null);
  const [difficulty, setDifficulty] = useState<number>(1);
  const [duration, setDuration] = useState<number>(60);

  // ⚙️ Custom config
  const [sumEnabled, setSumEnabled] = useState(true);
  const [subEnabled, setSubEnabled] = useState(false);
  const [carryEnabled, setCarryEnabled] = useState(false);
  const [selectedOperatorType, setSelectedOperatorType] = useState<
    "small" | "medium" | "large" | "xlarge" | "unlimited"
  >("small");

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

  const handleStart = () => {
    if (selectedMode === "custom") {
      const types: ("sum" | "sub")[] = [];
      if (sumEnabled) types.push("sum");
      if (subEnabled) types.push("sub");

      const baseRange = operatorRanges[selectedOperatorType];
      const overflowMin = overflowMinByType[selectedOperatorType];

      const customOptions = {
        type: types.length ? types : ["sum"],
        range1: baseRange,
        range2: baseRange,
        overflowDigits: carryEnabled ? [overflowMin, overflowMin] : [0, 0],
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
          { key: "free", label: "Modo libre (1 o 2 minutos)" },
          { key: "timed", label: "Contrarreloj (1 minuto fijo)" },
          { key: "custom", label: "Personalizado (elige tus reglas)" },
        ].map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setSelectedMode(opt.key as any)}
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

      {/* ⚙️ Dificultad */}
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

      {/* ⏱️ Duración (solo libre o custom) */}
      {(selectedMode === "free" || selectedMode === "custom") && (
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

      {/* ⚙️ Configuración personalizada */}
      {selectedMode === "custom" && (
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
            ⚙️ Configuración personalizada
          </Text>

          {/* Tipo de operaciones */}
          <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 10 }}>
            Tipo de operaciones
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
            <Switch value={sumEnabled} onValueChange={setSumEnabled} />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Sumas</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
            <Switch value={subEnabled} onValueChange={setSubEnabled} />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Restas</Text>
          </View>

          {/* Llevadas */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <Switch value={carryEnabled} onValueChange={setCarryEnabled} />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Incluir llevadas</Text>
          </View>

          {/* Operadores */}
          <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 10 }}>
            Tipo de operadores
          </Text>
          {[
            { key: "small", label: "Unidades (1–9)" },
            { key: "medium", label: "Medianos (10–20)" },
            { key: "large", label: "Mayores (20–50)" },
            { key: "xlarge", label: "Más grandes (50–100)" },
            { key: "unlimited", label: "Sin límite (100–1000)" },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() =>
                setSelectedOperatorType(opt.key as typeof selectedOperatorType)
              }
              style={{
                padding: 10,
                borderRadius: 8,
                marginBottom: 6,
                backgroundColor:
                  selectedOperatorType === opt.key ? "#3b82f6" : "#eee",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: selectedOperatorType === opt.key ? "#fff" : "#333",
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 🚀 Botón Comenzar */}
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

      {/* 🏆 Ver récords */}
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
    </View>
  );
}
