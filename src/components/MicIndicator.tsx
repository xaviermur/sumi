import React from "react";
import { Text, View } from "react-native";

export default function MicIndicator({ micState }: { micState: string }) {
  let text = "";
  switch (micState) {
    case "waiting":
      text = "🎤 Esperando…";
      break;
    case "listening":
      text = "👂 Escuchando…";
      break;
    case "processing":
      text = "⏳ Procesando…";
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
