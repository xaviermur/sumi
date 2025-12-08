import { useEffect, useRef } from "react";
import { VoiceProcessor } from "@picovoice/react-native-voice-processor";

type Options = {
  frameLength?: number;
  sampleRate?: number;
  onFrame: (pcm: Float32Array) => void;  // ← ESTA ES LA CALLBACK
};

export function useWhisperAudioStream({
  frameLength = 512,
  sampleRate = 16000,
  onFrame,            // ← AQUÍ SE RECIBE CORRECTAMENTE
}: Options) {
  const isRunning = useRef(false);

  useEffect(() => {
    if (isRunning.current) return;
    isRunning.current = true;

    // 🔊 Listener correcto: recibe number[]
    function onAudioFrame(frame: number[]) {
      // Convertir number[] → Float32Array normalizada
      const floatBuf = new Float32Array(frame.length);
      for (let i = 0; i < frame.length; i++) {
        floatBuf[i] = frame[i] / 32768; // normalización
      }

      // 👇 Ahora sí existe: se recibió arriba en (onFrame)
      onFrame(floatBuf);
    }

    const vp = VoiceProcessor.instance;

    vp.addFrameListener(onAudioFrame);
    vp.start(frameLength, sampleRate);

    return () => {
      vp.stop().catch(() => {});
      vp.removeFrameListener(onAudioFrame);
      isRunning.current = false;
    };
  }, [frameLength, sampleRate, onFrame]);
}
