import React from "react";
import { View, Text } from "react-native";
import LastResultPanel from "./LastResultPanel";
import { Operation } from "../core/types/operation";

type RightPanelProps = {
  operation: Operation;
  micState: "idle" | "waiting" | "listening" | "processing";
  feedback: string | null;
  lastResult: Operation | null;
};

export default function RightPanel({ operation, micState, feedback, lastResult }: RightPanelProps) {
  const aStr = operation.num1.toString();
  const bStr = operation.num2.toString();
  const maxLen = Math.max(aStr.length, bStr.length);
  const paddedA = aStr.padStart(maxLen, " ");
  const paddedB = bStr.padStart(maxLen, " ");

  return (
    <View
      style={{
        flex: 2,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {micState !== "idle" && (
        <View style={{ position: "absolute", top: 10, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color:
                micState === "waiting"
                  ? "green"
                  : micState === "listening"
                    ? "#e6b800"
                    : "#e67e22",
            }}
          >
            {micState === "waiting"
              ? "🎤 Esperando..."
              : micState === "listening"
                ? "🎧 Escuchando..."
                : "🧠 Procesando..."}
          </Text>
        </View>
      )}

      {/* Operación principal */}
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 48, fontFamily: "monospace" }}>{paddedA}</Text>
        <Text style={{ fontSize: 48, fontFamily: "monospace" }}>
          {`${operation.opType == "sum" ? "+" : "-"} ${paddedB}`}
        </Text>
        <View style={{ width: "100%", borderBottomColor: "black", borderBottomWidth: 3, marginTop: 4 }} />
      </View>

      {/* Feedback */}
      {feedback && (
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 32,
            color: feedback.startsWith("✅") ? "green" : "red",
            fontWeight: "600",
          }}
        >
          {feedback}
        </Text>
      )}

      {/* Mini panel de resultado */}
      {lastResult && <LastResultPanel lastResult={lastResult} />}
    </View>
  );
}
