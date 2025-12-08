import { useState, useRef } from "react";
import { VoiceProcessor } from "@picovoice/react-native-voice-processor";
import { useCheetah } from "../speech/CheetahProvider";
import type { MicState } from "@/core/types/audio";

export function useCheetahRecognition(onStableText: (t: string) => void) {
  const cheetah = useCheetah(); // 👈 ya no es never
  const vp = VoiceProcessor.instance;

  const [micState, setMicState] = useState<MicState>("idle");
  const isRunning = useRef(false);

  async function processFrame(frame: Int16Array) {
    if (!cheetah) return;   // 👈 evita never

    const result = await cheetah.process(frame);
    if (result.transcript.trim()) onStableText(result.transcript.trim());

    if (result.isEndOfUtterance) {
      const flush = await cheetah.flush();
      if (flush.transcript.trim()) onStableText(flush.transcript.trim());
    }
  }

  function startListening() {
    if (!cheetah || isRunning.current) return;

    isRunning.current = true;
    setMicState("listening");

    vp.addFrameListener(processFrame);

    // 👇 API correcta:
    vp.start(512, 16000);
  }

  function stopListening() {
    if (!isRunning.current) return;
    isRunning.current = false;

    // 👇 API correcta:
    vp.stop(true);
    vp.removeFrameListener();

    setMicState("idle");
  }

  return {
    micState,
    startListening,
    stopListening,
  };
}
