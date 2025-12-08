// src/hooks/useSpeechRecognition.ts
import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import Voice from "@react-native-voice/voice";
import { MicState } from "@/core/types/audio";

// Activa/desactiva logs aquí
const DEBUG_SPEECH = true;

function log(...args: any[]) {
  if (DEBUG_SPEECH) console.log("[🎤 Speech]", ...args);
}

export function useSpeechRecognition(onStableText: (text: string) => void) {
  const [micState, setMicState] = useState<MicState>("idle");

  const isWeb = Platform.OS === "web";

  const stableTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCleanRef = useRef("");
  const keepAliveRef = useRef(false);

  // --------------------------------------------------------
  // PARSER UNIVERSAL
  // --------------------------------------------------------
  function parseSpokenNumber(input: string): number | null {
    if (!input) return null;

    const txt = input.toLowerCase().replace(/,/g, " ").replace(/\s+/g, " ").trim();
    const cleaned = txt.replace(/resultado|es|igual|igual a|da|de|el|la/gi, "").trim();

    const numericMatch = cleaned.match(/(\d+)\s*$/);
    if (numericMatch) {
      const n = Number(numericMatch[1]);
      log("→ parser detecta número:", n);
      return n;
    }

    const words = cleaned.split(" ");
    const map: Record<string, number> = {
      cero: 0, uno: 1, un: 1, una: 1, dos: 2, tres: 3,
      cuatro: 4, cinco: 5, seis: 6, siete: 7, ocho: 8, nueve: 9,
      diez: 10, once: 11, doce: 12, trece: 13, catorce: 14, quince: 15,
      dieciseis: 16, dieciséis: 16, diecisiete: 17, dieciocho: 18, diecinueve: 19,
      veinte: 20, veintiuno: 21, veintidos: 22, veintidós: 22,
      veintitres: 23, veintitrés: 23, veinticuatro: 24, veinticinco: 25,
      veintiseis: 26, veintiséis: 26, veintisiete: 27, veintiocho: 28,
      veintinueve: 29, treinta: 30, cuarenta: 40, cincuenta: 50,
      sesenta: 60, setenta: 70, ochenta: 80, noventa: 90, cien: 100
    };

    for (let i = words.length - 1; i >= 0; i--) {
      const w = words[i];
      if (map[w] != null) {
        const n = map[w];
        log("→ parser detecta palabra:", w, "=", n);
        return n;
      }
    }

    return null;
  }

  // --------------------------------------------------------
  // ANTI-RUIDO / ANTI-CRECIMIENTO
  // --------------------------------------------------------
  function cleanPartial(raw: string): string {
    let txt = raw.toLowerCase().trim();
    const parts = txt.split(" ");

    // Eliminar duplicados contiguos
    txt = parts.filter((v, i) => i === 0 || v !== parts[i - 1]).join(" ");

    // Evitar saltos tipo: "9" → "99" → "999"
    if (txt.length > lastCleanRef.current.length + 4) {
      log("⚠ ruido detectado (crecimiento súbito):", raw);
      return lastCleanRef.current;
    }

    lastCleanRef.current = txt;
    return txt;
  }

  // --------------------------------------------------------
  // HANDLE PARTIAL
  // --------------------------------------------------------
  function handlePartialText(text: string) {
    const alive = keepAliveRef.current; // ← CIERRE FIJO
    if (!alive) {
      log("↩ Ignorando parcial (keepAlive=false)", text);
      return;
    }

    log("Parcial crudo:", text);

    const cleaned = cleanPartial(text);
    log("Parcial limpio:", cleaned);

    if (stableTimeoutRef.current) clearTimeout(stableTimeoutRef.current);

    stableTimeoutRef.current = setTimeout(() => {
      const aliveNow = keepAliveRef.current; // ← CIERRE ACTUALIZADO
      if (!aliveNow) {
        log("↩ Timeout activado pero keepAlive=false. Ignorado.");
        return;
      }

      const parsed = parseSpokenNumber(cleaned);
      if (parsed != null) {
        log("✔ Texto estable detectado →", parsed);
        onStableText(String(parsed));
      } else {
        log("❌ No se pudo parsear:", cleaned);
      }
    }, 400);
  }

  // --------------------------------------------------------
  // INIT NATIVO
  // --------------------------------------------------------
  function initNative() {
    Voice.onSpeechStart = () => {
      log("🎤 onSpeechStart");
      setMicState("listening");
    };

    Voice.onSpeechRecognized = () => log("🎤 onSpeechRecognized");

    Voice.onSpeechPartialResults = (e) => {
      const alive = keepAliveRef.current; // ← CIERRE FIJO
      if (!alive) {
        log("↩ Parcial ignorado (keepAlive=false)");
        return;
      }

      const t = e.value?.[0] ?? "";
      log("🎤 Parcial:", t);
      if (t) handlePartialText(t);
    };

    Voice.onSpeechResults = (e) => {
      const alive = keepAliveRef.current; // ← CIERRE FIJO
      if (!alive) {
        log("↩ Resultado final ignorado (keepAlive=false)");
        return;
      }

      const t = e.value?.[0] ?? "";
      log("🎤 Resultado final:", t);
      if (t) handlePartialText(t);
    };

    Voice.onSpeechError = (e) => {
      log("❌ SpeechError:", e);
      keepAliveRef.current = false;
      setMicState("idle");
    };
  }

  // --------------------------------------------------------
  // INIT EFFECT
  // --------------------------------------------------------
  useEffect(() => {
    if (!isWeb) initNative();

    return () => {
      if (stableTimeoutRef.current) clearTimeout(stableTimeoutRef.current);
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // --------------------------------------------------------
  // START / STOP
  // --------------------------------------------------------
  async function startListening() {
    log("▶ startListening()");
    keepAliveRef.current = true;
    lastCleanRef.current = "";

    try {
      await Voice.start("es-ES", {
        RECOGNIZER_ENGINE: "apple",
        EXTRA_PARTIAL_RESULTS: true,
      });
      log("✔ Engine iniciado");
    } catch (err) {
      log("❌ Error al iniciar:", err);
      keepAliveRef.current = false;
      setMicState("idle");
    }
  }

  async function stopListening() {
    log("⏹ stopListening()");
    keepAliveRef.current = false;

    if (stableTimeoutRef.current) {
      clearTimeout(stableTimeoutRef.current);
      stableTimeoutRef.current = null;
    }

    try {
      await Voice.stop();
      log("✔ Engine detenido");
    } catch (err) {
      log("❌ Error al detener:", err);
    }

    setMicState("idle");
  }

  return {
    micState,
    listening: micState === "listening",
    startListening,
    stopListening,
  };
}
