import React, { useRef, useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { generateOperation } from "../core/logic/generateOperation";
import { LEVELS } from "../core/logic/levels";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";

export default function TimeAttackGameScreen({ onExit }: { onExit: () => void }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [operation, setOperation] = useState(
    generateOperation(LEVELS[levelIndex].options)
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const operationRef = useRef(operation);

  // mantener referencia actualizada
  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

  // 🎙️ reconocimiento de voz
  const { listening, supported, micState, startListening, stopListening } =
    useSpeechRecognition((text) => {
      const cleaned = text.replace(/^resultado\s*/, "").trim();
      const spokenNumber = parseSpanishNumber(cleaned);
      const result = Number(operationRef.current.result);

      if (!Number.isFinite(spokenNumber)) {
        setFeedback(`🤔 No entendí el número (“${cleaned}”).`);
        return;
      }

      const success = spokenNumber === result;

      setFeedback(success ? "✅ ¡Correcto!" : "❌ Incorrecto");
      setCorrect((c) => c + (success ? 1 : 0));
      setWrong((w) => w + (success ? 0 : 1));

      setLastResult({
        ...operationRef.current,
        given: spokenNumber,
        success,
      });

      // nueva operación
      setOperation(generateOperation(LEVELS[levelIndex].options));
    });

  // ⏱️ cuenta regresiva 60 → 0
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          stopListening();
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  // 🔁 reiniciar (opcional)
  const handleReset = () => {
    stopListening();
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setTimeLeft(60);
    setFinished(false);
    setOperation(generateOperation(LEVELS[levelIndex].options));
    setLastResult(null);
  };

  // ⬆️⬇️ cambiar nivel
  const increaseLevel = () => {
    setLevelIndex((prev) => {
      const next = Math.min(prev + 1, LEVELS.length - 1);
      setOperation(generateOperation(LEVELS[next].options));
      return next;
    });
  };

  const decreaseLevel = () => {
    setLevelIndex((prev) => {
      const next = Math.max(prev - 1, 0);
      setOperation(generateOperation(LEVELS[next].options));
      return next;
    });
  };

  // 🏁 resumen final
  if (finished) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f2f2f2",
        }}
      >
        <Text style={{ fontSize: 28, marginBottom: 20 }}>⏱️ ¡Tiempo terminado!</Text>
        <Text style={{ fontSize: 18 }}>✅ Aciertos: {correct}</Text>
        <Text style={{ fontSize: 18 }}>❌ Errores: {wrong}</Text>
        <View style={{ marginTop: 20 }}>
          <Button title="Jugar otra vez" onPress={handleReset} />
          <Button title="Volver al menú" onPress={onExit} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        padding: 20,
      }}
    >
      <LeftPanel
        listening={listening}
        supported={supported}
        startListening={startListening}
        stopListening={stopListening}
        correct={correct}
        wrong={wrong}
        elapsed={`${timeLeft}s`}
        onReset={handleReset}
        onExit={onExit}
        // 🔹 props específicas del modo contrarreloj
        mode="timeattack"
        level={LEVELS[levelIndex]}
        onIncreaseLevel={increaseLevel}
        onDecreaseLevel={decreaseLevel}
      />

      <RightPanel
        operation={operation}
        micState={micState}
        feedback={feedback}
        lastResult={lastResult}
      />
    </View>
  );
}
