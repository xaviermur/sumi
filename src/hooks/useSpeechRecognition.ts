import { useState, useRef, useEffect } from "react";

/**
 * Hook de reconocimiento de voz robusto y compatible.
 * - Crea SpeechRecognition solo en el navegador real (no SSR ni prerender)
 * - Evita crash por ejecución temprana
 * - Detecta soporte real de la API
 */
export function useSpeechRecognition(onResult: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Evitar ejecución en SSR o entornos sin window
    if (typeof window === "undefined") return;

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      console.warn("❌ SpeechRecognition API no soportada.");
      setSupported(false);
      return;
    }

    try {
      recognitionRef.current = new SR();
      recognitionRef.current.lang = "es-ES";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      setSupported(true);
      console.info("✅ SpeechRecognition inicializado correctamente");
    } catch (err) {
      console.error("⚠️ Error al crear SpeechRecognition:", err);
      setSupported(false);
    }

    return () => {
      // limpieza al desmontar
      if (recognitionRef.current) {
        recognitionRef.current.abort?.();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      console.warn("SpeechRecognition no inicializado o no soportado");
      return;
    }

    const recognition = recognitionRef.current;
    let gotResult = false;
    let timeoutHandle: any;

    recognition.onstart = () => {
      console.info("🎙️ Reconocimiento iniciado");
      setListening(true);
      gotResult = false;
    };

    recognition.onspeechstart = () => console.info("🎤 Se detectó voz");
    recognition.onspeechend = () => {
      console.info("🔇 Fin de voz detectada (esperando resultado)");
      timeoutHandle = setTimeout(() => {
        if (!gotResult) {
          console.warn("⚠️ No se recibió resultado, reiniciando...");
          recognition.stop();
          startListening();
        }
      }, 800);
    };

    recognition.onresult = (event: any) => {
      gotResult = true;
      clearTimeout(timeoutHandle);
      const text = event.results[0][0].transcript.toLowerCase();
      console.info("✅ Texto reconocido:", text);
      onResult(text);
      recognition.stop();
    };

    recognition.onerror = (e: any) => {
      clearTimeout(timeoutHandle);
      console.error("⚠️ Error de reconocimiento:", e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        alert("No se puede acceder al micrófono. Revisa los permisos del navegador.");
      }
      setListening(false);
    };

    recognition.onend = () => {
      clearTimeout(timeoutHandle);
      console.info("🛑 Reconocimiento finalizado");
      setListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("⚠️ Error al iniciar reconocimiento:", err);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setListening(false);
  };

  return { listening, supported, startListening, stopListening };
}
