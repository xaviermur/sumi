import { useRef } from "react";
import { useWhisperAudioStream } from "./useWhisperAudioStream";
import { useWhisper } from "../speech/WhisperProvider";
import { parseNumberMultilang } from "../utils/parseNumberMultilang";
import type { GameLanguage } from "@/core/types/game";

type UseSpokenNumberOptions = {
  lang: GameLanguage;
  onNumber: (n: number) => void;   // aquí conectas con tu lógica del juego
};

export function useSpokenNumber({ lang, onNumber }: UseSpokenNumberOptions) {
  const { transcribe, ready } = useWhisper();
  const pcmBufferRef = useRef<Float32Array[]>([]);

  useWhisperAudioStream({
    onFrame: (frame) => {
      pcmBufferRef.current.push(frame);
    },
  });

  async function transcribeNow() {
    if (!ready) return;

    // Junta todos los frames en un único Float32Array
    const all = concatFloat32Arrays(pcmBufferRef.current);
    pcmBufferRef.current = [];

    const text = await transcribe(all, 16000, { language: lang });
    const normalized = text?.toLowerCase().trim() ?? "";
    const n = parseNumberMultilang(normalized, lang);
    if (n != null) {
      onNumber(n);
    }
  }

  return { transcribeNow };
}

function concatFloat32Arrays(chunks: Float32Array[]): Float32Array {
  const totalLen = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Float32Array(totalLen);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}
