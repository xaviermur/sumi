import { useRef } from "react";
import { useWhisperAudioStream } from "./useWhisperAudioStream";
import { useWhisperCtx } from "../speech/WhisperProvider";
import { parseNumberMultilang } from "../utils/parseNumberMultilang";

type UseSpokenNumberOptions = {
  lang: "es" | "ca" | "en" | "fr";
  onNumber: (n: number) => void;   // aquí conectas con tu lógica del juego
};

export function useSpokenNumber({ lang, onNumber }: UseSpokenNumberOptions) {
  const { whisper } = useWhisperCtx();
  const pcmBufferRef = useRef<Float32Array[]>([]);

  useWhisperAudioStream({
    onFrame: (frame) => {
      pcmBufferRef.current.push(frame);
    },
  });

  async function transcribeNow() {
    if (!whisper) return;

    // Junta todos los frames en un único Float32Array
    const all = concatFloat32Arrays(pcmBufferRef.current);
    pcmBufferRef.current = [];

    // Transcribe desde datos en memoria (modo sencillo: archivo temporal → transcribe)
    const options = { language: lang };
    const { stop, promise } = whisper.transcribeData(all, 16000, options);
    const { result } = await promise;
    stop?.();

    const text = result?.text?.toLowerCase().trim() ?? "";
    const n = parseNumberMultilang(text, lang);
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
