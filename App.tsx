import React, { useRef, useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useSpeechRecognition } from "./src/hooks/useSpeechRecognition";
import { parseSpanishNumber } from "./src/utils/parseSpanishNumber";

// --- Generador de operaciones ---
function randomOperation() {
  const a = Math.floor(Math.random() * 10);
  const b = Math.floor(Math.random() * 10);
  const ops = ["+", "-"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let x = a;
  let y = b;

  if (op === "-" && b > a) {
    x = b;
    y = a;
  }

  const result = op === "+" ? x + y : x - y;
  return { a: x, b: y, op, result };
}

export default function App() {
  // --- Estados principales ---
  const [operation, setOperation] = useState(randomOperation());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState("0:00");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Ref para operación actual ---
  const operationRef = useRef(operation);
  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

  // --- Hook de reconocimiento de voz ---
  const { listening, supported, startListening, stopListening } =
    useSpeechRecognition((text) => {
      const cleaned = text.replace(/^resultado\s*/, "").trim();
      const spokenNumber = parseSpanishNumber(cleaned);
      const expected = Number(operationRef.current.result);

      if (!Number.isFinite(spokenNumber)) {
        setFeedback(`🤔 No entendí el número (“${cleaned}”).`);
        return;
      }

      if (spokenNumber === expected) {
        setFeedback("✅ ¡Correcto!");
        setCorrect((c) => c + 1);
      } else {
        setFeedback(`❌ Incorrecto (${spokenNumber} ≠ ${expected})`);
        setWrong((w) => w + 1);
      }

      setOperation(randomOperation());
    });

  // --- Cronómetro ---
  useEffect(() => {
    if (listening) {
      if (!startTime) setStartTime(new Date());
      timerRef.current = setInterval(() => {
        if (startTime) {
          const diff = Math.floor((Date.now() - startTime.getTime()) / 1000);
          const mins = Math.floor(diff / 60);
          const secs = diff % 60;
          setElapsed(`${mins}:${secs.toString().padStart(2, "0")}`);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [listening, startTime]);

  // --- Reiniciar todo ---
  const handleReset = () => {
    stopListening();
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setStartTime(null);
    setElapsed("0:00");
    setOperation(randomOperation());
  };

  // --- Preparar operación en columna ---
  const aStr = operation.a.toString();
  const bStr = operation.b.toString();
  const maxLen = Math.max(aStr.length, bStr.length);
  const paddedA = aStr.padStart(maxLen, " ");
  const paddedB = bStr.padStart(maxLen, " ");

  return (
    <View
      style={{
        flex: 1,
        flexDirection: window.innerWidth < 600 ? "column" : "row",
        backgroundColor: "#f2f2f2",
        padding: 20,
      }}
    >
      {/* 🟦 PANEL IZQUIERDO */}
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
        <View>
          <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "600" }}>
            🎙️ Micrófono
          </Text>
          <Button
            title={listening ? "🔇 Apagar micro" : "🎤 Encender micro"}
            onPress={() =>
              listening ? stopListening() : startListening()
            }
            disabled={!supported}
          />
        </View>

        <View style={{ marginTop: 30 }}>
          <Text style={{ fontSize: 20 }}>✅ Aciertos: {correct}</Text>
          <Text style={{ fontSize: 20, marginTop: 4 }}>❌ Errores: {wrong}</Text>
          <Text style={{ fontSize: 20, marginTop: 4 }}>⏱️ Tiempo: {elapsed}</Text>
        </View>

        <Button title="🔁 Empezar de nuevo" onPress={handleReset} />
      </View>

      {/* 🟩 PANEL DERECHO */}
      <View
        style={{
          flex: 2,
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 20,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
      >
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: 48,
              fontFamily: "monospace",
              textAlign: "right",
              lineHeight: 56,
            }}
          >
            {paddedA}
          </Text>
          <Text
            style={{
              fontSize: 48,
              fontFamily: "monospace",
              textAlign: "right",
              lineHeight: 56,
            }}
          >
            {`${operation.op} ${paddedB}`}
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

        {feedback && (
          <Text
            style={{
              marginTop: 30,
              fontSize: 32,
              color: feedback.startsWith("✅") ? "green" : "red",
              fontWeight: "600",
            }}
          >
            {feedback}
          </Text>
        )}
      </View>
    </View>
  );
}
