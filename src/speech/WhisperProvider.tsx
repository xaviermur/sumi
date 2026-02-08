import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Platform } from "react-native";
import { pipeline, env, Pipeline } from "@xenova/transformers";
import type { GameLanguage } from "@/core/types/game";

type TranscribeFn = (
  audio: Float32Array,
  sampleRate: number,
  opts?: { language?: GameLanguage }
) => Promise<string>;

interface WhisperContextValue {
  ready: boolean;
  transcribe: TranscribeFn;
}

const WhisperCtx = createContext<WhisperContextValue>({
  ready: false,
  // fallback muy simple
  transcribe: async () => "",
});

export function WhisperProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const pipelineRef = useRef<Pipeline | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    let cancelled = false;

    async function load() {
      try {
        // Ajustes recomendables para RN
        env.allowLocalModels = false;
        env.useBrowserCache = false;
        env.useFSCache = false;
        env.useFS = false;

        // Modelo pequeñito -> arranque más rápido
        const asr = await pipeline(
          "automatic-speech-recognition",
          "Xenova/whisper-tiny"
        );

        if (cancelled) return;

        pipelineRef.current = asr;
        setReady(true);
        console.log("✅ Whisper tiny cargado");
      } catch (err) {
        console.error("❌ Error cargando Whisper:", err);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const transcribe = useCallback<TranscribeFn>(
    async (audio, sampleRate, opts) => {
      if (!pipelineRef.current) {
        throw new Error("Whisper aún no está listo");
      }

      const lang = opts?.language ?? "es";

      const result: any = await pipelineRef.current(audio, {
        sampling_rate: sampleRate,
        language: lang,
        return_timestamps: false,
        chunk_length_s: 25,
      });

      return (result?.text ?? "").toString();
    },
    []
  );

  return (
    <WhisperCtx.Provider value={{ ready, transcribe }}>
      {children}
    </WhisperCtx.Provider>
  );
}

export function useWhisper() {
  return useContext(WhisperCtx);
}
