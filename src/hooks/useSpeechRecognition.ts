import { useState, useRef, useEffect } from "react";

export type MicState = "idle" | "waiting" | "listening" | "processing";

export function useSpeechRecognition(onCommand: (text: string) => void) {
  const [supported, setSupported] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");
  const recognitionRef = useRef<any>(null);
  const keepAliveRef = useRef(false); // 🔁 Mantener vivo mientras micro activo

  const createRecognition = () => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;

    const recognition = new SR();
    recognition.lang = "es-ES";
    recognition.continuous = false; // usamos sesiones cortas + reinicio manual
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.info("🎤 Micro activo (esperando voz)");
      setMicState("waiting");
    };

    recognition.onspeechstart = () => {
      console.info("🎧 Escuchando...");
      setMicState("listening");
    };

    recognition.onspeechend = () => {
      console.info("🧠 Procesando...");
      setMicState("processing");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .toLowerCase()
        .trim();
      console.log("🗣️ Texto detectado:", transcript);

      if (transcript.startsWith("resultado")) {
        console.log("✅ Comando válido:", transcript);
        onCommand(transcript);
      } else {
        console.log("⏭️ Ignorado:", transcript);
      }

      // después de procesar, volvemos a "waiting"
      setMicState("waiting");
    };

    recognition.onerror = (e: any) => {
      if (e.error === "aborted") return; // no pasa nada
      console.error("⚠️ Error VR:", e.error);
      setMicState("waiting");
    };

    recognition.onend = () => {
      console.info("🛑 Reconocimiento finalizado");
      // 👇 Reiniciamos automáticamente si el micro sigue activo
      if (keepAliveRef.current) {
        console.log("♻️ Reiniciando sesión...");
        setTimeout(() => {
          try {
            recognitionRef.current?.start?.();
          } catch (err) {
            console.warn("⚠️ Error reiniciando reconocimiento:", err);
          }
        }, 400);
      } else {
        setMicState("idle");
      }
    };

    return recognition;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      console.warn("❌ SpeechRecognition no soportado.");
      setSupported(false);
      return;
    }
    setSupported(true);
    recognitionRef.current = createRecognition();
    return () => {
      recognitionRef.current?.abort?.();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = () => {
    if (!supported) return;
    keepAliveRef.current = true;
    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("⚠️ Error al iniciar:", err);
    }
  };

  const stopListening = () => {
    keepAliveRef.current = false;
    try {
      recognitionRef.current?.stop?.();
    } catch (err) {
      console.warn("⚠️ Error al detener:", err);
    }
    setMicState("idle");
  };

  const listening = micState !== "idle";

  return { supported, micState, listening, startListening, stopListening };
}
