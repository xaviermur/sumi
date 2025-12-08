import { useState, useRef } from "react";
import { VoiceProcessor } from "@picovoice/react-native-voice-processor";
import { useWhisper } from "../speech/WhisperProvider";
import type { MicState } from "@/core/types/audio";

const SILENCE_FRAMES = 12;      // ~0.2s de silencio
const MIN_FRAMES = 20;          // evitar ruido / frase mínima
const FRAME_LENGTH = 512;
const SAMPLE_RATE = 16000;

export function useWhisperRecognition(onText: (t: string) => void) {
  const { transcribe, ready } = useWhisper();

  const [micState, setMicState] = useState<MicState>("idle");
  const [listening, setListening] = useState(false);

  const bufferRef = useRef<Float32Array[]>([]);
  const silenceRef = useRef(0);
  const runningRef = useRef(false);

  // -------------------------------------------------
  // Procesar frame PCM (number[] -> Float32Array)
  // -------------------------------------------------
  const onFrame = (frame: number[]) => {
    if (!runningRef.current || !ready) return;

    // Normalizar a float32
    const buf = new Float32Array(frame.length);
    for (let i = 0; i < frame.length; i++) {
      buf[i] = frame[i] / 32768;
    }

    bufferRef.current.push(buf);

    // RMS para detectar silencios
    const rms = Math.sqrt(buf.reduce((s, v) => s + v * v, 0) / buf.length);

    if (rms < 0.002) silenceRef.current++;
    else silenceRef.current = 0;

    // FIN de frase detectado
    if (silenceRef.current >= SILENCE_FRAMES) {
      stopListening();

      const audio = mergeBuffers(bufferRef.current);
      bufferRef.current = [];

      if (audio.length > MIN_FRAMES * FRAME_LENGTH) {
        transcribe(audio).then(onText);
      }
    }
  };

  const mergeBuffers = (chunks: Float32Array[]) => {
    const total = chunks.reduce((s, c) => s + c.length, 0);
    const out = new Float32Array(total);
    let offset = 0;

    for (const c of chunks) {
      out.set(c, offset);
      offset += c.length;
    }
    return out;
  };

  // -------------------------------------------------
  // Arrancar grabación
  // -------------------------------------------------
  const startListening = async () => {
    if (!ready) return;
    if (runningRef.current) return;

    // Permiso micrófono
    const ok = await VoiceProcessor.instance.hasRecordAudioPermission();
    if (!ok) {
      console.warn("No hay permiso micrófono");
      return;
    }

    bufferRef.current = [];
    silenceRef.current = 0;

    runningRef.current = true;
    setListening(true);
    setMicState("listening");

    VoiceProcessor.instance.addFrameListener(onFrame);

    // 🔥 TU API REAL: start(frameLength, sampleRate)
    await VoiceProcessor.instance.start(FRAME_LENGTH, SAMPLE_RATE);
  };

  // -------------------------------------------------
  // Parar grabación
  // -------------------------------------------------
  const stopListening = async () => {
    if (!runningRef.current) return;

    runningRef.current = false;
    setListening(false);
    setMicState("idle");

    // 🔥 Debe remover frameListener específico
    VoiceProcessor.instance.removeFrameListener(onFrame);

    await VoiceProcessor.instance.stop();
  };

  return {
    ready,
    listening,
    micState,
    startListening,
    stopListening,
  };
}
