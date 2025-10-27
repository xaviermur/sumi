import React from "react";
import { View, Text, Button } from "react-native";
import { LevelConfig } from "../core/logic/levels";

type LeftPanelProps = {
  listening: boolean;
  supported: boolean;
  startListening: () => void;
  stopListening: () => void;
  correct: number;
  wrong: number;
  elapsed: string;
  onReset: () => void;
  onExit: () => void;

  // 🔹 Props opcionales para los distintos modos
  mode?: "free" | "timed" | "levels" | "timeattack";
  level?: LevelConfig;
  onIncreaseLevel?: () => void;
  onDecreaseLevel?: () => void;
};

export default function LeftPanel({
  listening,
  supported,
  startListening,
  stopListening,
  correct,
  wrong,
  elapsed,
  onReset,
  onExit,
  mode = "timed",
  level,
  onIncreaseLevel,
  onDecreaseLevel,
}: LeftPanelProps) {
  // Detectar si es contrarreloj y quedan menos de 10 segundos
  const remainingSeconds =
    mode === "timeattack" ? parseInt(elapsed.replace(/\D/g, "")) || 0 : null;
  const timeColor =
    mode === "timeattack" && remainingSeconds !== null && remainingSeconds <= 10
      ? "red"
      : "#000";

  const showLevelControls = mode === "free" || mode === "timeattack";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        marginRight: 10,
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      {/* 🎙️ MICRÓFONO */}
      <View>
        <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "600" }}>
          🎙️ Micrófono
        </Text>
        <Button
          title={listening ? "🔇 Apagar micro" : "🎤 Encender micro"}
          onPress={() => (listening ? stopListening() : startListening())}
          disabled={!supported}
        />
      </View>

      {/* 📊 INFORMACIÓN */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontSize: 20 }}>✅ Aciertos: {correct}</Text>
        <Text style={{ fontSize: 20, marginTop: 4 }}>❌ Errores: {wrong}</Text>
        <Text
          style={{
            fontSize: 20,
            marginTop: 4,
            color: timeColor,
            fontWeight: mode === "timeattack" ? "700" : "normal",
          }}
        >
          ⏱️ Tiempo: {elapsed}
        </Text>

        {/* 🔹 Mostrar controles de nivel si procede */}
        {showLevelControls && level && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}>
              ⚙️ Dificultad
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: level.color,
              }}
            >
              {level.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                marginTop: 2,
              }}
            >
              {level.description}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Button title="⬇️ Nivel -" onPress={onDecreaseLevel} />
              <Button title="⬆️ Nivel +" onPress={onIncreaseLevel} />
            </View>
          </View>
        )}
      </View>

      {/* 🔁 ACCIONES */}
      <View>
        <Button
          title={
            mode === "timeattack" ? "🔁 Reiniciar ronda" : "🔁 Empezar de nuevo"
          }
          onPress={onReset}
        />
        <View style={{ height: 10 }} />
        <Button title="🏠 Volver al menú" onPress={onExit} />
      </View>
    </View>
  );
}
