import { useRef } from "react";
import { useWhisper } from "./WhisperProvider";
import { parseNumberMultilang } from "../utils/parseNumberMultilang";
import type { GameLanguage } from "@/core/types/game";

export function useAutoTranscription({
  lang,
  onNumber,
}: {
  lang: GameLanguage;
  onNumber: (n: number) => void;
}) {
  const { transcribe, ready } = useWhisper();
  const pcmRef = useRef<Float32Array[]>([]);
  const lastProcess = useRef(0);

  // ← esto lo llamas desde tu hook de audio
  function onAudioFrame(frame: Float32Array) {
    pcmRef.current.push(frame);

    const now = Date.now();

    // Procesar cada 1000 ms aprox
    if (now - lastProcess.current >= 1000) {
      lastProcess.current = now;
      processAudio();
    }
  }

  async function processAudio() {
    if (!ready) return;
    if (pcmRef.current.length === 0) return;

    const pcm = concatFloat32Arrays(pcmRef.current);
    pcmRef.current = [];

    if (checkSilence(pcm)) return;

    const text = (await transcribe(pcm, 16000, { language: lang }))
      .trim()
      .toLowerCase();
    if (!text) return;

    const n = parseNumberMultilang(text, lang);
    if (n != null) {
      onNumber(n);
    }
  }

  return { onAudioFrame };
}

// Helpers dentro del mismo archivo 🔽

function concatFloat32Arrays(chunks: Float32Array[]): Float32Array {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Float32Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

function checkSilence(pcm: Float32Array) {
  if (pcm.length === 0) return true;
  let energy = 0;
  for (let i = 0; i < pcm.length; i++) {
    energy += pcm[i] * pcm[i];
  }
  energy /= pcm.length;
  // Umbral a ajustar según ruido real
  return energy < 0.00015;
}
