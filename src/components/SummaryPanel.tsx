// src/components/SummaryPanel.tsx
import React from "react";
import { View, Text, Button } from "react-native";

type SummaryPanelProps = {
  correct: number;
  wrong: number;
  onRetry: () => void;
  onExit: () => void;
  // opcionales
  title?: string;              // ej. "⏱️ ¡Tiempo terminado!"
  durationSeconds?: number;    // ej. 60 (para mostrar 1:00)
};

export default function SummaryPanel({
  correct,
  wrong,
  onRetry,
  onExit,
  title = "⏱️ ¡Tiempo terminado!",
  durationSeconds,
}: SummaryPanelProps) {
  const formatSec = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 20 }}>{title}</Text>

      {typeof durationSeconds === "number" && (
        <Text style={{ fontSize: 16, marginBottom: 8 }}>
          🕒 Duración: {formatSec(durationSeconds)}
        </Text>
      )}

      <Text style={{ fontSize: 18 }}>✅ Aciertos: {correct}</Text>
      <Text style={{ fontSize: 18, marginTop: 4 }}>❌ Errores: {wrong}</Text>

      <View style={{ marginTop: 20, width: "80%" }}>
        <Button title="Jugar otra vez" onPress={onRetry} />
        <View style={{ height: 10 }} />
        <Button title="Volver al menú" onPress={onExit} />
      </View>
    </View>
  );
}
