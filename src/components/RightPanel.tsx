import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, useWindowDimensions } from "react-native";
import LottieView from "lottie-react-native";
import LastResultPanel from "./LastResultPanel";
import { Operation } from "../core/types/operation";
import { MicState } from "@/core/types/audio";

type RightPanelProps = {
  operation: Operation;
  micState: MicState;
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

  const { height, width } = useWindowDimensions();
  const isSmallScreen = height < 700;

  const aStr = operation.num1.toString();
  const bStr = operation.num2.toString();
  const maxLen = Math.max(aStr.length, bStr.length);
  const paddedA = aStr.padStart(maxLen, " ");
  const paddedB = bStr.padStart(maxLen, " ");

  // Animación entrada operación
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
    ]).start();
  }, [operation]);

  // Feedback animado
  useEffect(() => {
    if (!feedback) return;

    const isCorrect = feedback.startsWith("✅");
    setEffect(isCorrect ? "success" : "error");
    bgColor.setValue(isCorrect ? 1 : -1);

    Animated.timing(bgColor, { toValue: 0, duration: 400, useNativeDriver: false }).start();

    const timeout = setTimeout(() => setEffect(null), 1200);
    return () => clearTimeout(timeout);
  }, [feedbackId]);

  const interpolatedBg = bgColor.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ["#ffdddd", "#ffffff", "#ddffdd"],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: interpolatedBg,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: "center",
        justifyContent: "flex-start",
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {/* Estado micro */}
      <Text
        style={{
          fontSize: isSmallScreen ? 14 : 18,
          fontWeight: "600",
          marginBottom: 10,
          color:
            micState === "idle"
              ? "green"        // normalmente no se verá porque filtramos arriba
              : micState === "listening"
                ? "#e6b800"
                : "#e67e22",
        }}
      >
        {micState === "idle"
          ? "🎤 Esperando..."
          : micState === "listening"
            ? "🎧 Escuchando..."
            : "⚠️ Error en el micrófono"}
      </Text>

      {/* Operación centrada */}
      <View style={{ alignItems: "flex-end", marginTop: 10 }}>
        <Text style={{ fontSize: isSmallScreen ? 38 : 48, fontFamily: "monospace" }}>
          {paddedA}
        </Text>

        <Text style={{ fontSize: isSmallScreen ? 38 : 48, fontFamily: "monospace" }}>
          {(operation.opType === "sum" ? "+" : "-") + " " + paddedB}
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

      {/* Feedback flotante (sin cortar) */}
      {feedback && (
        <Text
          style={{
            fontSize: isSmallScreen ? 26 : 36,
            fontWeight: "700",
            color: feedback.startsWith("✅") ? "#2e7d32" : "#c62828",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {feedback}
        </Text>
      )}

      {/* Lottie animación (posición segura, sin % !!!) */}
      {effect && (
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
            height: isSmallScreen ? 180 : 260,
            width: isSmallScreen ? 180 : 260,
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
      {lastResult && (
        <View style={{ marginTop: 10 }}>
          <LastResultPanel lastResult={lastResult} />
        </View>
      )}
    </Animated.View>
  );
}
