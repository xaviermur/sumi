import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import LottieView from "lottie-react-native";
import LastResultPanel from "./LastResultPanel";
import { Operation } from "../core/types/operation";

type RightPanelProps = {
  operation: Operation;
  micState: "idle" | "waiting" | "listening" | "processing";
  feedback: string | null;
  feedbackId?: number;
  lastResult: Operation | null;
};

export default function RightPanel({
  operation,
  micState,
  feedback,
  feedbackId,
  lastResult,
}: RightPanelProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const bgColor = useRef(new Animated.Value(0)).current;
  const [effect, setEffect] = useState<"success" | "error" | null>(null);

  const aStr = operation.num1.toString();
  const bStr = operation.num2.toString();
  const maxLen = Math.max(aStr.length, bStr.length);
  const paddedA = aStr.padStart(maxLen, " ");
  const paddedB = bStr.padStart(maxLen, " ");

  // Animación de entrada de operación
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [operation]);

  // Animación visual de feedback
  useEffect(() => {
    if (!feedback) return;
    const isCorrect = feedback.startsWith("✅");
    setEffect(isCorrect ? "success" : "error");
    bgColor.setValue(isCorrect ? 1 : -1);

    Animated.timing(bgColor, { toValue: 0, duration: 400, useNativeDriver: false }).start();

    const timeout = setTimeout(() => setEffect(null), 1200);
    return () => clearTimeout(timeout);
  }, [feedbackId]); // 👈 importante, para que se repita aunque el feedback sea igual

  const interpolatedBg = bgColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["#ffdddd", "#ffffff", "#ddffdd"],
  });

  return (
    <Animated.View
      style={{
        flex: 2,
        backgroundColor: interpolatedBg,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* Mic status */}
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

      {/* Operación */}
      <View style={{ alignItems: "flex-end" }}>
        <Text style={{ fontSize: 48, fontFamily: "monospace" }}>{paddedA}</Text>
        <Text style={{ fontSize: 48, fontFamily: "monospace" }}>
          {`${operation.opType === "sum" ? "+" : "-"} ${paddedB}`}
        </Text>
        <View
          style={{
            width: "100%",
            borderBottomColor: "black",
            borderBottomWidth: 3,
            marginTop: 4,
          }}
        />
      </View>

      {/* Feedback */}
      {feedback && (
        <Text
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 36,
            fontWeight: "700",
            color: feedback.startsWith("✅") ? "#2e7d32" : "#c62828",
            textShadowColor: "rgba(0,0,0,0.2)",
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}
        >
          {feedback}
        </Text>
      )}

      {/* 🎉 Animación Lottie */}
      {effect && (
        <View
          style={{
            position: "absolute",
            top: "20%",
            width: 300,
            height: 300,
            pointerEvents: "none",
          }}
        >
          <LottieView
            source={
              effect === "success"
                ? require("../../assets/animations/happy.json")
                : require("../../assets/animations/sad.json")
            }
            autoPlay
            loop={false}
          />
        </View>
      )}

      {/* Último resultado */}
      {lastResult && <LastResultPanel lastResult={lastResult} />}
    </Animated.View>
  );
}
