import { useState, useRef, useEffect } from "react";

export function useSpeechRecognition(onCommand: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const readyRef = useRef(true); // evita start durante apagado

  const createRecognition = () => {
    const SR =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return null;

    const recognition = new SR();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = false;

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
    };

    recognition.onstart = () => {
      console.info("🎙️ Reconocimiento iniciado");
      readyRef.current = true;
      setListening(true);
    };

    recognition.onerror = (e: any) => {
      if (e.error === "aborted") {
        console.info("ℹ️ Abortado (sin error)");
        return;
      }
      console.error("⚠️ Error VR:", e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        alert("No se puede acceder al micrófono. Revisa los permisos del navegador.");
      }
      setListening(false);
    };

    recognition.onend = () => {
      console.info("🛑 Reconocimiento detenido");
      setListening(false);
      readyRef.current = true;
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

    recognitionRef.current = createRecognition();
    setSupported(true);

    return () => {
      recognitionRef.current?.abort?.();
      recognitionRef.current = null;
    };
  }, []);

  const startListening = () => {
    if (!supported) return;
    if (!readyRef.current) {
      console.warn("⚠️ Esperando fin de sesión anterior...");
      return;
    }

    try {
      if (!recognitionRef.current) {
        recognitionRef.current = createRecognition();
      }
      readyRef.current = false;
      // 🔸 pequeño retraso por seguridad
      setTimeout(() => {
        recognitionRef.current?.start?.();
      }, 300);
    } catch (err) {
      console.error("⚠️ Error al iniciar:", err);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    readyRef.current = false;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.warn("⚠️ Error al detener:", err);
    }
  };

  return { listening, supported, startListening, stopListening };
}
