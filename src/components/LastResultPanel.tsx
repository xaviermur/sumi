import React from "react";
import { View, Text } from "react-native";

export default function LastResultPanel({ lastResult }) {
  return (
    <View
      style={{
        position: "absolute",
        right: 20,
        top: "50%",
        transform: [{ translateY: -60 }],
        backgroundColor: lastResult.success ? "#f0fff0" : "#fffaf0",
        borderColor: lastResult.success ? "#0a0" : "#f99",
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        alignItems: "flex-end",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 3,
      }}
    >
      <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
        {`${lastResult.num1}`.padStart(4, " ")}
      </Text>
      <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
        {`${lastResult.opType === "sum" ? "+" : "-"} ${String(lastResult.num2).padStart(3, " ")}`}
      </Text>
      <View
        style={{
          width: "100%",
          borderBottomColor: lastResult.success ? "#0a0" : "#f99",
          borderBottomWidth: 2,
          marginTop: 2,
        }}
      />
      <Text
        style={{
          fontSize: 18,
          color: lastResult.success ? "green" : "#c00",
          marginTop: 2,
        }}
      >
        {lastResult.success ? `✅ ${lastResult.given}` : `❌ ${lastResult.given}`}
      </Text>
      {!lastResult.success && (
        <Text style={{ fontSize: 16, color: "#555" }}>✅ {lastResult.result}</Text>
      )}
    </View>
  );
}
