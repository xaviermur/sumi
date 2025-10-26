import React, { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { parseSpanishNumber } from "../utils/parseSpanishNumber";
import { generateOperation } from "../core/logic/generateOperation";
import LeftPanel from "./../components/LeftPanel";
import RightPanel from "./../components/RightPanel";

export default function GameScreen({ onExit }: { onExit: () => void }) {
  const [operation, setOperation] = useState(generateOperation());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState("0:00");

  const [lastResult, setLastResult] = useState<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const operationRef = useRef(operation);

  useEffect(() => {
    operationRef.current = operation;
  }, [operation]);

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

      setOperation(generateOperation());
    });

  // Cronómetro
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

  const handleReset = () => {
    stopListening();
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setStartTime(null);
    setElapsed("0:00");
    setOperation(generateOperation());
    setLastResult(null);
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: "#f2f2f2", padding: 20 }}>
      <LeftPanel
        listening={listening}
        supported={supported}
        startListening={startListening}
        stopListening={stopListening}
        correct={correct}
        wrong={wrong}
        elapsed={elapsed}
        onReset={handleReset}
        onExit={onExit}
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
