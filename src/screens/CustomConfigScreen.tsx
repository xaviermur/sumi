import React, { useState } from "react";
import { View, Text, Button, Switch, TouchableOpacity } from "react-native";

export default function CustomConfigScreen({
  onStart,
}: {
  onStart: (opts: any) => void;
}) {
  const [sumEnabled, setSumEnabled] = useState(true);
  const [subEnabled, setSubEnabled] = useState(false);
  const [carryEnabled, setCarryEnabled] = useState(false);
  const [selectedOperatorType, setSelectedOperatorType] = useState<
    "small" | "medium" | "large" | "xlarge" | "unlimited"
  >("small");

  const [duration, setDuration] = useState(120);

  // Definición de los rangos por categoría
  const operatorRanges: Record<
    typeof selectedOperatorType,
    [number, number]
  > = {
    small: [1, 9],
    medium: [5, 20],
    large: [5, 50],
    xlarge: [5, 99],
    unlimited: [5, 999],
  };

  const overflowMinByType: Record<
    "small" | "medium" | "large" | "xlarge" | "unlimited",
    number
  > = {
    small: 1,
    medium: 1,
    large: 1,
    xlarge: 1,
    unlimited: 2,
  };

  const handleStart = () => {
    const types: ("sum" | "sub")[] = [];
    if (sumEnabled) types.push("sum");
    if (subEnabled) types.push("sub");

    const overflowMin = overflowMinByType[selectedOperatorType];
    const baseRange = operatorRanges[selectedOperatorType];

    const options = {
      type: types.length ? types : ["sum"],
      range1: baseRange,
      range2: baseRange,
      overflowDigits: carryEnabled
        ? [overflowMin, overflowMin]
        : [0, 0],
      resultRange: [baseRange[0], baseRange[1] * 2],
    };

    onStart({
      mode: "custom",
      duration,
      customOptions: options,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f2f2f2",
        padding: 20,
        justifyContent: "flex-start",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 20 }}>
        ⚙️ Modo personalizado
      </Text>

      {/* Tipo de operaciones */}
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
        Tipo de operaciones
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Switch value={sumEnabled} onValueChange={setSumEnabled} />
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Sumas</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Switch value={subEnabled} onValueChange={setSubEnabled} />
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Restas</Text>
      </View>

      {/* Llevadas */}
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 8 }}>
        Acarreos / llevadas
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Switch value={carryEnabled} onValueChange={setCarryEnabled} />
        <Text style={{ marginLeft: 8, fontSize: 16 }}>Incluir llevadas</Text>
      </View>

      {/* Tipo de operadores */}
      <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
        Tipo de operadores
      </Text>

      {[
        { key: "small", label: "Operadores unidades (1–9)" },
        { key: "medium", label: "Operadores medianos (10–20)" },
        { key: "large", label: "Operadores mayores (20–50)" },
        { key: "xlarge", label: "Operadores más grandes (50–100)" },
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
            marginBottom: 8,
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

      {/* Duración fija (por simplicidad) */}
      <View style={{ marginTop: 30, marginBottom: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
          ⏱️ Duración del juego
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
                fontSize: 16,
                color: duration === sec ? "#fff" : "#333",
              }}
            >
              {sec / 60} minuto{sec > 60 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón comenzar */}
      <Button title="🚀 Comenzar" onPress={handleStart} />
    </View>
  );
}
