import React from "react";
import { Text, View } from "react-native";
import type { MicState } from "@/core/types/audio";

export default function MicIndicator({ micState }: { micState: MicState }) {
  let text = "";

  switch (micState) {
    case "idle":
      text = "🎤 Esperando…"; // equivalente a "waiting"
      break;
    case "listening":
      text = "👂 Escuchando…";
      break;
    case "error":
      text = "⚠️ Error de micrófono";
      break;
    default:
      text = "Micro inactivo";
  }

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 20, textAlign: "center" }}>{text}</Text>
    </View>
  );
}
